namespace backend.Helper.Sorting;

public interface ISorting<T>
{
    IQueryable<T> ApplySort(IQueryable<T> entities, string orderByQueryString);
}