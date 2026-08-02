import clsx from "clsx";

export type ProductStatus = "ACTIVE" | "DRAFT" | "OUT_OF_STOCK" | "ARCHIVED";

interface ProductStatusBadgeProps {
  status: ProductStatus;
  className?: string;
}

const statusStyles: Record<ProductStatus, string> = {
  ACTIVE:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",

  DRAFT: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",

  OUT_OF_STOCK:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",

  ARCHIVED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
};

export function ProductStatusBadge({
  status,
  className
}: ProductStatusBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs lowercase font-medium",
        statusStyles[status],
        className
      )}
    >
      {status}
    </span>
  );
}


type StockBadgeProps = {
  quantity?: number | null;
};

export function StockBadge({ quantity = 0 }: StockBadgeProps) {
  const stock = quantity ?? 0;

  const dotColor =
    stock === 0
      ? "bg-red-500"
      : stock <= 5
        ? "bg-orange-500"
        : stock <= 20
          ? "bg-amber-500"
          : stock <= 50
            ? "bg-lime-500"
            : "bg-emerald-500";
  
  const badgePulse = stock <=15 ? true : false; 

  return (
    <div className="flex items-center gap-2 text-xs font-semibold">
      <span
        className={`h-2.5 w-2.5 rounded-full ${dotColor} ${badgePulse ?? "relative"}`}
      />
      
      { badgePulse && <span
        className={`h-2.5 w-2.5 rounded-full ${dotColor} absolute animate-ping`}
      />}
      <span>
        {stock} {stock === 1 ? "unit" : "units"}
      </span>
    </div>
  );
}
