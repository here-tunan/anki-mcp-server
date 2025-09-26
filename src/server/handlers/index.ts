/**
 * Handlers Index
 * Exports all MCP tool handlers
 */

// Deck handlers
export {
  handleGetDeckNames,
  handleGetCardsInDeck,
  handleGetDeckStats
} from './deck-handler.js';

// Card handlers
export {
  handleSearchCards,
  handleAddNote,
  handleGetModels,
  handleGetModelFields,
  handleUpdateNote,
  handleGetNoteInfo,
  handleDeleteNotes
} from './card-handler.js';