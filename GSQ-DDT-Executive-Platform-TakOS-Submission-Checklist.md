# GSQ DD&T Executive Platform

## TakOS submission checklist

| Field | Value |
| --- | --- |
| Product | GSQ DD&T Roadmap Executive Platform MVP |
| SPOT | **1063647** — Active / Plan. Do not create a second project |
| Guide | [takOS Digital Delivery Onboarding](https://landing-page.man.aws.takeda.io/onboarding?view=guide&section=jira) (TOOL-235311; Veeva prevails) |
| Closing gate for *submission* | **Intake Governance Gate** (Initiate). Design Approval and Delivery Readiness come after |
| As of | 8 September 2026 |
| Sponsor / PM | Joel Vincent / Dean Santoro |
| How to use | Walk this list in order. Attach the evidence pack. Do not claim Intake is complete until Part C is in Jira |

**Verdict today:** the **app design package is ready to attach to a Marketplace / funding request**. The **TakOS Initiate records are not yet filed**. Those are the remaining submission actions.

---

## How to mark items

| Mark | Meaning |
| --- | --- |
| `[x]` **Met** | Evidence exists for *this* initiative and can be shown in the request |
| `[~]` **Partial** | Material exists; still needs a controlled Jira / SPOT / Veeva record |
| `[ ]` **Open** | Required for Initiate / Intake; not done |
| `[–]` **Later** | Required to *build or release*, not to submit funding |

---

## Part A — What the app already satisfies (product / design)

TakOS Initiate expects a real investment, a named outcome, a value case, a boundary, and enough design that a POD can be assigned. The Executive Platform package meets those **content** requirements. Tick these as “shown in the request.”

| # | Requirement (what TakOS asks for) | Mark | How this app / package meets it | Evidence to attach or link |
| --- | --- | --- | --- | --- |
| A1 | Named product with a single investment record | `[x]` | One portal: site-aware Glass for 18 GSQ M&L plants. Delivery SPOT is **1063647** | [SPOT 1063647 board](https://tospot.azurewebsites.net/project-hub/78dd4329-ece5-4796-8cab-776d8ce7af17/project-board) |
| A2 | Problem and intended use | `[x]` | Reviews today stitch Jira, SPOT, Power Apps, Power BI, and PowerPoint. Intended use = run the TO business review from one portal | Business case MVP v2; Blueprint §1; Executive Design §1 |
| A3 | Measurable outcome / value hypothesis | `[x]` | 9,000 hours/year · 18 sites · 42 h/site/month · 30,000 hours total. Capture start 1 Dec 2026. COP = Productivity Improvements | SPOT value table; Executive Summary |
| A4 | In / out of scope (MVP boundary) | `[x]` | In: site selector, live Jira + SPOT, Gantt+Budget, Capability embed, Site input, TO freeze. Out: Jira/SPOT write-back, all-18 mapping quality, AI narrative, GxP execution | Blueprint §12; Executive Design §12 |
| A5 | Systems of record stay authoritative | `[x]` | Jira, SPOT, EDB/Capability are **read-only**. Only Dataverse writes: commentary, local risk, asks, mapping, freeze pack | Blueprint §5–§9; schematic Figure S1 |
| A6 | Navigation and screen intent | `[x]` | Ten tabs; site set once; drill card → sidecar → Jira/SPOT → Gantt+Budget → Capability | Blueprint §6–§7; mockups Figures 12–15 |
| A7 | Information architecture | `[x]` | Network → Region → Site → Big Rock → platform → initiative/project. 18-site master; Vashi→Europe, Yaroslavl→APAC | Blueprint §5; Figure S2 |
| A8 | High-fidelity prototype / UX evidence | `[x]` | Live TO One pager, MYC Budget, combined Gantt+Budget, Capability Tracker, global roadmap. Target mockups show the Glass | Blueprint §3; Executive Design §3 and §6.4 |
| A9 | Acceptance criteria that can become URS lines | `[x]` | Ten MVP tests, including TO↔LEX switch, SPOT reconcile, Site Head write + audit, freeze pack, site-scoped security | Blueprint §15; Executive Design §15 |
| A10 | Hours, team, calendar | `[x]` | Band B ~1,100 hours / 10–12 weeks / ~$155–168k; WBS B1–B19; week-1–11 calendar | Blueprint §13; Figure S3 |
| A11 | Day-1 dependencies named | `[x]` | Power Platform env, Entra, Jira read, SPOT API, PBI embed, EDB steward, TO UAT, Marketplace POD | Blueprint §16 |
| A12 | Classification strawman for TOOL-235299 | `[~]` | Working: **GxP No · Criticality Medium · SOX Review · PII Low**. Not yet on an Epic | Blueprint §10 |
| A13 | Pattern-Fit strawman for FORM-316177 | `[~]` | Working: **Product** track; reuse embeds + custom Glass; no catalogue “executive glass” Pattern. Architect must file the form | Blueprint §11.2 |
| A14 | Sponsor and PM on the SPOT team | `[x]` | Joel = Sponsor; Dean = PM. Also: Aimee Rarugal, Juraj Krivda, Simran Karamchandani, Ivan Fonseca | SPOT 1063647 Project Team |
| A15 | One RAG language / no dual-write | `[x]` | Canonical status map; drag updates `project_map` only; Jira dates and SPOT money never written from the portal | Blueprint §5.4, §7.1, §15.7 |

**Part A score:** 13 met · 2 partial (classifications and Pattern-Fit must be *recorded* on the Initiative, not just written in the blueprint).

---

## Part B — SPOT 1063647 (investment source of truth)

Onboarding rule: *A link alone is not enough. Do not start delivery with an empty SPOT shell. Do not create a second SPOT.*

| # | Checkpoint | Mark | Status |
| --- | --- | --- | --- |
| B1 | SPOT ID exists and is Active | `[x]` | **1063647** · Plan · Data Quality 100% |
| B2 | Problem statement on the record | `[x]` | General Info |
| B3 | Value hypothesis with unit and timing | `[x]` | 9,000 h/yr; FY26 3,000 then 9,000/yr |
| B4 | Sponsor + PM on Project Team | `[x]` | Joel / Dean |
| B5 | Governance / category | `[x]` | Tier 4 · Improvement — General Improvement |
| B6 | Milestones dated | `[x]` | Experience Design 18 Sep · Budget / Funding · Build · Pilot 11 Dec · Close 22 Jan 2027 |
| B7 | Value owner + method to confirm realised hours | `[~]` | Dean/Joel named; write the TO BR-hours baseline into Value Commentary |
| B8 | Risks table | `[~]` | Add at least one risk or an explicit “none” |
| B9 | **One** CAPEX number | `[ ]` | Header Expected CAPEX **$35k** ≠ preliminary forecast **$168k**. Align both to Band B |
| B10 | Funding request row | `[ ]` | None yet — file it on **this** board |
| B11 | Token forecast line (if POD uses Claude/Codex) | `[ ]` | Claude tokens provisioned; no dedicated line. Guide: ~USD 2,000 / month per 100% FTE |
| B12 | Approved CAPEX / OPEX | `[ ]` | Still blank until the request is approved |

**Part B score:** enough to *cite* SPOT in the order; **not** enough to say “funding is on the record.” Finish B9–B11 before Marketplace money.

---

## Part C — Initiate records (the actual TakOS submission spine)

This is what the onboarding site means by **submit**. Leading record: **Initiative Epic in AIDPG** (SOP-254573). Not DDTGMPORT (that Jira is the *plant data source*).

| # | Checkpoint | Mark | Action |
| --- | --- | --- | --- |
| C1 | Confirm AIDPG create rights for Dean + DPM | `[ ]` | Confirm in Jira (not DDTGMPORT) |
| C2 | Create **AIDPG Initiative**; “Open in SPOT” → **1063647** | `[ ]` | Paste the outcome below |
| C3 | Initiative-level acceptance, owner, in/out boundary | `[ ]` | Copy Blueprint §12 + §15 |
| C4 | Eight seed **Epics** under that Initiative | `[ ]` | See list below |
| C5 | Four classifications on the Epic (TOOL-235299) | `[ ]` | File: GxP No · Criticality Medium · SOX Review · PII Low |
| C6 | **FORM-316177** Pattern-Fit completed and **attached to the Initiative** | `[ ]` | Architect. Product track; reuse embeds + custom Glass |
| C7 | Epic content: Mandatory + applicable Conditional items in TOOL-235299 §3 | `[ ]` | DPM / Dean |
| C8 | Intake evaluation **Proceed / Reject / Refine** with rationale | `[ ]` | DD&T Leadership + AI&Data Portfolio Lead |
| C9 | **Intake Governance Gate** on the Epic (named approvers, date, rationale) | `[ ]` | Jira R5 transition is the record. No Veeva duplicate. No verbal gate |

**Initiative text (ready to paste):**

> Deliver a site-aware GSQ DD&T Executive Platform so leadership can run a Thousand Oaks business review from one portal fed by Jira, SPOT, and capability/EDB data, with Site Head commentary as the only write path.

**Seed Epics (from Blueprint §13):**

1. Executive Glass shell and site master  
2. One pager / KPI persistence  
3. Combined Gantt + Budget and Budget tab  
4. Jira inbound sync  
5. SPOT inbound sync  
6. Capability Tracker embed (+ EDB increment)  
7. Site input and Business Review freeze  
8. Security, ALM, UAT  

**Do not:** create a second SPOT; file a Veeva copy of intake; defer classification past the gate; write a full Ready story backlog before URS/FDS (documents lead, stories follow).

---

## Part D — AI enablement (only if the POD will use Claude / Codex)

Required *before* a new AI request. Contacts: Jan Felix Meyer; Martin Sturm. Do not email Workforce AI Global with an incomplete pack.

| # | Checkpoint | Mark | Notes |
| --- | --- | --- | --- |
| D1 | SPOT ID + value case | `[x]` | A1 on 1063647 |
| D2 | Sponsor and PM on the SPOT team | `[x]` | Joel / Dean |
| D3 | PM-approved token budget on that SPOT | `[~]` | Claude provisioned; add the forecast line; close Aimee Codex ask (due 9 Sep 2026) |
| D4 | Each user: Acceptable-Use + [request form](https://forms.cloud.microsoft/e/UmDFQhZDjN) | `[ ]` | After D1–D3 |

---

## Part E — Not required to submit (do not block the order on these)

| # | Item | When it becomes required |
| --- | --- | --- |
| `[–]` | URS FORM-312922 / FDS FORM-312923 | Design Approval Gate (after Intake) |
| `[–]` | Architecture PR vs VAL-624698 | Design |
| `[–]` | Claude Design + takOS Design System (or Figma Make kit) | Discover UX; optional — live Power Apps already count as prototype evidence |
| `[–]` | Ready user stories (Given/When/Then) | Plan — derived *from* approved URS/FDS |
| `[–]` | POD assigned / Delivery Readiness Gate | After funding |
| `[–]` | GitHub / oneTakeda/takOS access | Build (send username to Maddela, Ravi, Meyer) |
| `[–]` | Branch, PR, SIT, QA Gate, Operate | After Readiness Gate |

The blueprint is the **business** URS/FDS content. It is **not** the Veeva form. Do not tell Marketplace that Design Approval is done.

---

## Part F — Attach this pack to the Marketplace / funding request

| # | File | Role |
| --- | --- | --- |
| `[x]` | Business case — *GSQ DD&T Roadmap Executive Platform MVP v2 Sept 2026* | Value and three-product MVP |
| `[x]` | `GSQ-DDT-Executive-Platform-Design-Blueprint.docx` | Developer specification |
| `[x]` | `GSQ-DDT-Executive-Platform-Executive-Design.docx` | Leadership cut: §§1, 3, 5, 6.4, 12, 13, 15, 16 |
| `[x]` | `GSQ-DDT-Executive-Platform-Executive-Summary.docx` | Band A/B/C decision memo |
| `[x]` | `GSQ-DDT-Executive-Platform-TakOS-Onboarding-Readiness.docx` | Full 41-section gap map |
| `[x]` | **This checklist** | What is met vs what to file next |
| `[x]` | `GSQ-DDT-Executive-Platform-TakOS-Walkthrough.docx` | Official TakOS step screenshot beside pre-filled values |
| `[~]` | SPOT **1063647** link + funding request | After B9–B11 |
| `[ ]` | AIDPG Initiative key | After C2 |

Reconcile business-case §1 (**~$168k / 6–12 weeks**) with §9 (**~$40k / 6 weeks**) to **Band B** in the order. $40k is a thin shell and cannot prove Jira + SPOT + EDB.

---

## Part G — Ordered close-out (do these, then submit)

| Step | Action | Owner | Done? |
| --- | --- | --- | --- |
| 1 | Reconcile §1 vs §9 of the business case to Band B (~$168k) | Dean + finance | `[ ]` |
| 2 | On 1063647: one CAPEX number, funding request, token line; close or log the Aimee Codex ask | Dean + finance | `[ ]` |
| 3 | Create AIDPG Initiative; link 1063647; paste outcome | Dean / DPM | `[ ]` |
| 4 | Create the eight seed Epics | Dean + BA | `[ ]` |
| 5 | Record four classifications on the Epic | Dean + QA consult | `[ ]` |
| 6 | Architect completes FORM-316177 and attaches it | Architect | `[ ]` |
| 7 | Intake evaluation + Intake Governance Gate on the Epic | DD&T Leadership, Portfolio Lead | `[ ]` |
| 8 | File Marketplace order with the Part F pack + Initiative key | Dean | `[ ]` |

**Earliest honest “Intake submitted” date:** when steps 1–7 exist in Jira/SPOT (about one to two weeks of business time). You may file the *funding* request in parallel with steps 2–3. You may **not** say TakOS Intake is complete until step 7.

---

## Contacts (from the onboarding site)

| Topic | Who |
| --- | --- |
| AI enablement (PDT & GSQ) | Jan Felix Meyer; Martin Sturm |
| GitHub / takOS | Venkatagopichand Maddela; Venkatesh Ravi; Jan Felix Meyer |
| Jira board / DoD | Ian Leake |
| takOS Design System / Claude Design | Animesh Pathak; Hari Krishnan N; Asmita Pawar |
| Infrastructure dependencies | Stéphane Dattenny |
| Do not use first for incomplete AI requests | Workforce AI Global |

---

## Controlled sources (pull the current copy from Veeva)

STRD-201016 · SOP-254573 · SOP-254574 · SOP-254575 · SOP-253593 · TOOL-235299 · TOOL-235300 · TOOL-235311 · FORM-316177 · FORM-312922 / 312923 · VAL-624698 · SOP-229697

Do not attach a screenshot of the onboarding website as the form.
