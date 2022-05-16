using AutoMapper;

namespace backend.Helper.Pagintaion;

public class PageListConverter<TSource, TDestination>
    : ITypeConverter<PageList<TSource>, PageList<TDestination>>
{
    public PageList<TDestination> Convert(
        PageList<TSource> source,
        PageList<TDestination> destination,
        ResolutionContext context) => new PageList<TDestination>(
                context.Mapper.Map<List<TSource>, List<TDestination>>(source),
                source.Count,
                source.CurrentPage,
                source.PageSize
        );
}