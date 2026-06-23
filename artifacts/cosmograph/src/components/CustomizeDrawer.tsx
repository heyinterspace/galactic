import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Telescope } from "lucide-react";
import { useAppState } from "@/lib/store";
import { ResearcherSearch } from "@/components/ResearcherSearch";

export function CustomizeDrawer() {
  const { customizeOpen, setCustomizeOpen, consoleOpen } = useAppState();
  // Sit to the LEFT of the right-hand Flight Console instead of under it: offset
  // by the live console width (expanded vs collapsed rail) and cap our own width
  // so we never overflow the remaining space.
  const consoleW = consoleOpen ? "min(14rem,80vw)" : "3.5rem";

  useEffect(() => {
    if (!customizeOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCustomizeOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [customizeOpen, setCustomizeOpen]);

  return (
    <AnimatePresence>
      {customizeOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 pointer-events-auto"
        >
          <div
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            onClick={() => setCustomizeOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="customize-drawer-title"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            style={{
              right: consoleW,
              width: `min(34rem, calc(100vw - ${consoleW} - 0.5rem))`,
            }}
            className="custom-scrollbar absolute top-0 bottom-0 overflow-y-auto border-l-2 border-edge bg-bg/95 p-7 backdrop-blur-xl"
          >
            <button
              onClick={() => setCustomizeOpen(false)}
              aria-label="Close"
              autoFocus
              className="absolute top-4 right-4 text-ink-dim transition-colors hover:text-ink"
            >
              <X size={18} />
            </button>

            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-accent">
              <Telescope size={12} /> Customize the galaxy
            </span>
            <h2
              id="customize-drawer-title"
              className="mt-1 mb-2 text-2xl font-title font-bold tracking-tight text-ink"
            >
              Point the ship at a new scientist
            </h2>
            <p className="mb-6 text-[13px] leading-relaxed text-ink-dim">
              Cosmograph can map anyone with a public research record. Search for a
              name below and the entire universe rebuilds around their work — live,
              with nothing to install.
            </p>

            <ResearcherSearch />
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
