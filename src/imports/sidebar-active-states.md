Refactor the sidebar navigation to support active states per page.
Do not redesign the sidebar. Only add correct active states and update page mapping.

1. Create Sidebar Component Variants

Convert the sidebar into a component with variants.

Create variants for:

Dashboard (active)

Meetings (active)

Insights (active)

Settings (active)

Sub-page (no primary tab active)

Active state styling:

Active item background: light blue highlight

Active icon + text: primary blue

Inactive items: gray

2. Apply Correct Sidebar Variant Per Page

Update each page to use the correct sidebar variant:

Dashboard page → Dashboard active

Meetings page → Meetings active

Insights page → Insights active

Settings page → Settings active

Meeting Summary page → Sub-page variant (no tab highlighted)

The Meeting Summary screen is a detail view of a meeting, not the Meetings hub.

No sidebar item should be highlighted on this page.

3. Add Breadcrumb to Meeting Summary Page

At the top of the Meeting Summary page, add a breadcrumb:

Meetings / Product Standup

Style:

Small gray text

Positioned above “Meeting Summary” title

This clarifies navigation hierarchy.

Goal

The sidebar should always reflect the user’s location in the product.
Detail pages must not highlight the parent navigation item.