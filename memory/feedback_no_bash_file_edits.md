---
name: feedback-no-bash-file-edits
description: User prefers Edit tool over Bash sed/awk for file modifications
metadata:
  type: feedback
---

Use the Edit tool for file changes, not Bash with sed/awk/etc.

**Why:** User rejected a sed command used to batch-replace text across files.

**How to apply:** Even for multi-file changes, use individual Edit tool calls per file rather than Bash string replacement commands.
