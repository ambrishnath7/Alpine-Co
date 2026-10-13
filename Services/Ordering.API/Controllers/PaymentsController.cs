using Microsoft.AspNetCore.Mvc;
using Ordering.API.DTOs;
using Stripe;

namespace Ordering.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController(IConfiguration config, IHttpClientFactory httpClientFactory) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult> CreateOrUpdatePaymentIntent()
    {
        var secretKey = config["StripeSettings:SecretKey"];
        var isRealStripe = !string.IsNullOrEmpty(secretKey) && secretKey.StartsWith("sk_");

        long amount = 5000;

        try
        {
            var client = httpClientFactory.CreateClient();
            var basketUrl = config["BasketUrl"] ?? "http://localhost:5002";
            if (Request.Headers.TryGetValue("Cookie", out var cookie))
            {
                client.DefaultRequestHeaders.Add("Cookie", (string?)cookie);
                var basket = await client.GetFromJsonAsync<BasketDto>($"{basketUrl}/api/basket");
                if (basket != null && basket.Items.Count > 0)
                {
                    amount = basket.Items.Sum(i => i.Price * i.Quantity);
                    if (amount < 10000) amount += 500;
                    if (basket.Coupon != null && basket.Coupon.PercentOff.HasValue)
                    {
                        amount -= (amount * (long)basket.Coupon.PercentOff.Value / 100);
                    }
                }
            }
        }
        catch
        {
            // Fallback to default amount
        }

        if (isRealStripe)
        {
            StripeConfiguration.ApiKey = secretKey;
            var service = new PaymentIntentService();
            var intent = await service.CreateAsync(new PaymentIntentCreateOptions
            {
                Amount = amount,
                Currency = "usd",
                AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions { Enabled = true }
            });

            return Ok(new
            {
                clientSecret = intent.ClientSecret,
                paymentIntentId = intent.Id
            });
        }

        return Ok(new
        {
            clientSecret = "pi_mock_secret_" + Guid.NewGuid().ToString("N"),
            paymentIntentId = "pi_mock_" + Guid.NewGuid().ToString("N")
        });
    }
}
