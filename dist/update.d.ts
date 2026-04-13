export interface UpdateInput {
    id: string;
    title?: string;
    body?: string;
    why?: string;
    tried_and_failed?: string;
    tags?: string[];
}
export declare function update(input: UpdateInput): Promise<{
    id: string;
    updated: boolean;
}>;
