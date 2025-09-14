#!/usr/bin/env node

/**
 * Anki MCP Server
 * Entry point for the Anki Model Context Protocol Server
 * 
 * This server enables AI assistants like Claude Code to interact with
 * Anki flashcards through the AnkiConnect plugin.
 */

import { startServer } from './server/mcp-server.js';

/**
 * Main function to start the server
 */
async function main() {
  try {
    await startServer();
  } catch (error) {
    console.error('Failed to start Anki MCP Server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.error('Shutting down Anki MCP Server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error('Shutting down Anki MCP Server...');
  process.exit(0);
});

// Start the server
main();