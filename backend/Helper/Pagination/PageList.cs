using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace backend.Helper.Pagintaion;

public class PageList<T>: List<T>
{
    public int CurrentPage { get; private set; }
    public int TotalPages { get; private set; }
    public int PageSize { get; private set; }
    public int TotalCount { get; private set; }
    public bool HasNext => CurrentPage < TotalPages;
    
    public PageList(List<T> items, int count, int pageNumber, int pageSize)
    {
        TotalCount = count;
        PageSize = pageSize;
        CurrentPage = pageNumber;
        TotalPages = (int)Math.Ceiling(count / (double)pageSize);
        AddRange(items);
    }

    public string GetMetadata()
    {
        var data = new
        {
            TotalCount,
            PageSize,
            CurrentPage,
            TotalPages,
            HasNext,
        };

        return JsonConvert.SerializeObject(data);
    }

    public static async Task<PageList<T>> ToPageList(IQueryable<T> source, int pageNumber, int pageSize)
    {
        var count = source.Count();
        var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

        return new PageList<T>(items, count, pageNumber, pageSize);
    }
}