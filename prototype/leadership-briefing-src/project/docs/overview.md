# GSQ DD and T Leadership Briefing

## Overview
GSQ DD and T Leadership Briefing is a desktop executive workspace for fast site and network reviews. It brings portfolio health, delivery exceptions, roadmap, capability, investment, and risk context into one briefing flow with clear drill-down and back-navigation.

## Roles
- **Executive:** sees the signal, decisions, and material exceptions.
- **Site DD and T:** reviews site priorities, dependencies, and actions.
- **Delivery:** follows milestones, risks, and recovery needs.

## Core scenarios
- Start at the Thousand Oaks briefing and move from KPI signal to initiative detail.
- Switch between site and network scope while retaining the selected audience.
- Explore platforms and the 18-site network, including LIMS deployments at GRA and VAS.
- Follow Jira and SPOT references as outbound links only.
- Use suggested Copilot prompts as navigation shortcuts while chat remains unavailable.
- Open the approved GSQ Executive Platform SharePoint site as the only write path; the app itself remains read-only.

## Design direction
A disciplined Takeda Custom 1 executive interface: light gray page, white cards, navy hierarchy, and restrained red accents. Status uses green for On Track, amber for At Risk, and deep red for Delayed. The experience is optimized for 1920×1080 and English only.

## Constraints
No new connectors, no SharePoint patching, and no Jira or SPOT writes. All briefing content is seeded locally; external systems are outbound destinations only.