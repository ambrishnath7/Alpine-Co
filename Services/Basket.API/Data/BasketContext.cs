using Microsoft.EntityFrameworkCore;
using Basket.API.Entities;

namespace Basket.API.Data;

public class BasketContext(DbContextOptions options) : DbContext(options)
{
    public required DbSet<Entities.Basket> Baskets { get; set; }
    public required DbSet<BasketItem> BasketItems { get; set; }
}
