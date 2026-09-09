using Budgetting.Api.Data;
using Budgetting.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularPolicy",
        policy =>
        {
            policy
                .AllowAnyHeader()
                .AllowAnyMethod()
                .WithOrigins(
                    "https://budget.habitsolutions.be"
                );
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    
}

app.UseCors("AngularPolicy");

app.UseHttpsRedirection();

app.MapGet("/api/users", async (AppDbContext db) =>
{
    return await db.Users.ToListAsync();
});

app.MapGet("/api/transactions",
async (AppDbContext db) =>
{
    return await db.Transactions
        .OrderByDescending(x => x.Datum)
        .ToListAsync();
});

app.MapGet("/api/transactions/{userId}",
async (
    Guid userId,
    AppDbContext db
) =>
{
    return await db.Transactions
        .Where(x => x.UserId == userId)
        .OrderByDescending(x => x.Datum)
        .ToListAsync();
});



app.MapPost("/api/auth/login",
    async (
        LoginRequest request,
        AppDbContext db
    ) =>
{
    var user = await db.Users
        .FirstOrDefaultAsync(x =>
            x.Username == request.Username &&
            x.PasswordHash == request.Password);

    if (user is null)
    {
        return Results.Unauthorized();
    }

    return Results.Ok(new
    {
        user.Id,
        user.Username,
        user.FirstName,
        user.LastName,
        user.Email
    });
});

app.MapPost("/api/transactions",
async (
    Transaction transaction,
    AppDbContext db
) =>
{
    transaction.CreatedAt = DateTime.UtcNow;

    db.Transactions.Add(transaction);

    await db.SaveChangesAsync();

    return Results.Ok(transaction);
});

app.MapPost("/api/transactions/import",
async (HttpRequest request, AppDbContext db) =>
{
    try{
    var form = await request.ReadFormAsync();

    var file = form.Files.FirstOrDefault();

    var userId = Guid.Parse(form["userId"].ToString());

    if (file is null)
    {
        return Results.BadRequest("Geen bestand ontvangen.");
    }

    using var reader =
        new StreamReader(file.OpenReadStream());

    var lines = new List<string>();

    while (!reader.EndOfStream)
    {
        lines.Add(
            await reader.ReadLineAsync() ?? ""
        );
    }

    foreach (var line in lines.Skip(1))
    {
        if (string.IsNullOrWhiteSpace(line))
            continue;

        Console.WriteLine("Begin record");
        var values = line.Split(';');

        if (values.Length < 10)
            continue;

        Console.WriteLine("Datum");
        var datum = DateTime.Parse(values[0]);
        
        Console.WriteLine("Rekening");
        var rekening = values[1];

        Console.WriteLine("Categorie");
        var categorie = values[2];

        Console.WriteLine("Bedrag");
        var bedrag = decimal.Parse(values[3].Replace(',', '.'),CultureInfo.InvariantCulture);
        
        Console.WriteLine("Transaction object");

        var transaction = new Transaction
        {
            UserId = userId,

            Datum =
                DateTime.Parse(values[0]),

            Rekening =
                values[1],

            Categorie =
                values[2],

            Bedrag =
                decimal.Parse(
                    values[3].Replace(',', '.'),
                    CultureInfo.InvariantCulture),

            Type =
                values[4],

            Intern =
                values[5].Equals(
                    "TRUE",
                    StringComparison.OrdinalIgnoreCase),

            Project =
                values[6].Equals(
                    "TRUE",
                    StringComparison.OrdinalIgnoreCase),

            Tegenpartij =
                values[7],

            Opmerking =
                values[8],

            CreatedAt =
                DateTime.UtcNow
        };

        Console.WriteLine("Add");

        if (!await db.Transactions
                     .AnyAsync(x =>
                         x.Id == transaction.Id))
        {
            db.Transactions.Add(transaction);
        }
    }

    Console.WriteLine("SaveChanges");
    try{
        await db.SaveChangesAsync();
    }
    catch (Exception ex){
        return Results.BadRequest(ex.ToString());
    }

    Console.WriteLine("Done");
    return Results.Ok();
    }
    catch (Exception ex){
        return Results.Problem(detail: ex.ToString(), statusCode: 500);
    }
});

app.MapPut("/api/profile",
async (
    UpdateProfileRequest request,
    AppDbContext db
) =>
{
    var user = await db.Users
        .FirstOrDefaultAsync(x =>
            x.Id == request.Id);

    if (user is null)
    {
        return Results.NotFound();
    }

    user.Email = request.Email;
    user.FirstName = request.FirstName;
    user.LastName = request.LastName;

    user.UpdatedAt = DateTime.UtcNow;

    await db.SaveChangesAsync();

    return Results.Ok(new
    {
        user.Id,
        user.Username,
        user.FirstName,
        user.LastName,
        user.Email
    });
});

app.Run();
