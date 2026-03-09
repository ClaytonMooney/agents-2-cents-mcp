#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_URL = "https://agents-2-cents.2cents.workers.dev/opinion";

const server = new McpServer({
  name: "agents-2-cents",
  version: "1.0.0",
  description:
    "Get opinionated AI takes on any topic. Each call costs $0.02 USDC via x402 micropayments on Base.",
});

server.tool(
  "get_opinion",
  "Get an opinionated AI take on any topic or question. " +
    "Calls the Agents 2 Cents API which charges $0.02 USDC per request " +
    "via the x402 payment protocol on Base chain. " +
    "The MCP client/agent handles the x402 payment flow automatically.",
  {
    topic: z.string().describe("The topic or question to get an opinion on"),
  },
  async ({ topic }) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      // x402 payment required — surface the 402 details so the client can handle it
      if (response.status === 402) {
        const paymentInfo = await response.text();
        return {
          content: [
            {
              type: "text" as const,
              text: `Payment required (HTTP 402). The x402 payment protocol requires $0.02 USDC on Base.\n\nPayment details:\n${paymentInfo}`,
            },
          ],
          isError: true,
        };
      }

      if (!response.ok) {
        const errorText = await response.text();
        return {
          content: [
            {
              type: "text" as const,
              text: `API error (${response.status}): ${errorText}`,
            },
          ],
          isError: true,
        };
      }

      const data = await response.json() as Record<string, unknown>;

      // Extract the opinion text — try common response shapes
      const opinion =
        typeof data === "string"
          ? data
          : (data.opinion as string) ??
            (data.response as string) ??
            (data.text as string) ??
            (data.message as string) ??
            JSON.stringify(data, null, 2);

      return {
        content: [
          {
            type: "text" as const,
            text: opinion,
          },
        ],
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: "text" as const,
            text: `Failed to call Agents 2 Cents API: ${message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Agents 2 Cents MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
