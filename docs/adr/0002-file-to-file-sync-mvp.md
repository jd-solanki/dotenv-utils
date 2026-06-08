# File-to-file sync MVP

envolix's MVP exposes an explicit `envolix sync` command that projects one Source Environment File to one file-based Sync Target, defaulting from `.env` to `.env.example`. Broader target types, configuration files, check mode, multiple sources, multiple targets, and automatic git staging are intentionally outside the MVP so the first release can focus on correct Node-compatible parsing, comment preservation, blank assignments, and full target rewrites.
