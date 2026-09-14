# GSQ DD and T Leadership Briefing

## Product
- Create one new desktop-first Power App named **GSQ DD and T Leadership Briefing** without opening or changing **GSQ EP Prototype**.
- Use English only and optimize the primary experience for 1920×1080.
- Present a site-leadership briefing for rapid click-through, drill-down, and back-navigation rather than a Power BI-style report.
- Use seeded local briefing content only: no new connectors, SharePoint patching, Jira writing, or SPOT writing.

## Global experience
- Show **GSQ DD and T Executive Platform** on every screen.
- Use a top navigation with tabs in this exact order: **Briefing, Explore, Roadmap, Capability, Money, Risks, Ask Copilot, Site input**.
- Open on **Briefing** by default.
- Add global controls for site, scope, and audience: site defaults to **THO Thousand Oaks** and supports 18 GSQ sites; scope supports **This site** and **Network**; audience supports **Executive**, **Site DD and T**, and **Delivery**.
- Keep drill paths obvious with clickable cards, breadcrumbs where specified, and clear back actions.
- Open Jira keys at `https://onetakeda.atlassian.net/browse/KEY` in a new window.
- Open SPOT IDs at `https://tospot.azurewebsites.net` in a new window.
- Mark unavailable live-system behavior with **Integration needed** chips.

## Visual direction
- Apply Takeda Custom 1: page `#F4F6F8`, white cards, navy `#102033` titles, and red `#E1242A` accents only.
- Use status colors exactly: On Track `#2E8B57`, At Risk `#C98900`, Delayed `#A3251B`.
- Favor executive briefing density, disciplined grids, crisp hierarchy, and restrained motion.

## Tabs and features
- **Briefing:** why we exist, KPI summary, Portfolio buckets, Attention exceptions, Priority matrix, and a Context and Action sidecar.
- **Explore:** clickable platform drill-downs including LIMS, 18 site chips including GRA, and a breadcrumb back to Briefing.
- **Roadmap:** site/network roadmap view using the seeded initiatives and filters.
- **Capability:** capability overview organized for executive, site DD and T, and delivery perspectives.
- **Money:** investment summary including Phoenix at 436k, with integration gaps clearly identified.
- **Risks:** exception-focused view emphasizing delayed and at-risk initiatives across selected scope.
- **Ask Copilot:** suggested prompt chips that navigate to relevant in-app views; chat box remains visibly disabled and marked Integration needed.
- **Site input:** read-only guidance with **Open in SharePoint** as the only write path; no SharePoint patch behavior in the app and the destination remains integration-dependent until a URL is supplied.

## Seeded briefing content
- Preserve the golden thread across views: **TO MES Elaprase DS → DDTTO-12 → SPOT 1024096**.
- THO: **DDTTO-12 Elaprase MES**, On Track, SPOT 1024096.
- THO: **DDTTO-54 APMS**, Delayed, SPOT 1041357.
- THO: **DDTTO-31 LIMS**, On Track.
- THO: **DDTTO-08 SAIL**, last go live.
- THO: **DDTTO-22 Phoenix**, 436k.
- GRA: **DDTGRA-11 LIMS**, Delayed.
- VAS: **DDTVAS-09 LIMS**, Delayed.
- Complete the 18-site selector with clearly labeled local seed entries while preserving THO, GRA, and VAS exactly.

## Data and integrations
- Keep briefing records as app-owned seeded data; no runtime connector is required.
- Treat Jira and SPOT as outbound links only.
- Treat SharePoint as an outbound-only future write path; do not patch or persist to SharePoint.
- Do not introduce live Copilot, Jira, SPOT, or SharePoint data access.

## Acceptance checks
- New app identity is correct and isolated from GSQ EP Prototype.
- Every screen carries the required platform title.
- Tab names, order, and default tab match exactly.
- Global filters and all drill/back interactions work at desktop resolution.
- Jira and SPOT links open the required destinations in a new window.
- Ask Copilot does not accept chat input.
- Site input performs no in-app write and no SharePoint patch.
- All required seeds, statuses, colors, and golden-thread references are visible in the relevant views.
