/**
 * Global type definitions
 * All TypeScript interfaces and types used throughout the project
 */

// ==== MCP Related Types ====

/**
 * Arguments passed to MCP tools
 */
export interface ToolArguments {
  [key: string]: any;
}

/**
 * Content returned by MCP tools
 */
export interface ToolContent {
  type: 'text';
  text: string;
}

/**
 * Response format for MCP tools
 */
export interface ToolResponse {
  content: ToolContent[];
  isError?: boolean;
}

// ==== AnkiConnect Related Types ====

/**
 * AnkiConnect request format
 */
export interface AnkiConnectRequest {
  action: string;
  version: number;
  params?: any;
}

/**
 * AnkiConnect response format
 */
export interface AnkiConnectResponse<T = any> {
  result: T;
  error: string | null;
}

/**
 * Anki card information structure
 */
export interface CardInfo {
  cardId: number;
  fields: Record<string, { value: string; order: number }>;
  fieldOrder: number;
  question: string;
  answer: string;
  modelName: string;
  deckName: string;
  css: string;
  factor: number;
  interval: number;
  note: number;
  ord: number;
  queue: number;
  reps: number;
  type: number;
}

/**
 * Anki note information structure
 */
export interface NoteInfo {
  noteId: number;
  fields: Record<string, string>;
  tags: string[];
  modelName: string;
  cards: number[];
}

/**
 * Parameters for adding a new note
 */
export interface AddNoteParams {
  deckName: string;
  modelName: string;
  fields: Record<string, string>;
  tags?: string[];
}

/**
 * Anki deck information
 */
export interface DeckInfo {
  name: string;
  id: number;
}

// ==== Tool-specific Types ====

/**
 * Parameters for getting cards from a deck
 */
export interface GetCardsParams {
  deck: string;
  limit?: number;
}

/**
 * Parameters for searching cards
 */
export interface SearchCardsParams {
  query: string;
  limit?: number;
}

/**
 * Card statistics information
 */
export interface CardStats {
  total: number;
  new: number;
  learning: number;
  due: number;
}

/**
 * Error information structure
 */
export interface ErrorInfo {
  message: string;
  code?: string;
  details?: any;
}