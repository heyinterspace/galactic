import { useRef, useState } from "react";
import { Share2, Check, Loader2 } from "lucide-react";
import { shareGalaxy, type ShareOutcome } from "@/lib/share";

const LABELS: Record<ShareOutcome, string> = {
  shared: "Shared",
  downloaded: "Saved",
  copied: "Copied",
  cancelled: "Share",
  error: "Try again",
};

export function ShareButton() {
  const [status, setStatus] = useState<"idle" | "working" | "done">("idle");
  const [label, setLabel] = useState("Share");
  const timer = useRef<number | null>(null);

  const onClick = async () => {
    if (status === "working") return;
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
    setStatus("working");
    setLabel("Share");

    const outcome = await shareGalaxy();
    if (outcome === "cancelled") {
      setStatus("idle");
      setLabel("Share");
      return;
    }

    setLabel(LABELS[outcome]);
    setStatus("done");
    timer.current = window.setTimeout(() => {
      setStatus("idle");
      setLabel("Share");
      timer.current = null;
    }, 2400);
  };

  return (
    <button
      onClick={onClick}
      disabled={status === "working"}
      aria-label="Share this galaxy"
      title="Share this galaxy"
      className="glass-panel glass-panel-interactive flex items-center gap-2 px-4 py-2 text-xs font-display uppercase tracking-wider text-ink pointer-events-auto disabled:opacity-70"
    >
      {status === "working" ? (
        <Loader2 size={14} className="animate-spin" />
      ) : status === "done" ? (
        <Check size={14} className="text-accent" />
      ) : (
        <Share2 size={14} />
      )}
      {label}
    </button>
  );
}
