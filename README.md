# mcp-askdata-xk

Kosovo Agency of Statistics (ASKdata) PxWeb MCP.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1476+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `subjects` | Browse the Kosovo Agency of Statistics (ASKdata) PxWeb subject tree. Default path 'ASKdata' returns top-level folders (type 'l') and tables (type 't', '.px' suffix). Supply a deeper sub-path like 'ASKdata/Prices/Consumer Price Index' to drill into a subject area. |
| `table_meta` | Fetch dimension definitions and valid coded values for a Kosovo ASKdata PxWeb table. Path must be the full path ending in '.px' (e.g. 'ASKdata/Prices/Consumer Price Index/Annual indicators/T4CPI.px'). Returns dimensions and value lists — required to build a valid query_table body. |
| `query_table` | POST a PxWeb query to a Kosovo ASKdata table and return observations as json-stat2. body must be {query:[{code, selection:{filter,values}}], response:{format:'json-stat2'}}. PxWeb caps responses at ~10,000 cells — use codes from table_meta to narrow selections across dimensions. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "askdata-xk": {
      "url": "https://gateway.pipeworx.io/askdata-xk/mcp"
    }
  }
}
```

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/askdata-xk/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1476+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Askdata Xk data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT

## No MCP client? Call it over HTTP

```bash
curl -X POST https://gateway.pipeworx.io/v1/tools/askdata_xk_subjects \
  -H 'Content-Type: application/json' \
  -d '{"path":"ASKdata"}'
```

No account needed for the first calls. Inspect any tool: `GET https://gateway.pipeworx.io/v1/tools/askdata_xk_subjects`. Find one: `POST https://gateway.pipeworx.io/v1/tools/search_packs` with `{"query":"..."}`.
