import { useEffect, useRef } from "react";
import { useSite } from "@/lib/site-content";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (v: string) => void;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  multiline?: boolean;
};

/** Inline contentEditable text, only editable when admin mode is active. */
export function Editable({
  value,
  onChange,
  as: Tag = "span",
  className,
  multiline = false,
}: Props) {
  const { isAdmin } = useSite();
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerText !== value) {
      ref.current.innerText = value;
    }
  }, [value, isAdmin]);

  return (
    <Tag
      ref={ref as never}
      suppressContentEditableWarning
      contentEditable={isAdmin}
      onBlur={(e: React.FocusEvent<HTMLElement>) =>
        onChange(e.currentTarget.innerText.trim())
      }
      onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
        if (!multiline && e.key === "Enter") {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
      }}
      className={cn(
        className,
        isAdmin &&
          "cursor-text rounded-md outline-none ring-1 ring-dashed ring-accent/50 transition focus:ring-2 focus:ring-accent",
      )}
    >
      {value}
    </Tag>
  );
}

/** Clickable image area that opens a file picker in admin mode. */
export function EditableImage({
  src,
  alt,
  onChange,
  className,
  imgClassName,
}: {
  src: string;
  alt: string;
  onChange: (dataUrl: string) => void;
  className?: string;
  imgClassName?: string;
}) {
  const { isAdmin } = useSite();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <span className={cn("relative inline-flex", className)}>
      <img
        src={src || "/placeholder-pamflet.png"}
        alt={alt}
        loading="lazy"
        onError={(e) => {
          const img = e.currentTarget;
          if (!img.src.endsWith("/placeholder-pamflet.png")) {
            img.src = "/placeholder-pamflet.png";
          }
        }}
        className={imgClassName}
      />
      {isAdmin && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
            className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/70 text-[10px] font-semibold uppercase tracking-wider text-accent opacity-0 backdrop-blur-sm transition hover:opacity-100"
          >
            Ganti
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const { readImageFile } = await import("@/lib/site-content");
              onChange(await readImageFile(file));
              e.target.value = "";
            }}
          />
        </>
      )}
    </span>
  );
}
