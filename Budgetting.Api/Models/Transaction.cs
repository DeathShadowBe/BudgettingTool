namespace Budgetting.Api.Models;

public class Transaction
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public DateTime Datum { get; set; }

    public string Rekening { get; set; } = "";

    public string Categorie { get; set; } = "";

    public decimal Bedrag { get; set; }

    public string Type { get; set; } = "";

    public bool Intern { get; set; }

    public bool Project { get; set; }

    public string? Tegenpartij { get; set; }

    public string? Opmerking { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}