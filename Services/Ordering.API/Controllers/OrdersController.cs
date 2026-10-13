using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ordering.API.Data;
using Ordering.API.DTOs;
using Ordering.API.Entities.OrderAggregate;

namespace Ordering.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController(OrderContext context) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<OrderDto>>> GetOrders()
    {
        var email = User.Identity?.Name ?? "bob@test.com";

        var orders = await context.Orders
            .Where(x => x.BuyerEmail == email)
            .Include(x => x.OrderItems)
            .Select(o => new OrderDto
            {
                Id = o.Id,
                BuyerEmail = o.BuyerEmail,
                ShippingAddress = o.ShippingAddress,
                OrderDate = o.OrderDate,
                Subtotal = o.Subtotal,
                DeliveryFee = o.DeliveryFee,
                Discount = o.Discount,
                Total = o.GetTotal(),
                OrderStatus = o.OrderStatus.ToString(),
                PaymentSummary = o.PaymentSummary,
                OrderItems = o.OrderItems.Select(i => new OrderItemDto
                {
                    ProductId = i.ItemOrdered.ProductId,
                    Name = i.ItemOrdered.Name,
                    PictureUrl = i.ItemOrdered.PictureUrl,
                    Price = i.Price,
                    Quantity = i.Quantity
                }).ToList()
            })
            .ToListAsync();

        return Ok(orders);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<OrderDto>> GetOrder(int id)
    {
        var email = User.Identity?.Name ?? "bob@test.com";

        var order = await context.Orders
            .Where(x => x.Id == id && x.BuyerEmail == email)
            .Include(x => x.OrderItems)
            .Select(o => new OrderDto
            {
                Id = o.Id,
                BuyerEmail = o.BuyerEmail,
                ShippingAddress = o.ShippingAddress,
                OrderDate = o.OrderDate,
                Subtotal = o.Subtotal,
                DeliveryFee = o.DeliveryFee,
                Discount = o.Discount,
                Total = o.GetTotal(),
                OrderStatus = o.OrderStatus.ToString(),
                PaymentSummary = o.PaymentSummary,
                OrderItems = o.OrderItems.Select(i => new OrderItemDto
                {
                    ProductId = i.ItemOrdered.ProductId,
                    Name = i.ItemOrdered.Name,
                    PictureUrl = i.ItemOrdered.PictureUrl,
                    Price = i.Price,
                    Quantity = i.Quantity
                }).ToList()
            })
            .FirstOrDefaultAsync();

        if (order == null) return NotFound();

        return Ok(order);
    }
}
