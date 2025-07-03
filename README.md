# 📚 Portal Configuration & Navigation Guide

---

## 1 Folder structure (TL;DR)

```
my-new-dir/
 ├─ public/
 │   └─ active-config/config.json   ← ONE file → overrides everything
 │
 ├─ src/registries/
 │   ├─ componentRegistry.ts       ← Map string → lazy React component
 │   └─ actionRegistry.ts          ← Map string → function(params?)
 │
 └─ src/shared/config/…
     ├─ config.manager.ts          ← Loads + validates config, injects CSS vars
     └─ dynamic-config.service.ts  ← Enriches nav + routes at runtime
```

_There is no other place to add routes or pages._

---

## 2 The JSON anatomy

```jsonc
{
  "name": "Portal name (optional)",
  "config": {
    "navigation": [ … ],     // required – drives the router
    "reports":    { … },     // optional – binds slugs to GenericReport
    "theme":      { … },     // colours, spacing, etc → auto CSS vars
    // …branding, layout, ui, features, api, auth
  }
}
```

### 2.1 Navigation leaf types

| kind (default = "report") | What happens                                                           |
| ------------------------- | ---------------------------------------------------------------------- |
| `report` or omitted       | Route renders `<GenericReport>` using the same slug in `reports` block |
| `component`               | Looks-up `componentRegistry[component]` and renders it                 |
| `action`                  | Executes `actionRegistry[action](params)` – no navigation              |

Example leaf:

```jsonc
{
  "slug": "force-reload",
  "label": "Reload",
  "kind": "action",
  "action": "forceReload",
  "params": { "clearCache": true }
}
```

### 2.2 Reports block

Key **must** equal navigation slug.

```jsonc
"daily-sales": {
  "name": "Daily Sales Report",
  "filters": ["scope","fromDate"],
  "options": { "scope": ["All","Region"], "withAutoTime": true }
}
```

_GenericReport_ auto-renders filter controls based on `filters` & `options`.

---

## 3 Registries – adding code hooks without touching router

### 3.1 componentRegistry.ts

```ts
export const componentRegistry = {
  StatsPanel: React.lazy(() => import("../views/StatsPanel")),
  BursterAction: React.lazy(
    () => import("../components/bursters/BursterActionPanel")
  ),
  // Add your own here
};
```

Refer to the key with `"component": "StatsPanel"` in navigation.

### 3.2 actionRegistry.ts

```ts
export const actionRegistry = {
  forceReload: () => window.location.reload(),
  showAlert: (p) => alert(p?.message ?? "Hello"),
  logout: () => {
    /* custom logout */
  },
};
```

Use `"kind":"action","action":"showAlert"` in navigation.

---

## 4 Runtime data-flow

```mermaid
flowchart TD
  A[config.json] -->|parse| B(configManager.set)
  B --> C[validate + merge]
  C --> D[dynamicConfig.generateNavigation]
  D --> E[nav enriched (element / onCallback)]
  E --> F[dynamicConfig.generateRoutes]
  F --> G[RouteBuilder]
  G --> H[React Router v6 tree]
```

Key point: **RouteBuilder never contains hard-coded slugs** – it only consumes the enriched nav.

---

## 5 Creating a new portal – 4 steps

1. Duplicate `public/sample-configs/advanced-retailer-config.json` → `public/active-config/config.json`
2. Edit branding, colours, navigation labels.
3. Add/rename report slugs & definitions.
4. If you need custom pages or actions, register them in one of the registries and reference them in navigation.

Refresh twice the first time (localStorage cache then live) – subsequent edits hot-reload.

---
