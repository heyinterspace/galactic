import { Show, UserButton } from "@clerk/react";
import { ShieldCheck, Sparkles } from "lucide-react";
import { useAppState } from "@/lib/store";

// Lightweight auth state in the console: when signed-out it renders nothing
// (Personalize is the single upgrade entry point), and when signed-in it shows
// Clerk's UserButton (avatar + sign-out menu) plus whether the account has the
// global unlock. Renders nothing about the default scientist — that experience
// is free and account-agnostic.
export function AccountIndicator() {
  const { entitled } = useAppState();

  return (
    <Show when="signed-in">
      <div className="flex items-center gap-2 border-2 border-edge bg-white/5 px-2 py-1.5">
        <UserButton />
        <span
          className={`flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest ${
            entitled ? "text-accent" : "text-ink-dim"
          }`}
        >
          {entitled ? <ShieldCheck size={12} /> : <Sparkles size={12} />}
          {entitled ? "Full access" : "Free preview"}
        </span>
      </div>
    </Show>
  );
}

// Compact variant for the collapsed rail: just the avatar when signed-in.
export function AccountIndicatorRail() {
  return (
    <Show when="signed-in">
      <div className="flex h-9 w-9 items-center justify-center">
        <UserButton />
      </div>
    </Show>
  );
}
