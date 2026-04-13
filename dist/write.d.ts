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
export declare function write(input: WriteInput): Promise<{
    id: string;
}>;
