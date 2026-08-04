import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { api, type Category, type Product } from "../../api";
import { useCart, useRbac, useTheme } from "../../contexts/_index";
import { Alert } from "../../components/Alert";
import { Empty } from "../../components/Empty";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { ProductCard } from "./ProductCard";
import { ProductSkeleton } from "./ProductSkeleton";
import { useProducts } from "./productResource";
import { Pagination } from "../../components/Pagination";
import { PageSizeSlider } from "../../components/PageSizeSlider";
import { useIsMobile } from "../../lib/hooks/MediaQuery";

// MUI materials
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { createTheme } from "@mui/material/styles";

function ShopHeader({
  search,
  categoryId,
  categories,
  onSearch,
  onCategory,
  limit,
  onLimitChange
}: {
  search: string;
  categoryId: string;
  categories: Category[];
  onSearch: (value: string) => void;
  onCategory: (value: string) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
}) {

  return (
    <div className="flex flex-col justify-between gap-5">
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-brand">
          The collection
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">
          Find your everyday favourite.
        </h1>
      </div>
      <div className="flex flex-col gap-5 md:flex-row md:gap-2 sm:w-auto">
        <input
          className="field mt-0"
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Search products"
        />
        {/* Filters */}
        <div className="flex gap-2 w-full flex-col lg:flex-row">
            <Autocomplete
            
              className="w-full"
              options={categories}
              value={categories.find((c) => c.id === categoryId) ?? null}
              onChange={(_, value) => onCategory(value?.id ?? "")}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category"
                  placeholder="All categories"
                />
              )}
            />
          <PageSizeSlider value={limit} onChange={onLimitChange} />
        </div>
      </div>
    </div>
  );
}

function ProductResults({
  search,
  categoryId,
  page,
  limit,
  onPageChange,
  onClearFilters
}: {
  search: string;
  categoryId: string;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
}) {
  const response = useProducts(search, categoryId, page, limit);
  const products = response.data;
  const { add } = useCart();
  const grid = useRef<HTMLDivElement>(null);
  const productCardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  gsap.registerPlugin(ScrollTrigger);

  useGSAP(
    () => {
      if (
        !products.length ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      const cards = gsap.utils.toArray<HTMLElement>("[data-product-card]");

      cards.forEach((card) => {
        gsap.from(card, {
          opacity: 0,
          y: 40,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "restart none restart none"
          }
        });
      });
    },
    {
      scope: grid,
      dependencies: [products, isMobile],
      revertOnUpdate: true
    }
  );

  if (!products.length) {
    const filtered = Boolean(search || categoryId);
    return (
      <Empty
        title="No products found"
        text={
          filtered
            ? "Try adjusting your search or category filter to discover something new."
            : "There are no products available in the collection right now."
        }
        action={filtered ? "Clear filters" : "Back to home"}
        onAction={filtered ? onClearFilters : undefined}
        to={filtered ? undefined : "/"}
        fullscreen
      />
    );
  }

  return (
    <>
      <div
        ref={grid}
        className="grid grid-cols-1 gap-5 pt-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        {products.map((product: Product) => (
          <div ref={productCardRef} data-product-card key={product.id}>
            <ProductCard product={product} onAdd={() => add(product)} />
          </div>
        ))}
      </div>
      {response.pagination && (
        <div className="bg-[var(--color-mist)] sticky bottom-0 pb-5 max-w-screen">
          <Pagination
            {...response.pagination}
            itemLabel="products"
            onPageChange={onPageChange}
          />
        </div>
      )}
    </>
  );
}

export function Shop() {
  const { canAccessAdmin } = useRbac();
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [debouncedCategory, setDebouncedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setDebouncedCategory(categoryId);
    }, 250);
    return () => clearTimeout(timer);
  }, [search, categoryId]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, debouncedCategory, limit]);

  useEffect(() => {
    api
      .categories()
      .then(setCategories)
      .catch((err: unknown) =>
        setError(
          err instanceof Error ? err.message : "Unable to load categories."
        )
      );
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant"
    });
  }, [page]);

  if (canAccessAdmin) return <Navigate to="/products" replace />;

  const isFiltering = Boolean(debouncedSearch || debouncedCategory);
  const clearFilters = () => {
    setSearch("");
    setCategoryId("");
    setDebouncedSearch("");
    setDebouncedCategory("");
    setPage(1);
  };

  return (
    <section className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-7xl flex-col px-4 py-12 sm:px-6">
      <ShopHeader
        search={search}
        categoryId={categoryId}
        categories={categories}
        onSearch={setSearch}
        onCategory={setCategoryId}
        limit={limit}
        onLimitChange={setLimit}
      />
      {error && <Alert text={error} />}
      <ErrorBoundary>
        <Suspense
          key={`${debouncedSearch}::${debouncedCategory}::${page}::${limit}`}
          fallback={<ProductSkeleton count={isFiltering ? 3 : 6} />}
        >
          <ProductResults
            search={debouncedSearch}
            categoryId={debouncedCategory}
            page={page}
            limit={limit}
            onPageChange={setPage}
            onClearFilters={clearFilters}
          />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}
