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

app.MapPost("/api/transactions/import",
async (HttpRequest request, AppDbContext db) =>
{
    var form = await request.ReadFormAsync();

    var file = form.Files.FirstOrDefault();

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
        var values = line.Split(';');

        var transaction = new Transaction
        {
            Id =
                Guid.Parse(values[9]),

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
                values[5].ToUpper() == "TRUE",

            Project =
                values[6].ToUpper() == "TRUE",

            Tegenpartij =
                values[7],

            Opmerking =
                values[8],

            CreatedAt =
                DateTime.UtcNow
        };

        if (!await db.Transactions
                     .AnyAsync(x =>
                         x.Id == transaction.Id))
        {
            db.Transactions.Add(transaction);
        }
    }

    await db.SaveChangesAsync();

    return Results.Ok();
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
