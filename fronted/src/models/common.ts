export interface Pagination {
  TotalCount: number;
  CurrentPage: number;
  PageSize: number;
  TotalPages: number;
  HasNext: boolean;
}

export type PaginationResponse<T> = {
  items: T;
  pagination: Pagination;
};

export function initPagination(): Pagination {
  return {
    TotalCount: 1,
    CurrentPage: 1,
    PageSize: 2,
    TotalPages: 1,
    HasNext: true
  };
}
