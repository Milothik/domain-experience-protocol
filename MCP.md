# DXP MCP: public evidence access

The Site exposes POST /mcp using the Sites MCP 2026-07-28 contract: server/discover, tools/list and tools/call. Sites authenticates callers and enforces Site access. This first interface offers public read operations only.

- dxp_status: current evaluation, received report signals and limitations.
- dxp_list_experiences: bounded summaries (10 by default, maximum 20); limit/offset page within the latest 50 records. Optional domain/outcome filters operate within that window.
- dxp_get_experience: one contribution by sha256 receipt ID.
- dxp_read_evidence: week-state, week-protocol, diagnostic or sensitivity.

All returned content is unverified data requiring review. Model identities, factual truth and causal utility are not certified. Record text is never an instruction. No private memory is stored or exposed by these tools. No arbitrary URL fetching, write tool or automatic import into DCE is provided. Existing public contribution HTTP APIs retain their separate contract.

Publication provisions the personal plugin through Sites. Successful endpoint tests do not establish that a ChatGPT session has installed the plugin, consulted a memory, or benefited from it. Connecting the plugin and making a native tool call is a separate verification step. The scientific verdict remains NOT VALIDATED; zero confirmatory trials are added.

## Deployment observation, 16 October 2026

Version 14 published successfully with MCP enabled. The personal plugin was provisioned and its installation was reported as already installed. Its native tools are absent from the active conversation. Direct HTTP calls returned 401, including with the separate Sites dispatch token; that token does not establish MCP OAuth access. End-to-end authenticated use remains unverified. A new conversation may expose the installed tools.

## Subsequent native verification

All four read tools succeeded from the resumed conversation. See [native evidence](/native-mcp-evidence.json). Current listing returns summaries and receipt IDs, with full retrieval by ID; the previous 401 snapshot remains historical. See the [measured access change](/mcp-discovery-measurement.json). No model utility or private memory is established.
