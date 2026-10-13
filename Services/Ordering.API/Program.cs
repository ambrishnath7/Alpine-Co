using Microsoft.EntityFrameworkCore;
using Ordering.API.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddHttpClient();

builder.Services.AddDbContext<OrderContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
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
    var context = scope.ServiceProvider.GetRequiredService<OrderContext>();
    context.Database.EnsureCreated();
}

app.Run();
