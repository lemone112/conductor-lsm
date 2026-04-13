import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const DATA_DIR = process.env.LSM_DATA_DIR ?? path.join(os.homedir(), '.claude', 'conductor-lsm', 'data');
const FILE_PATH = path.join(DATA_DIR, 'living_model.jsonl');
function ensureDir() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}
export function readAll() {
    ensureDir();
    if (!fs.existsSync(FILE_PATH))
        return [];
    const lines = fs.readFileSync(FILE_PATH, 'utf-8').split('\n').filter(Boolean);
    const entries = [];
    for (const line of lines) {
        try {
            entries.push(JSON.parse(line));
        }
        catch {
            // Skip malformed lines — partial write or manual edit should not crash search
        }
    }
    return entries;
}
export function append(entry) {
    ensureDir();
    fs.appendFileSync(FILE_PATH, JSON.stringify(entry) + '\n', 'utf-8');
}
export function cosineSimilarity(a, b) {
    if (a.length !== b.length)
        throw new Error(`Embedding dimension mismatch: ${a.length} vs ${b.length}`);
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    if (normA === 0 || normB === 0)
        return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
