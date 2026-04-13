import { LsmSearchResult } from './types.js';
export declare function search(query: string, project?: string, limit?: number, threshold?: number): Promise<LsmSearchResult[]>;
