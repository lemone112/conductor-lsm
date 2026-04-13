import 'dotenv/config';
import { write } from './write.js';
const entries = [
    {
        category: 'architecture',
        title: 'Conductor = OMC + LSM, not a new runtime',
        body: 'Conductor is a configuration/governance layer on top of OMC primitives. It does not replace OMC or build a new agent runtime. The orchestration, parallel lanes, and HUD already exist in OMC.',
        why: 'Building from scratch would duplicate OMC capabilities and add maintenance burden. OMC already solves lanes, state, and HUD.',
        tags: ['conductor', 'architecture', 'omc'],
        source: 'seed',
    },
    {
        category: 'decision',
        title: 'OMC chosen as orchestration layer over custom implementation',
        body: 'OMC provides: project_memory (hot layer), notepad, HUD, Agent tool with allowedTools isolation, architect/executor/critic/verifier agents, ultrawork/ralph/team workflows.',
        why: 'Custom orchestrator would require months to build what OMC already provides. Risk: divergence from OMC updates.',
        tried_and_failed: 'Considered Trigger.dev as orchestrator — abandoned because OMC already handles this.',
        tags: ['omc', 'orchestration', 'decision'],
        source: 'seed',
    },
    {
        category: 'decision',
        title: 'Local NDJSON + Cohere for LSM storage (not Supabase)',
        body: 'LSM stored as NDJSON file locally. Cosine similarity search on load. Cohere embed-english-v3.0 for 1024-dim embeddings.',
        why: 'Proactive engine (Trigger.dev remote access) removed from scope. Local storage sufficient for personal use. Zero native dependencies avoids Windows compilation issues.',
        tried_and_failed: 'Supabase+pgvector considered — correct for multi-machine or proactive engine, but adds infrastructure dependency without benefit for current scope.',
        tags: ['storage', 'lsm', 'lancedb', 'decision'],
        source: 'seed',
    },
    {
        category: 'decision',
        title: 'Cohere embed-english-v3.0 directly, no Bifrost proxy',
        body: 'Embeddings generated via Cohere API key directly from the LSM MCP server. No dependency on Bifrost (DE-03) or any server.',
        why: 'Bifrost dependency would require DE-03 to be running for local Claude sessions. Direct API key eliminates this coupling.',
        tags: ['cohere', 'embeddings', 'bifrost', 'decision'],
        source: 'seed',
    },
    {
        category: 'architecture',
        title: 'Lanes = Agent tool + allowedTools isolation (not permanent processes)',
        body: 'Orchestrator (architect, opus) spawns sub-agents via the Agent tool. Each sub-agent receives a specific allowedTools list. Physical isolation: orchestrator has no Edit/Write, Reality Check has no Edit/Write, Research has no Bash.',
        why: 'OMC Agent tool already provides this. No daemon or process management needed.',
        tags: ['lanes', 'architecture', 'allowedtools', 'omc'],
        source: 'seed',
    },
    {
        category: 'failure',
        title: 'Local SQLite insufficient for associative vector search',
        body: 'SQLite with keyword search cannot find "what is relevant to auth" when the word "auth" does not appear in the document. Vector search (semantic embeddings) is required for associative queries.',
        why: 'This was a proposed shortcut that was correctly rejected.',
        tags: ['sqlite', 'vector-search', 'failure', 'memory'],
        source: 'seed',
    },
    {
        category: 'failure',
        title: 'ForwardAuth https://https:// — same root cause repeated in new session',
        body: 'AUTH_BASE_URL configured without https:// caused 56k token incident. Same session later: ForwardAuth configured with https://https:// (double prefix) caused another 108k token incident. Different symptoms, identical root cause.',
        why: 'Without LSM, the second incident had no memory of the first. Living model would have surfaced the pattern.',
        tags: ['forwardauth', 'auth', 'failure', 'context-loss'],
        source: 'seed',
    },
    {
        category: 'failure',
        title: 'AUTH_BASE_URL without https:// — 56k token incident',
        body: 'AUTH_BASE_URL was set without https:// prefix. Caused auth failures that took a full session to diagnose. Root: missing protocol in URL configuration.',
        tags: ['auth', 'url', 'failure', 'configuration'],
        source: 'seed',
    },
    {
        category: 'context',
        title: 'ForwardAuth decision: kept for 5 dumb services, NOT abandoned',
        body: 'ForwardAuth intentionally kept for: OpenPanel, Dokploy, Uptime Kuma, Supabase Studio, Trigger.dev. 8 services with own auth bypass ForwardAuth intentionally. Future plan: native OIDC per service.',
        why: 'These 5 services have no built-in auth. ForwardAuth is the wall. Removing it would expose them.',
        tags: ['forwardauth', 'auth', 'context', 'architecture'],
        source: 'seed',
    },
    {
        category: 'context',
        title: 'Supabase-db isolated to supabase_default network — 149k token incident',
        body: 'supabase-db container only in supabase_default network, not dokploy-network. Any service needing direct DB access must be in supabase_default. This caused a 149k token debugging session.',
        tags: ['supabase', 'docker', 'network', 'context'],
        source: 'seed',
    },
    {
        category: 'decision',
        title: 'Elysia+Bun over Fastify+Node.js — unified auth stack',
        body: 'Fastify+Elysia+GoTrue → unified Elysia JWT-only. This is the architectural decision for the auth stack. Fastify v1 is retired.',
        why: 'Multiple auth frameworks in the same system created complexity and inconsistency. Elysia+Bun is the unified path.',
        tags: ['elysia', 'fastify', 'auth', 'decision'],
        source: 'seed',
    },
    {
        category: 'architecture',
        title: 'Diversity aggregation over consensus — code review principle',
        body: 'Multiple reviewers should NOT vote by majority. Majority vote amplifies popular wrong answers. Judge evaluates each finding independently. Source: arXiv:2510.21513.',
        why: 'Proven: diversity aggregation outperforms consensus/majority voting in multi-agent code review.',
        tags: ['code-review', 'multi-agent', 'architecture', 'research'],
        source: 'seed',
    },
    {
        category: 'architecture',
        title: 'Self-reflect once = 70% improvement, more = diminishing returns',
        body: 'CodeQUEST research: one iteration of self-reflection produces 70% quality improvement. Additional iterations show diminishing returns. Do not run >2 review passes on the same output.',
        tags: ['code-review', 'self-reflect', 'research', 'architecture'],
        source: 'seed',
    },
    {
        category: 'architecture',
        title: 'Same model cannot reliably review its own output — 60% quality',
        body: 'Measured: same model reviewing its own code achieves 60% quality on that code. Cross-model or cross-agent review is required for meaningful code review. This validates the four-lane architecture.',
        tags: ['code-review', 'confirmation-bias', 'architecture'],
        source: 'seed',
    },
    {
        category: 'architecture',
        title: 'Precision first: ≤5 escalations per session or users stop listening',
        body: '84% of developers use AI assistants, 29% trust them. The gap is noise. Each false escalation reduces trust. Reality Check must only fire on genuine blockers — not every risk, not every ambiguity.',
        tags: ['reality-check', 'escalation', 'trust', 'architecture'],
        source: 'seed',
    },
    {
        category: 'context',
        title: 'Reality Check must be structural, not optional — ForwardAuth lesson',
        body: 'ForwardAuth: the wall was in place, but behind it was AI-slop code. Good advisors (ceo-advisor, reality-check) existed but got buried in execution flow. The lesson: CEO/Reality Check must be a structural lane, not an optional tool.',
        tags: ['reality-check', 'governance', 'context', 'lesson'],
        source: 'seed',
    },
    {
        category: 'context',
        title: 'Documentation lag 6 days → 49/100 PRD score',
        body: 'A 6-day gap between implementation and documentation produced a PRD score of 49/100. Direct proof that the Living System Model must be updated in real-time, not retroactively.',
        tags: ['documentation', 'lsm', 'context', 'proof'],
        source: 'seed',
    },
    {
        category: 'context',
        title: 'DE-02 has no swap memory — webapp at 75% RAM',
        body: 'DE-02 (Trigger.dev server) has no swap configured. Trigger.dev webapp running at 75% RAM. Under load this can cause OOM kills. Add 4GB swap.',
        tags: ['de-02', 'infrastructure', 'memory', 'context'],
        source: 'seed',
    },
    {
        category: 'context',
        title: 'mcp-twenty crash loop on DE-03 — not configured',
        body: 'mcp-twenty container on DE-03 is crash-looping at 31% CPU. Root cause: supergateway spawns twenty-mcp which prints help text and exits immediately (not configured). Fix: run twenty-mcp setup or remove container.',
        tags: ['de-03', 'mcp', 'twenty', 'context'],
        source: 'seed',
    },
    {
        category: 'architecture',
        title: 'Conductor Paradox: the more autonomous, the more transparency matters',
        body: 'As the system becomes more autonomous, visibility becomes more important, not less. The UI is a trust interface, not a management console. Every autonomous action must be observable and explainable.',
        why: 'Trust gap: 84% use AI, 29% trust AI. Closing this gap requires radical transparency, not just capability.',
        tags: ['conductor', 'trust', 'transparency', 'architecture'],
        source: 'seed',
    },
];
console.log(`Seeding ${entries.length} entries...`);
let success = 0;
let failed = 0;
for (const entry of entries) {
    try {
        const result = await write(entry);
        console.log(`✓ [${entry.category}] ${entry.title} → ${result.id}`);
        success++;
    }
    catch (err) {
        console.error(`✗ ${entry.title}: ${err}`);
        failed++;
    }
}
console.log(`\nDone: ${success} seeded, ${failed} failed`);
