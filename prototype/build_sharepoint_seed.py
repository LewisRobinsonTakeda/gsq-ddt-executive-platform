#!/usr/bin/env python3
"""Build Excel tables for SharePoint list import on /sites/GSQExecutivePlatform."""

from __future__ import annotations

from pathlib import Path

from openpyxl import Workbook
from openpyxl.worksheet.table import Table, TableStyleInfo
from openpyxl.utils import get_column_letter

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "GSQ-EP-SharePoint-Seed.xlsx"

SITES = [
    ("LEX", "Lexington", "Americas", "Lexington", "America/New_York", False),
    ("THO", "Thousand Oaks", "Americas", "Thousand Oaks", "America/Los_Angeles", True),
    ("BRP", "Brooklyn Park", "Americas", "Brooklyn Park", "America/Chicago", False),
    ("NAU", "Naucalpan", "Americas", "Naucalpan", "America/Mexico_City", False),
    ("BUE", "Buenos Aires", "Americas", "Buenos Aires", "America/Argentina/Buenos_Aires", False),
    ("TJN", "Tianjin", "Asia-Pacific", "Tianjin", "Asia/Shanghai", False),
    ("OSA", "Osaka", "Asia-Pacific", "Osaka", "Asia/Tokyo", False),
    ("HIK", "Hikari", "Asia-Pacific", "Hikari", "Asia/Tokyo", False),
    ("SGP", "Singapore", "Asia-Pacific", "Singapore", "Asia/Singapore", False),
    ("YAR", "Yaroslavl", "Asia-Pacific", "Yaroslavl", "Europe/Moscow", False),
    ("BEK", "Bekasi", "Asia-Pacific", "Bekasi", "Asia/Jakarta", False),
    ("GRA", "Grange Castle", "Europe", "Grange Castle", "Europe/Dublin", False),
    ("BRY", "Bray", "Europe", "Bray", "Europe/Dublin", False),
    ("LIN", "Linz", "Europe", "Linz", "Europe/Vienna", False),
    ("ORA", "Oranienburg", "Europe", "Oranienburg", "Europe/Berlin", False),
    ("SNG", "Singen", "Europe", "Singen", "Europe/Berlin", False),
    ("NEU", "Neuchatel", "Europe", "Neuchatel", "Europe/Zurich", False),
    ("VAS", "Vashi", "Europe", "Vashi", "Asia/Kolkata", False),
]

BIG_ROCKS = [
    ("one-day-batch-release", "One Day Batch Release", 1, "MES, NYMI, Smart QC"),
    ("lab-of-the-future", "Lab of the Future", 2, "Labware, LabX, Smart QC"),
    ("predictive-maintenance", "Predictive Maintenance", 3, "APMS, LPMS, RTMS"),
    ("rapid-digital-tech-transfer", "Rapid Digital Tech Transfer", 4, "SAIL, Phoenix"),
    ("inventory-optimization", "Inventory Optimization", 5, "SAP, Takami"),
    ("digital-twin", "Power of Digital Twins", 6, "Discoverant, SIMCA, EDB"),
]

STATUS = [
    ("on_track", "On track", 4, True, False),
    ("monitor", "Monitor closely", 3, True, True),
    ("leadership", "Leadership attention", 1, True, True),
    ("blocked", "Blocked", 2, True, True),
    ("planning", "Planning / no status", 5, True, False),
    ("complete", "Complete", 9, False, False),
    ("cancelled", "Cancelled", 9, False, False),
]

CAP_NAMES = [
    "MES", "SAIL", "Labware", "LabX", "NYMI", "APMS", "LPMS", "Takami",
    "Phoenix", "SAP WM", "Discoverant", "SIMCA", "Smart QC", "Veeva",
    "RTMS", "EDB", "OT Cyber", "Paperless Ops",
]


def add_table(ws, headers, rows, name):
    ws.append(headers)
    for row in rows:
        ws.append(list(row))
    last_col = get_column_letter(len(headers))
    last_row = max(1, len(rows) + 1)
    ref = f"A1:{last_col}{last_row}"
    table = Table(displayName=name, ref=ref)
    table.tableStyleInfo = TableStyleInfo(name="TableStyleMedium2", showRowStripes=True)
    ws.add_table(table)
    for i, h in enumerate(headers, 1):
        ws.column_dimensions[get_column_letter(i)].width = min(28, max(12, len(str(h)) + 4))


def jira_url(key: str) -> str:
    return f"https://onetakeda.atlassian.net/browse/{key}"


def spot_url(spot_id: str) -> str:
    if not spot_id:
        return ""
    return "https://tospot.azurewebsites.net/project-hub"


def main() -> None:
    wb = Workbook()

    ws = wb.active
    ws.title = "Sites"
    add_table(
        ws,
        ["Title", "SiteCode", "Region", "CapabilityPlantName", "Timezone", "IsPilot", "JiraBoardUrl", "SpotPortfolioUrl"],
        [
            (title, code, region, plant, tz, "Yes" if pilot else "No",
             "https://onetakeda.atlassian.net", "https://tospot.azurewebsites.net")
            for code, title, region, plant, tz, pilot in SITES
        ],
        "Sites",
    )

    ws = wb.create_sheet("BigRocks")
    add_table(ws, ["Title", "RockId", "SortOrder", "TypicalPlatforms"],
              [(t, i, s, p) for i, t, s, p in BIG_ROCKS], "BigRocks")

    ws = wb.create_sheet("StatusMap")
    add_table(ws, ["Title", "Canonical", "Label", "RankWorst", "InActive", "InAtRisk"],
              [(c, c, lab, r, "Yes" if a else "No", "Yes" if risk else "No") for c, lab, r, a, risk in STATUS],
              "StatusMap")

    projects = [
        ("MES Elaprase DS", "DDTTO-12", "THO", "MES", "MES", "1024096", "on_track", "MES", "Site MES lead", "Programme", "2025-10-01", "2026-06-30", 55, "Replace paper batch steps on Elaprase DS. Value sits in Jira; spend sits in SPOT."),
        ("NYMI Batch", "DDTTO-21", "THO", "NYMI", "NYMI", "1042101", "monitor", "NYMI", "QC lead", "Programme", "2025-11-01", "2026-08-15", 40, ""),
        ("Labware LIMS", "DDTTO-31", "THO", "LAB", "Labware", "", "on_track", "Labware", "Lab systems", "Programme", "2025-09-01", "2026-05-01", 70, ""),
        ("LabX scales", "DDTTO-32", "THO", "LAB", "LabX", "", "planning", "LabX", "Lab systems", "Site-led", "", "", 5, ""),
        ("TO APMS", "DDTTO-54", "THO", "APMS", "APMS", "1041357", "leadership", "APMS", "Reliability", "Programme", "2025-08-01", "2026-12-15", 62, ""),
        ("LPMS rollout", "DDTTO-63", "THO", "LPMS", "LPMS", "", "leadership", "LPMS", "Reliability", "Programme", "2026-01-15", "2026-11-01", 30, ""),
        ("TO SAIL — FDP", "DDTTO-08", "THO", "SAIL", "SAIL", "", "on_track", "SAIL", "SAIL lead", "Programme", "2025-12-01", "2026-07-31", 48, ""),
        ("TO Takami", "DDTTO-58", "THO", "TAKAMI", "Takami", "", "monitor", "Takami", "Digital", "Programme", "2026-02-01", "2026-10-01", 35, ""),
        ("SAP warehouse", "DDTTO-41", "THO", "SAP", "SAP", "", "on_track", "SAP", "Supply", "Site-led", "2025-10-01", "2026-04-30", 80, ""),
        ("Discoverant feed", "DDTTO-70", "THO", "DISC", "Discoverant", "", "planning", "Discoverant", "Data", "Site-led", "", "", 10, ""),
        ("MES ↔ SAIL", "DDTTO-80", "THO", "MES", "MES", "", "monitor", "MES", "MES lead", "Programme", "2026-07-01", "2027-03-31", 15, ""),
        ("Smart QC", "DDTTO-81", "THO", "SQC", "Smart QC", "", "on_track", "Smart QC", "QC", "Programme", "2026-09-01", "2027-06-01", 12, ""),
        ("Phoenix", "DDTTO-22", "THO", "PHX", "Phoenix", "1038801", "on_track", "Phoenix", "CIM", "Programme", "2026-10-01", "2027-09-01", 20, ""),
        ("Takami inventory", "DDTTO-59", "THO", "TAKAMI", "Takami", "", "on_track", "Takami", "Digital", "Programme", "2026-08-01", "2027-04-01", 18, ""),
        ("SIMCA Online", "DDTTO-71", "THO", "SIMCA", "SIMCA", "", "on_track", "SIMCA", "Data", "Programme", "2026-11-01", "2027-08-01", 8, ""),
        ("Paperless Ops", "DDTTO-90", "THO", "VEEVA", "Veeva", "", "planning", "Veeva", "QA digital", "Programme", "", "", 0, ""),
        ("RTMS expand", "DDTTO-64", "THO", "RTMS", "RTMS", "", "on_track", "RTMS", "Reliability", "Programme", "2027-04-01", "2028-03-01", 5, ""),
        ("Enterprise data twin", "DDTTO-72", "THO", "EDB", "EDB", "", "on_track", "EDB", "Data", "Programme", "2027-06-01", "2028-12-01", 4, ""),
        ("OT Cyber remediation", "DDTTO-77", "THO", "OT", "OT", "1049001", "monitor", "OT", "OT lead", "Site-led", "2025-09-01", "2026-09-30", 66, ""),
        ("TO MES Dapnese DS", "DDTTO-14", "THO", "MES", "MES", "", "monitor", "MES", "Site MES lead", "Programme", "2025-07-01", "2026-04-30", 72, ""),
        ("Unmapped test", "DDTTO-99", "THO", "", "", "", "planning", "SAIL", "PMO", "Site-led", "", "", 0, "No ProjectMap row — mapping demo."),
        ("LEX SAIL Fill Line", "DDTLEX-04", "LEX", "SAIL", "SAIL", "1050100", "on_track", "SAIL", "SAIL lead", "Programme", "2025-11-01", "2026-08-01", 50, ""),
        ("LEX Labware", "DDTLEX-11", "LEX", "LAB", "Labware", "", "on_track", "Labware", "Lab systems", "Programme", "2025-09-15", "2026-06-01", 60, ""),
        ("LEX MES suite", "DDTLEX-02", "LEX", "MES", "MES", "1028800", "monitor", "MES", "MES lead", "Programme", "2025-08-01", "2026-09-30", 45, ""),
        ("LEX Phoenix", "DDTLEX-20", "LEX", "PHX", "Phoenix", "", "planning", "Phoenix", "CIM", "Programme", "2026-10-01", "2027-10-01", 5, ""),
        ("LEX LPMS", "DDTLEX-33", "LEX", "LPMS", "LPMS", "", "on_track", "LPMS", "Reliability", "Programme", "2026-01-01", "2026-12-01", 40, ""),
        ("BRP SAIL", "DDTBP-07", "BRP", "SAIL", "SAIL", "", "on_track", "SAIL", "SAIL lead", "Programme", "2025-12-01", "2026-09-01", 42, ""),
        ("BRP Smart QC", "DDTBP-18", "BRP", "SQC", "Smart QC", "", "monitor", "Smart QC", "QC", "Programme", "2026-09-01", "2027-06-01", 10, ""),
    ]
    ws = wb.create_sheet("Projects")
    add_table(
        ws,
        ["Title", "JiraKey", "SiteCode", "InitiativeKey", "InitiativeName", "SpotId", "StatusCanonical", "Platform",
         "OwnerName", "ProgrammeOrLocal", "StartDate", "FinishDate", "ProgressPct", "Description", "JiraUrl", "SpotUrl"],
        [(*p, jira_url(p[1]), spot_url(p[5])) for p in projects],
        "Projects",
    )

    maps = [
        ("DDTTO-12", "THO", "one-day-batch-release", "FY26"),
        ("DDTTO-21", "THO", "one-day-batch-release", "FY26"),
        ("DDTTO-31", "THO", "lab-of-the-future", "FY26"),
        ("DDTTO-32", "THO", "lab-of-the-future", "FY26"),
        ("DDTTO-54", "THO", "predictive-maintenance", "FY26"),
        ("DDTTO-63", "THO", "predictive-maintenance", "FY26"),
        ("DDTTO-08", "THO", "rapid-digital-tech-transfer", "FY26"),
        ("DDTTO-58", "THO", "rapid-digital-tech-transfer", "FY26"),
        ("DDTTO-41", "THO", "inventory-optimization", "FY26"),
        ("DDTTO-70", "THO", "digital-twin", "FY26"),
        ("DDTTO-80", "THO", "one-day-batch-release", "FY27"),
        ("DDTTO-81", "THO", "lab-of-the-future", "FY27"),
        ("DDTTO-22", "THO", "rapid-digital-tech-transfer", "FY27"),
        ("DDTTO-59", "THO", "inventory-optimization", "FY27"),
        ("DDTTO-71", "THO", "digital-twin", "FY27"),
        ("DDTTO-90", "THO", "lab-of-the-future", "FY28+"),
        ("DDTTO-64", "THO", "predictive-maintenance", "FY28+"),
        ("DDTTO-72", "THO", "digital-twin", "FY28+"),
        ("DDTLEX-04", "LEX", "rapid-digital-tech-transfer", "FY26"),
        ("DDTLEX-11", "LEX", "lab-of-the-future", "FY26"),
        ("DDTLEX-02", "LEX", "one-day-batch-release", "FY26"),
        ("DDTLEX-20", "LEX", "rapid-digital-tech-transfer", "FY27"),
        ("DDTLEX-33", "LEX", "predictive-maintenance", "FY26"),
        ("DDTBP-07", "BRP", "rapid-digital-tech-transfer", "FY26"),
        ("DDTBP-18", "BRP", "lab-of-the-future", "FY27"),
    ]
    ws = wb.create_sheet("ProjectMap")
    add_table(
        ws,
        ["Title", "JiraKey", "SiteCode", "RockId", "FiscalYear", "UpdatedBy"],
        [(f"{k} · {r} · {fy}", k, site, r, fy, "Dean Santoro") for k, site, r, fy in maps],
        "ProjectMap",
    )

    fins = [
        ("MES Elaprase DS", "1024096", "THO", "DDTTO-12", "FY26", 180000, 180000, 92000, "2026-09-01"),
        ("NYMI Batch", "1042101", "THO", "DDTTO-21", "FY26", 148000, 148000, 61000, "2026-09-01"),
        ("TO APMS", "1041357", "THO", "DDTTO-54", "FY26", 205000, 220000, 198000, "2026-09-01"),
        ("Phoenix", "1038801", "THO", "DDTTO-22", "FY27", 436000, 436000, 40000, "2026-09-01"),
        ("OT Cyber remediation", "1049001", "THO", "DDTTO-77", "FY26", 205000, 205000, 150000, "2026-09-01"),
        ("LEX SAIL Fill Line", "1050100", "LEX", "DDTLEX-04", "FY26", 120000, 120000, 40000, "2026-09-01"),
        ("LEX MES suite", "1028800", "LEX", "DDTLEX-02", "FY26", 90000, 95000, 30000, "2026-09-01"),
    ]
    ws = wb.create_sheet("Financials")
    add_table(
        ws,
        ["Title", "SpotId", "SiteCode", "JiraKey", "FY", "Approved", "Forecast", "Actual", "AsOf"],
        fins,
        "Financials",
    )

    # 11/18 deployed 7/18 adopted = 50.0 for THO; 14/11 = 69.4 LEX; 9/6 = 41.7 BRP
    tho_dep = {0, 1, 2, 4, 5, 8, 9, 12, 14, 16, 17}
    tho_ado = {0, 2, 4, 8, 9, 12, 14}
    lex_dep = set(range(14))
    lex_ado = set(range(11))
    brp_dep = {0, 1, 2, 3, 5, 8, 12, 15, 16}
    brp_ado = {0, 1, 2, 8, 12, 16}
    caps = []
    for site, dep, ado in (("THO", tho_dep, tho_ado), ("LEX", lex_dep, lex_ado), ("BRP", brp_dep, brp_ado)):
        for i, name in enumerate(CAP_NAMES):
            caps.append((name, site, "Yes" if i < 6 else "No", "Yes" if i in dep else "No", "Yes" if i in ado else "No", 1))
    ws = wb.create_sheet("Capabilities")
    add_table(ws, ["Title", "SiteCode", "GlobalFlag", "Deployed", "Adopted", "ScoreWeight"], caps, "Capabilities")

    ints = [
        ("MES ↔ SAIL", "THO", "MES", "SAIL", "No", "No", "DDTTO-80"),
        ("Veeva ↔ SAP", "THO", "Veeva", "SAP", "No", "No", "DDTTO-90"),
        ("Labware ↔ SAP", "LEX", "Labware", "SAP", "No", "No", "DDTLEX-11"),
        ("SAIL ↔ MES", "BRP", "SAIL", "MES", "No", "No", "DDTBP-07"),
    ]
    ws = wb.create_sheet("Integrations")
    add_table(ws, ["Title", "SiteCode", "SourceSystem", "TargetSystem", "Deployed", "Adopted", "RelatedJiraKey"], ints, "Integrations")

    risks = [
        ("OpenLab support", "THO", "Jira", "monitor", "PMO", "2026-09-30", "DDTGMPORT-41", "", "Medium", "Keep vendor bridge"),
        ("MES ↔ SAIL interface", "THO", "Jira", "leadership", "MES", "2026-10-15", "DDTTO-80", "", "High", "Interface workshop"),
        ("Local mapping gaps", "THO", "Local", "planning", "Site DD&T", "2026-09-20", "", "", "Low", "Map DDTTO-99"),
        ("APMS dates vs spend", "THO", "Local", "leadership", "Reliability", "2026-09-18", "DDTTO-54", "1041357", "High", "Leadership airtime"),
    ]
    ws = wb.create_sheet("Risks")
    add_table(
        ws,
        ["Title", "SiteCode", "Source", "StatusCanonical", "OwnerName", "Due", "JiraKey", "RelatedSpotId", "Severity", "Mitigation"],
        risks,
        "Risks",
    )

    ws = wb.create_sheet("Commentary")
    add_table(
        ws,
        ["Title", "SiteCode", "Period", "RockId", "Body", "Sentiment", "AuthorName", "AuthorEmail"],
        [("THO 2026-09", "THO", "2026-09", "", "13 at-risk items are real; two are mapping debt, not delivery failure. APMS needs airtime.", "watch", "Dean Santoro", "dean.santoro@takeda.com")],
        "Commentary",
    )

    ws = wb.create_sheet("LeadershipAsks")
    add_table(
        ws,
        ["Title", "SiteCode", "Period", "NeededBy", "Impact", "AuthorName"],
        [
            ("Codex seats for Aimee Rarugal", "THO", "2026-09", "2026-09-09", "Already on SPOT 1063647", "Dean Santoro"),
            ("APMS leadership airtime", "THO", "2026-09", "2026-09-18", "SPOT 1041357 dates vs spend", "Dean Santoro"),
        ],
        "LeadershipAsks",
    )

    ws = wb.create_sheet("GoLiveConfirm")
    add_table(ws, ["Title", "SiteCode", "JiraKey", "ConfirmOrChange", "Reason", "AuthorName"], [], "GoLiveConfirm")

    ws = wb.create_sheet("ReviewFreeze")
    add_table(ws, ["Title", "SiteCode", "Period", "ArtifactUrl", "CreatedByName"], [], "ReviewFreeze")

    ws = wb.create_sheet("Audit")
    add_table(ws, ["Title", "Entity", "Action", "ActorName", "ActorEmail", "BeforeJson", "AfterJson", "SiteCode"], [], "Audit")

    ws = wb.create_sheet("Freshness")
    add_table(
        ws,
        ["Title", "Source", "AsOf", "IsOK", "StaleMessage", "IntegrationNeeded"],
        [
            ("Jira", "Jira", "2026-09-09 14:00", "Yes", "", "Yes"),
            ("SPOT", "SPOT", "2026-09-09 13:19", "Yes", "", "Yes"),
            ("EDB", "EDB", "2026-09-09 13:00", "Yes", "", "Yes"),
            ("SiteHead", "SiteHead", "2026-09-09 14:02", "Yes", "", "No"),
        ],
        "Freshness",
    )

    ws = wb.create_sheet("UserSiteRole")
    add_table(
        ws,
        ["Title", "UserEmail", "SiteCode", "Role"],
        [
            ("dean THO", "dean.santoro@takeda.com", "THO", "SiteDDT"),
            ("dean LEX", "dean.santoro@takeda.com", "LEX", "Viewer"),
            ("brp demo", "demo.brp@takeda.com", "BRP", "SiteHead"),
        ],
        "UserSiteRole",
    )

    guide = wb.create_sheet("HOW_TO_IMPORT")
    guide["A1"] = "Import each sheet (except HOW_TO_IMPORT) as a SharePoint list on https://mytakeda.sharepoint.com/sites/GSQExecutivePlatform"
    guide["A2"] = "Site contents → New → List → From Excel → this workbook → pick one table per list. Use the sheet name as the list internal name."
    guide["A3"] = "Create a document library named FreezePacks with a folder per SiteCode."
    guide["A4"] = "Jira and SPOT columns are staged. Automated pull = Integration needed."
    guide["A5"] = "Do not create a second SPOT. 1063647 is the only Executive Platform investment."
    guide.column_dimensions["A"].width = 140

    wb.save(OUT)
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
