var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(c => { c.SwaggerEndpoint("/openapi/v1.json", "v1"); });
}

app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
    {
        var forecast = Enumerable.Range(1, 5).Select(index =>
                new WeatherForecast
                (
                    DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                    Random.Shared.Next(-20, 55),
                    summaries[Random.Shared.Next(summaries.Length)]
                ))
            .ToArray();
        return forecast;
    })
    .WithName("GetWeatherForecast");

// In-memory store for deals
var deals = new List<Deal>();
var nextDealId = 1;

app.MapGet("/deals", () => deals)
    .WithName("GetDeals");

app.MapPost("/deals", (DealInput input) =>
{
    var deal = new Deal(nextDealId++, input.Name, input.Amount);
    deals.Add(deal);
    return Results.Created($"/deals/{deal.Id}", deal);
}).WithName("AddDeal");

app.MapPut("/deals/{id:int}", (int id, DealInput input) =>
{
    var deal = deals.FirstOrDefault(d => d.Id == id);
    if (deal == null) return Results.NotFound();
    deal.Name = input.Name;
    deal.Amount = input.Amount;
    return Results.Ok(deal);
}).WithName("UpdateDeal");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

record Deal(int Id, string Name, decimal Amount)
{
    public int Id { get; set; } = Id;
    public string Name { get; set; } = Name;
    public decimal Amount { get; set; } = Amount;
}

record DealInput(string Name, decimal Amount);
