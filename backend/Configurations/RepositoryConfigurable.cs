using backend.Repositories;

namespace backend.Extensions;

public static class RepositoryConfigurations
{
    public static void AddRepositories(this IServiceCollection services)
    {
        services.AddScoped<EmployeeRepository>();
    }
}