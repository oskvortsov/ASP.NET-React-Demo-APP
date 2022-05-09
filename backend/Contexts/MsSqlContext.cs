using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Contexts;
public class MsSqlContext: DbContext
{
    public DbSet<Employee> Employees { get; set; } = null!;
    public DbSet<User> Users { get; set; } = null!;

    public MsSqlContext(DbContextOptions<MsSqlContext> options): base(options)
    {
        Database.EnsureCreated();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasData(
            new User { username = "admin", password = "admin" }
        );
    }
}