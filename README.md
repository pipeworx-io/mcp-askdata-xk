# mcp-askdata-xk

Kosovo Agency of Statistics (ASKdata) PxWeb MCP.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 693+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `subjects` | Navigate the subject tree. Root lists databases ({dbid}); start at "ASKdata". |
| `table_meta` | Table definition (dimensions, valid values). Path must end in ".px". |
| `query_table` | Pull data from a table (path ends in ".px"). body is a PxWeb query object. Mind the ~10,000-cell limit. |

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

Or connect to the full Pipeworx gateway for access to all 693+ data sources:

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

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
