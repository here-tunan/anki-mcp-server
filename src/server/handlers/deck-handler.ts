/**
 * Deck Handler
 * Handles deck-related MCP tool operations
 */

import { AnkiConnectClient } from '../../anki/anki-connect.js';
import { ToolArguments, GetCardsParams } from '../../types';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

/**
 * Handle getting all deck names
 */
export async function handleGetDeckNames(
  ankiClient: AnkiConnectClient,
  args: ToolArguments
): Promise<CallToolResult> {
  try {
    const deckNames = await ankiClient.getDeckNames();
    
    if (deckNames.length === 0) {
      return {
        content: [{
          type: 'text',
          text: 'No decks found. Make sure you have at least one deck in Anki.'
        }]
      };
    }

    return {
      content: [{
        type: 'text',
        text: `Found ${deckNames.length} deck(s):\n${deckNames.map(name => `• ${name}`).join('\n')}`
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `Error getting deck names: ${error instanceof Error ? error.message : String(error)}`
      }],
      isError: true
    };
  }
}

/**
 * Handle getting cards from a specific deck
 */
export async function handleGetCardsInDeck(
  ankiClient: AnkiConnectClient,
  args: ToolArguments
): Promise<CallToolResult> {
  try {
    const { deck, limit = 10 } = args as GetCardsParams;
    
    if (!deck) {
      return {
        content: [{
          type: 'text',
          text: 'Error: deck parameter is required'
        }],
        isError: true
      };
    }

    // Get card IDs in the deck
    const cardIds = await ankiClient.getCardsInDeck(deck, limit);
    
    if (cardIds.length === 0) {
      return {
        content: [{
          type: 'text',
          text: `No cards found in deck "${deck}"`
        }]
      };
    }

    // Get detailed card information
    const cardsInfo = await ankiClient.getCardsInfo(cardIds);
    
    const cardsList = cardsInfo.map((card, index) => {
      const front = card.fields.Front?.value || 'N/A';
      const back = card.fields.Back?.value || 'N/A';
      return `${index + 1}. ${front} → ${back}`;
    }).join('\n');

    return {
      content: [{
        type: 'text',
        text: `Cards in deck "${deck}" (showing ${Math.min(limit, cardIds.length)} of ${cardIds.length}):\n\n${cardsList}`
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `Error getting cards from deck: ${error instanceof Error ? error.message : String(error)}`
      }],
      isError: true
    };
  }
}

/**
 * Handle getting deck statistics
 */
export async function handleGetDeckStats(
  ankiClient: AnkiConnectClient,
  args: ToolArguments
): Promise<CallToolResult> {
  try {
    const { deck } = args as { deck: string };
    
    if (!deck) {
      return {
        content: [{
          type: 'text',
          text: 'Error: deck parameter is required'
        }],
        isError: true
      };
    }

    // Get all cards in the deck
    const allCardIds = await ankiClient.getCardsInDeck(deck);
    const totalCards = allCardIds.length;

    if (totalCards === 0) {
      return {
        content: [{
          type: 'text',
          text: `Deck "${deck}" is empty`
        }]
      };
    }

    // Get cards info to analyze their states
    const cardsInfo = await ankiClient.getCardsInfo(allCardIds);
    
    // Analyze card states (simplified - Anki has complex queue/type system)
    let newCards = 0;
    let learningCards = 0;
    let reviewCards = 0;

    cardsInfo.forEach(card => {
      // Queue: 0=suspended, 1=learning, 2=review, 3=day learning, -1=buried
      // Type: 0=new, 1=learning, 2=review, 3=relearning
      if (card.type === 0) newCards++;
      else if (card.type === 1 || card.type === 3) learningCards++;
      else if (card.type === 2) reviewCards++;
    });

    return {
      content: [{
        type: 'text',
        text: `Statistics for deck "${deck}":\n` +
              `📊 Total cards: ${totalCards}\n` +
              `🆕 New cards: ${newCards}\n` +
              `📚 Learning cards: ${learningCards}\n` +
              `🔄 Review cards: ${reviewCards}`
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `Error getting deck statistics: ${error instanceof Error ? error.message : String(error)}`
      }],
      isError: true
    };
  }
}