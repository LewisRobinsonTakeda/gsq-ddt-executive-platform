# GSQ EP Prototype

## Product
- Maintain one desktop-first 1920×1080 React app named **GSQ EP Prototype** with the product title **DD&T Executive Platform**.
- Default to **THO Thousand Oaks** and keep the selected site as the scope for roadmap, KPI, budget, risk, capability, and review content.

## Global shell
- Keep exactly seven tabs in this order: **One pager, Status KPIs, Gantt + Budget, Budget, Risks, Capability, Business Review**.
- Keep the **Site input** action as a full Takeda red rounded pill immediately after Business Review, aligned at the far right of the same row.
- Site input opens `https://mytakeda.sharepoint.com/sites/GSQExecutivePlatform/SitePages/Site-Input.aspx` in a new browser window; there is no in-app Site input screen.
- Jira and Network have no tabs, pills, routes, or screens.

## Data behavior
- Preserve the existing live SharePoint bindings for OnePager, Risks, Commentary, LeadershipAsks, IntegrationsTracker, and CapabilityTracker.
- Preserve Capability SharePoint bindings without substituting the new draft Capability entity.
- Use the revised live SharePoint **BudgetTracker** binding for the Budget tab and Gantt budget panel, filtered by selected `SiteCode`.
- BudgetTracker supplies OPEX, CAPEX, depreciation, fiscal year, project description, site, SPOT reference, funding note, and value-creation fields.
- Do not add Jira, SPOT, MYC, or other connectors.
- Do not write back to Jira, SPOT, MYC, or SharePoint.

## Visual direction
- Use a dense executive control-room interface optimized for Chrome at 1920×1080.
- Continue the semantic navy, Takeda red, mist, green, and amber palette with accessible foreground contrast.
- Ensure all seven tabs and the Site input pill remain fully readable and inside the 1920px canvas.

## Boundaries
- No Jira or Network navigation or screens.
- No in-app Site input view.
- No new connectors.
- No changes to Capability SharePoint binds.

## Acceptance checks
- Tabs appear in the required seven-item order.
- Site input is fully visible, reads **Site input**, uses Takeda red `#E1242A`, and opens the specified SharePoint page in a new window.
- Budget surfaces consume BudgetTracker SharePoint data for the selected site and handle loading, error, and empty states.
- Capability continues to use IntegrationsTracker and CapabilityTracker SharePoint hooks.
- Final project validation passes with no errors.
