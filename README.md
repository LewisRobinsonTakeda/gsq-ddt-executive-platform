# GSQ DD&T Executive Platform

**GitHub:** https://github.com/chilr357/gsq-ddt-executive-platform (private, full project)  
**LewisRobinsonTakeda** is already an admin collaborator. Ownership transfer to that account is blocked until the empty/reserved `gsq-ddt-executive-platform` name on LewisRobinsonTakeda is freed or `chilr357` is invited to that repo.

Versioned source for the GSQ GML DD&T single pane of glass — prototype spec, SharePoint seed, visual DNA, and Vibe Power Apps build prompt.

| Field | Value |
| --- | --- |
| Version | See [`VERSION`](VERSION) |
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
| `prototype/vibe-prompt.txt` | Prompt used in Power Apps Vibe |
| `prototype/GSQ-EP-SharePoint-Seed.xlsx` | List import seed (18 sites, THO/LEX/BRP demo) |
| `prototype/build_sharepoint_seed.py` | Regenerates the seed workbook |
| `design-assets/mockups/platform.html` | 1000-foot / Gantt / Review / Site input visual DNA |
| `scripts/` | Markdown → Word / walkthrough builders |

## Write rules (do not regress)

- Site Head writes go to SharePoint only (commentary, local risk, asks, mapping, freeze).
- Never write Jira dates/status or SPOT money from this app.
- Vashi reports to Europe. Yaroslavl reports to APAC.
- Golden thread: **TO MES Elaprase DS · DDTTO-12 · SPOT 1024096**.
