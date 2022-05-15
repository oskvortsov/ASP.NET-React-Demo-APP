using backend.Helper.Pagintaion;
using backend.Helper.Sorting;
using backend.Models;
using backend.Repositories;

namespace backend.Extensions;

public static class EntityFrameworkServiceExtensions
{
    public static void AddRepositories(this IServiceCollection services)
    {
        services.AddScoped<ISorting<Employee>, Sorting<Employee>>();
        services.AddScoped<EmployeeRepository>();
    }
}