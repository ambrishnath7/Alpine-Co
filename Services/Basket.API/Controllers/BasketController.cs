using Basket.API.Data;
using Basket.API.DTOs;
using Basket.API.Entities;
using Basket.API.Extensions;
using Basket.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Basket.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BasketController(
    BasketContext context,
    IHttpClientFactory httpClientFactory,
    IConfiguration config,
    PaymentsService paymentsService) : ControllerBase
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
            // Catalog unreachable; handled below
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

        var intent = await paymentsService.CreateOrUpdatePaymentIntent(basket);

        if (intent == null)
            return BadRequest("Problem creating payment intent");

        basket.PaymentIntentId ??= intent.Id;
        basket.ClientSecret ??= intent.ClientSecret;

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

        if (basket.Items.Count > 0)
        {
            var intent = await paymentsService.CreateOrUpdatePaymentIntent(basket);

            if (intent == null)
                return BadRequest("Problem updating payment intent");

            basket.PaymentIntentId ??= intent.Id;
            basket.ClientSecret ??= intent.ClientSecret;
        }

        var result = await context.SaveChangesAsync() > 0;

        if (result) return Ok();

        return BadRequest("Problem removing item from the basket");
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