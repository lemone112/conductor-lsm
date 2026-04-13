import { randomUUID } from 'node:crypto';
import { append } from './db.js';
import { embedDocument } from './embed.js';
import { LsmEntry } from './types.js';

export interface WriteInput {
  project?: string;
  category: LsmEntry['category'];
  title: string;
  body: string;
  why?: string;
  tried_and_failed?: string;
  tags?: string[];
  source?: string;
}

export async function write(input: WriteInput): Promise<{ id: string }> {
  const text = `${input.title}\n${input.body}${input.why ? '\n' + input.why : ''}`;
  const embedding = await embedDocument(text);

  const entry: LsmEntry = {
    id: randomUUID(),
    project: input.project ?? 'conductor',
    category: input.category,
    title: input.title,
    body: input.body,
    why: input.why,
    tried_and_failed: input.tried_and_failed,
    tags: input.tags ?? [],
    source: input.source ?? 'session',
    embedding,
    created_at: new Date().toISOString(),
  };

  append(entry);
  return { id: entry.id };
}
