#!/usr/bin/env python3
"""Build a 2-slide VP briefing from the official Takeda EN template."""

from __future__ import annotations

from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.oxml.ns import qn
from pptx.util import Inches, Pt

ROOT = Path("/Users/chilr357/L-Bax_Archive/Thousand Oaks DDT/2026 Strategy/Dean Capability Tracker")
TEMPLATE = Path("/Users/chilr357/Downloads/Takeda Template_EN.potx")
OUT = ROOT / "GSQ-DDT-Executive-Platform-Executive-Summary.pptx"

# Official Takeda theme (theme1)
RED = RGBColor(0xE1, 0x24, 0x2A)
MAROON = RGBColor(0x89, 0x15, 0x15)
DARK = RGBColor(0x34, 0x37, 0x3F)
STEEL = RGBColor(0xA1, 0xB1, 0xC3)
GRAY = RGBColor(0xD1, 0xD8, 0xE0)
MIST = RGBColor(0xED, 0xF2, 0xF3)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
TITLE_FONT = "Aptos Display"
BODY_FONT = "Aptos"


def template_as_pptx(src: Path, dest: Path) -> Path:
    dest.parent.mkdir(parents=True, exist_ok=True)
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


def set_runs(shape, lines: list[tuple[str, dict]], *, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP):
    tf = shape.text_frame
    tf.clear()
    tf.word_wrap = True
    tf.auto_size = None
    try:
        tf._txBody.bodyPr.set("anchor", {MSO_ANCHOR.TOP: "t", MSO_ANCHOR.MIDDLE: "ctr", MSO_ANCHOR.BOTTOM: "b"}[anchor])
    except Exception:
        pass
    for i, (text, style) in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = style.get("align", align)
        p.space_before = Pt(style.get("space_before", 0))
        p.space_after = Pt(style.get("space_after", 0))
        p.line_spacing = style.get("line_spacing", 1.0)
        run = p.add_run()
        run.text = text
        run.font.name = style.get("font", BODY_FONT)
        run.font.size = Pt(style.get("size", 12))
        run.font.bold = style.get("bold", False)
        run.font.italic = style.get("italic", False)
        run.font.color.rgb = style.get("color", DARK)


def fill_placeholder(slide, idx: int, text: str, **style) -> None:
    for shp in slide.placeholders:
        if shp.placeholder_format.idx == idx:
            set_runs(shp, [(text, style)], align=style.get("align", PP_ALIGN.LEFT), anchor=style.get("anchor", MSO_ANCHOR.TOP))
            return


def rect(slide, l, t, w, h, fill, *, line=None, radius=0.08):
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(l), Inches(t), Inches(w), Inches(h))
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill
    if line is None:
        shape.line.fill.background()
    else:
        shape.line.color.rgb = line
        shape.line.width = Pt(0.75)
    try:
        shape.adjustments[0] = radius
    except Exception:
        pass
    shape.shadow.inherit = False
    return shape


def box(slide, l, t, w, h, lines, *, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP):
    tb = slide.shapes.add_textbox(Inches(l), Inches(t), Inches(w), Inches(h))
    set_runs(tb, lines, align=align, anchor=anchor)
    return tb


def add_notes(slide, text: str) -> None:
    notes = slide.notes_slide.notes_text_frame
    notes.text = text


def build_slide_1(prs: Presentation) -> None:
    layout = prs.slide_layouts[7]  # Standard 1-Column — logo, footer, Takeda master
    slide = prs.slides.add_slide(layout)
    for shp in list(slide.placeholders):
        if shp.placeholder_format.idx in (15,):  # body
            remove_shape(shp)

    fill_placeholder(slide, 0, "One portal for how GSQ plants run DD&T", font=TITLE_FONT, size=26, bold=True, color=DARK)
    fill_placeholder(slide, 3, "GSQ GML DD&T  |  Executive Platform  |  SPOT 1063647", font=BODY_FONT, size=9, color=DARK)
    fill_placeholder(slide, 16, "Private and confidential. For internal use only.", font=BODY_FONT, size=9, color=DARK)

    # Problem strip
    rect(slide, 0.40, 1.12, 12.52, 0.72, MIST, radius=0.06)
    rect(slide, 0.40, 1.12, 0.10, 0.72, RED, radius=0.0)
    box(
        slide,
        0.68,
        1.18,
        12.10,
        0.60,
        [
            (
                "Today the room stitches Jira, SPOT, site Power Apps, Power BI, and PowerPoint. Leaders get different answers in the same meeting.",
                {"size": 14, "color": DARK},
            )
        ],
        anchor=MSO_ANCHOR.MIDDLE,
    )

    cards = [
        (RED, WHITE, WHITE, "$168k", "Band B envelope", "10–12 weeks  ·  ~2.5 FTE\nThe $42k / 6-week figure is a thin shell only."),
        (DARK, WHITE, STEEL, "9,000", "hours / year", "Filed value case across 18 sites.\nProve it first at Thousand Oaks."),
        (MAROON, WHITE, WHITE, "18", "GSQ M&L sites", "Site becomes a drop-down.\nThousand Oaks is hard-coded today."),
        (GRAY, DARK, DARK, "1063647", "SPOT is already live", "Dean PM  ·  Joel Sponsor.\nDo not open a second project."),
    ]
    x0, gap, cw, ch = 0.40, 0.16, 3.01, 2.18
    for i, (bg, fg, sub, num, label, detail) in enumerate(cards):
        x = x0 + i * (cw + gap)
        rect(slide, x, 2.00, cw, ch, bg, radius=0.07)
        box(slide, x + 0.16, 2.10, cw - 0.32, 0.86, [(num, {"font": TITLE_FONT, "size": 32, "bold": True, "color": fg})])
        box(slide, x + 0.16, 2.92, cw - 0.32, 0.32, [(label.upper(), {"size": 11, "bold": True, "color": fg})])
        box(slide, x + 0.16, 3.26, cw - 0.32, 0.80, [(detail, {"size": 11, "color": sub})])

    # Already built vs what we fund
    rect(slide, 0.40, 4.34, 6.14, 2.52, MIST, radius=0.07)
    box(slide, 0.58, 4.42, 5.80, 0.32, [("ALREADY BUILT — REUSE", {"size": 11, "bold": True, "color": RED})])
    box(
        slide,
        0.58,
        4.76,
        5.80,
        1.96,
        [
            ("TO One pager  ·  KPIs  ·  Gantt  ·  Risks  ·  Jira", {"size": 13, "bold": True, "color": DARK, "space_after": 4}),
            ("MYC Budget 2026 and combined Gantt + Budget already exist as the visual target.", {"size": 12, "color": DARK, "space_after": 4}),
            ("Capability Tracker already shows deploy, adopt, and integration pairs by plant.", {"size": 12, "color": DARK, "space_after": 4}),
            ("Global roadmap already rolls 34 programmes / 573 projects to 18 sites.", {"size": 12, "color": DARK}),
        ],
    )

    rect(slide, 6.70, 4.34, 6.22, 2.52, DARK, radius=0.07)
    box(slide, 6.88, 4.42, 5.86, 0.32, [("WHAT THE ORDER BUILDS", {"size": 11, "bold": True, "color": WHITE})])
    box(
        slide,
        6.88,
        4.76,
        5.86,
        1.96,
        [
            ("Site selector for the network — not a new strategy.", {"size": 13, "bold": True, "color": WHITE, "space_after": 6}),
            ("Live Jira + SPOT on one Gantt/Budget row.", {"size": 12, "color": WHITE, "space_after": 4}),
            ("Site Head write-path for commentary and asks.", {"size": 12, "color": WHITE, "space_after": 4}),
            ("Thousand Oaks business review run from the portal — not a slide factory.", {"size": 12, "color": WHITE}),
        ],
    )

    add_notes(
        slide,
        "Open with the cost of the current meeting, not the software. The 1,000-foot Power App, Budget app, "
        "combined Gantt, Capability Tracker, and SPOT 1063647 already exist. Band B funds integration, "
        "site context, persistence, and a business-review freeze. Section 9 of the business case ($40k / 6 weeks) "
        "is Band A only and cannot prove Jira + SPOT + EDB together.",
    )


def build_slide_2(prs: Presentation) -> None:
    layout = prs.slide_layouts[7]
    slide = prs.slides.add_slide(layout)
    for shp in list(slide.placeholders):
        if shp.placeholder_format.idx in (15,):
            remove_shape(shp)

    fill_placeholder(slide, 0, "Decision — approve Band B, pilot at Thousand Oaks", font=TITLE_FONT, size=24, bold=True, color=DARK)
    fill_placeholder(slide, 3, "GSQ GML DD&T  |  Executive Platform  |  SPOT 1063647", font=BODY_FONT, size=9, color=DARK)
    fill_placeholder(slide, 16, "Private and confidential. For internal use only.", font=BODY_FONT, size=9, color=DARK)

    # Recommendation banner
    rect(slide, 0.40, 1.12, 12.52, 0.78, RED, radius=0.06)
    box(
        slide,
        0.58,
        1.16,
        12.16,
        0.70,
        [
            (
                "Recommend Band B at the ~$168k envelope. Do not approve Band A ($42k) if the test is “executives stop building decks.”",
                {"size": 15, "bold": True, "color": WHITE},
            )
        ],
        anchor=MSO_ANCHOR.MIDDLE,
    )

    views = [
        ("One pager", "Big Rocks × FY"),
        ("KPIs", "Honest counts"),
        ("Gantt + $", "Dates vs spend"),
        ("Budget", "Approve / actual"),
        ("Risks", "Airtime only"),
        ("Capability", "Deploy + adopt"),
        ("Site input", "The write path"),
        ("Network", "34 / 573 picture"),
    ]
    vw, gap = 1.48, 0.10
    x0 = 0.40
    for i, (title, sub) in enumerate(views):
        x = x0 + i * (vw + gap)
        bg = DARK if i % 2 == 0 else RED
        rect(slide, x, 2.06, vw, 1.18, bg, radius=0.08)
        box(slide, x + 0.06, 2.14, vw - 0.12, 0.58, [(title, {"size": 12, "bold": True, "color": WHITE})], align=PP_ALIGN.CENTER)
        box(slide, x + 0.06, 2.68, vw - 0.12, 0.44, [(sub, {"size": 10, "color": GRAY})], align=PP_ALIGN.CENTER)

    box(
        slide,
        0.40,
        3.32,
        12.52,
        0.28,
        [("One login. One site selector. Drill card → Jira / SPOT → Gantt + Budget → Capability. Jira and SPOT stay the systems of record.", {"size": 12, "color": DARK})],
    )

    decisions = [
        ("01", "Fund Band B", "$155–168k  ·  10–12 weeks\nto the attached design blueprint."),
        ("02", "Pilot Thousand Oaks", "First business-review system of record.\nSite Head UAT in weeks 9–10."),
        ("03", "Keep SPOT 1063647", "File the funding request here.\nAlign header CAPEX to one number."),
        ("04", "Authorize onboarding", "AIDPG Initiative → 1063647.\nPattern-Fit, token line, Intake gate."),
    ]
    dw, dgap = 3.01, 0.16
    for i, (num, title, body) in enumerate(decisions):
        x = 0.40 + i * (dw + dgap)
        rect(slide, x, 3.68, dw, 2.18, MIST, radius=0.07)
        rect(slide, x, 3.68, 0.10, 2.18, RED, radius=0.0)
        box(slide, x + 0.22, 3.76, dw - 0.36, 0.32, [(num, {"size": 11, "bold": True, "color": RED})])
        box(slide, x + 0.22, 4.08, dw - 0.36, 0.46, [(title, {"font": TITLE_FONT, "size": 16, "bold": True, "color": DARK})])
        box(slide, x + 0.22, 4.58, dw - 0.36, 1.10, [(body, {"size": 12, "color": DARK})])

    rect(slide, 0.40, 6.00, 12.52, 0.86, DARK, radius=0.06)
    box(
        slide,
        0.58,
        6.08,
        12.16,
        0.70,
        [
            (
                "Go / no-go for Release 2: one Thousand Oaks business review runs from the portal — commentary is attributable, numbers match Jira / SPOT / Capability, leadership agrees the pattern scales. Next artefact is the AIDPG Initiative, not a second SPOT.",
                {"size": 13, "color": WHITE},
            )
        ],
        anchor=MSO_ANCHOR.MIDDLE,
    )

    add_notes(
        slide,
        "Decision requested: (1) Approve Band B. (2) Name Thousand Oaks as the pilot. "
        "(3) Keep SPOT 1063647 and reconcile Expected CAPEX $35k vs preliminary $168k vs the Marketplace order. "
        "(4) Authorize remaining TakOS Initiate actions. Success is a meeting run from the system, not another dashboard.",
    )


def main() -> None:
    working = Path("/tmp/Takeda_EN_working.pptx")
    template_as_pptx(TEMPLATE, working)
    prs = Presentation(str(working))
    delete_all_slides(prs)
    build_slide_1(prs)
    build_slide_2(prs)
    prs.save(str(OUT))
    print(f"Wrote {OUT} ({OUT.stat().st_size:,} bytes), slides={len(prs.slides)}")


if __name__ == "__main__":
    main()
