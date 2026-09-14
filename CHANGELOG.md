# Changelog

All notable versions of the GSQ DD&T Executive Platform live here.
Version source of truth: `VERSION`. Git tags match `vMAJOR.MINOR.PATCH`.

## [0.3.0] — 2026-09-14

### Added
- Harvested live **GSQ EP Prototype** source into `prototype/gsq-ep-prototype-src/` (Vibe remains source of record).
- Portfolio Health world map with `%` pin placement, Site Fact plant photos (BUE uses the map pin — no Site Fact PDF), and Org Explorer site-head strip with circular photos.
- Ask Copilot on the live workbench via `ExecuteCopilotAsyncV2` / schema `new_gsqDdtExecPlatformStd`.
- Aimee Rarugal as Power Apps **CanEdit** on app `6578df9f-308b-466e-ac80-3f99f06830c8`.

### Changed
- GSQ EP Prototype is the **live** workbench again. Leadership Briefing stays the working copy — do not mix.
- Removed the Briefing tab from the Prototype (tabs: Portfolio Health, Roadmap, Status KPIs, Gantt + Budget, Budget, Risks, Capability, Ask Copilot).
- Dropped local Playwright CLI logs from the tree (do not commit `.playwright-cli/`).

### Notes
- Do not Patch SharePoint. Do not write Jira or SPOT. Title stays **GSQ DD&T Executive Platform**.
- Vashi reports to Europe in `siteOptions`; map-only VAS geography stays APAC.
- Org Explorer is source of record for site heads. BUE and YAR stay not listed.
- GitHub Settings collaborators were not changed (write access from this identity cannot invite). Power App CanEdit for Aimee is already live.

## [0.2.0] — 2026-09-12

### Added
- Leadership Briefing **duplicate** of the live Vibe workbench. Original app `6578df9f-308b-466e-ac80-3f99f06830c8` is frozen.
- Interactive briefing spec (`design-assets/mockups/leadership-briefing.html`): Takeda potx Custom 1 chrome, audience / site / scope header, Briefing golden path (Portfolio → Attention → Priority → Context → Action), Explore platforms + 18-site regional chips, restyled Roadmap / Capability / Money / Risks, Ask Copilot chips (Studio deferred).
- Vibe rebuild prompt for the copy only (`prototype/vibe-leadership-briefing.txt`).
- Freeze notice (`prototype/ORIGINAL-APP-FROZEN.md`) and operator notes (`prototype/LEADERSHIP-BRIEFING.md`).

### Notes
- Do not send Vibe Copilot prompts to the original workbench project.
- Vibe has no Save as. The copy is a new project `d7c5eb38-e1ac-4dad-b679-231853a8793c`, published app `69ecf8db-3884-4680-9c3e-62f73d9d273c`. Original `6578df9f-…` is unchanged.

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
