using API.Data;
using API.Entities.OrderAggregate;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController(
    IConfiguration config,
    ILogger<PaymentsController> logger,
    StoreContext context) : BaseApiController
{
    [HttpPost("webhook")]
    public async Task<IActionResult> StripeWebhook()
    {
        var json = await new StreamReader(Request.Body).ReadToEndAsync();

        try
        {
            var stripeEvent = ConstructStripeEvent(json);

            if (stripeEvent.Data.Object is not PaymentIntent intent)
            {
                return BadRequest("Invalid event data");
            }

            if (intent.Status == "succeeded")
            {
                await HandlePaymentIntentSucceeded(intent);
            }
            else
            {
                await HandlePaymentIntentFailed(intent);
            }

            return Ok();
        }
        catch (StripeException x)
        {
            logger.LogError(x, "Stripe webhook error");

            return StatusCode(
                StatusCodes.Status500InternalServerError,
                "Webhook error"
            );
        }
        catch (Exception x)
        {
            logger.LogError(x, "Unexpected error");

            return StatusCode(
                StatusCodes.Status500InternalServerError,
                "Unexpected error"
            );
        }
    }

    private Event ConstructStripeEvent(string json)
    {
        try
        {
            return EventUtility.ConstructEvent(
                json,
                Request.Headers["Stripe-Signature"],
                config["StripeSettings:WhSecret"]
            );
        }
        catch (Exception x)
        {
            logger.LogError(x, "Failed to construct Stripe event");
            throw new StripeException("Invalid signature");
        }
    }

    private async Task HandlePaymentIntentFailed(PaymentIntent intent)
    {
        var order = await context.Orders
            .Include(x => x.OrderItems)
            .FirstOrDefaultAsync(x => x.PaymentIntentId == intent.Id)
            ?? throw new Exception("Order not found");

        foreach (var item in order.OrderItems)
        {
            var productItem = await context.Products
                .FindAsync(item.ItemOrdered.ProductId)
                ?? throw new Exception("Problem updating order stock");

            productItem.QuantityInStock += item.Quantity;
        }

        order.OrderStatus = OrderStatus.PaymentFailed;

        await context.SaveChangesAsync();
    }

    private async Task HandlePaymentIntentSucceeded(PaymentIntent intent)
    {
        var order = await context.Orders
            .Include(x => x.OrderItems)
            .FirstOrDefaultAsync(x => x.PaymentIntentId == intent.Id)
            ?? throw new Exception("Order not found");

        if (order.GetTotal() != intent.Amount)
        {
            order.OrderStatus = OrderStatus.PaymentMismatch;
        }
        else
        {
            order.OrderStatus = OrderStatus.PaymentReceived;
        }

        var basket = await context.Baskets
            .FirstOrDefaultAsync(x => x.PaymentIntentId == intent.Id);

        if (basket != null)
        {
            context.Baskets.Remove(basket);
        }

        await context.SaveChangesAsync();
    }
}