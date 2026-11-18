"use client";

import { Button, ProgressBar, ScreenHeader, SectionCard } from "@/components/ui";
import { useBunch } from "@/lib/bunch-context";
import { fileToMealDataUrl } from "@/lib/image";
import { Camera, ImagePlus, Minus, Plus } from "lucide-react";
import { useRef, useState } from "react";

export function LogMealScreen() {
  const { goTo, saveMeal, you, loading } = useBunch();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState("");
  const [protein, setProtein] = useState(30);
  const [share, setShare] = useState(true);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [readingPhoto, setReadingPhoto] = useState(false);

  if (!you) return null;

  const projected = you.personalProtein + protein;
  const willComplete =
    !you.goalDayComplete && projected >= you.proteinTarget;
  const shareLocked = you.sharedQuestToday;

  const onPickPhoto = async (file: File | null) => {
    if (!file) return;
    setPhotoError(null);
    setReadingPhoto(true);
    try {
      const dataUrl = await fileToMealDataUrl(file);
      setPhotoUrl(dataUrl);
      if (!name.trim()) {
        const base = file.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ");
        if (base && base.length >= 2) setName(base.slice(0, 40));
      }
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : "Could not read photo");
    } finally {
      setReadingPhoto(false);
    }
  };

  return (
    <div className="px-5 pb-10 pt-6 animate-rise">
      <ScreenHeader
        title="Log your plate"
        subtitle="Pick a photo from your camera roll, name it, estimate protein."
        onBack={() => goTo("home")}
      />

      <SectionCard className="overflow-hidden">
        <div className="relative aspect-[4/3] bg-[var(--leaf-soft)]">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoUrl}
              alt={name || "Your meal"}
              className="h-full w-full object-cover"
            />
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex h-full w-full flex-col items-center justify-center gap-2 px-6 text-center"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--lime)] text-[var(--ink-on-bright)]">
                <ImagePlus className="h-6 w-6" />
              </span>
              <p className="font-display text-xl text-[var(--ink)]">
                Add a food photo
              </p>
              <p className="text-xs text-[var(--ink-muted)]">
                Camera roll or take a new picture
              </p>
            </button>
          )}
          {photoUrl ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--lime)] px-3 py-1.5 text-xs font-extrabold text-[var(--ink-on-bright)] shadow-[0_6px_16px_rgba(0,0,0,0.35)]">
                  <Camera className="h-3.5 w-3.5" aria-hidden />
                  Your photo
                </span>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="rounded-full bg-black/55 px-3 py-1.5 text-xs font-bold text-white backdrop-blur"
                >
                  Change
                </button>
              </div>
            </>
          ) : null}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => void onPickPhoto(e.target.files?.[0] ?? null)}
        />

        <div className="space-y-4 p-4">
          {photoError ? (
            <p className="rounded-2xl bg-[#3a1f28] px-3 py-2 text-sm text-[var(--peach)]">
              {photoError}
            </p>
          ) : null}
          {readingPhoto ? (
            <p className="text-xs text-[var(--ink-muted)]">Reading photo…</p>
          ) : null}

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-faint)]">
              Meal name
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chicken bowl"
              className="mt-1.5 w-full rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-3.5 py-3 text-[15px] outline-none focus:border-[var(--leaf)]"
            />
          </label>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-faint)]">
                Protein estimate
              </span>
              <span className="font-display text-xl text-[var(--ink)]">
                {protein}g
              </span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                aria-label="Decrease protein"
                onClick={() => setProtein((p) => Math.max(5, p - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <ProgressBar
                className="flex-1"
                value={Math.min(protein, 60)}
                max={60}
                tone="amber"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                aria-label="Increase protein"
                onClick={() => setProtein((p) => Math.min(80, p + 1))}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-xs text-[var(--ink-muted)]">
              Today after save:{" "}
              {Math.min(projected, you.proteinTarget + 40)}g / {you.proteinTarget}
              g
              {willComplete ? " · completes your goal-day" : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={() => !shareLocked && setShare((s) => !s)}
            disabled={shareLocked}
            className={`flex w-full items-start gap-3 rounded-2xl border px-3.5 py-3 text-left transition ${
              share && !shareLocked
                ? "border-[var(--ralli)] bg-[var(--lavender)]"
                : "border-[var(--line)] bg-[var(--surface)]"
            } ${shareLocked ? "opacity-60" : ""}`}
          >
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                share || shareLocked
                  ? "border-[var(--ralli)] bg-[var(--ralli)] text-white"
                  : "border-[var(--line)] bg-white"
              }`}
            >
              {(share || shareLocked) && (
                <span className="text-[11px] font-bold">✓</span>
              )}
            </span>
            <span>
              <span className="block text-sm font-semibold text-[var(--ink)]">
                Share to squad quest
              </span>
              <span className="mt-0.5 block text-xs text-[var(--ink-muted)]">
                {shareLocked
                  ? "You already contributed today — one quest post per day."
                  : "Your real photo goes into Recipe Relay for the squad."}
              </span>
            </span>
          </button>
        </div>
      </SectionCard>

      <Button
        className="mt-5 w-full"
        size="lg"
        variant="lime"
        organic
        disabled={loading || readingPhoto || !name.trim() || !photoUrl}
        onClick={() =>
          void saveMeal({
            shareToQuest: share && !shareLocked,
            protein,
            name,
            imageDataUrl: photoUrl ?? undefined,
          })
        }
      >
        {loading
          ? "Saving…"
          : share && !shareLocked
            ? "Save & share with squad"
            : "Save to my day"}
      </Button>
      <p className="mt-3 text-center text-xs text-[var(--ink-faint)]">
        Photos stay in this class session — pick from your camera roll.
      </p>
    </div>
  );
}
