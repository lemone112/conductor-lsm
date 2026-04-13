import { LsmEntry } from './types.js';
export declare function readAll(): LsmEntry[];
export declare function append(entry: LsmEntry): void;
export declare function updateEntry(id: string, updated: LsmEntry): boolean;
export declare function findById(id: string): LsmEntry | undefined;
export declare function cosineSimilarity(a: number[], b: number[]): number;
