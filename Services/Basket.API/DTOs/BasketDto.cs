namespace Basket.API.DTOs;

public class BasketDto
{
    public required string BasketId { get; set; }
    public List<BasketItemDto> Items { get; set; } = [];
    public string? ClientSecret { get; set; }
    public string? PaymentIntentId { get; set; }
    public AppCouponDto? Coupon { get; set; }
}

public class BasketItemDto
{
    public int ProductId { get; set; }
    public required string Name { get; set; }
    public long Price { get; set; }
    public required string PictureUrl { get; set; }
    public required string Brand { get; set; }
    public required string Type { get; set; }
    public int Quantity { get; set; }
}

public class AppCouponDto
{
    public required string Name { get; set; }
    public decimal? AmountOff { get; set; }
    public decimal? PercentOff { get; set; }
    public required string PromotionCode { get; set; }
    public required string CouponId { get; set; }
}

public class CatalogProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public long Price { get; set; }
    public string PictureUrl { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
}
