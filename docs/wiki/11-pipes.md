# Pipes — Chaining Tools

Pipes let you connect multiple tools so the output of one becomes the input of the next.

## Creating a pipe

1. Open the **Pipes** page from the top navigation
2. Click **+** to create a new pipe
3. Give it a name (e.g. "JSON → Base64")
4. Click **+ Add step** to add tool steps

## Step input modes

Each step has two input modes:

| Mode | Description |
| --- | --- |
| **Chain** | Uses the output of the previous step as input |
| **Static** | Uses a fixed value you type — ignores previous output |

The **first step** in chain mode shows a textarea for the initial input (the starting value of the pipe).

### Prefix injection

In chain mode you can add an optional **prefix** that is prepended to the chained output before it is passed to the tool. Useful for tools that take a mode keyword on the first line.

## Running a pipe

Click **▶ Run pipe**. Each step runs sequentially. Results appear inline under each step showing:

- The output of that step
- Duration in milliseconds
- Any error (stops the pipe at that step)

The **Final Output** panel at the bottom shows the clean result of the last successful step, ready to copy.

## rawOutput and clean chaining

Tools that produce human-readable metadata headers (like `Modus: Encode`) expose a separate `rawOutput` value containing only the data. The pipe executor always uses `rawOutput` for chaining when available, so downstream steps receive clean input without metadata noise.

## Example: JSON → Base64

| Step | Tool | Input mode |
| --- | --- | --- |
| 1 | JSON Formatter / Minifier | Static: `{"name":"ItsWeber","tools":163}` |
| 2 | Base64 Encoder / Decoder | Chain (receives minified JSON) |

Final output: the Base64-encoded JSON string.
