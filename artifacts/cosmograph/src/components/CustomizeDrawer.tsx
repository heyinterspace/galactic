import { Telescope, Crown } from "lucide-react";
import { useAppState } from "@/lib/store";
import { ResearcherSearch } from "@/components/ResearcherSearch";
import { Drawer } from "./Drawer";

export function CustomizeDrawer() {
  const { customizeOpen, setCustomizeOpen } = useAppState();

  return (
    <Drawer
      open={customizeOpen}
      onClose={() => setCustomizeOpen(false)}
      labelledBy="customize-drawer-title"
    >
      <div className="flex items-center justify-between gap-2 pr-8">
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent">
          <Telescope size={12} /> Customize the galaxy
        </span>
        <span className="flex shrink-0 items-center gap-1 border border-accent/60 bg-accent/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-accent">
          <Crown size={9} /> Premium
        </span>
      </div>
      <h2
        id="customize-drawer-title"
        className="mt-3 mb-2.5 text-2xl font-title font-bold leading-tight tracking-tight text-ink"
      >
        Point the ship at a new researcher
      </h2>
      <p className="mb-6 text-[13px] leading-relaxed text-ink-dim">
        Cosmograph can map anyone with a public research record. Search for a name
        below and the entire universe rebuilds around their work — live, with
        nothing to install. Deep exploration of a custom researcher (Fly, Tour, and
        full paper details) is a one-time premium unlock.
      </p>

      <ResearcherSearch />
    </Drawer>
  );
}
