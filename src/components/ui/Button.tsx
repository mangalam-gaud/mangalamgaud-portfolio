import React from "react";
import { PropsWithChildren } from "react";

export function Button({
  children,
  className = "",
  variant = "accent",
  asChild = false,
  disabled,
  startIcon,
  ...props
}: PropsWithChildren<{
  className?: string;
  variant?: "accent" | "outline" | "ghost";
  asChild?: boolean;
  disabled?: boolean;
  startIcon?: React.ReactNode;
}> & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled">) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-[4px] font-mono text-[11px] font-semibold uppercase tracking-[0.14em] transition-all disabled:opacity-40 disabled:pointer-events-none";
  const variants: Record<string, string> = {
    accent: "bg-accent text-bg px-5 py-2.5 hover:bg-accent/90",
    outline:
      "border border-border-strong bg-transparent text-text px-5 py-2.5 hover:border-accent/70 hover:text-accent",
    ghost: "text-text-muted px-4 py-2.5 hover:text-accent",
  };
  const cls = `${base} ${variants[variant]} ${className}`;
  const extra = asChild ? {} : { disabled };

  if (asChild) {
    return (
      <span data-cursor className={cls}>
        {startIcon && <span className="shrink-0">{startIcon}</span>}
        {children}
      </span>
    );
  }

  return (
    <button data-cursor className={cls} {...extra} {...props}>
      {startIcon && <span className="shrink-0">{startIcon}</span>}
      {children}
    </button>
  );
}
