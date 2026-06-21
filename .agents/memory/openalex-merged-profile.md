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
Reddy-coauthored, and drop the 3 stray pre-1994 works (→ `--min-year 1994`).
Result: 498→377 works, ~36.4k→~28.9k citations, h-index 100→90 (the merged
h-index was inflated by the other person).

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
