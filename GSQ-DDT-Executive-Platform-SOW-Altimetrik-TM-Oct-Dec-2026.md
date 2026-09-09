# STATEMENT OF WORK

**Draft for Takeda legal / procurement review — 9 September 2026**  
Time & Material · 01 October 2026 through 31 December 2026  
Based on the Altimetrik GSQ GML DD&T T&M form; Insight Center leftover language removed.

---

This Statement of Work (“**SOW**”), effective as of the date of last signature below (“**SOW Effective Date**”), is entered into by and between **Takeda Pharmaceuticals International AG**, a company incorporated in Switzerland under identification number CHE-113.444.401, having its registered office at Thurgauerstrasse 130, 8152 Glattpark (Opfikon), Switzerland (“**Takeda**”) and **Altimetrik Corp**, a company incorporated in Michigan, USA, with registration number 800029966, having its registered office or principal place of business at 1000 Town Center, Suite 700, Southfield, Michigan, 48075 (“**Company**”). This SOW is incorporated into and shall be governed by the Master Services Agreement by and between Takeda and Company dated March 1, 2023 (“**Agreement**”). Capitalized but undefined terms shall have the meanings first ascribed to them in the Agreement.

---

## 1. Identification

| Field | Value |
| --- | --- |
| TAKEDA Project NUMBER | **1063647** |
| PROJECT NAME | GSQ DD&T Roadmap Executive Platform MVP |
| Also known as | Executive Platform · Executive Glass · Single pane of glass |
| Investment record | SPOT **1063647** only. Company shall not create, request, or treat as in-scope a second SPOT project. |
| SPOT board | https://tospot.azurewebsites.net/project-hub/78dd4329-ece5-4796-8cab-776d8ce7af17/project-board |
| Takeda Business Sponsor | Joel Vincent |
| Takeda Product Owner / Project Manager | Dean Santoro |
| Takeda Co-Project Manager | Lewis Robinson |
| Takeda invoice contact | Dean Santoro |
| Company Client Partner | Bipin Bhaskar |
| Company Engineering Leader | Srinath Parthasarathy |
| Project Initiation Date | 01 October 2026 |
| Project Completion Date | 31 December 2026 |
| Commercial model | Time & Material, not to exceed the Maximum Project Budget in §17 |
| Delivery track | Product (executive portfolio + business review). Not a Pattern catalogue item. |
| Pattern-Fit (working) | Custom Build (Glass) + reuse of live Power Apps / Power BI embeds. FORM-316177 remains Takeda’s to file; Company shall design and build to that path. |

---

## 2. Governing specifications and order of precedence

The Services are the **Band B integrated MVP** defined in this SOW and in the Takeda Business Design Package. Company shall not treat generic Agile language, a thin shell, or a single-source dashboard as satisfaction of this SOW.

**Exhibit A (binding functional and non-functional specification):** *GSQ GML DD&T Roadmap Executive Platform — Business Design Package* (Design Blueprint, September 2026), including target-state mockups (Figures 12–15) and live source experiences (Figures 1–11).

**Exhibit B (onboarding / control context, non-fee):** TakOS walkthrough, TakOS onboarding readiness, and submission checklist for SPOT 1063647. Exhibit B does not expand fees. It does define host names, delivery Jira space, and records Company must not invent.

If documents conflict, the following order prevails:

1. The Agreement.
2. The commercial, liability, and payment terms of this SOW.
3. The required Services, write rules, out-of-scope list, Deliverables, and Acceptance Criteria of this SOW.
4. Exhibit A (Design Blueprint).
5. Exhibit B and other design-pack documents.
6. Company’s execution methodology in §12.

Company’s methodology, sprint plans, and “final deliverables agreed in sprint” language **may sequence work**. They **may not** drop a Required Service, required data source, required tab, or Acceptance Criterion without a written Additional Work or written Takeda waiver under §18.

The phrase “Insight Center” and any Data Mart / DDM / MAF-only obligation in the source T&M form **do not apply** to this SOW.

---

## 3. Description of Services

Company shall provide Time & Material technical-delivery Services to design, build, integrate, test, deploy, pilot, document, and hand off the **GSQ DD&T Roadmap Executive Platform MVP** (the “**Platform**”) so that GSQ Manufacturing & Labs leadership can run a Thousand Oaks business review from one maintained portal fed by **Jira, SPOT, and capability/EDB data**, with **Site Head commentary as the only write path**.

The working MVP, testing, Thousand Oaks pilot, and acceptance shall represent **all three platform components** and **all three required data sources**. Any limitation in source access, quality, integration, or functionality shall be documented in the MVP Assessment Report and shall **not** be described as accepted unless the designated Takeda acceptance authority approves a written exception.

### 3.1 Product hypothesis Company must prove

Company shall implement the Platform so that the following can be tested in the Thousand Oaks pilot (not merely asserted):

1. Jira holds enough portfolio and delivery data for executive roadmap reporting.
2. SPOT holds enough investment and project information for executive reporting.
3. EDB (or the approved Capability Tracker semantic contract if the EDB data product is late) holds enough deployment, adoption, utilization, and capability data for value-realization insight.
4. Site Heads can enter the commentary, local risk, mapping, and leadership asks that those systems do not hold.
5. One Thousand Oaks business review can be run from the portal, including a freeze pack.
6. The pattern is reusable: site is a first-class control, not a hard-coded Thousand Oaks app.

**Band A (thin shell) is not this SOW.** A site drop-down wrapped around today’s tabs without live Jira + SPOT + Capability/EDB, without Site input, or without a Business Review freeze **does not** meet the Services.

### 3.2 Required platform components

| ID | Component | Required MVP scope | Required data sources |
| --- | --- | --- | --- |
| C1 | GSQ DD&T Roadmap | Executive portfolio health, initiative tracking, six Big Rocks × FY roadmap, milestones, delivery status, investment context, risks, dependencies, drill-down | Jira + SPOT + relevant EDB / Capability |
| C2 | Thousand Oaks Business Review pilot | Site experience for initiative status, delivery and investment measures, KPIs, review beats, Site Head input, freeze pack, reusable review pattern | Jira + SPOT + relevant EDB / Capability |
| C3 | Business Capability / North Star | Deployment, integration, adoption, utilization, maturity, and value-realization experience bound to the selected site | EDB **and/or** Capability Tracker embed with plant parameter / RLS; Jira + SPOT context |

### 3.3 Required application services (nothing optional)

Company shall deliver a single Executive Glass shell. Changing **Site** re-queries every tab. It does not open a different application.

**Chrome (always visible)**

- Takeda mark and product title “DD&T Executive Platform”.
- **Site selector** for all **18** GSQ M&L sites (searchable; code + name). Thousand Oaks must not remain hard-coded.
- Scope toggle: **This site** / **Network**.
- Source freshness stamp for Jira, SPOT, EDB/Capability, and last Site Head save. A failed sync shall not present stale data as current.
- Search across project / initiative / SPOT ID / Jira key.
- Filters: FY, Big Rock, Platform, Risk, Programme vs site-led.
- Identity: Entra SSO; role and site entitlements visible.

**Site master Company shall load (codes are contractual)**

| Region | Site | Code | MVP note |
| --- | --- | --- | --- |
| Americas | Lexington | LEX | Capability Tracker already live |
| Americas | Thousand Oaks | THO | Business-review pilot |
| Americas | Brooklyn Park | BRP | Capability Tracker already live |
| Americas | Naucalpan | NAU | Honest empty state if mapping is thin |
| Americas | Buenos Aires | BUE | Honest empty state if mapping is thin |
| Asia-Pacific | Tianjin | TJN | Honest empty state if mapping is thin |
| Asia-Pacific | Osaka | OSA | SAIL deployed |
| Asia-Pacific | Hikari | HIK | Honest empty state if mapping is thin |
| Asia-Pacific | Singapore | SGP | Honest empty state if mapping is thin |
| Asia-Pacific | Yaroslavl | YAR | Reports to APAC |
| Asia-Pacific | Bekasi | BEK | Honest empty state if mapping is thin |
| Europe | Grange Castle | GRA | Honest empty state if mapping is thin |
| Europe | Bray | BRY | Honest empty state if mapping is thin |
| Europe | Linz | LIN | SAIL deployed |
| Europe | Oranienburg | ORA | Honest empty state if mapping is thin |
| Europe | Singen | SNG | Honest empty state if mapping is thin |
| Europe | Neuchatel | NEU | Honest empty state if mapping is thin |
| Europe | Vashi | VAS | Reports to **Europe**, not APAC |

Sites other than THO, LEX, and BRP may show honest empty states. They must still appear in the selector. Company shall not ship an 18-site selector that only contains Thousand Oaks.

**Required tabs — each is a Service**

| Tab | Company shall deliver | Binding rules |
| --- | --- | --- |
| One pager | Six Big Rocks × FY26–FY28+ site roadmap; sidecar; Open Jira board | Visual DNA = live TO Roadmap Power App. Drag-and-drop writes `project_map` only — **never** Jira dates or status. |
| Status KPIs | Active / on track / at risk / blocked counts for the selected site | One canonical RAG language (see §3.3.1). Counts must be honest and source-traced. |
| Gantt + Budget | Combined timeline + budget/forecast/actual/variance on the same row | Visual DNA = combined Gantt+Budget Power App. Financials **read-only**. Today marker required. Planning FY ≠ date span. |
| Budget | Finance-first view: approved, forecast, actual, remaining, variance; by FY / Big Rock / programme vs site-led | Visual DNA = MYC Budget 2026 Power App. Reconcile to SPOT within ±1% or $1,000, whichever greater, for the pilot site. Site Head comment on a variance line may write to Dataverse only. |
| Risks | Leadership-airtime risks | Auto from Jira statuses `{monitor, leadership, blocked}` and Impediments; plus Site Head / PMO local risks in Dataverse. Local risks expire or promote within one review cycle. |
| Jira | Live site backlog | Columns: Key, Type, Summary, Status, Assignee, Due, SPOT, Big Rock. **No status write-back.** Host is `onetakeda.atlassian.net`. Manufacturing source is **DDTGMPORT** and site projects — not the delivery Initiative. |
| Capability | North Star deploy / adopt / integrate | Embed Capability Tracker; pass Plant = selected site **without bypassing Power BI RLS**. EDB bind is in-scope as a gated increment (see §3.4). Acceptance: THO, LEX, BRP match the published tracker after equivalent filters. |
| Business Review | Meeting surface + freeze pack | Six beats: snapshot, Big Rocks, money vs time, risks, North Star, asks. Freeze pack is a dated PDF and/or PowerPoint snapshot from the portal (Power Automate acceptable). One TO review must be run from the portal. |
| Site input | **Only write path** | Commentary, local risk, go-live confirmation, leadership ask, mapping correction. All writes attributable (user + timestamp). No shared mailbox. Soft delete; retain history for the review cycle + 2 years (or Takeda records policy if stricter). Go-live confirmation **does not** change Jira. |
| Network roadmap | Executive 34-programme / 573-project picture | Reuse the existing global roadmap prototype/API. Clicking a site code **sets the Glass site selector** and returns to that site’s One pager. Production hardening of hosting is Band C / Additional Work unless delivered inside the ceiling. |

**§3.3.1 Canonical status.** Company shall map all current vocabularies to: `on_track`, `monitor`, `leadership`, `blocked`, `planning`, `complete`, `cancelled`. Initiative RAG = worst open child (Leadership > Blocked > Monitor > On Track). Authored initiative RAG that contradicts children is not permitted. Complete and Cancelled are excluded from active / at-risk counts. Colour-blind-safe glyphs; not red/green alone.

**§3.3.2 Six Big Rocks (One pager columns, contractual labels)**

1. One Day Batch Release  
2. Lab of the Future  
3. Predictive Maintenance  
4. Rapid Digital Tech Transfer  
5. Inventory Optimization  
6. Power of Digital Twins  

A project has exactly one primary Big Rock on the One pager.

**§3.3.3 Deep links.** Opening Jira, SPOT, a child Power App, or Power BI **preserves site + entity**. Closing the child returns to the same tab and selection. Company shall pass context, not copy systems of record.

### 3.4 Required data, integration, and persistence services

Company shall implement inbound-only sync (except Dataverse writes in §3.5):

```
Jira REST   ──┐
SPOT API    ──┼──> scheduled sync (15–60 min) ──> Dataverse staging ──> Glass
EDB API     ──┘         └── freshness stamp on chrome
Power BI    ───────────── embed (no nightly copy of visuals)
Existing Power Apps ─── navigate / embed with site + key
```

| Service | Company shall |
| --- | --- |
| Jira consumption | Read `onetakeda.atlassian.net`. Programme list from **DDTGMPORT** Initiatives. Site projects from keys such as `DDTTO`, `DDTBP`, `DDTBRY` plus site custom field. SPOT ID from the custom field already used on manufacturing tickets (example: TO MES Elaprase DS — SPOT **1024096**). Impediments by type. Go-live from due / targeted end. **Week-1 8-hour PMO field workshop** to lock custom fields is in-scope. |
| Delivery vs data Jira | Delivery Initiative and seed Epics belong in space **AI&Data PDT.GSQ / AIDPG**. **DDTGMPORT is a manufacturing data source, not the delivery project.** Company shall not create the delivery Initiative in DDTGMPORT. |
| SPOT consumption | Per project / WBS: ID, name, site, approved, forecast, actual, FY split, sponsor, PM, milestones, risk, status. Consume manufacturing SPOT IDs **and** platform SPOT **1063647**. Financials remain read-only in the Glass. |
| EDB consumption | Business case requires EDB in the MVP, not later. Use only an approved data product (PostgREST style `GET v1-0-0/<table>`, bearer token). Until the steward names tables, the Capability Tracker model is the semantic contract. If the API is late, Company shall still ship the Capability embed and complete EDB bind as the last increment **inside this SOW** if access arrives; if access does not arrive, Company shall document the gap in D8 and shall not call EDB “accepted.” |
| Dataverse (or Takeda-approved TakOS store) | Persist and secure the entities in §3.5. Replace Power App draft collections. Draft collections are not production. |
| Identity for APIs | Application registration + least privilege. **No personal Atlassian token in the product.** |
| Reconciliation | TO MES Elaprase DS (SPOT 1024096) must show the same Jira key, SPOT ID, and dates in sidecar, Gantt, Budget, and Jira tab. |

**Required Dataverse / equivalent entities:** `site`, `user_site_role`, `initiative`, `project`, `project_map`, `financial`, `capability`, `integration`, `site_commentary`, `local_risk`, `leadership_ask`, `review_freeze`, `status_map`, `audit`.

### 3.5 Required write-path services

| Form | Fields | Who | Writes to | Shall not |
| --- | --- | --- | --- | --- |
| Review commentary | Period, Big Rock (opt), narrative, sentiment (on track / watch / off) | Site Head, Site DD&T | `site_commentary` | Write Jira or SPOT |
| Local risk | Title, severity, owner, due, related Jira/SPOT, mitigation | Site Head, PMO | `local_risk` | Silent Jira create in MVP unless Takeda later approves write-back as Additional Work |
| Go-live confirmation | Project, confirm / change request, reason | Site DD&T | Dataverse | Change Jira dates |
| Leadership ask | Ask, decision needed by, $ or people impact | Site Head | `leadership_ask` | |
| Mapping correction | Project → Big Rock / FY / platform | PMO, Site DD&T | `project_map` + audit | Change Jira |
| Freeze pack | Site, period, artifact URL | Review facilitator | `review_freeze` | Become a second data store |

**Golden thread Company shall implement:** SPOT investment → Jira Initiative/Programme → site project → Dataverse commentary → Business Review freeze.

### 3.6 Required reuse — do not rebuild the existing apps

Company shall **reuse or embed** the following live experiences as UX specification and, where technically faster, as parameterized runtime. Company shall **not** spend this SOW inventing a second One pager, a second Budget app, or a second Capability Tracker.

| Asset | ID / location | Use |
| --- | --- | --- |
| Thousand Oaks Strategic Roadmap Power App | App `83afccd8-23f4-4ba1-9416-9059f69cd304` · env `13ab3896-86ac-e9d1-8a83-257843921f13` | One pager / KPI / Risks visual DNA; parameterize by site; bind to Dataverse |
| DD&T MYC Budget 2026 Power App | App `c683f980-1fb1-4917-b70c-34496646e6d3` · env `d99720be-f155-e674-86b3-32acc687394e` | Budget tab visual DNA |
| Combined Gantt + Budget Power App | App `5d55a550-7d80-469a-84bc-bee2f53a08b3` | Gantt + Budget tab visual DNA |
| Capability Tracker Power BI | Existing plant-parameter / RLS report | Capability tab embed |
| Global DDT roadmap prototype | Existing 34-programme / 573-project views | Network tab reuse |

Target-state mockups in Exhibit A Figures 12–15 are the visual specification for the **new** Glass chrome, Business Review, and Site input. They are not a licence to ignore the live apps.

### 3.7 Required technical, security, ALM, and quality services

Company shall provide:

- Technical discovery and detailed solution design: architecture, data flows, integration patterns, environments, NFRs, and delivery controls for C1–C3 and Jira + SPOT + EDB/Capability.
- Front-end development of the Glass (Power Apps **or** TakOS UI if the Marketplace POD is assigned immediately). One experience; two layers (experience + data). Company shall not deliver two disconnected products.
- Back-end / Dataverse services, business logic, APIs, reusable components, and application-layer data models.
- Data engineering and data-product work for Jira, SPOT, and EDB: approved ingestion or access, transformations, mappings, lineage, quality checks, freshness, exception handling, documented limitations.
- Security design and implementation: Entra SSO; default-deny; entitlement by Entra group × site; executives all sites; Site Head / Site DD&T home site; finance financial entities only if licensed; embeds inherit Power BI RLS; logging; secure configuration; required reviews.
- Working classification for the **portal** (not for MES/LIMS): **GxP No** (reporting / decision support, not batch record); **Criticality Medium**; **SOX Review** (display-only DD&T budget; finance to confirm); **PII Low** (names, work emails). Conservative classification applies while a question is open. Customer data, batch genealogy, and lab-result **content** are out of MVP.
- Non-functionals: Jira/SPOT refresh ≤ 60 minutes; commentary instant; site tab interactive < 3 seconds after cache; Edge / Chrome enterprise; English only (no mixed PT/EN strings); sync failures visible on chrome.
- ALM: Dev → SIT → Prod solutions; **no direct-production edits**.
- Functional, integration, data-quality, security, regression, and applicable performance testing; defect triage; release-readiness evidence; traceability from Exhibit A acceptance tests to stories.
- Deployment and environment promotion using Takeda-approved SDLC, qualification, change, DevOps, and release controls applicable to a non-GxP Medium-criticality Product.
- Observability of sync health.

### 3.8 Required Thousand Oaks pilot and hypercare

- Capture a week-1 baseline of slide-building / status-chasing hours for the Thousand Oaks DD&T business review.
- Support Takeda-executed UAT by the TO Site Head and sponsors in the final three weeks of the period.
- Complete **one** Thousand Oaks business review from the portal (target aligned to SPOT milestone **Pilot 11 December 2026**).
- Target: slide-building hours for that review drop by ≥70% versus the week-1 baseline (measured; not a fee-hold unless Takeda later so agrees in writing).
- Hypercare inside the SOW period after the pilot review: defect fixes for blocker / critical / agreed major defects.
- Capture pilot feedback on usefulness, usability, data confidence, reporting effort, and reuse.

### 3.9 Required documentation and knowledge transfer

Company shall deliver current technical, data-lineage, API, integration, configuration, security, test, deployment, operations/runbook, support, and user documentation, plus completed knowledge-transfer sessions and a written handoff record to the Takeda product owner and named ops alias.

### 3.10 Explicitly out of scope (do not do; do not bill as MVP)

The following are **not** Services under this SOW unless authorized as Additional Work:

- Rebuilding the existing Power Apps as a green-field invention of the 1,000-foot layout.
- Creating a second SPOT project.
- Jira or SPOT write-back (including silent status or date edits from the Glass).
- Guaranteeing Thousand Oaks mapping quality on all 18 sites.
- AI executive briefing / auto-narrative.
- Full TakOS Design System rewrite of every tab (Release 2).
- Mobile-native client.
- Automated business-review video.
- GxP execution, batch record, customer data, or lab-result content.
- Replacing Jira, SPOT, or EDB.
- Pixel-perfect clone of every historical Power BI page.
- Creating the AIDPG Initiative, FORM-316177, URS/FDS, or Marketplace order (Takeda onboarding). Company **shall** consume the Initiative key once Takeda creates it and shall structure the delivery backlog under it.
- New EDB modeling if no consumable data product exists (that is a data-platform initiative). Company shall still ship Capability embed.
- Band A thin shell sold as the MVP.

---

## 4. Responsibilities and accountability

| Takeda / GML business-design responsibilities | Company technical-delivery responsibilities |
| --- | --- |
| Own business outcomes, personas, decisions, workflows, KPI definitions, calculation intent, value measures, prioritization, and business acceptance. | Translate the approved Business Design Package (Exhibit A) into detailed technical designs, AIDPG backlog items, estimates, sprint plans, architecture, data models, services, APIs, integrations, security controls, code, tests, deployments, and technical documentation. |
| Provide or approve Exhibit A, mockups, source-system owners, data definitions, access requests, environments, governance contacts, SMEs, test users, and timely decisions. | Validate technical feasibility and source-data suitability; implement Jira, SPOT, and EDB/Capability connectivity using approved patterns; maintain delivery evidence and traceability to §7. |
| Create and maintain SPOT **1063647** (already live). Create the AIDPG Initiative and seed Epic shells when Takeda so decides. File Pattern-Fit and Intake records. | Do not create a second SPOT. Do not create Jira records unless the Takeda Product Owner expressly instructs it in writing. When instructed, create only in **AIDPG**, type **Initiative** (not Task), summary `1063647 — GSQ DD&T Roadmap Executive Platform MVP`, Open in SPOT → 1063647. |
| Execute UAT and grant written business acceptance through the Product Owner and Business Sponsor. | Support UAT, defect resolution, release readiness, deployment, pilot hypercare, documentation, knowledge transfer, MVP assessment, and Releases 1–3 roadmap. |
| Remain accountable for business-process design and for confirming the product supports intended leadership decisions. | Remain accountable for technical delivery quality. Company shall not invent unapproved business processes, KPI definitions, or business policy. |

**Named Takeda day-1 dependencies Company may escalate if late**

| Dependency | Owner | Needed |
| --- | --- | --- |
| Power Platform environment + premium licenses | DD&T / IT | Week 1 |
| Entra groups per role × site | IAM + Dean Santoro | Week 1 |
| Jira read (DDTGMPORT + site projects) on `onetakeda.atlassian.net` | Jira admin | Week 1 |
| SPOT API / report access (manufacturing IDs **and** 1063647) | SPOT admin | Week 1 |
| Power BI embed for Capability Tracker | BI owner | Week 2 |
| EDB data-product steward + environment | EDB / AI&Data | Week 2–3 |
| TO Site Head UAT time | Site leadership | Weeks 9–11 |
| Marketplace / TakOS POD assignment (if Company is that POD) | Marketplace | After order |

---

## 5. Measurable Deliverables

“Final deliverables agreed in sprint” **adds evidence and dates**. It does **not** replace this table.

| ID | Deliverable | Required evidence / measurable completion |
| --- | --- | --- |
| D1 | Approved integrated MVP technical design | Architecture, component design, data-flow diagrams, interface inventory, security design, NFRs, environments, ALM, dependencies, and review decisions for C1–C3 and Jira + SPOT + EDB/Capability. |
| D2 | Prioritized and traceable product backlog | Eight seed Epics in §8 plus INVEST stories mapped to each required tab, each data source, each Deliverable, acceptance criteria, owners, dependencies, and sprint plan. Stories remain **not Ready** until Takeda URS/FDS exists if TakOS so requires; Company shall still maintain the Epic structure and draft stories from Exhibit A §15. |
| D3 | Jira, SPOT, and EDB/Capability data products | Working approved connections or interfaces; mapped fields; transformations; lineage; quality/freshness results; exception handling; documented source limitations; freshness on chrome. |
| D4 | Integrated Executive Platform MVP | Working Glass in a Takeda-approved environment covering **all tabs in §3.3** for Thousand Oaks, site selector for 18 sites, LEX switch, Capability embed, Site input writes, Business Review freeze. |
| D5 | Security and operational controls | Approved access model, Entra/authorization implementation, logging/monitoring, security evidence, Dev→SIT→Prod procedures, support/runbook. |
| D6 | Testing and pilot evidence | Test plan, cases, results, defect log, traceability to §7, UAT support evidence, TO pilot feedback, release-readiness record, week-1 hour baseline and post-pilot hour measure. |
| D7 | Documentation and knowledge transfer | Current technical, data, API, integration, configuration, test, deployment, support, and user documentation; KT sessions; handoff record; named ops alias. |
| D8 | MVP Assessment Report | Evidence-based assessment of feasibility, usability, data quality, performance, security, adoption, utilization, maturity, value-realization capability, limitations, risks, reusable patterns, and recommended go-forward decision. Shall not describe a Band A shell as an accepted Band B MVP. |
| D9 | Roadmap for Releases 1 through 3 | Prioritized roadmap grounded in MVP evidence: release objectives, features, dependencies, risks, architecture and scale, ownership/support, planning assumptions. Release 2+ may include Jira/SPOT write-back, 18-site mapping quality, TakOS Design System rewrite, EDB productionization. |
| D10 | Data model | Scalable application-layer data model for the entities in §3.4, documented lineage, Takeda data-governance alignment, tested, passed applicable SDLC/qualification for this classification. |
| D11 | Seed Epic set | The eight Epics in §8, parented to the AIDPG Initiative once Takeda creates it, each with in/out scope, owner, dependencies, and capability-level acceptance. |

---

## 6. Workstreams Company shall perform (Band B WBS)

These workstreams are Services. Hours are the Takeda design estimate (~1,104 delivery hours). Company may re-sequence; Company may not omit a row to fit the ceiling without §18.

| ID | Workstream | Est. hours |
| --- | --- | --- |
| B1 | Kickoff, PMO field workshop, status mapping, 18-site master load | 40 |
| B2 | Environment, solution, Entra groups, ALM (Dev→SIT→Prod) | 32 |
| B3 | Dataverse model + audit + security roles | 80 |
| B4 | Jira connector + staging + status map (DDTGMPORT + site projects) | 80 |
| B5 | SPOT connector + financial staging (manufacturing IDs + 1063647) | 64 |
| B6 | Executive Glass chrome + site selector + filters + freshness | 72 |
| B7 | One pager bound to Dataverse (replace collections) | 80 |
| B8 | Status KPIs live | 32 |
| B9 | Combined Gantt + Budget | 96 |
| B10 | Budget tab | 48 |
| B11 | Risks + Jira tab | 48 |
| B12 | Capability embed + plant parameter / RLS; EDB increment if API ready | 40 |
| B13 | Site input forms + Business Review + freeze pack | 88 |
| B14 | Network roadmap hookup (reuse prototype) | 40 |
| B15 | UX language cleanup; empty / error / stale states | 24 |
| B16 | Functional test + data reconciliation (incl. SPOT 1024096 thread) | 80 |
| B17 | UAT (TO Site Head + sponsor) + defects | 64 |
| B18 | Admin guide + hypercare inside the SOW period | 40 |
| B19 | PM / coordination / evidence pack | 56 |
| **Total** | **Required Band B** | **1,104** |

---

## 7. Binding Acceptance Criteria

Final acceptance authority is the Takeda Product Owner (Dean Santoro) and Business Sponsor (Joel Vincent), documented in writing. **All** of the following must be true, or a written exception recorded on the AIDPG Epic / this SOW’s acceptance record:

1. A user with TO Site Head role opens the Platform, sees **Thousand Oaks** pre-selected, and can switch to **Lexington** and get a different One pager.
2. One pager, KPIs, Gantt+Budget, Budget, Risks, Jira, Capability, Business Review, and Site input all honor the selected site.
3. TO MES Elaprase DS shows the same Jira key, SPOT ID (**1024096**), and dates in sidecar, Gantt, Budget, and Jira tab.
4. Budget totals for the pilot site reconcile to SPOT within ±1% or $1,000, whichever greater.
5. Capability tab for LEX and BRP matches the current tracker after equivalent filters.
6. Site Head can save commentary and a leadership ask; both appear on Business Review; audit shows name and time.
7. Dragging a card on the One pager does not change Jira; it changes `project_map` only.
8. Freshness is visible; a failed Jira sync does not show silent old data as current.
9. One Thousand Oaks business review is completed from the portal; freeze pack stored.
10. Security: a BRP-only user cannot see TO financials.
11. Jira, SPOT, and Capability/EDB are each represented by a working, Takeda-approved MVP integration or embed, with mappings, lineage, quality/freshness evidence, error handling, and known limitations documented.
12. No open blocker or critical defects remain. Treatment of lower-severity defects is documented and approved. Minor defects may close in hypercare.
13. D1–D11 exist and are accepted or formally excepted.
14. Company has not written to Jira or SPOT from the Glass (except a Takeda-approved, separately documented impediment action).

---

## 8. Required backlog structure (AIDPG)

When Takeda instructs Jira creation, Company shall use:

- **Host:** `onetakeda.atlassian.net` (not `takeda.atlassian.net`).
- **Space:** AI&Data PDT.GSQ.
- **Project:** AIDPG. Initiatives appear on **AIDIN : Initiatives** and land in **Initiate**.
- **Issue type:** Initiative — the Create dialog defaults to **Task**; Company shall change it.
- **Summary:** `1063647 — GSQ DD&T Roadmap Executive Platform MVP`.
- **Open in SPOT / SPOT ID:** 1063647 and the board URL in §1.
- **Owners:** Sponsor Joel Vincent; PM Dean Santoro; Co-PM Lewis Robinson.

**Eight seed Epics (D11) — each is a Service capability**

1. Executive Glass shell and site master  
2. One pager / KPI persistence  
3. Combined Gantt + Budget and Budget tab  
4. Jira inbound sync  
5. SPOT inbound sync  
6. Capability Tracker embed (+ EDB increment)  
7. Site input and Business Review freeze  
8. Security, ALM, UAT  

Company shall not write a full Ready story backlog before Takeda URS/FDS if TakOS requires documents to lead. Company **shall** still maintain Epics and draft stories from Exhibit A so UAT has something to test.

---

## 9. Timetable and milestones

All Services shall be performed within **01 October 2026 through 31 December 2026**. Sprint boundaries are managed in the Agile plan. The following completion conditions are contractual.

| Milestone | Completion condition | Target date |
| --- | --- | --- |
| M1 Mobilization and scope confirmation | Governance, access plan, integrated MVP boundary, roles, dependencies, success measures, site master load plan, and delivery plan confirmed. Week-1 field workshop scheduled. | 12 October 2026 |
| M2 Technical design and backlog baseline | D1 and D2 reviewed; Jira, SPOT, and EDB/Capability integration approach and security dependencies confirmed; eight Epics structured. | 26 October 2026 |
| M3 Integrated build increment | Demonstrable Glass increment includes each of C1–C3 and evidence of each required data source; site selector works THO↔LEX. | 27 November 2026 |
| M4 Test and Thousand Oaks pilot readiness | D3–D6 sufficiently complete for pilot and UAT under agreed entry criteria. Aligns to SPOT **MVP Build 20 November 2026** / **Pilot 11 December 2026**. | 04 December 2026 |
| M5 MVP completion and handoff | §7 satisfied or exceptions formally approved; D7–D11 delivered; KT and handoff complete. | No later than **31 December 2026** |

SPOT 1063647 also shows Execution End 13 November 2026 and Close / Depreciation 22 January 2027. Those dates are Takeda investment dates. **This SOW does not extend past 31 December 2026** unless Additional Work or an amendment so provides. Work after 31 December 2026 (including January hypercare or Band C) is Additional Work.

---

## 10. Roles and responsibilities (delivery team)

Company shall staff an Enablement / Discovery / Engineering capability sufficient to perform the Services. Titles may map to Company’s rate card; the **functions** are required.

### 10.1 Enablement

| Role | Responsibilities for this Platform |
| --- | --- |
| Program Management leader | End-to-end delivery of this SOW; stakeholder liaison; engineering rigor; Execution Roadmap; status to Dean / Joel / Lewis; support technical design with Takeda and other vendors. **Not** an Insight Center data-migration programme. |
| Solution / Data Architect | Data strategy for Jira + SPOT + EDB/Capability + Dataverse; models, loading, governance, quality, lineage, monitoring; alignment with Takeda EDB/DDM standards **as they apply to this Product**. No obligation to redesign Takeda’s enterprise data platform. |
| QA Lead / Architect | Validation approach aligned to **GxP No / Medium / SOX Review / PII Low**; test plan, strategy, automation, coverage of functional and integration touch points; UAT defect governance. |

### 10.2 Discovery

| Role | Responsibilities for this Platform |
| --- | --- |
| Proxy PO / BA | Bridge GML business and engineering; document functional and non-functional requirements from Exhibit A; split INVEST stories; clarify queries; document data lineage and field maps from the week-1 workshop. |

### 10.3 Engineering scrum

| Role | Responsibilities for this Platform |
| --- | --- |
| Scrum Master + delivery lead | Ceremonies; sprint output; dependencies; RAID. |
| Integration / data engineer | Inbound Jira, SPOT, and EDB/Capability pipelines; transformations; verification; lineage; security compliance; **not** “pick up from the Insight Center Data Mart” unless Takeda later names that mart as the approved product. |
| Glass / front-end developer | Shell, tabs, embeds, Site input, Business Review, freeze; unit tests; documentation. |
| Back-end / Dataverse developer | Services, APIs, security roles, audit. |
| Tester / Quality engineer | Cases, execution, results, automation per strategy, backlog alignment. |
| Power BI embed (fractional) | Capability Tracker plant parameter / RLS; no bypass. |

### 10.4 AI-enabled team (TakOS / agentic coding)

If Company uses AI coding tools on this SOW, Company shall do so only under Takeda Agentic Coding Acceptable Use, named-user tokens, and the TakOS controls in Exhibit B. AI does not relax §7, ALM, or attribution.

| Function | Outcome required on this Platform |
| --- | --- |
| AI Engineering Lead | Standards for prompting and review; quality; responsible use; no secrets (Jira tokens, client secrets) in repo, chat, or screenshots. |
| AI Product Orchestrator | Frame Exhibit A requirements; keep business logic accurate. |
| AI Pair Programmer / Code Curator | Generate, validate, refactor, and own maintainable code. |
| AI Solution Architect | Options inside the Glass + reuse + inbound-sync constraint. No second SPOT. No Jira write-back. |
| AI Test Orchestrator | Cases and edge coverage for §7, including THO↔LEX, 1024096 thread, and BRP isolation. |
| AI Experience Designer | Variations that preserve Takeda chrome and the live Power App DNA. |
| AI Delivery Steward | Plan and track B1–B19 and D1–D11. |
| AI Ops & Automation | CI/CD, monitoring, no direct-prod edits. |

Company shall **not** bill generic “AI Data Modeler / ML dataset” work that is not required for this reporting Glass.

---

## 11. Altimetrik execution methodology (adapted)

Company shall use an Agile, output-driven approach: INVEST stories, collaborative scrums, SOLID design, quality-engineering automation, and DevOps consistent with Takeda controls.

- High-level requirements enter the AIDPG backlog as the **eight Epics in §8**.
- The Takeda Product Owner (or Proxy PO under the Product Owner) defines INVEST stories.
- Acceptance Criteria for each story shall: define boundaries; reach consensus with the Product Owner; serve as the basis for positive and negative tests; and support estimation. Exhibit A §7 screen acceptance and this SOW §7 are the starting set.
- **Definition of Done** for every story: demonstrable on a Takeda-approved environment; enough documentation to support the story; testing embedded; no Jira/SPOT write from the Glass; freshness/error states honest; ALM path used.
- **Use-case exit:** module complete when its §3 tab or workstream meets its Exhibit A acceptance and is in the SIT/UAT path.
- Takeda defines UAT during discovery and executes UAT. Company unblocks. UAT complete = tests complete with no open blocker/critical defects. Minor defects may close in hypercare.
- This programme shall leverage Takeda agile delivery methodology, guidelines, controls, and workflows for **non-GxP** Product work (and GxP workflows only if classification changes). That is binding. Company thought leadership may improve method; it may not weaken control.

Hand-off to UAT after code is in the **agreed UAT environment**. Production movement follows Takeda change control. The source form’s “hand-off after Production” sentence is replaced by this paragraph.

---

## 12. Execution assumptions

1. Takeda shall ensure timely support from required stakeholders for validation, reviews, sign-offs, and process flows. Delay may affect cost and timeline and is handled under §18 if fees or ceiling must change.
2. Takeda shall ensure knowledge transfer from the current Power App / PBI / PMO owners, including the three live apps in §3.6.
3. Takeda shall provide environments, infrastructure, and access (Jira, SPOT, EDB, Power Platform, Entra, repos) in a timely manner. API access is the critical path; slip is day-for-day on M3–M5.
4. Jira, SPOT, and EDB contain or can expose sufficient approved data for MVP validation. Company shall validate this in M1–M2 and document evidence and gaps. Gaps do not convert the SOW into Band A.
5. All source access, API, security, privacy, compliance, GxP/non-GxP, architecture, and SDLC requirements remain subject to Takeda approval.
6. **Support coverage:** Monday–Friday, excluding public holidays. Core hours 10:00–19:00 IST, with regular overlap for US stakeholders (Dean / Joel / Lewis / TO Site Head) beyond 19:00 IST as required. Company shall minimize impact where possible.
7. English is the MVP UX language.

---

## 13. Risks and required responses

| Risk | Impact | Required response |
| --- | --- | --- |
| Jira, SPOT, or EDB data is unavailable, incomplete, inconsistent, stale, or poorly structured | High | Validate access, hierarchy, fields, quality, lineage, and freshness in M1–M2; chrome stale banner; Capability embed as EDB fallback; document in D8. Do not silently drop a source. |
| API, environment, or security approvals delay the integrated build | High | Named owners and lead times in M1; dependency log; escalate through governance the same week. |
| Six-week / $40k Band A expectations conflict with this SOW | High | This SOW is Band B. Company shall not accept a direction to deliver Band A under these fees without a written SOW amendment that also amends §3 and §7. |
| $116,424 ceiling is below ~1,104 hours at the applicable rate card | High | Before signature, Takeda Program Lead and Company shall confirm hours × rates. If the ceiling cannot fund Band B, Takeda shall either raise the ceiling (recommended alignment: SPOT 1063647 forecast **$168,000**) or authorize Additional Work — **not** a silent scope cut. |
| Business design or acceptance decisions delayed | High | Decision log, named owners, entry/exit criteria. |
| Scope growth exceeds the approved T&M ceiling | High | Prioritize **inside** the integrated MVP boundary; change control; no ceiling overrun without §18. |
| Dual-write temptation (edit Jira/SPOT in the app) | High | Refuse in MVP. Mapping table only. |
| Pilot users do not adopt | Medium | §7.9 (one real TO review) is the exit criterion; capture evidence in D6/D8. |
| Unclear GxP/SOX | High | Conservative classification until Intake confirms. Display-only budget. |

---

## 14. Governance

Together with Takeda, Company shall establish a governance team, reporting cadence, and roles before mobilization. Altimetrik leadership shall monitor monthly. Minimum cadence:

- Twice-weekly working session with Dean Santoro (or delegate) during build.
- Weekly RAID / dependency review including Jira, SPOT, EDB, and IAM.
- Sprint review demonstrating progress against B1–B19 and §7 — not activity alone.
- Escalation: delivery blockers to Dean and Lewis; business acceptance to Joel; Jira/DoD to Ian Leake; AI enablement to Jan Felix Meyer / Martin Sturm; infra to Stéphane Dattenny — as named in Exhibit B.

---

## 15. Key Personnel

| Name | Responsibility | Duration of Assignment |
| --- | --- | --- |
| Bipin Bhaskar | Client Partner | 01 October 2026 – 31 December 2026 |
| Srinath Parthasarathy | Engineering Leader | 01 October 2026 – 31 December 2026 |

Company shall name the day-to-day Glass lead, integration lead, and Scrum Master in writing at M1. Replacement of Key Personnel requires Takeda Program Lead notice and a comparable substitute.

---

## 16. Roles and allocations per month (FTE)

Indicative plan to deliver Band B inside the SOW window. During the project, roles and allocations may change based on project needs subject to Takeda Program Lead approval, **as long as the total contracted fees are not exceeded** and **no Required Service in §3 is dropped**.

| Role | Oct 2026 | Nov 2026 | Dec 2026 |
| --- | --- | --- | --- |
| Power Platform / Glass lead | 1.00 | 1.00 | 0.80 |
| Integration / data engineer | 0.70 | 0.80 | 0.50 |
| QA / test engineer | 0.20 | 0.40 | 0.50 |
| BA / Proxy PO | 0.30 | 0.30 | 0.20 |
| Scrum Master / delivery | 0.20 | 0.20 | 0.20 |
| Architect (fractional) | 0.15 | 0.10 | 0.05 |
| AI Engineering Lead (fractional) | 0.15 | 0.15 | 0.10 |
| **Total FTE** | **2.70** | **2.95** | **2.35** |

The source Altimetrik form referenced an FTE table that was not populated. **This table is the operating plan until Company attaches its priced rate-card sheet as Annex 1.** Annex 1 may change names and rates; it may not change §3 or §7.

---

## 17. Budget and payment

**Maximum project budget.** The overall cost of the team proposed for this SOW is **116,424 USD** (the ceiling in Company’s source T&M form). This is a Time & Material **not-to-exceed**.

**Fees.** In consideration for the Services that Company performs pursuant to this SOW, Takeda shall pay Company’s fees of up to **116,424 USD** on a Time & Material basis for the Services defined above.

**Commercial alignment (binding process, not a second ceiling).** Exhibit A estimates Band B at approximately **1,104 hours** and recommends funding at approximately **155,000–168,000 USD**, matching SPOT 1063647 forecast 2026LBE08 (**168,000 USD**; Oct–Jan 42,000 × 4). Takeda and Company acknowledge that 116,424 USD may be insufficient at Takeda Marketplace rates to complete every Required Service. Therefore:

1. Before the first invoice, Company shall provide Annex 1 (role, rate, planned hours) showing how 116,424 USD maps to B1–B19.
2. If Annex 1 shows that the ceiling cannot complete §3 and §7, Company shall notify the Takeda Program Lead **before M2** and shall not convert the engagement to Band A.
3. Takeda may (a) raise this SOW’s Maximum Project Budget by written amendment (recommended: **168,000 USD** and, if needed, extend Completion Date to 22 January 2027 to match SPOT Close), or (b) authorize Additional Work for the remainder, or (c) de-scope only by written amendment of §3 and §7.
4. Company shall invoice only actual T&M incurred, not the unused ceiling.

**Payment terms and schedule.** Company may invoice Takeda for the Fees and any Authorized Expenses as they are incurred but no more frequently than monthly. Company shall invoice only for Services that are complete and Deliverables that have been accepted by Takeda. Takeda shall pay each invoice it receives from Company in accordance with the terms of the Agreement.

All invoices shall state the name of **Dean Santoro** as the relevant Takeda contact, and shall reference **SPOT 1063647**, Budget ID **DDTGML26-004**, and this SOW title.

Company shall send all invoices based on a purchase order (“PO”) electronically through Ariba Network. If it is not using Ariba Network, Company shall send scanned invoices directly to Takeda’s scanning partner as instructed by Takeda. Full instructions to suppliers and list of relevant email addresses are available in the Takeda TBS Guide to Payments for Suppliers.

---

## 18. Additional Work

Takeda may incur additional fees and expenses if it requests Company to perform services that are materially different from, or in addition to, those described in this SOW (“**Additional Work**”). Company must obtain Takeda’s written approval prior to commencing any such Additional Work or incurring any expenses in connection with such Additional Work. In order to seek Takeda’s approval for Additional Work, Company will notify Takeda that the requested services are outside of the scope of this SOW and will provide Takeda with an estimate of the corresponding additional fees and expenses.

The following are Additional Work **examples**, not MVP:

- Band C: EDB data-product first-class views (~120 h), production network hosting (~80 h), LEX+BRP mapping parity (~48 h), extra security/performance (~48 h).
- Work after 31 December 2026, including January 2027 hypercare or SPOT Close activities.
- Jira/SPOT write-back.
- Full TakOS Design System rebuild of every tab.
- Eighteen-site mapping quality.
- Raising the ceiling to the 168,000 USD Band B envelope (handled as an amendment to §17 if Takeda so chooses).

**Required Services that do not fit the ceiling are not Additional Work to be silently skipped.** They trigger §17 commercial alignment.

---

## 19. Other terms

- English is the governing language of this SOW.
- Support days and hours are as in §12.6.
- Company shall not store Takeda secrets, API tokens, or personal credentials in repositories, tickets, screenshots, or this SOW.
- Company shall not attach a screenshot of the TakOS onboarding website as if it were FORM-316177 or a Veeva controlled record.
- This SOW may be executed in counterparts, including electronic signature. The source T&M form used a four-signature EUCAN envelope; Takeda Legal may substitute that envelope without changing the Services.

---

## 20. Agreed and acknowledged

**Takeda Pharmaceuticals International AG**

| | |
| --- | --- |
| By | |
| Name | |
| Title | |
| Place | |
| Date | |

**Altimetrik Corp**

| | |
| --- | --- |
| By | |
| Name | |
| Title | |
| Place | |
| Date | |

Takeda may require a second signatory pair. Signature mechanics do not alter §§1–18.

---

## Annexes

| Annex | Content |
| --- | --- |
| Exhibit A | Design Blueprint (Business Design Package) — binding functional / NFR specification |
| Exhibit B | TakOS walkthrough + onboarding readiness + submission checklist (control context) |
| Annex 1 | Company rate card and planned hours (to be attached before first invoice) |
| Annex 2 | Named individuals at M1 (Glass lead, integration lead, Scrum Master, Takeda ops alias) |
