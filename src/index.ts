import 'dotenv/config';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { search } from './search.js';
import { write } from './write.js';
import { update } from './update.js';

const server = new Server(
  { name: 'conductor-lsm', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'lsm_search',
      description: 'Search the Living System Model for relevant architectural decisions, past failures, and context. Call this before starting any task to load relevant history.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Natural language search query' },
          project: { type: 'string', description: 'Project name (default: conductor)' },
          limit: { type: 'number', description: 'Max results (default: 5)' },
        },
        required: ['query'],
      },
    },
    {
      name: 'lsm_write',
      description: 'Write a new entry to the Living System Model. Call this after any architectural decision, discovered failure, or important context change.',
      inputSchema: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            enum: ['decision', 'failure', 'debt', 'architecture', 'context'],
            description: 'Entry type',
          },
          title: { type: 'string', description: 'Short title (1 sentence)' },
          body: { type: 'string', description: 'Full description' },
          why: { type: 'string', description: 'Rationale (required for decisions)' },
          tried_and_failed: { type: 'string', description: 'What was tried before' },
          tags: { type: 'array', items: { type: 'string' }, description: 'Topic tags' },
          project: { type: 'string', description: 'Project name (default: conductor)' },
        },
        required: ['category', 'title', 'body'],
      },
    },
    {
      name: 'lsm_update',
      description: 'Update an existing LSM entry by ID. Re-embeds the entry if title, body, or why changes. Use when a past decision was wrong or incomplete.',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Entry ID (from lsm_search results)' },
          title: { type: 'string', description: 'Updated title' },
          body: { type: 'string', description: 'Updated body' },
          why: { type: 'string', description: 'Updated rationale' },
          tried_and_failed: { type: 'string', description: 'Updated tried_and_failed' },
          tags: { type: 'array', items: { type: 'string' }, description: 'Updated tags' },
        },
        required: ['id'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'lsm_search') {
      const { query, project, limit } = args as { query: string; project?: string; limit?: number };
      const results = await search(query, project, limit);
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    }

    if (name === 'lsm_write') {
      const result = await write(args as unknown as Parameters<typeof write>[0]);
      return {
        content: [{ type: 'text', text: JSON.stringify(result) }],
      };
    }

    if (name === 'lsm_update') {
      const result = await update(args as unknown as Parameters<typeof update>[0]);
      return {
        content: [{ type: 'text', text: JSON.stringify(result) }],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      content: [{ type: 'text', text: `Error: ${message}` }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
