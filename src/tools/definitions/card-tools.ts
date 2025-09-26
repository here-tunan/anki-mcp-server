/**
 * Card Tools
 * Tool definitions and handlers for card-related operations
 */

import { ToolCategory } from '../registry.js';
import {
  handleSearchCards,
  handleAddNote,
  handleGetModels,
  handleGetModelFields,
  handleUpdateNote,
  handleGetNoteInfo,
  handleDeleteNotes
} from '../../server/handlers';

/**
 * Card-related tools category
 */
export const cardTools: ToolCategory = {
  name: 'card',
  description: 'Tools for managing Anki cards and notes',
  tools: [
    {
      definition: {
        name: 'search_cards',
        description: 'Search for cards using Anki query syntax',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Anki search query (e.g., "deck:Spanish", "tag:important")',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of cards to return (default: 10)',
              default: 10,
            },
          },
          required: ['query'],
        },
      },
      handler: handleSearchCards,
    },
    {
      definition: {
        name: 'add_note',
        description: 'Add a new note (card) to Anki',
        inputSchema: {
          type: 'object',
          properties: {
            deckName: {
              type: 'string',
              description: 'Name of the deck to add the note to',
            },
            modelName: {
              type: 'string',
              description: 'Note type (model) name (default: "Basic")',
              default: 'Basic',
            },
            fields: {
              type: 'object',
              description: 'Fields content (e.g., {"Front": "Question", "Back": "Answer"})',
              additionalProperties: {
                type: 'string'
              },
            },
            tags: {
              type: 'array',
              items: { type: 'string' },
              description: 'Tags to add to the note (optional)',
              default: [],
            },
          },
          required: ['deckName', 'fields'],
        },
      },
      handler: handleAddNote,
    },
    {
      definition: {
        name: 'get_models',
        description: 'Get all available note types (models)',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      handler: handleGetModels,
    },
    {
      definition: {
        name: 'get_model_fields',
        description: 'Get field names for a specific note type',
        inputSchema: {
          type: 'object',
          properties: {
            modelName: {
              type: 'string',
              description: 'Name of the note type (model)',
            },
          },
          required: ['modelName'],
        },
      },
      handler: handleGetModelFields,
    },
    {
      definition: {
        name: 'update_note',
        description: 'Update fields of an existing note',
        inputSchema: {
          type: 'object',
          properties: {
            noteId: {
              type: 'number',
              description: 'ID of the note to update',
            },
            fields: {
              type: 'object',
              description: 'Fields to update with their new values',
              additionalProperties: {
                type: 'string'
              },
            },
          },
          required: ['noteId', 'fields'],
        },
      },
      handler: handleUpdateNote,
    },
    {
      definition: {
        name: 'get_note_info',
        description: 'Get detailed information about a specific note',
        inputSchema: {
          type: 'object',
          properties: {
            noteId: {
              type: 'number',
              description: 'ID of the note to get information about',
            },
          },
          required: ['noteId'],
        },
      },
      handler: handleGetNoteInfo,
    },
    {
      definition: {
        name: 'delete_notes',
        description: 'Delete one or more notes by their IDs',
        inputSchema: {
          type: 'object',
          properties: {
            noteIds: {
              type: 'array',
              items: { type: 'number' },
              description: 'Array of note IDs to delete',
            },
          },
          required: ['noteIds'],
        },
      },
      handler: handleDeleteNotes,
    },
  ],
};