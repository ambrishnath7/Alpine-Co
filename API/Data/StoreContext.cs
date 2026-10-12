using System;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using API.Entities.OrderAggregate;

namespace API.Data;

public class StoreContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
    public required DbSet<Product> Products { get; set; }
    public required DbSet<Basket> Baskets { get; set; }

    public required DbSet<Order> Orders { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<IdentityRole>().HasData(
            new IdentityRole
            {
                Id = "a3f1c2d4-5b6e-4f7a-8c9d-0e1f2a3b4c5d",
                Name = "Member",
                NormalizedName = "MEMBER",
                ConcurrencyStamp = "a3f1c2d4-5b6e-4f7a-8c9d-0e1f2a3b4c5d"
            },
            new IdentityRole
            {
                Id = "b4e2d3c5-6f7a-4b8c-9d0e-1f2a3b4c5d6e",
                Name = "Admin",
                NormalizedName = "ADMIN",
                ConcurrencyStamp = "b4e2d3c5-6f7a-4b8c-9d0e-1f2a3b4c5d6e"
            }
        );
    }
}   