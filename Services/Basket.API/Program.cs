using Basket.API.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<BasketContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddHttpClient("CatalogClient", client =>
{
    client.BaseAddress = new Uri(builder.Configuration["CatalogUrl"] ?? "http://localhost:5001");
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .WithOrigins("http://localhost:3000", "https://localhost:3000", "http://localhost:5000");
    });
});

var app = builder.Build();

app.UseCors("CorsPolicy");

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<BasketContext>();
    context.Database.EnsureCreated();
}

app.Run();
