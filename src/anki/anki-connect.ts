/**
 * AnkiConnect Client
 * Handles communication with the AnkiConnect plugin
 */

import {
  AnkiConnectRequest,
  AnkiConnectResponse,
  CardInfo,
  NoteInfo,
  AddNoteParams
} from '../types';

/**
 * AnkiConnect client for communicating with Anki desktop application
 */
export class AnkiConnectClient {
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor(port: number = 8765, timeout: number = 5000) {
    this.baseUrl = `http://localhost:${port}`;
    this.timeout = timeout;
  }

  /**
   * Send a request to AnkiConnect
   * @param action - The AnkiConnect action to perform
   * @param params - Parameters for the action
   * @returns Promise resolving to the action result
   */
  async invoke<T = any>(action: string, params: any = {}): Promise<T> {
    const requestBody: AnkiConnectRequest = {
      action,
      version: 6,
      params
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json() as AnkiConnectResponse<T>;

    if (result.error) {
      throw new Error(`AnkiConnect error: ${result.error}`);
    }

    return result.result;
  }

  /**
   * Test connection to AnkiConnect
   * @returns Promise resolving to true if connection successful
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.invoke('version');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get all deck names
   * @returns Promise resolving to array of deck names
   */
  async getDeckNames(): Promise<string[]> {
    return this.invoke<string[]>('deckNames');
  }

  /**
   * Get cards in a specific deck
   * @param deckName - Name of the deck
   * @param limit - Maximum number of cards to return
   * @returns Promise resolving to array of card IDs
   */
  async getCardsInDeck(deckName: string, limit?: number): Promise<number[]> {
    let query = `deck:"${deckName}"`;

    const cardIds = await this.invoke<number[]>('findCards', {query});

    return limit ? cardIds.slice(0, limit) : cardIds;
  }

  /**
   * Get detailed information about cards
   * @param cardIds - Array of card IDs
   * @returns Promise resolving to array of card information
   */
  async getCardsInfo(cardIds: number[]): Promise<CardInfo[]> {
    return this.invoke<CardInfo[]>('cardsInfo', {cards: cardIds});
  }

  /**
   * Search for cards using Anki query syntax
   * @param query - Anki search query
   * @param limit - Maximum number of cards to return
   * @returns Promise resolving to array of card IDs
   */
  async searchCards(query: string, limit?: number): Promise<number[]> {
    const cardIds = await this.invoke<number[]>('findCards', {query});
    return limit ? cardIds.slice(0, limit) : cardIds;
  }

  /**
   * Add a new note to Anki
   * @param params - Note parameters including deck, model, fields, and tags
   * @returns Promise resolving to the new note ID
   */
  async addNote(params: AddNoteParams): Promise<number> {
    const noteData = {
      note: {
        deckName: params.deckName,
        modelName: params.modelName,
        fields: params.fields,
        tags: params.tags || []
      }
    };

    return this.invoke<number>('addNote', noteData);
  }

  /**
   * Get information about a specific note
   * @param noteId - The note ID
   * @returns Promise resolving to note information
   */
  async getNoteInfo(noteId: number): Promise<NoteInfo> {
    const notes = await this.invoke<NoteInfo[]>('notesInfo', { notes: [noteId] });
    if (notes.length === 0) {
      throw new Error(`Note with ID ${noteId} not found`);
    }
    return notes[0];
  }

  /**
   * Get all available note types (models)
   * @returns Promise resolving to array of model names
   */
  async getModelNames(): Promise<string[]> {
    return this.invoke<string[]>('modelNames');
  }

  /**
   * Get field names for a specific model
   * @param modelName - Name of the note type/model
   * @returns Promise resolving to array of field names
   */
  async getModelFieldNames(modelName: string): Promise<string[]> {
    return this.invoke<string[]>('modelFieldNames', {modelName});
  }

  /**
   * Update fields of an existing note
   * @param noteId - The note ID to update
   * @param fields - Object with field names as keys and new values
   * @returns Promise resolving to null on success
   */
  async updateNoteFields(noteId: number, fields: Record<string, string>): Promise<null> {
    return this.invoke('updateNoteFields', {
      note: {
        id: noteId,
        fields
      }
    });
  }

  /**
   * Delete notes by their IDs
   * @param noteIds - Array of note IDs to delete
   * @returns Promise resolving to null on success
   */
  async deleteNotes(noteIds: number[]): Promise<null> {
    return this.invoke('deleteNotes', {notes: noteIds});
  }
}