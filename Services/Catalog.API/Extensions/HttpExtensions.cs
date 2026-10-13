using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Catalog.API.RequestHelpers;

namespace Catalog.API.Extensions;

public static class HttpExtensions
{
    public static void AddPaginationHeader(this HttpResponse response, PaginationMetadata metadata)
    {
        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        response.Headers.Append("Pagination", JsonSerializer.Serialize(metadata, options));
        response.Headers.Append("Access-Control-Expose-Headers", "Pagination");
    }
}