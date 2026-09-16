import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from 'recharts';
import { AlertTriangle, CheckCircle2, ChevronDown, CircleDashed, CircleDollarSign, ClipboardCheck, Download, Gauge, GripVertical, HandCoins, Search, ShieldAlert, TrendingUp, Workflow, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AskCopilot, LiveAgent } from '@/components/executive-assist';
import { SiteLeadershipStrip, SiteNetworkHero } from '@/components/site-network';
import { useRisksList } from '@/generated/hooks/use-risks';
import { useCommentary_1List } from '@/generated/hooks/use-commentary-1';
import { useLeadershipAsksList } from '@/generated/hooks/use-leadership-asks';
import type { Risks as SharePointRisk } from '@/generated/models/risks-model';
import type { Commentary_1 } from '@/generated/models/commentary-1-model';
import type { LeadershipAsks } from '@/generated/models/leadership-asks-model';
import { useOnePagerList, useUpdateOnePager } from '@/generated/hooks/use-one-pager';
import { useIntegrationsTrackerList } from '@/generated/hooks/use-integrations-tracker';
import { useCapabilityTrackerList } from '@/generated/hooks/use-capability-tracker';
import type { IntegrationsTracker } from '@/generated/models/integrations-tracker-model';
import type { CapabilityTracker } from '@/generated/models/capability-tracker-model';
import DigitalMaturityHeatmap from '@/components/digital-maturity-heatmap';
import { toast } from 'sonner';
import {

  OnePagerBigRockKeyToLabel,
  OnePagerFiscalYearKeyToLabel,
  OnePagerNorthStarKeyToLabel,
  OnePagerSiteKeyToLabel,
  OnePagerStatusKeyToLabel,
  type OnePager as SharePointOnePager,
} from '@/generated/models/one-pager-model';

const siteInputUrl = 'https://mytakeda.sharepoint.com/sites/GSQExecutivePlatform/SitePages/Site-Input.aspx';
const jiraBaseUrl = 'https://onetakeda.atlassian.net';
const jiraKeyPattern = /\b[A-Z][A-Z0-9]+-\d+\b/g;
const jiraIssueUrl = (key: string) => `${jiraBaseUrl}/browse/${key}`;
const tabs = ['Portfolio Health', 'Roadmap', 'Status KPIs', 'Gantt + Budget', 'Budget', 'Risks', 'Capability', 'Ask Copilot'];
const platforms = ['MES','SAIL','Paperless Ops','APMS','LPMS','Veeva','Labware','OT Cyber','Takami','Phoenix','Local'];
const yearLabels = ['FY2026 BUILD FOUNDATION','FY2027 SCALE AND INTEGRATE','FY2028 AND BEYOND TRANSFORM AND OPTIMIZE'];
const chartConfig = { value: { label: 'Projects', color: 'var(--chart-1)' } } satisfies ChartConfig;
const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
const siteOptions = [
  { code: 'ALL', name: 'All Sites', region: 'Network' },
  { code: 'LEX', name: 'Lexington', region: 'North America' }, { code: 'THO', name: 'Thousand Oaks', region: 'North America' },
  { code: 'BRP', name: 'Brooklyn Park', region: 'North America' }, { code: 'NAU', name: 'Naucalpan', region: 'Latin America' },
  { code: 'BUE', name: 'Buenos Aires', region: 'Latin America' }, { code: 'TJN', name: 'Tianjin', region: 'APAC' },
  { code: 'OSA', name: 'Osaka', region: 'APAC' }, { code: 'HIK', name: 'Hikari', region: 'APAC' },
  { code: 'SGP', name: 'Singapore', region: 'APAC' }, { code: 'YAR', name: 'Yaroslavl', region: 'APAC' },
  { code: 'BEK', name: 'Bekasi', region: 'APAC' }, { code: 'GRA', name: 'Grange Castle', region: 'Europe' },
  { code: 'BRY', name: 'Bray', region: 'Europe' }, { code: 'LIN', name: 'Linz', region: 'Europe' },
  { code: 'ORA', name: 'Oranienburg', region: 'Europe' }, { code: 'SNG', name: 'Singen', region: 'Europe' },
  { code: 'NEU', name: 'Neuchatel', region: 'Europe' }, { code: 'VAS', name: 'Vashi', region: 'Europe' },
];
type SiteOption = (typeof siteOptions)[number];
const physicalSites = siteOptions.filter((option: SiteOption) => option.code !== 'ALL');
const isAllSites = (siteCode: string) => siteCode === 'ALL';
const headerSiteLabel = (site: SiteOption) => isAllSites(site.code) ? 'ALL SITES' : `${site.name.toUpperCase()} · ${site.code}`;
const regionForSite = (code: string) => physicalSites.find((option: SiteOption) => option.code === code)?.region;
type SiteListOptions = { filter?: string; orderBy?: string[] };
const listFilterForSite = (siteCode: string, extra: SiteListOptions = {}): SiteListOptions => (
  isAllSites(siteCode) ? extra : { filter: `siteCode eq '${siteCode}'`, ...extra }
);
const matchesSiteCode = (value: string | undefined, siteCode: string) => isAllSites(siteCode) || (value ?? '').trim().toUpperCase() === siteCode;
type SpotBudgetRow = { spot: string; site: string; roadmapId: string | null; initiative: string | null; title: string; state: string; phase: string; budgetId: string | null; owner: string | null; currency: string; localCapex: number; localOpex: number | null; totalCapex: number; totalOpex: number | null; approvedCapex: number; approvedOpex: number | null; excludeFromSiteRollup: boolean };
type RoadmapGap = { site: string; roadmapId: string | null; initiative: string | null; title: string };
const spotBudgetAsOf = '2026-09-13';
type SpotMark = { n: string; p: string | null; c: string | null };
type SpotTimeline = { s: string | null; f: string | null; pf?: string | null; m: SpotMark[] };
const spotTimeline: Record<string, SpotTimeline> = {"1024096":{"s":"2020-12-31","f":"2026-10-19","pf":"2027-01-29","m":[{"n":"Downstream MBR Design Updates - Buffer Run","p":"2024-07-18","c":"2024-07-18"},{"n":"MBR Verification (Downstream, Upstream, Solution Prep, DSP2)","p":"2026-10-16","c":null},{"n":"Project End - Project End","p":"2027-01-29","c":null},{"n":"Execution End - Ready to Implement","p":"2026-10-19","c":null},{"n":"Column Packing MBR Development","p":"2026-11-20","c":null},{"n":"Project Start - Project Start","p":"2022-08-25","c":"2022-08-22"},{"n":"Finalized BOM Structures","p":"2026-01-30","c":"2026-01-30"},{"n":"MBRs Version 1 in QAL ENV for ENG Run 3 (Downstream, Upstream, Solution Prep, DSP2)","p":"2025-12-01","c":"2025-12-01"}]},"1024124":{"s":"2022-11-15","f":"2026-12-30","pf":"2026-12-30","m":[{"n":"Execution End - Project Closure","p":"2026-12-30","c":null},{"n":"Execution Start - Project Start","p":"2022-11-15","c":"2022-11-15"},{"n":"Project End - Closure move to routine.","p":"2026-12-30","c":null},{"n":"Project Start - Review and start","p":"2022-09-30","c":"2022-09-01"},{"n":"Execution End - Complete first (example) use-case qualification","p":"2025-10-31","c":"2026-01-30"}]},"1029630":{"s":"2024-05-24","f":"2026-12-31","pf":"2026-12-31","m":[{"n":"Project End - End","p":"2026-12-31","c":null},{"n":"Execution End - Project Closure","p":"2026-12-31","c":null},{"n":"Project Start - Start","p":"2023-12-01","c":"2023-12-01"},{"n":"Execution Start - Definition Strategy / Identification of Power Users","p":"2024-06-21","c":"2024-05-24"}]},"1033322":{"s":"2027-04-01","f":"2028-04-01","pf":"2028-05-31","m":[{"n":"Project Start -","p":"2027-04-01","c":null},{"n":"Project End -","p":"2028-05-31","c":null}]},"1038732":{"s":"2023-12-06","f":"2026-10-30","pf":"2026-11-30","m":[{"n":"Execution End - Go-Live","p":"2026-10-30","c":null},{"n":"Project End - Project Completed and Financial Closeout","p":"2026-11-30","c":null},{"n":"Project Start - Project Start","p":"2023-12-01","c":"2023-12-01"},{"n":"CAR Approved","p":"2023-04-30","c":"2023-12-22"},{"n":"PO sent to supplier","p":"2024-01-25","c":"2024-01-23"},{"n":"Training to end-users performed","p":"2026-09-30","c":"2026-09-10"},{"n":"Material & Licences received","p":"2024-03-26","c":"2024-03-22"},{"n":"Execution Start - Execution Start","p":"2023-12-06","c":"2023-12-06"},{"n":"Qualification performed","p":"2026-08-31","c":"2026-08-31"},{"n":"Installation & configuration done","p":"2024-03-29","c":"2024-03-22"},{"n":"Kick-Off Meeting","p":"2024-01-21","c":"2024-01-16"}]},"1039601":{"s":"2023-08-31","f":"2026-06-30","pf":"2026-07-31","m":[{"n":"New platform engineered and investment order placed","p":"2023-09-30","c":"2023-09-11"},{"n":"Qualification Room 1 completed","p":"2024-08-15","c":"2024-10-10"},{"n":"Project End - Project Closure","p":"2026-07-31","c":null},{"n":"\u2022 Qualification prepared and ready for execution.","p":"2024-08-01","c":"2024-09-18"},{"n":"Project Start - Start of planning","p":"2023-08-31","c":"2023-08-31"},{"n":"Second DataCenter Room ready for equipment","p":"2025-04-30","c":"2025-04-18"},{"n":"\u2022 Equipment delivered, racked, network connections established and ready for configuration start.","p":"2024-02-29","c":"2024-02-29"},{"n":"Execution End - OT Platform upgraded or replaced and in full service","p":"2026-06-30","c":null},{"n":"Execution Start - Project initiate","p":"2023-08-31","c":"2023-08-31"},{"n":"Configuration completed and technical implementation completed.","p":"2024-04-30","c":"2024-06-27"}]},"1043658":{"s":"2025-01-06","f":"2028-03-31","pf":"2028-05-31","m":[{"n":"Execution Start - Implementation/Improve","p":"2023-08-26","c":"2025-01-06"},{"n":"Project Start -","p":"2023-05-31","c":"2023-05-31"},{"n":"Execution End - Execute Gate","p":"2028-03-31","c":null},{"n":"Project End -","p":"2028-05-31","c":null},{"n":"Charter Approved","p":"2023-08-25","c":"2023-08-22"},{"n":"Business Case Approved","p":"2023-08-25","c":"2023-08-22"}]},"1043819":{"s":"2027-01-04","f":"2027-12-22","pf":"2027-12-22","m":[{"n":"Execution Start - Execution Start","p":"2027-01-04","c":null},{"n":"Project Start - Project Scoping","p":"2026-06-01","c":"2026-06-01"},{"n":"CAR Approved","p":"2026-12-18","c":null}]},"1046417":{"s":"2025-02-05","f":"2026-03-31","pf":"2026-07-31","m":[{"n":"Execution End - Project closure","p":"2026-03-31","c":"2026-03-31"},{"n":"Project End - Project closure","p":"2026-07-31","c":"2026-06-12"},{"n":"Execution Start -","p":"2025-02-05","c":"2025-02-05"},{"n":"Project Start -","p":"2025-02-05","c":"2025-02-05"}]},"1046793":{"s":"2026-04-30","f":"2026-11-30","pf":"2027-08-31","m":[{"n":"Basic Design Completed - Basic Design Completed","p":"2026-04-01","c":"2026-04-01"},{"n":"Execution Start - CAR Approved","p":"2026-04-30","c":"2026-04-30"},{"n":"Project Start - Project Charter endorsed","p":"2026-01-19","c":"2026-01-19"},{"n":"Project End - Project Completed and Financial Closeout","p":"2027-08-31","c":null},{"n":"Depreciation Start (Asset Placed In Service - Form submitted) - Depreciation Start (Asset Placed In Service - Form submitted)","p":"2026-04-01","c":"2026-04-01"},{"n":"Construction/Installation Start - Construction/Installation Start","p":"2026-04-01","c":"2026-05-01"},{"n":"Kick OFF","p":"2026-04-30","c":"2026-04-30"},{"n":"Construction/Installation Completed (Last System) - Construction/Installation Completed (Last System)","p":"2027-04-30","c":null},{"n":"OQ completed (Last Equipment) - OQ completed (Last Equipment)","p":"2027-05-31","c":null},{"n":"Management Endorsement - Management Endorsement","p":"2026-04-01","c":"2026-04-01"},{"n":"Concept Design Completed - Concept Design Completed","p":"2026-04-01","c":"2026-04-01"},{"n":"Execution End - gChromeleon Installation finished","p":"2026-11-30","c":null}]},"1047430":{"s":"2024-05-08","f":"2026-04-24","pf":"2026-06-05","m":[{"n":"PO issued to supplier(s)","p":"2024-05-28","c":"2024-06-17"},{"n":"Recruitment of  LIMS data analyst","p":"2024-05-20","c":"2024-06-17"},{"n":"Installation commence","p":"2024-06-28","c":"2024-09-13"},{"n":"Change Control in execute state","p":"2025-02-26","c":"2025-02-26"},{"n":"Execution End - Project close out report","p":"2026-05-15","c":"2026-04-24"},{"n":"CAR approval","p":"2024-05-27","c":"2024-05-27"},{"n":"Execution Start - Charter approved","p":"2024-05-01","c":"2024-05-08"}]},"1050194":{"s":"2025-11-17","f":"2027-03-31","pf":"2027-03-31","m":[{"n":"Execution Start - Project Start","p":"2025-12-01","c":"2025-11-17"},{"n":"Execution End - 1030945: 400SW MES UPSTREAM OPS - Project Implemented","p":"2027-03-31","c":null},{"n":"Project End - Hyper Care","p":"2027-02-17","c":null},{"n":"Project Start - Kick-off","p":"2025-10-17","c":"2025-10-17"}]},"1051022":{"s":"2026-10-09","f":"2027-03-31","pf":"2027-04-30","m":[{"n":"DP Wave 1","p":"2026-12-15","c":null},{"n":"Project End - Project End","p":"2027-04-30","c":null},{"n":"Project Start - Project Start","p":"2025-10-01","c":"2025-10-31"},{"n":"Management Endorsement - Proposal, Charter, and Business Case Approved","p":"2026-01-31","c":"2025-12-17"},{"n":"Execution End - Execution End","p":"2027-03-31","c":null},{"n":"Execution Start - Execution Start","p":"2026-10-09","c":null},{"n":"Project Kickoff","p":"2026-09-30","c":null}]},"1051059":{"s":"2024-06-30","f":"2025-10-01","pf":"2026-12-31","m":[{"n":"Opstrakker Priority Use Cases Selected","p":"2024-12-12","c":"2024-12-12"},{"n":"Project Start -","p":"2024-09-01","c":"2024-09-01"},{"n":"Execution Start - Bray Paper Forms List Compiled","p":"2024-06-30","c":"2024-06-30"},{"n":"Transfer eForms to Production Environment","p":"2025-06-20","c":"2025-06-20"},{"n":"Citizen Developers Identified","p":"2025-05-31","c":"2025-04-17"},{"n":"Expert Training Complete","p":"2024-12-01","c":"2024-12-01"},{"n":"Project End - Project Completion","p":"2026-12-31","c":"2026-03-10"},{"n":"Execution End - Opstrakker Forms Live","p":"2025-10-01","c":"2025-10-01"},{"n":"Citizen Developer Training Complete","p":"2025-05-31","c":"2025-05-16"}]},"1051357":{"s":"2024-08-27","f":"2027-05-28","pf":"2027-11-26","m":[{"n":"Execution End - Execution End","p":"2027-05-28","c":null},{"n":"Project Start - Funding Approved","p":"2024-08-26","c":"2024-08-26"},{"n":"Pi to SAIL Bridget","p":"2026-09-30","c":null},{"n":"Project End - SPOT Closure","p":"2027-11-26","c":null},{"n":"Kick off and Planning Session","p":"2024-10-15","c":"2024-10-15"}]},"1051403":{"s":"2026-09-30","f":"2027-03-31","pf":"2027-03-31","m":[{"n":"Production Release NEU","p":"2026-06-30","c":null},{"n":"Execution Start - Integration Sprints NEU-Line B&X","p":"2026-09-30","c":null},{"n":"Project End -","p":null,"c":null},{"n":"Kick-off Meeting NEU","p":"2026-03-05","c":null},{"n":"Execution End - Project End","p":"2027-03-31","c":null},{"n":"Integration Sprints NEU-Line A","p":"2026-06-30","c":null},{"n":"Project Start -","p":null,"c":null}]},"1051746":{"s":"2024-12-02","f":"2026-03-26","pf":"2026-09-30","m":[{"n":"Install Shopfloor Connectors to Local SAIL","p":"2025-06-27","c":"2025-06-19"},{"n":"Project End - SPOT Closure","p":"2026-09-30","c":null},{"n":"Execution End - Execution End","p":"2026-03-30","c":"2026-03-26"},{"n":"Project Start - Funding Approved","p":"2024-11-14","c":"2024-11-14"},{"n":"APMS Launch at MassBio (CAR, SOW, PO, KICK OFF)","p":"2025-01-31","c":"2025-01-16"}]},"1051867":{"s":"2024-01-01","f":"2027-02-01","pf":"2027-03-31","m":[{"n":"Execution End - ALL Digital projects implemented","p":"2027-02-01","c":null},{"n":"Execution Start -","p":"2024-01-01","c":"2024-01-01"},{"n":"MES - E2E  testing in PRD post PPQ","p":"2027-01-30","c":null},{"n":"Project Start - Project Start","p":"2024-09-03","c":"2024-09-03"},{"n":"MES - Ibatch qualification","p":"2027-03-31","c":null},{"n":"Project End - Project End","p":"2027-02-05","c":null}]},"1052353":{"s":"2024-10-18","f":"2025-12-01","pf":"2026-07-31","m":[{"n":"Execution Start - On site workshop completed","p":"2024-10-18","c":"2024-10-18"},{"n":"First Regulatory Assessment received","p":"2025-05-30","c":"2025-05-30"},{"n":"Execution End - Go Live SAP","p":"2026-01-30","c":"2025-12-01"}]},"1052454":{"s":"2025-06-04","f":"2026-08-31","pf":"2026-09-30","m":[{"n":"Execution Start - Project Kick-off","p":"2025-06-04","c":"2025-06-04"},{"n":"Project End - Project closure","p":"2026-09-30","c":null},{"n":"P1 Release 1: TAK-438 - Go-Live","p":"2025-08-07","c":"2025-08-22"},{"n":"Depreciation Start (Asset Placed In Service - Form submitted)","p":"2026-09-30","c":null},{"n":"Project Start - Initial site briefing","p":"2025-01-21","c":"2025-01-21"},{"n":"Execution End - Handover","p":"2026-08-31","c":null},{"n":"CAR Approved","p":"2025-05-08","c":"2025-05-08"}]},"1052674":{"s":"2024-11-11","f":"2025-03-31","pf":"2028-03-31","m":[{"n":"Execution Start - FY24 OpsTrakker: Start Development, Test, Training","p":"2024-11-11","c":"2024-11-11"},{"n":"Execution End - FY24 OpsTrakker: Complete Development, Test, Training","p":"2025-03-31","c":"2025-03-31"},{"n":"Project End - Project End","p":"2028-03-31","c":null},{"n":"Project Start - Project Start","p":"2025-06-30","c":"2025-06-30"}]},"1052852":{"s":"2026-07-15","f":"2027-10-18","pf":"2028-09-29","m":[{"n":"Execution End - Go-Live","p":"2027-10-18","c":null},{"n":"Depreciation Start (Asset Placed In Service - Form submitted)","p":"2028-09-29","c":null},{"n":"Execution Start - (WS1)","p":"2026-07-15","c":null}]},"1052966":{"s":"2025-03-31","f":"2026-03-31","pf":"2026-07-31","m":[{"n":"Execution Start - Pilot Start","p":"2025-03-31","c":"2025-03-31"},{"n":"Project End - Pilot Complete","p":"2026-07-31","c":"2026-07-27"},{"n":"Execution End - End to end use case live","p":"2026-03-31","c":"2026-03-31"},{"n":"Assessment of paper forms/logbooks completed","p":"2025-11-28","c":"2025-11-28"},{"n":"OpsTrakker NE governance + R&R published","p":"2026-07-31","c":"2026-07-27"}]},"1053702":{"s":null,"f":null,"pf":null,"m":[{"n":"Project End -","p":null,"c":null},{"n":"Depreciation Start (Asset Placed In Service - Form submitted)","p":null,"c":null},{"n":"Project Start -","p":null,"c":null},{"n":"Execution Start - Execution Start","p":null,"c":null},{"n":"Execution End - Execution End","p":null,"c":null}]},"1054339":{"s":"2025-10-14","f":"2026-07-10","pf":"2026-09-30","m":[{"n":"Execution End - CQV execution completed","p":"2026-07-18","c":"2026-07-10"},{"n":"MTELL TRAINING","p":"2025-06-27","c":"2025-06-27"},{"n":"Depreciation Start (Asset Placed In Service - Form submitted) - Depreciation Start (Asset Placed In Service - Form submitted)","p":"2025-10-14","c":"2025-10-14"},{"n":"Sustainment Phase/Launch Project","p":"2026-07-31","c":"2026-07-10"},{"n":"Deploy Group#4 Agents","p":"2026-03-31","c":"2025-11-25"},{"n":"Deploy Group#2 Agents","p":"2025-11-30","c":"2025-11-25"},{"n":"Deploy Group#5 Agents","p":"2026-05-31","c":"2026-03-04"},{"n":"Deploy Group#3 Agents","p":"2026-01-29","c":"2025-11-25"},{"n":"Deploy Group#1 Agents","p":"2025-09-30","c":"2025-09-08"},{"n":"Project Start - Project Proposal endorsed","p":"2025-02-23","c":"2025-02-23"},{"n":"SOP reviews/Updates","p":"2026-06-30","c":"2026-06-29"},{"n":"Project End - Project Completed and Financial Closeout","p":"2026-09-30","c":null},{"n":"Management Endorsement - Plan phase gate completed","p":"2025-10-17","c":"2025-10-14"}]},"1056219":{"s":"2025-10-01","f":"2026-02-28","pf":"2026-03-31","m":[{"n":"","p":null,"c":null},{"n":"Team Resourced","p":"2025-09-01","c":"2025-09-01"},{"n":"Execution End - Execution End - FORMS are Live in Opstrakker Production","p":"2026-03-13","c":"2026-02-28"},{"n":"Proposal Approved","p":"2025-07-11","c":"2025-07-10"},{"n":"Charter Approved","p":"2025-09-19","c":"2025-09-19"},{"n":"Change Control Close (Elaprase)","p":"2026-03-31","c":"2026-03-31"},{"n":"Execution Start - Execution Start","p":"2025-10-01","c":"2025-10-01"},{"n":"Project End - Project Completed (Elaprase)","p":"2026-03-31","c":"2026-03-31"},{"n":"","p":null,"c":null},{"n":"Business Case Approved","p":"2025-07-11","c":"2025-07-10"},{"n":"KickOff","p":"2025-09-04","c":"2025-09-04"},{"n":"Project Plan Complete","p":"2025-09-12","c":"2025-09-12"}]},"1056412":{"s":"2025-06-30","f":"2027-04-16","pf":"2027-05-31","m":[{"n":"Execution End - Execution End","p":"2027-04-16","c":null},{"n":"Rancho Phase 2","p":"2026-08-24","c":"2026-08-24"},{"n":"Rancho Phase 1","p":"2026-07-14","c":"2026-07-10"},{"n":"LMF Phase 2","p":"2026-05-04","c":"2026-05-04"},{"n":"Rancho Phase 3 and Phase 4","p":"2026-09-28","c":null},{"n":"LMF Phase 1","p":"2026-01-17","c":"2026-01-17"}]},"1056471":{"s":"2025-05-09","f":"2026-12-31","pf":"2026-12-31","m":[{"n":"Document review approval","p":"2025-12-15","c":"2026-02-04"},{"n":"Identification of list of Computerized systems","p":"2025-05-15","c":"2025-05-19"},{"n":"Project Start -","p":null,"c":null},{"n":"uploading of data in AskIT","p":"2026-03-31","c":"2026-03-31"},{"n":"Execution End - Closure of Project after implementation","p":"2026-12-31","c":null},{"n":"Initiation of Change Control","p":"2026-02-15","c":"2026-02-28"},{"n":"Project End - Project Closure","p":"2026-10-31","c":null},{"n":"Detailed system profile Preparation","p":"2025-11-30","c":"2025-11-30"},{"n":"Document revision","p":"2026-09-30","c":null},{"n":"Preparation of List of roles in Computerized systems","p":"2025-06-06","c":"2025-10-31"}]},"1056618":{"s":"2026-06-15","f":"2026-10-30","pf":"2026-11-15","m":[{"n":"Project Start - Proposal Approved","p":"2026-04-30","c":"2026-04-30"},{"n":"Project Plan approved","p":"2026-04-30","c":"2026-04-30"},{"n":"Execution Start - e-forms Dev starts","p":"2026-07-10","c":"2026-06-15"},{"n":"CC opened","p":"2026-04-30","c":"2026-04-15"},{"n":"Project End - Close","p":"2026-11-15","c":null},{"n":"Execution End - e-Forms live","p":"2026-10-30","c":null},{"n":"Business Case and Charter approved","p":"2026-04-30","c":"2026-04-30"}]},"1056725":{"s":"2025-06-19","f":"2025-08-21","pf":"2026-09-30","m":[{"n":"Execution End - Steerco - decisions","p":"2025-08-21","c":"2025-08-21"},{"n":"Execution Start - On boarding - training builders - Draft template","p":"2025-06-19","c":"2025-06-19"},{"n":"Project End - Project Close Out report approved","p":"2026-09-30","c":null},{"n":"Testing functionalities and system connections","p":"2025-08-31","c":"2025-08-31"},{"n":"Project Start - Proposal approval at PIC","p":"2025-06-04","c":"2025-06-04"},{"n":"Start Fabriq roll out to Neuch\u00e2tel site","p":"2026-01-07","c":"2025-12-23"},{"n":"Neuchatel Problem solving and Process confirmation end","p":"2026-06-30","c":"2026-06-29"},{"n":"Team training","p":"2025-07-18","c":"2025-07-23"}]},"1056796":{"s":"2026-06-16","f":"2027-01-29","pf":"2027-03-20","m":[{"n":"Execution Start - CAR Approved","p":"2026-11-04","c":"2026-06-16"},{"n":"Depreciation Start (Asset Placed In Service - Form submitted)","p":"2027-03-20","c":null},{"n":"Execution End - Execution completed","p":"2027-01-29","c":null}]},"1056836":{"s":"2026-03-03","f":"2026-05-18","pf":"2026-06-30","m":[{"n":"Execution End - Complete UAT report","p":"2026-05-31","c":"2026-05-18"},{"n":"Project Start - Change requested approval","p":"2025-07-31","c":"2025-07-28"},{"n":"Project End - The balance and scale in use for Weighing room 3#","p":"2026-06-30","c":"2026-06-30"},{"n":"Execution Start - Complete IOQ and CSV for the balance and scale of Weighing room 3#","p":"2026-01-31","c":"2026-03-03"}]},"1056869":{"s":"2025-10-06","f":"2026-07-02","pf":"2026-11-30","m":[{"n":"Execution Start - CAR Approved","p":"2025-10-08","c":"2025-10-06"},{"n":"Project End - Project Completed and Financial Closeout","p":"2026-11-30","c":null},{"n":"Hardware and Software installation complete","p":"2026-04-30","c":"2026-05-15"},{"n":"Installation of the equipment in the Warehouse external fridge","p":"2026-11-30","c":null},{"n":"Execution End - CQV execution completed - Validation Summary Report","p":"2026-07-02","c":"2026-07-02"},{"n":"Depreciation Start (Asset Placed In Service - Form submitted)","p":"2026-11-30","c":null}]},"1058352":{"s":"2025-10-30","f":"2027-07-30","pf":"2027-12-31","m":[{"n":"Basic Design Completed - Basic Design Completed","p":"2025-11-30","c":"2025-11-10"},{"n":"Detail Design Completed - Detail Design Completed","p":"2026-01-31","c":"2026-01-30"},{"n":"Execution End - CQV execution completed","p":"2027-07-30","c":null},{"n":"First Regulatory Filing submitted - First Regulatory Filing submitted","p":"2026-06-30","c":"2026-01-31"},{"n":"Execution Start - CAR Approved","p":"2025-11-27","c":"2025-10-30"},{"n":"Project End - Project Completed and Financial Closeout","p":"2027-10-31","c":null},{"n":"Concept Design Completed - Concept Design Completed","p":"2025-11-07","c":"2025-11-07"},{"n":"Construction/Installation Completed (Last System) - Construction/Installation Completed (Last System)","p":"2027-07-31","c":null},{"n":"Acceptance of system software and hardware for Phase 1.","p":"2026-01-31","c":"2026-02-28"},{"n":"Project Start - Project Charter endorsed","p":"2025-12-31","c":"2025-12-31"}]},"1058613":{"s":"2025-10-24","f":"2026-10-30","pf":"2026-12-31","m":[{"n":"Project End - Project Completed and Financial Closeout","p":"2026-12-31","c":null},{"n":"Detail Design Completed - First Fix cable installation complete","p":"2026-02-27","c":"2026-02-24"},{"n":"Execution Start - CAR Approved","p":"2025-11-07","c":"2025-10-24"},{"n":"Execution End - Installation of Access Points complete","p":"2026-10-30","c":null},{"n":"Project Start - Project Charter endorsed","p":"2025-10-31","c":"2025-10-24"},{"n":"Management Endorsement - Management Endorsement","p":"2025-10-21","c":"2025-10-19"},{"n":"Depreciation Start (Asset Placed In Service - Form submitted) - Depreciation Start (Asset Placed In Service - Form submitted)","p":"2026-11-30","c":null},{"n":"Critical Material/Equipment/Systems/Rooms Ready for CQ - Second fix installation complete","p":"2026-03-27","c":"2026-03-25"},{"n":"Basic Design Completed - Basic Design Completed","p":"2025-10-21","c":"2025-10-17"}]},"1059544":{"s":"2026-07-24","f":"2027-02-12","pf":"2027-02-19","m":[{"n":"Wave 2 - DS (5 forms)","p":"2026-12-15","c":null},{"n":"Project End - Project Completed","p":"2027-02-19","c":null},{"n":"Project Start - Project Charter & \nBusiness Case endorsed","p":"2026-03-13","c":"2025-12-18"},{"n":"Wave 1 - DS (6 forms)","p":"2026-10-15","c":null},{"n":"Wave 3 - DS (5 forms)","p":"2027-02-01","c":null},{"n":"Execution End - Execution completed","p":"2027-02-12","c":null},{"n":"Execution Start - Execution Starts","p":"2026-07-24","c":null}]},"1059670":{"s":"2026-01-07","f":"2026-06-25","pf":"2027-07-30","m":[{"n":"Execution End - A3 Problem Solving & Process Confirmation Deployment Leveraging Fabriq","p":"2026-06-26","c":"2026-06-25"},{"n":"Project Start - Obtain DDT Council Approval to Implement Fabriq as a Northstar Solution for AOS","p":"2025-12-15","c":"2025-12-15"},{"n":"Execution Start - Site Fabriq Deployment Kickoff","p":"2026-01-26","c":"2026-01-07"},{"n":"Project End - Thousand Oaks Project Closure / Completion","p":"2027-07-30","c":"2026-06-25"},{"n":"Management & Board Owners: Fabriq Access & Training (User)","p":"2026-02-27","c":"2026-03-02"},{"n":"Tier Board Go-Live in Fabriq","p":"2026-03-02","c":"2026-03-02"}]},"1059672":{"s":"2026-03-09","f":"2026-05-01","pf":"2027-03-31","m":[{"n":"Project Start - Obtain DDT Council Approval to Implement Fabriq as a Northstar Solution for AOS","p":"2025-12-15","c":"2025-12-15"},{"n":"Deploy Process Confirmation and Standard Checklist","p":"2026-06-30","c":"2026-07-28"},{"n":"MA Bio Ops A3 Problem Solving Deployment Leveraging Fabriq","p":"2026-06-30","c":"2026-06-30"},{"n":"Project End - Project End - Project Closure / Completion","p":"2027-03-31","c":null},{"n":"Execution Start - Site Fabriq Deployment Kickoff","p":"2026-03-10","c":"2026-03-09"},{"n":"Execution End - Site Fabriq Deployment for Tiered Accountability","p":"2026-05-01","c":"2026-05-01"}]},"1059685":{"s":"2025-11-24","f":"2026-11-30","pf":"2026-12-31","m":[{"n":"Patching Governance Monitoring","p":"2026-09-30","c":null},{"n":"Project End - Project ends","p":"2026-12-31","c":null},{"n":"Charter Approved","p":"2025-11-25","c":"2025-11-24"},{"n":"Patching Plan for GxP Assets","p":"2026-09-30","c":null},{"n":"Asset categorization (for DD&T and Automation)","p":"2025-11-20","c":"2025-11-20"},{"n":"Execution End - Work ends","p":"2026-11-30","c":null},{"n":"Project Start - Preparation","p":"2025-11-07","c":"2025-11-07"},{"n":"Patching of Non-GxP Assets","p":"2026-03-31","c":"2026-03-31"},{"n":"Execution Start - Patching to Begin","p":"2025-11-24","c":"2025-11-24"}]},"1059865":{"s":"2026-04-05","f":"2026-06-22","pf":"2028-03-31","m":[{"n":"CAR Approved","p":null,"c":"2026-04-15"},{"n":"Execution Start - Execution Start","p":"2026-04-06","c":"2026-04-05"},{"n":"Project End - Project End","p":"2026-06-30","c":"2026-06-22"},{"n":"Execution End - Execution End","p":"2028-03-31","c":"2026-06-22"},{"n":"Project Start - Project start","p":"2026-04-08","c":"2026-04-06"},{"n":"Depreciation Start (Asset Placed In Service - Form submitted)","p":null,"c":"2026-04-01"}]},"1060062":{"s":"2026-03-02","f":"2027-03-31","pf":"2027-03-31","m":[{"n":"Execution End - Execution End","p":"2027-03-31","c":null},{"n":"CAR Approved","p":null,"c":null},{"n":"Depreciation Start (Asset Placed In Service - Form submitted)","p":null,"c":null},{"n":"Execution Start - Execution Start","p":"2026-03-02","c":null},{"n":"Project Start - Kick off","p":"2026-04-01","c":null},{"n":"Project End - end of wave 1","p":"2027-03-31","c":null}]},"1060404":{"s":"2025-08-01","f":"2028-03-31","pf":"2028-03-31","m":[{"n":"Project End - Veeva eQMS Wave 3 Completion","p":"2028-03-31","c":null},{"n":"Execution End - Veeva eQMS Wave 3 Completion","p":"2028-03-31","c":null},{"n":"Project Start - Veeva eQMS Wave 1 Site Kickoff","p":"2025-08-01","c":"2025-08-01"},{"n":"Execution Start - Veeva eQMS Wave 1 Site Kickoff","p":"2025-08-01","c":"2025-08-01"}]},"1060535":{"s":"2026-04-17","f":"2026-08-01","pf":"2026-09-30","m":[{"n":"Value Creation to be created on SPOT","p":"2026-04-17","c":null},{"n":"Project Start - Deployment of Veeva eQMS","p":"2026-04-15","c":null},{"n":"Gantt Chart to be generated","p":"2026-04-16","c":null},{"n":"Execution End - Veeva eQMS go-live","p":"2026-08-01","c":null},{"n":"SPOT Charter to be generated and resources confirmed","p":"2026-04-16","c":null},{"n":"Execution Start - Set up the SPOT ID","p":"2026-04-17","c":null},{"n":"Change control to be drafted","p":"2026-05-05","c":null},{"n":"Project End - Project End","p":"2026-09-30","c":null}]},"1060591":{"s":"2026-03-04","f":"2027-12-31","pf":"2027-12-31","m":[{"n":"Phase C: Handover to Site - API (Series 15, 21)","p":"2027-09-22","c":null},{"n":"PAS X Q System Qualification","p":"2026-09-11","c":null},{"n":"Project Start - Project Charter endorsed and Project Kicked off","p":"2026-04-01","c":"2026-03-23"},{"n":"Execution Start - CAR Approved","p":"2026-03-31","c":"2026-03-04"},{"n":"PAS X Q System Installation","p":"2026-07-24","c":"2026-07-22"},{"n":"PAS X P System Installation","p":"2026-09-25","c":null},{"n":"Phase A: MBR Workshop 2 - KSM6","p":"2026-12-01","c":null},{"n":"Execution End - MBR Operationalize","p":"2027-12-31","c":null},{"n":"Project End - Project Completed and Financial Closeout","p":"2027-12-31","c":null},{"n":"Phase A: MBR Workshop 2- KSM6","p":"2026-09-30","c":"2026-08-20"},{"n":"PAS X D System Installation","p":"2026-05-15","c":"2026-05-07"}]},"1060656":{"s":"2026-02-18","f":"2028-04-01","pf":"2028-07-28","m":[{"n":"Execution End -","p":"2028-04-01","c":null},{"n":"Project Start -","p":"2026-02-03","c":"2026-02-03"},{"n":"Project End -","p":"2028-07-28","c":null},{"n":"Execution Start -","p":"2026-02-23","c":"2026-02-18"}]},"1060657":{"s":"2026-02-18","f":"2026-12-30","pf":"2027-02-26","m":[{"n":"Project Start - Project Charter endorsed","p":"2025-12-01","c":"2025-12-01"},{"n":"Project End - Project Completed and Financial Closeout","p":"2027-02-26","c":null},{"n":"Depreciation Start (Asset Placed In Service - Form submitted) - Depreciation Start (Asset Placed In Service - Form submitted)","p":"2027-02-01","c":null},{"n":"Execution End - CQV execution completed","p":"2026-12-30","c":null},{"n":"Execution Start - Execution Start","p":"2026-01-30","c":"2026-02-18"}]},"1060746":{"s":"2025-08-04","f":"2028-06-30","pf":"2028-09-29","m":[{"n":"Execution Start - SoW signed, Detailed L2 Plan, Key Resources Onboarded, Risk & Issue Log created.","p":"2025-08-04","c":"2025-08-04"},{"n":"Project Start - Kick-Off","p":"2025-08-04","c":"2025-08-04"},{"n":"Execution End - HyperCare Closed","p":"2028-06-30","c":null},{"n":"Project End - Track End User Adoption","p":"2028-09-29","c":null}]},"1060931":{"s":"2026-03-31","f":"2026-11-30","pf":"2027-03-31","m":[{"n":"Execution End - FY26 Scope Execution (Phase 1)\nExecution End - Work ends","p":"2026-11-30","c":null},{"n":"Execution Start -  FY25 Scope Execution\nPatching Plan for GxP Assets","p":"2026-03-31","c":"2026-03-31"},{"n":"Project End - \nProject End - Project Completion","p":"2027-03-31","c":null},{"n":"FY26 Scope Execution (Phase 2)","p":"2027-03-31","c":null}]},"1060981":{"s":"2026-09-02","f":"2026-10-19","pf":"2026-12-24","m":[{"n":"Project Start - Wave 1  Project Proposal endorsed","p":"2026-01-07","c":"2026-01-07"},{"n":"Train the trainer","p":"2026-09-18","c":null},{"n":"Execution End - Wave 1  Go-Live","p":"2026-10-19","c":null},{"n":"Execution Start - Wave 1  Plan Phase gate approval (Project Charter)","p":"2026-09-02","c":"2026-09-02"},{"n":"Project End - Wave 1  Project Completed","p":"2026-12-24","c":null}]},"1061116":{"s":"2026-03-05","f":"2026-03-24","pf":"2026-04-30","m":[{"n":"Project Start - Project Charter endorsed","p":"2026-02-03","c":"2026-02-03"},{"n":"Execution Start - CAR Approved","p":"2026-03-05","c":"2026-03-05"},{"n":"Project End - Project Completed and Financial Closeout","p":"2026-04-30","c":"2026-04-21"},{"n":"Execution End - Purchase of hardware completed","p":"2026-03-31","c":"2026-03-24"}]},"1061126":{"s":"2026-02-28","f":"2026-04-14","pf":"2026-09-30","m":[{"n":"Project End - Vashi Phase 1 Go-Live (Pilot Boards) \u2013 Official start of using Fabriq in daily Tier meetings for Phase 1 departments. Monitor stability and adoption for 4\u20136 weeks.","p":"2026-05-18","c":"2026-05-14"},{"n":"Execution Start - Project Kick-off (Vashi Site) \u2013 Charter socialized with SLT, core team established, and global license obtained. Start of configuration.","p":"2026-02-11","c":"2026-02-28"},{"n":"Project Start - Fabriq project charter aligned with portfolio owner, identified scope for Vashi site & deployment framework initiated","p":"2026-01-31","c":"2026-01-31"},{"n":"Execution End - Training & Change Management Complete \u2013 All relevant Tier teams trained, trial runs of Tier meetings in Fabriq done; feedback incorporated. Phase 1 implementation  started","p":"2026-04-15","c":"2026-04-14"},{"n":"Tier 2 boards launch for all functions at site","p":"2026-04-30","c":"2026-05-01"},{"n":"Tier-3 board kick off and launch for daily performance dialogue","p":"2026-02-16","c":"2026-02-09"},{"n":"Tier 1 boards launch for all functions at site","p":"2026-09-30","c":null}]},"1061403":{"s":"2020-07-27","f":"2027-03-31","pf":"2027-04-30","m":[{"n":"Wave 2 - Utilities (25 Forms)","p":"2026-10-02","c":null},{"n":"Execution End - Ready to Implement","p":"2027-03-31","c":null},{"n":"Wave 1 - DS (15 Forms)","p":"2026-08-14","c":"2026-08-07"}]},"1061660":{"s":"2026-03-31","f":"2027-03-31","pf":"2027-03-31","m":[{"n":"Prepare site SOP aligning with the Global approach for vulnerability management","p":"2026-11-27","c":null},{"n":"Implement Global Patching tool-Ninja-one","p":"2027-03-31","c":null},{"n":"Execution Start - Assessment of the system for continue security patching and lifecycle upgrade","p":"2026-03-31","c":"2026-03-31"},{"n":"Create the roadmap for remediation for - Windows 10 upgrade","p":"2026-12-31","c":null},{"n":"Project End - Site governance model established and patching tool (Ninjaone) implemented","p":"2027-02-26","c":null},{"n":"Project Start - Site governance team to be established with roles and responsibility","p":"2025-11-28","c":"2025-11-28"},{"n":"Execution End - Site governance model established and effectiveness has been verified","p":"2027-03-31","c":null}]},"1061804":{"s":"2026-04-30","f":"2026-11-30","pf":"2026-11-30","m":[{"n":"Server cabinets updated","p":"2026-09-15","c":null},{"n":"Project Start - Project Porposal endorsed","p":"2026-04-01","c":"2026-04-01"},{"n":"Project End - Project Completed and Financial Closeout","p":"2026-09-30","c":null},{"n":"MFG Network hardware refresh completed","p":"2026-06-30","c":"2026-06-29"},{"n":"Depreciation Start (Asset Placed In Service - Form submitted) -","p":"2026-10-30","c":null},{"n":"Execution End - \nOFFICE Network hardware refresh completed","p":"2026-11-30","c":null},{"n":"Network cables work completed","p":"2026-09-30","c":null},{"n":"Execution Start - Funding Approved","p":"2026-04-30","c":"2026-04-30"}]},"1061825":{"s":"2026-06-02","f":"2026-10-31","pf":"2027-01-31","m":[{"n":"Definition of OPC Tag list for equipment","p":"2026-07-31","c":"2026-07-31"},{"n":"Project Start - Project Proposal presented and endorsed, NE PIC","p":"2026-06-02","c":"2026-06-02"},{"n":"Define Alarms list, Downtimes and Finalize Configuration File","p":"2026-08-31","c":null},{"n":"Project End - Finalize Training of All Users and Handover","p":"2027-01-31","c":null},{"n":"Design of the line and equipment in Supply Chain Wizard","p":"2026-07-31","c":"2026-07-31"},{"n":"Execution End - Implementation of the LPMS for LINE D","p":"2026-10-31","c":null},{"n":"Execution Start - Kick-off","p":"2026-06-02","c":"2026-06-02"}]},"1062998":{"s":"2026-07-01","f":"2027-02-26","pf":"2027-03-31","m":[{"n":"Execution Start - Identity the repetitive and High efforts task","p":"2026-08-31","c":"2026-07-01"},{"n":"Execution End - Implemented customized the identified AI solution","p":"2027-02-26","c":null},{"n":"Project Start - Project Charter approved","p":"2026-07-31","c":"2026-05-01"},{"n":"Project End - Roll out of three AI use cases effectively and efficiently","p":"2027-03-31","c":null},{"n":"MSME Vendor data extraction","p":"2026-07-31","c":"2026-07-02"}]},"1063085":{"s":"2026-06-01","f":"2027-02-28","pf":"2027-03-31","m":[{"n":"Execution End - All prioritized paper forms/logbooks digitized in Opstrakker and stabilized (hypercare closed; only function support remains)","p":"2027-02-28","c":null},{"n":"Project Start - Project charter approved and kickoff completed (scope, roles, governance, and success criteria agreed)","p":"2026-07-15","c":"2026-05-01"},{"n":"2 eForms of KSM","p":"2026-08-31","c":"2026-08-31"},{"n":"1 eLogbook of Utility","p":"2026-09-30","c":null},{"n":"Project End - Day-to-day management of Opstrakker eForms is fully transitioned to functional SMEs, with clear ownership and documented procedures to create, update, and retire eForms under controlled lifecycle management. Training and a defined support pathway are in place to handle troubleshooting, access enablement, and continuous improvements.","p":"2027-03-31","c":null},{"n":"5 eForms EHS","p":"2026-09-30","c":null},{"n":"Execution Start -  Remaining paper form/logbook finalized and rollout waves/priorities confirmed. Training and access to groups given to appropriate owners of functions.","p":"2026-07-31","c":"2026-06-01"}]},"1063647":{"s":"2026-09-04","f":"2026-11-13","pf":"2027-01-22","m":[{"n":"Phase 4 - MVP Build","p":"2026-11-20","c":null},{"n":"Project End - Close out","p":"2027-01-22","c":null},{"n":"Phase 3 - MVP Funding Approval","p":"2026-09-25","c":null},{"n":"Depreciation Start (Asset Placed In Service - Form submitted)","p":"2027-01-22","c":null},{"n":"Budget Approved","p":"2026-09-18","c":null},{"n":"Execution Start - Phase 1 - MVP Scope","p":"2026-09-04","c":null},{"n":"Execution End - Execution End","p":"2026-11-13","c":null},{"n":"Phase 2 - Experience Design","p":"2026-09-18","c":null}]}};
const spotPortfolioUrl = 'https://tospot.azurewebsites.net/portfolio-center';
const spotBudgetProjects: SpotBudgetRow[] = [{"spot": "1059544", "site": "THO", "roadmapId": "DDTTO-21", "initiative": "Paperless Operations", "title": " DS Adynovate Forms Paperless Transformation: From Assessment to Digital Execution", "state": "Active", "phase": "Plan", "budgetId": "THO25-031", "owner": "Site-Thousand Oaks", "currency": "USD", "localCapex": 0, "localOpex": null, "totalCapex": 0, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1043819", "site": "THO", "roadmapId": "DDTTO-17", "initiative": "MES", "title": "MES - Thousand Oaks - Adynovate DS", "state": "Active", "phase": "Initiate", "budgetId": "DDTDMF23-010", "owner": "Site-Thousand Oaks", "currency": "USD", "localCapex": 1505000, "localOpex": null, "totalCapex": 1505000, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1056219", "site": "THO", "roadmapId": "DDTTO-7", "initiative": "Paperless Operations", "title": "OpsTrakker eForms for Thousand Oaks Elaprase Suite", "state": "Active", "phase": "Close", "budgetId": null, "owner": "Site-Thousand Oaks", "currency": "USD", "localCapex": 0, "localOpex": null, "totalCapex": 0, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1059685", "site": "THO", "roadmapId": "DDTTO-8", "initiative": "OT Cybersecurity Remediation", "title": "Thousand Oaks OT Cybersecurity Remediation Program Vulnerability Management", "state": "Active", "phase": "Execute", "budgetId": null, "owner": "Site-Thousand Oaks", "currency": "USD", "localCapex": 0, "localOpex": null, "totalCapex": 0, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1056412", "site": "THO", "roadmapId": "DDTTO-25", "initiative": "CIM - Project Phoenix", "title": "Project Phoenix Thousand Oaks", "state": "Active", "phase": "Execute", "budgetId": "THO25-016", "owner": "Site-Thousand Oaks", "currency": "USD", "localCapex": 1, "localOpex": 49990, "totalCapex": 1, "totalOpex": 49990, "approvedCapex": 482967, "approvedOpex": 0, "excludeFromSiteRollup": false}, {"spot": "1051022", "site": "THO", "roadmapId": "DDTTO-22", "initiative": "Paperless Operations", "title": "DP Forms Paperless Transformation: From Assessment to Digital Execution", "state": "Active", "phase": "Define", "budgetId": "THO25-030", "owner": "Site-Thousand Oaks", "currency": "USD", "localCapex": 103200, "localOpex": null, "totalCapex": 103200, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1024096", "site": "THO", "roadmapId": "DDTTO-3", "initiative": "MES", "title": "MES - Thousand Oaks - Elaprase", "state": "Active", "phase": "Execute", "budgetId": "THO20-002IT", "owner": "Site-Thousand Oaks", "currency": "USD", "localCapex": 0, "localOpex": null, "totalCapex": 0, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1059670", "site": "THO", "roadmapId": "DDTTO-42", "initiative": "Fabriq", "title": "Improve standardization and AOS Maturity across biologics sites leveraging Fabriq - Thousand Oaks Deployment", "state": "Completed", "phase": "Close", "budgetId": null, "owner": "Site-Thousand Oaks", "currency": "USD", "localCapex": 0, "localOpex": null, "totalCapex": 0, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1056618", "site": "THO", "roadmapId": "DDTTO-24", "initiative": "Paperless Operations", "title": "OpsTrakker Global Engineering Forms", "state": "Active", "phase": "Define", "budgetId": null, "owner": "Site-Thousand Oaks", "currency": "EUR", "localCapex": 0, "localOpex": null, "totalCapex": 0, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1061403", "site": "THO", "roadmapId": "DDTTO-23", "initiative": "Paperless Operations", "title": "Digitize RTO forms in Opstrakker", "state": "Active", "phase": "Execute", "budgetId": null, "owner": "Site-Thousand Oaks", "currency": "USD", "localCapex": 0, "localOpex": null, "totalCapex": 0, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1043658", "site": "THO", "roadmapId": "DDTTO-4", "initiative": "Paperless Operations", "title": "TO Program: Digitalize Forms in OpsTrakker", "state": "Active", "phase": "Execute", "budgetId": "THO23-027", "owner": "Site-Thousand Oaks", "currency": "USD", "localCapex": 0, "localOpex": 15080, "totalCapex": 0, "totalOpex": 15080, "approvedCapex": 78979, "approvedOpex": 0, "excludeFromSiteRollup": false}, {"spot": "1047430", "site": "GRA", "roadmapId": "DDTGC-14", "initiative": "Lab of the Future", "title": "TILGC LIMS Labware V8 Deployment", "state": "Completed", "phase": "Close", "budgetId": "GRC23-083", "owner": "Site-Grange Castle", "currency": "EUR", "localCapex": 197357, "localOpex": null, "totalCapex": 216238, "totalOpex": null, "approvedCapex": 221325, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1052454", "site": "GRA", "roadmapId": "DDTGC-15", "initiative": "MES", "title": "MES - TILGC - MBR Migration from 3.1 to 3.3", "state": "Active", "phase": "Execute", "budgetId": "DDTDMF24-044", "owner": "Site-Grange Castle", "currency": "EUR", "localCapex": 474276, "localOpex": 8496, "totalCapex": 519648, "totalOpex": 9309, "approvedCapex": 969034, "approvedOpex": 21913, "excludeFromSiteRollup": false}, {"spot": "1056869", "site": "GRA", "roadmapId": "DDTGC-10", "initiative": "Lab of the Future", "title": "Upgrade of the Hanwell Monitoring system", "state": "Active", "phase": "Execute", "budgetId": "GRC25-016", "owner": "Site-Grange Castle", "currency": "EUR", "localCapex": 57982, "localOpex": null, "totalCapex": 63529, "totalOpex": null, "approvedCapex": 63530, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1061116", "site": "GRA", "roadmapId": "DDTGC-11", "initiative": "NYMI", "title": " TILGC Nymi Biometric introduction", "state": "Completed", "phase": "Close", "budgetId": "GRC25-077", "owner": "Site-Grange Castle", "currency": "EUR", "localCapex": 24967, "localOpex": 18602, "totalCapex": 27356, "totalOpex": 20382, "approvedCapex": 58070, "approvedOpex": 0, "excludeFromSiteRollup": false}, {"spot": "1060981", "site": "NEU", "roadmapId": "NEUCHDDT-283", "initiative": "Veeva eQMS", "title": "Veeva QMS Implementation at Neuchatel - Wave 1", "state": "Active", "phase": "Execute", "budgetId": null, "owner": "Site-Neuchatel", "currency": "CHF", "localCapex": 0, "localOpex": null, "totalCapex": 0, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1038732", "site": "NEU", "roadmapId": "NEUCHDDT-327", "initiative": "NYMI", "title": "Neuchatel Digital Innovation - Nymi implementation for MES/PCS", "state": "Active", "phase": "Execute", "budgetId": "NEU22-028", "owner": "Site-Neuchatel", "currency": "EUR", "localCapex": 259197, "localOpex": null, "totalCapex": 283993, "totalOpex": null, "approvedCapex": 328700, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1052353", "site": "NEU", "roadmapId": "NEUCHDDT-34", "initiative": "Bio3", "title": "BIO3 - Neuchatel SAP Deployment", "state": "Completed", "phase": "Track", "budgetId": null, "owner": "Site-Neuchatel", "currency": "EUR", "localCapex": 0, "localOpex": null, "totalCapex": 0, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1051403", "site": "NEU", "roadmapId": "NEUCHDDT-300", "initiative": "RTMS", "title": "Emerson RTMS-Neuchatel implementation Advate BDS line Phase2-Integrations", "state": "Hold", "phase": "Initiate", "budgetId": null, "owner": "Site-Neuchatel", "currency": "EUR", "localCapex": 0, "localOpex": null, "totalCapex": 0, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1033322", "site": "NEU", "roadmapId": "NEUCHDDT-325", "initiative": "MES", "title": "MES - Neuchatel - Lines A/B phase 2", "state": "Active", "phase": "Initiate", "budgetId": "DDTNEU20-040", "owner": "Site-Neuchatel", "currency": "EUR", "localCapex": 2980600, "localOpex": null, "totalCapex": 3265742, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1051867", "site": "NEU", "roadmapId": "NEUCHDDT-15", "initiative": "LPMS", "title": "NE - Digital Program for NFA", "state": "Active", "phase": "Execute", "budgetId": null, "owner": "Site-Neuchatel", "currency": "EUR", "localCapex": 0, "localOpex": null, "totalCapex": 0, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1056725", "site": "NEU", "roadmapId": "NEUCHDDT-163", "initiative": "Fabriq", "title": "Improve standardization and AOS Maturity across biologics sites leveraging Fabriq - Neuchatel", "state": "Active", "phase": "Execute", "budgetId": null, "owner": "Site-Neuchatel", "currency": "EUR", "localCapex": 0, "localOpex": null, "totalCapex": 0, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1061825", "site": "NEU", "roadmapId": "NEUCHDDT-62", "initiative": "LPMS", "title": "Neuchatel Implementation of LPMS for Line D", "state": "Active", "phase": "Plan", "budgetId": null, "owner": "Site-Neuchatel", "currency": "EUR", "localCapex": 0, "localOpex": null, "totalCapex": 0, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1061804", "site": "NEU", "roadmapId": "NEUCHDDT-330", "initiative": "CIM - Project Phoenix", "title": "Neuchatel Phoenix Project - Network Refresh", "state": "Active", "phase": "Define", "budgetId": "NEU25-051", "owner": "Site-Neuchatel", "currency": "EUR", "localCapex": 0, "localOpex": null, "totalCapex": 0, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1054339", "site": "NEU", "roadmapId": "NEUCHDDT-329", "initiative": "APMS", "title": "Asset Performance Management System (APMS) - Neuchatel Deployment", "state": "Active", "phase": "Execute", "budgetId": "NEU25-012", "owner": "Site-Neuchatel", "currency": "EUR", "localCapex": 0, "localOpex": null, "totalCapex": 0, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1052966", "site": "NEU", "roadmapId": "NEUCHDDT-12", "initiative": "Paperless Operations", "title": "Paperless Transformation - OpsTrakker Neuchatel - Pilot", "state": "Completed", "phase": "Close", "budgetId": null, "owner": "Site-Neuchatel", "currency": "EUR", "localCapex": 0, "localOpex": null, "totalCapex": 0, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1060657", "site": "SNG", "roadmapId": "DDTSNG-6", "initiative": "OT Cybersecurity Remediation", "title": "DESIN- OT - Cybersecurity remediation Project Singen", "state": "Active", "phase": "Execute", "budgetId": "SIN25-042", "owner": "Site-Singen", "currency": "EUR", "localCapex": 100000, "localOpex": null, "totalCapex": 109567, "totalOpex": null, "approvedCapex": 49305, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1060656", "site": "SNG", "roadmapId": "DDTSNG-7", "initiative": "Takami", "title": "Takami Programm Singen", "state": "Active", "phase": "Execute", "budgetId": null, "owner": "Site-Singen", "currency": "EUR", "localCapex": 0, "localOpex": 2900000, "totalCapex": 0, "totalOpex": 3177431, "approvedCapex": 0, "approvedOpex": 0, "excludeFromSiteRollup": false}, {"spot": "1046793", "site": "SNG", "roadmapId": "DDTSNG-5", "initiative": "Lab of the Future", "title": "Global Chromeleon (CDS) - Implementierung am Standort Singen", "state": "Active", "phase": "Execute", "budgetId": "TAS26-001", "owner": "Site-Singen", "currency": "EUR", "localCapex": 123000, "localOpex": null, "totalCapex": 134767, "totalOpex": null, "approvedCapex": 131480, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1029630", "site": "SNG", "roadmapId": "DDTSNG-4", "initiative": "Paperless Operations", "title": "KNEAT Electronic Validation Singen", "state": "Active", "phase": "Execute", "budgetId": "SIN23-014", "owner": "Site-Singen", "currency": "EUR", "localCapex": 245820, "localOpex": null, "totalCapex": 269337, "totalOpex": null, "approvedCapex": 422072, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1056471", "site": "VAS", "roadmapId": "DDTVAS-7", "initiative": "Paperless Operations", "title": "Digital User management", "state": "Active", "phase": "Execute", "budgetId": null, "owner": "Site-Vashi", "currency": "INR", "localCapex": 0, "localOpex": null, "totalCapex": 0, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1062998", "site": "VAS", "roadmapId": "DDTVAS-12", "initiative": "AI Strategy & Agentic AI", "title": "Vashi-AI use case identification and deployment", "state": "Active", "phase": "Execute", "budgetId": null, "owner": "Site-Vashi", "currency": "INR", "localCapex": 0, "localOpex": null, "totalCapex": 0, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1056796", "site": "VAS", "roadmapId": "DDTVAS-5", "initiative": "SAIL", "title": "SAIL Quick connect implementation with platform", "state": "Active", "phase": "Execute", "budgetId": "VAS25-030", "owner": "Site-Vashi", "currency": "INR", "localCapex": 18017780, "localOpex": null, "totalCapex": 210943, "totalOpex": null, "approvedCapex": 230247, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1061660", "site": "VAS", "roadmapId": "DDTVAS-10", "initiative": "OT Cybersecurity Remediation", "title": "Vashi - Cybersecurity Remediation Program", "state": "Active", "phase": "Execute", "budgetId": null, "owner": "Site-Vashi", "currency": "INR", "localCapex": 0, "localOpex": null, "totalCapex": 0, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1063085", "site": "VAS", "roadmapId": "DDTVAS-13", "initiative": "Paperless Operations", "title": "Vashi - Opstrakker (Phase-3)", "state": "Active", "phase": "Execute", "budgetId": null, "owner": "Site-Vashi", "currency": "INR", "localCapex": 0, "localOpex": null, "totalCapex": 0, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1060591", "site": "VAS", "roadmapId": "DDTVAS-2", "initiative": "MES", "title": "Project Light MES- Vashi", "state": "Active", "phase": "Execute", "budgetId": "VAS25-051", "owner": "Site-Vashi", "currency": "INR", "localCapex": 106746944, "localOpex": 5656956, "totalCapex": 1249737, "totalOpex": 66229, "approvedCapex": 1204588, "approvedOpex": 130208, "excludeFromSiteRollup": false}, {"spot": "1061126", "site": "VAS", "roadmapId": "DDTVAS-3", "initiative": "Fabriq", "title": "Fabriq Deployment at Vashi Site ", "state": "Active", "phase": "Execute", "budgetId": null, "owner": "Site-Vashi", "currency": "INR", "localCapex": 0, "localOpex": null, "totalCapex": 0, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1058613", "site": "BRY", "roadmapId": "DDTBRY-15", "initiative": "CIM - Project Phoenix", "title": "Project Phoenix (network refresh) for Bray", "state": "Active", "phase": "Execute", "budgetId": "BRA25-013", "owner": "Site-Bray", "currency": "EUR", "localCapex": 107889, "localOpex": null, "totalCapex": 118211, "totalOpex": null, "approvedCapex": 227476, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1024124", "site": "BRY", "roadmapId": "DDTBRY-22", "initiative": "SAIL", "title": "Automation Strategy - SAIL Bray", "state": "Active", "phase": "Execute", "budgetId": "GE21-BRA003", "owner": "Site-Bray", "currency": "EUR", "localCapex": 0, "localOpex": null, "totalCapex": 0, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1060535", "site": "BRY", "roadmapId": "DDTBRY-38", "initiative": "Veeva eQMS", "title": "Veeva eQMS Phase 1 deployment at TIL Bray", "state": "Active", "phase": "Initiate", "budgetId": null, "owner": "Site-Bray", "currency": "EUR", "localCapex": 0, "localOpex": null, "totalCapex": 0, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1056836", "site": "TJN", "roadmapId": "DDTTJ-1", "initiative": "Paperless Operations", "title": "Value Creation of SAP Pi-sheet based weighing solution for Weighing room 3#", "state": "Completed", "phase": "Close", "budgetId": null, "owner": "Site-Tianjin", "currency": "CNY", "localCapex": 0, "localOpex": null, "totalCapex": 0, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1058352", "site": "TJN", "roadmapId": "DDTTJ-2", "initiative": "OTE", "title": "UPI Systech implementation in Tianjin", "state": "Active", "phase": "Execute", "budgetId": "TIA25-014", "owner": "Site-Tianjin", "currency": "CNY", "localCapex": 13481450, "localOpex": 22514, "totalCapex": 1873275, "totalOpex": 3128, "approvedCapex": 1855634, "approvedOpex": 168132, "excludeFromSiteRollup": false}, {"spot": "1051059", "site": "BRY", "roadmapId": "DDTBRY-3", "initiative": "Paperless Operations", "title": "Paperless Transformation in Bray (TILB)", "state": "Completed", "phase": "Close", "budgetId": null, "owner": "Global-DD&T PDT & GSQ", "currency": "EUR", "localCapex": 0, "localOpex": null, "totalCapex": 0, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1051357", "site": "THO", "roadmapId": "DDTTO-54", "initiative": "APMS", "title": "EAM- Advanced Performance Management System (APMS)- Thousand Oaks Rollout", "state": "Active", "phase": "Execute", "budgetId": "DDTDMF24-008", "owner": "Global-DD&T PDT & GSQ", "currency": "USD", "localCapex": 273470, "localOpex": 147289, "totalCapex": 273470, "totalOpex": 147289, "approvedCapex": 273470, "approvedOpex": 80500, "excludeFromSiteRollup": false}, {"spot": "1063647", "site": "GML", "roadmapId": null, "initiative": null, "title": "GSQ DD&T Executive Platform TEST (MVP)", "state": "Active", "phase": "Plan", "budgetId": "DDTGML26-004", "owner": "Global-DD&T PDT & GSQ", "currency": "USD", "localCapex": 168000, "localOpex": null, "totalCapex": 168000, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": true}, {"spot": "1046417", "site": "GRA", "roadmapId": "DDTGC-5", "initiative": "Paperless Operations", "title": "TILGC Paperless Transformation Technology Enablement", "state": "Completed", "phase": "Execute", "budgetId": "DDTSMA23-007", "owner": "Global-DD&T PDT & GSQ", "currency": "EUR", "localCapex": 220968, "localOpex": null, "totalCapex": 242107, "totalOpex": null, "approvedCapex": 230622, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1051746", "site": "OSA", "roadmapId": "DDTMBO-19", "initiative": "APMS", "title": "EAM- Advanced Performance Management System (APMS)-MassBio Rollout", "state": "Active", "phase": "Execute", "budgetId": "DDTDMF24-012", "owner": "Global-DD&T PDT & GSQ", "currency": "USD", "localCapex": 280746, "localOpex": 51645, "totalCapex": 280746, "totalOpex": 51645, "approvedCapex": 283800, "approvedOpex": 80500, "excludeFromSiteRollup": false}, {"spot": "1039601", "site": "GRA", "roadmapId": "DDTGC-22", "initiative": "CIM - Project Phoenix", "title": "DD&T/CIM/Hosting <Grange Castle> Critical Infrastructure Invest", "state": "Active", "phase": "Execute", "budgetId": "DDTDMF22-072", "owner": "Global-DD&T PDT & GSQ", "currency": "EUR", "localCapex": 0, "localOpex": null, "totalCapex": 0, "totalOpex": null, "approvedCapex": 1906459, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1060062", "site": "BRY", "roadmapId": "DDTBRY-13", "initiative": "Acronis", "title": "DD&T/CIM/Shopfloor<global>Acronis Wave 1 FY26- supporting Acronis deployment", "state": "Canceled", "phase": "Initiate", "budgetId": "DDTDMF25-044", "owner": "Global-DD&T PDT & GSQ", "currency": "EUR", "localCapex": 0, "localOpex": null, "totalCapex": 0, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1059865", "site": "GRA", "roadmapId": "DDTGC-6", "initiative": "Paperless Operations", "title": "TILGC Paper Transformation Program", "state": "Completed", "phase": "Close", "budgetId": "DDTSMA25-010", "owner": "Global-DD&T PDT & GSQ", "currency": "EUR", "localCapex": 213850, "localOpex": null, "totalCapex": 234308, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1053702", "site": "BRY", "roadmapId": "DDTBRY-12", "initiative": "Lab of the Future", "title": "TILB - Smart QC", "state": "Active", "phase": "Initiate", "budgetId": "DDTQUA24-015", "owner": "Global-DD&T PDT & GSQ", "currency": "EUR", "localCapex": 0, "localOpex": null, "totalCapex": 0, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1050194", "site": "OSA", "roadmapId": "DDTMBO-21", "initiative": "MES", "title": "DDT - MES - MBO - 400SW Upstream Ops (Site Budget)", "state": "Active", "phase": "Execute", "budgetId": "MBO24-006", "owner": "Site-MA Bio Ops", "currency": "USD", "localCapex": 1463345, "localOpex": 0, "totalCapex": 1463345, "totalOpex": 0, "approvedCapex": 1875093, "approvedOpex": 16031, "excludeFromSiteRollup": false}, {"spot": "1060746", "site": "OSA", "roadmapId": "DDTMBO-8", "initiative": "Takami", "title": "MBO - DD&T - Project Takami", "state": "Active", "phase": "Initiate", "budgetId": null, "owner": "Site-MA Bio Ops", "currency": "USD", "localCapex": 0, "localOpex": null, "totalCapex": 0, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1060404", "site": "OSA", "roadmapId": "DDTMBO-7", "initiative": "Veeva eQMS", "title": "MA Bio Ops Veeva QMS Integration", "state": "Active", "phase": "Define", "budgetId": null, "owner": "Site-MA Bio Ops", "currency": "USD", "localCapex": 0, "localOpex": null, "totalCapex": 0, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1059644", "site": "OSA", "roadmapId": "DDTMBO-12", "initiative": "Data Quality & AI for Data", "title": "Data Quality Program", "state": "Active", "phase": "Plan", "budgetId": null, "owner": "Global-Supply Chain", "currency": "USD", "localCapex": 0, "localOpex": null, "totalCapex": 0, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1059672", "site": "OSA", "roadmapId": "DDTMBO-6", "initiative": "Fabriq", "title": "Improve standardization and AOS Maturity across biologics sites leveraging Fabriq - MA Bio Operations Deployment", "state": "Active", "phase": "Execute", "budgetId": null, "owner": "Site-MA Bio Ops", "currency": "USD", "localCapex": 0, "localOpex": null, "totalCapex": 0, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1052852", "site": "OSA", "roadmapId": "DDTMBO-10", "initiative": "MES", "title": "MES - MBO - 400SW Downstream Ops (Site Budget)", "state": "Active", "phase": "Plan", "budgetId": "MBO24-015", "owner": "Site-MA Bio Ops", "currency": "USD", "localCapex": 2625000, "localOpex": null, "totalCapex": 2625000, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1060931", "site": "OSA", "roadmapId": "DDTMBO-13", "initiative": "OT Cybersecurity Remediation", "title": " MBO - DD&T - OT Cybersecurity Remediation Program", "state": "Active", "phase": "Execute", "budgetId": null, "owner": "Site-MA Bio Ops", "currency": "USD", "localCapex": 0, "localOpex": null, "totalCapex": 0, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}, {"spot": "1052674", "site": "OSA", "roadmapId": "DDTMBO-23", "initiative": "Paperless Operations", "title": "MBO - DDT - Paperless Transformation - OpsTrakker eForms and eLogbooks", "state": "Canceled", "phase": "Execute", "budgetId": null, "owner": "Site-MA Bio Ops", "currency": "USD", "localCapex": 0, "localOpex": null, "totalCapex": 0, "totalOpex": null, "approvedCapex": 0, "approvedOpex": null, "excludeFromSiteRollup": false}];
const roadmapWithoutSpot: RoadmapGap[] = [{"site": "BRP", "roadmapId": "DDTBP-35", "initiative": "MES", "title": "BP MES Integration"}, {"site": "BRP", "roadmapId": "DDTBP-68", "initiative": "MES", "title": "BP MES Train 2 Adcetris cAC10 Intermediate"}, {"site": "BRP", "roadmapId": "DDTBP-7", "initiative": "MES", "title": "BP MES Platform Upgrade"}, {"site": "BRP", "roadmapId": "DDTBP-76", "initiative": "MES", "title": "BP MES TAK226"}, {"site": "BRY", "roadmapId": "DDTBRY-18", "initiative": "MES", "title": "🏭IE BRAY EBR Development"}, {"site": "LIN", "roadmapId": "DDTLNZ-20", "initiative": "MES", "title": "Implementation of weighing operations in PAS-X"}, {"site": "LIN", "roadmapId": "DDTLNZ-21", "initiative": "MES", "title": "eLogbook integration in production departments using PAS-X"}, {"site": "LIN", "roadmapId": "DDTLNZ-23", "initiative": "MES", "title": "MES PAS-X upgrade (TT2.1 - TT2.4)"}, {"site": "LIN", "roadmapId": "DDTLNZ-26", "initiative": "MES", "title": "MES Sterile TAK-299 MBR development"}, {"site": "LIN", "roadmapId": "DDTLNZ-41", "initiative": "MES", "title": "MES SAP interface optimization"}, {"site": "SGP", "roadmapId": "DDTSG-10", "initiative": "MES", "title": "MES PAS-X Suite II [Adzymna]"}, {"site": "TJN", "roadmapId": "DDTTJ-16", "initiative": "MES", "title": "Light MES"}, {"site": "NEU", "roadmapId": "NEUCHDDT-8", "initiative": "MES", "title": "NE MES PASX"}, {"site": "BRP", "roadmapId": "DDTBP-13", "initiative": "Takami", "title": "BP Takami SAP S4 Hana"}, {"site": "BRP", "roadmapId": "DDTBP-3", "initiative": "Takami", "title": "BP Replenishment Inventory Management"}, {"site": "BRY", "roadmapId": "DDTBRY-20", "initiative": "Takami", "title": "🌍IE BRAY Takami Rollout"}, {"site": "NAU", "roadmapId": "DDTNAU-9", "initiative": "Takami", "title": "TAKAMI Implementation"}, {"site": "ORA", "roadmapId": "DDTORA-6", "initiative": "Takami", "title": "Global - Takami"}, {"site": "SGP", "roadmapId": "DDTSG-7", "initiative": "Takami", "title": "Takami - SAP S4/HANA"}, {"site": "TJN", "roadmapId": "DDTTJ-15", "initiative": "Takami", "title": "Takami Tianjin"}, {"site": "THO", "roadmapId": "DDTTO-58", "initiative": "Takami", "title": "TO Takami"}, {"site": "VAS", "roadmapId": "DDTVAS-14", "initiative": "Takami", "title": "Vashi-Takami"}, {"site": "BRP", "roadmapId": "DDTBP-74", "initiative": "Fabriq", "title": "BP Improve standardization and AOS Maturity across biologics sites leveraging Fabriq"}, {"site": "TJN", "roadmapId": "DDTTJ-21", "initiative": "Fabriq", "title": "Fabriq implementation in Tianjin"}, {"site": "BRP", "roadmapId": "DDTBP-40", "initiative": "NYMI", "title": "BP Nymi Band & Powerhouse Upgrade"}, {"site": "LIN", "roadmapId": "DDTLNZ-22", "initiative": "NYMI", "title": "Nymi Integration"}, {"site": "OSA", "roadmapId": "DDTMBO-40", "initiative": "NYMI", "title": "NYMI Band v4 Readiness"}, {"site": "SGP", "roadmapId": "DDTSG-1", "initiative": "NYMI", "title": "Nymi Band Implementation for Singapore"}, {"site": "BRP", "roadmapId": "DDTBP-27", "initiative": "SAIL", "title": "BP SAIL Implementation"}, {"site": "SNG", "roadmapId": "DDTSNG-17", "initiative": "SAIL", "title": "SIN - SAIL-Programm"}, {"site": "TJN", "roadmapId": "DDTTJ-14", "initiative": "SAIL", "title": "SAIL QuickConnect in tianjin"}, {"site": "TJN", "roadmapId": "DDTTJ-28", "initiative": "SAIL", "title": "SAIL Data Collection(EMS)"}, {"site": "THO", "roadmapId": "DDTTO-53", "initiative": "SAIL", "title": "TO SAIL - Elaprase"}, {"site": "THO", "roadmapId": "DDTTO-55", "initiative": "SAIL", "title": "TO SAIL - Adynovate"}, {"site": "THO", "roadmapId": "DDTTO-56", "initiative": "SAIL", "title": "TO SAIL - Fill Line 2"}, {"site": "THO", "roadmapId": "DDTTO-57", "initiative": "SAIL", "title": "TO SAIL - FDP"}, {"site": "NEU", "roadmapId": "NEUCHDDT-321", "initiative": "SAIL", "title": "NE SAIL - Advate (Line A/B)"}, {"site": "NEU", "roadmapId": "NEUCHDDT-322", "initiative": "SAIL", "title": "NE SAIL - Vonvendi (Line C)"}, {"site": "NEU", "roadmapId": "NEUCHDDT-323", "initiative": "SAIL", "title": "NE SAIL - NFA (Line D)"}, {"site": "BRP", "roadmapId": "DDTBP-9", "initiative": "OT Cybersecurity Remediation", "title": "BP Cybersecurity Remediation"}, {"site": "LIN", "roadmapId": "DDTLNZ-19", "initiative": "OT Cybersecurity Remediation", "title": "OT Vulnerability Remediation LNZ"}, {"site": "SGP", "roadmapId": "DDTSG-129", "initiative": "OT Cybersecurity Remediation", "title": "OT cybersecurity remediation"}, {"site": "TJN", "roadmapId": "DDTTJ-10", "initiative": "OT Cybersecurity Remediation", "title": "Vulnerabilities"}, {"site": "LIN", "roadmapId": "DDTLNZ-39", "initiative": "Data Quality & AI for Data", "title": "DataQuality - global DQ program roll-out"}, {"site": "NAU", "roadmapId": "DDTNAU-5", "initiative": "Data Quality & AI for Data", "title": "Tier 5 - Data Quality"}, {"site": "TJN", "roadmapId": "DDTTJ-25", "initiative": "AI Strategy & Agentic AI", "title": "Tianjin AI Initiatives"}, {"site": "BRP", "roadmapId": "DDTBP-29", "initiative": "CIM - Project Phoenix", "title": "BP Project Phoenix"}, {"site": "OSA", "roadmapId": "DDTMBO-41", "initiative": "CIM - Project Phoenix", "title": "MBO CIM - Project Phoenix"}, {"site": "SGP", "roadmapId": "DDTSG-55", "initiative": "CIM - Project Phoenix", "title": "Phoenix (Network Modernization)"}, {"site": "TJN", "roadmapId": "DDTTJ-4", "initiative": "CIM - Project Phoenix", "title": "CIM Modern hosting"}, {"site": "TJN", "roadmapId": "DDTTJ-7", "initiative": "CIM - Project Phoenix", "title": "Phoenix in tianjin"}, {"site": "BRP", "roadmapId": "DDTBP-80", "initiative": "Acronis", "title": "BP Acronis - SPOT - (TBD)"}, {"site": "OSA", "roadmapId": "DDTMBO-43", "initiative": "Acronis", "title": "MBO CIM - Acronis Rollout (CommVault Replacement)"}, {"site": "SGP", "roadmapId": "DDTSG-18", "initiative": "Acronis", "title": "Acronis Implementation — Singapore"}, {"site": "SGP", "roadmapId": "DDTSG-126", "initiative": "NinjaOne", "title": "NinjaOne Patching Tool Deployment"}, {"site": "TJN", "roadmapId": "DDTTJ-20", "initiative": "NinjaOne", "title": "NinjaOne in tianjin"}, {"site": "VAS", "roadmapId": "DDTVAS-11", "initiative": "NinjaOne", "title": "VAS - NinjaOne"}, {"site": "BRY", "roadmapId": "DDTBRY-9", "initiative": "OTE", "title": "IE BRAY Doors Upgrade"}, {"site": "ORA", "roadmapId": "DDTORA-3", "initiative": "OTE", "title": "SOB - AGV - Stage 3 - Packaging Supply"}, {"site": "TJN", "roadmapId": "DDTTJ-12", "initiative": "OTE", "title": "Cold Chain Warehouse BMS/EMS"}, {"site": "TJN", "roadmapId": "DDTTJ-6", "initiative": "OTE", "title": "Cold-Chain Warehouse IT infra"}, {"site": "TJN", "roadmapId": "DDTTJ-8", "initiative": "OTE", "title": "Cold-Chain timeframe tracking"}, {"site": "SGP", "roadmapId": "DDTSG-13", "initiative": "Veeva eQMS", "title": "Veeva eQMS"}, {"site": "TJN", "roadmapId": "DDTTJ-22", "initiative": "Veeva eQMS", "title": "eQMS in tianjin"}, {"site": "BRP", "roadmapId": "DDTBP-10", "initiative": "Paperless Operations", "title": "BP OpsTrakker FY2025"}, {"site": "BRP", "roadmapId": "DDTBP-4", "initiative": "Paperless Operations", "title": "BP Sapio Sciences ELN - MSL Implementation"}, {"site": "BRP", "roadmapId": "DDTBP-41", "initiative": "Paperless Operations", "title": "BP OpsTrakker FY26"}, {"site": "LIN", "roadmapId": "DDTLNZ-40", "initiative": "Paperless Operations", "title": "AppSpace Implementation"}, {"site": "SGP", "roadmapId": "DDTSG-2", "initiative": "Paperless Operations", "title": "OpsTrakker Singapore Paperless [Engineering]"}, {"site": "SNG", "roadmapId": "DDTSNG-14", "initiative": "Paperless Operations", "title": "SIN - E-logbuch with OPS_Tracker"}, {"site": "TJN", "roadmapId": "DDTTJ-18", "initiative": "Paperless Operations", "title": "Neptune maintenance paperless"}, {"site": "TJN", "roadmapId": "DDTTJ-9", "initiative": "Paperless Operations", "title": "Opstrakker FY26"}, {"site": "BRP", "roadmapId": "DDTBP-5", "initiative": "RTMS", "title": "BP RTMS Phase 2 Integrations"}, {"site": "OSA", "roadmapId": "DDTMBO-3", "initiative": "RTMS", "title": "400SW - IT - Migrate Mfg Scheduling from Infor AS to Emerson RTMS"}, {"site": "SGP", "roadmapId": "DDTSG-8", "initiative": "RTMS", "title": "RTMS"}];
const moneyIn = (value: number, currency = 'USD') => new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
const spotRowsFor = (siteCode: string) => spotBudgetProjects.filter((row: SpotBudgetRow) => !row.excludeFromSiteRollup && (isAllSites(siteCode) || row.site === siteCode));
const roadmapGapsFor = (siteCode: string) => roadmapWithoutSpot.filter((row: RoadmapGap) => isAllSites(siteCode) || row.site === siteCode);
const sumUsd = (rows: SpotBudgetRow[], field: 'totalCapex' | 'approvedCapex' | 'totalOpex') => rows.reduce((sum: number, row: SpotBudgetRow) => {
  const amount = field === 'totalOpex' ? row.totalOpex : row[field];
  return sum + (amount ?? 0);
}, 0);
const northStarPlatforms = ['MES', 'LIMS', 'SAP', 'Takami', 'SAIL', 'LPMS', 'APMS', 'RTMS', 'COMOS', 'Smart QC', 'LabX', 'Veeva eQMS', 'Discoverant', 'OptTracker', 'SIMCA Online'];
const platformMatches: Record<string, string[]> = {
  MES: ['DDTTO-12', 'DDTTO-14', 'DDTTO-21', 'DDTTO-80'],
  LIMS: ['DDTTO-31'],
  SAP: ['DDTTO-41'],
  Takami: ['DDTTO-58'],
  SAIL: ['DDTTO-08', 'DDTTO-80'],
  LPMS: ['DDTTO-63'],
  APMS: ['DDTTO-54'],
  RTMS: ['DDTTO-64'],
  'Smart QC': ['DDTTO-81'],
  LabX: ['DDTTO-32'],
  Discoverant: ['DDTTO-70'],
  'SIMCA Online': ['DDTTO-71'],
  COMOS: [],
  'Veeva eQMS': [],
  OptTracker: [],
};

function StatusGlyph({ status }: { status: string }) {
  if (status === 'At risk') return <AlertTriangle className="size-3" />;
  if (status === 'Planned') return <CircleDashed className="size-3" />;
  return <CheckCircle2 className="size-3" />;
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return <div className="border-b pb-2"><p className="text-[10px] font-bold uppercase">{label}</p><div className="mt-1 text-xs">{children}</div></div>;
}

function JiraKeyLink({ jiraKey }: { jiraKey: string }) {
  return <a href={jiraIssueUrl(jiraKey)} target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-2" onClick={(event: React.MouseEvent<HTMLAnchorElement>) => event.stopPropagation()}>{jiraKey}</a>;
}

function JiraText({ text }: { text: string }) {
  const parts = text.split(jiraKeyPattern);
  const keys = text.match(jiraKeyPattern) ?? [];
  return <>{parts.map((part: string, index: number) => <span key={`${part}-${index}`}>{part}{keys[index] ? <JiraKeyLink jiraKey={keys[index]} /> : null}</span>)}</>;
}

type OnePagerCard = {
  id: string;
  description: string;
  bigRock: keyof typeof OnePagerBigRockKeyToLabel;
  fiscalYear: keyof typeof OnePagerFiscalYearKeyToLabel;
  northStar: string;
  status: string;
  sequence: number;
  jira?: string;
  site: string;
  spot?: string;
};

const bigRockKeys = Object.keys(OnePagerBigRockKeyToLabel) as Array<keyof typeof OnePagerBigRockKeyToLabel>;
const fiscalYearKeys = Object.keys(OnePagerFiscalYearKeyToLabel) as Array<keyof typeof OnePagerFiscalYearKeyToLabel>;
type OnePagerRawRow = SharePointOnePager & {
  site?: string;
  bigRock?: string;
  bigRockKey?: string;
  fiscalYear?: string;
  fiscalYearKey?: string;
  status?: string;
};

const normalizeBigRock = (row: OnePagerRawRow): OnePagerCard['bigRock'] | undefined => {
  const raw = String(row.bigRock ?? row.bigRockKey ?? '');
  return bigRockKeys.find((key: OnePagerCard['bigRock']) => key === raw || OnePagerBigRockKeyToLabel[key] === raw);
};

const normalizeFiscalYear = (row: OnePagerRawRow): OnePagerCard['fiscalYear'] | undefined => {
  const raw = String(row.fiscalYear ?? row.fiscalYearKey ?? '');
  return fiscalYearKeys.find((key: OnePagerCard['fiscalYear']) => key === raw || OnePagerFiscalYearKeyToLabel[key] === raw);
};

const normalizeStatus = (row: OnePagerRawRow) => {
  const raw = String(row.statusKey ?? row.status ?? '');
  const key = Object.keys(OnePagerStatusKeyToLabel).find((statusKey: string) => statusKey === raw || OnePagerStatusKeyToLabel[statusKey as keyof typeof OnePagerStatusKeyToLabel] === raw);
  return key ? OnePagerStatusKeyToLabel[key as keyof typeof OnePagerStatusKeyToLabel] : raw;
};

const rowSiteCode = (row: OnePagerRawRow) => {
  const raw = String(row.siteKey ?? row.site ?? '');
  const label = OnePagerSiteKeyToLabel[raw as keyof typeof OnePagerSiteKeyToLabel] ?? raw;
  return label.slice(0, 3);
};

const rowMatchesSite = (row: OnePagerRawRow, siteCode: string) => {
  if (isAllSites(siteCode)) return true;
  const raw = String(row.siteKey ?? row.site ?? '');
  const label = OnePagerSiteKeyToLabel[raw as keyof typeof OnePagerSiteKeyToLabel] ?? raw;
  return label.slice(0, 3) === siteCode || raw.includes(siteCode);
};

function LiveStatusGlyph({ status }: { status: string }) {
  if (status === 'On Track') return <span aria-label="On Track" className="status-circle status-circle-on-track" />;
  if (status === 'At Risk') return <span aria-label="At Risk" className="status-circle status-circle-at-risk" />;
  if (status === 'Delayed') return <span aria-label="Delayed" className="status-circle status-circle-delayed" />;
  return <span aria-label={status} className="size-3 rounded-full border-2 border-foreground bg-background" />;
}

function OnePagerSidecar({ project, onClose }: { project: OnePagerCard; onClose: () => void }) {
  return <aside aria-label="Selected initiative" className="fixed right-4 top-28 z-30 max-h-[calc(100vh-8rem)] w-[360px] overflow-auto rounded-lg border bg-card p-4 text-card-foreground shadow-xl"><div className="mb-4 flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase">Selected initiative</p><h2 className="text-lg font-black">{project.description}</h2></div><div className="flex items-center gap-2"><Badge variant={project.status === 'Delayed' ? 'destructive' : 'secondary'}>{project.status}</Badge><Button type="button" variant="ghost" size="icon-sm" aria-label="Close selected initiative" onClick={onClose}><X /></Button></div></div><div className="space-y-3"><DetailRow label="FY">{OnePagerFiscalYearKeyToLabel[project.fiscalYear]}</DetailRow><DetailRow label="Description"><JiraText text={project.description} /></DetailRow><DetailRow label="North Star">{project.northStar}</DetailRow>{project.jira && <DetailRow label="Jira"><JiraKeyLink jiraKey={project.jira} /></DetailRow>}</div></aside>;
}

function OnePager({ filter, onClear, site }: { filter?: string; onClear: () => void; site: SiteOption }) {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const updateOnePager = useUpdateOnePager();
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const listOptions = useMemo(() => ({ orderBy: ['sequence asc'] }), []);
  const { data: rows = [], isLoading, isError } = useOnePagerList(listOptions);
  const siteProjects = useMemo(() => rows
    .filter((row: SharePointOnePager) => rowMatchesSite(row as OnePagerRawRow, site.code))
    .map((row: SharePointOnePager): OnePagerCard | undefined => {
      const rawRow = row as OnePagerRawRow;
      const bigRock = normalizeBigRock(rawRow);
      const fiscalYear = normalizeFiscalYear(rawRow);
      if (!bigRock || !fiscalYear) return undefined;
      return {
        id: String(row.id),
        description: row.description,
        bigRock,
        fiscalYear,
        northStar: OnePagerNorthStarKeyToLabel[row.northStarKey] ?? String(row.northStarKey ?? ''),
        status: normalizeStatus(rawRow),
        sequence: row.sequence ?? Number.MAX_SAFE_INTEGER,
        jira: row.jira?.trim() || undefined,
        site: rowSiteCode(rawRow),
        spot: row.sPOT?.trim() || undefined,
      };
    })
    .filter((project: OnePagerCard | undefined): project is OnePagerCard => project !== undefined)
    .sort((a: OnePagerCard, b: OnePagerCard) => a.sequence - b.sequence), [rows, site.code]);
  const visible = useMemo(() => siteProjects.filter((project: OnePagerCard) => (!filter || filter === 'All' || (filter === 'At Risk / Delayed' ? project.status === 'At Risk' || project.status === 'Delayed' : project.status === filter)) && project.description.toLowerCase().includes(search.toLowerCase())), [filter, search, siteProjects]);
  const selected = selectedId === null ? undefined : siteProjects.find((project: OnePagerCard) => project.id === selectedId);
  const projectsForCell = (rockKey: OnePagerCard['bigRock'], yearKey: OnePagerCard['fiscalYear']) => visible.filter((project: OnePagerCard) => project.bigRock === rockKey && project.fiscalYear === yearKey).sort((a: OnePagerCard, b: OnePagerCard) => a.sequence - b.sequence);
  const dropProject = async (event: React.DragEvent<HTMLDivElement>, destKey: OnePagerCard['bigRock'], destFy: OnePagerCard['fiscalYear'], destinationIndex: number) => {
    event.preventDefault();
    const rowId = event.dataTransfer.getData('text/onepager-id');
    const row = rows.find((item: SharePointOnePager) => String(item.id) === rowId);
    if (!row) return;

    const destinationRows = rows
      .filter((item: SharePointOnePager) => {
        const rawItem = item as OnePagerRawRow;
        return String(item.id) !== rowId && normalizeBigRock(rawItem) === destKey && normalizeFiscalYear(rawItem) === destFy && rowMatchesSite(rawItem, isAllSites(site.code) ? rowSiteCode(row as OnePagerRawRow) : site.code);
      })
      .sort((a: SharePointOnePager, b: SharePointOnePager) => (a.sequence ?? Number.MAX_SAFE_INTEGER) - (b.sequence ?? Number.MAX_SAFE_INTEGER));
    const destSeq = destinationIndex < destinationRows.length ? destinationIndex + 1 : destinationRows.length + 1;
    const queryKey = ['onePager-list', listOptions] as const;

    await queryClient.cancelQueries({ queryKey: ['onePager-list'] });
    const previousRows = queryClient.getQueryData<SharePointOnePager[]>(queryKey);
    queryClient.setQueryData<SharePointOnePager[]>(queryKey, (currentRows: SharePointOnePager[] | undefined) =>
      currentRows?.map((item: SharePointOnePager) => String(item.id) === rowId ? {
        ...item,
        bigRock: destKey,
        fiscalYear: destFy,
        bigRockKey: destKey,
        fiscalYearKey: destFy,
      } as SharePointOnePager : item),
    );

    try {
      await updateOnePager.mutateAsync({
        id: String(row.id),
        changedFields: { bigRockKey: destKey, fiscalYearKey: destFy },
      });
      await queryClient.invalidateQueries({ queryKey: ['onePager-list'] });
      toast.success(`Moved ${row.description}`);
    } catch (error: unknown) {
      queryClient.setQueryData(queryKey, previousRows);
      toast.error(error instanceof Error ? error.message : 'The project could not be moved. Please try again.');
    }
  };
  useEffect(() => { setSelectedId(null); setSelectedPlatform(null); }, [site.code]);
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setSelectedId(null); };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);
  return <div className="space-y-3"><div className="grid grid-cols-5 gap-2"><div className="relative"><Search className="absolute left-3 top-2.5 size-4" /><Input value={search} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)} placeholder="Search project" className="pl-9" /></div>{['All fiscal years','All platforms','All status','All capabilities'].map((label: string) => <Button key={label} variant="outline" className="justify-between" onClick={label === 'All platforms' ? () => setSelectedPlatform(null) : undefined}>{label}<ChevronDown /></Button>)}</div>{filter && <Button size="sm" variant="secondary" onClick={onClear}>Clear {filter} filter</Button>}{isLoading && <p className="rounded bg-muted p-3 text-muted-foreground">Loading OnePager from SharePoint…</p>}{isError && <p className="rounded bg-destructive p-3 text-destructive-foreground">OnePager is unavailable.</p>}<div className="grid grid-cols-[minmax(900px,1fr)_300px] gap-3 rounded-lg bg-card p-2 text-card-foreground shadow"><div className="overflow-auto rounded bg-muted p-2"><div className="grid min-w-[900px] grid-cols-6 gap-1.5">{bigRockKeys.map((rockKey: keyof typeof OnePagerBigRockKeyToLabel) => <div key={rockKey} className="flex min-h-16 items-center justify-center rounded bg-sidebar p-2 text-center text-[10px] font-black uppercase text-sidebar-foreground">{OnePagerBigRockKeyToLabel[rockKey]}</div>)}{fiscalYearKeys.map((yearKey: keyof typeof OnePagerFiscalYearKeyToLabel, yearIndex: number) => <div key={yearKey} className="contents"><div className={`col-span-6 rounded p-3 text-center text-xs font-black ${yearIndex === 0 ? 'bg-sidebar text-sidebar-foreground' : yearIndex === 1 ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'}`}>{yearLabels[yearIndex]}</div>{bigRockKeys.map((rockKey: keyof typeof OnePagerBigRockKeyToLabel) => { const cell = projectsForCell(rockKey, yearKey); return <div key={`${rockKey}-${yearKey}`} onDragOver={(event: React.DragEvent<HTMLDivElement>) => event.preventDefault()} onDrop={(event: React.DragEvent<HTMLDivElement>) => void dropProject(event, rockKey, yearKey, cell.length)} className="flex min-h-28 flex-col justify-center gap-1.5 rounded bg-background p-2">{cell.length ? cell.map((project: OnePagerCard, index: number) => { const highlighted = selectedId === project.id || selectedPlatform === project.northStar || (selectedPlatform === 'LIMS' && ['LIMS','Labware'].includes(project.northStar)); return <div key={project.id} onDragOver={(event: React.DragEvent<HTMLDivElement>) => event.preventDefault()} onDrop={(event: React.DragEvent<HTMLDivElement>) => { event.stopPropagation(); void dropProject(event, rockKey, yearKey, index); }}><div draggable onDragStart={(event: React.DragEvent<HTMLDivElement>) => { event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/onepager-id', String(project.id)); }} className={`flex w-full cursor-grab items-center gap-1 rounded bg-card p-1.5 text-left text-card-foreground shadow active:cursor-grabbing ${highlighted ? 'ring-2 ring-destructive' : ''}`}><button type="button" onClick={() => setSelectedId(project.id)} className="flex min-w-0 flex-1 items-center gap-1 text-left"><GripVertical className="size-3" /><span className="flex size-5 items-center justify-center"><LiveStatusGlyph status={project.status} /></span><b className="min-w-0 truncate text-[10px]">{project.description}</b></button>{project.jira && <span className="shrink-0 text-[9px]"><JiraKeyLink jiraKey={project.jira} /></span>}</div></div>; }) : null}</div>; })}</div>)}</div></div><aside className="flex min-h-full flex-col overflow-hidden rounded bg-card text-card-foreground shadow"><div className="bg-primary p-4 text-primary-foreground"><p className="text-xs font-black">Global Solutions</p></div><div className="flex-1 space-y-2 p-4">{northStarPlatforms.map((platform: string) => <button type="button" key={platform} onClick={() => setSelectedPlatform(platform)} className={`block w-full rounded-full bg-sidebar p-2 text-center text-[9px] font-bold text-sidebar-foreground ${selectedPlatform === platform ? 'ring-2 ring-destructive' : ''}`}>{platform}</button>)}</div></aside></div>{selected && <OnePagerSidecar project={selected} onClose={() => setSelectedId(null)} />}<footer className="rounded bg-card p-3 text-xs text-card-foreground"><div className="flex items-center gap-5"><span className="font-bold">Legend:</span><span className="flex items-center gap-1.5"><span className="status-circle status-circle-on-track" />On Track</span><span className="flex items-center gap-1.5"><span className="status-circle status-circle-at-risk" />At Risk</span><span className="flex items-center gap-1.5"><span className="status-circle status-circle-delayed" />Delayed</span></div></footer></div>;
}

function StatusKpis({ onFilter, site }: { onFilter: (filter: string) => void; site: SiteOption }) {
  const listOptions = useMemo(() => ({ orderBy: ['sequence asc'] }), []);
  const { data: rows = [], isLoading, isError } = useOnePagerList(listOptions);
  const siteRows = useMemo(() => rows.filter((row: SharePointOnePager) => rowMatchesSite(row as OnePagerRawRow, site.code)), [rows, site.code]);
  const total = siteRows.length;
  const statusCounts = useMemo(() => ({
    'On Track': siteRows.filter((row: SharePointOnePager) => normalizeStatus(row as OnePagerRawRow) === 'On Track').length,
    Started: siteRows.filter((row: SharePointOnePager) => normalizeStatus(row as OnePagerRawRow) === 'Started').length,
    'At Risk': siteRows.filter((row: SharePointOnePager) => normalizeStatus(row as OnePagerRawRow) === 'At Risk').length,
    Delayed: siteRows.filter((row: SharePointOnePager) => normalizeStatus(row as OnePagerRawRow) === 'Delayed').length,
  }), [siteRows]);
  const attention = statusCounts['At Risk'] + statusCounts.Delayed;
  const onTrackPercent = total === 0 ? 0 : Math.round((statusCounts['On Track'] / total) * 100);
  const cards = [
    { label: 'Projects', value: total, filter: 'All' },
    { label: 'On Track', value: statusCounts['On Track'], filter: 'On Track' },
    { label: 'Started', value: statusCounts.Started, filter: 'Started' },
    { label: 'At Risk / Delayed', value: attention, filter: 'At Risk / Delayed' },
    { label: 'On-track %', value: `${onTrackPercent}%`, filter: 'On Track' },
  ];
  const donut = [
    { name: 'On Track', value: statusCounts['On Track'], fill: 'var(--chart-2)' },
    { name: 'Started', value: statusCounts.Started, fill: 'var(--chart-4)' },
    { name: 'At Risk', value: statusCounts['At Risk'], fill: 'var(--chart-3)' },
    { name: 'Delayed', value: statusCounts.Delayed, fill: 'var(--chart-1)' },
  ];
  const rockData = bigRockKeys.map((key: OnePagerCard['bigRock']) => ({
    name: OnePagerBigRockKeyToLabel[key],
    value: siteRows.filter((row: SharePointOnePager) => normalizeBigRock(row as OnePagerRawRow) === key).length,
  }));
  const fiscalData = fiscalYearKeys.map((key: OnePagerCard['fiscalYear']) => {
    const fiscalRows = siteRows.filter((row: SharePointOnePager) => normalizeFiscalYear(row as OnePagerRawRow) === key);
    return {
      fiscalYear: OnePagerFiscalYearKeyToLabel[key],
      onTrack: fiscalRows.filter((row: SharePointOnePager) => normalizeStatus(row as OnePagerRawRow) === 'On Track').length,
      started: fiscalRows.filter((row: SharePointOnePager) => normalizeStatus(row as OnePagerRawRow) === 'Started').length,
      atRisk: fiscalRows.filter((row: SharePointOnePager) => normalizeStatus(row as OnePagerRawRow) === 'At Risk').length,
      delayed: fiscalRows.filter((row: SharePointOnePager) => normalizeStatus(row as OnePagerRawRow) === 'Delayed').length,
    };
  });
  const jiraCount = siteRows.filter((row: SharePointOnePager) => Boolean(row.jira?.trim())).length;
  const spotCount = siteRows.filter((row: SharePointOnePager) => Boolean(row.sPOT?.trim())).length;
  const coverage = (count: number) => total === 0 ? 0 : Math.round((count / total) * 100);
  const healthSentence = attention > 0
    ? `${attention} ${attention === 1 ? 'initiative is' : 'initiatives are'} At Risk or Delayed.`
    : total > 0 && statusCounts['On Track'] === total ? `All ${total} are On Track.` : `${statusCounts['On Track']} are On Track.`;
  const statusChartConfig = {
    onTrack: { label: 'On Track', color: 'var(--chart-2)' },
    started: { label: 'Started', color: 'var(--chart-4)' },
    atRisk: { label: 'At Risk', color: 'var(--chart-3)' },
    delayed: { label: 'Delayed', color: 'var(--chart-1)' },
  } satisfies ChartConfig;
  return <div className="space-y-3">
    <section className="rounded-2xl bg-sidebar p-6 text-sidebar-foreground shadow-lg">
      <h2 className="text-2xl font-black">Where the portfolio stands today</h2>
      <p className="mt-1 text-sm">{isAllSites(site.code) ? 'All 18 sites have' : `${site.name} has`} {total} mapped initiatives. {healthSentence}</p>
      <div className="mt-5 grid grid-cols-5 gap-3">{cards.map((card: { label: string; value: string | number; filter: string }) => <button key={card.label} type="button" onClick={() => onFilter(card.filter)} className="rounded-xl bg-card p-4 text-left text-card-foreground shadow transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring"><b className="text-2xl">{card.value}</b><span className="block text-xs font-bold">{card.label}</span></button>)}</div>
    </section>
    {isLoading && <p className="rounded bg-muted p-3 text-muted-foreground">Loading Status KPIs from the One pager list…</p>}
    {isError && <p className="rounded bg-destructive p-3 text-destructive-foreground">Status KPIs are unavailable.</p>}
    <div className="grid grid-cols-2 gap-3">
      <Card><CardHeader><CardTitle>Portfolio health mix</CardTitle></CardHeader><CardContent><ChartContainer config={statusChartConfig} className="h-72"><PieChart><ChartTooltip content={<ChartTooltipContent hideLabel />} /><Pie data={donut} dataKey="value" nameKey="name" innerRadius={72} outerRadius={102} startAngle={90} endAngle={-270} strokeWidth={total > 0 ? 2 : 0}>{donut.map((entry: { name: string; value: number; fill: string }) => <Cell key={entry.name} fill={entry.fill} />)}</Pie><text x="50%" y="47%" textAnchor="middle" dominantBaseline="middle" fill="var(--foreground)" fontSize="28" fontWeight="800">{total}</text><text x="50%" y="57%" textAnchor="middle" dominantBaseline="middle" fill="var(--muted-foreground)" fontSize="11">initiatives</text></PieChart></ChartContainer><div className="flex justify-center gap-4 text-xs">{donut.map((entry: { name: string; value: number; fill: string }) => <span key={entry.name}><b>{entry.value}</b> {entry.name}</span>)}</div></CardContent></Card>
      <Card><CardHeader><CardTitle>Execution by Big Rock</CardTitle></CardHeader><CardContent><ChartContainer config={chartConfig} className="h-80"><BarChart accessibilityLayer data={rockData} layout="vertical" margin={{ left: 8, right: 24 }}><CartesianGrid horizontal={false} /><XAxis type="number" allowDecimals={false} /><YAxis dataKey="name" type="category" width={180} tickLine={false} axisLine={false} fontSize={11} /><ChartTooltip content={<ChartTooltipContent />} /><Bar dataKey="value" fill="var(--chart-1)" radius={[0, 4, 4, 0]} /></BarChart></ChartContainer></CardContent></Card>
      <Card><CardHeader><CardTitle>Delivery health by fiscal year</CardTitle></CardHeader><CardContent><ChartContainer config={statusChartConfig} className="h-72"><BarChart accessibilityLayer data={fiscalData}><CartesianGrid vertical={false} /><XAxis dataKey="fiscalYear" tickLine={false} axisLine={false} /><YAxis allowDecimals={false} /><ChartTooltip content={<ChartTooltipContent />} /><ChartLegend content={<ChartLegendContent />} /><Bar dataKey="onTrack" stackId="status" fill="var(--chart-2)" /><Bar dataKey="started" stackId="status" fill="var(--chart-4)" /><Bar dataKey="atRisk" stackId="status" fill="var(--chart-3)" /><Bar dataKey="delayed" stackId="status" fill="var(--chart-1)" radius={[4, 4, 0, 0]} /></BarChart></ChartContainer></CardContent></Card>
      <Card><CardHeader><CardTitle>One pager coverage</CardTitle></CardHeader><CardContent className="space-y-6"><div><div className="flex items-end justify-between"><div><a href={jiraBaseUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold underline underline-offset-2">Jira linkage</a><p className="text-xs text-muted-foreground">{jiraCount} of {total} initiatives</p></div><b className="text-3xl">{coverage(jiraCount)}%</b></div><div className="mt-2 h-3 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${coverage(jiraCount)}%` }} /></div></div><div><div className="flex items-end justify-between"><div><p className="text-sm font-bold">SPOT coverage</p><p className="text-xs text-muted-foreground">{spotCount} of {total} initiatives</p></div><b className="text-3xl">{coverage(spotCount)}%</b></div><div className="mt-2 h-3 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-accent" style={{ width: `${coverage(spotCount)}%` }} /></div></div><p className="border-t pt-4 text-xs text-muted-foreground">Calculated from the One pager list {isAllSites(site.code) ? 'across all 18 sites' : 'for the selected site'}.</p></CardContent></Card>
    </div>
  </div>;
}

function BudgetSummary({ site, full = false }: { site: SiteOption; full?: boolean }) {
  const rows = spotRowsFor(site.code);
  const gaps = roadmapGapsFor(site.code);
  const emptySites = physicalSites.filter((option: SiteOption) => spotRowsFor(option.code).length === 0);
  const capexUsd = sumUsd(rows, 'totalCapex');
  const opexUsd = sumUsd(rows, 'totalOpex');
  const approvedUsd = sumUsd(rows, 'approvedCapex');
  const hasOpex = rows.some((row: SpotBudgetRow) => row.totalOpex != null);
  const ranked = [...rows].sort((left: SpotBudgetRow, right: SpotBudgetRow) => right.totalCapex - left.totalCapex);
  const top = ranked[0];
  const noSpotMoney = !isAllSites(site.code) && rows.length === 0;
  const compactKpis = [
    { label: 'TOTAL CAPEX', value: money(capexUsd) },
    { label: 'TOTAL OPEX', value: hasOpex ? money(opexUsd) : 'N/A' },
    { label: 'APPROVED CAPEX', value: money(approvedUsd) },
    { label: 'SPOT PROJECTS', value: rows.length },
    { label: 'INTEGRATION NEEDED', value: gaps.length },
    { label: isAllSites(site.code) ? 'SITES WITHOUT SPOT IDS' : 'USD', value: isAllSites(site.code) ? emptySites.length : 'USD' },
  ];
  const projectTable = <div className="mt-4 overflow-auto rounded-xl"><table className="w-full text-left text-xs"><thead className="myc-red"><tr>{['Site','Roadmap','SPOT','Title','State','TOTAL CAPEX (USD)','TOTAL OPEX (USD)','Approved CAPEX (USD)','Local TOTAL CAPEX'].map((heading: string) => <th key={heading} className="p-3">{heading}</th>)}</tr></thead><tbody>{ranked.map((row: SpotBudgetRow) => <tr key={row.spot} className="myc-card border-t"><td className="p-3">{row.site}</td><td className="p-3">{row.roadmapId || '—'}</td><td className="p-3 font-bold">{row.spot}</td><td className="p-3 font-bold">{row.title}</td><td className="p-3">{row.state}</td><td className="p-3">{money(row.totalCapex)}</td><td className="p-3">{row.totalOpex == null ? 'N/A' : money(row.totalOpex)}</td><td className="p-3">{money(row.approvedCapex)}</td><td className="p-3">{moneyIn(row.localCapex, row.currency)}</td></tr>)}</tbody></table></div>;
  const gapTable = gaps.length > 0 ? <div className="mt-4 overflow-auto rounded-xl"><table className="w-full text-left text-xs"><thead className="myc-red"><tr>{['Site','Roadmap','Initiative','Title','Budget'].map((heading: string) => <th key={heading} className="p-3">{heading}</th>)}</tr></thead><tbody>{gaps.map((row: RoadmapGap) => <tr key={`${row.site}-${row.roadmapId}-${row.title}`} className="myc-card border-t"><td className="p-3">{row.site}</td><td className="p-3">{row.roadmapId || '—'}</td><td className="p-3">{row.initiative || '—'}</td><td className="p-3">{row.title}</td><td className="p-3"><Badge variant="secondary">Integration needed</Badge></td></tr>)}</tbody></table></div> : null;
  const footer = <div className="mt-4 flex items-center justify-between gap-6 border-t pt-4 text-xs myc-muted"><p>SPOT Budget tab totals converted to USD as of {spotBudgetAsOf} using SPOT book rates (EUR 1.0957, INR 0.01171, CNY 0.13895, USD 1.00). SPOT 1063647 (product TOTAL CAPEX {money(168000)}) is excluded from site rollups. Roadmap rows without a SPOT ID are Integration needed.</p><Button type="button" className="brand-gradient shrink-0" onClick={() => window.open(spotPortfolioUrl, '_blank', 'noopener,noreferrer')}>Open SPOT</Button></div>;
  if (!full) return <aside className="budget-canvas w-[420px] shrink-0 rounded-xl border p-4 shadow-sm">
    <p className="text-[10px] font-bold uppercase myc-muted">SPOT Budget · {isAllSites(site.code) ? 'All Sites' : site.code} · {spotBudgetAsOf}</p>
    {noSpotMoney ? <p className="mt-4 text-sm font-bold">Integration needed</p> : <>
      <div className="mt-3 grid grid-cols-2 gap-2">{compactKpis.map((kpi: { label: string; value: string | number }) => <div key={kpi.label} className="myc-card min-w-0 rounded-lg p-3"><p className="text-[9px] font-bold myc-muted">{kpi.label}</p><p className="mt-1 whitespace-pre-wrap text-sm font-black" title={String(kpi.value)}>{kpi.value}</p></div>)}</div>
      <div className="myc-card mt-3 rounded-lg p-3"><p className="text-[10px] font-black">TOP TOTAL CAPEX</p><div className="mt-3 space-y-2">{ranked.slice(0, 5).map((row: SpotBudgetRow) => <div key={row.spot}><div className="flex gap-2 text-[9px]"><span className="min-w-0 flex-1 truncate">{row.spot} · {row.title}</span><b>{money(row.totalCapex)}</b></div><div className="myc-well mt-1 h-2 rounded-full"><div className="myc-bar h-2 rounded-full" style={{ width: `${top && top.totalCapex ? Math.min(100, (row.totalCapex / top.totalCapex) * 100) : 0}%` }} /></div></div>)}</div></div>
    </>}
  </aside>;
  return <section className="budget-canvas min-h-[calc(100vh-10rem)] rounded-xl border p-6 shadow-sm">
    <div className="flex items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase myc-muted">SPOT Portfolio Center</p><h2 className="text-xl font-black">{isAllSites(site.code) ? 'All Sites' : site.name} budget</h2><p className="text-xs myc-muted">TOTAL CAPEX and TOTAL OPEX from the SPOT Budget tab, converted to USD, as of {spotBudgetAsOf}.</p></div></div>
    {noSpotMoney && <div className="myc-card mt-4 rounded-lg p-10 text-center"><p className="font-bold">Integration needed</p><p className="mt-2 text-sm myc-muted">No SPOT IDs were present for this site in the harvested DD&T Roadmap Raw Data.</p></div>}
    {!noSpotMoney && <>
      <div className="mt-5 grid grid-cols-6 gap-3">{compactKpis.map((kpi: { label: string; value: string | number }) => <div key={kpi.label} className="myc-card min-w-0 rounded-xl p-4 shadow-sm"><p className="text-[10px] font-bold myc-muted">{kpi.label}</p><p className="mt-2 whitespace-pre-wrap text-sm font-black" title={String(kpi.value)}>{typeof kpi.value === 'string' ? kpi.value.replace(/ · /g, '\n') : kpi.value}</p></div>)}</div>
      {isAllSites(site.code) && <div className="myc-card mt-4 rounded-xl p-5"><h3 className="text-sm font-black">Site totals in USD</h3><div className="mt-4 overflow-auto"><table className="w-full text-left text-xs"><thead className="myc-red"><tr>{['Site','SPOT projects','TOTAL CAPEX','TOTAL OPEX','Approved CAPEX','Missing SPOT IDs'].map((heading: string) => <th key={heading} className="p-3">{heading}</th>)}</tr></thead><tbody>{physicalSites.map((option: SiteOption) => {
        const siteRows = spotRowsFor(option.code);
        const siteGaps = roadmapGapsFor(option.code);
        return <tr key={option.code} className="myc-card border-t"><td className="p-3 font-bold">{option.name} · {option.code}</td><td className="p-3">{siteRows.length}</td><td className="p-3">{siteRows.length ? money(sumUsd(siteRows, 'totalCapex')) : '—'}</td><td className="p-3">{siteRows.some((row: SpotBudgetRow) => row.totalOpex != null) ? money(sumUsd(siteRows, 'totalOpex')) : (siteRows.length ? 'N/A' : <Badge variant="secondary">Integration needed</Badge>)}</td><td className="p-3">{siteRows.length ? money(sumUsd(siteRows, 'approvedCapex')) : '—'}</td><td className="p-3">{siteGaps.length ? <Badge variant="secondary">{siteGaps.length} Integration needed</Badge> : '—'}</td></tr>;
      })}</tbody></table></div></div>}
      <div className="myc-card mt-4 min-w-0 rounded-xl p-5"><h3 className="text-sm font-black">INVESTMENT RANKING <span className="font-normal myc-muted">(TOTAL CAPEX from the SPOT Budget tab)</span></h3><div className="mt-5 space-y-3">{ranked.map((row: SpotBudgetRow) => <div key={row.spot}><div className="flex justify-between gap-4 text-xs"><b className="truncate">{row.spot} · {row.title}</b><span>{money(row.totalCapex)}</span></div><div className="myc-well mt-1 h-4 rounded-full"><div className="myc-bar h-4 rounded-full" style={{ width: `${top && top.totalCapex ? Math.min(100, (row.totalCapex / top.totalCapex) * 100) : 0}%` }} /></div></div>)}</div></div>
      {projectTable}
      {gaps.length > 0 && <div className="mt-6"><h3 className="text-sm font-black">Roadmap rows without a SPOT ID</h3>{gapTable}</div>}
    </>}
    {footer}
  </section>;
}

type GanttHealth = 'Green' | 'Amber' | 'Red' | 'Unassigned';
type GanttOwnership = 'Owned' | 'Associated';
type GanttProject = {
  id: string;
  title: string;
  site: string;
  siteName: string;
  initiative: string;
  status: string;
  health: GanttHealth;
  ownership: GanttOwnership;
  usd: number | null;
  start: string | null;
  finish: string | null;
  jira?: string;
  spot?: string;
  dated: boolean;
};

const ganttAxisStart = Date.UTC(2025, 3, 1);
const ganttAxisEnd = Date.UTC(2030, 3, 1);
const ganttFyYears = [26, 27, 28, 29, 30];
const ganttQuarterCount = ganttFyYears.length * 4;
const ganttHighValueUsd = 100000;
const ganttTodayPct = Math.max(0, Math.min(100, ((Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()) - ganttAxisStart) / (ganttAxisEnd - ganttAxisStart)) * 100));
const ganttHealthOf = (status: string): GanttHealth => {
  if (status === 'At Risk') return 'Amber';
  if (status === 'On Track' || status === 'Started' || status === 'Completed') return 'Green';
  if (status === 'Delayed') return 'Red';
  return 'Unassigned';
};
const ganttHealthFromSpot = (state: string): GanttHealth => {
  if (state === 'Completed') return 'Green';
  if (state === 'Hold') return 'Amber';
  if (state === 'Canceled') return 'Unassigned';
  return 'Unassigned';
};
const ganttFyBand = (year?: string) => {
  if (year === 'FY2026') return { start: '2025-04-01', finish: '2026-03-31' };
  if (year === 'FY2027') return { start: '2026-04-01', finish: '2027-03-31' };
  if (year === 'FY2028') return { start: '2027-04-01', finish: '2028-03-31' };
  return null;
};
const ganttPct = (iso?: string | null) => {
  if (!iso) return null;
  const stamp = Date.parse(`${iso.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(stamp)) return null;
  return Math.max(0, Math.min(100, ((stamp - ganttAxisStart) / (ganttAxisEnd - ganttAxisStart)) * 100));
};
const moneyCompact = (value: number) => {
  if (value >= 1000000) {
    const millions = value / 1000000;
    return `$${millions >= 10 ? millions.toFixed(1) : millions.toFixed(1)}M`;
  }
  if (value >= 1000) return `$${Math.round(value / 1000)}k`;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
};
const lookupSpotRow = (jira?: string, spot?: string) => {
  if (spot) {
    const bySpot = spotBudgetProjects.find((row: SpotBudgetRow) => row.spot === spot);
    if (bySpot) return bySpot;
  }
  if (jira) return spotBudgetProjects.find((row: SpotBudgetRow) => (row.roadmapId || '') === jira);
  return undefined;
};
const ownershipOf = (row: SpotBudgetRow | undefined, siteCode: string): GanttOwnership => {
  const owner = (row?.owner || '').toLowerCase();
  const siteName = (physicalSites.find((option: SiteOption) => option.code === siteCode)?.name || '').toLowerCase();
  if (owner.startsWith('site-') && siteName && owner.includes(siteName)) return 'Owned';
  return 'Associated';
};
const siteNameOf = (code: string) => physicalSites.find((option: SiteOption) => option.code === code)?.name || code;
const ganttBarClass = (health: GanttHealth) => {
  if (health === 'Red') return 'bg-[#e11d48] text-white';
  if (health === 'Amber') return 'bg-[#f5a623] text-white';
  if (health === 'Green') return 'bg-[#22a45a] text-white';
  return 'bg-[#c5c9ce] text-[#4b5563]';
};
const ganttDotClass = (health: GanttHealth) => {
  if (health === 'Red') return 'bg-[#e11d48]';
  if (health === 'Amber') return 'bg-[#f5a623]';
  if (health === 'Green') return 'bg-[#22a45a]';
  return 'border-2 border-[#9ca3af] bg-white';
};

function Gantt({ site, showBudget = true }: { site: SiteOption; showBudget?: boolean }) {
  const [health, setHealth] = useState<'All' | GanttHealth>('All');
  const [atRiskOnly, setAtRiskOnly] = useState(false);
  const [highValueOnly, setHighValueOnly] = useState(false);
  const [ownership, setOwnership] = useState<'both' | GanttOwnership>('both');
  const [initiativeFilter, setInitiativeFilter] = useState('All initiatives');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const initialCollapseSite = useRef<string | null>(null);
  const listOptions = useMemo(() => ({ orderBy: ['sequence asc'] }), []);
  const { data: rows = [], isLoading, isError } = useOnePagerList(listOptions);
  const projects = useMemo(() => {
    const seen = new Set<string>();
    const items: GanttProject[] = [];
    const pushItem = (item: GanttProject) => {
      const key = item.spot || item.jira || `${item.site}:${item.title}`;
      if (seen.has(key)) return;
      seen.add(key);
      items.push(item);
    };
    rows.filter((row: SharePointOnePager) => rowMatchesSite(row as OnePagerRawRow, site.code)).forEach((row: SharePointOnePager) => {
      const rawRow = row as OnePagerRawRow;
      const siteCode = rowSiteCode(rawRow);
      const jira = row.jira?.trim() || undefined;
      const spot = row.sPOT?.trim() || undefined;
      const budget = lookupSpotRow(jira, spot);
      const timeline = spot && spotTimeline[spot] ? spotTimeline[spot] : (budget ? spotTimeline[budget.spot] : undefined);
      const fy = ganttFyBand(normalizeFiscalYear(rawRow));
      const start = timeline?.s || fy?.start || null;
      const finish = timeline?.f || timeline?.pf || fy?.finish || null;
      const status = normalizeStatus(rawRow);
      pushItem({
        id: String(row.id),
        title: row.description,
        site: siteCode,
        siteName: siteNameOf(siteCode),
        initiative: budget?.initiative || (OnePagerNorthStarKeyToLabel[row.northStarKey] ?? String(row.northStarKey ?? 'Unassigned')),
        status,
        health: ganttHealthOf(status),
        ownership: ownershipOf(budget, siteCode),
        usd: budget && !budget.excludeFromSiteRollup ? budget.totalCapex : null,
        start,
        finish,
        jira,
        spot: spot || budget?.spot,
        dated: Boolean(start && finish),
      });
    });
    spotRowsFor(site.code).forEach((row: SpotBudgetRow) => {
      const timeline = spotTimeline[row.spot];
      const start = timeline?.s || null;
      const finish = timeline?.f || timeline?.pf || null;
      pushItem({
        id: `spot-${row.spot}`,
        title: row.title.trim(),
        site: row.site,
        siteName: siteNameOf(row.site),
        initiative: row.initiative || 'Unassigned',
        status: row.state,
        health: ganttHealthFromSpot(row.state),
        ownership: ownershipOf(row, row.site),
        usd: row.totalCapex,
        start,
        finish,
        jira: row.roadmapId || undefined,
        spot: row.spot,
        dated: Boolean(start && finish),
      });
    });
    roadmapGapsFor(site.code).forEach((row: RoadmapGap) => {
      pushItem({
        id: `gap-${row.site}-${row.roadmapId}-${row.title}`,
        title: row.title,
        site: row.site,
        siteName: siteNameOf(row.site),
        initiative: row.initiative || 'Unassigned',
        status: 'Unassigned',
        health: 'Unassigned',
        ownership: 'Associated',
        usd: null,
        start: null,
        finish: null,
        jira: row.roadmapId || undefined,
        dated: false,
      });
    });
    return items.sort((left: GanttProject, right: GanttProject) => left.initiative.localeCompare(right.initiative) || left.title.localeCompare(right.title));
  }, [rows, site.code]);
  const initiatives = useMemo(() => Array.from(new Set(projects.map((project: GanttProject) => project.initiative))).sort(), [projects]);
  const visible = projects.filter((project: GanttProject) => {
    if (health !== 'All' && project.health !== health) return false;
    if (atRiskOnly && project.health !== 'Amber' && project.health !== 'Red') return false;
    const highValue = project.usd != null && project.usd >= ganttHighValueUsd && (project.health === 'Amber' || project.health === 'Red');
    if (highValueOnly && !highValue) return false;
    if (ownership !== 'both' && project.ownership !== ownership) return false;
    if (initiativeFilter !== 'All initiatives' && project.initiative !== initiativeFilter) return false;
    return true;
  });
  const budgetInView = visible.reduce((sum: number, project: GanttProject) => sum + (project.usd ?? 0), 0);
  const grouped = useMemo(() => {
    const groups = new Map<string, GanttProject[]>();
    visible.forEach((project: GanttProject) => {
      const key = project.dated ? project.initiative : 'No dates reported';
      const list = groups.get(key) ?? [];
      list.push(project);
      groups.set(key, list);
    });
    return Array.from(groups.entries()).sort(([left]: [string, GanttProject[]], [right]: [string, GanttProject[]]) => {
      if (left === 'No dates reported') return 1;
      if (right === 'No dates reported') return -1;
      return left.localeCompare(right);
    });
  }, [visible]);
  useEffect(() => {
    if (grouped.length === 0 || initialCollapseSite.current === site.code) return;
    setCollapsed(Object.fromEntries(grouped.map(([name]: [string, GanttProject[]]) => [name, true])));
    initialCollapseSite.current = site.code;
  }, [grouped, site.code]);
  const filtersOn = health !== 'All' || atRiskOnly || highValueOnly || ownership !== 'both' || initiativeFilter !== 'All initiatives';
  const allCollapsed = grouped.length > 0 && grouped.every(([name]: [string, GanttProject[]]) => collapsed[name]);
  const downloadCsv = () => {
    const header = ['Initiative', 'Title', 'Site', 'Health', 'Ownership', 'USD', 'Start', 'Finish', 'SPOT', 'Jira'];
    const lines = [header.join(',')].concat(visible.map((project: GanttProject) => [project.initiative, project.title, project.siteName, project.health, project.ownership, project.usd == null ? '' : String(project.usd), project.start || '', project.finish || '', project.spot || '', project.jira || ''].map((value: string) => `"${value.replace(/"/g, '""')}"`).join(',')));
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'gsq-ddt-roadmap.csv';
    link.click();
    URL.revokeObjectURL(url);
  };
  const currentMonth = new Date().getUTCMonth();
  const currentYear = new Date().getUTCFullYear();
  const currentFy = currentMonth >= 3 ? currentYear + 1 : currentYear;
  const currentQuarter = currentMonth >= 3 ? Math.floor((currentMonth - 3) / 3) + 1 : 4;
  const ganttBody = <div className="rounded-xl border bg-white text-[#1f2937] shadow-sm">
    <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5">
      <div>
        <h2 className="text-2xl font-black tracking-tight">Roadmap</h2>
        <p className="mt-1 text-sm text-muted-foreground">Every project on one timeline, grouped by initiative. Bars are coloured by health, and high-value projects at risk carry a USD budget marker.</p>
      </div>
      <div className="flex gap-2">
        <Button type="button" size="sm" variant="outline" onClick={downloadCsv}><Download className="size-3.5" />Download CSV</Button>
        <Button type="button" size="sm" variant="outline" onClick={() => {
          if (allCollapsed) setCollapsed({});
          else setCollapsed(Object.fromEntries(grouped.map(([name]: [string, GanttProject[]]) => [name, true])));
        }}>{allCollapsed ? 'Expand all' : 'Collapse all'}</Button>
      </div>
    </div>
    <div className="mt-4 flex flex-wrap items-center gap-2 px-5">
      {(['All', 'Red', 'Amber', 'Green', 'Unassigned'] as const).map((item) => <Button key={item} type="button" size="sm" variant={health === item && !atRiskOnly && !highValueOnly ? 'default' : 'outline'} className="rounded-full" onClick={() => { setHealth(item === 'All' ? 'All' : item); setAtRiskOnly(false); setHighValueOnly(false); }}>{item === 'All' ? 'All health' : <span className="flex items-center gap-1.5"><span className={`size-2.5 rounded-full ${item === 'Unassigned' ? 'border border-[#9ca3af] bg-white' : ganttDotClass(item)}`} />{item}</span>}</Button>)}
      <Button type="button" size="sm" variant={atRiskOnly ? 'default' : 'outline'} className="rounded-full" onClick={() => { setAtRiskOnly(!atRiskOnly); setHighValueOnly(false); if (!atRiskOnly) setHealth('All'); }}>At risk only</Button>
      <Button type="button" size="sm" variant={highValueOnly ? 'destructive' : 'outline'} className="rounded-full" onClick={() => { setHighValueOnly(!highValueOnly); setAtRiskOnly(false); if (!highValueOnly) setHealth('All'); }}>$ High value at risk</Button>
      <Select value={ownership} onValueChange={(value: string) => setOwnership(value as 'both' | GanttOwnership)}>
        <SelectTrigger className="h-8 w-48 rounded-full"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="both">Owned and associated</SelectItem>
          <SelectItem value="Owned">Owned</SelectItem>
          <SelectItem value="Associated">Associated</SelectItem>
        </SelectContent>
      </Select>
      <Select value={initiativeFilter} onValueChange={setInitiativeFilter}>
        <SelectTrigger className="h-8 w-52 rounded-full"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="All initiatives">All initiatives</SelectItem>
          {initiatives.map((name: string) => <SelectItem key={name} value={name}>{name}</SelectItem>)}
        </SelectContent>
      </Select>
      {filtersOn && <Button type="button" size="sm" variant="ghost" className="text-[#e11d48]" onClick={() => { setHealth('All'); setAtRiskOnly(false); setHighValueOnly(false); setOwnership('both'); setInitiativeFilter('All initiatives'); }}>Clear all filters</Button>}
      <span className="ml-auto text-xs text-muted-foreground">{visible.length} of {projects.length} projects · {moneyCompact(budgetInView)} budget in view</span>
    </div>
    {isLoading && <p className="px-5 py-3 text-sm text-muted-foreground">Loading OnePager timelines from SharePoint…</p>}
    {isError && <p className="m-5 rounded bg-destructive p-3 text-destructive-foreground">OnePager is unavailable.</p>}
    <div className="mt-3 overflow-auto">
      <div className="min-w-[1280px]">
        <div className="sticky top-0 z-20 grid grid-cols-[280px_1fr] border-y bg-white text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
          <div className="px-4 py-2">Initiative and project<br /><span className="font-normal normal-case tracking-normal">Fiscal year, April to March</span></div>
          <div>
            <div className="grid border-l" style={{ gridTemplateColumns: `repeat(${ganttFyYears.length}, minmax(0, 1fr))` }}>
              {ganttFyYears.map((year: number) => <div key={year} className="border-l px-2 py-1 text-center">FY{year}</div>)}
            </div>
            <div className="grid border-l" style={{ gridTemplateColumns: `repeat(${ganttQuarterCount}, minmax(0, 1fr))` }}>
              {ganttFyYears.flatMap((year: number) => [1, 2, 3, 4].map((quarter: number) => {
                const fy = 2000 + year;
                const active = fy === currentFy && quarter === currentQuarter;
                return <div key={`${year}-${quarter}`} className={`border-l py-1 text-center ${active ? 'font-black text-[#e11d48]' : ''}`}>Q{quarter}</div>;
              }))}
            </div>
          </div>
        </div>
        {grouped.length === 0 && !isLoading && <p className="px-4 py-6 text-sm text-muted-foreground">No projects match the selected filters.</p>}
        {grouped.map(([initiative, groupProjects]: [string, GanttProject[]]) => {
          const counts = { Green: 0, Amber: 0, Red: 0, Unassigned: 0 };
          groupProjects.forEach((project: GanttProject) => { counts[project.health] += 1; });
          const groupUsd = groupProjects.reduce((sum: number, project: GanttProject) => sum + (project.usd ?? 0), 0);
          const highValueCount = groupProjects.filter((project: GanttProject) => project.usd != null && project.usd >= ganttHighValueUsd && (project.health === 'Amber' || project.health === 'Red')).length;
          const isClosed = Boolean(collapsed[initiative]);
          const datedProjects = groupProjects.filter((project: GanttProject) => project.dated);
          const rollupStarts = datedProjects.map((project: GanttProject) => ganttPct(project.start)).filter((value: number | null): value is number => value !== null);
          const rollupFinishes = datedProjects.map((project: GanttProject) => ganttPct(project.finish)).filter((value: number | null): value is number => value !== null);
          const rollupLeft = rollupStarts.length > 0 ? Math.min(...rollupStarts) : 2;
          const rollupRight = rollupFinishes.length > 0 ? Math.max(...rollupFinishes) : 12;
          const rollupWidth = Math.max(1.2, rollupRight - rollupLeft);
          return <section key={initiative}>
            <button type="button" className="grid w-full grid-cols-[280px_1fr] bg-[#fde8ea] text-left transition-colors hover:bg-[#fbdde1]" onClick={() => setCollapsed((current: Record<string, boolean>) => ({ ...current, [initiative]: !current[initiative] }))}>
              <div className="flex items-center gap-2 px-3 py-2 text-sm font-black"><ChevronDown className={`size-4 transition ${isClosed ? '-rotate-90' : ''}`} />{initiative}</div>
              <div className="relative min-h-12 border-l px-3 py-2">
                {isClosed && <>
                  <div className="pointer-events-none absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${ganttQuarterCount}, minmax(0, 1fr))` }}>{Array.from({ length: ganttQuarterCount }).map((_: unknown, index: number) => <div key={index} className="border-l border-[#f5cbd0]" />)}</div>
                  <div className="pointer-events-none absolute bottom-0 top-0 z-10 w-px bg-[#e11d48]" style={{ left: `${ganttTodayPct}%` }} />
                  {datedProjects.length > 0 ? <div
                    className="absolute top-3 z-20 flex h-6 items-center overflow-hidden rounded-full bg-[#8b929c] px-2 text-[10px] font-bold text-white shadow-sm"
                    style={{ left: `${rollupLeft}%`, width: `${rollupWidth}%` }}
                    title={`${initiative}: ${groupProjects.length} projects · ${moneyCompact(groupUsd)}`}
                  >
                    {highValueCount > 0 && <span className="mr-1 inline-flex size-4 items-center justify-center rounded-sm bg-white text-[10px] font-black text-[#e11d48]">$</span>}
                    <span className="truncate">{groupProjects.length} projects · {moneyCompact(groupUsd)}</span>
                  </div> : <div className="absolute left-[2%] top-3 z-20 flex h-6 w-[10%] items-center rounded-full bg-[#8b929c] px-2 text-[10px] font-bold text-white">No dates</div>}
                </>}
                {!isClosed && <div className="flex h-full items-center justify-end gap-2">
                  {highValueCount > 0 && <span className="rounded-full bg-[#e11d48] px-2 py-0.5 text-[10px] font-bold text-white">{highValueCount} high value at risk</span>}
                  <span className="rounded-full border bg-white px-2 py-0.5 text-[10px] font-bold">{moneyCompact(groupUsd)}</span>
                  {counts.Red > 0 && <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] font-bold text-[#e11d48]">R{counts.Red}</span>}
                  {counts.Amber > 0 && <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] font-bold text-[#b45309]">A{counts.Amber}</span>}
                  {counts.Green > 0 && <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] font-bold text-[#15803d]">G{counts.Green}</span>}
                  {counts.Unassigned > 0 && <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] font-bold text-[#6b7280]">U{counts.Unassigned}</span>}
                </div>}
              </div>
            </button>
            {!isClosed && groupProjects.map((project: GanttProject) => {
              const left = ganttPct(project.start);
              const right = ganttPct(project.finish);
              const barLeft = left == null ? 2 : Math.min(left, right ?? left);
              const barWidth = left == null || right == null ? 10 : Math.max(1.2, Math.abs(right - left));
              const highValue = project.usd != null && project.usd >= ganttHighValueUsd && (project.health === 'Amber' || project.health === 'Red');
              return <div key={project.id} className="grid grid-cols-[280px_1fr] border-b">
                <div className="flex items-start gap-2 px-3 py-2">
                  <span className={`mt-1 size-2.5 shrink-0 rounded-full ${ganttDotClass(project.health)}`} />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold">{project.title}</p>
                    <p className="text-[10px] text-muted-foreground">{project.siteName}{project.usd != null ? ` · ${moneyCompact(project.usd)}` : ''} · {project.ownership} · {project.health}</p>
                    {project.jira && <p className="text-[10px]"><JiraKeyLink jiraKey={project.jira} /></p>}
                  </div>
                </div>
                <div className="relative min-h-12 border-l">
                  <div className="pointer-events-none absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${ganttQuarterCount}, minmax(0, 1fr))` }}>{Array.from({ length: ganttQuarterCount }).map((_: unknown, index: number) => <div key={index} className="border-l border-slate-100" />)}</div>
                  <div className="pointer-events-none absolute bottom-0 top-0 z-10 w-px bg-[#e11d48]" style={{ left: `${ganttTodayPct}%` }} />
                  {project.dated && <div className={`absolute top-3 z-20 flex h-6 items-center overflow-hidden rounded-full px-2 text-[10px] font-bold ${ganttBarClass(project.health)}`} style={{ left: `${barLeft}%`, width: `${barWidth}%` }}>
                    {highValue && <span className="mr-1 inline-flex size-4 items-center justify-center rounded-sm bg-white text-[10px] font-black text-[#e11d48]">$</span>}
                    <span className="truncate">{project.title}</span>
                  </div>}
                  {!project.dated && <div className="absolute top-3 left-[2%] z-20 h-6 w-[10%] rounded-full bg-[#c5c9ce]" />}
                </div>
              </div>;
            })}
          </section>;
        })}
      </div>
    </div>
    <div className="flex flex-wrap items-center gap-4 px-5 py-3 text-[11px] text-muted-foreground">
      <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#22a45a]" />Green</span>
      <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#f5a623]" />Amber</span>
      <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#e11d48]" />Red</span>
      <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full border border-[#9ca3af] bg-white" />Unassigned</span>
      <span className="flex items-center gap-1.5"><span className="inline-flex size-4 items-center justify-center rounded-sm bg-[#e11d48] text-[10px] font-black text-white">$</span>High value and at risk</span>
    </div>
  </div>;
  if (!showBudget) return ganttBody;
  return <div className="flex gap-3"><div className="min-w-0 flex-1">{ganttBody}</div><BudgetSummary site={site} /></div>;
}

function RoadmapTab({ filter, onClear, site }: { filter?: string; onClear: () => void; site: SiteOption }) {
  return <OnePager filter={filter} onClear={onClear} site={site} />;
}


function CapabilityView({ site }: { site: SiteOption }) {
  const [geoFilter, setGeoFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'actuals' | 'forecast'>('actuals');
  const trackerOptions = useMemo(() => listFilterForSite(site.code, { orderBy: ['domainPair asc', 'integrationId asc'] }), [site.code]);
  const capabilityOptions = useMemo(() => listFilterForSite(site.code), [site.code]);
  const { data: integrations = [], isLoading: integrationsLoading, isError: integrationsError } = useIntegrationsTrackerList(trackerOptions);
  const { data: capabilities = [], isLoading: capabilitiesLoading, isError: capabilitiesError } = useCapabilityTrackerList(capabilityOptions);
  const siteIntegrations = useMemo(() => integrations.filter((item: IntegrationsTracker) => matchesSiteCode(item.siteCode, site.code)), [integrations, site.code]);
  const siteCapabilities = useMemo(() => capabilities.filter((item: CapabilityTracker) => matchesSiteCode(item.siteCode, site.code)), [capabilities, site.code]);
  const regions = isAllSites(site.code) ? Array.from(new Set(physicalSites.map((option: SiteOption) => option.region))) : [site.region];
  const statuses = useMemo(() => Array.from(new Set(siteIntegrations.map((item: IntegrationsTracker) => item.statusKey ?? item.status1Key).filter((value: IntegrationsTracker['statusKey'] | undefined): value is NonNullable<IntegrationsTracker['statusKey']> => Boolean(value)))), [siteIntegrations]);
  const visibleIntegrations = useMemo(() => siteIntegrations.filter((item: IntegrationsTracker) => {
    const regionMatch = geoFilter === 'all' || regionForSite(item.siteCode ?? '') === geoFilter || (!isAllSites(site.code) && geoFilter === site.region);
    const status = item.statusKey ?? item.status1Key ?? 'NotStarted';
    return regionMatch && (statusFilter === 'all' || status === statusFilter);
  }), [geoFilter, site.code, site.region, siteIntegrations, statusFilter]);
  const groupedByDomain = useMemo(() => {
    const groups = new Map<string, Map<string, IntegrationsTracker[]>>();
    visibleIntegrations.forEach((item: IntegrationsTracker) => {
      const domain = item.domainPair?.trim() || 'Enterprise integrations';
      const integrationId = item.integrationId?.trim() || `Integration ${item.id}`;
      if (!groups.has(domain)) groups.set(domain, new Map<string, IntegrationsTracker[]>());
      const domainGroup = groups.get(domain);
      if (!domainGroup) return;
      const records = domainGroup.get(integrationId) ?? [];
      records.push(item);
      domainGroup.set(integrationId, records);
    });
    const domainPriority = (domain: string) => {
      const normalized = domain.toLowerCase();
      if (normalized.includes('engineering') && normalized.includes('manufacturing')) return 0;
      if (normalized === 'engineering' || normalized.startsWith('engineering ')) return 1;
      return 2;
    };
    return Array.from(groups.entries()).sort(([left]: [string, Map<string, IntegrationsTracker[]>], [right]: [string, Map<string, IntegrationsTracker[]>]) =>
      domainPriority(left) - domainPriority(right) || left.localeCompare(right),
    );
  }, [visibleIntegrations]);
  const statusOf = (item: IntegrationsTracker) => item.statusKey ?? item.status1Key ?? 'NotStarted';
  const total = siteIntegrations.length;
  const inProgress = siteIntegrations.filter((item: IntegrationsTracker) => statusOf(item) === 'InProgress').length;
  const notStarted = siteIntegrations.filter((item: IntegrationsTracker) => ['NotStarted', 'NotPlanned'].includes(statusOf(item))).length;
  const live = siteIntegrations.filter((item: IntegrationsTracker) => ['Live', 'Validated', 'Adopted', 'Deployed', 'Active'].includes(statusOf(item))).length;
  const average = (values: Array<number | undefined>) => {
    const defined = values.filter((value: number | undefined): value is number => value !== undefined);
    return defined.length === 0 ? 0 : Math.round(defined.reduce((sum: number, value: number) => sum + value, 0) / defined.length);
  };
  const actuals = average(siteIntegrations.map((item: IntegrationsTracker) => item.deployPct));
  const kpis = [
    { label: 'Total', value: total },
    { label: 'In Progress', value: inProgress },
    { label: 'Not Started', value: notStarted },
    { label: '% Live', value: `${total === 0 ? 0 : Math.round((live / total) * 100)}%` },
    { label: '% Actuals', value: `${actuals}%` },
  ];
  const metricFor = (item: IntegrationsTracker) => Math.max(0, Math.min(100, viewMode === 'actuals' ? (item.deployPct ?? 0) : (item.adoptPct ?? item.transcribePct ?? item.deployPct ?? 0)));
  const isLoading = integrationsLoading || capabilitiesLoading;
  const isError = integrationsError || capabilitiesError;
  return <div className="space-y-4 bg-card p-5 text-card-foreground">
    <div className="flex flex-wrap items-end justify-between gap-4 border-b pb-4">
      <div><div className="flex items-center gap-2 text-xs font-black"><Workflow className="size-4" />DIGITAL INTEGRATIONS KPI</div><h2 className="mt-1 text-2xl font-black">Capability · {isAllSites(site.code) ? 'All Sites' : site.name}</h2><p className="text-sm text-muted-foreground">IntegrationsTracker and CapabilityTracker · {isAllSites(site.code) ? 'All 18 sites' : `SiteCode ${site.code}`}</p></div>
      <div className="flex flex-wrap items-center gap-2">
        <Select value={geoFilter} onValueChange={setGeoFilter}><SelectTrigger className="w-44"><SelectValue placeholder="Geo" /></SelectTrigger><SelectContent><SelectItem value="all">All geographies</SelectItem>{regions.map((region: string) => <SelectItem key={region} value={region}>{region}</SelectItem>)}</SelectContent></Select>
        <Select value={site.code} disabled><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value={site.code}>{isAllSites(site.code) ? 'ALL · All Sites' : `${site.code} · ${site.name}`}</SelectItem></SelectContent></Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem>{statuses.filter((status: string) => status).map((status: string) => <SelectItem key={status} value={status}>{status.replace(/([A-Z])/g, ' $1').trim()}</SelectItem>)}</SelectContent></Select>
      </div>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2">{kpis.map((kpi: { label: string; value: string | number }) => <div key={kpi.label} className="min-w-28 rounded-full border bg-background px-4 py-2 text-foreground shadow-sm"><span className="text-xs font-bold">{kpi.label}</span><b className="ml-3 text-lg">{kpi.value}</b></div>)}</div>
      <div className="flex rounded-full border bg-muted p-1 text-muted-foreground"><Button type="button" size="sm" variant={viewMode === 'actuals' ? 'default' : 'ghost'} className="rounded-full" onClick={() => setViewMode('actuals')}>Actuals</Button><Button type="button" size="sm" variant={viewMode === 'forecast' ? 'default' : 'ghost'} className="rounded-full" onClick={() => setViewMode('forecast')}>FY26 Forecast</Button></div>
    </div>
    {isLoading && <p className="rounded bg-muted p-3 text-muted-foreground">Loading site capability trackers from SharePoint…</p>}
    {isError && <p className="rounded bg-destructive p-3 text-destructive-foreground">Capability tracker data is unavailable.</p>}
    {!isLoading && !isError && groupedByDomain.length === 0 && <div className="rounded border bg-background p-10 text-center text-muted-foreground">No tracker records match the selected filters {isAllSites(site.code) ? 'across all 18 sites' : `for ${site.code}`}.</div>}
    <div className="space-y-5">{groupedByDomain.map(([domain, integrationsById]: [string, Map<string, IntegrationsTracker[]>]) => <section key={domain} className="overflow-hidden rounded-lg border bg-background text-foreground"><header className="bg-sidebar px-5 py-3 text-sidebar-foreground"><h3 className="text-sm font-black">{domain}</h3></header><div className="grid gap-3 p-3 lg:grid-cols-2 xl:grid-cols-3">{Array.from(integrationsById.entries()).map(([integrationId, records]: [string, IntegrationsTracker[]]) => {
      const lead = records[0];
      const capability = siteCapabilities.find((item: CapabilityTracker) => item.reqIntIds?.split(/[;,]/).map((value: string) => value.trim()).includes(integrationId));
      const productGroups = Array.from(records.reduce((groups: Map<string, number[]>, item: IntegrationsTracker) => {
        const label = item.productGroup?.trim() || item.productLine?.trim() || 'All products';
        const values = groups.get(label) ?? [];
        values.push(metricFor(item));
        groups.set(label, values);
        return groups;
      }, new Map<string, number[]>()).entries()).map(([label, values]: [string, number[]]) => ({ label, value: average(values) }));
      const cardPercent = average(productGroups.map((group: { label: string; value: number }) => group.value));
      return <article key={integrationId} className="rounded-md border bg-card p-4 text-card-foreground shadow-sm"><div className="flex items-start justify-between gap-3"><h4 className="text-base font-bold">{lead?.title ?? 'Untitled integration'}</h4><b className="shrink-0 text-lg">{cardPercent}%</b></div><div className="mt-4 space-y-3">{productGroups.map((group: { label: string; value: number }) => <div key={group.label}><div className="mb-1 flex items-end justify-between gap-3 text-xs"><span className="font-bold">{group.label}</span><b>{group.value}%</b></div><div className="h-3 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${group.value}%` }} /></div></div>)}</div>{capability && <p className="mt-4 border-t pt-3 text-xs text-muted-foreground">{capability.title} · {capability.platform ?? capability.functionName ?? 'Capability'} · {capability.targetQuarter ?? 'No target quarter'}</p>}</article>;
    })}</div></section>)}</div>
    <DigitalMaturityHeatmap
  selectedGeography={geoFilter}
/>
`
  </div>;
}

function Risks({ site }: { site: SiteOption }) {
  const { data: risks = [], isLoading, isError } = useRisksList({ orderBy: ['due asc'] });
  const siteRisks = risks.filter((risk: SharePointRisk) => matchesSiteCode(risk.siteCode, site.code));
  return <div className="space-y-3"><div className="rounded bg-primary p-3 text-primary-foreground"><b>{isAllSites(site.code) ? 'Review network risks this cycle.' : 'Review local risks this cycle.'}</b> Prioritize mitigation and ownership updates.</div><Card><CardContent className="overflow-auto p-0"><table className="w-full text-left text-xs"><thead className="bg-sidebar text-sidebar-foreground"><tr>{['Title','Glyph','Owner','Due','Reference','Big Rock','Source','Mitigation'].map((heading: string) => <th key={heading} className="p-3">{heading}</th>)}</tr></thead><tbody>{isLoading ? <tr><td colSpan={8} className="p-6 text-center">Loading SharePoint risks…</td></tr> : isError ? <tr><td colSpan={8} className="p-6 text-center">SharePoint risks are unavailable.</td></tr> : siteRisks.length === 0 ? <tr><td colSpan={8} className="p-6 text-center">{isAllSites(site.code) ? 'No risks found across the 18 sites.' : 'No risks found.'}</td></tr> : siteRisks.map((risk: SharePointRisk) => <tr key={risk.id} className="border-b"><td className="p-3 font-bold"><JiraText text={risk.title} /></td><td className="p-3"><ShieldAlert className="size-4" /></td><td className="p-3">{risk.ownerName ?? '—'}</td><td className="p-3">{risk.due ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(risk.due)) : '—'}</td><td className="p-3">{risk.jiraKey ? <JiraKeyLink jiraKey={risk.jiraKey} /> : 'Local'}</td><td className="p-3">{risk.siteCode ?? '—'}</td><td className="p-3">{risk.source ?? '—'}</td><td className="p-3">{risk.mitigation ? <JiraText text={risk.mitigation} /> : '—'}</td></tr>)}</tbody></table></CardContent></Card></div>;
}

function BeatRing({ primary, secondary = 0, label, detail }: { primary: number; secondary?: number; label: string; detail: string }) {
  const safePrimary = Math.max(0, Math.min(100, primary));
  const safeSecondary = Math.max(0, Math.min(100 - safePrimary, secondary));
  const primaryStop = `${safePrimary}%`;
  const secondaryStop = `${safePrimary + safeSecondary}%`;
  return <div className="relative size-28 shrink-0 rounded-full" style={{ background: `conic-gradient(var(--beat-ring-red) 0 ${primaryStop}, var(--beat-ring-navy) ${primaryStop} ${secondaryStop}, var(--beat-ring-rest) ${secondaryStop} 100%)` }}><div className="absolute inset-4 flex flex-col items-center justify-center rounded-full bg-card text-center text-card-foreground"><b className="text-xl leading-none">{label}</b><span className="mt-1 text-[9px] font-bold">{detail}</span></div></div>;
}

function BusinessReview({ site, onSelectSite }: { site: SiteOption; onSelectSite: (code: string) => void }) {
  const { data: commentary = [], isLoading: commentaryLoading } = useCommentary_1List({ orderBy: ['period desc'] });
  const { data: asks = [], isLoading: asksLoading } = useLeadershipAsksList({ orderBy: ['neededBy asc'] });
  const onePagerOptions = useMemo(() => ({ orderBy: ['sequence asc'] }), []);
  const capabilityOptions = useMemo(() => listFilterForSite(site.code), [site.code]);
  const { data: onePagerRows = [] } = useOnePagerList(onePagerOptions);
  const { data: integrationRows = [] } = useIntegrationsTrackerList(capabilityOptions);
  const { data: riskRows = [] } = useRisksList({ orderBy: ['due asc'] });
  const siteCommentary = commentary.filter((item: Commentary_1) => matchesSiteCode(item.siteCode, site.code)).slice(0, 6);
  const siteAsks = asks.filter((item: LeadershipAsks) => matchesSiteCode(item.siteCode, site.code));
  const sitePortfolio = onePagerRows.filter((row: SharePointOnePager) => rowMatchesSite(row as OnePagerRawRow, site.code));
  const onTrack = sitePortfolio.filter((row: SharePointOnePager) => normalizeStatus(row as OnePagerRawRow) === 'On Track').length;
  const delayed = sitePortfolio.filter((row: SharePointOnePager) => normalizeStatus(row as OnePagerRawRow) === 'Delayed').length;
  const atRisk = sitePortfolio.filter((row: SharePointOnePager) => normalizeStatus(row as OnePagerRawRow) === 'At Risk').length;
  const portfolioTotal = sitePortfolio.length;
  const onTrackPercent = portfolioTotal === 0 ? 0 : Math.round((onTrack / portfolioTotal) * 100);
  const delayedPercent = portfolioTotal === 0 ? 0 : Math.round((delayed / portfolioTotal) * 100);
  const spotRows = spotRowsFor(site.code);
  const spotGaps = roadmapGapsFor(site.code);
  const capexUsd = sumUsd(spotRows, 'totalCapex');
  const opexUsd = sumUsd(spotRows, 'totalOpex');
  const hasOpex = spotRows.some((row: SpotBudgetRow) => row.totalOpex != null);
  const siteIntegrations = integrationRows.filter((row: IntegrationsTracker) => matchesSiteCode(row.siteCode, site.code));
  const liveIntegrations = siteIntegrations.filter((row: IntegrationsTracker) => ['Live', 'Validated', 'Adopted', 'Deployed', 'Active'].includes(row.statusKey ?? row.status1Key ?? '')).length;
  const livePercent = siteIntegrations.length === 0 ? 0 : Math.round((liveIntegrations / siteIntegrations.length) * 100);
  const siteRisks = riskRows.filter((row: SharePointRisk) => matchesSiteCode(row.siteCode, site.code));
  const riskCount = siteRisks.length;
  const riskPercent = portfolioTotal === 0 ? 0 : Math.min(100, Math.round(((atRisk + delayed) / portfolioTotal) * 100));
  const beatIcons = [TrendingUp, ClipboardCheck, CircleDollarSign, ShieldAlert, Gauge, HandCoins];
  return <div className="space-y-3"><SiteNetworkHero site={site} onSelectSite={onSelectSite} /><SiteLeadershipStrip code={site.code} /><div className="grid grid-cols-3 gap-4">{['Portfolio pulse', 'Delivery health', 'Financial outlook', 'Risk decisions', 'Capability progress', 'Leadership asks'].map((beat: string, index: number) => {
    const item = siteCommentary[index];
    const Icon = beatIcons[index] ?? TrendingUp;
    const graphic = index === 0 ? <div className="flex items-center gap-5"><BeatRing primary={portfolioTotal === 0 ? 0 : Math.round((onTrack / portfolioTotal) * 100)} secondary={riskPercent} label={String(portfolioTotal)} detail="initiatives" /><div className="space-y-2 text-xs"><p><b>{onTrack}</b> on track</p><p><b>{atRisk + delayed}</b> at risk or delayed</p></div></div>
      : index === 1 ? <div className="flex items-center gap-5"><BeatRing primary={onTrackPercent} secondary={delayedPercent} label={`${onTrackPercent}%`} detail="on track" /><div className="text-xs"><b>{delayed}</b><p>delayed</p></div></div>
      : index === 2 ? <div className="space-y-2"><p className="text-xs font-black">TOTAL CAPEX</p><p className="text-2xl font-black text-[var(--beat-ring-red)]">{spotRows.length ? money(capexUsd) : 'Integration needed'}</p><p className="text-xs"><b>TOTAL OPEX</b> {hasOpex ? money(opexUsd) : 'N/A'}</p><p className="text-xs">{spotRows.length} SPOT projects · {spotGaps.length} roadmap rows need a SPOT ID</p></div>
      : index === 3 ? <div className="flex items-center gap-5"><BeatRing primary={riskPercent} label={String(riskCount)} detail="risk items" /><div className="text-xs"><b>{atRisk + delayed}</b><p>portfolio items need attention</p></div></div>
      : index === 4 ? <div className="flex items-center gap-5"><BeatRing primary={livePercent} label={`${livePercent}%`} detail="live" /><div className="text-xs"><b>{liveIntegrations}</b><p>live capabilities</p></div></div>
      : <div className="flex items-center gap-5"><div className="flex size-28 items-center justify-center rounded-full bg-[var(--beat-ring-navy)] text-white"><HandCoins className="size-10" /></div><div><b className="text-4xl">{siteAsks.length}</b><p className="text-xs font-bold">open asks</p></div></div>;
    return <article key={beat} className="overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm"><header className={`flex items-center gap-3 px-5 py-4 ${index % 2 === 0 ? 'beat-header-charcoal' : 'beat-header-burgundy'}`}><Icon className="size-6" /><h3 className="text-base font-black">{index + 1}. {beat}</h3></header><div className="beat-body min-h-64 p-5"><div className="flex min-h-36 items-center">{graphic}</div><p className="border-t border-[var(--beat-ring-rest)] pt-4 text-sm">{commentaryLoading ? 'Loading SharePoint commentary…' : <JiraText text={item?.body ?? 'No current commentary.'} />}</p></div></article>;
  })}</div><Card><CardHeader><CardTitle>Leadership asks</CardTitle></CardHeader><CardContent className="space-y-2">{asksLoading ? <p>Loading SharePoint leadership asks…</p> : siteAsks.length === 0 ? <p>No current leadership asks.</p> : siteAsks.map((ask: LeadershipAsks) => <div key={ask.id} className="flex items-start justify-between gap-4 border-b py-2"><div><b><JiraText text={ask.title} /></b><p className="text-sm text-muted-foreground"><JiraText text={ask.impact ?? 'Impact not specified'} /></p></div><span className="text-xs">{ask.neededBy ?? ask.period ?? 'No due date'}</span></div>)}</CardContent></Card></div>;
}


export function ExecutivePlatform() {
  const [tab, setTab] = useState('Budget');
  const [statusFilter, setStatusFilter] = useState<string>();
  const [siteCode, setSiteCode] = useState('ALL');
  const site = siteOptions.find((option: SiteOption) => option.code === siteCode) ?? siteOptions[0];
  const scope = 'GSQ DD&T executive portfolio';
  const audience = 'GSQ executive leadership';
  const applyFilter = (filter: string) => { setStatusFilter(filter === 'All' ? undefined : filter); setTab('Roadmap'); };
  const launchSiteInput = () => {
    window.open(siteInputUrl, '_blank', 'noopener,noreferrer');
  };
  return <main className="min-h-screen bg-background p-3 text-foreground"><header className="brand-gradient w-full rounded-xl p-4 shadow"><div className="flex items-center gap-5"><Select value={siteCode} onValueChange={setSiteCode}><SelectTrigger className="h-auto w-[250px] border-0 bg-transparent p-0 text-[var(--takeda-red-foreground)] shadow-none hover:bg-transparent focus-visible:ring-white [&_svg]:text-[var(--takeda-red-foreground)]"><div className="text-left"><span className="block text-[10px] font-bold text-[var(--takeda-red-foreground)]">SITE</span><span className="font-black text-[var(--takeda-red-foreground)]">{headerSiteLabel(site)}</span></div></SelectTrigger><SelectContent>{siteOptions.filter((option: SiteOption) => option.code).map((option: SiteOption) => <SelectItem key={option.code} value={option.code}>{isAllSites(option.code) ? <span className="font-black">ALL SITES</span> : <><span className="font-black">{option.name.toUpperCase()}</span> · {option.code}</>}</SelectItem>)}</SelectContent></Select><div aria-hidden="true" className="h-14 w-1 -skew-x-12 bg-white" /><div><h1 className="text-2xl font-black text-[var(--takeda-red-foreground)]">GSQ DD&amp;T Executive Platform TEST</h1></div></div></header><Tabs value={tab} onValueChange={setTab}><div className="mt-3 flex w-full flex-nowrap items-center gap-2 overflow-hidden border-b bg-card px-5 py-2 text-card-foreground"><TabsList className="h-auto min-w-max flex-1 justify-start gap-1 rounded-none bg-transparent p-0">{tabs.filter((name: string) => name).map((name: string) => <TabsTrigger key={name} value={name} className="!flex-none whitespace-nowrap rounded-full px-4 py-2 text-xs data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">{name}</TabsTrigger>)}</TabsList><Button type="button" className="site-input-launch ml-auto shrink-0 whitespace-nowrap rounded-full px-5 py-2 hover:brightness-95" onClick={launchSiteInput}>Site input</Button></div><div className="pt-3"><TabsContent value="Portfolio Health"><BusinessReview site={site} onSelectSite={setSiteCode} /></TabsContent><TabsContent value="Roadmap"><RoadmapTab filter={statusFilter} onClear={() => setStatusFilter(undefined)} site={site} /></TabsContent><TabsContent value="Status KPIs"><StatusKpis onFilter={applyFilter} site={site} /></TabsContent><TabsContent value="Gantt + Budget"><Gantt site={site} /></TabsContent><TabsContent value="Budget"><BudgetSummary site={site} full /></TabsContent><TabsContent value="Risks"><Risks site={site} /></TabsContent><TabsContent value="Capability"><CapabilityView site={site} /></TabsContent><TabsContent value="Ask Copilot"><AskCopilot siteCode={site.code} siteName={site.name} scope={scope} audience={audience} /></TabsContent></div></Tabs><LiveAgent hidden={tab === 'Ask Copilot'} siteCode={site.code} siteName={site.name} scope={scope} audience={audience} /></main>;
}