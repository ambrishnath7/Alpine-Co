namespace Basket.API.Entities;

public class BasketItem
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public required string Name { get; set; }
    public long Price { get; set; }
    public required string PictureUrl { get; set; }
    public required string Brand { get; set; }
    public required string Type { get; set; }
    public int Quantity { get; set; }
    public int BasketId { get; set; }
    public Basket Basket { get; set; } = null!;
}
