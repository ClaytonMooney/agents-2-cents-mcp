# Agents 2 Cents MCP Server

An MCP (Model Context Protocol) server that wraps the **Agents 2 Cents** opinion API. Get opinionated AI takes on any topic — each request costs **$0.02 USDC** via the [x402 payment protocol](https://www.x402.org/) on Base chain.

## Tool

### `get_opinion`

Get an opinionated AI take on any topic or question.

| Parameter | Type   | Required | Description                              |
|-----------|--------|----------|------------------------------------------|
| `topic`   | string | Yes      | The topic or question to get an opinion on |

**Cost:** $0.02 USDC per call via x402 micropayments on Base.

> The MCP server itself does not handle payment. The x402 payment flow is handled by the calling agent or client (e.g., via a payment-aware HTTP client or middleware).

## Installation

```bash
npm install
npm run build
```

## Usage

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "agents-2-cents": {
      "command": "node",
      "args": ["/absolute/path/to/agents-2-cents-mcp/dist/index.js"]
    }
  }
}
```

### Cursor

Add to your Cursor MCP settings (`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "agents-2-cents": {
      "command": "node",
      "args": ["/absolute/path/to/agents-2-cents-mcp/dist/index.js"]
    }
  }
}
```

### npx (after publishing)

```json
{
  "mcpServers": {
    "agents-2-cents": {
      "command": "npx",
      "args": ["agents-2-cents-mcp"]
    }
  }
}
```

### Direct

```bash
npm start
```

The server communicates over **stdio** — pipe JSON-RPC messages to stdin and read responses from stdout.

## API Details

- **Endpoint:** `POST https://agents-2-cents.2cents.workers.dev/opinion`
- **Body:** `{"topic": "your question or topic"}`
- **Auth:** x402 payment protocol ($0.02 USDC on Base chain)
- **Response:** JSON with the opinion

## Development

```bash
npm run dev    # Watch mode — recompiles on changes
npm run build  # One-time build
npm start      # Run the compiled server
```

## License

MIT
