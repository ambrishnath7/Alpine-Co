using Catalog.API.Data;
using Catalog.API.Entities;
using Catalog.API.Extensions;
using Catalog.API.RequestHelpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Catalog.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(CatalogContext context) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<Product>>> GetProducts([FromQuery] ProductParams productParams)
    {
        var query = context.Products.AsQueryable();

        query = query.Sort(productParams.OrderBy);
        query = query.Search(productParams.SearchTerm);
        query = query.Filter(productParams.Brands, productParams.Types);

        var products = await PagedList<Product>.ToPagedList(
            query,
            productParams.PageNumber,
            productParams.PageSize
        );

        Response.AddPaginationHeader(products.Metadata);

        return products;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await context.Products.FindAsync(id);

        if (product == null) return NotFound();

        return product;
    }

    [HttpGet("filters")]
    public async Task<IActionResult> GetFilters()
    {
        var brands = await context.Products.Select(x => x.Brand).Distinct().ToListAsync();
        var types = await context.Products.Select(x => x.Type).Distinct().ToListAsync();

        return Ok(new { brands, types });
    }
}