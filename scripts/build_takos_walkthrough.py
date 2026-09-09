#!/usr/bin/env python3
"""TakOS start-to-finish walkthrough: official step screenshot beside pre-filled values."""

from __future__ import annotations

from io import BytesIO
from pathlib import Path

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Inches, Pt, RGBColor
from PIL import Image

ROOT = Path("/Users/chilr357/L-Bax_Archive/Thousand Oaks DDT/2026 Strategy/Dean Capability Tracker")
ASSETS = ROOT / "design-assets" / "takos-steps"
DOCX = ROOT / "GSQ-DDT-Executive-Platform-TakOS-Walkthrough.docx"
MD = ROOT / "GSQ-DDT-Executive-Platform-TakOS-Walkthrough.md"

NAVY = RGBColor(0x10, 0x20, 0x33)
RED = RGBColor(0x9F, 0x1B, 0x2C)
SLATE = RGBColor(0x33, 0x3A, 0x44)
GREY = RGBColor(0x5B, 0x64, 0x70)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
ROW_ALT = "F4F6F8"
HEADER_BG = "102033"
NOW_BG = "1F6B3A"
LATER_BG = "8A6D1B"
GUIDE = "https://landing-page.man.aws.takeda.io/onboarding?view=guide&section=jira"

# --- paste-ready content for this initiative ---
INITIATIVE_NAME = "GSQ DD&T Roadmap Executive Platform MVP"
OUTCOME = (
    "Deliver a site-aware GSQ DD&T Executive Platform so leadership can run a "
    "Thousand Oaks business review from one portal fed by Jira, SPOT, and "
    "capability/EDB data, with Site Head commentary as the only write path."
)
PROBLEM = (
    "Leadership business reviews stitch Jira, SPOT, Power Apps, Power BI and "
    "PowerPoint by hand. There is no single maintained portal for an 18-site GSQ M&L review."
)
INTENDED_USE = (
    "Site-aware Executive Platform so a Site Head or DD&T leader can run a "
    "Thousand Oaks (then network) business review from one Glass: live Jira + SPOT + "
    "capability/EDB, Gantt+Budget, and Site Head commentary. Jira/SPOT/EDB stay "
    "read-only. Only Dataverse writes: commentary, local risk, mapping, leadership asks, freeze packs."
)
IN_SCOPE = (
    "Site selector (18 GSQ M&L sites). Tabs: One pager, KPIs, Gantt+Budget, Budget, "
    "Risks, Jira, Capability, Business Review, Site input, Network roadmap. Read-only "
    "Jira/SPOT/EDB. Dataverse writes for commentary, local risk, asks, mapping, freeze pack."
)
OUT_SCOPE = (
    "Do not rebuild the existing Power Apps. Do not create a second SPOT. No Jira/SPOT "
    "write-back. No all-18 mapping quality guarantee. No AI narrative. No GxP execution. "
    "DDTGMPORT remains the manufacturing data source, not the delivery Initiative."
)
VALUE = (
    "9,000 hours/year avoided review-prep across 18 sites (42 h/site/month). "
    "30,000 hours total. COP = Productivity Improvements. First capture 1 Dec 2026."
)
SEED_EPICS = [
    "Executive Glass shell and site master",
    "One pager / KPI persistence",
    "Combined Gantt + Budget and Budget tab",
    "Jira inbound sync",
    "SPOT inbound sync",
    "Capability Tracker embed (+ EDB increment)",
    "Site input and Business Review freeze",
    "Security, ALM, UAT",
]


def shade(cell, hex_color: str) -> None:
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:fill"), hex_color)
    shd.set(qn("w:val"), "clear")
    tcPr.append(shd)


def borders(cell, color="D0D5DD") -> None:
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = OxmlElement("w:tcBorders")
    for edge in ("top", "left", "bottom", "right"):
        el = OxmlElement(f"w:{edge}")
        el.set(qn("w:val"), "single")
        el.set(qn("w:sz"), "4")
        el.set(qn("w:color"), color)
        tcBorders.append(el)
    tcPr.append(tcBorders)


def set_run(run, *, size=10, color=SLATE, bold=False, italic=False, name="Calibri"):
    run.font.name = name
    run._element.rPr.rFonts.set(qn("w:eastAsia"), name)
    run.font.size = Pt(size)
    run.font.color.rgb = color
    run.bold = bold
    run.italic = italic


def cell_text(cell, text, *, size=8, bold=False, color=SLATE, header=False):
    cell.text = ""
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(1)
    p.paragraph_format.space_after = Pt(1)
    run = p.add_run(text)
    if header:
        set_run(run, size=8, color=WHITE, bold=True)
    else:
        set_run(run, size=size, color=color, bold=bold)
    borders(cell)


def jpeg_bytes(path: Path, max_w=1400) -> BytesIO | None:
    if not path.exists():
        return None
    img = Image.open(path)
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    ratio = min(max_w / img.width, 1.0)
    if ratio < 1.0:
        img = img.resize((int(img.width * ratio), int(img.height * ratio)), Image.Resampling.LANCZOS)
    buf = BytesIO()
    buf.name = path.stem + ".jpg"
    img.save(buf, format="JPEG", quality=72, optimize=True)
    buf.seek(0)
    buf._w, buf._h = img.width, img.height
    return buf


def set_col_widths(table, widths):
    for row in table.rows:
        for i, w in enumerate(widths):
            row.cells[i].width = w


def add_kv_table(container, rows, *, header=("Field", "Enter / attach")):
    tbl = container.add_table(rows=len(rows) + 1, cols=2)
    tbl.alignment = WD_TABLE_ALIGNMENT.LEFT
    tbl.autofit = True
    h0, h1 = tbl.rows[0].cells
    shade(h0, HEADER_BG)
    shade(h1, HEADER_BG)
    cell_text(h0, header[0], header=True)
    cell_text(h1, header[1], header=True)
    for i, (k, v) in enumerate(rows, start=1):
        c0, c1 = tbl.rows[i].cells
        if i % 2 == 0:
            shade(c0, ROW_ALT)
            shade(c1, ROW_ALT)
        cell_text(c0, k, bold=True, size=8)
        cell_text(c1, v, size=8)
    return tbl


_bookmark_seq = 0


def next_bookmark_id() -> str:
    global _bookmark_seq
    _bookmark_seq += 1
    return str(_bookmark_seq)


def bookmark_name(step_id: str) -> str:
    return "step_" + step_id.replace(".", "_")


def add_bookmark(paragraph, name: str) -> None:
    bid = next_bookmark_id()
    start = OxmlElement("w:bookmarkStart")
    start.set(qn("w:id"), bid)
    start.set(qn("w:name"), name)
    end = OxmlElement("w:bookmarkEnd")
    end.set(qn("w:id"), bid)
    paragraph._p.insert(0, start)
    paragraph._p.append(end)


def add_anchor_hyperlink(paragraph, anchor: str, text: str, *, size=10, color=NAVY, bold=False):
    hyperlink = OxmlElement("w:hyperlink")
    hyperlink.set(qn("w:anchor"), anchor)
    run = OxmlElement("w:r")
    rPr = OxmlElement("w:rPr")
    rFonts = OxmlElement("w:rFonts")
    rFonts.set(qn("w:ascii"), "Calibri")
    rFonts.set(qn("w:hAnsi"), "Calibri")
    rPr.append(rFonts)
    sz = OxmlElement("w:sz")
    sz.set(qn("w:val"), str(int(size * 2)))
    rPr.append(sz)
    color_el = OxmlElement("w:color")
    color_el.set(qn("w:val"), f"{color}")
    rPr.append(color_el)
    if bold:
        rPr.append(OxmlElement("w:b"))
    u = OxmlElement("w:u")
    u.set(qn("w:val"), "single")
    rPr.append(u)
    run.append(rPr)
    t = OxmlElement("w:t")
    t.set(qn("xml:space"), "preserve")
    t.text = text
    run.append(t)
    hyperlink.append(run)
    paragraph._p.append(hyperlink)


def add_pageref(paragraph, anchor: str, *, size=9, color=GREY):
    def fld(kind: str):
        el = OxmlElement("w:fldChar")
        el.set(qn("w:fldCharType"), kind)
        return el

    r1 = paragraph.add_run()
    r1._r.append(fld("begin"))
    r2 = paragraph.add_run()
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = f" PAGEREF {anchor} \\h "
    r2._r.append(instr)
    r3 = paragraph.add_run()
    r3._r.append(fld("separate"))
    r4 = paragraph.add_run("·")
    r5 = paragraph.add_run()
    r5._r.append(fld("end"))
    for run in (r1, r2, r3, r4, r5):
        set_run(run, size=size, color=color)


def enable_update_fields(doc: Document) -> None:
    settings = doc.settings.element
    if settings.find(qn("w:updateFields")) is None:
        el = OxmlElement("w:updateFields")
        el.set(qn("w:val"), "true")
        settings.append(el)


def add_page_chrome(doc: Document, subtitle: str):
    header = doc.sections[0].header
    header.is_linked_to_previous = False
    p = header.paragraphs[0]
    p.text = ""
    r = p.add_run("GSQ GML DD&T  ·  Executive Platform  ·  ")
    set_run(r, size=8, color=GREY)
    r2 = p.add_run(subtitle)
    set_run(r2, size=8, color=RED, bold=True)

    footer = doc.sections[0].footer
    fp = footer.paragraphs[0]
    fp.text = ""
    fr = fp.add_run("Confidential — Takeda internal  ·  8 September 2026  ·  Page ")
    set_run(fr, size=8, color=GREY)
    fld = OxmlElement("w:fldChar")
    fld.set(qn("w:fldCharType"), "begin")
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = " PAGE "
    fld2 = OxmlElement("w:fldChar")
    fld2.set(qn("w:fldCharType"), "end")
    run = fp.add_run()
    run._r.append(fld)
    run2 = fp.add_run()
    run2._r.append(instr)
    run3 = fp.add_run()
    run3._r.append(fld2)
    set_run(run, size=8, color=GREY)
    set_run(run2, size=8, color=GREY)
    set_run(run3, size=8, color=GREY)


STEPS = [
    {
        "id": "01",
        "when": "now",
        "title": "Start & authority",
        "guide": "Guide §01 — Begin with the governed delivery path",
        "shot": "takos-01-start-authority.png",
        "note": "Acknowledge the guide is non-controlled. Veeva prevails. This initiative is a Product, not a Pattern.",
        "rows": [
            ("Delivery track", "Product — executive portfolio + business review. Pattern-Fit in Initiate confirms the route."),
            ("Proportionate assurance", "GxP No · Criticality Medium · SOX display-only DD&T budget (finance to confirm) · PII Low"),
            ("Golden thread", "SPOT 1063647 → AIDPG Initiative → 8 seed Epics → stories/PRs after URS/FDS"),
            ("Accountable humans", "Sponsor Joel Vincent · PM Dean Santoro · gate: DD&T Leadership + AI&Data Portfolio Lead"),
            ("Systems of record", "Jira = demand/backlog · Veeva = URS/FDS later · GitHub after POD · SPOT = investment"),
            ("Checkpoint", "Tick: this guide is non-controlled; effective Veeva documents prevail."),
        ],
    },
    {
        "id": "02",
        "when": "now",
        "title": "Request Access to AI",
        "guide": "Guide §02 — Required before onboarding (any token-metered tool)",
        "shot": "takos-02-request-ai.png",
        "note": "Do not email Workforce AI Global with an incomplete pack. Contacts: Jan Felix Meyer; Martin Sturm.",
        "rows": [
            ("SPOT project ID", "1063647 — GSQ DD&T Roadmap Executive Platform MVP"),
            ("Value case on SPOT", "9,000 h/yr · 18 sites · 42 h/site/month · 30,000 h total · capture 1 Dec 2026"),
            ("Prioritisation", "Active / Plan · Tier 4 · Improvement — General Improvement · COP = Productivity Improvements"),
            ("Sponsor on Project Team", "Joel Vincent"),
            ("Project manager on Project Team", "Dean Santoro"),
            ("Also on team", "Lewis Robinson (Co-PM) · Aimee Rarugal · Juraj Krivda · Simran Karamchandani · Ivan Fonseca"),
            ("Token budget on SPOT", "OPEN — add a forecast line. Guide: ~USD 2,000 / month per 100% FTE, pro-rata. Claude tokens already provisioned; close Aimee Codex ask (due 9 Sep 2026)."),
            ("CAPEX vs OPEX for tokens", "OPEX unless IAS 38 Development-phase applies (from 1 Jul 2026). PM decides with finance."),
            ("Acceptable Use + form", "Each user: Agentic Coding Acceptable-Use, then https://forms.cloud.microsoft/e/UmDFQhZDjN"),
            ("Ask enablement from", "Jan Felix Meyer or Martin Sturm — after the four checks above"),
        ],
    },
    {
        "id": "03",
        "when": "now",
        "title": "E2E process navigator",
        "guide": "Guide §03 — Six phases. One continuous state of control.",
        "shot": "takos-03-e2e-navigator.png",
        "note": "Submission closes at the Intake Governance Gate. Do not claim Design Approval or Delivery Readiness.",
        "rows": [
            ("This submission’s phase", "Initiate only"),
            ("Closing gate to claim now", "Intake Governance Gate — recorded on the AIDPG Initiative Epic (Jira R5). No Veeva duplicate."),
            ("Shared then split", "Initiate is shared. From Design: Product track (this work)."),
            ("Documents lead, stories follow", "Do not write a full Ready story backlog before URS/FDS."),
            ("Reuse first", "Embed live Power Apps / PBI. Custom Glass is the shell."),
            ("No gate, no progress", "Do not start Build. Do not file URS/FDS yet."),
            ("Checkpoint", "Tick only when you can name the six phases and this initiative’s current gate."),
        ],
    },
    {
        "id": "04",
        "when": "now",
        "title": "Initiate",
        "guide": "Guide §04 — Capture, classify, screen, approve demand",
        "shot": "takos-04-initiate.png",
        "note": "Leading record = Initiative Epic in Jira (AIDPG). Everything lives on or is attached to that Epic.",
        "rows": [
            ("Purpose", "Capture, classify, evaluate, approve demand. Pattern-Fit decides Product vs Pattern from Design on."),
            ("Leading record", "AIDPG Initiative (create next). Link “Open in SPOT” → 1063647."),
            ("Forms / tools", "FORM-316177 Pattern-Fit · TOOL-235299 Epic content & classification"),
            ("Gate", "Intake Governance Gate — DD&T Leadership + AI&Data Portfolio Lead. QA only if GxP = Yes (it is No)."),
            ("1 Capture", "Business Owner / Dean — paste problem, intended use, scope, four classifications (see §22)."),
            ("2 Evaluate", "Portfolio Lead — Proceed / Reject / Refine. Proposed: Proceed."),
            ("3 Create Initiative Epic", "DPM / Dean — AIDPG, not DDTGMPORT."),
            ("4 Screen Pattern-Fit", "Architect — FORM-316177. Path: Custom Build (Glass) + reuse embeds."),
            ("5 Intake gate", "Named approvers, date, rationale on the Jira R5 screen."),
            ("6 Backlog / Design", "Only after the gate. Do not skip here."),
        ],
    },
    {
        "id": "04a",
        "when": "now",
        "title": "SPOT",
        "guide": "Guide §04 · SPOT — Begin with the reason the work deserves capacity",
        "shot": "takos-04a-spot.png",
        "note": "A link alone is not enough. Do not create a second SPOT. Guide example 1060537 is teaching only. The next pages are the live 1063647 record (captured 8 Sep 2026).",
        "rows": [
            ("SPOT ID (do not change)", "1063647"),
            ("Name (keep identical everywhere)", INITIATIVE_NAME),
            ("Board", "https://tospot.azurewebsites.net/project-hub/78dd4329-ece5-4796-8cab-776d8ce7af17/project-board"),
            ("What the guide requires", "Value, sponsor, ownership, budget, milestones, risks, status — not an empty shell"),
            ("Live record follows", "Board · General Info · Value · Budget · Team · Documents"),
        ],
    },
    {
        "id": "04a1",
        "when": "now",
        "title": "Live SPOT 1063647 — Project Board",
        "guide": "SPOT Project Hub · captured 8 Sep 2026 after Takeda sign-in",
        "shot": "takos-spot-1063647-board.png",
        "note": "Budget traffic light is red because header CAPEX ($35k) does not match the $168k forecast and there is no funding request.",
        "rows": [
            ("State / phase", "Active · Plan · Data Quality 100%"),
            ("Overall status (on record)", "MetrIQ/TakOS platform will be utilized. Last updated 25-Aug-2026."),
            ("Recent accomplishment", "Claude code tokens provisioned."),
            ("Next priorities (on record)", "Infra buildout. Change to: AIDPG Initiative + funding request + one CAPEX number."),
            ("Risks / Issues", "Empty — add at least one risk or an explicit “none”."),
            ("Ask / Need", "Provision Codex for Aimee Rarugal · Meyer, Jan Felix · due 09-Sep-2026 · still open"),
            ("Milestones on the board", "Phase 1 MVP Scope 04-Sep · Experience Design 18-Sep · Budget Approved 18-Sep · Funding Approval 25-Sep · Execution End 13-Nov · MVP Build 20-Nov · Pilot 11-Dec · Depreciation / Close 22-Jan-2027"),
            ("Schedule light", "Yellow — Phase 1 planned 04-Sep vs baseline 28-Aug (variance 11 days)"),
        ],
    },
    {
        "id": "04a2",
        "when": "now",
        "title": "Live SPOT — General Info",
        "guide": "SPOT · General Info. These values already exist — copy them onto the AIDPG Initiative.",
        "shot": "takos-spot-1063647-general.png",
        "note": "Do not create a second SPOT. If a field here conflicts with the Jira Initiative, change Jira to match 1063647.",
        "rows": [
            ("Project Name", INITIATIVE_NAME),
            ("Portfolio Owner / Execution Scope", "Global-DD&T PDT & GSQ"),
            ("Owning Organization", "DD&T"),
            ("Project Manager", "Santoro, Dean"),
            ("Sponsor", "Vincent, Joel"),
            ("Project Type", "Standard Project / Program"),
            ("Primary Product", "NA (None)"),
            ("Project Category", "Improvement - General Improvement"),
            ("Governance Tier", "Tier 4 - OpU/Global Function LT"),
            ("Record created / submitted by", "25-Aug-2026 · Santoro, Dean"),
            ("Problem (already on SPOT)", "DD&T leaders spend 10–20+ hours/month consolidating Jira, SPOT, Power Apps, Power BI and PowerPoint. No single trusted view of delivery, risk, value, bottlenecks or site comparison."),
            ("Use this on the Initiative", "Keep this problem text. Add the intended-use sentence from §22 B2."),
        ],
    },
    {
        "id": "04a3",
        "when": "now",
        "title": "Live SPOT — Value Creation",
        "guide": "SPOT · Value Creation/Prioritization",
        "shot": "takos-spot-1063647-value.png",
        "note": "Value case is strong enough to cite. Header Expected CAPEX $35,000 is the number that must be aligned to Band B.",
        "rows": [
            ("Value Capture Start", "01-Dec-2026"),
            ("COP Impact Category", "Productivity Improvements"),
            ("Value Commentary (on record)", "≈9,000 hours/year across 18 GSQ M&L sites · ≈500 h/site/year · ≈42 h/site/month."),
            ("Metric", "FTE Hrs · Owner Global · On Track · Capture"),
            ("FY26 / FY27 / FY28 plan", "3,000 · 9,000 · 9,000 hours (Actuals all 0)"),
            ("Total Expected CAPEX (header)", "$35,000 — WRONG for Band B. Change to ~$168,000."),
            ("Approved CAPEX / OPEX", "Blank — correct until the funding request is approved"),
            ("Total COP Optimization (USD)", "0 — hours are the unit; leave USD at 0"),
            ("Still write", "TO BR-hours baseline method into Value Commentary so realised hours can be confirmed."),
        ],
    },
    {
        "id": "04a4",
        "when": "now",
        "title": "Live SPOT — Budget (funding gap)",
        "guide": "SPOT · Budget. CAPEX required. No funding request row.",
        "shot": "takos-spot-1063647-budget.png",
        "note": "This is why the board Budget light is red. File the funding request on this board — do not open a second SPOT.",
        "rows": [
            ("Budget ID", "DDTGML26-004"),
            ("Budget Owner", "DD&T Global Manufacturing & Labs"),
            ("Local currency", "USD"),
            ("CAPEX Required", "Yes"),
            ("Where / Why", "IT/OT · Improvement"),
            ("Project Funding Status", "Not Initiated Future Spend FY Y0"),
            ("Funding Requests table", "No data to display — FILE the Band B row here"),
            ("Total Approved CAPEX / OPEX", "Blank — leave until approved"),
            ("OPEX Required", "No / not saved Yes — token line still needed if the POD uses Claude/Codex"),
            ("What to type on the request", "CAPEX ~$168,000 · Band B · 10–12 weeks · ~1,100 hours. Reconcile business-case §1 vs §9 to this number."),
        ],
    },
    {
        "id": "04a5",
        "when": "now",
        "title": "Live SPOT — CAPEX forecast $168k",
        "guide": "SPOT · Budget · Current 2026LBE08 versus Plan 2026LBE02",
        "shot": "takos-spot-1063647-budget-forecast.png",
        "note": "Dean submitted 2026LBE08 on 02-Sep-2026. Forecast is already Band B. Header Expected CAPEX is not.",
        "rows": [
            ("Forecast period", "Current · 2026LBE08 · submitted 02-Sep-2026 05:41 by Santoro, Dean"),
            ("Total Forecast Projection", "$168,000 (100%)"),
            ("Shape", "Oct–Jan $42,000 each · FY2026 $168,000 · later years $0"),
            ("Plan row", "All zeros — only Current carries the $168k"),
            ("Action 1", "Set Value header Total Expected CAPEX from $35,000 to $168,000"),
            ("Action 2", "Add a Funding Request for $168,000 CAPEX against DDTGML26-004"),
            ("Action 3", "Add a token forecast line (~USD 2,000 / month per 100% FTE, pro-rata)"),
            ("Do not", "Change the forecast down to $35k or $40k — that is Band A and cannot prove Jira + SPOT + EDB"),
        ],
    },
    {
        "id": "04a6",
        "when": "now",
        "title": "Live SPOT — Project Team",
        "guide": "SPOT · Project Team. AI and Intake both require sponsor + PM on this list.",
        "shot": "takos-spot-1063647-team.png",
        "note": "Lewis Robinson is already Co-Project Manager on 1063647. Keep him when filing the AI / Intake pack.",
        "rows": [
            ("Sponsor", "Vincent, Joel · Joel.Vincent@takeda.com"),
            ("Project Manager", "Santoro, Dean · dean.santoro@takeda.com · Lexington MA"),
            ("Co-Project Manager", "Robinson, Lewis · Lewis.Robinson@takeda.com · CATO45"),
            ("Also on the team", "Rarugal, Aimee (Analytical Development) · Krivda, Juraj (Data Scientist) · Karamchandani, Simran (DD&T) · Fonseca, Ivan (DD&T)"),
            ("AI checklist", "Requester + sponsor + PM are on this list. Lewis can be named as requester."),
            ("Do not add a second sponsor", "Joel stays the accountable sponsor."),
        ],
    },
    {
        "id": "04a7",
        "when": "now",
        "title": "Live SPOT — Documents",
        "guide": "SPOT · Project Documents. Empty — attach the design pack here after the funding request.",
        "shot": "takos-spot-1063647-documents.png",
        "note": "Use Open in New Tab if the embed is blank. Do not treat this empty pane as “no documents required.”",
        "rows": [
            ("On the tab today", "No files — Project Documents pane is empty"),
            ("Attach next", "Business case MVP v2 · Design Blueprint · Executive Design · Executive Summary · this walkthrough · Submission checklist"),
            ("After Jira exists", "Paste the AIDPG Initiative key in the document comment / board Next Priorities"),
            ("Do not", "Upload a screenshot of the takOS website as if it were FORM-316177"),
        ],
    },
    {
        "id": "04j1",
        "when": "now",
        "title": "Live Jira — open AIDPG",
        "guide": "onetakeda.atlassian.net · captured 8 Sep 2026 as lewis.robinson@takeda.com",
        "shot": "takos-jira-aidpg-board.png",
        "note": "This is the delivery space. DDTGMPORT stays the manufacturing data source — do not create the Initiative there.",
        "rows": [
            ("Host (must be this one)", "https://onetakeda.atlassian.net — not takeda.atlassian.net"),
            ("Space", "AI&Data PDT.GSQ"),
            ("Delivery board", "AIDPG : Kanban — https://onetakeda.atlassian.net/jira/software/c/projects/AIDPG/boards/28055"),
            ("Initiatives board", "AIDIN : Initiatives — https://onetakeda.atlassian.net/jira/software/c/projects/AIDPG/boards/28106"),
            ("Also in the sidebar (do not use for delivery)", "AIDRQ : Requests · DDT Thousand Oaks · DDT Global Manufacturing Portfolio"),
            ("AIDPG Kanban today", "Empty — Sync Errors / Initiate / Define / Plan / Execute / Close, Track all 0 issues"),
            ("Signed in as", "lewis.robinson@takeda.com (Co-PM on SPOT 1063647)"),
        ],
    },
    {
        "id": "04j2",
        "when": "now",
        "title": "Live Jira — search before you create",
        "guide": "Global search · JQL textfields ~ \"1063647*\" · captured 8 Sep 2026",
        "shot": "takos-jira-search-results.png",
        "note": "One unrelated hit. No AIDPG Initiative, no Executive Platform ticket. Safe to create when Dean asks — not a duplicate.",
        "rows": [
            ("Search string", "1063647"),
            ("JQL used", "textfields ~ \"1063647*\""),
            ("Hits", "1 of 1 — DINA-7089 Hybrid Network-to-Center distribution model (Done, DD&T Data Science). Not this work."),
            ("AIDPG / AIDIN hit?", "None"),
            ("Also search before create", "\"Executive Platform\" and the exact summary 1063647 — GSQ DD&T Roadmap Executive Platform MVP"),
            ("Do not reuse", "Guide teaching keys AIDPG-4897 (Initiative) and AIDPG-5211 (Epic)"),
        ],
    },
    {
        "id": "04j3",
        "when": "now",
        "title": "Live Jira — AIDIN Initiatives board",
        "guide": "AIDIN : Initiatives · Kanban · captured 8 Sep 2026",
        "shot": "takos-jira-aidin-board.png",
        "note": "Initiatives live on this board, not on the empty AIDPG Kanban. After create, the new card should appear in Initiate.",
        "rows": [
            ("Board", "AIDIN : Initiatives (space AI&Data PDT.GSQ; URL path is still /projects/AIDPG/)"),
            ("Columns", "Initiate · Design · Plan · Build, Validate, Release · Blocked · Done"),
            ("Counts today", "All 0. List tab: “There are no work items here yet.”"),
            ("Where the new Initiative should land", "Initiate — leave it there until the Intake Governance Gate"),
            ("Do not", "Create a second space or a DDTGMPORT Initiative to fill this board"),
        ],
    },
    {
        "id": "04j4",
        "when": "now",
        "title": "Live Jira — Create form (not saved)",
        "guide": "+ Create on AIDIN · opened 8 Sep 2026 · closed without creating",
        "shot": "takos-jira-create-form.png",
        "note": "Form was opened, summary typed, then closed. Nothing was created. Default work type is Task — change it to Initiative before Create.",
        "rows": [
            ("Click", "+ Create (top bar). Space must stay AI&Data PDT.GSQ (AIDPG)."),
            ("Work type (critical)", "Dropdown defaults to Task. Change to Initiative. Do not create a Task."),
            ("Summary (paste)", f"1063647 — {INITIATIVE_NAME}"),
            ("Parent", "None — this is the top record"),
            ("Then paste from §04c", "Outcome · Open in SPOT · SPOT ID 1063647 · owners · in/out scope"),
            ("Create this record?", "Not yet — wait for Dean to say create. This page is the click path only."),
            ("If you created a Task by mistake", "Do not convert in place if fields are wrong. Close it and create an Initiative."),
        ],
    },
    {
        "id": "04b",
        "when": "later",
        "title": "JIRA — agent token (optional)",
        "guide": "Guide §04 · JIRA — Drive JIRA from Claude Code and Codex",
        "shot": "takos-04b-jira.png",
        "note": "Not required to submit Intake. Only if Dean or the POD will let an agent write Jira. Never paste a token into this pack.",
        "rows": [
            ("Jira host (must be this one)", "onetakeda.atlassian.net — not takeda.atlassian.net"),
            ("Create token", "Avatar → Manage account → Security → API tokens → Create API token"),
            ("Token name", "dean-santoro-jira (or claude-jira) · set an expiry"),
            ("Store", "Local file only, e.g. ~/secrets/jira-token.txt — never repo, chat, screenshot, or this Word file"),
            ("Delivery project", "AIDPG for Initiative + Epics. DDTGMPORT is the plant data source only."),
            ("When to do this", "After Intake, if an agent will create/update issues under your name"),
        ],
    },
    {
        "id": "04c",
        "when": "now",
        "title": "Initiative",
        "guide": "Guide §04 · Initiative — one coherent business or product outcome",
        "shot": "takos-jira-guide-initiative.png",
        "note": "Left image is the takOS teaching Initiative (AIDPG-4897) — do not reuse that key. Live search on 8 Sep 2026 found no 1063647 Initiative. Create in AIDPG when Dean asks; change Work type from Task to Initiative.",
        "rows": [
            ("Jira project", "AIDPG"),
            ("Issue type", "Initiative"),
            ("Summary", f"1063647 — {INITIATIVE_NAME}"),
            ("Open in SPOT", "https://tospot.azurewebsites.net/project-hub/78dd4329-ece5-4796-8cab-776d8ce7af17/project-board"),
            ("SPOT ID (visible field)", "1063647"),
            ("Outcome", OUTCOME),
            ("Owning team / domain", "GSQ GML DD&T"),
            ("Business Owner / Sponsor", "Joel Vincent"),
            ("Accountable delivery lead", "Dean Santoro (PM) · Lewis Robinson (Co-PM on SPOT 1063647)"),
            ("Included scope", IN_SCOPE),
            ("Excluded scope", OUT_SCOPE),
            ("Dependencies", "Power Platform env · Entra · Jira read · SPOT API · PBI embed · EDB steward · Marketplace POD"),
            ("Initiative-level acceptance", "TO↔LEX site switch; SPOT 1063647 reconciles; Site Head write + audit; freeze pack; no Jira/SPOT writes from the portal"),
            ("Workflow now", "Leave in Draft / Intake until the gate. Do not mark Design."),
        ],
    },
    {
        "id": "04d",
        "when": "now",
        "title": "Epic",
        "guide": "Guide §04 · Epic — one independently understandable delivery capability",
        "shot": "takos-jira-guide-epic.png",
        "note": "Left image is the takOS teaching Epic (AIDPG-5211) — do not reuse that key. Create the eight seed Epics under the new Initiative after it exists. PRs belong on stories, not Epics.",
        "rows": [
            ("Jira project", "AIDPG · parent = the new Initiative"),
            ("Epic 1", SEED_EPICS[0]),
            ("Epic 2", SEED_EPICS[1]),
            ("Epic 3", SEED_EPICS[2]),
            ("Epic 4", SEED_EPICS[3]),
            ("Epic 5", SEED_EPICS[4]),
            ("Epic 6", SEED_EPICS[5]),
            ("Epic 7", SEED_EPICS[6]),
            ("Epic 8", SEED_EPICS[7]),
            ("Each Epic must carry", "Capability · in/out scope · owner · dependencies/risks · acceptance for the whole capability"),
            ("Classifications (on governing Epic)", "GxP No · Criticality Medium · SOX Review/No (display-only budget) · PII Low"),
            ("Points rule", "Epic points = sum of child stories — leave blank until Plan"),
            ("Move to Implementing", "Only after required fields and dependencies are ready — after Intake + Design"),
        ],
    },
    {
        "id": "04e",
        "when": "later",
        "title": "User Story",
        "guide": "Guide §04 · User Story — where code, PR and evidence live",
        "shot": "takos-04e-story.png",
        "note": "Do not write a Ready backlog before URS/FDS. Documents lead; stories follow. Guide example BICN-174659 is teaching only.",
        "rows": [
            ("When", "Plan phase — after Design Approval Gate"),
            ("Parent", "The matching seed Epic, not the Initiative"),
            ("Story Type", "User"),
            ("Team", "Assigned POD (not yet named)"),
            ("Refinement", "Ready only after URS/FDS section-level traceability"),
            ("Acceptance Criteria", "Given / When / Then — start from Blueprint §15 MVP tests"),
            ("Example seed (not Ready)", "As a Site Head I want to switch the Glass from TO to LEX so the review shows that site’s Jira, SPOT and commentary only."),
            ("Links later", "Parent Epic · PR · merge SHA · CI · SIT evidence"),
        ],
    },
    {
        "id": "05",
        "when": "later",
        "title": "Request Access to GIT",
        "guide": "Guide §05 — Request access before you build",
        "shot": "takos-05-git.png",
        "note": "After a POD is assigned. Access must be attributable to the person, not a shared account.",
        "rows": [
            ("GitHub access guide", "myTakeda DevOps — GitHub User Access Guide · join the required myAccess group"),
            ("Repository to request", "oneTakeda/takOS (and the assigned delivery repo)"),
            ("Send exact username to", "Venkatagopichand Maddela · Venkatesh Ravi · Jan Felix Meyer"),
            ("Jira create rights", "Confirm AIDPG (Dean + DPM + future POD)"),
        ],
    },
    {
        "id": "06",
        "when": "later",
        "title": "Set up the local machine",
        "guide": "Guide §06 — Prepare a reliable local workspace",
        "shot": "takos-06-local-machine.png",
        "note": "POD machines only. Do not install Node from the Takeda marketplace. Never put the repo in OneDrive.",
        "rows": [
            ("Tools", "VS Code · latest Node.js (not marketplace) · GitHub Desktop"),
            ("Workspace folder", "macOS: /Users/<id>/GitHub  ·  Windows: C:\\Users\\<id>\\GitHub"),
            ("Clone", "Assigned takOS / delivery repo · branch main"),
            ("Extensions", "Claude Code (Anthropic) and/or Codex (OpenAI) — verified publishers only"),
        ],
    },
    {
        "id": "07",
        "when": "later",
        "title": "Design",
        "guide": "Guide §07 — Define what and how; approve the design documents",
        "shot": "takos-07-design.png",
        "note": "After Intake. Closing gate = Design Approval. Leading records are Veeva URS/FDS, not this Word pack.",
        "rows": [
            ("Track", "Product"),
            ("Inputs you will already have", "Approved Initiative · gate decision · FORM-316177 · this design package"),
            ("URS", "Veeva product URS form — content already drafted in Blueprint / Executive Design §§1, 12, 15"),
            ("FDS", "Veeva product FDS form — architecture + embeds + Dataverse write path from Blueprint §§5–9"),
            ("Prototype evidence already in hand", "Live TO One pager, MYC Budget, combined Gantt+Budget, Capability Tracker, target mockups"),
            ("Architecture approval", "GitHub PR vs VAL-624698 — after repo exists"),
            ("Do not tell Marketplace", "Design Approval is not done. This pack is business URS/FDS content only."),
        ],
    },
    {
        "id": "08",
        "when": "later",
        "title": "Discover UX",
        "guide": "Guide §08 — Turn a user need into a testable experience",
        "shot": "takos-08-discover-ux.png",
        "note": "Optional for Intake. Live Power Apps already count as prototype evidence. If a new Glass is designed, use takOS Design System.",
        "rows": [
            ("User / need / outcome", "Site Head · run the TO BR from one portal · freeze pack without PowerPoint stitch"),
            ("Mandatory baseline", "takOS Design System — if designing new screens"),
            ("Recommended path", "Claude Design, signed in with Takeda email, design-system pill = takOS Design System"),
            ("Support", "Animesh Pathak · Hari Krishnan N · Asmita Pawar"),
            ("Record in Jira", "Approved design link + decisions + AC — after Design, not now"),
        ],
    },
    {
        "id": "09",
        "when": "later",
        "title": "Plan",
        "guide": "Guide §09 — Derive traceable epics and stories; fund the delivery",
        "shot": "takos-09-plan.png",
        "note": "No build before the Delivery Readiness Gate. Fund Band B on 1063647 now; POD assignment is this phase.",
        "rows": [
            ("Recommended fund", "Band B ~1,100 hours / 10–12 weeks / ~$155–168k"),
            ("Do not fund", "$40k Band A — thin shell; cannot prove Jira + SPOT + EDB"),
            ("POD", "Marketplace / DD&T — assign after Intake + funding"),
            ("Stories", "Section-level traceability from approved URS/FDS — not before"),
            ("Infra questions", "Stéphane Dattenny — database, network, secrets, before Build depends on them"),
            ("Gate", "Delivery Readiness Gate on the Initiative Epic"),
        ],
    },
    {
        "id": "10",
        "when": "later",
        "title": "Build → Operate",
        "guide": "Guide §§10–21 — Implement with proof per story, then SIT, QA, operate",
        "shot": "takos-10-build.png",
        "note": "Nothing to file in Veeva during Build. Story DoD is the control. Do not start this path from the funding request.",
        "rows": [
            ("Branch", "Named with the authorizing Jira key"),
            ("Patterns", "Configure, do not fork. Glass is custom; embeds stay as-is"),
            ("Evidence", "CI + immutable repo — not chat attachments"),
            ("SIT / QA / Operate", "Promote to SIT · Test & close SIT · Validate & release · Operate — after Readiness Gate"),
            ("Jira updates", "Story links to PR, merge SHA, SIT evidence. Epic only aggregates."),
        ],
    },
    {
        "id": "22a",
        "when": "now",
        "title": "Intake aid — Identification & need (TOOL-235299)",
        "guide": "Guide §22 — Interactive completion aids · Initiative Epic Intake & Classification",
        "shot": "takos-22a-intake-aid-filled-id.png",
        "note": "Stateless aid. Copy into the AIDPG Initiative / Epic. This is not the Jira record. FORM/tool: TOOL-235299 v0.2.",
        "rows": [
            ("A1 Initiative name", INITIATIVE_NAME),
            ("A2 Business Owner", "Joel Vincent"),
            ("A2 Domain", "GSQ GML DD&T"),
            ("A2 Product / Delivery Lead", "Dean Santoro"),
            ("A3 Request type", "New solution"),
            ("B1 Problem", PROBLEM),
            ("B2 Intended use", INTENDED_USE),
            ("B3 Target users", "GSQ M&L Site Heads and DD&T leadership · 18 plants · first UAT: Thousand Oaks"),
            ("B4 Trigger", "2026 GSQ DD&T strategy. SPOT 1063647 is the live investment. Capture start 1 Dec 2026."),
            ("C1 In scope", IN_SCOPE + " Band B ~1,100 hours / 10–12 weeks / ~$155–168k."),
            ("C1 Output types", "application · dashboard"),
            ("C2 Out of scope", OUT_SCOPE),
        ],
    },
    {
        "id": "22b",
        "when": "now",
        "title": "Intake aid — Value & classification",
        "guide": "Guide §22 — sections D–E (TOOL-235299)",
        "shot": "takos-22b-intake-aid-filled-value.png",
        "note": "Classify upward when uncertain. Reducing a classification later needs documented QA concurrence.",
        "rows": [
            ("D1 Outcome", VALUE),
            ("D2 Magnitude", "L — 18 sites × 42 h/month is quantified multi-site productivity; not patient-supply critical"),
            ("D3 Candidate metrics", "Hours vs TO BR baseline · TO↔LEX switch · SPOT 1063647 reconciles · freeze pack · Site Head write + audit"),
            ("E-1 GxP Q1–Q5", "No · No · No · No · No → NOT GxP. Portal does not decide batch/clinical/PV; no Part 11; no submission package."),
            ("E-2 SOX Q1–Q3", "No · No · No → no SOX impact (display-only DD&T budget, no GL). Finance to confirm. Strawman was “SOX Review”."),
            ("E-3 Criticality", "Medium — process degraded; PowerPoint workaround exists; impact in one domain"),
            ("E-4 PII", "No — not a personal-data product. Incidental role names only. Strawman: PII Low."),
            ("E5 Data steward", "Not a dataset product. EDB/Capability steward stays with the existing EDB owner; portal is read-only embed."),
        ],
    },
    {
        "id": "22c",
        "when": "now",
        "title": "Intake aid — Urgency, risks, Pattern-Fit",
        "guide": "Guide §22 — sections F–H (TOOL-235299 + FORM-316177)",
        "shot": "takos-22c-intake-aid-filled-classif.png",
        "note": "H1 stays unchecked until the architect attaches FORM-316177 to the Epic.",
        "rows": [
            ("F1 Deadline", "None — no regulatory driver. Business target: value capture 1 Dec 2026 · Pilot 11 Dec 2026."),
            ("F2 Window", "Q4 2026 – Q1 2027"),
            ("G1 Risks (max 3)", "1) CAPEX $35k vs $168k — align and file funding. 2) AIDPG Initiative not created. 3) Jira/SPOT read access before Build."),
            ("G2 Dependencies + owner", "Power Platform — Dean · Entra — DD&T IT · Jira/SPOT read — Dean/DPM · PBI — Ivan · EDB — steward · POD — Marketplace · infra — Stéphane Dattenny"),
            ("G3 Assumptions / SMEs", "Reuse TO One pager, MYC Budget, combined Gantt+Budget — embed, do not rebuild. SMEs: Dean, Joel, Aimee, Juraj, Simran, Ivan."),
            ("H1 FORM-316177 attached", "OPEN — Architect completes and attaches to the Epic"),
            ("H2 Solution path", "Custom Build (Glass shell) + reuse of live Power Apps / PBI embeds. Product track."),
            ("H3 Pattern ID", "None — no validated “executive glass” Pattern. Embeds are not Pattern IDs."),
            ("H4 Justification", "No catalogue Pattern covers a site-aware review portal. Reuse qualified embeds. Custom Glass = shell + site master + Dataverse commentary. Platform Owner approval required for Custom Build."),
        ],
    },
    {
        "id": "22d",
        "when": "now",
        "title": "Intake aid — Evaluation & gate",
        "guide": "Guide §22 — section I + R1–R5. Copy Jira field text; then file the real gate on the Epic.",
        "shot": "takos-22d-intake-aid-filled-gate.png",
        "note": "Proposed only. The aid is not the R5 record. R4/R5 stay OPEN until FORM-316177 and the gate exist in Jira.",
        "rows": [
            ("I1 Value", "Strong — 9,000 h/yr evidenced on live SPOT 1063647"),
            ("I1 Regulatory", "Adequate — classifications complete; finance confirm SOX; QA not required (GxP No)"),
            ("I1 Technical", "Adequate — Custom Build justified; embeds reuse; dependencies named"),
            ("I1 Strategic", "Strong — 2026 GSQ DD&T single-pane-of-glass objective"),
            ("I1 Decision (proposed)", "Proceed"),
            ("I1 Rationale", "Quantified value on 1063647; Product track; GxP No / Medium / SOX No / PII Low; custom Glass + reuse embeds. Still need one CAPEX number, funding request, AIDPG Initiative, FORM-316177."),
            ("I2 Named approvers (proposed)", "Joel Vincent (Sponsor) · DD&T Leadership · AI&Data Portfolio Lead"),
            ("I2 Gate date", "Leave blank until the meeting is held"),
            ("I2 QA named?", "No — GxP is No"),
            ("I2 / I4 Record", "Jira R5 transition on the Epic. No Veeva / DMS copy."),
            ("R1–R3", "Can reach Submitted / Evaluation once A–G are copied into Jira"),
            ("R4 OPEN", "Attach FORM-316177 · Platform Owner approval for Custom Build"),
            ("R5 OPEN", "Hold the gate · write Approve/Reject/Hold with date and rationale"),
        ],
    },
    {
        "id": "23",
        "when": "now",
        "title": "Pattern-Fit decision tree",
        "guide": "Guide §23 — Reuse is the default. First applicable outcome wins.",
        "shot": "takos-23-pattern-fit.png",
        "note": "Work Q1→Q5 in order. Record the path on FORM-316177 and attach it to the Initiative.",
        "rows": [
            ("Q1 Qualified Platform component fully covers?", "No — no qualified “executive glass” component covers site-aware review + commentary."),
            ("Q2 Validated Pattern covers intended use?", "No — no Pattern ID for this product."),
            ("Q3 Small Pattern extension closes the gap?", "No — Glass + site master + Dataverse writes are not a Pattern tweak."),
            ("Q4 New Pattern justified by reuse across Initiatives?", "No — this is one GSQ DD&T product, not a platform Pattern."),
            ("Q5 Outcome", "Custom Build — exceptional. Written justification + Platform Owner approval + architecture review at Design."),
            ("What we still reuse", "Live TO One pager, MYC Budget, combined Gantt+Budget, Capability/PBI — embeds, not Patterns."),
            ("Track from Design on", "Product"),
        ],
    },
    {
        "id": "24",
        "when": "now",
        "title": "Records & controlled documents",
        "guide": "Guide §24 — One record. One home. Pull current copies from Veeva.",
        "shot": "takos-24-records.png",
        "note": "Do not attach a screenshot of this website as a form. Archived material is excluded.",
        "rows": [
            ("Investment home", "SPOT 1063647"),
            ("Demand / gate home", "AIDPG Initiative Epic (SOP-254573 — no DMS duplicate of intake)"),
            ("Pattern-Fit home", "FORM-316177 attached to that Epic"),
            ("Classification home", "TOOL-235299 fields on the Epic"),
            ("URS / FDS home (later)", "Veeva product URS/FDS forms after Intake — not this pack"),
            ("Code / CI home (later)", "GitHub"),
            ("This website", "Non-controlled. Veeva + Jira + SPOT prevail."),
        ],
    },
    {
        "id": "25",
        "when": "now",
        "title": "Escalation routes",
        "guide": "Guide §25 — Resolve uncertainty before the gate. Urgency never bypasses the route.",
        "shot": "takos-25-escalation.png",
        "note": "Conservative classification applies while a question is open.",
        "rows": [
            ("Patient safety / compliance", "QA · same business day — not expected (GxP No)"),
            ("GxP / SOX / PII unclear", "QA · before the gate — use if finance disputes SOX or commentary looks like PII"),
            ("Pattern constraints unclear", "Pattern Owner / Platform Owner · before the solution-path decision — Custom Build needs this"),
            ("Job Aid vs SOP conflict", "takOS Governance Owner · not urgent"),
            ("Unresolved dispute", "DD&T Leadership / Joel Vincent · per the governing SOP"),
            ("AI enablement", "Jan Felix Meyer · Martin Sturm — not Workforce AI Global"),
            ("GitHub / takOS access", "Maddela · Ravi · Meyer"),
            ("Infra dependencies", "Stéphane Dattenny"),
            ("Jira board / DoD", "Ian Leake"),
        ],
    },
]


def write_markdown() -> None:
    lines = [
        "# GSQ DD&T Executive Platform",
        "",
        "## TakOS walkthrough — screenshot beside pre-filled values",
        "",
        "| Field | Value |",
        "| --- | --- |",
        f"| Product | {INITIATIVE_NAME} |",
        "| SPOT | **1063647** — do not create a second project |",
        f"| Guide | [takOS Digital Delivery Onboarding]({GUIDE}) (TOOL-235311; Veeva prevails) |",
        "| How to use | Left = official TakOS step. Right = what to type or attach for this initiative. **Now** = file for Intake. **Later** = after the gate. |",
        "| As of | 8 September 2026 |",
        "| Sponsor / PM | Joel Vincent / Dean Santoro |",
        "",
        "Do not treat a screenshot of the onboarding site as a Veeva form. The §22 aid is stateless — copy it into Jira.",
        "",
        "### Contents",
        "",
    ]
    for step in STEPS:
        badge = "NOW" if step["when"] == "now" else "LATER"
        slug = step["id"].lower() + "-" + step["title"].lower()
        slug = "".join(ch if ch.isalnum() else "-" for ch in slug)
        slug = "-".join(part for part in slug.split("-") if part)
        lines.append(f"- [{step['id']} · {step['title']}](#{slug}) — {badge}")
    lines += [
        "",
        "### Constants (use these everywhere)",
        "",
        "| Field | Value |",
        "| --- | --- |",
        "| SPOT ID | 1063647 |",
        f"| Name | {INITIATIVE_NAME} |",
        "| Jira project for delivery | AIDPG (not DDTGMPORT) |",
        "| Band | B · ~1,100 hours · 10–12 weeks · ~$155–168k |",
        "| Classifications | GxP No · Criticality Medium · SOX No / Review · PII Low |",
        "| Pattern-Fit | Product track · Custom Build (Glass) + reuse embeds |",
        f"| Outcome | {OUTCOME} |",
        "",
    ]
    for step in STEPS:
        badge = "NOW — file for Intake" if step["when"] == "now" else "LATER — after Intake"
        lines += [
            "---",
            "",
            f"## {step['id']}  {step['title']}",
            "",
            f"*{step['guide']} · {badge}*",
            "",
            f"![{step['title']}](design-assets/takos-steps/{step['shot']})",
            "",
            "| Field | Enter / attach |",
            "| --- | --- |",
        ]
        for k, v in step["rows"]:
            lines.append(f"| {k} | {v} |")
        lines += ["", step["note"], ""]
    lines += [
        "---",
        "",
        "## Ordered close-out",
        "",
        "1. Reconcile business-case §1 vs §9 to Band B (~$168k).",
        "2. On 1063647: one CAPEX number, funding request, token line.",
        "3. Create AIDPG Initiative; link 1063647; paste the outcome.",
        "4. Create the eight seed Epics.",
        "5. Copy §22 classifications onto the Epic (TOOL-235299).",
        "6. Architect completes FORM-316177 and attaches it.",
        "7. Intake evaluation + Intake Governance Gate on the Epic.",
        "8. File the Marketplace order with the design pack + Initiative key.",
        "",
        "Earliest honest “Intake submitted” date: when steps 1–7 exist in Jira/SPOT.",
        "",
    ]
    MD.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {MD.name} ({MD.stat().st_size:,} bytes)")


def add_cover(doc: Document) -> None:
    p = doc.add_paragraph()
    r = p.add_run("TakOS walkthrough")
    set_run(r, size=12, color=RED, bold=True)
    p.paragraph_format.space_after = Pt(2)

    t = doc.add_paragraph()
    r = t.add_run("Official step screenshot  ·  pre-filled values for SPOT 1063647")
    set_run(r, size=22, color=NAVY, bold=True)
    t.paragraph_format.space_after = Pt(8)

    blurb = doc.add_paragraph()
    r = blurb.add_run(
        "Each following page is one takOS Digital Delivery Onboarding step. "
        "The left image is the live guide (8 Sep 2026). The right table is what Dean / Joel "
        "type or attach for GSQ DD&T Roadmap Executive Platform MVP. "
        "NOW = required to claim Intake. LATER = after the gate. "
        "Do not attach these screenshots as Veeva forms."
    )
    set_run(r, size=11, color=SLATE)

    constants = [
        ("SPOT", "1063647 — Active / Plan. Do not create a second project"),
        ("Name (use everywhere)", INITIATIVE_NAME),
        ("Jira delivery project", "AIDPG — not DDTGMPORT (that Jira is the plant data source)"),
        ("Sponsor / PM", "Joel Vincent / Dean Santoro"),
        ("Fund", "Band B · ~1,100 hours · 10–12 weeks · ~$155–168k (not the $40k shell)"),
        ("Classifications", "GxP No · Criticality Medium · SOX No (finance confirm) · PII Low"),
        ("Pattern-Fit", "Product track · Custom Build (Glass) + reuse live Power Apps / PBI"),
        ("Closing gate for this pack", "Intake Governance Gate on the AIDPG Initiative Epic"),
        ("Guide", GUIDE),
        ("Outcome (paste)", OUTCOME),
    ]
    add_kv_table(doc, constants, header=("Use this", "Value"))
    doc.add_paragraph()

    order = [
        ("1", "Align CAPEX on 1063647 to Band B and file the funding request + token line"),
        ("2", "Create the AIDPG Initiative; Open in SPOT → 1063647; paste outcome / boundary"),
        ("3", "Create the eight seed Epics; copy §22 classifications (TOOL-235299)"),
        ("4", "Architect attaches FORM-316177 (Custom Build + reuse embeds)"),
        ("5", "Hold Intake Governance Gate; record R5 on the Epic — then Marketplace"),
    ]
    add_kv_table(doc, order, header=("#", "Do this, then submit"))


def add_toc(doc: Document) -> None:
    doc.add_page_break()
    title = doc.add_paragraph()
    title.paragraph_format.space_after = Pt(4)
    r = title.add_run("Contents")
    set_run(r, size=22, color=NAVY, bold=True)
    add_bookmark(title, "toc")

    sub = doc.add_paragraph()
    sub.paragraph_format.space_after = Pt(8)
    sr = sub.add_run(
        "Official takOS Digital Delivery Onboarding steps, in guide order. "
        "Click a title to open that screenshot and the pre-filled table. "
        "NOW = file for Intake. LATER = after the gate. "
        "Word may ask to update fields so page numbers fill in."
    )
    set_run(sr, size=10, color=GREY)

    now_n = sum(1 for s in STEPS if s["when"] == "now")
    later_n = len(STEPS) - now_n
    tbl = doc.add_table(rows=len(STEPS) + 1, cols=4)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = True
    headers = ("Step", "TakOS guide page", "When", "Page")
    for i, label in enumerate(headers):
        cell = tbl.rows[0].cells[i]
        shade(cell, HEADER_BG)
        cell_text(cell, label, header=True)

    for i, step in enumerate(STEPS, start=1):
        when = "NOW — Intake" if step["when"] == "now" else "LATER"
        when_color = RED if step["when"] == "now" else RGBColor(0x8A, 0x6D, 0x1B)
        row = tbl.rows[i]
        if i % 2 == 0:
            for cell in row.cells:
                shade(cell, ROW_ALT)
        cell_text(row.cells[0], step["id"], bold=True, size=9)
        title_cell = row.cells[1]
        title_cell.text = ""
        p = title_cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(1)
        add_anchor_hyperlink(p, bookmark_name(step["id"]), step["title"], size=9, color=NAVY, bold=True)
        borders(title_cell)
        cell_text(row.cells[2], when, size=8, color=when_color, bold=True)
        page_cell = row.cells[3]
        page_cell.text = ""
        pp = page_cell.paragraphs[0]
        pp.paragraph_format.space_before = Pt(1)
        pp.paragraph_format.space_after = Pt(1)
        pp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        add_pageref(pp, bookmark_name(step["id"]))
        borders(page_cell)

    foot = doc.add_paragraph()
    foot.paragraph_format.space_before = Pt(8)
    fr = foot.add_run(f"{len(STEPS)} pages  ·  {now_n} NOW for Intake  ·  {later_n} LATER after the gate")
    set_run(fr, size=9, color=GREY, italic=True)


def add_step_page(doc: Document, step: dict) -> None:
    doc.add_page_break()

    head = doc.add_heading(f"{step['id']}  {step['title']}", level=1)
    head.paragraph_format.space_before = Pt(0)
    head.paragraph_format.space_after = Pt(2)
    add_bookmark(head, bookmark_name(step["id"]))
    when = "NOW — file for Intake" if step["when"] == "now" else "LATER — after Intake"
    tag = head.add_run(f"    {when}")
    set_run(tag, size=10, color=RED if step["when"] == "now" else RGBColor(0x8A, 0x6D, 0x1B), bold=True)

    g = doc.add_paragraph()
    g.paragraph_format.space_after = Pt(6)
    gr = g.add_run(step["guide"])
    set_run(gr, size=9, color=GREY, italic=True)

    layout = doc.add_table(rows=1, cols=2)
    layout.alignment = WD_TABLE_ALIGNMENT.CENTER
    left, right = layout.rows[0].cells
    left.width = Inches(6.2)
    right.width = Inches(4.3)

    left.text = ""
    lp = left.paragraphs[0]
    lp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    buf = jpeg_bytes(ASSETS / step["shot"])
    if buf:
        run = lp.add_run()
        # Landscape left pane — keep screenshot readable
        run.add_picture(buf, width=Inches(6.05))
    else:
        run = lp.add_run(f"[Missing {step['shot']}]")
        set_run(run, size=10, color=RED)
    borders(left, "E6E8EC")
    shade(left, "F7F8FA")

    right.text = ""
    rp = right.paragraphs[0]
    rp.paragraph_format.space_after = Pt(4)
    rr = rp.add_run("Pre-filled for this initiative")
    set_run(rr, size=9, color=RED, bold=True)
    add_kv_table(right, step["rows"])
    note_p = right.add_paragraph()
    note_p.paragraph_format.space_before = Pt(6)
    nr = note_p.add_run(step["note"])
    set_run(nr, size=8, color=GREY, italic=True)


def style_heading1(doc: Document) -> None:
    h1 = doc.styles["Heading 1"]
    h1.font.name = "Calibri"
    h1.font.size = Pt(16)
    h1.font.bold = True
    h1.font.color.rgb = NAVY
    h1.paragraph_format.space_before = Pt(0)
    h1.paragraph_format.space_after = Pt(2)


def build_docx() -> None:
    doc = Document()
    sec = doc.sections[0]
    sec.page_width = Inches(11)
    sec.page_height = Inches(8.5)
    sec.left_margin = Inches(0.45)
    sec.right_margin = Inches(0.45)
    sec.top_margin = Inches(0.7)
    sec.bottom_margin = Inches(0.55)
    style_heading1(doc)
    enable_update_fields(doc)
    add_page_chrome(doc, "TakOS walkthrough")
    add_cover(doc)
    add_toc(doc)
    for step in STEPS:
        add_step_page(doc, step)
    doc.save(DOCX)
    print(f"Wrote {DOCX.name} ({DOCX.stat().st_size:,} bytes)")


def main() -> None:
    write_markdown()
    build_docx()


if __name__ == "__main__":
    main()
