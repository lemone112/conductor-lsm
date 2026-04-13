import { findById, updateEntry } from './db.js';
import { embedDocument } from './embed.js';
import { LsmEntry } from './types.js';

export interface UpdateInput {
  id: string;
  title?: string;
  body?: string;
  why?: string;
  tried_and_failed?: string;
  tags?: string[];
}

export async function update(input: UpdateInput): Promise<{ id: string; updated: boolean }> {
  const entry = findById(input.id);
  if (!entry) return { id: input.id, updated: false };

  const merged: LsmEntry = {
    ...entry,
    title: input.title ?? entry.title,
    body: input.body ?? entry.body,
    why: input.why ?? entry.why,
    tried_and_failed: input.tried_and_failed ?? entry.tried_and_failed,
    tags: input.tags ?? entry.tags,
  };

  // Re-embed only if content changed
  const contentChanged =
    merged.title !== entry.title ||
    merged.body !== entry.body ||
    merged.why !== entry.why;

  if (contentChanged) {
    const text = `${merged.title}\n${merged.body}${merged.why ? '\n' + merged.why : ''}`;
    merged.embedding = await embedDocument(text);
  }

  const ok = updateEntry(input.id, merged);
  return { id: input.id, updated: ok };
}
