/**
 * Tool Registry Types
 * Defines the structure for registering and managing MCP tools
 */

import { Tool, CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { AnkiConnectClient } from '../anki/anki-connect.js';
import { ToolArguments } from '../types/index.js';

/**
 * Handler function signature for MCP tools
 */
export type ToolHandler = (
  ankiClient: AnkiConnectClient,
  args: ToolArguments
) => Promise<CallToolResult>;

/**
 * Complete tool definition with handler
 */
export interface ToolDefinition {
  /** Tool metadata for MCP */
  definition: Tool;
  /** Handler function */
  handler: ToolHandler;
}

/**
 * Tool category for organization
 */
export interface ToolCategory {
  name: string;
  description: string;
  tools: ToolDefinition[];
}

/**
 * Tool registry interface
 */
export interface IToolRegistry {
  /** Register a single tool */
  registerTool(name: string, toolDef: ToolDefinition): void;
  
  /** Register a category of tools */
  registerCategory(category: ToolCategory): void;
  
  /** Get all registered tools for ListTools */
  getAllTools(): Tool[];
  
  /** Get handler for a specific tool */
  getHandler(toolName: string): ToolHandler | undefined;
  
  /** Get all tool names */
  getToolNames(): string[];
}