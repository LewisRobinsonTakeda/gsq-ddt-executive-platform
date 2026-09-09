#!/usr/bin/env python3
"""Five-page executive brief: purpose, business case, schematic, experience, decision."""

from __future__ import annotations

from io import BytesIO
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor
from PIL import Image
from pptx import Presentation
from pptx.dml.color import RGBColor as PptRGB
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.util import Inches as PInches
from pptx.util import Pt as PPt

ROOT = Path("/Users/chilr357/L-Bax_Archive/Thousand Oaks DDT/2026 Strategy/Dean Capability Tracker")
ASSETS = ROOT / "design-assets"
TEMPLATE = Path("/Users/chilr357/Downloads/Takeda Template_EN.potx")
DOCX = ROOT / "GSQ-DDT-Executive-Platform-5-Page-Brief.docx"
PPTX = ROOT / "GSQ-DDT-Executive-Platform-5-Page-Brief.pptx"

NAVY = RGBColor(0x10, 0x20, 0x33)
RED = RGBColor(0xE1, 0x24, 0x2A)
DARK = RGBColor(0x34, 0x37, 0x3F)
GREY = RGBColor(0x5B, 0x64, 0x70)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
PRED = PptRGB(0xE1, 0x24, 0x2A)
PDARK = PptRGB(0x34, 0x37, 0x3F)
PMAR = PptRGB(0x89, 0x15, 0x15)
PSTEEL = PptRGB(0xA1, 0xB1, 0xC3)
PGRAY = PptRGB(0xD1, 0xD8, 0xE0)
PMIST = PptRGB(0xED, 0xF2, 0xF3)
PWHITE = PptRGB(0xFF, 0xFF, 0xFF)
TITLE_F = "Aptos Display"
BODY_F = "Aptos"


def shade(cell, hex_color: str) -> None:
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:fill"), hex_color)
    shd.set(qn("w:val"), "clear")
    tcPr.append(shd)


def no_borders(table) -> None:
    tbl = table._tbl
    tblPr = tbl.tblPr if tbl.tblPr is not None else OxmlElement("w:tblPr")
    borders = OxmlElement("w:tblBorders")
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        el = OxmlElement(f"w:{edge}")
        el.set(qn("w:val"), "nil")
        borders.append(el)
    tblPr.append(borders)


def set_cell(cell, text, *, size=11, bold=False, color=DARK, align="left", font="Calibri"):
    cell.text = ""
    p = cell.paragraphs[0]
    p.alignment = {
        "left": WD_ALIGN_PARAGRAPH.LEFT,
        "center": WD_ALIGN_PARAGRAPH.CENTER,
        "right": WD_ALIGN_PARAGRAPH.RIGHT,
    }[align]
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    run = p.add_run(text)
    run.font.name = font
    run._element.rPr.rFonts.set(qn("w:eastAsia"), font)
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.color.rgb = color


def add_runs(p, parts, *, size=12, color=DARK):
    p.paragraph_format.space_after = Pt(6)
    for text, extra in parts:
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(extra.get("size", size))
        run.font.bold = extra.get("bold", False)
        run.font.color.rgb = extra.get("color", color)


def para(doc, text, *, size=12, bold=False, color=DARK, after=6, before=0):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(before)
    p.paragraph_format.space_after = Pt(after)
    run = p.add_run(text)
    run.font.name = "Calibri"
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.color.rgb = color
    return p


def page_break(doc):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    run = p.add_run()
    br = OxmlElement("w:br")
    br.set(qn("w:type"), "page")
    run._element.append(br)


def header_bar(doc, kicker: str, title: str, page_no: str):
    table = doc.add_table(rows=1, cols=2)
    table.autofit = True
    no_borders(table)
    set_cell(table.cell(0, 0), kicker, size=10, bold=True, color=RED)
    set_cell(table.cell(0, 1), f"GSQ GML DD&T  ·  {page_no} / 5", size=10, color=GREY, align="right")
    para(doc, title, size=22, bold=True, color=NAVY, after=8, before=2)


def picture(doc, path: Path, width=10.0):
    img = Image.open(path)
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    max_w = 2000
    if img.width > max_w:
        r = max_w / img.width
        img = img.resize((max_w, int(img.height * r)), Image.Resampling.LANCZOS)
    buf = BytesIO()
    buf.name = "fig.jpg"
    img.save(buf, format="JPEG", quality=84, optimize=True)
    buf.seek(0)
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(4)
    p.add_run().add_picture(buf, width=Inches(width))


def cards(doc, items, fills):
    table = doc.add_table(rows=2, cols=len(items))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    no_borders(table)
    for i, (num, label, detail) in enumerate(items):
        shade(table.cell(0, i), fills[i])
        shade(table.cell(1, i), fills[i])
        fg = WHITE if fills[i] != "D1D8E0" else DARK
        set_cell(table.cell(0, i), num, size=22, bold=True, color=fg, align="center")
        set_cell(table.cell(1, i), f"{label}\n{detail}", size=10, color=fg, align="center")
        for row in table.rows:
            for cell in row.cells:
                cell.vertical_alignment = 1
    # pad cells
    for row in table.rows:
        for cell in row.cells:
            tc = cell._tc
            tcPr = tc.get_or_add_tcPr()
            mar = OxmlElement("w:tcMar")
            for edge, val in (("top", "80"), ("bottom", "80"), ("left", "80"), ("right", "80")):
                el = OxmlElement(f"w:{edge}")
                el.set(qn("w:w"), val)
                el.set(qn("w:type"), "dxa")
                mar.append(el)
            tcPr.append(mar)
    doc.add_paragraph()


def footer_line(doc, text):
    para(doc, text, size=9, color=GREY, after=0)


def build_docx() -> None:
    doc = Document()
    sec = doc.sections[0]
    sec.page_width = Inches(11)
    sec.page_height = Inches(8.5)
    sec.left_margin = Inches(0.55)
    sec.right_margin = Inches(0.55)
    sec.top_margin = Inches(0.4)
    sec.bottom_margin = Inches(0.35)

    # PAGE 1 — PURPOSE
    header_bar(doc, "PAGE 1  ·  PURPOSE", "One portal for how GSQ plants run DD&T", "1")
    para(
        doc,
        "Leadership still prepares business reviews by stitching Jira, SPOT, site Power Apps, Power BI, and PowerPoint. "
        "The cost is not software — it is leadership time and inconsistent answers in the same meeting.",
        size=13,
        after=10,
    )
    cards(
        doc,
        [
            ("Why", "Purpose", "Run the review from a maintained\nsystem of record, not a slide factory."),
            ("What", "The Glass", "One site-aware portal. Ten views.\nReuse what exists; add what is missing."),
            ("Who", "Sponsors", "Joel Vincent · Executive sponsor\nDean Santoro · Product lead"),
            ("Where", "SPOT 1063647", "Already live · Plan phase.\nDo not open a second project."),
        ],
        ["E1242A", "102033", "891515", "34373F"],
    )
    t = doc.add_table(rows=1, cols=2)
    no_borders(t)
    shade(t.cell(0, 0), "EDF2F3")
    shade(t.cell(0, 1), "102033")
    set_cell(
        t.cell(0, 0),
        "This is\n\nA single pane of glass for 18 GSQ Manufacturing & Labs sites.\n"
        "Site becomes a drop-down. Budget and Gantt sit on the same row.\n"
        "Site Heads type commentary and asks in the same portal.\n"
        "Thousand Oaks is the first business-review system of record.",
        size=12,
        color=DARK,
    )
    set_cell(
        t.cell(0, 1),
        "This is not\n\nA new strategy, a second Jira, or a second SPOT.\n"
        "The portal does not overwrite dates or money.\n"
        "The $42k / 6-week figure is a thin shell only —\n"
        "it cannot prove Jira + SPOT + EDB together.",
        size=12,
        color=WHITE,
    )
    for cell in t.rows[0].cells:
        tcPr = cell._tc.get_or_add_tcPr()
        mar = OxmlElement("w:tcMar")
        for edge, val in (("top", "140"), ("bottom", "140"), ("left", "140"), ("right", "140")):
            el = OxmlElement(f"w:{edge}")
            el.set(qn("w:w"), val)
            el.set(qn("w:type"), "dxa")
            mar.append(el)
        tcPr.append(mar)
    para(doc, "", after=4)
    footer_line(doc, "Companion: Design Blueprint v1.3  ·  Business case MVP v2 Sept 2026  ·  TakOS Onboarding Readiness  ·  Confidential")

    # PAGE 2 — BUSINESS CASE
    page_break(doc)
    header_bar(doc, "PAGE 2  ·  BUSINESS CASE", "The value is hours back — proven first at Thousand Oaks", "2")
    cards(
        doc,
        [
            ("9,000", "hours / year", "Filed value case · 18 sites\n~500 hours per site per year"),
            ("42", "hours / site / month", "Deck assembly and status chasing\nthe portal is meant to remove"),
            ("$168k", "Band B envelope", "10–12 weeks · ~2.5 FTE\nRecommended Marketplace order"),
            ("30,000", "hours total", "FY26 3,000 · FY27–29 9,000/yr\nOn the SPOT 1063647 record"),
        ],
        ["E1242A", "102033", "891515", "34373F"],
    )
    para(doc, "Investment options — fund the product that can stop the decks", size=13, bold=True, color=NAVY, after=6)
    opt = doc.add_table(rows=4, cols=4)
    opt.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers = ["Option", "What you get", "Time", "Indicative cost"]
    rows = [
        ["A. Thin shell", "Site drop-down + wrap today’s tabs. No SPOT, no EDB, no Site Head input.", "6 weeks · 1 FTE", "~$42k"],
        ["B. Recommended MVP", "Live Jira + SPOT, combined Gantt, Capability, Site input, TO review freeze.", "10–12 weeks · ~2.5 FTE", "~$155–168k"],
        ["C. Full case", "Band B + EDB data-product bind + production network roadmap.", "12 weeks · ~3 FTE", "~$196k"],
    ]
    for j, h in enumerate(headers):
        shade(opt.cell(0, j), "102033")
        set_cell(opt.cell(0, j), h, size=10, bold=True, color=WHITE)
    for i, row in enumerate(rows, 1):
        bg = "FFF4F4" if i == 2 else ("F4F6F8" if i % 2 == 0 else "FFFFFF")
        for j, val in enumerate(row):
            shade(opt.cell(i, j), bg)
            set_cell(opt.cell(i, j), val, size=10, bold=(j == 0), color=DARK)
    para(doc, "", after=4)
    para(
        doc,
        "Business case §1 already quotes ~$168k / 6–12 weeks. Section 9 quotes ~$40k / 6 weeks. Those are different products. "
        "Recommend Band B at the $168k envelope. Do not approve Band A if the test is “executives stop building decks.” "
        "EDB binds as a gated increment inside the same order; the Capability Tracker embed is the fallback so the meeting still has an adoption view.",
        size=12,
        after=6,
    )
    footer_line(doc, "Value hypothesis on SPOT 1063647  ·  COP = Productivity Improvements  ·  Capture start 1 Dec 2026")

    # PAGE 3 — SCHEMATIC
    page_break(doc)
    header_bar(doc, "PAGE 3  ·  DESIGN SCHEMATIC", "One Glass. Three systems of record. One write path.", "3")
    picture(doc, ASSETS / "fig-exec-schematic.png", width=9.9)
    footer_line(doc, "Read-only: Jira · SPOT · EDB/Capability    Write: Dataverse commentary, asks, mapping, freeze pack")

    # PAGE 4 — EXPERIENCE
    page_break(doc)
    header_bar(doc, "PAGE 4  ·  WHAT LEADERS SEE", "Same chrome on every tab. Site set once. The meeting runs here.", "4")
    picture(doc, ASSETS / "fig-mockup-one-pager.png", width=9.9)
    views = doc.add_table(rows=2, cols=5)
    no_borders(views)
    labels = [
        ("One pager", "Big Rocks × FY"),
        ("Gantt + Budget", "Dates vs spend"),
        ("Budget", "Approve / actual"),
        ("Capability", "Deploy + adopt"),
        ("Business Review", "The meeting — new"),
    ]
    extras = [
        ("KPIs", "Honest counts"),
        ("Risks", "Airtime only"),
        ("Jira", "Live backlog"),
        ("Site input", "Only write path — new"),
        ("Network", "34 programmes / 573 projects"),
    ]
    for i, (a, b) in enumerate(labels):
        shade(views.cell(0, i), "102033")
        set_cell(views.cell(0, i), f"{a}\n{b}", size=9, bold=True, color=WHITE, align="center")
    for i, (a, b) in enumerate(extras):
        shade(views.cell(1, i), "E1242A" if a in ("Site input",) else "34373F")
        set_cell(views.cell(1, i), f"{a}\n{b}", size=9, bold=True, color=WHITE, align="center")
    para(doc, "", after=2)
    footer_line(doc, "Target mockup — not a live app. Full view specs and live source screenshots are in the Design Blueprint.")

    # PAGE 5 — DECISION
    page_break(doc)
    header_bar(doc, "PAGE 5  ·  DECISION", "Approve Band B. Pilot at Thousand Oaks. Keep SPOT 1063647.", "5")
    dec = doc.add_table(rows=2, cols=4)
    no_borders(dec)
    decisions = [
        ("01", "Fund Band B", "$155–168k · 10–12 weeks\nto the design blueprint."),
        ("02", "Pilot Thousand Oaks", "First business-review\nsystem of record. UAT weeks 9–10."),
        ("03", "Keep 1063647", "File the funding request here.\nAlign CAPEX to one number."),
        ("04", "Authorize onboarding", "AIDPG Initiative → 1063647.\nPattern-Fit · Intake gate."),
    ]
    for i, (n, t, b) in enumerate(decisions):
        shade(dec.cell(0, i), "E1242A")
        shade(dec.cell(1, i), "EDF2F3")
        set_cell(dec.cell(0, i), f"{n}   {t}", size=12, bold=True, color=WHITE, align="center")
        set_cell(dec.cell(1, i), b, size=11, color=DARK, align="center")
    para(doc, "", after=8)
    para(doc, "Go / no-go for Release 2", size=13, bold=True, color=NAVY, after=4)
    go = doc.add_table(rows=1, cols=4)
    no_borders(go)
    gos = [
        "One TO business review runs from the portal.",
        "Site Head commentary is attributable.",
        "Jira, SPOT, and Capability match in the room.",
        "Leadership agrees the pattern scales.",
    ]
    for i, g in enumerate(gos):
        shade(go.cell(0, i), "102033")
        set_cell(go.cell(0, i), g, size=11, color=WHITE, align="center")
    para(doc, "", after=8)
    para(
        doc,
        "Next artefact is the AIDPG Initiative pointing at 1063647 — not a second SPOT. "
        "Week-1 work is a field workshop with PMO on Jira fields, SPOT access, and mapping quality. "
        "API access is the critical path; if it slips, the calendar slips.",
        size=12,
        after=8,
    )
    footer_line(doc, "Private and confidential. For internal use only.  ·  8 September 2026  ·  GSQ GML DD&T")

    doc.save(DOCX)
    print(f"Wrote {DOCX.name} ({DOCX.stat().st_size:,} bytes)")


def template_as_pptx(src: Path, dest: Path) -> Path:
    with ZipFile(src, "r") as zin, ZipFile(dest, "w", ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename == "[Content_Types].xml":
                data = data.replace(
                    b"application/vnd.openxmlformats-officedocument.presentationml.template.main+xml",
                    b"application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml",
                )
            zout.writestr(item, data)
    return dest


def delete_all_slides(prs: Presentation) -> None:
    sld_id_lst = prs.slides._sldIdLst
    while len(sld_id_lst):
        sld_id = sld_id_lst[0]
        r_id = sld_id.get(qn("r:id"))
        prs.part.drop_rel(r_id)
        sld_id_lst.remove(sld_id)


def remove_shape(shape) -> None:
    shape._element.getparent().remove(shape._element)


def set_runs(shape, lines, *, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP):
    tf = shape.text_frame
    tf.clear()
    tf.word_wrap = True
    try:
        tf._txBody.bodyPr.set("anchor", {MSO_ANCHOR.TOP: "t", MSO_ANCHOR.MIDDLE: "ctr", MSO_ANCHOR.BOTTOM: "b"}[anchor])
    except Exception:
        pass
    for i, (text, style) in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = style.get("align", align)
        p.space_after = PPt(style.get("space_after", 0))
        run = p.add_run()
        run.text = text
        run.font.name = style.get("font", BODY_F)
        run.font.size = PPt(style.get("size", 12))
        run.font.bold = style.get("bold", False)
        run.font.color.rgb = style.get("color", PDARK)


def fill_ph(slide, idx, text, **style):
    for shp in slide.placeholders:
        if shp.placeholder_format.idx == idx:
            set_runs(shp, [(text, style)])
            return


def rect(slide, l, t, w, h, fill, radius=0.07):
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, PInches(l), PInches(t), PInches(w), PInches(h))
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill
    shape.line.fill.background()
    try:
        shape.adjustments[0] = radius
    except Exception:
        pass
    return shape


def box(slide, l, t, w, h, lines, *, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP):
    tb = slide.shapes.add_textbox(PInches(l), PInches(t), PInches(w), PInches(h))
    set_runs(tb, lines, align=align, anchor=anchor)
    return tb


def add_picture(slide, path: Path, l, t, w):
    slide.shapes.add_picture(str(path), PInches(l), PInches(t), width=PInches(w))


def new_content_slide(prs, title: str):
    layout = prs.slide_layouts[7]
    slide = prs.slides.add_slide(layout)
    for shp in list(slide.placeholders):
        if shp.placeholder_format.idx == 15:
            remove_shape(shp)
    fill_ph(slide, 0, title, font=TITLE_F, size=24, bold=True, color=PDARK)
    fill_ph(slide, 3, "GSQ GML DD&T  |  Executive Platform  |  SPOT 1063647", font=BODY_F, size=9, color=PDARK)
    fill_ph(slide, 16, "Private and confidential. For internal use only.", font=BODY_F, size=9, color=PDARK)
    return slide


def build_pptx() -> None:
    working = Path("/tmp/Takeda_EN_5page.pptx")
    template_as_pptx(TEMPLATE, working)
    prs = Presentation(str(working))
    delete_all_slides(prs)

    # 1 Purpose
    s = new_content_slide(prs, "Purpose — one portal for how GSQ plants run DD&T")
    box(
        s,
        0.40,
        1.10,
        12.52,
        0.62,
        [(
            "The room still stitches Jira, SPOT, Power Apps, Power BI, and PowerPoint. The cost is leadership time and inconsistent answers.",
            {"size": 15, "color": PDARK},
        )],
        anchor=MSO_ANCHOR.MIDDLE,
    )
    tiles = [
        (PRED, "Why", "Run the review from a maintained system of record — not a slide factory."),
        (PDARK, "What", "One site-aware Glass. Ten views. Reuse what exists; add Budget, Review, and Site input."),
        (PMAR, "Who", "Joel Vincent, sponsor. Dean Santoro, product. Thousand Oaks first."),
        (PGRAY, "Record", "SPOT 1063647 is already live. Do not open a second project."),
    ]
    for i, (bg, h, b) in enumerate(tiles):
        x = 0.40 + i * 3.17
        fg = PDARK if bg == PGRAY else PWHITE
        rect(s, x, 1.86, 3.05, 2.20, bg)
        box(s, x + 0.16, 1.98, 2.74, 0.40, [(h.upper(), {"size": 12, "bold": True, "color": fg})])
        box(s, x + 0.16, 2.42, 2.74, 1.40, [(b, {"size": 14, "color": fg})])
    rect(s, 0.40, 4.22, 6.14, 2.58, PMIST)
    box(s, 0.58, 4.34, 5.80, 0.32, [("THIS IS", {"size": 11, "bold": True, "color": PRED})])
    box(
        s,
        0.58,
        4.70,
        5.80,
        1.90,
        [
            ("A single pane of glass for 18 GSQ M&L sites.", {"size": 14, "bold": True, "color": PDARK, "space_after": 6}),
            ("Site is a drop-down. Money and dates sit on one row. Site Heads type commentary in the same portal. The TO business review runs from here.", {"size": 13, "color": PDARK}),
        ],
    )
    rect(s, 6.70, 4.22, 6.22, 2.58, PDARK)
    box(s, 6.88, 4.34, 5.86, 0.32, [("THIS IS NOT", {"size": 11, "bold": True, "color": PWHITE})])
    box(
        s,
        6.88,
        4.70,
        5.86,
        1.90,
        [
            ("A new strategy, a second Jira, or a second SPOT.", {"size": 14, "bold": True, "color": PWHITE, "space_after": 6}),
            ("The portal does not overwrite dates or money. The $42k / 6-week figure is a thin shell and cannot prove Jira + SPOT + EDB.", {"size": 13, "color": PWHITE}),
        ],
    )

    # 2 Business case
    s = new_content_slide(prs, "Business case — hours back, proven first at Thousand Oaks")
    nums = [
        (PRED, PWHITE, "9,000", "HOURS / YEAR", "Filed value · 18 sites"),
        (PDARK, PWHITE, "42", "HRS / SITE / MONTH", "Deck + status chasing"),
        (PMAR, PWHITE, "$168k", "BAND B ENVELOPE", "10–12 weeks · ~2.5 FTE"),
        (PGRAY, PDARK, "30,000", "HOURS TOTAL", "On the SPOT record"),
    ]
    for i, (bg, fg, n, lab, d) in enumerate(nums):
        x = 0.40 + i * 3.17
        rect(s, x, 1.14, 3.05, 1.92, bg)
        box(s, x + 0.14, 1.22, 2.78, 0.70, [(n, {"font": TITLE_F, "size": 28, "bold": True, "color": fg})])
        box(s, x + 0.14, 1.92, 2.78, 0.28, [(lab, {"size": 11, "bold": True, "color": fg})])
        box(s, x + 0.14, 2.22, 2.78, 0.60, [(d, {"size": 12, "color": fg})])
    rect(s, 0.40, 3.24, 12.52, 0.44, PMIST, radius=0.04)
    box(
        s,
        0.55,
        3.28,
        12.22,
        0.36,
        [("Recommend Band B. Do not fund Band A ($42k) if the test is “executives stop building decks.” §9 of the business case is a thin shell only.", {"size": 13, "bold": True, "color": PDARK})],
        anchor=MSO_ANCHOR.MIDDLE,
    )
    opts = [
        ("A  Thin shell", "$42k · 6 weeks", "Wrap today’s tabs. No SPOT, no EDB, no Site Head input."),
        ("B  Recommended", "$155–168k · 10–12 weeks", "Live Jira + SPOT, Gantt+Budget, Capability, Site input, TO freeze."),
        ("C  Full case", "$196k · 12 weeks", "Band B + EDB data-product + production network roadmap."),
    ]
    for i, (h, c, b) in enumerate(opts):
        x = 0.40 + i * 4.22
        bg = PRED if i == 1 else PMIST
        fg = PWHITE if i == 1 else PDARK
        rect(s, x, 3.86, 4.06, 2.84, bg)
        box(s, x + 0.18, 4.00, 3.70, 0.40, [(h, {"size": 16, "bold": True, "color": fg})])
        box(s, x + 0.18, 4.44, 3.70, 0.36, [(c, {"size": 14, "bold": True, "color": fg})])
        box(s, x + 0.18, 4.90, 3.70, 1.50, [(b, {"size": 14, "color": fg})])

    # 3 Schematic
    s = new_content_slide(prs, "Design schematic — one Glass, three systems of record")
    add_picture(s, ASSETS / "fig-exec-schematic.png", 0.28, 1.08, 12.76)

    # 4 Experience
    s = new_content_slide(prs, "What leaders see — site set once, the meeting runs here")
    add_picture(s, ASSETS / "fig-mockup-one-pager.png", 1.26, 1.10, 10.80)

    # 5 Decision
    s = new_content_slide(prs, "Decision — Band B, Thousand Oaks, one SPOT")
    rect(s, 0.40, 1.12, 12.52, 0.70, PRED)
    box(
        s,
        0.58,
        1.18,
        12.16,
        0.58,
        [("Approve ~$168k / 10–12 weeks. Name Thousand Oaks as the first business-review system of record. Keep SPOT 1063647.", {"size": 16, "bold": True, "color": PWHITE})],
        anchor=MSO_ANCHOR.MIDDLE,
    )
    decs = [
        ("01", "Fund Band B", "$155–168k · 10–12 weeks\nto the design blueprint."),
        ("02", "Pilot Thousand Oaks", "First review system of record.\nSite Head UAT in weeks 9–10."),
        ("03", "Keep SPOT 1063647", "File the funding request here.\nAlign header CAPEX to one number."),
        ("04", "Authorize onboarding", "AIDPG Initiative → 1063647.\nPattern-Fit, token line, Intake."),
    ]
    for i, (n, t, b) in enumerate(decs):
        x = 0.40 + i * 3.17
        rect(s, x, 2.02, 3.05, 2.28, PMIST)
        rect(s, x, 2.02, 0.10, 2.28, PRED, radius=0.0)
        box(s, x + 0.22, 2.10, 2.70, 0.28, [(n, {"size": 11, "bold": True, "color": PRED})])
        box(s, x + 0.22, 2.40, 2.70, 0.50, [(t, {"font": TITLE_F, "size": 16, "bold": True, "color": PDARK})])
        box(s, x + 0.22, 2.94, 2.70, 1.10, [(b, {"size": 13, "color": PDARK})])
    rect(s, 0.40, 4.48, 12.52, 2.22, PDARK)
    box(s, 0.58, 4.58, 12.16, 0.32, [("GO / NO-GO FOR RELEASE 2", {"size": 12, "bold": True, "color": PRED})])
    gos = [
        "One TO business review runs from the portal.",
        "Site Head commentary is attributable.",
        "Jira, SPOT, and Capability match in the room.",
        "Leadership agrees the pattern scales.",
    ]
    for i, g in enumerate(gos):
        x = 0.58 + i * 3.10
        box(s, x, 5.00, 2.95, 1.40, [(g, {"size": 14, "color": PWHITE})])

    # Fix slide 4 image size - recreate by shrinking: delete last picture if too big
    # We'll check preview.

    prs.save(str(PPTX))
    print(f"Wrote {PPTX.name} ({PPTX.stat().st_size:,} bytes), slides={len(prs.slides)}")


def main() -> None:
    build_docx()
    build_pptx()


if __name__ == "__main__":
    main()
