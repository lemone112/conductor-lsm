import { readAll, cosineSimilarity } from './db.js';
import { embedQuery } from './embed.js';
export async function search(query, project = 'conductor', limit = 5, threshold = 0.5) {
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
