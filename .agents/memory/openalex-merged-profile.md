---
name: OpenAlex merged-profile disambiguation
description: The galaxy author's OpenAlex profile merges two same-named people; how the fetch script disentangles them.
---

# OpenAlex merges distinct same-named researchers into one author profile

The default author profile feeding the galaxy (`A5111365293`, "Mahendra S. Rao")
is actually **two different scientists** that OpenAlex conflated under one id:

- **Real subject** — stem-cell / developmental-neuroscience researcher. Career
  starts **1994** (Case Western / Caltech), then NIH, NIA, Johns Hopkins, Utah,
  Buck Institute, NYSCF, Q Therapeutics, XCell. Top paper: SOX2 neural stem cells.
- **Wrong person** — a carcinogenesis / peroxisome-proliferation / toxicology
  researcher in **Janardan K. Reddy's lab at Northwestern** (`A5034754078`,
  Northwestern `I111979921`), publishing **1971–2019**. NOT confined to early
  years — peroxisome/PPARα papers run into the 2000s, so a plain year cutoff
  is wrong.

**Rule:** disambiguate by **research cluster (institution + co-author)**, not by
date alone. The clean filter is: exclude Northwestern affiliation, exclude
Reddy-coauthored, plus `--min-year 1994` for a few stray earlier works. This also
deflates the merged h-index, which was inflated by the other person's papers.

**Front matter is separate, universal noise:** OpenAlex also catalogs journal
front matter as "works" (tables of contents, indexes, "Issue Information",
contributor lists), mostly from journals the subject edited. These have ~0
citations and get mis-topic-classified into bogus suns (e.g. "Economics",
"Aerospace"). The fetch script drops them **always** (not gated on
disambiguation) via `isFrontMatter()` = OpenAlex type `paratext` OR a title
regex. This is safe for any author, not just merged profiles.

**Why:** the two people share an exact display name, so name-form filtering can't
separate them; institution + co-author + min-year is the only signature that does.

**How to apply:** `scripts/fetch-galaxy.mjs` has reusable filters
`--exclude-institution`, `--exclude-coauthor` (repeatable), `--min-year`,
`--max-year` (+ `GALAXY_EXCLUDE_*` / `GALAXY_MIN_YEAR` env). When ANY filter is
active the headline author block (works, citations, h-index, i10, countsByYear,
institution) is **recomputed from kept works** because the OpenAlex author object
still reflects the merged profile. The exact regeneration command lives in the
final commit message and `replit.md`. Never regenerate `galaxyData.json` without
explicit user consent.
