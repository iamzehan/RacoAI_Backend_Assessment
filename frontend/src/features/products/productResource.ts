import { use, useMemo } from "react";
import { api, type Paginated, type Product } from "../../api";

const productCache = new Map<string, Promise<Paginated<Product>>>();

function cacheKey(search: string, categoryId: string, page: number, limit: number) {
  return `${search.trim()}::${categoryId}::${page}::${limit}`;
}

export function loadProducts(
  search: string,
  categoryId: string,
  page: number,
  limit: number
) {
  const key = cacheKey(search, categoryId, page, limit);
  const existing = productCache.get(key);
  if (existing) return existing;

  const request = api
    .products({
      search: search || undefined,
      categoryId: categoryId || undefined,
      page,
      limit
    })
    .then((response) => {
      return response;
    })
    .catch((error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Unable to load products.";
      // Backend throws when the result set is empty — treat as no products.
      if (/no products found/i.test(message)) {
        return { data: [], pagination: undefined };
      }
      productCache.delete(key);
      throw error;
    });

  productCache.set(key, request);
  return request;
}

export function invalidateProductCache() {
  productCache.clear();
}

export function useProducts(
  search: string,
  categoryId: string,
  page: number,
  limit: number
) {
  const promise = useMemo(
    () => loadProducts(search, categoryId, page, limit),
    [search, categoryId, page, limit]
  );
  return use(promise);
}
