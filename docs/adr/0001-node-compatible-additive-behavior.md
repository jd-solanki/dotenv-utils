# Node-compatible additive behavior

envolix treats Node.js's official `.env` file specification as the compatibility baseline for environment-file parsing and syncing. The package targets Node `>=22` and avoids a `dotenv` dependency because modern Node provides official `.env` parsing support. The library may add richer capabilities on top, such as source comments, ordering metadata, and sync-specific formatting, but it should not introduce behavior that conflicts with Node.js `.env` semantics.
