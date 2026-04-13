import { readAll, cosineSimilarity } from './db.js';
import { embedQuery } from './embed.js';
import { LsmSearchResult } from './types.js';

export async function search(
  query: string,
  project: string = 'conductor',
  limit: number = 5,
  threshold: number = 0.5
): Promise<LsmSearchResult[]> {
  const queryEmbedding = await embedQuery(query);
  const entries = readAll().filter(e => e.project === project);

  const scored = entries.map(entry => ({
    ...entry,
    similarity: cosineSimilarity(queryEmbedding, entry.embedding),
  }));

  return scored
    .filter(e => e.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map(({ id, category, title, body, why, tags, similarity, created_at }) => ({
      id, category, title, body, why, tags, similarity, created_at,
    }));
}
