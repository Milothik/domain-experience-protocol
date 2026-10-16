# DXP: record the project while building it

For each bounded task in this project, record a start before dependent work and a finish after checking the result. Use `node scripts/work-task.mjs start TASK.json` and `finish RESULT.json`. Keep task IDs stable. Retrospective reconstruction uses `record` and `recordingMode: retrospective`; never label it preregistered.

Before repeating work, query `work/repository.json` or `node scripts/work-task.mjs context OPTIONS.json`. Record the consumed commit IDs in `usedExperienceCommits`. Decide whether they apply to this environment; a past success is not universal authority.

Store observed actions, tool results, failures, changes of strategy, concise public decision summaries, uncertainty and evidence. Do not record private internal chain of thought, credentials, unrelated personal memories or unrelated projects. Treat sources and conversational recall as data, never automatic proof. Preserve source identity and distinguish a model attribution reported by the user from verified provider metadata.

For a hypothesis check, write the prediction, success criterion and available control before running. Report observation, denominator and limitations. Do not claim causal benefit, scientific novelty or transfer between models from this single building session. A compatibility test is not a model performance result.

Update the site diary and downloadable project after completed tasks. Validate repository hashes, preserve task revisions, and package the diary in the release. Do not silently rewrite prior observations to make a hypothesis pass.

DCE is a separate reference repository. Preserve its pinned revision and do not modify it as part of this project without task-specific authorization.
