using Basket.API.DTOs;

namespace Basket.API.Extensions;

public static class BasketExtensions
{
    public static BasketDto ToDto(this Entities.Basket basket)
    {
        return new BasketDto
        {
            BasketId = basket.BasketId,
            ClientSecret = basket.ClientSecret,
            PaymentIntentId = basket.PaymentIntentId,
            Items = basket.Items.Select(x => new BasketItemDto
            {
                ProductId = x.ProductId,
                Name = x.Name,
                Price = x.Price,
                PictureUrl = x.PictureUrl,
                Brand = x.Brand,
                Type = x.Type,
                Quantity = x.Quantity
            }).ToList(),
            Coupon = basket.Coupon == null ? null : new AppCouponDto
            {
                Name = basket.Coupon.Name,
                PercentOff = basket.Coupon.PercentOff,
                PromotionCode = basket.Coupon.PromotionCode,
                CouponId = basket.Coupon.CouponId
            }
        };
    }
}