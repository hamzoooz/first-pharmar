using System.Windows;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Components.WebView.Wpf;
using FirstPharmar.Data;
using FirstPharmar.Services;

namespace FirstPharmar;

public partial class MainWindow : Window
{
    public MainWindow()
    {
        var serviceCollection = new ServiceCollection();
        serviceCollection.AddWpfBlazorWebView();
        serviceCollection.AddBlazorWebViewDeveloperTools();
        
        serviceCollection.AddDbContext<PharmacyDbContext>();
        serviceCollection.AddScoped<IPharmacyService, PharmacyService>();
        serviceCollection.AddSingleton<ShortcutService>();
        var serviceProvider = serviceCollection.BuildServiceProvider();
        Resources.Add("services", serviceProvider);

        using (var scope = serviceProvider.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<PharmacyDbContext>();
            db.Database.EnsureCreated();
        }

        InitializeComponent();
    }
}