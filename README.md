# MCP Server Anki

<div align="center">
  <img src="./src/public/icons8-anki-480.png" alt="Anki Logo" width="120" height="120">

  [![MCP](https://img.shields.io/badge/MCP-Model%20Context%20Protocol-blue)](https://modelcontextprotocol.io)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue)](https://www.typescriptlang.org/)
  [![AnkiConnect](https://img.shields.io/badge/AnkiConnect-Required-green)](https://github.com/FooSoft/anki-connect)

  [中文文档](./README_zh.md) | **English**
</div>

A Model Context Protocol (MCP) server that bridges Anki with AI tools, enabling intelligent flashcard management and learning assistance.

> 💡 **Compatibility**: This server works with **any MCP-compatible AI tool** including Claude Code, Cline, Zed AI, and more. We use Claude Code as an example in this documentation, but the setup process is similar for other tools.

## 🌟 Features

- 📚 **Deck Management**: Get deck lists, view deck statistics
- 🔍 **Card Search**: Search cards using Anki's advanced query syntax
- ➕ **Smart Creation**: Create and manage Anki cards with AI assistance
- 📊 **Data Analysis**: Get learning statistics and progress information
- 🔧 **Template Management**: View and use different note types

## 📋 Prerequisites

1. **Anki Desktop** - [Download Anki](https://apps.ankiweb.net/)
2. **AnkiConnect Plugin** - Install in Anki (Code: `2055492159`)
3. **Node.js** - Version 16 or higher
4. **MCP-compatible AI Tool** - Such as:
   - [Claude Code](https://claude.ai/code)
   - [Cline](https://github.com/clinebot/cline)
   - [Zed AI](https://zed.dev)
   - Any other tool supporting MCP

## 🚀 Quick Start

### 1. Install AnkiConnect

In Anki:
1. Tools → Add-ons → Get Add-ons
2. Enter code: `2055492159`
3. Restart Anki

### 2. Configure Your MCP Client

> The following examples use Claude Code, but the configuration is similar for other MCP-compatible tools.

#### Option A: Using Command Line

```bash
# For Claude Code
claude mcp add anki -- npx mcp-server-anki

# For other tools, consult their documentation for the equivalent command
```

#### Option B: Manual Configuration

Add the server to your MCP client's configuration file:

```json
{
  "mcp": {
    "servers": {
      "anki": {
        "command": "npx",
        "args": ["mcp-server-anki"]
      }
    }
  }
}
```

## 📖 Usage Guide

### Basic Workflow

1. **Start Anki** - Ensure Anki is running with AnkiConnect enabled
2. **Start MCP Server** - Automatically started by Claude Code
3. **Use AI Tools** - Interact with Anki through Claude Code

### Example Conversations

```
User: Show me the learning progress for my "English Vocabulary" deck

Claude: I'll check the statistics for your "English Vocabulary" deck...
[Calls get_deck_stats tool]

User: Create a new English word card for "ephemeral"

Claude: I'll create this word card for you...
[Calls add_note tool]
```

## 🛠️ Available Tools

| Tool Name | Description | Parameters |
|-----------|-------------|------------|
| `get_deck_names` | Get all deck names | None |
| `get_cards_in_deck` | Get cards from a specific deck | `deckName` |
| `get_deck_stats` | Get deck statistics | `deckName` |
| `search_cards` | Search cards | `query` |
| `add_note` | Add new note | `deckName`, `modelName`, `fields`, `tags` |
| `get_models` | Get all note types | None |
| `get_model_fields` | Get note type fields | `modelName` |

## 🏗️ Project Structure

```
mcp-server-anki/
├── src/
│   ├── index.ts           # MCP server entry point
│   ├── ankiConnect.ts      # AnkiConnect API client
│   └── tools/              # MCP tool definitions
│       ├── deckTools.ts    # Deck-related tools
│       ├── cardTools.ts    # Card-related tools
│       └── noteTools.ts    # Note-related tools
├── dist/                   # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Development

### Build Commands

```bash
# Development mode (watch for changes)
npm run dev

# Production build
npm run build
```

### Architecture

```
Claude Code (MCP Client) ←→ Anki MCP Server ←→ AnkiConnect ←→ Anki Desktop
```

## 📝 API Documentation

### get_deck_names
Get a list of all deck names.

**Returns:**
```json
["Default", "English Vocabulary", "Programming"]
```

### search_cards(query)
Search cards using Anki query syntax.

**Parameters:**
- `query`: Anki query string (e.g., `deck:English is:due`)

**Query Syntax Examples:**
- `deck:DeckName` - Specific deck
- `tag:TagName` - By tag
- `is:due` - Due cards
- `is:new` - New cards
- `added:7` - Cards added in last 7 days

### add_note
Add a new note to Anki.

**Parameters:**
- `deckName`: Target deck name
- `modelName`: Note type (e.g., "Basic", "Cloze")
- `fields`: Field content object
- `tags`: Tag array (optional)

**Example:**
```json
{
  "deckName": "English Vocabulary",
  "modelName": "Basic",
  "fields": {
    "Front": "ephemeral",
    "Back": "lasting for a very short time"
  },
  "tags": ["vocabulary", "adjective"]
}
```

## 🔧 Building from Source

If you want to contribute or customize the server:

```bash
# Clone the repository
git clone https://github.com/here-tunan/mcp-server-anki.git
cd mcp-server-anki

# Install dependencies
npm install

# Build TypeScript
npm run build
```

To use your local build with Claude Code, configure it with:
```json
{
  "mcp": {
    "servers": {
      "anki": {
        "command": "node",
        "args": ["/path/to/mcp-server-anki/dist/index.js"]
      }
    }
  }
}
```

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📄 License

Apache License

## 🔗 Links

- [Anki Official](https://apps.ankiweb.net/)
- [AnkiConnect Documentation](https://foosoft.net/projects/anki-connect/)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Claude Code](https://claude.ai/code)

## ❓ FAQ

**Q: AnkiConnect connection failed?**

A: Ensure Anki is running and AnkiConnect plugin is installed and enabled. Default port is 8765.

**Q: How to customize note types?**

A: After creating custom note types in Anki, use `get_models` and `get_model_fields` tools to view available fields.

**Q: Mobile support?**

A: Currently only supports desktop Anki due to AnkiConnect dependency.

---

Made with ❤️ for Anki learners and AI enthusiasts
