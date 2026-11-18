"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Button({
  className,
  variant = "primary",
  size = "md",
  organic = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "soft" | "lime";
  size?: "sm" | "md" | "lg";
  organic?: boolean;
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-bold transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
        organic
          ? "rounded-[28px_34px_24px_36px/30px_26px_34px_28px]"
          : "rounded-[22px]",
        size === "sm" && "px-3.5 py-2 text-sm",
        size === "md" && "px-4 py-3 text-[15px]",
        size === "lg" && "px-5 py-3.5 text-base",
        variant === "primary" &&
          "bg-[var(--ralli-deep)] text-[var(--cream)] shadow-[0_14px_32px_rgba(91,80,232,0.4)] hover:brightness-110",
        variant === "lime" &&
          "bg-[var(--lime)] text-[var(--ink-on-bright)] shadow-[0_14px_32px_rgba(223,255,131,0.28)] hover:brightness-105",
        variant === "secondary" &&
          "bg-[var(--glass)] text-[var(--ink)] border border-white/15 backdrop-blur-md",
        variant === "soft" && "bg-[var(--leaf-soft)] text-[var(--leaf-deep)]",
        variant === "ghost" && "bg-transparent text-[var(--ink-muted)]",
        className,
      )}
      {...props}
    />
  );
}

/** Lime pill + arrow bubble connected with the gooey metaball filter */
export function GooeyCta({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={cn("gooey-cta", className)} {...props}>
      <span className="gooey-cta-blobs" aria-hidden>
        <span className="gooey-cta-pill" />
        <span className="gooey-cta-circle" />
      </span>
      <span className="gooey-cta-content">
        <span className="gooey-cta-label">{children}</span>
        <span className="gooey-cta-arrow">
          <ArrowUpRight className="h-5 w-5" strokeWidth={2.5} />
        </span>
      </span>
    </button>
  );
}

export function ProgressBar({
  value,
  max,
  className,
  tone = "leaf",
  striped = false,
}: {
  value: number;
  max: number;
  className?: string;
  tone?: "leaf" | "amber" | "sky";
  striped?: boolean;
}) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div
      className={cn(
        "h-3.5 w-full overflow-hidden rounded-full bg-white/10",
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-700 ease-out",
          striped && "stripe-fill",
          !striped &&
            tone === "leaf" &&
            "bg-gradient-to-r from-[#7167f0] to-[var(--teal)]",
          !striped && tone === "amber" && "bg-[var(--lime)]",
          !striped &&
            tone === "sky" &&
            "bg-gradient-to-r from-[var(--peach)] to-[var(--ralli)]",
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
        ring &&
          "ring-2 ring-white/80 ring-offset-2 ring-offset-[var(--mist-deep)]",
      )}
      style={{ backgroundColor: color }}
    >
      {short}
    </div>
  );
}

export function AvatarStack({
  members,
}: {
  members: Array<{ id: string; short: string; color: string }>;
}) {
  return (
    <div className="flex -space-x-2">
      {members.slice(0, 4).map((m) => (
        <Avatar key={m.id} short={m.short} color={m.color} size="sm" ring />
      ))}
      {members.length > 4 ? (
        <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--leaf-soft)] text-[10px] font-bold text-[var(--ink)] ring-2 ring-white/80 ring-offset-2 ring-offset-[var(--mist-deep)]">
          +{members.length - 4}
        </div>
      ) : null}
    </div>
  );
}

export function SectionCard({
  children,
  className,
  onClick,
  glass = true,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  glass?: boolean;
}) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-[28px]",
        glass ? "glass-card" : "bg-[var(--card-solid)] border border-white/10",
        onClick && "transition hover:-translate-y-0.5 hover:border-white/25",
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
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="min-w-0">
        {onBack ? (
          <button
            onClick={onBack}
            className="mb-2 text-sm font-semibold text-[var(--teal)]"
          >
            ← Back
          </button>
        ) : null}
        <h1 className="font-display text-[1.7rem] leading-tight text-[var(--ink)]">
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
