var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .WithExposedHeaders("Pagination")
              .WithOrigins("http://localhost:3000", "https://localhost:3000", "http://localhost:5173");
    });
});

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

var app = builder.Build();

app.UseCors("CorsPolicy");

app.MapGet("/", () => "API Gateway is running!");

app.MapReverseProxy();

app.Run();