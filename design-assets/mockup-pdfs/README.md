# Mockup PDFs — GSQ DD&T Executive Platform

Print kit for the **live** workbench (not the Leadership Briefing copy). Landscape Letter. English only.

Rebuild:

```bash
python3 scripts/build_mockup_pdfs.py
```

HTML sources sit in `html/`. Shared styles are `print.css`.

## Views

| PDF | Live tabs | What it is |
| --- | --- | --- |
| `View-Initiative-Roadmap.pdf` | Roadmap, Status KPIs, Gantt + Budget, Budget | Big Rocks × FY, heat, dates vs money |
| `View-Business-Review.pdf` | Portfolio Health | 18-site map, plant picture, six meeting beats |
| `View-Digital-Maturity.pdf` | Capability | Deploy / adopt / integration pairs |

## Tabs

| PDF | View |
| --- | --- |
| `Tab-Roadmap.pdf` | Initiative Roadmap |
| `Tab-Status-KPIs.pdf` | Initiative Roadmap |
| `Tab-Gantt-Budget.pdf` | Initiative Roadmap |
| `Tab-Budget.pdf` | Initiative Roadmap |
| `Tab-Portfolio-Health.pdf` | Business Review |
| `Tab-Capability.pdf` | Digital Maturity |
| `Tab-Risks.pdf` | Business Review support (beat 4) |

## Combined

`Combined-GSQ-DDT-Executive-Platform-Views.pdf` — cover plus every view and tab sheet.

## Sourced facts used in the mockups

SPOT Budget tab harvest as of **2026-09-13** (USD book rates EUR 1.0957, INR 0.01171, CNY 0.13895):

- All Sites TOTAL CAPEX **$15,069,520** · TOTAL OPEX **$3,540,483** · Approved CAPEX **$10,892,851**
- 58 SPOT projects in site rollups · 75 roadmap rows Integration needed · 10 sites with no harvested SPOT row
- THO TOTAL CAPEX **$1,881,671** · TOTAL OPEX **$212,359** · Approved CAPEX **$835,416** · 12 SPOT rows · 5 gaps
- Elaprase money row: **DDTTO-3 / SPOT 1024096 / TOTAL CAPEX $0** (golden thread display may still show DDTTO-12)
- APMS Thousand Oaks: **DDTTO-54 / SPOT 1051357**
- Product investment **SPOT 1063647** ($168,000) is excluded from site rollups

Initiative counts, capability percentages, commentary, asks, and risk titles are **live SharePoint** and are not invented in these PDFs.

Vashi reports to Europe (map pin stays in India). Yaroslavl reports to APAC. BUE and YAR are not listed on Org Explorer.
