export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResult<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export const getPaginationParams = (query: any): {
  page: number;
  limit: number;
  offset: number;
} => {
  const page = Number.isInteger(+query.page) ? Math.max(1, +query.page) : 1;
  const limit = Number.isInteger(+query.limit)
    ? Math.min(100, Math.max(1, +query.limit))
    : 10;
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

export const createPaginationResult = <T>(
  data: T[],
  totalItems: number,
  page: number,
  limit: number
): PaginationResult<T> => {
  const totalPages = Math.ceil(totalItems / limit);
  const hasPrevPage = page > 1;
  const hasNextPage = page < totalPages;

  return {
    data,
    totalItems,
    totalPages,
    currentPage: page,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null,
  };
};

export interface FilterParams {
  search?: string;
  date?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export const getFilterParams = (query: any): FilterParams => {
  return {
    search: query.search ?? undefined,
    date: query.date ?? undefined,
    sortBy: query.sortBy ?? undefined,
    sortOrder:
      query.sortOrder?.toUpperCase() === "DESC" ? "DESC" : "ASC",
  };
};
