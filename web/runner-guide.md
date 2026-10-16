# DXP local model runner

This is a working CPU inference path for two pinned, Apache-2.0 open model weight sets. It requires no paid inference account. It is not a claim about frontier models or all providers.

- Qwen/Qwen2.5-Coder-1.5B-Instruct-GGUF, Q4_K_M, revision `f86cb2c1fa58255f8052cc32aeede1b7482d4361`.
- HuggingFaceTB/SmolLM2-1.7B-Instruct-GGUF, Q4_K_M, revision `2d4a76a30b4af41ecd395c35725ac11688d4cfe4`.

The manifest identifies complete SHA-256 weight digests, runtime versions and all settings. Runtime packages and weights live outside the Site source tree. Restore with `python3 runner/bootstrap.py`, then set `PYTHONPATH` to the returned runtime Python directory. No credentials belong in project files.

`runner/evidence/first-strict-format-probe.json` preserves the first unscored responses. Qwen returned `95`; SmolLM2 returned the correct number inside prose and failed the strict format requirement. Invocation of two weight sets is verified independently of their adherence to an output format.

`runner/pilot/manifest.json` and its hash were written before all 16 development allocations. Two known project diagnostics × four input conditions × two models. These are actual model generations with token usage and measured wall time. They do not count toward the confirmatory 384-run objective, held-out transfer or actual Git/DXP-operation utility. The same complete factual payload and provenance are injected in the three aided arms, with labels only changing. No agent tool retrieval or mental understanding is claimed.

`local_pilot.py` resets model and KV state for each allocation, exposes only that task and its assigned material in messages, executes no model shell commands, and refuses to overwrite completed allocations. CPU model load is reported separately. Each candidate runs in a fresh restricted QuickJS context via `capsule.py`, without Python callbacks, Node modules, host filesystem or network APIs; memory, stack and runtime are bounded. Acceptance expectations stay in the Python coordinator, outside the guest globals. Cases include valid inputs, known-broken baselines and timeout controls.

This is a virtual JavaScript sandbox for pure functions. OS namespace and chroot probes were rejected by this host. Do not relabel it as container isolation, general whole-repository code execution, or proof against engine vulnerabilities. Broader tool use needs a separate reviewed isolation mechanism. No secrets are sent to local models.

Commands after restore:

```
python3 runner/verify_capsule.py
python3 runner/local_probe.py
# The initial pilot is already allocated and must not be rerun over its originals.
# A new pilot needs a new output directory, frozen manifest and allocation IDs.
```

Further confirmation must use unseen task families and adequate observed producer records; preserve the original protocol's acceptance thresholds. The currently implemented labels-only development comparison does not isolate the value of versioning, merge, retraction or retrieval. Promote the runner's proven scope, not the pilot's accuracy, into the weekly state.

The connected cloud gateway was also exercised: its catalog is reachable but every model was disabled with `paid_plan_required`. No credits were bought or subscription changed; its probe credential was revoked. The separate empty `dxp-validation-week` project remains available if a paid route is later explicitly enabled.
