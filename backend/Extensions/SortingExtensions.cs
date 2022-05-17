using System.Reflection;
using System.Text;
using System.Linq.Dynamic.Core;


namespace backend.Extensions;

public static class SortingExtension
{
    public static IQueryable<T> ApplySort<T>(this IQueryable<T> entities, string orderByQueryString)
    {
        if (!entities.Any() || string.IsNullOrWhiteSpace(orderByQueryString))
            return entities;

        var orderParams = orderByQueryString.Trim().Split(',');
        var propertyInfos = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
        var orderQueryBuilder = new StringBuilder();

        foreach (var param in orderParams)
        {
            if (string.IsNullOrWhiteSpace(param))
                continue;

            var propertyFromQueryName = param.Split(" ")[0];
            var objectProperty = propertyInfos.FirstOrDefault(p =>
                p.Name.Equals(propertyFromQueryName, StringComparison.InvariantCultureIgnoreCase));
            
            if (objectProperty == null)
                continue;

            var sortingOrder = param.EndsWith(" desc") ? "descending" : "ascending";
            orderQueryBuilder.Append($"{objectProperty.Name} {sortingOrder}, ");
        }

        var orderQuery = orderQueryBuilder.ToString().TrimEnd(',', ' ');
        
        return entities.OrderBy(orderQuery);
    }
}