import { galaxyData } from "@/data/galaxy";

export type TourTarget =
  | { type: "overview" }
  | { type: "sun"; id: string }
  | { type: "planet"; id: string };

export interface TourStop {
  title: string;
  caption: string;
  target: TourTarget;
  duration: number;
}

function buildTourStops(): TourStop[] {
  const stops: TourStop[] = [];
  const { author, stats, papers } = galaxyData;
  const domains = [...galaxyData.domains].sort(
    (a, b) => b.totalCitations - a.totalCitations,
  );

  stops.push({
    title: "Welcome",
    caption: `A lifetime of discovery by ${author.name}, mapped as a galaxy of ${stats.totalPapers} papers and ${stats.totalCitations.toLocaleString()} citations.`,
    target: { type: "overview" },
    duration: 7000,
  });

  if (domains[0]) {
    stops.push({
      title: domains[0].name,
      caption: `The brightest sun — ${domains[0].name} — anchors this universe with ${domains[0].totalCitations.toLocaleString()} citations across ${domains[0].paperCount} papers.`,
      target: { type: "sun", id: domains[0].id },
      duration: 8000,
    });
  }

  const mostCited = [...papers].sort((a, b) => b.citations - a.citations)[0];
  if (mostCited) {
    stops.push({
      title: "Most Cited Work",
      caption: `"${mostCited.title}" — cited ${mostCited.citations.toLocaleString()} times${mostCited.year ? `, a touchstone since ${mostCited.year}` : ""}.`,
      target: { type: "planet", id: mostCited.id },
      duration: 8000,
    });
  }

  for (const d of domains.slice(1, 3)) {
    stops.push({
      title: d.name,
      caption: `${d.name} — ${d.paperCount} papers and ${d.totalCitations.toLocaleString()} citations orbit this domain.`,
      target: { type: "sun", id: d.id },
      duration: 7000,
    });
  }

  stops.push({
    title: "Explore Freely",
    caption:
      "That's the highlights. Now drift through the rest of the universe at your own pace.",
    target: { type: "overview" },
    duration: 6000,
  });

  return stops;
}

export const tourStops = buildTourStops();
