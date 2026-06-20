import type { LucideIcon } from "lucide-react";
import { Compass } from "lucide-react";
import { galaxyData } from "@/data/galaxy";
import { LEGEND_BY_KEY, NAV_MODES } from "@/lib/legend";

export type TourTarget =
  | { type: "overview" }
  | { type: "sun"; id: string }
  | { type: "planet"; id: string };

export interface TourStop {
  title: string;
  caption: string;
  target: TourTarget;
  duration: number;
  icon?: LucideIcon;
}

function buildTourStops(): TourStop[] {
  const stops: TourStop[] = [];
  const { author, stats, papers } = galaxyData;
  const domains = [...galaxyData.domains].sort(
    (a, b) => b.totalCitations - a.totalCitations,
  );

  stops.push({
    title: "Welcome",
    caption: `A lifetime of discovery by ${author.name}, mapped as a galaxy of ${stats.totalPapers} papers and ${stats.totalCitations.toLocaleString()} citations. Let's take a quick tour of how to read it.`,
    target: { type: "overview" },
    duration: 8000,
  });

  // Suns = research domains, anchored on the brightest one so the concept lands
  // on something the viewer is actually looking at.
  if (domains[0]) {
    stops.push({
      title: LEGEND_BY_KEY.suns.title,
      caption: `${LEGEND_BY_KEY.suns.body} The brightest here — ${domains[0].name} — anchors this universe with ${domains[0].totalCitations.toLocaleString()} citations across ${domains[0].paperCount} papers.`,
      target: { type: "sun", id: domains[0].id },
      duration: 9000,
      icon: LEGEND_BY_KEY.suns.icon,
    });
  }

  // Planets = papers, anchored on the single most-cited paper.
  const mostCited = [...papers].sort((a, b) => b.citations - a.citations)[0];
  if (mostCited) {
    stops.push({
      title: LEGEND_BY_KEY.planets.title,
      caption: `${LEGEND_BY_KEY.planets.body} The largest here, "${mostCited.title}", has been cited ${mostCited.citations.toLocaleString()} times${mostCited.year ? ` since ${mostCited.year}` : ""}.`,
      target: { type: "planet", id: mostCited.id },
      duration: 9000,
      icon: LEGEND_BY_KEY.planets.icon,
    });

    // Moons = co-authors. Stay on the same paper so its moons are visible.
    stops.push({
      title: LEGEND_BY_KEY.moons.title,
      caption: LEGEND_BY_KEY.moons.body,
      target: { type: "planet", id: mostCited.id },
      duration: 8000,
      icon: LEGEND_BY_KEY.moons.icon,
    });
  }

  // Orbits = relevance, shown against a second domain's system.
  const orbitDomain = domains[1] ?? domains[0];
  if (orbitDomain) {
    stops.push({
      title: LEGEND_BY_KEY.orbits.title,
      caption: LEGEND_BY_KEY.orbits.body,
      target: { type: "sun", id: orbitDomain.id },
      duration: 8000,
      icon: LEGEND_BY_KEY.orbits.icon,
    });
  }

  // Nearby suns = related fields, best seen from the overview.
  stops.push({
    title: LEGEND_BY_KEY.related.title,
    caption: LEGEND_BY_KEY.related.body,
    target: { type: "overview" },
    duration: 8000,
    icon: LEGEND_BY_KEY.related.icon,
  });

  // How to get around: Orbit vs Fly.
  stops.push({
    title: "Two ways to explore",
    caption: `${NAV_MODES.orbit.name} — ${NAV_MODES.orbit.blurb} ${NAV_MODES.fly.name} — ${NAV_MODES.fly.blurb} Switch between them anytime from the bar at the bottom (the dashed line is your route to follow when flying).`,
    target: { type: "overview" },
    duration: 9000,
    icon: NAV_MODES.fly.icon,
  });

  stops.push({
    title: "Explore Freely",
    caption:
      "That's the map. Now drift through the rest of the universe at your own pace.",
    target: { type: "overview" },
    duration: 6000,
    icon: Compass,
  });

  return stops;
}

export const tourStops = buildTourStops();
