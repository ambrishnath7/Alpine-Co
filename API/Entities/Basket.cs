using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

public class Basket
{
    public int Id { get; set; }
    public required string BasketId { get; set; }
    public List<BasketItem> Items { get; set; } = [];

    public string? ClientSecret { get; set; }
    public string? PaymentIntentId { get; set; }

    public void AddItem(Product product, int quantity)
    {
        ArgumentNullException.ThrowIfNull(product);

        if (quantity <= 0)
        {
            throw new ArgumentException("Quantity should be greater than zero", nameof(quantity));
        }

        var existingItem = FindItem(product.Id);

        if (existingItem == null)
        {
            Items.Add(new BasketItem { Product = product, ProductId = product.Id, Quantity = quantity });
        }
        else
        {
            existingItem.Quantity += quantity;
        }
    }

    public void RemoveItem(int productId, int quantity)
    {
        if (quantity <= 0)
        {
            throw new ArgumentException("Quantity should be greater than zero", nameof(quantity));
        }

        var item = FindItem(productId);

        if (item == null) return;

        item.Quantity -= quantity;

        if (item.Quantity <= 0)
        {
            Items.Remove(item);
        }
    }

    private BasketItem? FindItem(int productId)
    {
        return Items.FirstOrDefault(item => item.ProductId == productId);
    }
}

[Table("BasketItems")]
public class BasketItem
{
    public int Id { get; set; }
    public int Quantity { get; set; }
    public int ProductId { get; set; }
    public required Product Product { get; set; }
    public int BasketId { get; set; }
    public Basket Basket { get; set; } = null!;
}