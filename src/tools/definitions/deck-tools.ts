/**
 * Deck Tools
 * Tool definitions and handlers for deck-related operations
 */

import { ToolCategory } from '../registry.js';
import {
  handleGetDeckNames,
  handleGetCardsInDeck,
  handleGetDeckStats
} from '../../server/handlers/deck-handler.js';

/**
 * Deck-related tools category
 */
export const deckTools: ToolCategory = {
  name: 'deck',
  description: 'Tools for managing Anki decks',
  tools: [
    {
      definition: {
        name: 'get_deck_names',
        description: 'Get all deck names from Anki',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      handler: handleGetDeckNames,
    },
    {
      definition: {
        name: 'get_cards_in_deck',
        description: 'Get cards from a specific deck',
        inputSchema: {
          type: 'object',
          properties: {
            deck: {
              type: 'string',
              description: 'Name of the deck',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of cards to return (default: 10)',
              default: 10,
            },
          },
          required: ['deck'],
        },
      },
      handler: handleGetCardsInDeck,
    },
    {
      definition: {
        name: 'get_deck_stats',
        description: 'Get statistics for a specific deck',
        inputSchema: {
          type: 'object',
          properties: {
            deck: {
              type: 'string',
              description: 'Name of the deck',
            },
          },
          required: ['deck'],
        },
      },
      handler: handleGetDeckStats,
    },
  ],
};