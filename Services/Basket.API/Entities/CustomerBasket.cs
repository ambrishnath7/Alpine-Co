namespace Basket.API.Entities;

public class CustomerBasket
{
    public string BuyerId { get; set; } = string.Empty;
    public List<BasketItem> Items { get; set; } = [];
    public AppCoupon? Coupon { get; set; }
    public string? ClientSecret { get; set; }
    public string? PaymentIntentId { get; set; }

    public CustomerBasket() { }

    public CustomerBasket(string buyerId)
    {
        BuyerId = buyerId;
    }
}
