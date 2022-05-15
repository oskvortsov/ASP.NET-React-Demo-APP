namespace backend.Helper;

public abstract class QueryStringParams
{
  public int PageNumber { get; set; } = 1;
  
  private readonly int MaxPageSize = 50;
  private int _pageSize = 10;

  public int PageSize
  {
    get
    {
      return _pageSize;
    }
    set
    {
      _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
    }
  }

  public string OrderBy { get; set; } = "";
}