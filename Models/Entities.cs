using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FirstPharmar.Models
{
    public class Product
    {
        public int Id { get; set; }
        
        [Required]
        public string Name { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        public string? Barcode { get; set; }
        public string? ProductCode { get; set; }
        public string? BatchNumber { get; set; }
        
        public int CategoryId { get; set; }
        public Category? Category { get; set; }
        
        public string Unit { get; set; } = "Piece";
        public int PiecesPerUnit { get; set; } = 1;
        public string? UnitDescription { get; set; }

        public decimal PurchasePrice { get; set; }
        public decimal SalePrice { get; set; }
        public decimal WholesalePrice { get; set; }
        
        public int StockQuantity { get; set; }
        public int MinimumStockLevel { get; set; } = 5;
        
        public DateTime? ExpiryDate { get; set; }
        public string? PrescriptionInfo { get; set; }
        public bool RequiresPrescription { get; set; }
        public bool IsActive { get; set; } = true;
        public string? ImagePath { get; set; }
        
        // JSON storage for sub-unit prices (e.g. {"Strip": 5000, "Tablet": 500})
        public string? UnitPricesJson { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }

    public class Category
    {
        public int Id { get; set; }
        
        [Required]
        public string Name { get; set; } = string.Empty;
        
        public List<Product> Products { get; set; } = new();
    }

    public class Sale
    {
        public int Id { get; set; }
        
        public DateTime SaleDate { get; set; } = DateTime.Now;
        
        public decimal TotalAmount { get; set; }
        
        public decimal Discount { get; set; }
        
        public string? CustomerName { get; set; }
        
        public string PaymentMethod { get; set; } = "Cash"; // Cash, Mobile Money, Credit
        
        public int? CustomerId { get; set; }
        
        public List<SaleItem> Items { get; set; } = new();
    }

    public class SaleItem
    {
        public int Id { get; set; }
        
        public int SaleId { get; set; }
        public Sale? Sale { get; set; }
        
        public int ProductId { get; set; }
        public Product? Product { get; set; }
        
        public int Quantity { get; set; }
        
        public decimal UnitPrice { get; set; }
        
        public decimal Subtotal => Quantity * UnitPrice;
    }

    public class Supplier
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; } = string.Empty;
        public string? ContactPerson { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
        public List<Product> Products { get; set; } = new();
    }

    public class Prescription
    {
        public int Id { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string DoctorName { get; set; } = string.Empty;
        public DateTime DateUploaded { get; set; } = DateTime.Now;
        public string ImagePath { get; set; } = string.Empty; // Local file path
        public string Status { get; set; } = "Pending"; // Pending, Approved, Filled
        public string? Notes { get; set; }
    }
    public class CustomerCredit
    {
        public int Id { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public decimal TotalSpent { get; set; }
        public decimal TotalPaid { get; set; }
        public decimal Balance => TotalSpent - TotalPaid;
        public List<CreditPayment> Payments { get; set; } = new();
    }

    public class CreditPayment
    {
        public int Id { get; set; }
        public int CustomerCreditId { get; set; }
        public DateTime PaymentDate { get; set; } = DateTime.Now;
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } = "Cash";
    }

    public class FinancialReportDto
    {
        public decimal TotalRevenue { get; set; }
        public decimal CashRevenue { get; set; }
        public decimal MobileMoneyRevenue { get; set; }
        public decimal CreditRevenue { get; set; }
        
        public decimal COGS { get; set; }
        public decimal OpEx { get; set; }
        public decimal GrossProfit { get; set; }
        public decimal NetIncome { get; set; }
        
        public decimal CashBalance { get; set; }
        public decimal InventoryValue { get; set; }
        public decimal AccountsReceivable { get; set; }
        public decimal TotalAssets { get; set; }
    }
}
