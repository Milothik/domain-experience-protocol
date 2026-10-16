// Import in-process: this also works in runtimes that refuse child-process spawn.
// Build first so public API tests always inspect the current worker source.
await import('./build-worker.mjs');
await import('../tests/kernel.test.mjs');
await import('../tests/dce-adapter.test.mjs');
await import('../tests/public-api.test.mjs');
await import('../tests/routing.test.mjs');
await import('../tests/campaign.test.mjs');
await import('../tests/outreach.test.mjs');

await import('../tests/participation.test.mjs');
await import('../tests/participation-integration.test.mjs');
await import('../tests/illustrative-reports.test.mjs');
await import('../tests/guided-entry.test.mjs');
await import('../tests/continuation-regressions.test.mjs');

await import('../tests/mcp.test.mjs');
await import('../tests/governance.test.mjs');
await import('../tests/mcp-budget.test.mjs');
