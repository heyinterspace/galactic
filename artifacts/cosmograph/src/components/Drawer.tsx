import { type ReactNode, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useAppState } from "@/lib/store";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Shared shell for every Mission Control drawer (Info, Ask, Personalize). One
 * place owns the scrim, the close button, the Escape handler, and — crucially —
 * the geometry, so all drawers are the SAME size and behave identically:
 *
 *  - Desktop: a right-anchored panel that sits to the LEFT of the console,
 *    offset by the live console width (expanded vs collapsed rail) and capped so
 *    every drawer is exactly the same width.
 *  - Mobile: the console docks to the bottom, so the drawer rises from there as a
 *    full-width bottom sheet (capped height) instead of covering the whole screen.
 *
 * Drawers are mutually exclusive (enforced in the store), so only one is ever
 * mounted at a time.
 */
export function Drawer({
  open,
  onClose,
  labelledBy,
  children,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
}) {
  const { consoleOpen } = useAppState();
  const isMobile = useIsMobile();
  const consoleW = consoleOpen ? "min(12rem, 80vw)" : "3.5rem";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 pointer-events-auto"
        >
          <div
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            initial={isMobile ? { y: "100%" } : { x: "100%" }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: "100%" } : { x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            style={
              isMobile
                ? undefined
                : {
                    right: consoleW,
                    width: `min(34rem, calc(100vw - ${consoleW} - 0.5rem))`,
                  }
            }
            className={
              isMobile
                ? "custom-scrollbar absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto border-t-2 border-edge bg-bg/95 p-6 pt-8 backdrop-blur-xl"
                : "custom-scrollbar absolute top-0 bottom-0 overflow-y-auto border-l-2 border-edge bg-bg/95 p-7 backdrop-blur-xl"
            }
          >
            <button
              onClick={onClose}
              aria-label="Close"
              autoFocus
              className="absolute top-4 right-4 z-10 text-ink-dim transition-colors hover:text-ink"
            >
              <X size={18} />
            </button>
            {children}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
