using System.Collections.Concurrent;
using Basket.API.Entities;

namespace Basket.API.Services;

public interface IBasketRepository
{
    Task<CustomerBasket?> GetBasketAsync(string buyerId);
    Task<CustomerBasket> UpdateBasketAsync(CustomerBasket basket);
    Task<bool> DeleteBasketAsync(string buyerId);
}

public class InMemoryBasketRepository : IBasketRepository
{
    private readonly ConcurrentDictionary<string, CustomerBasket> _baskets = new();

    public Task<CustomerBasket?> GetBasketAsync(string buyerId)
    {
        _baskets.TryGetValue(buyerId, out var basket);
        return Task.FromResult(basket);
    }

    public Task<CustomerBasket> UpdateBasketAsync(CustomerBasket basket)
    {
        _baskets[basket.BuyerId] = basket;
        return Task.FromResult(basket);
    }

    public Task<bool> DeleteBasketAsync(string buyerId)
    {
        return Task.FromResult(_baskets.TryRemove(buyerId, out _));
    }
}
