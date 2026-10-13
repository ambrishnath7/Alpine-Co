using Microsoft.EntityFrameworkCore;
using Catalog.API.Entities;

namespace Catalog.API.Data;

public class CatalogContext(DbContextOptions options) : DbContext(options)
{
    public required DbSet<Product> Products { get; set; }
}