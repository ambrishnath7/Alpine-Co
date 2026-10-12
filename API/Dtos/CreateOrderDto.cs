using API.Entities.OrderAggregate;

namespace API.Dtos;

public class CreateOrderDto
{
    public required ShippingAddress ShippingAddress { get; set; }

    public required PaymentSummary PaymentSummary { get; set; }
}