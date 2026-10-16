# Architecture and publication decisions

DXP (Domain Experience Protocol) versions declared execution experiences. DCE (Domain Context Engine) compiles domain knowledge into task context. They remain independently versioned projects.

## Current boundaries

- `web/core.mjs`: shared browser/Node kernel, scoped experiences, content hashes, DAG, branches and context selection.
- `cli.mjs`: local file persistence with atomic replacement and a lock.
- `web/`: modular browser application and a standalone demonstration.
- `worker/`: hosted HTTP/MCP API and durable participation adapters; hosting is configured separately from GitHub.
- `web/dce-adapter.mjs`: captures a caller-supplied DCE execution and converts explicitly approved experiences into DCE entities.
- `references/dce`: Git submodule pinned to the adapter's tested upstream revision.
- `tests/`, `results/`, and archived campaigns: engineering checks and historical research evidence, with their original limitations.

## Technical debt and scaling risks

The local JSON store is suitable for one machine; its lock is not a distributed concurrency mechanism. A production multi-writer service needs transactional persistence, concurrency control, quotas, identity and authorization. Browser storage has a single-writer boundary. Historical frozen baselines intentionally preserve old defects and must never replace the current kernel. Several HTML and JSON mirrors are generated from modular sources; regenerate them after relevant edits. Content hashes prove integrity, not truth, authorship, permission or calibrated confidence. Cross-model utility remains unvalidated.

## Decisions for this repository

Import only the explicit public release inventory into a fresh Git history. `import-provenance.json` records original byte hashes and the local source revision; that revision identifies the source checkout and is not represented as a remotely available GitHub commit. Synced source reports, model sessions, credentials, dependencies and private Git history are excluded. Archive provenance does not authorize arbitrary future files for publication.

Use a pinned Git submodule for DCE rather than copying its implementation or silently tracking its latest branch. Ordinary DXP tests remain dependency-free. CI separately installs and tests the pinned DCE release, then exercises producer, approved consumer and continuity-failure capture without model calls. The runner checks the actual checkout revision and writes fresh results to ignored `results/dce-latest/`, preserving historical evidence.

Future DCE upgrades require reviewing its contracts and migrations, updating the gitlink and `DCE_SOURCE.revision` together, and passing compatibility checks. Preserve the Experience 0.1 and DCE 2.0 context boundaries until an explicit migration is designed. Repository publication is not a production-readiness or scientific-performance certification.
