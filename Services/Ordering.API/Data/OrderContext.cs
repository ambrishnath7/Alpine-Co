using Microsoft.EntityFrameworkCore;
using Ordering.API.Entities.OrderAggregate;

namespace Ordering.API.Data;

public class OrderContext(DbContextOptions options) : DbContext(options)
{
    public required DbSet<Order> Orders { get; set; }
}
