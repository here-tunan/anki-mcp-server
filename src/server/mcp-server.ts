/**
 * MCP Server
 * Clean and extensible MCP server implementation for Anki integration
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { AnkiConnectClient } from '../anki/anki-connect.js';
import { ToolRegistry, deckTools, cardTools } from '../tools/index.js';

/**
 * Create and configure the MCP server
 */
export function createMCPServer() {
  const server = new Server({
    name: 'mcp-server-anki',
    version: '1.0.0',
  }, {
    capabilities: {
      tools: {},
    },
  });

  const ankiClient = new AnkiConnectClient();
  const toolRegistry = new ToolRegistry();

  // Register all tools
  registerAllTools(toolRegistry);

  // Handle ListTools request
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: toolRegistry.getAllTools(),
    };
  });

  // Handle CallTool request
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args = {} } = request.params;

    // Check if tool exists
    if (!toolRegistry.hasTool(name)) {
      return {
        content: [{
          type: 'text',
          text: `Unknown tool: ${name}. Available tools: ${toolRegistry.getToolNames().join(', ')}`
        }],
        isError: true
      };
    }

    // Test AnkiConnect connection before executing any tool
    const isConnected = await ankiClient.testConnection();
    if (!isConnected) {
      return {
        content: [{
          type: 'text',
          text: 'Error: Cannot connect to AnkiConnect. Please make sure:\n' +
                '1. Anki is running\n' +
                '2. AnkiConnect plugin is installed\n' +
                '3. AnkiConnect is listening on port 8765'
        }],
        isError: true
      };
    }

    // Get and execute the tool handler
    const handler = toolRegistry.getHandler(name);
    if (!handler) {
      return {
        content: [{
          type: 'text',
          text: `Handler not found for tool: ${name}`
        }],
        isError: true
      };
    }

    try {
      return await handler(ankiClient, args);
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error executing tool '${name}': ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  });

  return server;
}

/**
 * Register all available tools
 * Add new tool categories here to extend functionality
 */
function registerAllTools(registry: ToolRegistry) {
  // Register deck tools
  registry.registerCategory(deckTools);
  
  // Register card tools
  registry.registerCategory(cardTools);
  
  // 🚀 Easy to add more tool categories here:
  // registry.registerCategory(studyTools);
  // registry.registerCategory(syncTools);
  // registry.registerCategory(exportTools);
  
  console.log(`Registered ${registry.getToolCount()} tools across ${2} categories`);
}

/**
 * Start the MCP server
 */
export async function startServer() {
  const server = createMCPServer();
  const transport = new StdioServerTransport();
  
  await server.connect(transport);
  
  console.log('🚀 Anki MCP Server started successfully!');
  console.log('📡 Listening for MCP requests...');
}