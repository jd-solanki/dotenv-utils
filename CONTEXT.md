# envolix

envolix helps keep environment configuration examples aligned with local environment files without exposing secret values.

## Language

**Source Environment File**:
The environment file whose variable names are treated as authoritative for a sync.
_Avoid_: Input file, real env file

**Example Environment File**:
The environment file that documents required variable names without carrying source values.
_Avoid_: Template file, sample env file

**Sync Target**:
The destination that receives a Sync projection from a Source Environment File. A Sync Target may be an Example Environment File or another destination that can represent environment variables without source-file values.
_Avoid_: Output, destination, sample

**Blank Value**:
An empty variable assignment in an Example Environment File that preserves the variable name while omitting the Source Environment File value.
_Avoid_: Placeholder, default value

**Blank Assignment**:
A target-file variable line written as `KEY=` or `KEY= # comment` when an inline Source Comment is preserved.
_Avoid_: Empty assignment, comment placeholder

**Multiline Variable**:
An environment variable whose value spans multiple source lines according to Node-Compatible Parsing rules.
_Avoid_: Multiline secret, wrapped variable

**Invalid Source Line**:
A line in a Source Environment File that cannot be interpreted using Node-Compatible Parsing rules.
_Avoid_: Unknown line, skipped line

**Source Comment**:
A line comment or inline comment from a Source Environment File that may be carried into an Example Environment File as documentation.
_Avoid_: Safe comment, generated comment

**Attached Comment**:
A Source Comment associated with a variable because it is inline on the variable line or part of a contiguous block of full-line comments immediately above that variable.
_Avoid_: Nearby comment, preceding comment

**Standalone Comment**:
A Source Comment that is not attached to a variable and keeps its source position during Sync.
_Avoid_: Orphan comment, loose comment

**Source Spacing**:
Blank-line structure from a Source Environment File that may be carried into an Example Environment File.
_Avoid_: Empty line preservation, whitespace syncing

**Node-Compatible Parsing**:
Parsing behavior that follows Node.js's official `.env` file specification, including variable-name, comment, quoting, multiline, spacing, and `export` prefix rules.
_Avoid_: Custom parsing, dotenv-compatible parsing, permissive parsing

**Parsed Environment Document**:
A structured representation of an environment file that includes variables and source annotations such as comments and ordering.
_Avoid_: Parsed object, env object

**Effective Variable**:
The final variable definition for a name when a Source Environment File defines that name more than once, including only the Source Comments attached to that final definition.
_Avoid_: Duplicate variable, overridden variable

**Sync**:
A one-way projection from a Source Environment File to an Example Environment File, where the Source Environment File is the only source of truth.
_Avoid_: Merge, reconcile, two-way sync
