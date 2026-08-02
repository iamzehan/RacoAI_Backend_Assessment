import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "../lib/hooks/MediaQuery";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

export function Pagination({
  page,
  totalPages,
  total,
  onPageChange,
  itemLabel = "items"
}: PaginationProps) {
  if (totalPages <= 1) return null;
  
  const pageCandidates =
    totalPages <= 7
      ? Array.from({ length: totalPages }, (_, index) => index + 1)
      : [1, page - 1, page, page + 1, totalPages];

  const isMobile = useIsMobile();

  const visiblePages = pageCandidates
    .filter((value) => value >= 1 && value <= totalPages)
    .filter((value, index, values) => values.indexOf(value) === index)
    .sort((a, b) => a - b);

  const pageItems = visiblePages.flatMap((value, index) => {
    const previous = visiblePages[index - 1];
    return index > 0 && value - previous > 1 ? ["ellipsis", value] : [value];
  });

  return (
    <nav
      className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      aria-label="Pagination"
    >
      <p className="text-sm text-[var(--text-muted)]">
        Page {page} of {totalPages} · {total} {itemLabel}
      </p>
      <div className="flex flex-wrap items-center justify-between gap-2 ">
        <button
          type="button"
          className="button-secondary px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft size={16} /> {isMobile? null : "Previous"}
        </button>
        {pageItems.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="px-1 text-sm text-[var(--text-muted)]"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={`size-9 rounded-xl text-sm font-semibold transition ${
                item === page
                  ? "bg-brand text-white"
                  : "bg-[var(--surface-muted)] hover:bg-brand hover:text-white"
              }`}
              aria-label={`Go to page ${item}`}
              aria-current={item === page ? "page" : undefined}
              onClick={() => onPageChange(Number(item))}
            >
              {item}
            </button>
          )
        )}
        <button
          type="button"
          className="button-secondary px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          {isMobile? null : "Next"} <ChevronRight size={16} />
        </button>
      </div>
    </nav>
  );
}
