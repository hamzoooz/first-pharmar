using Microsoft.EntityFrameworkCore;
using FirstPharmar.Data;
using FirstPharmar.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace FirstPharmar.Services
{
    public interface IPharmacyService
    {
        Task<List<Product>> GetProductsAsync();
        Task<Product?> GetProductByIdAsync(int id);
        Task<int> SaveProductAsync(Product product);
        Task DeleteProductAsync(int id);
        
        Task<List<Category>> GetCategoriesAsync();
        
        Task<int> ProcessSaleAsync(Sale sale);
        Task<List<Sale>> GetSalesAsync();
        
        Task<List<Supplier>> GetSuppliersAsync();
        Task<int> SaveSupplierAsync(Supplier supplier);
        
        Task<List<Prescription>> GetPrescriptionsAsync();
        Task<int> SavePrescriptionAsync(Prescription prescription);

        Task<DashboardStats> GetDashboardStatsAsync();
        
        Task<FinancialReportDto> GetFinancialReportAsync(DateTime from, DateTime to);
        Task<List<CustomerCredit>> GetCustomerCreditsAsync();
        Task<int> SaveCreditPaymentAsync(CreditPayment payment);
    }

    public class DashboardStats
    {
        public int TotalProducts { get; set; }
        public int LowStockCount { get; set; }
        public int OutOfStockCount { get; set; }
        public decimal DailySales { get; set; }
        public int ExpiringSoonCount { get; set; }
    }

    public class PharmacyService : IPharmacyService
    {
        private readonly PharmacyDbContext _db;

        public PharmacyService(PharmacyDbContext db)
        {
            _db = db;
            _db.Database.EnsureCreated();
        }

        public async Task<List<Product>> GetProductsAsync()
        {
            return await _db.Products.Include(p => p.Category).ToListAsync();
        }

        public async Task<Product?> GetProductByIdAsync(int id)
        {
            return await _db.Products.FindAsync(id);
        }

        public async Task<int> SaveProductAsync(Product product)
        {
            if (product.Id == 0)
                _db.Products.Add(product);
            else
                _db.Products.Update(product);

            return await _db.SaveChangesAsync();
        }

        public async Task DeleteProductAsync(int id)
        {
            var product = await _db.Products.FindAsync(id);
            if (product != null)
            {
                _db.Products.Remove(product);
                await _db.SaveChangesAsync();
            }
        }

        public async Task<List<Category>> GetCategoriesAsync()
        {
            return await _db.Categories.ToListAsync();
        }

        public async Task<int> ProcessSaleAsync(Sale sale)
        {
            // Reduce stock
            foreach (var item in sale.Items)
            {
                var product = await _db.Products.FindAsync(item.ProductId);
                if (product != null)
                {
                    product.StockQuantity -= item.Quantity;
                }
            }

            _db.Sales.Add(sale);

            // Handle Credit Sale
            if (sale.PaymentMethod == "Credit")
            {
                var credit = await _db.CustomerCredits.FirstOrDefaultAsync(c => c.CustomerName == sale.CustomerName);
                if (credit == null)
                {
                    credit = new CustomerCredit { CustomerName = sale.CustomerName ?? "Unknown", TotalSpent = sale.TotalAmount };
                    _db.CustomerCredits.Add(credit);
                }
                else
                {
                    credit.TotalSpent += sale.TotalAmount;
                }
            }

            return await _db.SaveChangesAsync();
        }

        public async Task<List<Sale>> GetSalesAsync()
        {
            return await _db.Sales.Include(s => s.Items).OrderByDescending(s => s.SaleDate).ToListAsync();
        }

        public async Task<List<Supplier>> GetSuppliersAsync()
        {
            return await _db.Suppliers.ToListAsync();
        }

        public async Task<int> SaveSupplierAsync(Supplier supplier)
        {
            if (supplier.Id == 0) _db.Suppliers.Add(supplier);
            else _db.Suppliers.Update(supplier);
            return await _db.SaveChangesAsync();
        }

        public async Task<List<Prescription>> GetPrescriptionsAsync()
        {
            return await _db.Prescriptions.OrderByDescending(p => p.DateUploaded).ToListAsync();
        }

        public async Task<int> SavePrescriptionAsync(Prescription prescription)
        {
            if (prescription.Id == 0) _db.Prescriptions.Add(prescription);
            else _db.Prescriptions.Update(prescription);
            return await _db.SaveChangesAsync();
        }

        public async Task<DashboardStats> GetDashboardStatsAsync()
        {
            var today = DateTime.Today;
            var soon = DateTime.Today.AddDays(30);

            return new DashboardStats
            {
                TotalProducts = await _db.Products.CountAsync(),
                LowStockCount = await _db.Products.CountAsync(p => p.StockQuantity > 0 && p.StockQuantity <= p.MinimumStockLevel),
                OutOfStockCount = await _db.Products.CountAsync(p => p.StockQuantity <= 0),
                DailySales = (await _db.Sales.Where(s => s.SaleDate >= today).ToListAsync()).Sum(s => s.TotalAmount),
                ExpiringSoonCount = await _db.Products.CountAsync(p => p.ExpiryDate.HasValue && p.ExpiryDate <= soon)
            };
        }

        public async Task<FinancialReportDto> GetFinancialReportAsync(DateTime from, DateTime to)
        {
            var sales = await _db.Sales.Where(s => s.SaleDate >= from && s.SaleDate <= to).ToListAsync();
            
            decimal totalRevenue = sales.Sum(s => s.TotalAmount);
            decimal cogs = totalRevenue * 0.65m;
            decimal opex = totalRevenue * 0.15m;
            
            var credits = await _db.CustomerCredits.ToListAsync();
            decimal accountsReceivable = credits.Sum(c => c.Balance);
            
            var products = await _db.Products.ToListAsync();
            decimal inventoryValue = products.Sum(p => p.StockQuantity * p.PurchasePrice);

            return new FinancialReportDto
            {
                TotalRevenue = totalRevenue,
                CashRevenue = sales.Where(s => s.PaymentMethod == "Cash").Sum(s => s.TotalAmount),
                MobileMoneyRevenue = sales.Where(s => s.PaymentMethod == "Mobile Money").Sum(s => s.TotalAmount),
                CreditRevenue = sales.Where(s => s.PaymentMethod == "Credit").Sum(s => s.TotalAmount),
                
                COGS = cogs,
                OpEx = opex,
                GrossProfit = totalRevenue - cogs,
                NetIncome = (totalRevenue - cogs) - opex,
                
                AccountsReceivable = accountsReceivable,
                InventoryValue = inventoryValue,
                CashBalance = totalRevenue - accountsReceivable,
                TotalAssets = (totalRevenue - accountsReceivable) + inventoryValue + accountsReceivable
            };
        }

        public async Task<List<CustomerCredit>> GetCustomerCreditsAsync()
        {
            return await _db.CustomerCredits.Include(c => c.Payments).ToListAsync();
        }

        public async Task<int> SaveCreditPaymentAsync(CreditPayment payment)
        {
            var credit = await _db.CustomerCredits.FindAsync(payment.CustomerCreditId);
            if (credit != null)
            {
                credit.TotalPaid += payment.Amount;
                _db.CreditPayments.Add(payment);
                return await _db.SaveChangesAsync();
            }
            return 0;
        }
    }
}
