using Stripe;

namespace Basket.API.Services;

public class PaymentsService(IConfiguration config)
{
    public async Task<PaymentIntent?> CreateOrUpdatePaymentIntent(Entities.Basket basket)
    {
        StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];

        var service = new PaymentIntentService();

        var subtotal = basket.Items.Sum(x => x.Quantity * x.Price);
        var deliveryFee = subtotal > 10000 ? 0 : 500;

        if (string.IsNullOrEmpty(basket.PaymentIntentId))
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = subtotal + deliveryFee,
                Currency = "usd",
                AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
                {
                    Enabled = true
                }
            };

            return await service.CreateAsync(options);
        }

        var updateOptions = new PaymentIntentUpdateOptions
        {
            Amount = subtotal + deliveryFee
        };

        return await service.UpdateAsync(basket.PaymentIntentId, updateOptions);
    }
}