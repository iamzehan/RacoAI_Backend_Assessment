import QueryString from "qs";

export interface PaginationQuery {
  page: number;
  limit: number;
}

export class Pagination {
  static from(query : QueryString.ParsedQs): PaginationQuery {
    const page = query.page ? Math.max(1, Number(query.page) || 1) : 1;

    const limit = query.limit
      ? Math.min(100, Math.max(1, Number(query.limit) || 20))
      : 20;

    return { page, limit };
  }
}
