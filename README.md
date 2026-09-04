# MyMCP

A control panel for running MCP servers across a team's editors. It tracks which MCP
features exist and how far each has been adopted, generates the per-IDE config files
that wire those servers up (VS Code, Cursor, Windsurf, Zed, Neovim), holds a shared
knowledge base and AI user-rules set, and runs a small project/task board alongside.

The problem it solves: every editor wants MCP configured differently, and a team ends
up with five hand-maintained JSON files that drift. This generates them from one server
definition and shows you who has adopted what.

---

## Status

**Working prototype.** UI and API both real; single-user, no auth. Last worked on
14 October 2025.

| | |
|---|---|
| Size | ~4,000 lines TypeScript |
| Web | 21 components across three views — Project Manager, Knowledge Base, Settings |
| API | 15 endpoints (Express + Prisma over MySQL) |
| Database | 5 Prisma models — `Project`, `Task`, `KnowledgeEntry`, `AiUserRule`, `McpFeature` |
| Config generators | 5 editors — VS Code / Cursor, Windsurf, Zed, Neovim |
| Auth | None. Anyone who reaches the port has full access |
| Tests | None |
| Verified | Runs under `docker compose up`; no clean-machine test |

### What is built

**Project Manager** — project list, per-project Kanban board (To Do / In Progress /
Review / Done), task create-edit-delete with priority.

**MCP feature registry** — features are described in `ide-config/mcpFeatures.json` with
inputs, outputs, endpoint, IDE surfacing points, environment dependencies, validation
criteria and a risk note. `FeatureAdoptionBoard` tracks each one through Backlog →
InProgress → In Review → Validated → Released. Five features are defined:
`search_knowledge`, `create_project_issue`, `scaffold_config_file`, `get_server_status`,
`realtime_task_update`.

**IDE integrations** — `ide-config/mcpGenerators.ts` emits the config each editor
expects from a shared `McpServer[]` definition. `ManualStepsModal` covers the parts that
cannot be automated. Generated examples live under `artifacts/configs/`.

**Knowledge base** — typed entries (technical or business) with source, tags and
add/edit/delete.

**AI user rules** — a manager for the rule set fed to coding assistants, with per-rule
active toggles and categories.

**DevOps cheatsheet** and a **release-notes viewer** round out the Settings view.

### Gaps

No authentication, no multi-user model, no tests. The MCP feature registry is a
*catalogue* — this app tracks and configures MCP servers, it does not host one.

---

## Stack

React 18 · TypeScript · Vite · Tailwind · Express · Prisma · MySQL · Docker Compose · nginx

---

## Running it

```bash
docker compose up --build
```

Ports come from `.env`: `APP_PORT` for the nginx-served UI, `API_PORT` (default 8080)
for the API, `DB_PORT` for MySQL. A one-shot `migrations` service runs
`prisma generate && db push && db seed` before the API starts, seeding from
`api/ide-config-seed/`. `scripts/migrate.sh` does the same by hand.

Locally without Docker:

```bash
npm install && npm run dev          # front end
cd api && npm install && npm run dev  # API — needs DATABASE_URL
```

---

## Layout

```
components/        21 React components — project, knowledge, feature, IDE, settings views
ide-config/        the interesting part:
  mcpFeatures.json   feature definitions with validation and adoption status
  mcpGenerators.ts   per-editor config emitters
  mcpServerRegistry.ts
  ideRegistry.tsx    supported editors
  ideUserRules.ts / aiUserRules.ts
api/
  server.ts        15 endpoints
  prisma/          5 models
artifacts/         generated configs, env samples, audit output, patches
```
