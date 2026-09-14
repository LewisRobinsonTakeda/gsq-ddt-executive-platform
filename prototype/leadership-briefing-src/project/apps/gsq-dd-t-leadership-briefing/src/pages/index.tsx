import { useMemo, useState, type ComponentType } from 'react';
import { MicrosoftCopilotStudioService } from '@/generated/services/MicrosoftCopilotStudioService';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Bot, Boxes, Building2, CalendarRange,
  CheckCircle2, ChevronRight, CircleDollarSign, ExternalLink, Factory, FlaskConical,
  Gauge, Landmark, Layers3, Link2, MessageSquareText, Network, Radar, ShieldAlert,
  Sparkles, Target, TriangleAlert,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const tabs = ['Briefing', 'Explore', 'Roadmap', 'Capability', 'Money', 'Risks', 'Ask Copilot', 'Site input'] as const;
type Tab = (typeof tabs)[number];
type Status = 'On Track' | 'At Risk' | 'Delayed';
type Initiative = { key: string; name: string; site: string; platform: string; status: Status; spot?: string; investment?: number; note: string };

const sites = [
  ['LEX', 'Lexington'], ['THO', 'Thousand Oaks'], ['BRP', 'Brooklyn Park'], ['NAU', 'Naucalpan'], ['BUE', 'Buenos Aires'], ['TJN', 'Tianjin'],
  ['OSA', 'Osaka'], ['HIK', 'Hikari'], ['SGP', 'Singapore'], ['YAR', 'Yaroslavl APAC'], ['BEK', 'Bekasi'], ['GRA', 'Grange Castle'],
  ['BRY', 'Bray'], ['LIN', 'Linz'], ['ORA', 'Oranienburg'], ['SNG', 'Singen'], ['NEU', 'Neuchatel'], ['VAS', 'Vashi Europe'],
] as const;

const initiatives: Initiative[] = [
  { key: 'DDTTO-12', name: 'Elaprase MES', site: 'THO', platform: 'MES', status: 'On Track', spot: '1024096', note: 'TO MES Elaprase DS — validation progressing to plan.' },
  { key: 'DDTTO-54', name: 'APMS', site: 'THO', platform: 'APMS', status: 'Delayed', spot: '1041357', note: 'Recovery plan requires resource confirmation.' },
  { key: 'DDTTO-31', name: 'LIMS', site: 'THO', platform: 'LIMS', status: 'On Track', note: 'User acceptance testing remains on plan.' },
  { key: 'DDTTO-08', name: 'SAIL', site: 'THO', platform: 'SAIL', status: 'On Track', note: 'Last go live completed.' },
  { key: 'DDTTO-22', name: 'Phoenix', site: 'THO', platform: 'Phoenix', status: 'At Risk', investment: 436000, note: 'Funding alignment monitored against decision gates.' },
  { key: 'DDTGRA-11', name: 'LIMS', site: 'GRA', platform: 'LIMS', status: 'Delayed', note: 'Process readiness gaps affecting deployment.' },
  { key: 'DDTVAS-09', name: 'LIMS', site: 'VAS', platform: 'LIMS', status: 'Delayed', note: 'Data migration readiness requires remediation.' },
];

const statusClass: Record<Status, string> = {
  'On Track': 'border-l-[6px] border-l-[oklch(0.55_0.14_150)]',
  'At Risk': 'border-l-[6px] border-l-[oklch(0.62_0.13_75)]',
  'Delayed': 'border-l-[6px] border-l-destructive',
};

function IntegrationChip() { return <Badge variant="outline"><Link2 className="mr-1 size-3" />Integration needed</Badge>; }
function StatusBadge({ status }: { status: Status }) {
  const icon = status === 'On Track' ? CheckCircle2 : status === 'At Risk' ? TriangleAlert : AlertTriangle;
  const Icon = icon;
  return <Badge variant={status === 'Delayed' ? 'destructive' : status === 'At Risk' ? 'outline' : 'secondary'}><Icon className="mr-1 size-3" />{status}</Badge>;
}
function JiraLink({ code }: { code: string }) { return <a className="font-semibold underline decoration-accent decoration-2 underline-offset-4" href={`https://onetakeda.atlassian.net/browse/${code}`} target="_blank" rel="noreferrer">{code}<ExternalLink className="ml-1 inline size-3" /></a>; }
function SpotLink({ id }: { id: string }) { return <a className="font-semibold underline decoration-accent decoration-2 underline-offset-4" href="https://tospot.azurewebsites.net" target="_blank" rel="noreferrer">SPOT {id}<ExternalLink className="ml-1 inline size-3" /></a>; }
function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) { return <div><h2 className="text-xl font-bold text-foreground">{title}</h2>{subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}</div>; }
function Metric({ label, value, detail, icon: Icon }: { label: string; value: string; detail: string; icon: ComponentType<{ className?: string }> }) {
  return <Card className="shadow-sm"><CardContent className="flex items-center justify-between p-5"><div><p className="text-sm font-medium text-muted-foreground">{label}</p><p className="mt-1 text-3xl font-bold text-foreground">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div><div className="bg-primary p-3 text-primary-foreground"><Icon className="size-6" /></div></CardContent></Card>;
}
function InitiativeRow({ item, onOpen }: { item: Initiative; onOpen: (item: Initiative) => void }) {
  return <button type="button" onClick={() => onOpen(item)} className={`grid w-full grid-cols-[1.25fr_.7fr_.7fr_auto] items-center gap-4 bg-card p-4 text-left text-card-foreground shadow-sm transition-transform hover:-translate-y-0.5 ${statusClass[item.status]}`}><div><p className="font-bold">{item.name}</p><p className="text-sm text-muted-foreground">{item.note}</p></div><span><JiraLink code={item.key} /></span><span>{item.spot ? <SpotLink id={item.spot} /> : <IntegrationChip />}</span><span className="flex items-center gap-3"><StatusBadge status={item.status} /><ChevronRight className="size-4" /></span></button>;
}

export default function HomePage() {
  const [tab, setTab] = useState<Tab>('Briefing');
  const [site, setSite] = useState('THO');
  const [scope, setScope] = useState('This site');
  const [audience, setAudience] = useState('Executive');
  const [selected, setSelected] = useState<Initiative | null>(null);
  const [platform, setPlatform] = useState<string | null>(null);
  const visible = useMemo(() => scope === 'Network' ? initiatives : initiatives.filter((item: Initiative) => item.site === site), [scope, site]);
  const changeTab = (next: Tab) => { setTab(next); setSelected(null); setPlatform(null); };
  const openInitiative = (item: Initiative) => setSelected(item);

  return <div className="mx-auto max-w-[1920px]">
    <header className="sticky top-0 z-30 border-b bg-card text-card-foreground shadow-sm">
      <div className="flex h-20 items-center justify-between px-8">
        <div className="flex items-center gap-4"><div className="bg-accent p-3 text-accent-foreground shadow-sm"><Landmark className="size-6" /></div><div><h1 className="text-2xl font-bold tracking-tight">GSQ DD&amp;T Executive Platform</h1><p className="text-sm text-muted-foreground">Site leadership briefing · Read-only briefing data</p></div></div>
        <div className="flex items-center gap-3">
          <Select value={site} onValueChange={setSite}><SelectTrigger className="w-56"><SelectValue /></SelectTrigger><SelectContent>{sites.filter((item) => item[0]).map((item) => <SelectItem key={item[0]} value={item[0]}>{item[0]} · {item[1]}</SelectItem>)}</SelectContent></Select>
          <Select value={scope} onValueChange={setScope}><SelectTrigger className="w-36"><SelectValue /></SelectTrigger><SelectContent>{['This site', 'Network'].map((item: string) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
          <Select value={audience} onValueChange={setAudience}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent>{['Executive', 'Site DD and T', 'Delivery'].map((item: string) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
        </div>
      </div>
      <Tabs value={tab} onValueChange={(value: string) => changeTab(value as Tab)}><TabsList className="h-12 w-full justify-start rounded-none border-t bg-card px-8">{tabs.filter((item: Tab) => item).map((item: Tab) => <TabsTrigger key={item} value={item} className="h-12 rounded-none border-b-2 border-transparent px-5 data-[state=active]:border-accent data-[state=active]:bg-card">{item}</TabsTrigger>)}</TabsList></Tabs>
    </header>

    <main className="p-8">
      <AnimatePresence mode="wait">
        <motion.div key={`${tab}-${selected?.key ?? platform ?? 'root'}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18, ease: 'easeOut' as const }}>
          {selected ? <Detail item={selected} onBack={() => setSelected(null)} /> : tab === 'Briefing' ? <Briefing visible={visible} audience={audience} site={site} onOpen={openInitiative} onNavigate={changeTab} /> : null}
          {!selected && tab === 'Explore' && <Explore platform={platform} setPlatform={setPlatform} onBriefing={() => changeTab('Briefing')} onOpen={openInitiative} />}
          {!selected && tab === 'Roadmap' && <Roadmap items={visible} onOpen={openInitiative} />}
          {!selected && tab === 'Capability' && <Capability audience={audience} site={site} />}
          {!selected && tab === 'Money' && <Money items={visible} onOpen={openInitiative} />}
          {!selected && tab === 'Risks' && <Risks items={visible} onOpen={openInitiative} />}
          {!selected && tab === 'Ask Copilot' && <AskCopilot site={site} scope={scope} audience={audience} onNavigate={changeTab} />}
          {!selected && tab === 'Site input' && <SiteInput />}
        </motion.div>
      </AnimatePresence>
    </main>
  </div>;
}

function Briefing({ visible, audience, site, onOpen, onNavigate }: { visible: Initiative[]; audience: string; site: string; onOpen: (item: Initiative) => void; onNavigate: (tab: Tab) => void }) {
  const delayed = visible.filter((item: Initiative) => item.status === 'Delayed');
  return <div className="space-y-6">
    <section className="grid grid-cols-[1fr_360px] gap-6"><Card className="overflow-hidden"><div className="h-2 bg-accent" /><CardContent className="p-6"><div className="flex items-start justify-between"><div><Badge variant="secondary">{site} · {audience}</Badge><h2 className="mt-4 max-w-4xl text-2xl font-bold">Why we exist</h2><p className="mt-2 max-w-4xl text-muted-foreground">Give site leaders one fast path from delivery signal to accountable action—without recreating Power BI.</p></div><Target className="size-10 text-foreground" /></div><button type="button" onClick={() => onOpen(initiatives[0])} className="mt-6 flex w-full items-center justify-between border bg-background p-4 text-left"><div><p className="text-sm font-semibold">Golden thread</p><p className="mt-1 text-lg font-bold">TO MES Elaprase DS → DDTTO-12 → SPOT 1024096</p></div><ArrowRight className="size-5" /></button></CardContent></Card>
    <Card className="bg-primary text-primary-foreground"><CardHeader><CardTitle className="text-primary-foreground">Context and Action</CardTitle></CardHeader><CardContent className="space-y-5"><div><p className="text-sm font-semibold">Context</p><p className="mt-1 text-sm">APMS is delayed; Elaprase MES remains the key proof point.</p></div><div><p className="text-sm font-semibold">Action</p><p className="mt-1 text-sm">Confirm recovery ownership and validation capacity.</p></div><Button variant="secondary" className="w-full" onClick={() => onNavigate('Risks')}>Review exceptions <ArrowRight /></Button></CardContent></Card></section>
    <section><SectionTitle title="Executive signal" subtitle="A concise view of delivery health and exposure." /><div className="mt-4 grid grid-cols-4 gap-4"><Metric label="Active portfolio" value={`${visible.length}`} detail="initiatives in current scope" icon={Layers3} /><Metric label="On track" value={`${visible.filter((item: Initiative) => item.status === 'On Track').length}`} detail="delivery confidence" icon={CheckCircle2} /><Metric label="Exceptions" value={`${delayed.length}`} detail="delayed initiatives" icon={ShieldAlert} /><Metric label="Investment" value="$436k" detail="Phoenix approved" icon={CircleDollarSign} /></div></section>
    <section className="grid grid-cols-[1.1fr_1fr] gap-6"><Card><CardHeader><CardTitle>Portfolio buckets</CardTitle></CardHeader><CardContent className="grid grid-cols-3 gap-3">{[['Run', '2', Gauge], ['Grow', '3', Sparkles], ['Transform', '2', Network]].map(([label, value, Icon]) => { const TileIcon = Icon as ComponentType<{ className?: string }>; return <button type="button" key={label as string} onClick={() => onNavigate('Explore')} className="border bg-background p-5 text-left"><TileIcon className="size-5" /><p className="mt-5 text-2xl font-bold">{value as string}</p><p className="text-sm text-muted-foreground">{label as string}</p></button>; })}</CardContent></Card>
    <Card><CardHeader><CardTitle>Priority matrix</CardTitle></CardHeader><CardContent><div className="grid h-44 grid-cols-2 grid-rows-2 gap-2 text-sm"><button type="button" onClick={() => onOpen(initiatives[0])} className="bg-primary p-4 text-left text-primary-foreground"><b>Protect</b><br />Elaprase MES</button><button type="button" onClick={() => onNavigate('Risks')} className="bg-accent p-4 text-left text-accent-foreground"><b>Recover</b><br />APMS & LIMS</button><div className="bg-muted p-4 text-muted-foreground"><b>Monitor</b><br />Phoenix funding</div><div className="border p-4"><b>Sustain</b><br />SAIL closeout</div></div></CardContent></Card></section>
    <section><SectionTitle title="Attention exceptions" subtitle="Click an exception to see context, evidence, and next action." /><div className="mt-4 space-y-3">{(delayed.length ? delayed : initiatives.filter((item: Initiative) => item.status === 'Delayed')).map((item: Initiative) => <InitiativeRow key={item.key} item={item} onOpen={onOpen} />)}</div></section>
  </div>;
}

function Detail({ item, onBack }: { item: Initiative; onBack: () => void }) { return <div className="space-y-6"><Button variant="ghost" onClick={onBack}><ArrowLeft />Back</Button><div className="grid grid-cols-[1fr_360px] gap-6"><Card className={statusClass[item.status]}><CardHeader><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">{item.site} · {item.platform}</p><CardTitle className="mt-2 text-2xl">{item.name}</CardTitle></div><StatusBadge status={item.status} /></div></CardHeader><CardContent className="space-y-6"><p>{item.note}</p><div className="grid grid-cols-3 gap-4"><div className="border p-4"><p className="text-sm text-muted-foreground">Jira</p><JiraLink code={item.key} /></div><div className="border p-4"><p className="text-sm text-muted-foreground">SPOT</p>{item.spot ? <SpotLink id={item.spot} /> : <IntegrationChip />}</div><div className="border p-4"><p className="text-sm text-muted-foreground">Investment</p><p className="font-bold">{item.investment ? `$${(item.investment / 1000).toFixed(0)}k` : 'Not linked'}</p></div></div>{item.key === 'DDTTO-12' && <div className="bg-primary p-5 text-primary-foreground"><p className="text-sm font-semibold">Golden thread</p><p className="mt-1 text-xl font-bold">TO MES Elaprase DS → DDTTO-12 → SPOT 1024096</p></div>}</CardContent></Card><Card><CardHeader><CardTitle>Context and Action</CardTitle></CardHeader><CardContent className="space-y-4"><div><p className="font-semibold">Decision context</p><p className="text-sm text-muted-foreground">Status is based on seeded briefing evidence.</p></div><div><p className="font-semibold">Next action</p><p className="text-sm text-muted-foreground">Validate ownership and next milestone at the leadership cadence.</p></div><IntegrationChip /></CardContent></Card></div></div>; }

function Explore({ platform, setPlatform, onBriefing, onOpen }: { platform: string | null; setPlatform: (value: string | null) => void; onBriefing: () => void; onOpen: (item: Initiative) => void }) { const platforms = [['MES', Factory], ['LIMS', FlaskConical], ['APMS', Gauge], ['SAIL', Radar], ['Phoenix', Boxes]] as const; const matches = platform ? initiatives.filter((item: Initiative) => item.platform === platform) : []; return <div className="space-y-6"><div className="flex items-center gap-2 text-sm"><button type="button" className="font-semibold underline" onClick={onBriefing}>Briefing</button><ChevronRight className="size-4" /><button type="button" onClick={() => setPlatform(null)}>Explore</button>{platform && <><ChevronRight className="size-4" /><span>{platform}</span></>}</div><SectionTitle title={platform ? `${platform} deployment view` : 'Explore the network'} subtitle="Select a platform or site to drill into delivery context." />{platform ? <div className="space-y-3">{matches.map((item: Initiative) => <InitiativeRow key={item.key} item={item} onOpen={onOpen} />)}<Button variant="outline" onClick={() => setPlatform(null)}><ArrowLeft />All platforms</Button></div> : <><div className="grid grid-cols-5 gap-4">{platforms.map(([name, Icon]) => <button type="button" key={name} onClick={() => setPlatform(name)} className="bg-card p-5 text-left text-card-foreground shadow-sm hover:ring-2 hover:ring-accent"><Icon className="size-6" /><p className="mt-8 text-lg font-bold">{name}</p><p className="text-sm text-muted-foreground">Open deployment view</p></button>)}</div><Card><CardHeader><CardTitle>18 GSQ sites</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-2">{sites.map(([code, name]) => <button key={code} type="button" onClick={() => setPlatform(code === 'GRA' || code === 'VAS' ? 'LIMS' : 'MES')} className="border bg-background px-4 py-2 text-sm font-semibold hover:border-accent">{code} · {name}</button>)}</CardContent></Card></>}</div>; }

function Roadmap({ items, onOpen }: { items: Initiative[]; onOpen: (item: Initiative) => void }) { return <div className="space-y-6"><SectionTitle title="Roadmap" subtitle="Major delivery markers for the selected site and scope." /><div className="grid grid-cols-5 gap-3">{['Q1', 'Q2', 'Q3', 'Q4', 'Closeout'].map((quarter: string, index: number) => <Card key={quarter}><CardHeader><CardTitle className="text-base">{quarter}</CardTitle></CardHeader><CardContent>{items[index] ? <button type="button" onClick={() => onOpen(items[index])} className="w-full border-l-4 border-l-accent bg-background p-3 text-left"><b>{items[index].name}</b><p className="mt-1 text-xs text-muted-foreground">{index === 3 ? 'Last go live' : 'Decision milestone'}</p></button> : <p className="text-sm text-muted-foreground">No seeded milestone</p>}</CardContent></Card>)}</div><Card><CardHeader><CardTitle>Roadmap evidence</CardTitle></CardHeader><CardContent className="space-y-3">{items.map((item: Initiative) => <InitiativeRow key={item.key} item={item} onOpen={onOpen} />)}</CardContent></Card></div>; }
function Capability({ audience, site }: { audience: string; site: string }) { const capabilities = [['Process readiness', 72], ['Technology foundation', 84], ['Data readiness', 61], ['People & adoption', 76], ['Governance', 68]] as const; return <div className="space-y-6"><SectionTitle title="Capability" subtitle={`${site} capability view tuned for ${audience}.`} /><div className="grid grid-cols-[1fr_340px] gap-6"><Card><CardHeader><CardTitle>Capability profile</CardTitle></CardHeader><CardContent className="space-y-5">{capabilities.map(([name, score]) => <div key={name}><div className="mb-2 flex justify-between text-sm"><span className="font-semibold">{name}</span><span>{score}%</span></div><Progress value={score} /></div>)}</CardContent></Card><Card className="bg-primary text-primary-foreground"><CardHeader><CardTitle className="text-primary-foreground">Leadership readout</CardTitle></CardHeader><CardContent className="space-y-4 text-sm"><p>Technology foundation is strongest.</p><p>Data readiness is the gating capability for LIMS recovery.</p><IntegrationChip /></CardContent></Card></div></div>; }
function Money({ items, onOpen }: { items: Initiative[]; onOpen: (item: Initiative) => void }) { const phoenix = initiatives.find((item: Initiative) => item.key === 'DDTTO-22')!; return <div className="space-y-6"><SectionTitle title="Money" subtitle="Executive investment signal; financial system detail requires integration." /><div className="grid grid-cols-3 gap-4"><Metric label="Phoenix approved" value="$436k" detail="FY26 seeded investment" icon={CircleDollarSign} /><Metric label="Current scope" value={`$${items.reduce((total: number, item: Initiative) => total + (item.investment ?? 0), 0) / 1000}k`} detail="linked seed amount" icon={Landmark} /><Card><CardContent className="flex h-full flex-col justify-between p-5"><IntegrationChip /><p className="text-sm text-muted-foreground">Actuals and forecasts require a future finance integration.</p></CardContent></Card></div><InitiativeRow item={phoenix} onOpen={onOpen} /></div>; }
function Risks({ items, onOpen }: { items: Initiative[]; onOpen: (item: Initiative) => void }) { const exceptions = items.filter((item: Initiative) => item.status !== 'On Track'); const fallback = initiatives.filter((item: Initiative) => item.status !== 'On Track'); return <div className="space-y-6"><SectionTitle title="Risks and exceptions" subtitle="Delayed and at-risk work, ordered for leadership attention." /><div className="space-y-3">{(exceptions.length ? exceptions : fallback).map((item: Initiative) => <InitiativeRow key={item.key} item={item} onOpen={onOpen} />)}</div><Card><CardHeader><CardTitle>Response discipline</CardTitle></CardHeader><CardContent className="grid grid-cols-3 gap-4 text-sm"><div className="border p-4"><b>1 · Own</b><p className="mt-2 text-muted-foreground">Named owner and recovery date.</p></div><div className="border p-4"><b>2 · Evidence</b><p className="mt-2 text-muted-foreground">Jira and SPOT references linked.</p></div><div className="border p-4"><b>3 · Escalate</b><p className="mt-2 text-muted-foreground">Decision required at next cadence.</p></div></CardContent></Card></div>; }
const COPILOT_AGENT = 'new_gsqDdtExecPlatformStd';
const COPILOT_NOTIFICATION_URL = 'https://notificationurlplaceholder';

function siteName(code: string) {
  return sites.find((item) => item[0] === code)?.[1] ?? code;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  return value as Record<string, unknown>;
}

function conversationIdFrom(value: unknown): string | undefined {
  const record = asRecord(value);
  if (!record) return undefined;
  const id = record.conversationId ?? record.ConversationId ?? record.conversationID;
  return typeof id === 'string' && id.trim() ? id : undefined;
}

function lastResponseFrom(value: unknown): string | undefined {
  const record = asRecord(value);
  if (!record) return undefined;
  const last = record.lastResponse ?? record.LastResponse;
  if (typeof last === 'string' && last.trim()) return last.trim();
  const responses = record.responses ?? record.Responses;
  if (Array.isArray(responses)) {
    const text = responses.find((item) => typeof item === 'string' && item.trim());
    if (typeof text === 'string') return text.trim();
  }
  return undefined;
}

function AskCopilot({ site, scope, audience, onNavigate }: { site: string; scope: string; audience: string; onNavigate: (tab: Tab) => void }) {
  const prompts: { label: string; tab: Tab }[] = [
    { label: 'Walk me into Thousand Oaks', tab: 'Briefing' },
    { label: "What's on fire?", tab: 'Risks' },
    { label: 'What just went live?', tab: 'Roadmap' },
    { label: "What's happening with LIMS?", tab: 'Explore' },
    { label: 'What do I need from Elaine?', tab: 'Briefing' },
  ];
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [lastResponse, setLastResponse] = useState<string | undefined>();
  const [failed, setFailed] = useState(false);

  const send = async () => {
    const userText = draft.trim();
    if (!userText || busy) return;
    setBusy(true);
    setFailed(false);
    try {
      const result = await MicrosoftCopilotStudioService.ExecuteCopilotAsyncV2(
        COPILOT_AGENT,
        {
          message: `Site=${siteName(site)} Scope=${scope} Audience=${audience}\n${userText}`,
          notificationUrl: COPILOT_NOTIFICATION_URL,
        },
        conversationId,
      );
      const payload = result.success ? result.data : undefined;
      const nextId = conversationIdFrom(payload) ?? conversationIdFrom(result);
      if (nextId) setConversationId(nextId);
      const reply = lastResponseFrom(payload) ?? lastResponseFrom(result);
      if (!result.success || !reply) {
        setLastResponse(undefined);
        setFailed(true);
      } else {
        setLastResponse(reply);
      }
    } catch {
      setLastResponse(undefined);
      setFailed(true);
    } finally {
      setBusy(false);
      setDraft('');
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <SectionTitle title="Ask Copilot" subtitle="Chips stay free and navigate. Free text calls the published GSQ DD&T executive agent." />
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-4 text-primary-foreground"><Bot className="size-8" /></div>
            <div>
              <h3 className="text-lg font-bold">GSQ DD&T executive agent</h3>
              <p className="text-sm text-muted-foreground">
                {busy ? 'Waiting on the agent…' : lastResponse ? 'Latest executive answer' : 'Ask a leadership question in free text.'}
              </p>
            </div>
            {failed && <div className="ml-auto"><IntegrationChip /></div>}
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {prompts.map((prompt) => (
              <Button key={prompt.label} variant="outline" className="h-14 justify-between" onClick={() => onNavigate(prompt.tab)}>
                {prompt.label}<ArrowRight />
              </Button>
            ))}
          </div>
          {(lastResponse || failed) && (
            <Card className="mt-8">
              <CardHeader><CardTitle>{failed ? 'Integration needed' : 'Executive card'}</CardTitle></CardHeader>
              <CardContent className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                {failed ? 'The agent could not be reached. Allow the Microsoft Copilot Studio connection and try again.' : lastResponse}
              </CardContent>
            </Card>
          )}
          <div className="mt-8 flex gap-2">
            <Input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => { if (event.key === 'Enter') void send(); }}
              placeholder="Ask the published agent"
              disabled={busy}
            />
            <Button onClick={() => void send()} disabled={busy || !draft.trim()}>
              <MessageSquareText />{busy ? 'Sending' : 'Send'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
function SiteInput() { return <div className="mx-auto max-w-4xl space-y-6"><SectionTitle title="Site input" subtitle="The briefing is read-only. SharePoint is the only approved write path." /><Card><CardContent className="p-8"><div className="flex items-start gap-5"><div className="bg-primary p-4 text-primary-foreground"><Building2 className="size-8" /></div><div className="flex-1"><h3 className="text-xl font-bold">Maintain source updates in SharePoint</h3><p className="mt-2 text-muted-foreground">No data is written from this app. Continue to the approved SharePoint site to maintain source updates.</p><div className="mt-5"><Button asChild><a href="https://mytakeda.sharepoint.com/sites/GSQExecutivePlatform" target="_blank" rel="noreferrer">Open in SharePoint <ExternalLink /></a></Button></div></div></div></CardContent></Card><Card><CardHeader><CardTitle>Submission checklist</CardTitle></CardHeader><CardContent className="grid grid-cols-3 gap-4 text-sm"><div className="border p-4"><CalendarRange className="size-5" /><p className="mt-3 font-semibold">Update milestones</p></div><div className="border p-4"><ShieldAlert className="size-5" /><p className="mt-3 font-semibold">Confirm exceptions</p></div><div className="border p-4"><CircleDollarSign className="size-5" /><p className="mt-3 font-semibold">Reconcile investment</p></div></CardContent></Card></div>; }
