using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Identity.API.Entities;

namespace Identity.API.Data;

public class DbInitializer
{
    public static async Task InitDb(WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        var context = scope.ServiceProvider.GetRequiredService<IdentityContext>()
            ?? throw new InvalidOperationException("Failed to retrieve identity context");

        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

        await SeedData(context, userManager);
    }

    private static async Task SeedData(IdentityContext context, UserManager<User> userManager)
    {
        context.Database.EnsureCreated();

        if (!userManager.Users.Any())
        {
            var user = new User
            {
                UserName = "bob@test.com",
                Email = "bob@test.com"
            };

            await userManager.CreateAsync(user, "Pa$$w0rd");
            await userManager.AddToRoleAsync(user, "Member");

            var admin = new User
            {
                UserName = "admin@test.com",
                Email = "admin@test.com"
            };

            await userManager.CreateAsync(admin, "Pa$$w0rd");
            await userManager.AddToRolesAsync(admin, new[] { "Member", "Admin" });
        }
    }
}
