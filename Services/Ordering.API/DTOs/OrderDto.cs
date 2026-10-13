using Ordering.API.Entities.OrderAggregate;

namespace Ordering.API.DTOs;

public class OrderDto
{
    public int Id { get; set; }
    public required string BuyerEmail { get; set; }
    public required ShippingAddress ShippingAddress { get; set; }
    public DateTime OrderDate { get; set; }
    public List<OrderItemDto> OrderItems { get; set; } = [];
    public long Subtotal { get; set; }
    public long DeliveryFee { get; set; }
    public long Discount { get; set; }
    public long Total { get; set; }
    public string OrderStatus { get; set; } = string.Empty;
    public required PaymentSummary PaymentSummary { get; set; }
}

public class OrderItemDto
{
    public int ProductId { get; set; }
    public required string Name { get; set; }
    public required string PictureUrl { get; set; }
    public long Price { get; set; }
    public int Quantity { get; set; }
}

public class CreateOrderDto
{
    public required ShippingAddress ShippingAddress { get; set; }
    public required PaymentSummary PaymentSummary { get; set; }
}
