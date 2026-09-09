# GSQ DD&T Executive Platform

## TakOS Digital Delivery Onboarding — Readiness and Gap List

| Field | Value |
| --- | --- |
| Source of requirements | [takOS Digital Delivery Onboarding](https://landing-page.man.aws.takeda.io/onboarding?view=guide&section=jira) (TOOL-235311 practitioner rendering; effective Veeva documents prevail) |
| Reviewed | 4 September 2026 |
| Product | GSQ DD&T Roadmap Executive Platform MVP |
| Purpose | Show what is already satisfied for Marketplace / Initiate submission, and what must still be completed before the order can start cleanly |
| Companion documents | Business case (MVP v2 Sept 2026); *Design Blueprint*; *Executive Summary* |

The onboarding site is a **41-section, six-phase guide** (Initiate → Design → Plan → Build → Validate & Release → Operate), plus practical guides. It is **not a controlled record**. Formal decisions live in Jira, Veeva, GitHub, qTest, and ITSM — never as a duplicate in a deck.

This document follows the site’s own rule: **documents and intake records lead; stories follow**. Most of what a developer will later do (branch, PR, SIT) is *after* funding. Submission needs the **Initiate** spine plus enough Design/Plan artefacts that a POD can be assigned.

---

## How to read the statuses

| Status | Meaning |
| --- | --- |
| **Done** | Evidence exists today for *this* Executive Platform initiative (not merely for other DDT work). |
| **Partial** | Related material exists (prototypes, business case, portfolio Jira) but is not yet the required controlled or Jira record. |
| **Not started** | Required by the guide; no evidence found in the working folder or live onboarding checks. |
| **Not required for submission** | Needed to *build* or *release*, not to submit the funding / Intake package. Listed so the team does not confuse the two. |

**SPOT is confirmed live (4 Sep 2026):** [1063647 — GSQ DD&T Roadmap Executive Platform MVP](https://tospot.azurewebsites.net/project-hub/78dd4329-ece5-4796-8cab-776d8ce7af17/project-board). AIDPG / Intake still cannot be seen from here and remain *Confirm in Jira*.

---

## Submission snapshot

| Gate / package | Ready to submit? | Blocking gaps |
| --- | --- | --- |
| **Business story + design blueprint + hours** | **Yes** | Reconcile $40k vs $168k in the business case §9 |
| **TakOS Initiate (Intake Governance Gate)** | **No** | AIDPG Initiative linked to **1063647**, FORM-316177 Pattern-Fit, four classifications, gate decision on the Epic. SPOT itself exists. |
| **AI enablement (if the POD will use Claude/Codex)** | **Partial** | Dean (PM) and Joel (Sponsor) are on the SPOT team; Claude tokens already provisioned. Still need a token forecast line, acceptable-use + request form for each new user, and Codex for Aimee (open ask, due 9 Sep) |
| **Design Approval Gate (URS/FDS)** | **No — and should not be claimed yet** | FORM-312922 / 312923, architecture PR. The blueprint is the *business* design package, not the Veeva URS/FDS |
| **Delivery Readiness Gate (build start)** | **No** | POD, story backlog derived from URS/FDS, funding on the Initiative Epic |

**Bottom line:** you now have the **business design package** the Marketplace order asked GML to produce. You do **not** yet have the **Initiate records** the onboarding site requires before a TakOS POD starts. Those are the next business actions, not more PowerPoint.

---

## A. Required before requesting AI or opening a TakOS order

Source: onboarding **01 Request Access to AI** — “Required before onboarding.” Contacts: Jan Felix Meyer; Martin Sturm. Do **not** email Workforce AI Global without this checklist.

| # | Checkpoint (verbatim intent) | Status | What we have | What is still needed | Owner |
| --- | --- | --- | --- | --- | --- |
| A1 | SPOT project ID, with value case and prioritisation recorded | **Done** | **1063647** is live ([project board](https://tospot.azurewebsites.net/project-hub/78dd4329-ece5-4796-8cab-776d8ce7af17/project-board)). Problem statement, 9,000-hour value case, Productivity Improvements, capture start 1 Dec 2026, and FTE-hour metric table (FY26 3,000 · FY27–29 9,000 · 30,000 total) are on the record. Category: Improvement — General Improvement. Governance: Tier 4. | Write **1063647** on the AIDPG Initiative. Keep the value table current. | Dean |
| A2 | Accountable sponsor; required onboarding/endorsements; **you, the sponsor, and the PM appear on the SPOT Project Team** | **Done** | **Santoro, Dean = Project Manager. Vincent, Joel = Sponsor.** Also on the team: Aimee Rarugal, Juraj Krivda, Simran Karamchandani, Ivan Fonseca. | Add any additional AI/POD users to this same team list before they request enablement. | Dean |
| A3 | PM-approved budget for AI tokens on that SPOT project (CAPEX if IAS 38 Development-phase from 1 Jul 2026, else OPEX); monthly reclass of actuals | **Partial** | Board accomplishment: “Claude code tokens provisioned.” Open ask: Codex for Aimee Rarugal from Jan Felix Meyer, due 9 Sep 2026. No dedicated token line visible on the budget grid. | Add an explicit token forecast (guide: ~USD 2,000 / month per 100% FTE). Decide CAPEX vs OPEX with finance. Close the Aimee ask. | Dean + finance |
| A4 | Read and accept *Agentic Coding Acceptable-Use Guidance*; request access via the [approved form](https://forms.cloud.microsoft/e/UmDFQhZDjN) | **Not started** | — | Each person who will use Claude/Codex/Cowork/Copilot/Genie submits the form after A1–A3. | Each user; Dean tracks |

A1 and A2 are met on 1063647. A3–A4 still block a *new* AI request (Aimee’s Codex ask is already in flight with Jan Felix Meyer).

---

## B. Initiate — the actual submission spine

Source: onboarding **03 E2E navigator**, **04 Initiate**, **SPOT**, **JIRA / Initiative / Epic / User Story**. Closing gate: **Intake Governance Gate** (DD&T Leadership; AI&Data Portfolio Lead; QA if GxP = Yes). Leading record: **Initiative Epic in Jira** (SOP-254573: one home; do not file a DMS duplicate). Forms: **FORM-316177** (Pattern-Fit), **TOOL-235299** (Epic content & classification).

### B1. Governing principles (Start & authority)

| Checkpoint | Status | Notes |
| --- | --- | --- |
| Understand the guide is non-controlled; Veeva prevails | **Done** (this document states it) | Sources cited on the site: STRD-201016, SOP-254573, TOOL-235311; last reviewed 19 Aug 2026 |
| Can describe six phases and gates | **Done** for the design team | Initiate / Intake; Design / Design Approval; Plan / Delivery Readiness; Build / story DoD; Validate & Release / QA; Operate |
| Choose Product vs Pattern track | **Partial** | Working call: **Product** (executive portfolio + business review). Architect must confirm via Pattern-Fit |

### B2. SPOT (investment source of truth)

Onboarding rule: *A link alone is not enough. Do not start delivery with an empty SPOT shell.*

| Expected content | Status | Live on 1063647 (4 Sep 2026) |
| --- | --- | --- |
| Problem, outcome, in/out scope | **Done** | Full problem statement on General Info (10–20+ hours/month consolidating; no single trusted source). |
| Value hypothesis with baseline, target, unit, timing | **Done** | 9,000 hours / year · 18 sites · 500 h/site/year · 42 h/site/month. Metric table plans 3,000 (FY26) then 9,000/yr (FY27–29), **30,000 hours** total. Capture start 1 Dec 2026. COP = Productivity Improvements. |
| Named value owner + method to confirm realised value | **Partial** | Dean is PM; Joel is Sponsor. Method (TO BR hours baseline) still to be written into Value Commentary. |
| Milestones, dependencies, risks, status, next priorities | **Partial** | Phase 1–5 + Budget Approved + Execution End + Pilot + Close are dated. Risks table empty. Status: MetrIQ/TakOS will be used. Next: infra buildout. Schedule RAG is yellow (Phase 1 +7 days; Close +63 days vs baseline). |
| Sponsor, Business Owner, delivery lead | **Done** | Joel = Sponsor, Dean = PM. Additional DD&T / data names on the team. |
| Finance owner + approved budget + FY + cost categories | **Partial** | Header **Expected CAPEX $35,000**. Preliminary CAPEX forecast **$168,000** ($42k × FY26–29). Approved CAPEX/OPEX blank. **No funding request row.** These three numbers must become one. |
| Forecast, actual, variance process | **Partial** | CAPEX forecast grid exists (plan/previous/current/preliminary). Plan and current are still $0. OPEX tables hidden until OPEX Required = Yes. |

**Completion checkpoint from the site:** *SPOT contains current value, sponsorship, ownership, budget, milestones, risks and status.* → **Mostly met.** Remaining: funding request, one aligned CAPEX figure, token line, at least one risk or an explicit “none,” richer next-priority text. **Do not create a second SPOT project.**

### B3. Jira hierarchy (AIDPG, not DDTGMPORT)

`DDTGMPORT` is the **manufacturing roadmap data source**. The **delivery** of the Executive Platform needs its own hierarchy:

```
SPOT 1063647  GSQ DD&T Roadmap Executive Platform MVP
  └─ Initiative in AIDPG     ← one business outcome (create this next)
        └─ Epics             ← independently understandable capabilities (Glass, Jira sync, SPOT, Capability, Site input, …)
              └─ User Stories  ← 1:1 with PRs later
```

Onboarding examples (teaching only): Initiative **AIDPG-4897**, Epic **AIDPG-5211**, Story **BICN-174659**. Do not reuse those keys.

| Checkpoint | Status | What we have | What is still needed |
| --- | --- | --- | --- |
| Initiative in **AIDPG** with visible SPOT ID and “Open in SPOT” | **Not started** | Outcome text exists in the blueprint. SPOT to link is **1063647**. | Create Initiative; link 1063647; one measurable outcome; owner; boundary; Initiative-level acceptance |
| Epics under that Initiative | **Not started** | WBS in blueprint §13 is the epic seed list | Create Epics in AIDPG; parent = Initiative; AC, dependencies, points = sum of stories |
| User Stories (Ready, AC in Given/When/Then, risk & DoD, team) | **Not started** | Screen-level acceptance in blueprint §7 and §15 | Create only **after** URS/FDS (guide: documents lead, stories follow). For submission, Initiative + first Epics are enough; a full Ready backlog is Plan phase |
| Jira project access to create/update issues | **Confirm** | Dean works in DDTGMPORT today | Confirm AIDPG (or assigned delivery project) create rights for Dean + future POD |
| Personal Atlassian API token for agents | **Not required for submission** | — | Each developer, later; host must be **onetakeda.atlassian.net** (not takeda.atlassian.net); store outside git; never paste in chat |
| Board automation / Definition of Done | **Not required for submission** | Contact named on site: Ian Leake | POD + Ian when the delivery board is chosen |

**Suggested Initiative statement (ready to paste):**

> Deliver a site-aware GSQ DD&T Executive Platform so leadership can run a Thousand Oaks business review from one portal fed by Jira, SPOT, and capability/EDB data, with Site Head commentary as the only write path.

**Suggested first Epics (from the blueprint WBS):**

1. Executive Glass shell and site master  
2. One pager / KPI persistence  
3. Combined Gantt + Budget and Budget tab  
4. Jira inbound sync  
5. SPOT inbound sync  
6. Capability Tracker embed (+ EDB increment)  
7. Site input and Business Review freeze  
8. Security, ALM, UAT  

### B4. Pattern-Fit Screening (FORM-316177)

| Item | Status | Working content to drop into the form |
| --- | --- | --- |
| FORM-316177 completed and **attached to the Initiative Epic** | **Not started** | Architect-owned |
| Solution path | **Not started** | Working recommendation: **Product track**, **Reuse with PCR** or **Custom Build** for the Glass + three-source sync. Reuse existing Power Apps/PBI as UX evidence and embeds. Written justification: no validated “GSQ executive glass” Pattern; prototypes are not a Pattern. |
| Pattern IDs and versions if reuse | **Not started** | Must be real catalogue IDs (site: no free-text references) |
| Four classifications | **Not started** | Working: **GxP = No**; **Criticality = Medium**; **SOX = Review**; **PII = Low**. QA named as gate approver only if GxP becomes Yes. Reducing a classification later needs documented QA concurrence. |

### B5. Intake Governance Gate — self-check (from the site)

| Self-check | Status |
| --- | --- |
| Evaluation decision (Proceed / Reject / Refine) on the intake record with rationale | **Not started** |
| Epic content: every Mandatory and applicable Conditional item in TOOL-235299 §3 | **Not started** |
| FORM-316177 attached with path + justification | **Not started** |
| All four classifications recorded | **Not started** |
| QA named where GxP = Yes | **N/A** unless classification flips |
| Gate decision on the Epic with named approvers, date, rationale (Jira R5 transition is the record) | **Not started** |

**Do not:** create a Veeva duplicate of intake, screening, or the gate; defer classification past the gate; use verbal gates.

---

## C. Access and machine (needed to start a POD, not to file the business case)

### C1. Request Access to GIT (05)

| Checkpoint | Status | Action |
| --- | --- | --- |
| Follow the [GitHub access guide](https://mytakeda.sharepoint.com/sites/DevOps/SitePages/GitHub-User-Access-Guide.aspx#request-access-for-new-users%E2%80%8B); join myAccess group | **Confirm per person** | Each delivery user |
| Access to [oneTakeda/takOS](https://github.com/oneTakeda/takOS) | **Partial** | A local `takOS` clone exists on the workstation used for this design; **Marketplace POD members still need their own access** |
| GitHub username sent to **Venkatagopichand Maddela**, **Venkatesh Ravi (ext)**, **Jan Felix Meyer** | **Confirm** | Required checkpoint |
| Can open takOS with own account | **Confirm** | No shared tokens, cookies, or passwords in prompts |

### C2. Set up the local machine (06)

| Checkpoint | Status | Notes |
| --- | --- | --- |
| VS Code, current Node.js, GitHub Desktop | **Not required for submission** | Developer laptop; mySupportHub if blocked |
| Claude Code and/or Codex extension | **Not required for submission** | After A4 enablement |
| Attributable commits only | Policy — state in the Initiative | Never share PATs in source or screenshots |

---

## D. Design phase (after Intake; before a funded build if TakOS-governed)

Source: **07 Design**. Purpose: intended use (URS) + technical implementation (FDS). Closing gate: **Design Approval Gate**. Leading records: **FORM-312922 (URS)** and **FORM-312923 (FDS)** in Veeva; architecture approval = **GitHub PR** vs VAL-624698. Approvers: DPM, Validation Lead, Testing Lead, QA (mandatory if GxP-relevant).

| Design step | Status | What we have | Gap |
| --- | --- | --- | --- |
| Approved Initiative + FORM-316177 as inputs | **Not started** | — | Finish Initiate first |
| URS FORM-312922: purpose, compliance, success criteria, risk class | **Partial** | Blueprint §2, §10, §15 *is* the business URS content | Transcribe into FORM-312922; make every requirement testable (no “user-friendly”) |
| FDS FORM-312923: design, config, dependencies, security; Pattern IDs; map every URS line | **Partial** | Blueprint §9–11 is the functional/technical design | Transcribe into FORM-312923; Architect maps Patterns |
| Prototype (takOS PLAY / Claude Design / existing apps) | **Partial / ahead** | Live Power Apps, Capability Tracker, global roadmap, local recreation | Optional: Claude Design with **takOS Design System** selected (recommended path on the site). Do not “make it look like takOS” on a generic system |
| Claude Design access + takOS Design System pill | **Not started** | Site: claude.ai, Takeda org, Design menu; contacts Animesh Pathak, Hari Krishnan N, Asmita Pawar if the system is missing | Only if the POD will hand off Design → Claude Code |
| Figma Make + published takOS Make kit | **Not started** | Alternative to Claude Design | Only if that is the chosen Discover UX path |
| Reviewer log; critical comments closed | **Not started** | — | Validation, Testing, QA, Business Owner |
| Architecture PR in the federated monorepo | **Not started** | Do **not** copy that approval into Veeva | Architect / Platform Owner |
| eDSP if the product has its own APMS ID | **Confirm** | SOP-229697 | Product Owner if APMS applies |
| Design Approval Gate = approval of URS+FDS | **Not started** | No separate gate memo | DPM + listed approvers |

**Discover UX (08)** is a *how to prototype* guide (Claude Design recommended; Figma Make alternate). It is **not** a second funding gate. Using the existing Power Apps as the high-fidelity prototype is legitimate evidence for the business case; a TakOS POD may still be asked to reproduce the journey on the takOS Design System before Build.

---

## E. Plan phase (Delivery Readiness Gate)

Source: **09 Plan**. No build before this gate. Leading record: Jira (backlog + Initiative Epic). Approvers: Domain Product Manager; Product Owner.

| Plan step | Status | Notes |
| --- | --- | --- |
| Assign POD; roles in Jira | **Not started** | This is what the Marketplace order buys |
| Derive epics/stories **from approved URS/FDS** | **Not started** | Blueprint WBS is the seed; do not invert the rule |
| Business case & funding on the Initiative Epic | **Partial** | Business case Word exists; must be linked from the Epic |
| Infrastructure dependencies named (DB, data space, API, secrets) | **Partial** | Blueprint: Dataverse, Jira API, SPOT API, EDB API, Power BI embed, Entra. Contact on site for infra questions: **Stéphane Dattenny** |
| Claude Code Plan-mode handoff | **Not required for submission** | Read-only; zero files changed; after Design |
| Delivery Readiness Gate on the Epic | **Not started** | — |

---

## F. After funding — not submission blockers

These are the remaining onboarding sections so the request package does not claim they are “done.”

| # | Section | When | Status |
| --- | --- | --- | --- |
| 10 | Build | After Readiness Gate | Not started |
| 11 | Create a JIRA-linked branch | Per story | Not started |
| 12 | Build with an agent | Per story | Not started |
| 13 | Validate locally | Per story | Not started |
| 14 | Commit and push | Per story | Not started |
| 15 | Raise the PR | Per story | Not started |
| 16 | Resolve review & CI | Per story | Not started |
| 17 | Merge & update JIRA truthfully | Per story | Not started |
| 18 | Promote to SIT | After build evidence | Not started |
| 19 | Test & close SIT | Integrated journey | Not started |
| 20 | Validate & release (QA Gate) | Release package | Not started |
| 21 | Operate | After go-live | Not started |
| 22 | Interactive completion aids | Optional helpers | Available on the site (stateless; not records) |
| 23 | Pattern-Fit decision tree | Use while completing FORM-316177 | Not started |
| 24 | Records & controlled documents | Always — pull current forms from Veeva | Remind: this website is not the form |
| 25 | Escalation routes | If a gate is blocked | Prepare: work item, blocked decision, classification uncertainty, decision needed, date. Patient-safety / quality / regulatory → QA same day. Escalation never bypasses a gate (SOP-254575) |

Story-level rules the POD must obey later: Functional Risk Profile and DoD from the start; 1:1 story-to-PR; no SIT before development evidence; merged PR ≠ release.

---

## G. What we have already done (use this list in the request)

These items **do** satisfy parts of the Marketplace / GML design-package expectation even though they are not yet Veeva forms.

1. **Business case (MVP v2, Sept 2026)** — problem, opportunity, three-product MVP, Jira/SPOT/EDB in-scope, value, risks, sponsors, release sequence.
2. **Business Design Package (this engagement)** — workflows, screen inventory, navigation, drill-downs, Site Head write-path, data/KPI rules, security assumptions, MVP vs later, acceptance criteria, hour-level WBS.
3. **Standalone executive summary** — decision memo with Band A/B/C and the $40k vs $168k reconciliation.
4. **Working prototypes as design evidence** — TO Strategic Roadmap Power App; Budget app; combined Gantt+Budget app; Capability Tracker (two screens); global DDT roadmap (network, regions, sites, initiatives).
5. **Named leadership on SPOT 1063647** — Joel Vincent (Sponsor), Dean Santoro (Project Manager), plus Aimee Rarugal, Juraj Krivda, Simran Karamchandani, Ivan Fonseca.
6. **Investment record** — [SPOT 1063647](https://tospot.azurewebsites.net/project-hub/78dd4329-ece5-4796-8cab-776d8ce7af17/project-board) is Active / Plan, Data Quality 100%, value case and problem statement loaded. Manufacturing SPOT IDs (e.g. 1024096) remain the *plant* data source, not this delivery record.
7. **18-site master** — Americas / Europe / Asia-Pacific with reporting-line exceptions (Vashi → Europe, Yaroslavl → APAC).
8. **Classification strawman** — GxP No / Criticality Medium / SOX review / PII Low, ready for TOOL-235299.
9. **Pattern-Fit strawman** — Product track; reuse embeds + custom Glass; justification drafted.
10. **Onboarding gap list (this file)** — mapped to the live 41-section guide dated from the site’s 19 Aug 2026 metadata.

---

## H. Ordered actions before you submit

Do these in order. Hours are elapsed business effort, not developer build hours.

| Step | Action | Effort | Owner | Blocks |
| --- | --- | --- | --- | --- |
| 1 | Reconcile business-case §1 ($168k / 6–12 weeks) and §9 ($40k / 6 weeks) to **Band B** | 1–2 h | Dean + finance | Honest Marketplace order |
| 2 | On **1063647**: file the funding request; set Expected CAPEX, preliminary forecast, and the order to the **same** Band B number; add a token line; log or close the Aimee Codex ask | 2–4 h | Dean + finance | A3, Marketplace money |
| 3 | Create **AIDPG Initiative**; link **1063647**; paste outcome, boundary, AC | 2–3 h | Dean / DPM | Intake |
| 4 | Create the eight seed **Epics** from §B3 | 2–3 h | Dean + BA | Plan later |
| 5 | Complete **four classifications** on the Epic | 1 h + QA if needed | Dean + QA consult | Gate |
| 6 | Architect completes **FORM-316177**; attach to Epic | 4–8 h | Architect | Gate |
| 7 | Intake evaluation **Proceed** + **Intake Governance Gate** on the Epic | 1 meeting | DD&T Leadership, Portfolio Lead | Design |
| 8 | If the POD will use agents: acceptable-use + [request form](https://forms.cloud.microsoft/e/UmDFQhZDjN) + token forecast | 1 h / person | Each user | AI access |
| 9 | GitHub usernames to Maddela, Ravi, Meyer; takOS repo access | 1–3 days lead time | Each delivery user | Build, not submission |
| 10 | File Marketplace order **with** business case + executive summary + this readiness list + design blueprint | 1 h | Dean | Funding |
| 11 | After gate: URS/FDS (FORM-312922/23), then stories | Design phase | PO + POD | Build |

**Earliest honest submission date:** when steps 1–7 are in Jira/SPOT (typically **one to two weeks** of business time if Architect and Leadership slots are available). Do not wait for URS/FDS or Claude Design to file the *funding* request, but do not tell Marketplace that Intake is complete until step 7 exists on the Epic.

---

## I. Contacts copied from the onboarding site

| Topic | Who the site names |
| --- | --- |
| AI enablement (PDT & GSQ) | Jan Felix Meyer; Martin Sturm |
| GitHub / takOS access | Venkatagopichand Maddela; Venkatesh Ravi; Jan Felix Meyer |
| Jira board automation / DoD | Ian Leake |
| takOS Design System / Claude Design | Animesh Pathak; Hari Krishnan N; Asmita Pawar |
| Infrastructure dependencies | Stéphane Dattenny |
| Do not use as first contact for incomplete AI requests | Workforce AI Global |

---

## J. Traceability to controlled sources (as cited by the guide)

| Source | How it applies here |
| --- | --- |
| STRD-201016 | Lifecycle / intake expectations |
| SOP-254573 | E2E process; one system of record |
| SOP-254574 | Change classification later |
| SOP-254575 | Deviations if a gate is skipped |
| SOP-253593 | Product validation; Design §4.4 |
| TOOL-235299 | Epic content & classification |
| TOOL-235300 | Story DoD |
| TOOL-235311 | This practitioner guide |
| FORM-316177 | Pattern-Fit |
| FORM-312922 / 312923 | URS / FDS |
| VAL-624698 | Platform TSD — architecture PR |
| SOP-229697 | eDSP / infrastructure qualification if APMS applies |

Pull the **current effective** copy from Veeva at the time of filing. Do not attach a screenshot of the onboarding website as the form.

---

## Document history

| Version | Date | Notes |
| --- | --- | --- |
| 1.0 | 4 Sep 2026 | Mapped from the live takOS onboarding guide against the GML business case and prototypes |
| 1.1 | 4 Sep 2026 | Confirmed live SPOT **1063647** (Active / Plan). A1–A2 marked Done. Budget $35k vs $168k and missing funding request called out. |
