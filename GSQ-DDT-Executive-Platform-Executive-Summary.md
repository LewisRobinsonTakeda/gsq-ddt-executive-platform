# GSQ DD&T Executive Platform

## Executive Summary — Funding Decision

| Field | Value |
| --- | --- |
| Request | Fund a developer engagement to build the GSQ DD&T Roadmap Executive Platform MVP |
| Executive sponsor | Joel Vincent |
| Business sponsor / product lead | Dean Santoro |
| Organization | Global Manufacturing & Labs DD&T |
| Date | 4 September 2026 |
| Companion documents | Business case (MVP v2 Sept 2026); *Design Blueprint*; *TakOS Onboarding Readiness* |
| Decision needed | Approve Band B funding and the Thousand Oaks pilot as the first business-review system of record |

---

## The ask

Approve approximately **$155–168k** and **10–12 weeks** for a small delivery team (~2.5 FTE) to build a **single pane of glass** for how GSQ plants are running their DD&T portfolios.

The platform does not invent a new strategy. It takes the 1,000-foot Power App leadership already uses (Big Rocks × fiscal years × North Star platforms), makes **site** a first-class control for all 18 GSQ Manufacturing & Labs sites, adds the missing **Budget** and **combined Gantt + Budget** views, and drills into the Capability Tracker and Jira/SPOT records that already exist. Site Heads type commentary and asks into the same portal. A business review is run from that portal, not from a slide factory.

This summary is the decision memo. The design blueprint is the specification the developer will build against. The onboarding companion is the TakOS submission checklist.

---

## Why this, why now

Portfolio truth is split across Jira, SPOT, site Power Apps, Power BI, and PowerPoint. The cost is not software — it is **leadership time** and **inconsistent answers** in the same meeting.

The value case already on file projects about **9,000 hours per year** of avoided reporting effort across 18 sites (~500 hours per site per year). The MVP is how we prove that number on Thousand Oaks before we scale the pattern.

Prototypes already exist. What does not exist is a **maintained, site-aware, input-capable portal** that a Site Head and an executive can trust in the room.

---

## What leaders will see

One login. One site selector (Thousand Oaks today is hard-coded; it must become a drop-down for the network). Every tab then shows that site.

| View | Question it answers |
| --- | --- |
| **One pager** | How is this site’s work laid on the six Big Rocks across FY26–FY28+? |
| **Status KPIs** | How many active, on track, at risk — and is that number honest? |
| **Gantt + Budget** | When does it land, and is the money tracking the dates? |
| **Budget** | What did we approve, forecast, and spend? |
| **Risks** | What needs airtime this month? |
| **Jira** | What is the live backlog behind the cards? |
| **Capability** | Are North Star systems deployed, adopted, and integrated? |
| **Business Review** | Can we run the meeting from here? |
| **Site input** | What did the Site Head just confirm, ask, or flag? |
| **Network roadmap** | How does this site sit in the 34-programme / 573-project GSQ picture? |

Drill-down is explicit: card → sidecar → Jira/SPOT → Gantt+Budget → Capability pending integrations. Executives do not hunt for “the other dashboard.”

---

## What is already true (we are not starting from a blank page)

- The Thousand Oaks Strategic Roadmap Power App already implements One pager, Status KPIs, Gantt, Risks, and Jira Links.
- A Budget app and a combined Budget+Gantt app already exist as the visual target for the missing tabs.
- The global DDT roadmap already rolls 34 programmes and 573 projects to site glyphs.
- The Capability Tracker already shows deploy/adopt and integration pairs by plant.
- Jira `DDTGMPORT` and site projects already carry manufacturing SPOT IDs (for example TO MES Elaprase DS — SPOT 1024096).
- **This platform already has its investment record: SPOT 1063647** — *GSQ DD&T Roadmap Executive Platform MVP*, Active, in Plan. Dean Santoro is Project Manager; Joel Vincent is Sponsor. Value case (9,000 hours / year) is on the record. [Open the project board](https://tospot.azurewebsites.net/project-hub/78dd4329-ece5-4796-8cab-776d8ce7af17/project-board).
- Sponsors, the value hypothesis, and the three-product MVP (Roadmap + Business Review + Capability/North Star) are written in the September 2026 business case.

The funded work is **integration, persistence, site context, budget, Site Head input, and a business-review freeze** — not a green-field invention of the 1,000-foot layout.

---

## What we will not do in the MVP

- Replace Jira, SPOT, or EDB.
- Let the portal silently overwrite Jira dates or SPOT money.
- Pretend all 18 sites have Thousand Oaks mapping quality on day one (empty states will be honest).
- Treat the $40k / six-week figure in business-case section 9 as sufficient for Jira + SPOT + EDB together. That figure is a **thin shell only**.

---

## Investment options

| Option | Outcome | Hours | Time | Indicative cost @ $140/h |
| --- | --- | --- | --- | --- |
| A. Thin shell | Site drop-down + wrap today’s tabs. No SPOT, no EDB, no Site Head input. | ~300 | 6 weeks · 1 FTE | ~$42k |
| **B. Recommended MVP** | Live Jira, SPOT budget, combined Gantt, Capability embed, Site input, TO business-review freeze. | **~1,100** | **10–12 weeks · ~2.5 FTE** | **~$155k** |
| C. Full business-case MVP | Band B plus EDB data-product bind and a production network roadmap. | ~1,400 | 12 weeks · ~3 FTE | ~$196k |

**Recommendation: fund Band B at the business-case ~$168k envelope.** Use EDB as a gated increment inside the same order so the three-source hypothesis can still be tested if the API is ready. Do not approve Band A if the success criterion is “executives stop building decks.”

Suggested team: one Power Platform lead, one integration/data engineer (0.7), light Power BI, GML BA, Dean as product lead, part-time PM.

---

## Value and success

**Productivity.** If the TO pilot removes most monthly deck assembly and status chasing, we will measure hours for that site and extrapolate. The filed case is ~42 hours per site per month.

**Decision quality.** One RAG language. One site context. Money and dates on the same row. Capability adoption visible beside the roadmap.

**MVP success (go / no-go for Release 2)**

1. One Thousand Oaks business review is run from the portal.
2. Site Heads can enter commentary and asks; the audit trail is attributable.
3. Jira, SPOT, and the Capability view can be trusted in that meeting without side spreadsheets.
4. Leadership agrees the pattern is reusable for other sites.

---

## Risks we are accepting with eyes open

- API access for Jira/SPOT/EDB is the critical path. If access slips, the calendar slips.
- Section 1 vs. section 9 of the business case disagree on money and duration. This memo supersedes section 9 for scope.
- EDB may not be API-ready; the Capability Tracker embed is the fallback so the meeting still has an adoption view.
- Classification (GxP / SOX / PII) is a working “reporting, not batch record” call and must be confirmed at Intake.

---

## Decision requested

1. **Approve Band B** (~$155–168k, 10–12 weeks) to build the Executive Platform to the attached design blueprint.
2. **Name Thousand Oaks** as the business-review pilot and commit Site Head time for UAT in weeks 9–10.
3. **Keep SPOT 1063647 as the single investment record.** File the funding request on that board. Align the header Expected CAPEX ($35k), the preliminary forecast ($168k), and the Marketplace order to **one** number (Band B).
4. **Authorize the remaining onboarding actions** (AIDPG Initiative linked to 1063647, Pattern-Fit, token line, Intake gate) listed in the onboarding companion.

If approved, the next artefacts are the AIDPG Initiative (pointing at 1063647) and a week-1 field workshop with PMO — not a second SPOT project.
