import { cn } from "@/lib/utils";

// Decorative title-bar controls. Not interactive, so hidden from assistive tech.
function TitleControls() {
  return (
    <span aria-hidden className="ml-auto flex gap-[2px]">
      {["_", "□", "×"].map((g, i) => (
        <span
          key={g}
          className={cn(
            "bevel-out grid h-[14px] w-4 place-items-center bg-face text-[10px] font-bold leading-none text-ink",
            i === 2 && "ml-[2px]",
          )}
        >
          {g}
        </span>
      ))}
    </span>
  );
}

// Real close button, for dialogs that can actually be dismissed.
function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      className="bevel-out ml-auto grid h-[14px] w-4 place-items-center bg-face text-[10px] font-bold leading-none text-ink active:bevel-in"
    >
      ×
    </button>
  );
}

// Win98 window: pastel frame, pink→blue gradient title bar. Pass `onClose` to get a working × instead of the decorative controls.
export function Window({
  title,
  icon,
  className,
  bodyClassName,
  children,
  inactive = false,
  onClose,
}: {
  title: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
  inactive?: boolean;
  onClose?: () => void;
}) {
  return (
    <section className={cn("bevel-out flex flex-col bg-face p-[3px] text-ink", className)}>
      <div
        className={cn(
          "flex h-[22px] shrink-0 items-center gap-1.5 px-1 text-[12px] font-bold text-ink",
          inactive ? "bg-gradient-to-r from-face-shadow to-face" : "bg-gradient-to-r from-title-from to-title-to",
        )}
      >
        {icon}
        <span className="truncate">{title}</span>
        {onClose ? <CloseButton onClose={onClose} /> : <TitleControls />}
      </div>
      <div className={cn("min-h-0 flex-1", bodyClassName)}>{children}</div>
    </section>
  );
}

// Winamp-skin window: pastel body with a striped title bar.
export function AmpWindow({ title, className, children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <section className={cn("amp-out bg-amp p-[3px]", className)}>
      <div aria-hidden={false} className="flex h-[14px] items-center gap-2 px-1">
        <span className="amp-stripes h-[7px] flex-1" />
        <span className="font-ui text-[9px] font-bold uppercase tracking-[0.25em] text-ink/80">{title}</span>
        <span className="amp-stripes h-[7px] flex-1" />
      </div>
      {children}
    </section>
  );
}
