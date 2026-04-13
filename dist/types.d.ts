export interface LsmEntry {
    id: string;
    project: string;
    category: 'decision' | 'failure' | 'debt' | 'architecture' | 'context';
    title: string;
    body: string;
    why?: string;
    tried_and_failed?: string;
    tags: string[];
    source: string;
    embedding: number[];
    created_at: string;
}
export interface LsmSearchResult {
    id: string;
    category: string;
    title: string;
    body: string;
    why?: string;
    tags: string[];
    similarity: number;
    created_at: string;
}
