export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const statusStyles: Record<OrderStatus, string> = {
  PENDING:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  PAID:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  PROCESSING:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  SHIPPED:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  DELIVERED:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  CANCELLED:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  REFUNDED:
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

export function OrderStatusBadge({
  status,
  className,
}: OrderStatusBadgeProps) {
  return (
    <span
      className={
        `inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]} ${className ?? ""}`
      }
    >
      {status}
    </span>
  );
}
