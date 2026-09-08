using Budgetting.Api.Data;
using Budgetting.Api.Models;
using Microsoft.EntityFrameworkCore;

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
                .AllowAnyOrigin();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    
}

app.UseCors("AngularPolicy");

app.UseHttpsRedirection();

app.MapGet("/", () => "API werkt");

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
``

app.Run();
