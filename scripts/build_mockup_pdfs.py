#!/usr/bin/env python3
"""Print-ready mockup PDFs for the live GSQ DD&T Executive Platform.

Sourced facts only. Does not invent Jira keys, SPOT IDs, dates, or money.
Live tabs: Portfolio Health, Roadmap, Status KPIs, Gantt + Budget, Budget,
Risks, Capability, Ask Copilot, plus Site input.
"""
from __future__ import annotations

import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "design-assets" / "mockup-pdfs"
HTML_DIR = OUT / "html"
CSS_HREF = "../print.css"
CHROME = "/opt/google/chrome/chrome"
PROFILE = Path("/tmp/gsq-mockup-pdf-chrome")

TABS = [
    "Portfolio Health",
    "Roadmap",
    "Status KPIs",
    "Gantt + Budget",
    "Budget",
    "Risks",
    "Capability",
    "Ask Copilot",
]

FOOT_COMMON = (
    "GSQ DD&amp;T Executive Platform · live workbench mockup · English only · "
    "Do not write Jira dates/status or SPOT money from this app"
)

# Harvested SPOT Budget tab as of 2026-09-13 (exclude SPOT 1063647 from site rollups).
ALL_CAPEX = "$15,069,520"
ALL_OPEX = "$3,540,483"
ALL_APPROVED = "$10,892,851"
ALL_SPOTS = "58"
ALL_GAPS = "75"
SITES_NO_SPOT = "10"
THO_CAPEX = "$1,881,671"
THO_OPEX = "$212,359"
THO_APPROVED = "$835,416"
THO_SPOTS = "12"
THO_GAPS = "5"


def html_doc(title: str, body: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>{title}</title>
<link rel="stylesheet" href="{CSS_HREF}" />
</head>
<body>
{body}
</body>
</html>
"""


def foot(left: str, page: str) -> str:
    return f'<div class="foot"><span>{left}</span><span>{page}</span></div>'


def chrome_bar(active: str, site: str = "ALL SITES") -> str:
    tabs = []
    for name in TABS:
        cls = "tab on" if name == active else "tab"
        tabs.append(f'<div class="{cls}">{name}</div>')
    tabs.append('<div class="tab sitein">Site input</div>')
    return f"""
<div class="app">
  <div class="hdr">
    <div class="mark">T</div>
    <div class="site-box"><div class="site-k">SITE</div><div class="site-v">{site}</div></div>
    <div class="slash"></div>
    <h1>GSQ DD&amp;T Executive Platform</h1>
  </div>
  <div class="tabs">{''.join(tabs)}</div>
"""


def close_app() -> str:
    return "</div>"


def callouts(items: list[tuple[str, str]]) -> str:
    bits = ['<div class="callouts">']
    for i, (title, text) in enumerate(items, 1):
        bits.append(
            f'<div class="callout"><div class="num">{i}</div>'
            f"<div><b>{title}</b><span>{text}</span></div></div>"
        )
    bits.append("</div>")
    return "".join(bits)


def workflow_steps(steps: list[tuple[str, str]]) -> str:
    parts = ['<div class="flow">']
    for i, (title, text) in enumerate(steps, 1):
        if i > 1:
            parts.append('<div class="arrow">→</div>')
        parts.append(
            f'<div class="step"><div class="n">Step {i}</div><b>{title}</b>'
            f'<p class="tiny">{text}</p></div>'
        )
    parts.append("</div>")
    return "".join(parts)


def cover(
    kicker: str,
    title: str,
    sub: str,
    pills: list[str],
    left: str,
    right: str,
    note: str,
    page_label: str,
) -> str:
    pill_html = "".join(
        f'<span class="pill{" hot" if i == 0 else ""}">{p}</span>' for i, p in enumerate(pills)
    )
    return f"""
<section class="page cover">
  <div class="kicker">{kicker}</div>
  <h1>{title}</h1>
  <p class="sub">{sub}</p>
  <div class="badge-row">{pill_html}</div>
  <div class="grid-2">
    {left}
    {right}
  </div>
  <div class="note">{note}</div>
  {foot(FOOT_COMMON, page_label)}
</section>
"""


def roadmap_screen(site: str = "THOUSAND OAKS · THO") -> str:
    """THO cards use harvested SPOT / gap rows only. Cell placement is mapping metadata."""
    def card(name: str, meta: str, color: str, sel: bool = False) -> str:
        cls = "pcard sel" if sel else "pcard"
        return (
            f'<div class="{cls}"><span class="dot" style="background:{color}"></span>'
            f'<div><div class="nm">{name}</div><div class="meta">{meta}</div></div></div>'
        )

    empty = '<div class="empty">No mapped card in this cell until SharePoint OnePager places it</div>'
    rocks = [
        "One Day Batch Release",
        "Lab of the Future",
        "Predictive Maintenance",
        "Rapid Digital Tech Transfer",
        "Inventory Optimization",
        "Power of Digital Twins",
    ]
    rock_html = "".join(f'<div class="rock">{r}</div>' for r in rocks)
    chips = [
        "MES",
        "LIMS",
        "SAP",
        "Takami",
        "SAIL",
        "LPMS",
        "APMS",
        "RTMS",
        "COMOS",
        "Smart QC",
        "LabX",
        "Veeva eQMS",
        "Discoverant",
        "OptTracker",
        "SIMCA Online",
    ]
    chip_html = "".join(
        f'<div class="chip{" on" if c == "MES" else ""}">{c}</div>' for c in chips
    )
    fy26 = "".join(
        [
            '<div class="cell">'
            + card("MES · Elaprase", "DDTTO-3 · SPOT 1024096 · $0", "var(--green)", True)
            + card("MES · Adynovate DS", "DDTTO-17 · SPOT 1043819 · $1,505,000", "var(--green)")
            + "</div>",
            f'<div class="cell">{empty}</div>',
            '<div class="cell">'
            + card("APMS · Thousand Oaks", "DDTTO-54 · SPOT 1051357 · $273,470", "var(--green)")
            + "</div>",
            '<div class="cell">'
            + card("TO SAIL · Elaprase", "DDTTO-53 · Integration needed", "var(--steel)")
            + card("TO SAIL · FDP", "DDTTO-57 · Integration needed", "var(--steel)")
            + "</div>",
            '<div class="cell">'
            + card("TO Takami", "DDTTO-58 · Integration needed", "var(--steel)")
            + "</div>",
            f'<div class="cell">{empty}</div>',
        ]
    )
    fy27 = "".join(
        [
            '<div class="cell">'
            + card("DP Forms Paperless", "DDTTO-22 · SPOT 1051022 · $103,200", "var(--green)")
            + "</div>",
            f'<div class="cell">{empty}</div>',
            f'<div class="cell">{empty}</div>',
            '<div class="cell">'
            + card("TO SAIL · Adynovate", "DDTTO-55 · Integration needed", "var(--steel)")
            + "</div>",
            f'<div class="cell">{empty}</div>',
            '<div class="cell">'
            + card("Project Phoenix THO", "DDTTO-25 · SPOT 1056412 · $1 CAPEX", "var(--green)")
            + "</div>",
        ]
    )
    fy28 = "".join(f'<div class="cell">{empty}</div>' for _ in range(6))
    return f"""
{chrome_bar("Roadmap", site)}
<div style="padding:8px 8px 6px;display:flex;flex-direction:column;gap:6px;flex:1;min-height:0">
  <div style="display:flex;gap:6px">
    <input style="height:22px;border:1px solid var(--steel);border-radius:4px;padding:0 8px;font-size:10px;width:160px" value="" placeholder="Search project" readonly />
    <span class="pill">All fiscal years</span><span class="pill">All platforms</span>
    <span class="pill">All status</span><span class="pill">All capabilities</span>
    <span class="tiny" style="margin-left:auto">Layout writes Big Rock × FY mapping only</span>
  </div>
  <div style="display:grid;grid-template-columns:1fr 118px;gap:6px;flex:1;min-height:0">
    <div>
      <div class="rocks">{rock_html}</div>
      <div class="year-lab y26">FY2026 BUILD FOUNDATION</div>
      <div class="cells">{fy26}</div>
      <div class="year-lab y27">FY2027 SCALE AND INTEGRATE</div>
      <div class="cells">{fy27}</div>
      <div class="year-lab y28">FY2028 AND BEYOND TRANSFORM AND OPTIMIZE</div>
      <div class="cells">{fy28}</div>
    </div>
    <aside class="rail"><h4>Global Solutions</h4>{chip_html}</aside>
  </div>
  <div class="tiny">Legend:
    <span class="dot" style="background:var(--green);display:inline-block"></span> On Track
    &nbsp; <span class="dot" style="background:var(--amber);display:inline-block"></span> At Risk
    &nbsp; <span class="dot" style="background:var(--red);display:inline-block"></span> Delayed
    &nbsp; Cards shown are harvested THO SPOT / gap rows. Live cells come from SharePoint OnePager.
    Golden thread display may still show DDTTO-12 for Elaprase; the SPOT Budget row is DDTTO-3 / 1024096.
  </div>
</div>
{close_app()}
"""


def status_screen(site: str = "THOUSAND OAKS · THO") -> str:
    kpis = [
        ("Projects", "Live count"),
        ("On Track", "Live count"),
        ("Started", "Live count"),
        ("At Risk / Delayed", "Live count"),
        ("On-track %", "Live %"),
    ]
    kpi_html = "".join(
        f'<div class="kpi"><b>{v}</b><span>{k}</span></div>' for k, v in kpis
    )
    return f"""
{chrome_bar("Status KPIs", site)}
<div style="padding:8px;display:flex;flex-direction:column;gap:7px;flex:1;min-height:0">
  <div class="kpi-hero">
    <h2>Where the portfolio stands today</h2>
    <p class="tiny" style="color:#d1d8e0;margin-top:3px">
      {site.split("·")[0].strip()} counts come from the SharePoint One pager list. Click a tile to filter Roadmap.
    </p>
    <div class="kpi-row">{kpi_html}</div>
  </div>
  <div class="charts">
    <div class="chartbox">
      <h3>Portfolio health mix</h3>
      <div class="donut-wrap">
        <div class="donut"></div>
        <div class="tiny">Donut = On Track · Started · At Risk · Delayed.<br />
        Centre number = mapped initiatives for the selected site.<br />
        Totals must equal the filtered Roadmap card count.</div>
      </div>
    </div>
    <div class="chartbox">
      <h3>Execution by Big Rock</h3>
      <div class="bars">
        <div class="barline"><span style="width:140px">One Day Batch Release</span><div class="track"><div class="fill" style="width:70%"></div></div></div>
        <div class="barline"><span style="width:140px">Lab of the Future</span><div class="track"><div class="fill" style="width:45%"></div></div></div>
        <div class="barline"><span style="width:140px">Predictive Maintenance</span><div class="track"><div class="fill" style="width:35%"></div></div></div>
        <div class="barline"><span style="width:140px">Rapid Digital Tech Transfer</span><div class="track"><div class="fill" style="width:55%"></div></div></div>
        <div class="barline"><span style="width:140px">Inventory Optimization</span><div class="track"><div class="fill" style="width:25%"></div></div></div>
        <div class="barline"><span style="width:140px">Power of Digital Twins</span><div class="track"><div class="fill" style="width:20%"></div></div></div>
      </div>
      <p class="tiny">Bar length is a layout stand-in. Live values are OnePager counts per Big Rock.</p>
    </div>
    <div class="chartbox">
      <h3>Delivery health by fiscal year</h3>
      <div class="bars" style="margin-top:8px">
        <div class="barline"><span style="width:52px">FY2026</span><div class="track"><i style="display:block;height:100%;width:38%;background:#22a45a;float:left"></i><i style="display:block;height:100%;width:18%;background:#f5a623;float:left"></i><i style="display:block;height:100%;width:12%;background:#E1242A;float:left"></i></div></div>
        <div class="barline"><span style="width:52px">FY2027</span><div class="track"><i style="display:block;height:100%;width:28%;background:#22a45a;float:left"></i><i style="display:block;height:100%;width:16%;background:#A1B1C3;float:left"></i><i style="display:block;height:100%;width:10%;background:#f5a623;float:left"></i></div></div>
        <div class="barline"><span style="width:52px">FY2028</span><div class="track"><i style="display:block;height:100%;width:16%;background:#A1B1C3;float:left"></i></div></div>
      </div>
      <p class="tiny" style="margin-top:6px">Stack = On Track · Started · At Risk · Delayed. Lengths are chrome only. Live stacks come from OnePager.</p>
    </div>
    <div class="chartbox">
      <h3>One pager coverage</h3>
      <p style="margin-top:8px"><b>Jira linkage</b> — share of initiatives with a Jira key (opens onetakeda.atlassian.net).</p>
      <div class="meter" style="margin:6px 0 10px"><i style="width:62%;background:var(--red)"></i></div>
      <p><b>SPOT coverage</b> — share of initiatives with a SPOT ID. Gaps are Integration needed.</p>
      <div class="meter" style="margin-top:6px"><i style="width:48%;background:#2a4158"></i></div>
      <p class="tiny" style="margin-top:8px">Percent bars above are chrome only. Live % is calculated from the One pager list.</p>
    </div>
  </div>
</div>
{close_app()}
"""


def gantt_screen(site: str = "THOUSAND OAKS · THO") -> str:
    # Axis FY26–FY30 (Apr 2025–Apr 2030). Today ≈ 1 Oct 2026 ≈ 30%.
    rows = [
        ("grp", "MES", "", ""),
        ("bar", "MES · Elaprase · 1024096 · DDTTO-3", "left:0%;width:31%;background:#22a45a", "Execution end 19 Oct 2026"),
        ("bar", "MES · Adynovate DS · 1043819 · DDTTO-17", "left:35%;width:20%;background:#c5c9ce", "Start 4 Jan 2027"),
        ("grp", "APMS", "", ""),
        ("bar", "APMS · Thousand Oaks · 1051357 · DDTTO-54", "left:0%;width:43%;background:#c5c9ce", "Finish 28 May 2027"),
        ("grp", "CIM · Project Phoenix", "", ""),
        ("bar", "Project Phoenix Thousand Oaks · 1056412", "left:5%;width:35%;background:#c5c9ce", "30 Jun 2025 – 16 Apr 2027"),
        ("grp", "Paperless Operations", "", ""),
        ("bar", "DP Forms Paperless · 1051022 · DDTTO-22", "left:12%;width:28%;background:#c5c9ce", "SPOT dates"),
        ("grp", "No dates reported", "", ""),
        ("bar", "TO SAIL / Takami rows without a SPOT timeline", "left:2%;width:10%;background:#c5c9ce", "Integration needed"),
    ]
    body = []
    for kind, label, style, extra in rows:
        if kind == "grp":
            body.append(
                f'<div class="grow"><div class="glab grp">{label}</div>'
                f'<div class="gbars"><div class="today" style="left:30%"></div></div></div>'
            )
        else:
            body.append(
                f'<div class="grow"><div class="glab">{label}</div>'
                f'<div class="gbars"><div class="today" style="left:30%"></div>'
                f'<div class="bar" style="{style}">{extra}</div></div></div>'
            )
    return f"""
{chrome_bar("Gantt + Budget", site)}
<div style="padding:8px;display:grid;grid-template-columns:1fr 230px;gap:7px;flex:1;min-height:0">
  <div class="gantt">
    <div style="padding:8px 8px 4px;display:flex;justify-content:space-between;align-items:flex-start">
      <div>
        <h2 style="font-size:16px;color:var(--navy)">Roadmap</h2>
        <p class="tiny">FY bars from OnePager + SPOT timelines. Today line required. High-value at risk ≥ $100,000.</p>
      </div>
      <span class="pill">Download CSV</span>
    </div>
    <div style="padding:0 8px 6px;display:flex;flex-wrap:wrap;gap:4px">
      <span class="pill hot">All health</span>
      <span class="pill">Red</span><span class="pill">Amber</span>
      <span class="pill">Green</span><span class="pill">Unassigned</span>
      <span class="pill">At risk only</span>
      <span class="pill">Owned and associated</span>
    </div>
    <div class="ghead"><div>Initiative and project · April to March</div>
      <div>FY26 &nbsp;&nbsp; FY27 &nbsp;&nbsp; FY28 &nbsp;&nbsp; FY29 &nbsp;&nbsp; FY30</div></div>
    {''.join(body)}
    <div class="tiny" style="padding:5px 8px">Today = red line · Bar colour = delivery health · Grey = Unassigned / SPOT Active without OnePager status</div>
  </div>
  <aside style="background:#1b2430;color:#fff;border-radius:8px;padding:8px 9px">
    <p class="tiny" style="color:#A1B1C3;font-weight:800">SPOT BUDGET · THO · 2026-09-13</p>
    <h3 style="font-size:13px;margin:4px 0 8px">Thousand Oaks budget</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px">
      <div style="background:#1B3A55;padding:6px"><span class="tiny" style="color:#A1B1C3">TOTAL CAPEX</span><b style="display:block">{THO_CAPEX}</b></div>
      <div style="background:#1B3A55;padding:6px"><span class="tiny" style="color:#A1B1C3">TOTAL OPEX</span><b style="display:block">{THO_OPEX}</b></div>
      <div style="background:#1B3A55;padding:6px"><span class="tiny" style="color:#A1B1C3">APPROVED CAPEX</span><b style="display:block">{THO_APPROVED}</b></div>
      <div style="background:#1B3A55;padding:6px"><span class="tiny" style="color:#A1B1C3">SPOT PROJECTS</span><b style="display:block">{THO_SPOTS}</b></div>
      <div style="background:#1B3A55;padding:6px"><span class="tiny" style="color:#A1B1C3">INTEGRATION NEEDED</span><b style="display:block">{THO_GAPS}</b></div>
      <div style="background:#1B3A55;padding:6px"><span class="tiny" style="color:#A1B1C3">CURRENCY</span><b style="display:block">USD</b></div>
    </div>
    <p class="tiny" style="color:#A1B1C3;margin-top:8px">Top TOTAL CAPEX</p>
    <p style="font-size:10px;margin-top:4px">1043819 · MES Adynovate DS<br /><b>$1,505,000</b></p>
    <p style="font-size:10px;margin-top:4px">1051357 · APMS Thousand Oaks<br /><b>$273,470</b></p>
    <p style="font-size:10px;margin-top:4px">1051022 · DP Forms Paperless<br /><b>$103,200</b></p>
    <p class="tiny" style="color:#A1B1C3;margin-top:8px">Financials are read-only. Corrections happen in SPOT.</p>
  </aside>
</div>
{close_app()}
"""


def budget_screen(site: str = "ALL SITES") -> str:
    site_rows = [
        ("Osaka · OSA", "9", "$4,369,091", "$51,645", "$2,158,893", "4 Integration needed"),
        ("Neuchatel · NEU", "11", "$3,549,735", "N/A", "$328,700", "4 Integration needed"),
        ("Thousand Oaks · THO", "12", THO_CAPEX, THO_OPEX, THO_APPROVED, "5 Integration needed"),
        ("Tianjin · TJN", "2", "$1,873,275", "$3,128", "$1,855,634", "16 Integration needed"),
        ("Vashi · VAS", "7", "$1,460,680", "$66,229", "$1,434,835", "2 Integration needed"),
        ("Grange Castle · GRA", "7", "$1,303,186", "$29,691", "$3,449,040", "—"),
        ("Singen · SNG", "4", "$513,671", "$3,177,431", "$602,857", "2 Integration needed"),
        ("Bray · BRY", "6", "$118,211", "N/A", "$227,476", "3 Integration needed"),
        ("Lexington · LEX", "0", "—", "Integration needed", "—", "—"),
        ("Brooklyn Park · BRP", "0", "—", "Integration needed", "—", "16 Integration needed"),
    ]
    tr = "".join(
        f"<tr><td>{a}</td><td>{b}</td><td>{c}</td><td>{d}</td><td>{e}</td><td>{f}</td></tr>"
        for a, b, c, d, e, f in site_rows
    )
    return f"""
{chrome_bar("Budget", site)}
<div style="padding:8px;display:flex;flex-direction:column;gap:7px;flex:1;min-height:0">
  <div>
    <p class="tiny" style="font-weight:800;letter-spacing:.08em">SPOT PORTFOLIO CENTER</p>
    <h2 style="font-size:18px;color:var(--navy)">All Sites budget</h2>
    <p class="tiny">TOTAL CAPEX and TOTAL OPEX from the SPOT Budget tab, converted to USD, as of 2026-09-13.</p>
  </div>
  <div class="bkpis">
    <div class="bkpi"><span>TOTAL CAPEX</span><b>{ALL_CAPEX}</b></div>
    <div class="bkpi"><span>TOTAL OPEX</span><b>{ALL_OPEX}</b></div>
    <div class="bkpi"><span>APPROVED CAPEX</span><b>{ALL_APPROVED}</b></div>
    <div class="bkpi"><span>SPOT PROJECTS</span><b>{ALL_SPOTS}</b></div>
    <div class="bkpi"><span>INTEGRATION NEEDED</span><b>{ALL_GAPS}</b></div>
    <div class="bkpi"><span>SITES WITHOUT SPOT IDS</span><b>{SITES_NO_SPOT}</b></div>
  </div>
  <div style="background:#fff;border:1px solid var(--gray);border-radius:8px;padding:6px 8px;flex:1;min-height:0">
    <h3 style="font-size:12px;color:var(--navy);margin-bottom:4px">Site totals in USD</h3>
    <table class="plain">
      <thead><tr><th>Site</th><th>SPOT projects</th><th>TOTAL CAPEX</th><th>TOTAL OPEX</th><th>Approved CAPEX</th><th>Missing SPOT IDs</th></tr></thead>
      <tbody>{tr}</tbody>
    </table>
    <p class="tiny" style="margin-top:6px">
      Book rates EUR 1.0957, INR 0.01171, CNY 0.13895, USD 1.00.
      SPOT 1063647 (GSQ DD&amp;T Executive Platform MVP, TOTAL CAPEX $168,000) is excluded from site rollups.
      Sites with no harvested SPOT row: BEK, BRP, BUE, HIK, LEX, LIN, NAU, ORA, SGP, YAR.
    </p>
  </div>
</div>
{close_app()}
"""


def map_pins() -> str:
    # Percent positions from live site-network.tsx geoSites.
    pins = [
        ("GRA", 8.2, 24.4, "#891515"),
        ("BRY", 8.5, 25.2, "#891515"),
        ("NEU", 12.0, 29.6, "#891515"),
        ("SNG", 12.8, 27.6, "#891515"),
        ("ORA", 14.0, 24.8, "#891515"),
        ("LIN", 15.2, 27.8, "#891515"),
        ("YAR", 18.4, 25.0, "#c4332f"),
        ("VAS", 30.4, 45.8, "#c4332f"),
        ("SGP", 39.2, 53.4, "#c4332f"),
        ("BEK", 40.5, 57.5, "#c4332f"),
        ("TJN", 44.2, 29.2, "#c4332f"),
        ("HIK", 46.3, 33.4, "#c4332f"),
        ("OSA", 47.1, 32.2, "#c4332f"),
        ("THO", 72.4, 34.8, "#1b3a55"),
        ("NAU", 75.2, 45.2, "#a3251b"),
        ("BRP", 77.2, 28.5, "#1b3a55"),
        ("BUE", 82.4, 76.0, "#a3251b"),
        ("LEX", 83.6, 29.8, "#1b3a55"),
    ]
    html = []
    for code, x, y, color in pins:
        html.append(
            f'<div class="pin" style="left:{x}%;top:{y}%"><i style="background:{color}"></i>{code}</div>'
        )
    return "".join(html)


def portfolio_all_screen() -> str:
    chips = (
        ("North America", "LEX · Lexington, THO · Thousand Oaks, BRP · Brooklyn Park"),
        ("Latin America", "NAU · Naucalpan, BUE · Buenos Aires"),
        ("Europe", "GRA · Grange Castle, BRY · Bray, LIN · Linz, ORA · Oranienburg, SNG · Singen, NEU · Neuchatel, VAS · Vashi (reports to Europe)"),
        ("APAC", "TJN · Tianjin, OSA · Osaka, HIK · Hikari, SGP · Singapore, YAR · Yaroslavl, BEK · Bekasi"),
    )
    chip_html = "".join(
        f'<div><p class="tiny" style="font-weight:800">{h}</p>'
        f'<div class="chips">'
        + "".join(f'<span class="schip">{p.strip()}</span>' for p in body.split(","))
        + "</div></div>"
        for h, body in chips
    )
    return f"""
{chrome_bar("Portfolio Health", "ALL SITES")}
<div style="padding:8px;display:flex;flex-direction:column;gap:7px;flex:1;min-height:0">
  <div class="mapbox">
    <div style="display:flex;justify-content:space-between;align-items:flex-end">
      <div>
        <p class="tiny" style="font-weight:800;letter-spacing:.1em">GSQ MANUFACTURING NETWORK</p>
        <h2 style="font-size:16px;color:var(--navy)">All 18 sites</h2>
      </div>
      <div class="legend-row">
        <span><i style="background:#1b3a55"></i>North America</span>
        <span><i style="background:#a3251b"></i>Latin America</span>
        <span><i style="background:#891515"></i>Europe</span>
        <span><i style="background:#c4332f"></i>APAC</span>
      </div>
    </div>
    <div class="world">{map_pins()}</div>
    <p class="tiny" style="margin-top:4px">
      Vashi pin stays in India (APAC geography). Roster region is Europe — chip copy: India · reports to Europe.
      Yaroslavl reports to APAC. Click a pin to set SITE and open that plant’s geographic picture.
    </p>
  </div>
  <div class="grid-2" style="grid-template-columns:1fr 1fr;margin:0">{chip_html}</div>
</div>
{close_app()}
"""


def portfolio_tho_screen() -> str:
    beats = [
        ("1. Portfolio pulse", "a", f"{THO_SPOTS} SPOT rows + OnePager count", "On track vs at risk or delayed from OnePager"),
        ("2. Delivery health", "b", "Live on-track %", "Delayed count from OnePager"),
        ("3. Financial outlook", "a", THO_CAPEX, f"TOTAL OPEX {THO_OPEX} · {THO_SPOTS} SPOT projects · {THO_GAPS} rows need a SPOT ID"),
        ("4. Risk decisions", "b", "Live risk items", "SharePoint Risks list for the site"),
        ("5. Capability progress", "a", "Live % live", "IntegrationsTracker live / validated / adopted / deployed / active"),
        ("6. Leadership asks", "b", "Open asks", "SharePoint LeadershipAsks. Empty state: No current leadership asks."),
    ]
    beat_html = []
    for title, tone, label, detail in beats:
        beat_html.append(
            f'<article class="beat"><div class="bh {tone}">{title}</div>'
            f'<div class="bb" style="display:flex;gap:8px;align-items:center">'
            f'<div class="ring"><b>{label.split()[0]}</b><span>live</span></div>'
            f'<div><b style="color:var(--navy)">{label}</b><p class="tiny">{detail}</p>'
            f'<p class="tiny" style="margin-top:4px">Commentary: No current commentary.</p></div>'
            f"</div></article>"
        )
    return f"""
{chrome_bar("Portfolio Health", "THOUSAND OAKS · THO")}
<div style="padding:8px;display:flex;flex-direction:column;gap:6px;flex:1;min-height:0">
  <div style="background:#1b2430;color:#fff;border-radius:10px;padding:8px 10px;display:flex;justify-content:space-between;align-items:flex-end">
    <div>
      <p class="tiny" style="color:#A1B1C3;font-weight:800">UNITED STATES</p>
      <h2 style="font-size:18px">Thousand Oaks · THO</h2>
    </div>
    <span class="pill">All sites map</span>
  </div>
  <div class="lead">
    <div class="avatar">LG</div>
    <div style="flex:1"><p class="tiny" style="font-weight:800">SITE MANUFACTURING HEAD</p>
      <b>Lisa Gibson</b><p class="tiny">Site Head - Thousand Oaks</p></div>
    <div class="avatar">AB</div>
    <div style="flex:1"><p class="tiny" style="font-weight:800">SITE QUALITY HEAD</p>
      <b>Alex Bernacchi</b><p class="tiny">Site Quality Head - Thousand Oaks</p></div>
  </div>
  <div class="beats">{''.join(beat_html)}</div>
</div>
{close_app()}
"""


def capability_screen(site: str = "THOUSAND OAKS · THO") -> str:
    domains = [
        (
            "Engineering / Manufacturing",
            [
                ("MES ↔ shop-floor pair", "Product group bars = deploy % (Actuals) or adopt % (FY26 Forecast)"),
                ("Pending interface", "Linked CapabilityTracker title · platform · target quarter when mapped"),
            ],
        ),
        (
            "Engineering",
            [
                ("OT / engineering integration", "Status filter: NotStarted, InProgress, Live, Validated, Adopted, Deployed, Active"),
            ],
        ),
        (
            "Enterprise integrations",
            [
                ("Veeva / SAP / quality pair", "Empty filter state: No tracker records match the selected filters for THO."),
            ],
        ),
    ]
    blocks = []
    for name, cards in domains:
        cards_html = "".join(
            f'<article class="icard"><h4>{t}</h4><p class="tiny">{d}</p>'
            f'<div class="meter"><i style="width:0%"></i></div>'
            f'<p class="tiny" style="margin-top:4px">Live % from IntegrationsTracker</p></article>'
            for t, d in cards
        )
        blocks.append(f'<section class="domain"><h3>{name}</h3><div class="icards">{cards_html}</div></section>')
    return f"""
{chrome_bar("Capability", site)}
<div style="padding:8px;display:flex;flex-direction:column;gap:7px;flex:1;min-height:0">
  <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:8px">
    <div>
      <p class="tiny" style="font-weight:800">DIGITAL INTEGRATIONS KPI</p>
      <h2 style="font-size:18px;color:var(--navy)">Capability · Thousand Oaks</h2>
      <p class="tiny">IntegrationsTracker and CapabilityTracker · SiteCode THO</p>
    </div>
    <div style="display:flex;gap:6px">
      <span class="pill">All geographies</span>
      <span class="pill hot">THO · Thousand Oaks</span>
      <span class="pill">All statuses</span>
      <span class="pill hot">Actuals</span>
      <span class="pill">FY26 Forecast</span>
    </div>
  </div>
  <div class="cap-kpis">
    <div class="cap-kpi">Total<b>Live</b></div>
    <div class="cap-kpi">In Progress<b>Live</b></div>
    <div class="cap-kpi">Not Started<b>Live</b></div>
    <div class="cap-kpi">% Live<b>Live</b></div>
    <div class="cap-kpi">% Actuals<b>Live</b></div>
  </div>
  {''.join(blocks)}
  <p class="tiny">This tab answers deployed / adopted / integrated — the question the Gantt cannot answer.
  Do not invent deploy or adopt percentages in a briefing. Read them from SharePoint when the app is online.</p>
</div>
{close_app()}
"""


def risks_screen(site: str = "THOUSAND OAKS · THO") -> str:
    return f"""
{chrome_bar("Risks", site)}
<div style="padding:8px;display:flex;flex-direction:column;gap:7px;flex:1;min-height:0">
  <div style="background:var(--red);color:#fff;border-radius:8px;padding:8px 10px">
    <b>Review local risks this cycle.</b> Prioritize mitigation and ownership updates.
  </div>
  <div style="background:#fff;border:1px solid var(--gray);border-radius:8px;overflow:hidden;flex:1">
    <table class="plain">
      <thead><tr>
        <th>Title</th><th>Glyph</th><th>Owner</th><th>Due</th>
        <th>Reference</th><th>Big Rock</th><th>Source</th><th>Mitigation</th>
      </tr></thead>
      <tbody>
        <tr><td colspan="8" style="text-align:center;padding:22px;color:var(--muted)">
          Live rows come from the SharePoint Risks list for the selected site.
          All-sites empty copy: No risks found across the 18 sites.
          Site empty copy: No risks found.
          Do not invent risk titles, owners, or due dates for a briefing.
        </td></tr>
      </tbody>
    </table>
  </div>
  <p class="tiny">Jira keys in a title open onetakeda.atlassian.net. Local risks without a Jira key show as Local.
  Site Heads type new local risks on Site input — this tab does not write Jira.</p>
</div>
{close_app()}
"""


def screen_page(eyebrow: str, screen_html: str, notes: list[tuple[str, str]], page_label: str) -> str:
    return f"""
<section class="page cover" style="background:#fff">
  <p class="screen-title">{eyebrow}</p>
  <div class="split">
    <div class="screen-wrap">{screen_html}</div>
    {callouts(notes)}
  </div>
  {foot(FOOT_COMMON, page_label)}
</section>
"""


def purpose_card(title: str, body: str) -> str:
    return f'<div class="card"><h3>{title}</h3>{body}</div>'


# --- Documents ----------------------------------------------------------------

def doc_view_roadmap() -> str:
    left = purpose_card(
        "What this view is",
        """<p style="margin-top:6px">The Initiative Roadmap view is how a Site Head or GSQ executive sees
        work on the six Big Rocks across FY2026–FY2028+, then checks heat, dates, and money without leaving the Glass.</p>
        <p style="margin-top:6px">Live tabs in this view:</p>
        <ul>
          <li><b>Roadmap</b> — One pager grid (SharePoint OnePager)</li>
          <li><b>Status KPIs</b> — counts from the same list</li>
          <li><b>Gantt + Budget</b> — FY26–FY30 bars plus SPOT sidebar</li>
          <li><b>Budget</b> — finance-first SPOT roll-up</li>
        </ul>""",
    )
    right = purpose_card(
        "Sourced snapshot · 13 Sep 2026",
        f"""<ul>
          <li>All Sites TOTAL CAPEX <b>{ALL_CAPEX}</b></li>
          <li>All Sites TOTAL OPEX <b>{ALL_OPEX}</b></li>
          <li>Approved CAPEX <b>{ALL_APPROVED}</b></li>
          <li>{ALL_SPOTS} SPOT projects · {ALL_GAPS} roadmap rows Integration needed</li>
          <li>THO Elaprase money row: <b>DDTTO-3 / SPOT 1024096 / TOTAL CAPEX $0</b></li>
          <li>THO APMS: <b>DDTTO-54 / SPOT 1051357</b></li>
          <li>Product investment remains <b>SPOT 1063647</b> ($168,000, excluded from site rollups)</li>
        </ul>""",
    )
    pages = [
        cover(
            "View · Initiative Roadmap",
            "Initiative Roadmap View",
            "Screen mockups, explanations, and workflow for Roadmap, Status KPIs, Gantt + Budget, and Budget.",
            ["Roadmap", "Status KPIs", "Gantt + Budget", "Budget"],
            left,
            right,
            "Bar lengths on Status KPIs charts are chrome only. Live initiative counts come from SharePoint OnePager "
            "and are not invented here. Roadmap cards use harvested THO SPOT and gap rows.",
            "Initiative Roadmap · 1 / 6",
        ),
        cover(
            "Workflow",
            "How a Site Head reads the roadmap",
            "30–45 minutes before a Thursday business review, or a 5-minute executive scan.",
            ["This site", "Network / All Sites"],
            purpose_card(
                "Recommended path",
                workflow_steps(
                    [
                        ("Set SITE", "ALL SITES for network money, or THO · Thousand Oaks for the plant."),
                        ("Status KPIs", "Read Projects, On Track, At Risk / Delayed. Click a tile."),
                        ("Roadmap", "The filter lands on the One pager. Open the Elaprase card."),
                        ("Gantt + Budget", "Confirm SPOT 1024096 dates versus the $0 CAPEX row."),
                        ("Budget", "If the question is money-first, stay on the Budget tab."),
                    ]
                )
                + '<p class="tiny" style="margin-top:8px">Sidecar / card click does not write Jira or SPOT. '
                "Drag on Roadmap updates Big Rock × FY mapping only.</p>",
            ),
            purpose_card(
                "Do not confuse these keys",
                """<ul>
                  <li>Golden thread display may still show <b>TO MES Elaprase DS · DDTTO-12 · SPOT 1024096</b>.</li>
                  <li>SPOT Budget harvest is <b>DDTTO-3 / 1024096 / TOTAL CAPEX $0</b>.</li>
                  <li>Do not invent a second Elaprase SPOT.</li>
                  <li>APMS Thousand Oaks is <b>DDTTO-54 / 1051357</b>, not an older 1041357 mock ID.</li>
                </ul>""",
            ),
            "Jira host is onetakeda.atlassian.net. SPOT host is tospot.azurewebsites.net. Both stay read-only in the Glass.",
            "Initiative Roadmap · 2 / 6",
        ),
        screen_page(
            "Tab · Roadmap · Thousand Oaks",
            roadmap_screen(),
            [
                ("Site selector", "Header SITE filters every tab. THO shows Thousand Oaks · THO."),
                ("Six Big Rocks × FY", "FY2026 Build Foundation, FY2027 Scale and Integrate, FY2028+ Transform."),
                ("Selected card", "MES · Elaprase sidecar: DDTTO-3, SPOT 1024096, TOTAL CAPEX $0."),
                ("Global Solutions rail", "North Star chips filter the grid. MES is selected in this mockup."),
                ("Integration needed", "SAIL and Takami THO rows have Jira keys and no SPOT ID."),
            ],
            "Initiative Roadmap · 3 / 6",
        ),
        screen_page(
            "Tab · Status KPIs · Thousand Oaks",
            status_screen(),
            [
                ("Click a KPI", "Applies that status filter and jumps to Roadmap."),
                ("Health mix", "On Track, Started, At Risk, Delayed. Centre = mapped initiatives."),
                ("Big Rock bars", "Count of OnePager rows in each rock. Must match the grid."),
                ("Coverage", "Jira % and SPOT % from the same list. Gaps are Integration needed."),
            ],
            "Initiative Roadmap · 4 / 6",
        ),
        screen_page(
            "Tab · Gantt + Budget · Thousand Oaks",
            gantt_screen(),
            [
                ("Timeline", "FY26–FY30, April–March. Today line is required."),
                ("Elaprase bar", "SPOT 1024096 execution end 19 Oct 2026. Project end 29 Jan 2027."),
                ("APMS bar", "SPOT 1051357 · 27 Aug 2024 – 28 May 2027."),
                ("Sidebar", "Same site SPOT totals as of 13 Sep 2026. Read-only."),
                ("No dates", "Gap rows (SAIL / Takami) sit in No dates reported."),
            ],
            "Initiative Roadmap · 5 / 6",
        ),
    ]
    # Budget is included in the view as its own following page via tab PDF; add it here too.
    pages.append(
        screen_page(
            "Tab · Budget · All Sites",
            budget_screen(),
            [
                ("Network totals", f"{ALL_CAPEX} CAPEX · {ALL_OPEX} OPEX · {ALL_APPROVED} approved."),
                ("Exclude 1063647", "Product TOTAL CAPEX $168,000 stays out of site rollups."),
                ("Empty sites", "BEK, BRP, BUE, HIK, LEX, LIN, NAU, ORA, SGP, YAR show Integration needed."),
                ("Open SPOT", "Button opens tospot.azurewebsites.net/portfolio-center."),
            ],
            "Initiative Roadmap · 6 / 6",
        )
    )
    # Fix page numbers in last cover - actually I said 5/5 then added budget. Update labels...
    # The last screen_page says Budget. Good enough. First cover said 1/5. I'll leave as labeled.
    return html_doc("Initiative Roadmap View — GSQ DD&T Executive Platform", "".join(pages))


def doc_view_review() -> str:
    left = purpose_card(
        "What this view is",
        """<p style="margin-top:6px">The Business Review view is the live <b>Portfolio Health</b> tab.
        It replaces a slide factory. The meeting runs from six beats assembled from Roadmap, Budget,
        Risks, Capability, and Site input.</p>
        <ul>
          <li>All Sites opens the 18-site map and regional chips.</li>
          <li>A plant opens that site’s geographic picture and Org Explorer heads.</li>
          <li>Commentary and asks are SharePoint-only. Jira and SPOT stay read-only.</li>
        </ul>""",
    )
    right = purpose_card(
        "Six meeting beats",
        """<ol>
          <li>Portfolio pulse — OnePager mix</li>
          <li>Delivery health — on-track %</li>
          <li>Financial outlook — SPOT CAPEX / OPEX</li>
          <li>Risk decisions — SharePoint Risks</li>
          <li>Capability progress — IntegrationsTracker % live</li>
          <li>Leadership asks — SharePoint LeadershipAsks</li>
        </ol>
        <p class="tiny" style="margin-top:6px">Org Explorer is the source of record for site heads.
        BUE and YAR remain not listed.</p>""",
    )
    return html_doc(
        "Business Review View — GSQ DD&T Executive Platform",
        "".join(
            [
                cover(
                    "View · Business Review",
                    "Business Review View",
                    "Screen mockups, explanations, and workflow for Portfolio Health — the live Business Review tab.",
                    ["Portfolio Health", "Map", "Six beats", "Site input"],
                    left,
                    right,
                    "Do not invent commentary, asks, risk titles, or capability percentages. "
                    "Empty states in the live app are “No current commentary” and “No current leadership asks.”",
                    "Business Review · 1 / 4",
                ),
                cover(
                    "Workflow",
                    "How Thursday’s review runs from the portal",
                    "30–45 minutes. Freeze pack is a snapshot, not a new data store.",
                    ["Site Head", "Site DD&T", "Finance", "Digital lead"],
                    purpose_card(
                        "In-room path",
                        workflow_steps(
                            [
                                ("Map", "Confirm SITE. All Sites for network; click THO for the plant."),
                                ("Beats 1–2", "Portfolio pulse and delivery health from OnePager."),
                                ("Beat 3", "Money vs time — jump to Gantt + Budget if a bar needs airtime."),
                                ("Beats 4–5", "Risks tab, then Capability for North Star adoption."),
                                ("Beat 6", "Asks from Site input. Decisions are typed there after the meeting."),
                            ]
                        ),
                    ),
                    purpose_card(
                        "Write path",
                        """<ul>
                          <li>Site input URL: mytakeda.sharepoint.com/sites/GSQExecutivePlatform</li>
                          <li>Allowed writes: commentary, local risk, leadership ask, go-live confirm, mapping</li>
                          <li>Never written: Jira status, Jira dates, SPOT budget, EDB deploy/adopt</li>
                          <li>Vashi reports to Europe. Yaroslavl reports to APAC.</li>
                        </ul>""",
                    ),
                    "Acceptance: one Thousand Oaks review runs entirely from this tab. Slide-building hours drop for that review.",
                    "Business Review · 2 / 4",
                ),
                screen_page(
                    "Tab · Portfolio Health · All Sites map",
                    portfolio_all_screen(),
                    [
                        ("18 pins", "Every GSQ M&amp;L site. Colour = reporting region."),
                        ("Vashi", "Pin in India. Chip: India · reports to Europe."),
                        ("Yaroslavl", "APAC pin. Not listed on Org Explorer."),
                        ("Click a chip", "Sets SITE and opens that plant’s geographic picture."),
                    ],
                    "Business Review · 3 / 4",
                ),
                screen_page(
                    "Tab · Portfolio Health · Thousand Oaks beats",
                    portfolio_tho_screen(),
                    [
                        ("Plant hero", "Geographic picture + All sites map control."),
                        ("Org Explorer", "Lisa Gibson · Site Head. Alex Bernacchi · Site Quality Head."),
                        ("Money beat", f"THO TOTAL CAPEX {THO_CAPEX} · OPEX {THO_OPEX} as of 13 Sep 2026."),
                        ("Asks / commentary", "SharePoint lists. This mockup shows the empty-state copy."),
                    ],
                    "Business Review · 4 / 4",
                ),
            ]
        ),
    )


def doc_view_maturity() -> str:
    left = purpose_card(
        "What this view is",
        """<p style="margin-top:6px">The Digital Maturity view is the live <b>Capability</b> tab.
        It answers whether North Star systems are deployed, adopted, and integrated — the question
        the Initiative Roadmap Gantt cannot answer.</p>
        <ul>
          <li>Lists: IntegrationsTracker and CapabilityTracker</li>
          <li>Filters: geography, site (bound to header SITE), status</li>
          <li>Toggle: Actuals (deploy %) vs FY26 Forecast (adopt %)</li>
          <li>Cards group by domain pair, then integration ID</li>
        </ul>""",
    )
    right = purpose_card(
        "KPI strip",
        """<ul>
          <li><b>Total</b> — tracker rows for the site</li>
          <li><b>In Progress</b> — status InProgress</li>
          <li><b>Not Started</b> — NotStarted or NotPlanned</li>
          <li><b>% Live</b> — Live, Validated, Adopted, Deployed, or Active</li>
          <li><b>% Actuals</b> — average deployPct</li>
        </ul>
        <p class="tiny" style="margin-top:6px">Live numbers are SharePoint. This PDF does not invent deploy or adopt %.</p>""",
    )
    return html_doc(
        "Digital Maturity View — GSQ DD&T Executive Platform",
        "".join(
            [
                cover(
                    "View · Digital Maturity",
                    "Digital Maturity View",
                    "Screen mockups, explanations, and workflow for the Capability tab.",
                    ["Capability", "IntegrationsTracker", "CapabilityTracker"],
                    left,
                    right,
                    "Domain sort puts Engineering / Manufacturing first, then Engineering, then other pairs. "
                    "CapabilityTracker rows attach when reqIntIds contains the integration ID.",
                    "Digital Maturity · 1 / 3",
                ),
                cover(
                    "Workflow",
                    "How a digital lead reads maturity",
                    "Use after Roadmap and Gantt, when the question is “is it used?” not “when does it land?”",
                    ["Actuals", "FY26 Forecast"],
                    purpose_card(
                        "Path",
                        workflow_steps(
                            [
                                ("Set SITE", "THO, LEX, or BRP for plants that already have tracker history."),
                                ("KPI strip", "Read % Live and % Actuals before opening cards."),
                                ("Domain cards", "Open Engineering / Manufacturing first (MES pairs)."),
                                ("Toggle Forecast", "FY26 Forecast switches bars to adopt %."),
                                ("Jump back", "A pending pair can be discussed on Roadmap or Risks."),
                            ]
                        ),
                    ),
                    purpose_card(
                        "Rules",
                        """<ul>
                          <li>Deployed ≠ adopted. Adopted means the usage threshold is met.</li>
                          <li>Header SITE drives the list filter. The in-tab site control is display-only.</li>
                          <li>All Sites uses all 18 SiteCodes.</li>
                          <li>Empty copy: No tracker records match the selected filters.</li>
                        </ul>""",
                    ),
                    "Acceptance in the design blueprint: THO, LEX, and BRP match the published tracker after the same filters.",
                    "Digital Maturity · 2 / 3",
                ),
                screen_page(
                    "Tab · Capability · Thousand Oaks",
                    capability_screen(),
                    [
                        ("KPI pills", "Total, In Progress, Not Started, % Live, % Actuals."),
                        ("Actuals / Forecast", "Actuals = deployPct. FY26 Forecast = adoptPct."),
                        ("Domain groups", "Engineering / Manufacturing sorts first."),
                        ("Capability footer", "Title · platform · target quarter when a tracker row links."),
                    ],
                    "Digital Maturity · 3 / 3",
                ),
            ]
        ),
    )


def tab_doc(name: str, kicker: str, title: str, sub: str, explain_left: str, explain_right: str, note: str, screen: str, notes: list[tuple[str, str]]) -> str:
    return html_doc(
        f"{name} — GSQ DD&T Executive Platform",
        "".join(
            [
                cover(kicker, title, sub, [name, "Live workbench"], explain_left, explain_right, note, f"{name} · 1 / 2"),
                screen_page(f"Screen mockup · {name}", screen, notes, f"{name} · 2 / 2"),
            ]
        ),
    )


def doc_tab_roadmap() -> str:
    return tab_doc(
        "Roadmap",
        "Tab · Initiative Roadmap",
        "Roadmap tab",
        "One pager: six Big Rocks × FY2026–FY2028+ with a Global Solutions rail.",
        purpose_card(
            "Purpose",
            "<p style='margin-top:6px'>Show how the selected site’s work sits on the six Big Rocks. "
            "Cards are SharePoint OnePager rows. Drag updates mapping metadata only.</p>",
        ),
        purpose_card(
            "Workflow",
            "<ol><li>Set SITE.</li><li>Search or filter.</li><li>Click a card for the sidecar.</li>"
            "<li>Open Gantt + Budget for the same entity.</li><li>Do not expect Jira dates to change.</li></ol>",
        ),
        "Harvested THO examples: DDTTO-3 / 1024096 Elaprase; DDTTO-17 / 1043819 Adynovate DS; "
        "DDTTO-54 / 1051357 APMS; DDTTO-58 Takami Integration needed.",
        roadmap_screen(),
        [
            ("Grid", "Six rocks across three fiscal bands."),
            ("Sidecar", "Selected initiative: description, FY, North Star, Jira."),
            ("Rail", "Global Solutions platforms filter cards."),
            ("Write rule", "Drag = mapping. Jira and SPOT stay systems of record."),
        ],
    )


def doc_tab_status() -> str:
    return tab_doc(
        "Status KPIs",
        "Tab · Initiative Roadmap",
        "Status KPIs tab",
        "Heat before cards. Counts come from the One pager list for the selected site.",
        purpose_card("Purpose", "<p style='margin-top:6px'>Projects, On Track, Started, At Risk / Delayed, and on-track %. "
                     "Click a tile to filter Roadmap.</p>"),
        purpose_card("Workflow", "<ol><li>Read the hero sentence.</li><li>Click At Risk / Delayed if attention &gt; 0.</li>"
                     "<li>Confirm coverage % before trusting money on Budget.</li></ol>"),
        "This PDF does not invent initiative counts. Live totals must equal the filtered Roadmap card count.",
        status_screen(),
        [
            ("Hero tiles", "Five clickable KPIs."),
            ("Donut", "Portfolio health mix."),
            ("Big Rocks", "Horizontal counts."),
            ("Coverage", "Jira linkage and SPOT coverage."),
        ],
    )


def doc_tab_gantt() -> str:
    return tab_doc(
        "Gantt + Budget",
        "Tab · Initiative Roadmap",
        "Gantt + Budget tab",
        "When does it land, and is the money tracking the dates?",
        purpose_card("Purpose", "<p style='margin-top:6px'>OnePager + SPOT timelines on FY26–FY30. "
                     "Sidebar is the same SPOT Budget roll-up as the Budget tab, compact.</p>"),
        purpose_card("Workflow", "<ol><li>Filter health or At risk only.</li><li>Expand an initiative group.</li>"
                     "<li>Read the Today line against the bar.</li><li>Use the sidebar for CAPEX / OPEX.</li></ol>"),
        "Elaprase SPOT 1024096: start 31 Dec 2020, execution end 19 Oct 2026, project end 29 Jan 2027. TOTAL CAPEX $0.",
        gantt_screen(),
        [
            ("FY axis", "FY26–FY30, April to March."),
            ("Today", "Red vertical line."),
            ("Groups", "Initiative headers with G / A / R / U counts."),
            ("Sidebar", f"THO {THO_CAPEX} CAPEX as of 13 Sep 2026."),
        ],
    )


def doc_tab_budget() -> str:
    return tab_doc(
        "Budget",
        "Tab · Initiative Roadmap",
        "Budget tab",
        "Finance-first SPOT Portfolio Center view for All Sites or one plant.",
        purpose_card("Purpose", f"<p style='margin-top:6px'>TOTAL CAPEX {ALL_CAPEX}, TOTAL OPEX {ALL_OPEX}, "
                     f"Approved CAPEX {ALL_APPROVED} as of 13 Sep 2026.</p>"),
        purpose_card("Workflow", "<ol><li>Start on All Sites.</li><li>Scan site totals.</li>"
                     "<li>Set SITE = THO for the plant table.</li><li>Open SPOT for a correction — never edit here.</li></ol>"),
        "SPOT 1063647 ($168,000) is excluded from site rollups. Roadmap rows without a SPOT ID are Integration needed.",
        budget_screen(),
        [
            ("KPI strip", "Six harvested totals."),
            ("Site table", "18 plants. Ten have no harvested SPOT row."),
            ("Ranking", "Full tab also lists investment ranking by TOTAL CAPEX."),
            ("Rates", "EUR 1.0957 · INR 0.01171 · CNY 0.13895."),
        ],
    )


def doc_tab_portfolio() -> str:
    return html_doc(
        "Portfolio Health — GSQ DD&T Executive Platform",
        "".join(
            [
                cover(
                    "Tab · Business Review",
                    "Portfolio Health tab",
                    "Live Business Review: network map, plant picture, Org Explorer strip, six beats.",
                    ["Portfolio Health", "All 18 sites", "Six beats"],
                    purpose_card(
                        "Purpose",
                        "<p style='margin-top:6px'>Open the review. All Sites shows the map. A plant shows geography, "
                        "heads, and six beat cards bound to OnePager, SPOT, Risks, Capability, and Asks.</p>",
                    ),
                    purpose_card(
                        "Workflow",
                        "<ol><li>Start on All Sites.</li><li>Click THO.</li><li>Walk beats 1–6.</li>"
                        "<li>Jump to Roadmap / Gantt / Risks / Capability as needed.</li>"
                        "<li>Type decisions on Site input after the meeting.</li></ol>",
                    ),
                    "Vashi reports to Europe. Yaroslavl reports to APAC. BUE and YAR are not listed on Org Explorer.",
                    "Portfolio Health · 1 / 3",
                ),
                screen_page(
                    "All Sites map",
                    portfolio_all_screen(),
                    [
                        ("Pins", "18 SiteCodes on one map."),
                        ("VAS", "India · reports to Europe."),
                        ("YAR", "APAC. No Org Explorer heads."),
                        ("Chips", "Set SITE without hunting the header."),
                    ],
                    "Portfolio Health · 2 / 3",
                ),
                screen_page(
                    "Thousand Oaks beats",
                    portfolio_tho_screen(),
                    [
                        ("Heads", "Lisa Gibson · Alex Bernacchi."),
                        ("Money", f"{THO_CAPEX} / {THO_OPEX}."),
                        ("Empty copy", "No current commentary. No current leadership asks."),
                        ("Site input", "Only write path for asks and commentary."),
                    ],
                    "Portfolio Health · 3 / 3",
                ),
            ]
        ),
    )


def doc_tab_capability() -> str:
    return tab_doc(
        "Capability",
        "Tab · Digital Maturity",
        "Capability tab",
        "Digital Integrations KPI — deploy, adopt, and integration pairs.",
        purpose_card("Purpose", "<p style='margin-top:6px'>North Star maturity for the selected site. "
                     "IntegrationsTracker cards grouped by domain pair.</p>"),
        purpose_card("Workflow", "<ol><li>Confirm SITE.</li><li>Read % Live.</li><li>Open Engineering / Manufacturing.</li>"
                     "<li>Toggle FY26 Forecast for adopt %.</li></ol>"),
        "Do not invent deploy or adopt percentages. Empty filter copy is shown when no tracker rows match.",
        capability_screen(),
        [
            ("Filters", "Geo, site (display), status, Actuals / Forecast."),
            ("Pills", "Total · In Progress · Not Started · % Live · % Actuals."),
            ("Cards", "Integration title + product-group meters."),
            ("Link", "CapabilityTracker footer when reqIntIds match."),
        ],
    )


def doc_tab_risks() -> str:
    return tab_doc(
        "Risks",
        "Tab · Business Review support",
        "Risks tab",
        "Only what needs leadership airtime this cycle.",
        purpose_card("Purpose", "<p style='margin-top:6px'>SharePoint Risks for the selected site. "
                     "Used as beat 4 of the Business Review.</p>"),
        purpose_card("Workflow", "<ol><li>Read the red banner.</li><li>Scan owner and due.</li>"
                     "<li>Open a Jira key if present.</li><li>Add a local risk on Site input, not here.</li></ol>"),
        "This PDF does not invent risk titles. Live empty copy: No risks found.",
        risks_screen(),
        [
            ("Banner", "Network vs local copy depends on SITE."),
            ("Columns", "Title, owner, due, reference, source, mitigation."),
            ("Jira", "Keys open onetakeda.atlassian.net."),
            ("Write", "Local risks are typed on Site input."),
        ],
    )


def doc_combined() -> str:
    toc = purpose_card(
        "Contents",
        """<ol>
          <li>Initiative Roadmap View — purpose, workflow, Roadmap, Status KPIs, Gantt + Budget, Budget</li>
          <li>Business Review View — purpose, workflow, All Sites map, Thousand Oaks beats</li>
          <li>Digital Maturity View — purpose, workflow, Capability</li>
          <li>Tab sheets — one PDF-equivalent section per live tab in those views</li>
        </ol>""",
    )
    rules = purpose_card(
        "Rules used in this kit",
        """<ul>
          <li>Title stays <b>GSQ DD&amp;T Executive Platform</b></li>
          <li>Live workbench only — not the Leadership Briefing copy</li>
          <li>No invented Jira keys, SPOT IDs, dates, or money</li>
          <li>Vashi reports to Europe; Yaroslavl reports to APAC</li>
          <li>English only</li>
        </ul>""",
    )
    parts = [
        cover(
            "Combined kit",
            "GSQ DD&amp;T Executive Platform — mockup views",
            "Initiative Roadmap, Business Review, and Digital Maturity — screens, explanations, and workflows.",
            ["Combined", "Three views", "Tab sheets"],
            toc,
            rules,
            "Separate PDFs for each view and tab live beside this file in design-assets/mockup-pdfs/.",
            "Combined · cover",
        )
    ]
    # Reuse the three view bodies without their html wrappers: generate inner pages only.
    # Easier: concatenate the three view documents' bodies by calling the same page functions.
    inner = (
        doc_view_roadmap().split("<body>", 1)[1].rsplit("</body>", 1)[0]
        + doc_view_review().split("<body>", 1)[1].rsplit("</body>", 1)[0]
        + doc_view_maturity().split("<body>", 1)[1].rsplit("</body>", 1)[0]
        + doc_tab_roadmap().split("<body>", 1)[1].rsplit("</body>", 1)[0]
        + doc_tab_status().split("<body>", 1)[1].rsplit("</body>", 1)[0]
        + doc_tab_gantt().split("<body>", 1)[1].rsplit("</body>", 1)[0]
        + doc_tab_budget().split("<body>", 1)[1].rsplit("</body>", 1)[0]
        + doc_tab_portfolio().split("<body>", 1)[1].rsplit("</body>", 1)[0]
        + doc_tab_capability().split("<body>", 1)[1].rsplit("</body>", 1)[0]
        + doc_tab_risks().split("<body>", 1)[1].rsplit("</body>", 1)[0]
    )
    return html_doc("Combined views — GSQ DD&T Executive Platform", "".join(parts) + inner)


DOCS = {
    "View-Initiative-Roadmap": doc_view_roadmap,
    "View-Business-Review": doc_view_review,
    "View-Digital-Maturity": doc_view_maturity,
    "Tab-Roadmap": doc_tab_roadmap,
    "Tab-Status-KPIs": doc_tab_status,
    "Tab-Gantt-Budget": doc_tab_gantt,
    "Tab-Budget": doc_tab_budget,
    "Tab-Portfolio-Health": doc_tab_portfolio,
    "Tab-Capability": doc_tab_capability,
    "Tab-Risks": doc_tab_risks,
    "Combined-GSQ-DDT-Executive-Platform-Views": doc_combined,
}


def print_pdf(html_path: Path, pdf_path: Path) -> None:
    PROFILE.mkdir(parents=True, exist_ok=True)
    cmd = [
        CHROME,
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-extensions",
        "--disable-background-networking",
        "--hide-scrollbars",
        "--no-pdf-header-footer",
        f"--user-data-dir={PROFILE}",
        "--virtual-time-budget=8000",
        f"--print-to-pdf={pdf_path}",
        html_path.resolve().as_uri(),
    ]
    subprocess.run(cmd, check=True, capture_output=True, text=True, timeout=60)


def main() -> None:
    HTML_DIR.mkdir(parents=True, exist_ok=True)
    for name, builder in DOCS.items():
        html_path = HTML_DIR / f"{name}.html"
        html_path.write_text(builder(), encoding="utf-8")
        print(f"wrote {html_path}")
    for name in DOCS:
        html_path = HTML_DIR / f"{name}.html"
        pdf_path = OUT / f"{name}.pdf"
        print(f"print {pdf_path.name}")
        print_pdf(html_path, pdf_path)
        print(f"  {pdf_path.stat().st_size} bytes")


if __name__ == "__main__":
    main()
