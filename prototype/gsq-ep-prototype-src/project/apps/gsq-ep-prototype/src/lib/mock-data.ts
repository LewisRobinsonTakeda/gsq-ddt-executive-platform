export type Site = { code: string; name: string; region: string };
export type Project = { id: string; site: string; name: string; jira: string; spot: string; approved: number; forecast: number; actual: number; rock: number; year: number; owner: string; status: string; description: string };

export const sites: Site[] = [
  { code: 'THO', name: 'Thousand Oaks', region: 'North America' },
  { code: 'LEX', name: 'Lexington', region: 'North America' },
];

export const rocks = ['One Day Batch Release', 'Lab of the Future', 'Predictive Maintenance', 'Rapid Digital Tech Transfer', 'Inventory Optimization', 'Power of Digital Twins'];
export const years = ['FY26 BUILD FOUNDATION', 'FY27 SCALE AND INTEGRATE', 'FY28+ TRANSFORM'];

export const projects: Project[] = [
  { id: 'tho-12', site: 'THO', name: 'MES Elaprase DS', jira: 'DDTTO-12', spot: '1024096', approved: 180000, forecast: 180000, actual: 92000, rock: 0, year: 0, owner: 'Manufacturing Digital', status: 'In progress', description: 'MES enablement for the Elaprase drug substance value stream.' },
  { id: 'tho-21', site: 'THO', name: 'NYMI Batch', jira: 'DDTTO-21', spot: '—', approved: 140000, forecast: 132000, actual: 61000, rock: 0, year: 0, owner: 'Digital Operations', status: 'On track', description: 'Digital batch review and manufacturing insight platform.' },
  { id: 'tho-14', site: 'THO', name: 'TO MES Dapnese DS', jira: 'DDTTO-14', spot: '—', approved: 155000, forecast: 150000, actual: 84000, rock: 0, year: 0, owner: 'Manufacturing Digital', status: 'In progress', description: 'Digital delivery initiative for Dapnese.' },
  { id: 'tho-31', site: 'THO', name: 'Labware LIMS', jira: 'DDTTO-31', spot: '—', approved: 125000, forecast: 120000, actual: 28000, rock: 1, year: 0, owner: 'Quality Digital', status: 'In progress', description: 'Line performance monitoring and operational insights.' },
  { id: 'tho-32', site: 'THO', name: 'LabX scales', jira: 'DDTTO-32', spot: '—', approved: 110000, forecast: 108000, actual: 36000, rock: 1, year: 0, owner: 'Quality Digital', status: 'On track', description: 'Laboratory digital capability delivery.' },
  { id: 'tho-54', site: 'THO', name: 'TO APMS', jira: 'DDTTO-54', spot: '—', approved: 210000, forecast: 205000, actual: 72000, rock: 2, year: 0, owner: 'Asset Reliability', status: 'In progress', description: 'Asset performance management and predictive maintenance.' },
  { id: 'tho-63', site: 'THO', name: 'LPMS rollout', jira: 'DDTTO-63', spot: '—', approved: 436000, forecast: 425000, actual: 144000, rock: 2, year: 0, owner: 'Asset Reliability', status: 'At risk', description: 'Advanced equipment health monitoring and reliability analytics.' },
  { id: 'tho-08', site: 'THO', name: 'TO SAIL — FDP', jira: 'DDTTO-08', spot: '—', approved: 220000, forecast: 216000, actual: 95000, rock: 3, year: 0, owner: 'Tech Transfer', status: 'On track', description: 'Digital technology transfer workflow delivery.' },
  { id: 'tho-58', site: 'THO', name: 'TO Takami', jira: 'DDTTO-58', spot: '—', approved: 190000, forecast: 186000, actual: 66000, rock: 3, year: 0, owner: 'Tech Transfer', status: 'In progress', description: 'Scale-up of digital technology transfer capabilities.' },
  { id: 'tho-41', site: 'THO', name: 'SAP warehouse', jira: 'DDTTO-41', spot: '—', approved: 160000, forecast: 154000, actual: 52000, rock: 4, year: 0, owner: 'Supply Chain Digital', status: 'On track', description: 'Inventory optimization and planning integration.' },
  { id: 'tho-70', site: 'THO', name: 'Discoverant feed', jira: 'DDTTO-70', spot: '—', approved: 175000, forecast: 170000, actual: 48000, rock: 5, year: 0, owner: 'Enterprise Data', status: 'In progress', description: 'Digital twin data foundation.' },
  { id: 'tho-80', site: 'THO', name: 'MES ↔ SAIL', jira: 'DDTTO-80', spot: '—', approved: 150000, forecast: 145000, actual: 18000, rock: 0, year: 1, owner: 'Digital Operations', status: 'Planned', description: 'Scale and integration for digital batch release.' },
  { id: 'tho-81', site: 'THO', name: 'Smart QC', jira: 'DDTTO-81', spot: '—', approved: 145000, forecast: 140000, actual: 15000, rock: 1, year: 1, owner: 'Quality Digital', status: 'Planned', description: 'Scaled laboratory digital capability.' },
  { id: 'tho-22', site: 'THO', name: 'Phoenix', jira: 'DDTTO-22', spot: '—', approved: 165000, forecast: 160000, actual: 22000, rock: 2, year: 1, owner: 'Asset Reliability', status: 'Planned', description: 'Predictive maintenance expansion.' },
  { id: 'tho-59', site: 'THO', name: 'Takami inventory', jira: 'DDTTO-59', spot: '—', approved: 185000, forecast: 180000, actual: 20000, rock: 3, year: 1, owner: 'Tech Transfer', status: 'Planned', description: 'Integrated technology transfer capability.' },
  { id: 'tho-71', site: 'THO', name: 'SIMCA Online', jira: 'DDTTO-71', spot: '—', approved: 170000, forecast: 165000, actual: 19000, rock: 4, year: 1, owner: 'Supply Chain Digital', status: 'Planned', description: 'Scaled inventory optimization capability.' },
  { id: 'tho-90', site: 'THO', name: 'Paperless Ops', jira: 'DDTTO-90', spot: '—', approved: 200000, forecast: 190000, actual: 8000, rock: 0, year: 2, owner: 'Digital Operations', status: 'Planned', description: 'Transformational batch release capability.' },
  { id: 'tho-64', site: 'THO', name: 'RTMS expand', jira: 'DDTTO-64', spot: '—', approved: 205000, forecast: 198000, actual: 7000, rock: 1, year: 2, owner: 'Asset Reliability', status: 'Planned', description: 'Real-time monitoring and advanced asset performance insights.' },
  { id: 'tho-72', site: 'THO', name: 'Enterprise data twin', jira: 'DDTTO-72', spot: '—', approved: 195000, forecast: 188000, actual: 9000, rock: 2, year: 2, owner: 'Asset Reliability', status: 'Planned', description: 'Transformed predictive maintenance capability.' },
  { id: 'lex-04', site: 'LEX', name: 'LEX SAIL Fill Line', jira: 'DDTLX-04', spot: '—', approved: 220000, forecast: 218000, actual: 76000, rock: 0, year: 0, owner: 'LEX Digital Delivery', status: 'On track', description: 'Lexington roadmap initiative.' },
  { id: 'lex-02', site: 'LEX', name: 'LEX MES suite', jira: 'DDTLX-02', spot: '—', approved: 190000, forecast: 188000, actual: 64000, rock: 1, year: 0, owner: 'LEX Digital Delivery', status: 'In progress', description: 'Lexington roadmap initiative.' },
  { id: 'lex-11', site: 'LEX', name: 'LEX Labware', jira: 'DDTLX-11', spot: '—', approved: 245000, forecast: 252000, actual: 88000, rock: 2, year: 0, owner: 'LEX Digital Delivery', status: 'At risk', description: 'Lexington roadmap initiative.' },
  { id: 'lex-33', site: 'LEX', name: 'LEX LPMS', jira: 'DDTLX-33', spot: '—', approved: 175000, forecast: 170000, actual: 51000, rock: 3, year: 0, owner: 'LEX Digital Delivery', status: 'On track', description: 'Lexington roadmap initiative.' },
  { id: 'lex-20', site: 'LEX', name: 'LEX Phoenix', jira: 'DDTLX-20', spot: '—', approved: 155000, forecast: 150000, actual: 42000, rock: 4, year: 0, owner: 'LEX Digital Delivery', status: 'In progress', description: 'Lexington roadmap initiative.' },
];