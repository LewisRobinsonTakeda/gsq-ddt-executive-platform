# GSQ DD&T Executive Platform

## Power Apps + SharePoint prototype — vibe-build specification

| Field | Value |
| --- | --- |
| Product | DD&T Executive Platform (single pane of glass) |
| Prototype name | `GSQ EP Prototype` |
| Stack | SharePoint Online (data + launch site) · Canvas Power App (Glass) |
| How to build | Vibe / Copilot in Power Apps against this file as the only product spec |
| Pilot site | Thousand Oaks (`THO`) |
| Compare site | Lexington (`LEX`) — must look different after switch |
| Third plant | Brooklyn Park (`BRP`) — Capability + security isolation |
| SPOT of this product | **1063647** (do not invent a second investment) |
| Golden thread demo | **TO MES Elaprase DS · DDTTO-12 · SPOT 1024096** |
| Date | 9 September 2026 |
| Companion | Design Blueprint (Exhibit A) · target mockups in `design-assets/mockups/platform.html` |

This file is the **end-to-end build brief** for a clickable prototype. It is not the production TakOS / Dataverse / Jira-API system. It must still prove the same product: one site-aware shell, ten tabs, Jira + SPOT + Capability context, and Site Head writes that never touch Jira dates or SPOT money.

---

## 1. What you are building

Leadership today stitches Jira, SPOT, Power Apps, Power BI, and PowerPoint. The prototype is one SharePoint-hosted Power App that a Site Head can run a **Thursday Thousand Oaks business review** from.

**The prototype must prove**

1. Site is a first-class control. Switching `THO` → `LEX` changes every tab.
2. One pager, KPIs, Gantt+Budget, Budget, Risks, Jira, Capability, Business Review, Site input, and Network all honor that site.
3. MES Elaprase DS shows the same Jira key, SPOT ID, and dates in sidecar, Gantt, Budget, and Jira tab.
4. Budget tiles add up to the SPOT-like numbers in the lists (tolerance ±$1k).
5. Site Head can save commentary and a leadership ask; both appear on Business Review; audit shows who and when.
6. Dragging a One pager card changes **mapping only**. Jira key, dates, and SPOT dollars do not change.
7. A `BRP`-only persona cannot see THO financials.
8. Freshness chips are visible. If you flip `JiraSyncOK` to false, the One pager shows a stale banner — never silent old data as current.
9. Freeze pack writes a SharePoint library item (HTML or PDF) for the selected site + period.
10. Empty Big Rock × FY cells say **“No projects in this Big Rock / year”** in English.

**The prototype must not**

- Call live Jira, SPOT, or EDB APIs (hyperlinks and staged list rows only).
- Write to Jira or SPOT.
- Hard-code “Thousand Oaks” as the title of the app.
- Rebuild a second One pager that ignores the live Power App DNA.
- Use Portuguese draft strings.
- Create a second SPOT project or pretend DDTGMPORT is the delivery Initiative.

Production later replaces SharePoint lists with Dataverse and hyperlinks with inbound sync. **List internal names in §5 are the contract** so the swap is mechanical.

---

## 2. Architecture

```
SharePoint site: "GSQ DD&T Executive Platform"
│
├── Home.aspx          Launch page (embed the app + links + freeze library)
├── Lists/             System of record for the prototype (stand-in for Dataverse)
├── Shared Documents/FreezePacks/
└── Site Assets/       Takeda mark, optional screenshots
         │
         └── Canvas Power App "GSQ EP Prototype"
              ├── ScreenChrome (always on: site, scope, tabs, freshness)
              └── Ten tab screens sharing varSite, varScope, varProject
```

| Layer | Prototype | Production later |
| --- | --- | --- |
| Experience | One Canvas app, 1920×1080, embedded on the SharePoint page | Power Apps or TakOS Glass |
| Data | SharePoint lists | Dataverse + Jira/SPOT/EDB sync |
| Capability visuals | Staged Capability list + simple score cards (optional Power BI embed if licensed) | Capability Tracker embed + RLS |
| Identity | Combo box **View as role** (prototype) + `User()` for audit | Entra groups × site |
| Jira / SPOT | URL columns opening `onetakeda.atlassian.net` / `tospot.azurewebsites.net` | Read APIs, no write |

**SharePoint site settings**

- Name: `GSQ DD&T Executive Platform`
- URL suggestion: `/sites/GSQEP`
- Members: Dean, Lewis, Joel, Aimee, Ivan, Simran, Juraj, vibe builder.
- Default time zone: Pacific (Thousand Oaks).
- Language: English only.
- App: embed full width on Home; “Open in new window” for 1920-wide Glass.

---

## 3. Visual system (copy the mockup)

Use these tokens everywhere. No extra gradients, no random Material theme.

| Token | Hex | Use |
| --- | --- | --- |
| Takeda red | `#E1242A` | Active tab, primary buttons, site-selector border, Freeze |
| Maroon | `#891515` | Hover red |
| Navy | `#102033` | Headers, year labels, sidecar title, budget sidebar |
| Dark | `#34373F` | Body text |
| Steel | `#A1B1C3` | Borders, planning glyph |
| Gray | `#D1D8E0` | Rules |
| Mist | `#EDF2F3` | Cards, zebra |
| Page | `#F4F6F8` | Canvas fill |
| Green | `#2E8B57` | `on_track` |
| Amber | `#C98900` | `monitor` |
| Blue | `#2B5A8A` | `complete` |
| White | `#FFFFFF` | Surfaces |

**Type:** Segoe UI / Aptos. Product title: `DD&T` navy + `Executive Platform` red.

**Status glyphs (colour-blind safe)**

| Canonical | Glyph | Colour |
| --- | --- | --- |
| `on_track` | Filled circle | Green |
| `monitor` | Triangle | Amber |
| `leadership` | Diamond | Red |
| `blocked` | Filled circle | Red |
| `planning` | Hollow circle | Steel |
| `complete` | Check | Blue |
| `cancelled` | X | Steel |

**Initiative RAG** = worst open child: Leadership > Blocked > Monitor > On Track. Complete and Cancelled are excluded from Active and At risk.

---

## 4. App state (Power Fx globals)

Set these on `App.OnStart` and keep them for the session.

```powerfx
Set(varSite, "THO");
Set(varScope, "Site");              // "Site" | "Network"
Set(varTab, "OnePager");
Set(varProject, LookUp(Projects, JiraKey="DDTTO-12"));
Set(varRole, "SiteDDT");            // Executive | SiteHead | SiteDDT | PMO | Finance | BRPOnly
Set(varUserName, User().FullName);
Set(varPeriod, "2026-09");
Set(varSearch, "");
Set(varFY, "All");
Set(varPlatform, "All");
Set(varStatus, "All");
Set(varRock, "All");
Set(varJiraOK, true);
Set(varSpotOK, true);
Set(varEdbOK, true);
```

**Rule:** every gallery / KPI / form `Items` starts with `Filter(..., SiteCode = varSite)` when `varScope = "Site"`. When `varScope = "Network"`, do not filter by site (except Network tiles that group by site). Changing `varSite` must not navigate to a different app.

---

## 5. SharePoint lists (create in this order)

Internal names are stable. Display names can be friendlier. All lists: versioning **On**, require check-out **Off**.

### 5.1 `Sites`

| Internal name | Type | Required | Notes |
| --- | --- | --- | --- |
| Title | Single line | Yes | Site name |
| SiteCode | Single line | Yes | Unique. Indexed. |
| Region | Choice | Yes | Americas, Asia-Pacific, Europe |
| JiraBoardUrl | Hyperlink | | Site DDT board |
| SpotPortfolioUrl | Hyperlink | | |
| CapabilityPlantName | Single line | | Name used by Capability Tracker |
| Timezone | Single line | | |
| IsPilot | Yes/No | | THO = Yes |

**Seed — all 18 (do not ship a 1-site selector)**

| SiteCode | Title | Region | CapabilityPlantName | Notes |
| --- | --- | --- | --- | --- |
| LEX | Lexington | Americas | Lexington | Capability live |
| THO | Thousand Oaks | Americas | Thousand Oaks | **Pilot** |
| BRP | Brooklyn Park | Americas | Brooklyn Park | Capability live |
| NAU | Naucalpan | Americas | Naucalpan | Thin data OK |
| BUE | Buenos Aires | Americas | Buenos Aires | Thin data OK |
| TJN | Tianjin | Asia-Pacific | Tianjin | Thin data OK |
| OSA | Osaka | Asia-Pacific | Osaka | SAIL deployed |
| HIK | Hikari | Asia-Pacific | Hikari | Thin data OK |
| SGP | Singapore | Asia-Pacific | Singapore | Thin data OK |
| YAR | Yaroslavl | Asia-Pacific | Yaroslavl | Reports to **APAC** |
| BEK | Bekasi | Asia-Pacific | Bekasi | Thin data OK |
| GRA | Grange Castle | Europe | Grange Castle | Thin data OK |
| BRY | Bray | Europe | Bray | Thin data OK |
| LIN | Linz | Europe | Linz | SAIL deployed |
| ORA | Oranienburg | Europe | Oranienburg | Thin data OK |
| SNG | Singen | Europe | Singen | Thin data OK |
| NEU | Neuchatel | Europe | Neuchatel | Thin data OK |
| VAS | Vashi | Europe | Vashi | Reports to **Europe**, not APAC |

### 5.2 `BigRocks`

| Internal name | Type | Notes |
| --- | --- | --- |
| Title | Single line | Label |
| RockId | Single line | Unique slug |
| SortOrder | Number | 1–6 |
| TypicalPlatforms | Multiple lines | |

| RockId | Title | SortOrder |
| --- | --- | --- |
| one-day-batch-release | One Day Batch Release | 1 |
| lab-of-the-future | Lab of the Future | 2 |
| predictive-maintenance | Predictive Maintenance | 3 |
| rapid-digital-tech-transfer | Rapid Digital Tech Transfer | 4 |
| inventory-optimization | Inventory Optimization | 5 |
| digital-twin | Power of Digital Twins | 6 |

### 5.3 `StatusMap`

| Canonical | Label | RankWorst | InActive | InAtRisk |
| --- | --- | --- | --- | --- |
| on_track | On track | 4 | Yes | No |
| monitor | Monitor closely | 3 | Yes | Yes |
| leadership | Leadership attention | 1 | Yes | Yes |
| blocked | Blocked | 2 | Yes | Yes |
| planning | Planning / no status | 5 | Yes | No |
| complete | Complete | 9 | No | No |
| cancelled | Cancelled | 9 | No | No |

### 5.4 `Projects` (Jira-shaped, staged)

| Internal name | Type | Notes |
| --- | --- | --- |
| Title | Single line | Project name |
| JiraKey | Single line | Unique. Indexed. |
| SiteCode | Single line | Lookup-like; match `Sites.SiteCode` |
| InitiativeKey | Single line | e.g. DDTGMPORT-1 |
| InitiativeName | Single line | MES, SAIL, Phoenix, … |
| SpotId | Single line | Manufacturing SPOT, not 1063647 |
| StatusCanonical | Choice | values from StatusMap |
| Platform | Single line | MES, SAIL, Labware, … |
| OwnerName | Single line | |
| ProgrammeOrLocal | Choice | Programme, Site-led |
| StartDate | Date | |
| FinishDate | Date | Go-live / targeted end |
| ProgressPct | Number | 0–100 |
| Description | Multiple lines | |
| BusinessValue | Multiple lines | |
| Dependencies | Multiple lines | |
| JiraUrl | Hyperlink | `https://onetakeda.atlassian.net/browse/{JiraKey}` |
| SpotUrl | Hyperlink | optional |

**Do not store Big Rock or FY on this list.** Those live on `ProjectMap` so a drag cannot look like a Jira edit.

### 5.5 `ProjectMap`

| Internal name | Type | Notes |
| --- | --- | --- |
| Title | Single line | `{JiraKey} · {RockId} · {FY}` |
| JiraKey | Single line | |
| SiteCode | Single line | denormalized for filter speed |
| RockId | Single line | |
| FiscalYear | Choice | FY26, FY27, FY28+ |
| UpdatedBy | Person or text | |
| UpdatedOn | Date and time | |

### 5.6 `Financials` (SPOT-shaped, staged, **read-only in the app**)

| Internal name | Type | Notes |
| --- | --- | --- |
| Title | Single line | Project name |
| SpotId | Single line | Indexed |
| SiteCode | Single line | |
| JiraKey | Single line | |
| FY | Choice | FY26, FY27, FY28+ |
| Approved | Currency | USD |
| Forecast | Currency | |
| Actual | Currency | |
| AsOf | Date | |

Variance is **never stored**. Calculate `Actual - Forecast` and `%` in the app.

### 5.7 `Capabilities`

| Internal name | Type | Notes |
| --- | --- | --- |
| Title | Single line | Capability name |
| SiteCode | Single line | |
| GlobalFlag | Yes/No | |
| Deployed | Yes/No | |
| Adopted | Yes/No | |
| ScoreWeight | Number | default 1 |

### 5.8 `Integrations`

| Internal name | Type | Notes |
| --- | --- | --- |
| Title | Single line | `MES ↔ SAIL` |
| SiteCode | Single line | |
| SourceSystem | Single line | |
| TargetSystem | Single line | |
| Deployed | Yes/No | |
| Adopted | Yes/No | |
| RelatedJiraKey | Single line | best-effort |

### 5.9 `Risks`

| Internal name | Type | Notes |
| --- | --- | --- |
| Title | Single line | |
| SiteCode | Single line | |
| Source | Choice | Jira, Local |
| StatusCanonical | Choice | |
| OwnerName | Single line | |
| Due | Date | |
| JiraKey | Single line | |
| RelatedSpotId | Single line | |
| Severity | Choice | High, Medium, Low |
| Mitigation | Multiple lines | |
| ExpiresOn | Date | Local risks: +28 days from create |

### 5.10 `Commentary`

| Internal name | Type | Notes |
| --- | --- | --- |
| Title | Single line | `{SiteCode} {Period}` |
| SiteCode | Single line | |
| Period | Single line | `2026-09` |
| RockId | Single line | optional |
| Body | Multiple lines | |
| Sentiment | Choice | on_track, watch, off |
| AuthorName | Single line | `User().FullName` |
| AuthorEmail | Single line | `User().Email` |

### 5.11 `LeadershipAsks`

| Internal name | Type | Notes |
| --- | --- | --- |
| Title | Single line | Ask |
| SiteCode | Single line | |
| Period | Single line | |
| NeededBy | Date | |
| Impact | Multiple lines | |
| AuthorName | Single line | |

### 5.12 `GoLiveConfirm`

| Internal name | Type | Notes |
| --- | --- | --- |
| Title | Single line | JiraKey |
| SiteCode | Single line | |
| JiraKey | Single line | |
| ConfirmOrChange | Choice | Confirm, Change request |
| Reason | Multiple lines | |
| AuthorName | Single line | |

**Shall not** patch `Projects.FinishDate`.

### 5.13 `ReviewFreeze`

| Internal name | Type | Notes |
| --- | --- | --- |
| Title | Single line | `{SiteCode} {Period} {timestamp}` |
| SiteCode | Single line | |
| Period | Single line | |
| ArtifactUrl | Hyperlink | file in FreezePacks |
| CreatedByName | Single line | |

### 5.14 `Audit`

| Internal name | Type | Notes |
| --- | --- | --- |
| Title | Single line | action |
| Entity | Single line | ProjectMap, Commentary, … |
| Action | Single line | Create, Update, SoftDelete |
| ActorName | Single line | |
| ActorEmail | Single line | |
| BeforeJson | Multiple lines | |
| AfterJson | Multiple lines | |
| SiteCode | Single line | |

### 5.15 `Freshness`

Single-item list (or one row per source).

| Source | AsOf | IsOK | StaleMessage |
| --- | --- | --- | --- |
| Jira | now-2m | Yes | Jira stale since … |
| SPOT | now-41m | Yes | |
| EDB | now-1h | Yes | |
| SiteHead | 14:02 | Yes | |

### 5.16 `UserSiteRole` (prototype security)

| UserEmail | SiteCode | Role |
| --- | --- | --- |
| *(builder)* | THO | SiteDDT |
| *(builder)* | LEX | Viewer |
| demo.brp@takeda.com | BRP | SiteHead |

When `varRole = "BRPOnly"`, force `varSite = "BRP"` and hide Network + other sites’ financials.

### 5.17 SharePoint library `FreezePacks`

Folder per site code. Freeze writes `THO-2026-09-YYYYMMDDhhmm.html` (Power Apps **Print** to PDF if available; otherwise HTML page stored via Power Automate or a Flow that the vibe step can add).

---

## 6. Seed data (must be loaded before UI polish)

### 6.1 THO projects

| Title | JiraKey | SpotId | Status | Platform | Owner | Type | Start | Finish |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MES Elaprase DS | DDTTO-12 | 1024096 | on_track | MES | Site MES lead | Programme | 2025-10-01 | 2026-06-30 |
| NYMI Batch | DDTTO-21 | 1042101 | monitor | NYMI | QC lead | Programme | 2025-11-01 | 2026-08-15 |
| Labware LIMS | DDTTO-31 | | on_track | Labware | Lab systems | Programme | 2025-09-01 | 2026-05-01 |
| LabX scales | DDTTO-32 | | planning | LabX | Lab systems | Site-led | | |
| TO APMS | DDTTO-54 | 1041357 | leadership | APMS | Reliability | Programme | 2025-08-01 | 2026-12-15 |
| LPMS rollout | DDTTO-63 | | leadership | LPMS | Reliability | Programme | 2026-01-15 | 2026-11-01 |
| TO SAIL — FDP | DDTTO-08 | | on_track | SAIL | SAIL lead | Programme | 2025-12-01 | 2026-07-31 |
| TO Takami | DDTTO-58 | | monitor | Takami | Digital | Programme | 2026-02-01 | 2026-10-01 |
| SAP warehouse | DDTTO-41 | | on_track | SAP | Supply | Site-led | 2025-10-01 | 2026-04-30 |
| Discoverant feed | DDTTO-70 | | planning | Discoverant | Data | Site-led | | |
| MES ↔ SAIL | DDTTO-80 | | monitor | MES | MES lead | Programme | 2026-07-01 | 2027-03-31 |
| Smart QC | DDTTO-81 | | on_track | Smart QC | QC | Programme | 2026-09-01 | 2027-06-01 |
| Phoenix | DDTTO-22 | 1038801 | on_track | Phoenix | CIM | Programme | 2026-10-01 | 2027-09-01 |
| Takami inventory | DDTTO-59 | | on_track | Takami | Digital | Programme | 2026-08-01 | 2027-04-01 |
| SIMCA Online | DDTTO-71 | | on_track | SIMCA | Data | Programme | 2026-11-01 | 2027-08-01 |
| Paperless Ops | DDTTO-90 | | planning | Veeva | QA digital | Programme | | |
| RTMS expand | DDTTO-64 | | on_track | RTMS | Reliability | Programme | 2027-04-01 | 2028-03-01 |
| Enterprise data twin | DDTTO-72 | | on_track | EDB | Data | Programme | 2027-06-01 | 2028-12-01 |
| OT Cyber remediation | DDTTO-77 | 1049001 | monitor | OT | OT lead | Site-led | 2025-09-01 | 2026-09-30 |
| TO MES Dapnese DS | DDTTO-14 | | monitor | MES | Site MES lead | Programme | 2025-07-01 | 2026-04-30 |

Description for **DDTTO-12**: “Replace paper batch steps on Elaprase DS. Value sits in Jira; spend sits in SPOT.”

### 6.2 THO ProjectMap

| JiraKey | RockId | FY |
| --- | --- | --- |
| DDTTO-12 | one-day-batch-release | FY26 |
| DDTTO-21 | one-day-batch-release | FY26 |
| DDTTO-31 | lab-of-the-future | FY26 |
| DDTTO-32 | lab-of-the-future | FY26 |
| DDTTO-54 | predictive-maintenance | FY26 |
| DDTTO-63 | predictive-maintenance | FY26 |
| DDTTO-08 | rapid-digital-tech-transfer | FY26 |
| DDTTO-58 | rapid-digital-tech-transfer | FY26 |
| DDTTO-41 | inventory-optimization | FY26 |
| DDTTO-70 | digital-twin | FY26 |
| DDTTO-80 | one-day-batch-release | FY27 |
| DDTTO-81 | lab-of-the-future | FY27 |
| DDTTO-22 | rapid-digital-tech-transfer | FY27 |
| DDTTO-59 | inventory-optimization | FY27 |
| DDTTO-71 | digital-twin | FY27 |
| DDTTO-90 | lab-of-the-future | FY28+ |
| DDTTO-64 | predictive-maintenance | FY28+ |
| DDTTO-72 | digital-twin | FY28+ |

Leave some FY28+ cells empty on purpose.

### 6.3 LEX projects (must differ from THO)

| Title | JiraKey | SpotId | Status | Platform | FY map | Rock |
| --- | --- | --- | --- | --- | --- | --- |
| LEX SAIL Fill Line | DDTLEX-04 | 1050100 | on_track | SAIL | FY26 | rapid-digital-tech-transfer |
| LEX Labware | DDTLEX-11 | | on_track | Labware | FY26 | lab-of-the-future |
| LEX MES suite | DDTLEX-02 | 1028800 | monitor | MES | FY26 | one-day-batch-release |
| LEX Phoenix | DDTLEX-20 | | planning | Phoenix | FY27 | rapid-digital-tech-transfer |
| LEX LPMS | DDTLEX-33 | | on_track | LPMS | FY26 | predictive-maintenance |

KPI counts for LEX must not equal THO (THO ~18 active staged; LEX 5).

### 6.4 BRP projects (security demo)

| Title | JiraKey | Status | Rock / FY |
| --- | --- | --- | --- |
| BRP SAIL | DDTBP-07 | on_track | rapid-digital-tech-transfer / FY26 |
| BRP Smart QC | DDTBP-18 | monitor | lab-of-the-future / FY27 |

### 6.5 THO financials (USD)

| SpotId | JiraKey | FY | Approved | Forecast | Actual |
| --- | --- | --- | --- | --- | --- |
| 1024096 | DDTTO-12 | FY26 | 180000 | 180000 | 92000 |
| 1042101 | DDTTO-21 | FY26 | 148000 | 148000 | 61000 |
| 1041357 | DDTTO-54 | FY26 | 205000 | 220000 | 198000 |
| 1038801 | DDTTO-22 | FY27 | 436000 | 436000 | 40000 |
| 1049001 | DDTTO-77 | FY26 | 205000 | 205000 | 150000 |

Site MYC strip (THO): Approved **$1,174k** across these rows — display as **$1,158k** only if you add the remaining small lines; otherwise show the **sum of the list** and use that same sum on Budget, Gantt sidebar, and Business Review. **One number everywhere.**

### 6.6 Capability scores

| Site | Deployed/total | Adopted/total | Score | Pending integrations |
| --- | --- | --- | --- | --- |
| THO | 11/18 | 7/18 | 49.3 | MES ↔ SAIL, Veeva ↔ SAP |
| LEX | 14/18 | 11/18 | 68.1 | Labware ↔ SAP |
| BRP | 9/18 | 6/18 | 44.0 | SAIL ↔ MES |

### 6.7 THO risks

| Title | Source | Status | Owner | JiraKey |
| --- | --- | --- | --- | --- |
| OpenLab support | Jira | monitor | PMO | DDTGMPORT-41 |
| MES ↔ SAIL interface | Jira | leadership | MES | DDTTO-80 |
| Local mapping gaps | Local | planning | Site DD&T | |
| APMS dates vs spend | Local | leadership | Reliability | DDTTO-54 |

### 6.8 Starter Site input (THO, period 2026-09)

**Commentary:** “13 at-risk items are real; two are mapping debt, not delivery failure. APMS needs airtime.” Sentiment: `watch`. Author: Dean Santoro.

**Asks**

1. Codex seats for Aimee Rarugal — needed 9 Sep 2026 — already on SPOT 1063647.
2. APMS leadership airtime — SPOT 1041357 — this cycle.

---

## 7. Shared chrome (every screen)

Build **one component** `cmpChrome` used on all screens.

1. **Ribbon** (22px navy): `Prototype · SharePoint + Power Apps · not live Jira/SPOT`.
2. **Top bar:** Takeda mark · `DD&T Executive Platform` · freshness pills (Jira / SPOT / EDB / Site Head) · `View as` role · `User().FullName`.
3. **Identity bar:** Site combo (red 2px border, shows `THO · Thousand Oaks`) · This site / Network · page H1/H2 · primary action (Open Jira board **or** Freeze, depending on tab).
4. **Tabs** (order is contractual): One pager · Status KPIs · Gantt + Budget · Budget · Risks · Jira · Capability · Business Review · Site input · Network. Active tab = red pill. Business Review and Site input show a small `NEW` marker.
5. **Filters:** Search · FY · Platform · Status · Big Rock. Search matches Title, JiraKey, SpotId.
6. **Footer legend** + “Key challenges: Communication · Change management · Leadership engagement”.

**Site combo Items**

```powerfx
Sort(Sites, Region, SortOrder.Ascending)
```

`OnChange`: `Set(varSite, Self.Selected.SiteCode); Set(varProject, First(Filter(Projects, SiteCode=varSite)))`

**Open Jira board** = `Launch(LookUp(Sites, SiteCode=varSite).JiraBoardUrl)`  
If URL blank, launch `https://onetakeda.atlassian.net` and notify “Board URL not seeded for this site”.

**Stale banner** (show when `!varJiraOK || !LookUp(Freshness, Title="Jira").IsOK`):

> Jira last refreshed {AsOf}. Figures may be stale. This is not live data.

---

## 8. Screen specifications

Each screen: purpose, layout, data, rules, drill-downs, vibe notes.

### 8.1 One pager — `scrOnePager`

**Purpose.** Six Big Rocks × FY26–FY28+ for `varSite`.

**Layout** (preserve the live TO Power App)

1. `cmpChrome` with H1 `DD&T Roadmap FY26–FY28+`.
2. Banner (amber): *Layout changes are planning metadata. Jira dates and status remain the system of record.*
3. Header row: red cell `6 BIG ROCKS` + six navy rock titles from `BigRocks`.
4. Three year bands (navy / red / navy labels): FY2026 BUILD FOUNDATION · FY2027 SCALE & INTEGRATE · FY2028+ TRANSFORM.
5. Under each rock × year, a gallery of cards from:

```powerfx
Filter(
  AddColumns(
    ProjectMap,
    "Prj", LookUp(Projects, JiraKey = ProjectMap[@JiraKey])
  ),
  SiteCode = varSite,
  FiscalYear = /* band */,
  RockId = /* column */,
  varSearch in Prj.Title || varSearch in Prj.JiraKey || varSearch in Prj.SpotId || varSearch = "",
  varStatus = "All" || Prj.StatusCanonical = varStatus,
  varPlatform = "All" || Prj.Platform = varPlatform
)
```

6. Card: grip · status glyph · name · `SPOT {id} · {JiraKey}`.
7. Empty: *No projects in this Big Rock / year*.
8. Right sidecar for `varProject`.

**Sidecar fields:** Owner, Status, Jira (link), SPOT (link), Big Rock, FY swimlane, Go-live, Description.

**Sidecar actions**

| Button | Action |
| --- | --- |
| Open in Gantt + Budget | `Set(varTab,"Gantt"); Navigate(scrGantt)` |
| Capability · {Platform} | `Set(varPlatform, varProject.Platform); Navigate(scrCapability)` |
| Open Jira issue | `Launch(varProject.JiraUrl)` |

**Drag (prototype-honest)**  
Full HTML5 drag is weak in Canvas. Implement **Move mapping**: sidecar dropdowns for Rock + FY + button `Update mapping`.

```powerfx
// OnSelect Update mapping
Patch(ProjectMap, LookUp(ProjectMap, JiraKey=varProject.JiraKey), {
  RockId: ddRock.Selected.RockId,
  FiscalYear: ddFY.Selected.Value,
  UpdatedBy: varUserName,
  UpdatedOn: Now()
});
Collect(Audit, {
  Title: "Map " & varProject.JiraKey,
  Entity: "ProjectMap",
  Action: "Update",
  ActorName: varUserName,
  ActorEmail: User().Email,
  BeforeJson: /* previous rock/fy */,
  AfterJson: ddRock.Selected.RockId & " " & ddFY.Selected.Value,
  SiteCode: varSite
});
Notify("Mapping updated. Jira dates and SPOT money were not changed.", NotificationType.Success)
```

If Copilot can enable reorder galleries, still **Patch ProjectMap only**.

**Acceptance:** THO shows MES Elaprase DS selected by default. LEX grid has no Elaprase card.

### 8.2 Status KPIs — `scrKPIs`

Widgets (site-filtered, exclude complete/cancelled from Active):

| Widget | Formula |
| --- | --- |
| Projects | Count of active |
| On Track | `StatusCanonical = "on_track"` |
| Planning | `planning` |
| At Risk | `monitor` + `leadership` + `blocked` (split on hover / subtitle) |
| Leadership | `leadership` |
| On-track % by FY | on_track / active in that FY swimlane |
| Programme vs site-led | two counts |
| Last Site Head update | `First(Sort(Filter(Commentary, SiteCode=varSite), Created, Descending))` |

**OnSelect** a KPI: `Set(varStatus, …); Navigate(scrOnePager)` or Risks for at-risk.

**Acceptance:** KPI Active equals filtered One pager card count for the same filters.

### 8.3 Gantt + Budget — `scrGantt`

**Left (~70%):** grouped by `InitiativeName` then project rows.

- Label: `{Title} · {SpotId}`.
- Bar: `StartDate`–`FinishDate` on a FY25–FY28 axis (16 quarters). Colour = status.
- **Today** = 2px red vertical at today’s position.
- Rows with blank dates go to a group **No dates reported**.

Approximate bar `X` / `Width` (prototype):

```powerfx
// AxisStart = Date(2025,4,1)   AxisEnd = Date(2029,3,31)
X = Parent.Width * DateDiff(AxisStart, StartDate, Days) / DateDiff(AxisStart, AxisEnd, Days)
W = Parent.Width * DateDiff(StartDate, FinishDate, Days) / DateDiff(AxisStart, AxisEnd, Days)
```

**Right (360px navy sidebar):** `MYC Budget {year} · {varSite}`

- Approved / project count / FY26 / FY27 from `Financials`.
- Ranked lines by Forecast.
- Variance % = `(Sum(Actual)-Sum(Forecast))/Sum(Forecast)`.
- Label: *Financials are read-only. Corrections happen in SPOT.*

**Click bar** → set `varProject`, show mini-sidecar or reuse One pager sidecar component.

**Variance click** → `Navigate(scrBudget)`.

**Acceptance:** DDTTO-12 bar and sidebar dollars match Financials for 1024096.

### 8.4 Budget — `scrBudget`

Finance-first, same site.

- KPI strip: Total approved · forecast · actual · remaining (`Approved-Actual`) · variance.
- By FY, by Big Rock (join ProjectMap), by Programme vs site-led.
- Table: Initiative, Project, SPOT, approved, forecast, actual, variance %, owner, health.
- Filter: over-variance (default 10%).
- **No money edits.** Optional comment button opens Site input with `SpotId` in context (writes `Commentary` or `LeadershipAsks`, not Financials).

**Acceptance:** Strip totals = sum of table = Gantt sidebar.

### 8.5 Risks — `scrRisks`

Gallery: Title, glyph, owner, due, Big Rock (via map), Jira key, source.

- Auto rows: `Source = Jira` and status in monitor / leadership / blocked, plus type Impediment (OpenLab).
- Local rows: `Source = Local`.
- Banner if local and `ExpiresOn < Today()`: *Promote to Jira this cycle or it expires. Prototype does not create a Jira issue.*

**Add local risk** → Site input form tab, or a form on this screen that `Patch`es `Risks` with `Source="Local"`, `ExpiresOn = DateAdd(Today(), 28, Days)`, plus Audit.

### 8.6 Jira — `scrJira`

Working backlog, not a chart.

| Column | Field |
| --- | --- |
| Key | JiraKey (link) |
| Type | ProgrammeOrLocal |
| Summary | Title |
| Status | StatusCanonical |
| Assignee | OwnerName |
| Due | FinishDate |
| SPOT | SpotId (link) |
| Big Rock | LookUp ProjectMap |

Saved filters: this site · open impediments (`Risks` Jira source) · missing Big Rock (`ProjectMap` blank — include DDTTO-58 style if you leave one unmapped on purpose).

**No status dropdown that Patches Projects.StatusCanonical** except a PMO “staging correction” behind a confirm: *This is prototype staging, not Jira.*

### 8.7 Capability — `scrCapability`

Two panels.

1. **Plant summary:** score, deployed count, adopted count, donut or stacked bar, SAIL deployed flag.
2. **All capabilities:** gallery + pending `Integrations` where `Deployed=false` or `Adopted=false`.

Click pending row → filter Jira tab to `RelatedJiraKey` / platform.

If a Power BI embed is available, put it in an Html viewer **and** still keep the staged lists so THO/LEX/BRP work offline.

**Acceptance:** THO 49.3, LEX 68.1, BRP 44.0 (or whatever the seeded Score calculates — **one formula**, display that).

Site capability score (prototype):

```powerfx
With(
  { c: Filter(Capabilities, SiteCode=varSite) },
  Round(
    100 * Sum(c, If(Deployed, 0.5, 0) + If(Adopted, 0.5, 0)) / CountRows(c),
    1
  )
)
```

Seed Capabilities so this lands on ~49.3 / 68.1 / 44.0.

### 8.8 Business Review — `scrReview`

H1: `Thursday business review · {selected date}`  
Primary button: **Freeze pack**.

**KPI strip (6):** Active · At risk (red) · On-track % · OPEX MYC · Variance · Capability score.  
Same formulas as other tabs.

**Left — Meeting beats (30–45 min)**

| # | Beat | Jumps to |
| --- | --- | --- |
| 1 | Site snapshot | (this strip) |
| 2 | Big Rocks | One pager |
| 3 | Money vs time | Gantt + Budget, filter at-risk |
| 4 | Risks | Risks, top 5 |
| 5 | North Star adoption | Capability |
| 6 | Decisions / asks | Site input |

**Right — Asks of leadership** = `Filter(LeadershipAsks, SiteCode=varSite, Period=varPeriod)` plus top 3 Risks.

**Freeze pack OnSelect**

1. `Patch(ReviewFreeze, Defaults(ReviewFreeze), { Title: varSite & " " & varPeriod & " " & Text(Now(),"yyyymmddhhmm"), SiteCode: varSite, Period: varPeriod, CreatedByName: varUserName })`
2. Trigger Power Automate *EP — Freeze Pack* (create HTML in `FreezePacks` with KPI strip + asks + top risks + selected project thread 1024096).
3. Notify success; pill changes to `Frozen {timestamp}`.
4. Audit row.

If Flow is not ready in vibe session 1, write a **Freeze note** list item with the same fields and generate HTML via `HTML text` control + user Print to PDF. Do not skip the record.

### 8.9 Site input — `scrInput`

**The only write path.** Form tabs: Commentary · Local risk · Go-live confirm · Leadership ask · Mapping correction.

| Tab | Patch | Forbidden |
| --- | --- | --- |
| Commentary | `Commentary` + Audit | Financials, Projects dates |
| Local risk | `Risks` Source=Local + Audit | Jira create |
| Go-live | `GoLiveConfirm` + Audit | `Projects.FinishDate` |
| Ask | `LeadershipAsks` + Audit | |
| Mapping | `ProjectMap` + Audit | Jira fields |

Every save: `AuthorName = User().FullName`, timestamp Now(), `Notify` with the forbidden-write sentence.

Show **Open writes this cycle** gallery (commentary + asks + local risks for `varPeriod`).

### 8.10 Network — `scrNetwork`

When `varScope="Network"` or this tab:

- Overview counts: programmes (distinct InitiativeName) · projects · active · at risk.
- Regions: Americas / Asia-Pacific / Europe — active / at risk (VAS in Europe, YAR in APAC).
- Sites gallery: code, active, at risk. **OnSelect** `Set(varSite, ThisItem.SiteCode); Set(varScope,"Site"); Navigate(scrOnePager)`.
- Initiatives: RAG = worst child.
- Thin “global gantt” optional.

Site Head role may hide this tab (`varRole in ["SiteHead","BRPOnly"]`).

---

## 9. Personas and `View as`

| varRole | Default site | Sees Network | Sees Financials | Can write Site input |
| --- | --- | --- | --- | --- |
| Executive | THO | Yes | All sites | No |
| SiteHead | THO | No | Home site | Yes |
| SiteDDT | THO | Yes | Home site | Yes |
| PMO | THO | Yes | All | Mapping + local risk |
| Finance | THO | Yes | All | Variance comment only |
| BRPOnly | BRP locked | No | BRP only | Yes on BRP |

`App.OnStart` can default SiteDDT / THO for Dean’s demo.

---

## 10. End-to-end demo script (must work)

Use this as the UAT path. If a step fails, the prototype is not done.

### 10.1 Site Head prepares Thursday’s review

1. Open SharePoint Home → **Open Executive Platform**.
2. Confirm Site = Thousand Oaks (or set it).
3. Status KPIs: note At risk count.
4. One pager: find red/amber on One Day Batch Release and Lab of the Future.
5. Click **MES Elaprase DS** → sidecar shows DDTTO-12 and SPOT 1024096.
6. **Open in Gantt + Budget** — same project, dates vs spend.
7. Capability — THO, pending MES ↔ SAIL and Veeva ↔ SAP.
8. Site input — two leadership asks (seeded; add a third if you want to prove write).
9. Business Review — Freeze pack.
10. Confirm FreezePacks library or ReviewFreeze row exists.

### 10.2 Executive compares two plants

1. Scope = Network. Note Americas vs Europe.
2. Sites: THO vs LEX counts differ.
3. Click LEX → One pager has LEX SAIL, not Elaprase.
4. Click THO → Elaprase returns.

### 10.3 PMO repairs mapping

1. Jira tab (or One pager) on DDTTO-58 Takami.
2. Site input → Mapping → Rapid Digital Tech Transfer / FY26 / SAIL (already mapped in seed — demo on a **new** unmapped project: add `DDTTO-99 Unmapped test` with no ProjectMap row).
3. One pager places the card. Audit row recorded.
4. JiraKey and FinishDate unchanged.

### 10.4 BRP isolation

1. View as `BRPOnly`.
2. Site combo does not stay on THO.
3. Budget does not show 1024096 / $180k Elaprase.

---

## 11. SharePoint frontend (the site, not just lists)

Build a modern Communication site so the prototype has a place to live.

**Home page sections**

1. Hero: `DD&T Executive Platform` · `Single pane of glass · Thousand Oaks pilot`.
2. **Launch** button / embed: Canvas app (default tab One pager).
3. Quick links: Design Blueprint · SOW draft · TakOS walkthrough · SPOT 1063647 · AIDPG (do not create tickets from here).
4. **How to demo** (this §10, shortened).
5. Document library web part: FreezePacks.
6. List web parts (optional, PMO): Commentary, LeadershipAsks — so writes are visible outside the app.
7. Footer: *Prototype. Jira and SPOT are staged. SPOT 1063647 is the only investment record.*

**Pages**

| Page | Purpose |
| --- | --- |
| Home | Launch |
| Data | Links to all lists for the builder |
| Freeze packs | Library |
| About | 18-site master, write rules, classification (GxP No / Medium / SOX Review / PII Low) |

---

## 12. Vibe-build sequence (use these prompts in order)

Work in **Power Apps Studio** with Copilot / vibe, and in the SharePoint site. Paste the relevant section of this file with each prompt. Do not ask the model to invent a different IA.

### Prompt 0 — site and lists

> Create a SharePoint site GSQ DD&T Executive Platform. Create every list and column in section 5 of this spec, using the **internal names** exactly. Enable versioning. Load seed data from sections 5.1, 6.1–6.8. Vashi is Europe. Yaroslavl is APAC. Do not skip the 18 sites.

### Prompt 1 — app shell

> Create a Canvas app 1920×1080 named GSQ EP Prototype. Theme tokens from section 3. OnStart from section 4. Build component cmpChrome from section 7 with site combo bound to Sites, ten tabs in the exact order, freshness pills, View as role. Changing site sets varSite and does not navigate away.

### Prompt 2 — One pager

> Build scrOnePager exactly as section 8.1. Six Big Rocks × three FY bands. Cards from ProjectMap joined to Projects. Default selected project DDTTO-12. Sidecar + mapping update that patches ProjectMap only and writes Audit. English empty states.

### Prompt 3 — KPIs, Gantt, Budget

> Build scrKPIs, scrGantt, scrBudget from 8.2–8.4. One shared formula for site Active / At risk / money totals. Today line on Gantt. Financials read-only. THO sidebar matches Budget strip.

### Prompt 4 — Risks and Jira

> Build scrRisks and scrJira from 8.5–8.6. Hyperlinks to onetakeda.atlassian.net/browse/{key}. No status write-back.

### Prompt 5 — Capability and Network

> Build scrCapability and scrNetwork from 8.7 and 8.10. Scores from Capabilities. Clicking a Network site sets varSite and opens One pager.

### Prompt 6 — Site input and Business Review

> Build scrInput and scrReview from 8.8–8.9. All writes attributable. Freeze creates ReviewFreeze. Meeting beats navigate. Seeded asks appear.

### Prompt 7 — security and stale

> Implement View as roles from section 9. BRPOnly cannot see THO financials. Add a debug toggle for varJiraOK that shows the stale banner.

### Prompt 8 — SharePoint page

> Embed the app on Home. Add launch, freeze library, and the About page from section 11.

### Prompt 9 — demo rehearsal

> Walk the four scripts in section 10. Fix any count mismatch. Do not add features that are not in this file.

---

## 13. Power Automate (minimum)

| Flow | Trigger | Does |
| --- | --- | --- |
| EP — Freeze Pack | Power Apps (V2) | Create HTML file in FreezePacks; patch ArtifactUrl; post Audit |
| EP — Local risk expiry (optional) | Daily | Notify PMO of Local risks with ExpiresOn <= Today+3 |

Do not build Jira or SPOT connectors in the prototype.

---

## 14. Classification and data handling (prototype)

| Dimension | Working call | Prototype behaviour |
| --- | --- | --- |
| GxP | No | No batch record, no lab results content |
| Criticality | Medium | Stale banner required |
| SOX | Review | Financials display-only |
| PII | Low | Names and work emails only; no HR |

Do not put real patient data, passwords, or Jira API tokens in lists.

---

## 15. Mapping to production (do not build now)

| Prototype | Production Band B |
| --- | --- |
| SharePoint lists | Dataverse entities of the same names |
| Hyperlink Jira/SPOT | Inbound REST sync 15–60 min |
| Capability list | Power BI embed + EDB data product |
| View as combo | Entra group × site |
| Freeze HTML | Power Automate PDF/PPT |
| Mapping Patch | Same rule: never Jira |
| This SharePoint site | Launch + docs; not a second system of record |

Delivery Jira for the **real** product is AIDPG (Initiative `1063647 — GSQ DD&T Roadmap Executive Platform MVP`). DDTGMPORT stays a manufacturing **data** source. The prototype only **displays** DDTTO / DDTGMPORT keys.

---

## 16. Definition of done (prototype)

The prototype is done when:

1. All 18 sites exist in `Sites` and in the combo.
2. All ten tabs open without error and honor `varSite`.
3. Section 10 scripts 10.1–10.4 succeed on a second person’s account (or View as).
4. KPI / Budget / Gantt money match for THO.
5. Audit contains at least one mapping change, one commentary, one ask, one freeze.
6. No control Patches `Projects.FinishDate`, `Projects.StatusCanonical` (except the labelled PMO staging confirm), or `Financials` amounts.
7. Home.aspx launches the app.
8. English only.

---

## 17. File pack to keep open while vibing

| File | Use |
| --- | --- |
| This specification | Product contract |
| `design-assets/mockups/platform.html` | Visual DNA (`?v=onepager`, `gantt`, `review`, `input`) |
| `GSQ-DDT-Executive-Platform-Design-Blueprint.md` | Full rules if a screen argument starts |
| `GSQ-DDT-Executive-Platform-SOW-Altimetrik-TM-Oct-Dec-2026.md` | What production will be contracted to build |

If Copilot invents a tab, a seventh Big Rock, a Jira write, or a 19th site, **delete it** and re-apply this file.
