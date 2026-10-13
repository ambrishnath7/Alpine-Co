using Basket.API.DTOs;
using Basket.API.Entities;

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
            Coupon = basket.Coupon != null ? new AppCouponDto
            {
                Name = basket.Coupon.Name,
                AmountOff = basket.Coupon.AmountOff,
                PercentOff = basket.Coupon.PercentOff,
                PromotionCode = basket.Coupon.PromotionCode,
                CouponId = basket.Coupon.CouponId
            } : null,
            Items = basket.Items.Select(x => new BasketItemDto
            {
                ProductId = x.ProductId,
                Name = x.Name,
                Price = x.Price,
                PictureUrl = x.PictureUrl,
                Brand = x.Brand,
                Type = x.Type,
                Quantity = x.Quantity
            }).ToList()
        };
    }
}
