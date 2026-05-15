using Microsoft.EntityFrameworkCore;
using FirstPharmar.Models;
using System.IO;
using System;

namespace FirstPharmar.Data
{
    public class PharmacyDbContext : DbContext
    {
        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<Category> Categories { get; set; } = null!;
        public DbSet<Sale> Sales { get; set; } = null!;
        public DbSet<SaleItem> SaleItems { get; set; } = null!;
        public DbSet<Supplier> Suppliers { get; set; } = null!;
        public DbSet<Prescription> Prescriptions { get; set; } = null!;
        public DbSet<CustomerCredit> CustomerCredits { get; set; } = null!;
        public DbSet<CreditPayment> CreditPayments { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            string dbPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "pharmacy.db");
            optionsBuilder.UseSqlite($"Data Source={dbPath}");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Tablets" },
                new Category { Id = 2, Name = "Syrups" },
                new Category { Id = 3, Name = "Injections" },
                new Category { Id = 4, Name = "Ointments" },
                new Category { Id = 5, Name = "Supplements" }
            );
        }
    }
}
