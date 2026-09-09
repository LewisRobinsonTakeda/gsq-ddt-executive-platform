# Changelog

All notable versions of the GSQ DD&T Executive Platform live here.
Version source of truth: `VERSION`. Git tags match `vMAJOR.MINOR.PATCH`.

## [0.1.0] — 2026-09-09

### Added
- Power Apps + SharePoint prototype specification (ten-tab Glass, 18-site selector).
- Vibe build prompt for `GSQ EP Prototype` (1000-foot One pager as home).
- SharePoint list seed workbook (`prototype/GSQ-EP-SharePoint-Seed.xlsx`) and builder script.
- Visual DNA mockups (`design-assets/mockups/platform.html`) aligned to the live Thousand Oaks 1000-foot app.
- Integration-needed labeling contract: Jira (roadmap) and SPOT (OPEX/CAPEX) are systems of record; automated pulls are not live in this version.

### Notes
- This product's only investment record is **SPOT 1063647**. Do not create a second SPOT.
- Jira host is `onetakeda.atlassian.net`. Do not write Jira dates/status or SPOT money from the Glass.
- SharePoint lists are read-only inside Power Apps Vibe; Site Head writes stay on `/sites/GSQExecutivePlatform`.
