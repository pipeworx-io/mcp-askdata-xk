# mcp-askdata-xk

Kosovo Agency of Statistics (ASKdata) PxWeb MCP.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Askdata Xk data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
