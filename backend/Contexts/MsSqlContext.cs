using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.Contexts;
public class MsSqlContext: IdentityDbContext<IdentityUser>
{
    public DbSet<Employee> Employees { get; set; } = null!;

    public MsSqlContext(DbContextOptions<MsSqlContext> options): base(options)
    {
        Database.EnsureCreated();
    }
}