using Microsoft.EntityFrameworkCore;
using backend.Entities;
namespace backend.Data;

public class DataContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<TaleDie> TaleDice { get; set; }
    
}
