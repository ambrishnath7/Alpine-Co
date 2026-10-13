using Basket.API.Data;
using Basket.API.DTOs;
using Basket.API.Entities;
using Basket.API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Basket.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BasketController(
    BasketContext context,
    IHttpClientFactory httpClientFactory,
    IConfiguration config) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<BasketDto>> GetBasket()
    {
        var basket = await RetrieveBasket();

        if (basket == null) return NoContent();

        return basket.ToDto();
    }

    [HttpPost]
    public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
    {
        var basket = await RetrieveBasket() ?? CreateBasket();

        var client = httpClientFactory.CreateClient("CatalogClient");
        var catalogUrl = config["CatalogUrl"] ?? "http://localhost:5001";

        CatalogProductDto? product = null;
        try
        {
            product = await client.GetFromJsonAsync<CatalogProductDto>($"{catalogUrl}/api/products/{productId}");
        }
        catch
        {
            // fallback if catalog service network error
        }

        if (product == null)
        {
            return BadRequest("Problem adding item to basket - product not found");
        }

        basket.AddItem(
            product.Id,
            product.Name,
            product.Price,
            product.PictureUrl,
            product.Brand,
            product.Type,
            quantity
        );

        var result = await context.SaveChangesAsync() > 0;

        if (result)
            return CreatedAtAction(nameof(GetBasket), basket.ToDto());

        return BadRequest("Problem updating basket");
    }

    [HttpDelete]
    public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
    {
        var basket = await RetrieveBasket();

        if (basket == null)
            return BadRequest("Unable to retrieve basket");

        basket.RemoveItem(productId, quantity);

        var result = await context.SaveChangesAsync() > 0;

        if (result) return Ok();

        return BadRequest("Problem removing item from the basket");
    }

    [HttpPost("coupon")]
    public async Task<ActionResult<BasketDto>> AddCoupon([FromQuery] string code)
    {
        var basket = await RetrieveBasket();

        if (basket == null) return BadRequest("Unable to retrieve basket");

        // Simple discount coupon logic: 10% off for "DISCOUNT10", etc.
        basket.Coupon = new AppCoupon
        {
            Name = code.ToUpper(),
            PercentOff = 10,
            PromotionCode = code.ToUpper(),
            CouponId = Guid.NewGuid().ToString()
        };

        await context.SaveChangesAsync();

        return basket.ToDto();
    }

    [HttpDelete("coupon")]
    public async Task<ActionResult<BasketDto>> RemoveCoupon()
    {
        var basket = await RetrieveBasket();

        if (basket == null) return BadRequest("Unable to retrieve basket");

        basket.Coupon = null;

        await context.SaveChangesAsync();

        return basket.ToDto();
    }

    private async Task<Entities.Basket?> RetrieveBasket()
    {
        var basketId = Request.Cookies["basketId"];

        if (string.IsNullOrEmpty(basketId)) return null;

        return await context.Baskets
            .Include(x => x.Items)
            .FirstOrDefaultAsync(x => x.BasketId == basketId);
    }

    private Entities.Basket CreateBasket()
    {
        var basketId = Guid.NewGuid().ToString();

        var cookieOptions = new CookieOptions
        {
            IsEssential = true,
            Expires = DateTime.UtcNow.AddDays(30),
            SameSite = SameSiteMode.Lax,
            Secure = false
        };

        Response.Cookies.Append("basketId", basketId, cookieOptions);

        var basket = new Entities.Basket
        {
            BasketId = basketId
        };

        context.Baskets.Add(basket);

        return basket;
    }
}
