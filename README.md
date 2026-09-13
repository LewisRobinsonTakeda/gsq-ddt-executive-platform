# GSQ DD&T Executive Platform

**GitHub:** https://github.com/LewisRobinsonTakeda/gsq-ddt-executive-platform (private, owner **LewisRobinsonTakeda**)

Versioned source for the GSQ GML DD&T single pane of glass — prototype spec, SharePoint seed, visual DNA, and Vibe Power Apps build prompt.

| Field | Value |
| --- | --- |
| Version | `0.2.0` — see [`VERSION`](VERSION) |
| Investment | SPOT **1063647** (do not create a second SPOT) |
| SharePoint (data entry) | https://mytakeda.sharepoint.com/sites/GSQExecutivePlatform |
| Vibe environment | `0f7bbacc-ed0b-efbc-9497-b5b75c96f91e` |
| Power BI folder | `TO DD&T Reports and Dashboards` → `GSQ DDT Executive Platform` |
| Jira (roadmap SoT) | `onetakeda.atlassian.net` — display + **Integration needed** until inbound sync |
| SPOT (financial SoT) | `tospot.azurewebsites.net` — OPEX/CAPEX display + **Integration needed** until inbound sync |

## Versioning

1. Bump `VERSION` (semver).
2. Add a `CHANGELOG.md` entry.
3. Commit on `main`.
4. Tag `vX.Y.Z` and push tags:

```bash
git tag -a "v$(cat VERSION)" -m "GSQ EP v$(cat VERSION)"
git push origin main --tags
```

Power Apps Vibe does not version itself. Export or copy generated app source into `app/` when Vibe produces a build, then tag.

| Tag | Meaning |
| --- | --- |
| `v0.x` | Prototype (SharePoint lists + staged Jira/SPOT + Vibe mockup) |
| `v1.x` | Band B MVP (Jira/SPOT inbound, 18-site Glass) |

## Repo map

| Path | What it is |
| --- | --- |
| `GSQ-DDT-Executive-Platform-PowerApps-SharePoint-Prototype.md` | Build contract for the Glass |
| `prototype/vibe-prompt.txt` | Prompt used for the frozen workbench Vibe app |
| `prototype/vibe-leadership-briefing.txt` | Prompt for the **Leadership Briefing duplicate only** |
| `prototype/ORIGINAL-APP-FROZEN.md` | Frozen original app ID / play URL — do not edit that app |
| `prototype/LEADERSHIP-BRIEFING.md` | Operator notes for the briefing copy |
| `prototype/GSQ-EP-SharePoint-Seed.xlsx` | List import seed (18 sites, THO/LEX/BRP demo) |
| `prototype/build_sharepoint_seed.py` | Regenerates the seed workbook |
| `design-assets/mockups/platform.html` | Frozen workbench visual DNA (1000-foot / Gantt / Review / Site input) |
| `design-assets/mockups/leadership-briefing.html` | Leadership Briefing copy — Takeda chrome, golden path, Explore, Ask Copilot |
| `scripts/` | Markdown → Word / walkthrough builders |

## Two surfaces (do not mix)

| Surface | Status | Open |
| --- | --- | --- |
| Workbench (original Vibe app) | **Frozen** — do not edit | [Play `6578df9f-…`](https://apps.powerapps.com/play/e/0f7bbacc-ed0b-efbc-9497-b5b75c96f91e/app/6578df9f-308b-466e-ac80-3f99f06830c8?tenantId=57fdf63b-7e22-45a3-83dc-d37003163aae) |
| Leadership Briefing (copy) | Published | [Play `69ecf8db-…`](https://apps.powerapps.com/play/e/0f7bbacc-ed0b-efbc-9497-b5b75c96f91e/app/69ecf8db-3884-4680-9c3e-62f73d9d273c?tenantId=57fdf63b-7e22-45a3-83dc-d37003163aae) · Vibe `d7c5eb38-…` |

## Write rules (do not regress)

- Site Head writes go to SharePoint only (commentary, local risk, asks, mapping, freeze).
- Never write Jira dates/status or SPOT money from this app.
- Vashi reports to Europe. Yaroslavl reports to APAC.
- Golden thread: **TO MES Elaprase DS · DDTTO-12 · SPOT 1024096**.
