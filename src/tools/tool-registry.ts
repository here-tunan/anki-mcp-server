/**
 * Tool Registry Implementation
 * Manages registration and lookup of MCP tools
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { IToolRegistry, ToolDefinition, ToolCategory, ToolHandler } from './registry.js';

/**
 * Concrete implementation of the tool registry
 */
export class ToolRegistry implements IToolRegistry {
  private tools = new Map<string, ToolDefinition>();

  /**
   * Register a single tool
   */
  registerTool(name: string, toolDef: ToolDefinition): void {
    if (this.tools.has(name)) {
      throw new Error(`Tool '${name}' is already registered`);
    }
    
    this.tools.set(name, toolDef);
  }

  /**
   * Register a category of tools
   */
  registerCategory(category: ToolCategory): void {
    for (const tool of category.tools) {
      const toolName = tool.definition.name;
      this.registerTool(toolName, tool);
    }
  }

  /**
   * Get all registered tools for ListTools
   */
  getAllTools(): Tool[] {
    return Array.from(this.tools.values()).map(toolDef => toolDef.definition);
  }

  /**
   * Get handler for a specific tool
   */
  getHandler(toolName: string): ToolHandler | undefined {
    const toolDef = this.tools.get(toolName);
    return toolDef?.handler;
  }

  /**
   * Get all tool names
   */
  getToolNames(): string[] {
    return Array.from(this.tools.keys());
  }

  /**
   * Check if tool exists
   */
  hasTool(toolName: string): boolean {
    return this.tools.has(toolName);
  }

  /**
   * Get tool count
   */
  getToolCount(): number {
    return this.tools.size;
  }

  /**
   * Clear all tools (useful for testing)
   */
  clear(): void {
    this.tools.clear();
  }
}