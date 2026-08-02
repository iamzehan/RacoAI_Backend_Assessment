import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type PasswordFieldProps = {
  label?: string;
  name?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  minLength?: number;
  autoComplete?: string;
};

export function PasswordField({
  label = "Password",
  name,
  value,
  onChange,
  required,
  minLength,
  autoComplete = "current-password"
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="mt-4 block text-sm font-semibold">
      {label}
      <div className="relative">
        <input
          className="field pr-11"
          type={visible ? "text" : "password"}
          name={name}
          required={required}
          minLength={minLength}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </label>
  );
}
