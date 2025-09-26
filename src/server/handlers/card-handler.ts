/**
 * Card Handler
 * Handles card-related MCP tool operations
 */

import { AnkiConnectClient } from '../../anki/anki-connect.js';
import { ToolArguments, SearchCardsParams, AddNoteParams } from '../../types';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

/**
 * Handle searching for cards
 */
export async function handleSearchCards(
  ankiClient: AnkiConnectClient,
  args: ToolArguments
): Promise<CallToolResult> {
  try {
    const { query, limit = 10 } = args as SearchCardsParams;
    
    if (!query) {
      return {
        content: [{
          type: 'text',
          text: 'Error: query parameter is required'
        }],
        isError: true
      };
    }

    const cardIds = await ankiClient.searchCards(query, limit);
    
    if (cardIds.length === 0) {
      return {
        content: [{
          type: 'text',
          text: `No cards found for query: "${query}"`
        }]
      };
    }

    const cardsInfo = await ankiClient.getCardsInfo(cardIds);
    
    const cardsList = cardsInfo.map((card, index) => {
      const front = card.fields.Front?.value || card.question || 'N/A';
      const back = card.fields.Back?.value || card.answer || 'N/A';
      return `${index + 1}. [${card.deckName}] ${front} → ${back}`;
    }).join('\n');

    return {
      content: [{
        type: 'text',
        text: `Search results for "${query}" (showing ${Math.min(limit, cardIds.length)} of ${cardIds.length}):\n\n${cardsList}`
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `Error searching cards: ${error instanceof Error ? error.message : String(error)}`
      }],
      isError: true
    };
  }
}

/**
 * Handle adding a new note/card
 */
export async function handleAddNote(
  ankiClient: AnkiConnectClient,
  args: ToolArguments
): Promise<CallToolResult> {
  try {
    const { deckName, modelName = 'Basic', fields, tags = [] } = args as AddNoteParams;
    
    // Validate required parameters
    if (!deckName) {
      return {
        content: [{
          type: 'text',
          text: 'Error: deckName parameter is required'
        }],
        isError: true
      };
    }

    if (!fields || Object.keys(fields).length === 0) {
      return {
        content: [{
          type: 'text',
          text: 'Error: fields parameter is required and must contain at least one field'
        }],
        isError: true
      };
    }

    // Check if deck exists
    const deckNames = await ankiClient.getDeckNames();
    if (!deckNames.includes(deckName)) {
      return {
        content: [{
          type: 'text',
          text: `Error: Deck "${deckName}" not found. Available decks: ${deckNames.join(', ')}`
        }],
        isError: true
      };
    }

    // Check if model exists
    const modelNames = await ankiClient.getModelNames();
    if (!modelNames.includes(modelName)) {
      return {
        content: [{
          type: 'text',
          text: `Error: Note type "${modelName}" not found. Available types: ${modelNames.join(', ')}`
        }],
        isError: true
      };
    }

    // Validate fields for the model
    const modelFields = await ankiClient.getModelFieldNames(modelName);
    const missingFields = modelFields.filter(field => !(field in fields));
    const extraFields = Object.keys(fields).filter(field => !modelFields.includes(field));

    if (extraFields.length > 0) {
      return {
        content: [{
          type: 'text',
          text: `Error: Invalid fields for model "${modelName}": ${extraFields.join(', ')}. Valid fields: ${modelFields.join(', ')}`
        }],
        isError: true
      };
    }

    const noteId = await ankiClient.addNote({ deckName, modelName, fields, tags });
    
    const fieldsText = Object.entries(fields)
      .map(([key, value]) => `  ${key}: ${value}`)
      .join('\n');

    return {
      content: [{
        type: 'text',
        text: `✅ Successfully added note to deck "${deckName}"!\n` +
              `📝 Note ID: ${noteId}\n` +
              `🏷️  Model: ${modelName}\n` +
              `📋 Fields:\n${fieldsText}` +
              (tags.length > 0 ? `\n🏷️  Tags: ${tags.join(', ')}` : '')
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `Error adding note: ${error instanceof Error ? error.message : String(error)}`
      }],
      isError: true
    };
  }
}

/**
 * Handle getting available note types (models)
 */
export async function handleGetModels(
  ankiClient: AnkiConnectClient,
  args: ToolArguments
): Promise<CallToolResult> {
  try {
    const modelNames = await ankiClient.getModelNames();
    
    if (modelNames.length === 0) {
      return {
        content: [{
          type: 'text',
          text: 'No note types found in Anki'
        }]
      };
    }

    return {
      content: [{
        type: 'text',
        text: `Available note types (${modelNames.length}):\n${modelNames.map(name => `• ${name}`).join('\n')}`
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `Error getting note types: ${error instanceof Error ? error.message : String(error)}`
      }],
      isError: true
    };
  }
}

/**
 * Handle getting fields for a specific note type
 */
export async function handleGetModelFields(
  ankiClient: AnkiConnectClient,
  args: ToolArguments
): Promise<CallToolResult> {
  try {
    const { modelName } = args as { modelName: string };

    if (!modelName) {
      return {
        content: [{
          type: 'text',
          text: 'Error: modelName parameter is required'
        }],
        isError: true
      };
    }

    const fieldNames = await ankiClient.getModelFieldNames(modelName);

    return {
      content: [{
        type: 'text',
        text: `Fields for note type "${modelName}" (${fieldNames.length}):\n${fieldNames.map(name => `• ${name}`).join('\n')}`
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `Error getting model fields: ${error instanceof Error ? error.message : String(error)}`
      }],
      isError: true
    };
  }
}

/**
 * Handle updating note fields
 */
export async function handleUpdateNote(
  ankiClient: AnkiConnectClient,
  args: ToolArguments
): Promise<CallToolResult> {
  try {
    const { noteId, fields } = args as { noteId: number; fields: Record<string, string> };

    if (!noteId) {
      return {
        content: [{
          type: 'text',
          text: 'Error: noteId parameter is required'
        }],
        isError: true
      };
    }

    if (!fields || Object.keys(fields).length === 0) {
      return {
        content: [{
          type: 'text',
          text: 'Error: fields parameter is required and must contain at least one field'
        }],
        isError: true
      };
    }

    // Get note info to verify it exists and get its current state
    let noteInfo;
    try {
      noteInfo = await ankiClient.getNoteInfo(noteId);
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error: Note with ID ${noteId} not found`
        }],
        isError: true
      };
    }

    // Update the note fields
    await ankiClient.updateNoteFields(noteId, fields);

    const fieldsText = Object.entries(fields)
      .map(([key, value]) => `  ${key}: ${value}`)
      .join('\n');

    return {
      content: [{
        type: 'text',
        text: `✅ Successfully updated note ${noteId}!\n` +
              `📝 Updated fields:\n${fieldsText}\n` +
              `🏷️  Model: ${noteInfo.modelName}\n` +
              (noteInfo.tags.length > 0 ? `🏷️  Tags: ${noteInfo.tags.join(', ')}` : '')
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `Error updating note: ${error instanceof Error ? error.message : String(error)}`
      }],
      isError: true
    };
  }
}

/**
 * Handle getting note information
 */
export async function handleGetNoteInfo(
  ankiClient: AnkiConnectClient,
  args: ToolArguments
): Promise<CallToolResult> {
  try {
    const { noteId } = args as { noteId: number };

    if (!noteId) {
      return {
        content: [{
          type: 'text',
          text: 'Error: noteId parameter is required'
        }],
        isError: true
      };
    }

    const noteInfo = await ankiClient.getNoteInfo(noteId);

    const fieldsText = Object.entries(noteInfo.fields)
      .map(([key, value]) => `  ${key}: ${value}`)
      .join('\n');

    return {
      content: [{
        type: 'text',
        text: `📝 Note Information (ID: ${noteId}):\n` +
              `🏷️  Model: ${noteInfo.modelName}\n` +
              `📋 Fields:\n${fieldsText}\n` +
              (noteInfo.tags.length > 0 ? `🏷️  Tags: ${noteInfo.tags.join(', ')}` : '')
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `Error getting note info: ${error instanceof Error ? error.message : String(error)}`
      }],
      isError: true
    };
  }
}

/**
 * Handle deleting notes
 */
export async function handleDeleteNotes(
  ankiClient: AnkiConnectClient,
  args: ToolArguments
): Promise<CallToolResult> {
  try {
    const { noteIds } = args as { noteIds: number[] };

    if (!noteIds || noteIds.length === 0) {
      return {
        content: [{
          type: 'text',
          text: 'Error: noteIds parameter is required and must contain at least one ID'
        }],
        isError: true
      };
    }

    await ankiClient.deleteNotes(noteIds);

    return {
      content: [{
        type: 'text',
        text: `✅ Successfully deleted ${noteIds.length} note(s)!\n` +
              `🗑️  Deleted IDs: ${noteIds.join(', ')}`
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `Error deleting notes: ${error instanceof Error ? error.message : String(error)}`
      }],
      isError: true
    };
  }
}