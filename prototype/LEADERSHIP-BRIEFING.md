# GSQ DD&T Leadership Briefing (duplicate)

The live workbench stays frozen. This copy is the Joel / site-LT briefing experience.

## Two apps

| App | Role | Where |
| --- | --- | --- |
| **GSQ EP Prototype** (original) | Frozen workbench / mapping | App `6578df9f-308b-466e-ac80-3f99f06830c8` — see [`ORIGINAL-APP-FROZEN.md`](ORIGINAL-APP-FROZEN.md) |
| **GSQ DD and T Leadership Briefing** (copy) | Exception-first briefing | Play [`69ecf8db-…`](https://apps.powerapps.com/play/e/0f7bbacc-ed0b-efbc-9497-b5b75c96f91e/app/69ecf8db-3884-4680-9c3e-62f73d9d273c?tenantId=57fdf63b-7e22-45a3-83dc-d37003163aae) · Vibe project `d7c5eb38-e1ac-4dad-b679-231853a8793c` · spec [`design-assets/mockups/leadership-briefing.html`](../design-assets/mockups/leadership-briefing.html) |

Vibe has no Save as. The copy is a **new** project created from the briefing spec. Do not send prompts to the original.

## How to iterate the copy

1. Open only the new Vibe project `d7c5eb38-…`.
2. Paste follow-ups from [`vibe-leadership-briefing.txt`](vibe-leadership-briefing.txt) into Copilot.
3. Publish **updates** (never Change data source).

## Tabs (copy only)

Briefing (default) · Explore · Roadmap · Capability · Money · Risks · Ask Copilot · Site input

Golden path on Briefing: **Portfolio → Attention → Priority → Context → Action**.

Ask Copilot chips still navigate for free. Free-text calls the published **standard-harness** Copilot Studio agent **GSQ DD and T Executive Platform Agent** (schema `new_gsqDdtExecPlatformStd`) via `ExecuteCopilotAsyncV2`. First open: Allow the Microsoft Copilot Studio connection if prompted. Studio: https://copilotstudio.microsoft.com/environments/0f7bbacc-ed0b-efbc-9497-b5b75c96f91e/bots/145ef9c6-06af-f111-aaac-7c1e528d5edf/overview

The older GitHub Copilot harness agent **GSQDDTExecPlatformAgent** (`cr8d8_gsqddtexecplatformagent_350mvj`) cannot be used by this connector.

Published on the Leadership Briefing copy only (12 Sep 2026, 5:10pm). Play: https://apps.powerapps.com/play/e/0f7bbacc-ed0b-efbc-9497-b5b75c96f91e/app/69ecf8db-3884-4680-9c3e-62f73d9d273c?tenantId=57fdf63b-7e22-45a3-83dc-d37003163aae

Power Apps connection (Thousand Oaks Applications Dev):

- Display name: **GSQDDTExecPlatformAgent**
- Connector: `shared_microsoftcopilotstudio`
- Connection id: `7b8bcd1e7fc94a5e9b16ee28cb62b24a`
- Status: Connected
- Details: https://make.powerapps.com/environments/0f7bbacc-ed0b-efbc-9497-b5b75c96f91e/connections/shared_microsoftcopilotstudio/7b8bcd1e7fc94a5e9b16ee28cb62b24a/details

The published app now has two connection references: Microsoft MCP Servers and Microsoft Copilot Studio (`1c5f2396-6f9c-43e5-bc7e-e35e589a5aa2`). First play: Allow **GSQDDTExecPlatformAgent**. Vibe `power.config.json` is system-managed and still lists only MCP; a later Vibe Publish updates can strip MCS unless that reference is put back. Do not attach this connector to GSQ EP Prototype.
