using Catalog.API.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<CatalogContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
    opt.ConfigureWarnings(w => w.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .WithExposedHeaders("Pagination")
              .WithOrigins("http://localhost:3000", "https://localhost:3000", "http://localhost:5000");
    });
});

var app = builder.Build();

app.UseCors("CorsPolicy");
app.UseStaticFiles();

app.MapControllers();

DbInitializer.InitDb(app);

app.Run();
