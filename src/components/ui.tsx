"use client";

import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "soft";
  size?: "sm" | "md" | "lg";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
        size === "sm" && "px-3 py-2 text-sm",
        size === "md" && "px-4 py-3 text-[15px]",
        size === "lg" && "px-5 py-3.5 text-base",
        variant === "primary" &&
          "bg-[var(--coral)] text-white shadow-[0_10px_24px_rgba(255,90,61,0.3)] hover:brightness-105",
        variant === "secondary" &&
          "bg-white text-[var(--ink)] border border-[var(--line)] shadow-sm",
        variant === "soft" && "bg-[var(--leaf-soft)] text-[var(--leaf-deep)]",
        variant === "ghost" && "bg-transparent text-[var(--ink-muted)]",
        className,
      )}
      {...props}
    />
  );
}

export function ProgressBar({
  value,
  max,
  className,
  tone = "leaf",
}: {
  value: number;
  max: number;
  className?: string;
  tone?: "leaf" | "amber" | "sky";
}) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div
      className={cn(
        "h-3.5 w-full overflow-hidden rounded-full bg-black/8 border border-black/5",
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-700 ease-out",
          tone === "leaf" &&
            "bg-gradient-to-r from-[var(--leaf-deep)] to-[var(--leaf)]",
          tone === "amber" &&
            "bg-gradient-to-r from-[var(--amber-deep)] to-[var(--amber)]",
          tone === "sky" &&
            "bg-gradient-to-r from-[#2563eb] to-[var(--sky)]",
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function Avatar({
  short,
  color,
  size = "md",
  ring,
}: {
  short: string;
  color: string;
  size?: "sm" | "md" | "lg";
  ring?: boolean;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full font-bold text-white shrink-0",
        size === "sm" && "h-8 w-8 text-[11px]",
        size === "md" && "h-10 w-10 text-xs",
        size === "lg" && "h-12 w-12 text-sm",
        ring && "ring-2 ring-white ring-offset-2 ring-offset-[var(--surface)]",
      )}
      style={{ backgroundColor: color }}
    >
      {short}
    </div>
  );
}

export function SectionCard({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      onClick={onClick}
      className={cn(
        "w-full rounded-[22px] bg-white/90 border border-white/70 shadow-[0_8px_30px_rgba(28,52,40,0.06)] text-left",
        onClick && "transition hover:shadow-[0_10px_34px_rgba(28,52,40,0.1)]",
        className,
      )}
    >
      {children}
    </Comp>
  );
}

export function Pill({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ScreenHeader({
  title,
  subtitle,
  onBack,
  right,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div className="min-w-0">
        {onBack ? (
          <button
            onClick={onBack}
            className="mb-2 text-sm font-medium text-[var(--leaf-deep)]"
          >
            ← Back
          </button>
        ) : null}
        <h1 className="font-display text-[1.65rem] leading-tight tracking-tight text-[var(--ink)]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-[var(--ink-muted)]">{subtitle}</p>
        ) : null}
      </div>
      {right}
    </div>
  );
}
