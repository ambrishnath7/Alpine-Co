namespace Basket.API.Entities;

public class Basket
{
    public int Id { get; set; }
    public required string BasketId { get; set; }
    public List<BasketItem> Items { get; set; } = [];
    public string? ClientSecret { get; set; }
    public string? PaymentIntentId { get; set; }
    public AppCoupon? Coupon { get; set; }

    public void AddItem(int productId, string name, long price, string pictureUrl, string brand, string type, int quantity)
    {
        var existing = Items.FirstOrDefault(i => i.ProductId == productId);
        if (existing == null)
        {
            Items.Add(new BasketItem
            {
                ProductId = productId,
                Name = name,
                Price = price,
                PictureUrl = pictureUrl,
                Brand = brand,
                Type = type,
                Quantity = quantity
            });
        }
        else
        {
            existing.Quantity += quantity;
        }
    }

    public void RemoveItem(int productId, int quantity)
    {
        var item = Items.FirstOrDefault(i => i.ProductId == productId);
        if (item == null) return;

        item.Quantity -= quantity;
        if (item.Quantity <= 0)
        {
            Items.Remove(item);
        }
    }
}
