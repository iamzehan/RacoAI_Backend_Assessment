import { Minus, Plus } from "lucide-react";

interface PageSizeSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function PageSizeSlider({
  value,
  onChange,
  min = 1,
  max = 100
}: PageSizeSliderProps) {
  return (
    <div className="flex items-center justify-between gap-2 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--text-muted)]">
      <button
        type="button"
        className="rounded-l-[inherit] p-1 px-2 h-full transition hover:bg-[var(--surface-muted)] disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Show fewer products per page"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <Minus size={14} />
      </button>
      <label className="min-w-24 text-center">
        {value} per page
        <input
          className="mt-1 block w-full accent-[var(--color-brand)]"
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-label="Products per page"
        />
      </label>
      <button
        type="button"
        className="rounded-r-[inherit] h-full p-1 px-2 transition hover:bg-[var(--surface-muted)] disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Show more products per page"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
