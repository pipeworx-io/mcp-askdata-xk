interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Kosovo Agency of Statistics (ASKdata) PxWeb MCP.
 *
 * Keyless PxWeb API. The root (`/`) returns a list of databases ({dbid}),
 * not folders — so navigation starts at the "ASKdata" database. Below that,
 * each node is either a folder (type "l") or a table (type "t", id ends ".px").
 * Tables are addressed by their full path including the trailing ".px" suffix.
 * Path segments may contain spaces (URL-encoded by fetch). PxWeb enforces a
 * per-query cell limit (~10,000 cells); narrow your selection if a query is
 * rejected for being too large.
 */


const BASE = 'https://askdata.rks-gov.net/api/v1/en';
const UA = 'pipeworx-mcp-askdata-xk/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'subjects',
    description: 'Navigate the subject tree. Root lists databases ({dbid}); start at "ASKdata".',
    inputSchema: {
      type: 'object',
      properties: { path: { type: 'string', description: 'Sub-path (default "ASKdata" = top database). e.g. "ASKdata/Prices/Consumer Price Index".' } },
    },
  },
  {
    name: 'table_meta',
    description: 'Table definition (dimensions, valid values). Path must end in ".px".',
    inputSchema: {
      type: 'object',
      properties: { path: { type: 'string', description: 'e.g. "ASKdata/Prices/Consumer Price Index/Annual indicators/T4CPI.px"' } },
      required: ['path'],
    },
  },
  {
    name: 'query_table',
    description: 'Pull data from a table (path ends in ".px"). body is a PxWeb query object. Mind the ~10,000-cell limit.',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'e.g. "ASKdata/Prices/Consumer Price Index/Annual indicators/T4CPI.px"' },
        body: { type: 'object', description: '{query: [{code, selection: {filter, values}}], response: {format: "json-stat2"}}' },
      },
      required: ['path', 'body'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'subjects': {
      const path = (args.path as string | undefined)?.replace(/^\/+|\/+$/g, '') || 'ASKdata';
      return askGet(`/${path}`);
    }
    case 'table_meta':
      return askGet(`/${reqStr(args, 'path', '"ASKdata/Prices/Consumer Price Index/Annual indicators/T4CPI.px"').replace(/^\/+|\/+$/g, '')}`);
    case 'query_table': {
      const path = reqStr(args, 'path', '"ASKdata/Prices/Consumer Price Index/Annual indicators/T4CPI.px"').replace(/^\/+|\/+$/g, '');
      const body = args.body;
      if (!body || typeof body !== 'object') throw new Error('body must be a PxWeb query object.');
      const res = await fetch(`${BASE}/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'User-Agent': UA },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`ASKdata: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
      return res.json();
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function askGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (!res.ok) throw new Error(`ASKdata: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
