# MCP Server Anki

<div align="center">
  <img src="./src/public/icons8-anki-480.png" alt="Anki Logo" width="120" height="120">

  [![MCP](https://img.shields.io/badge/MCP-Model%20Context%20Protocol-blue)](https://modelcontextprotocol.io)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue)](https://www.typescriptlang.org/)
  [![AnkiConnect](https://img.shields.io/badge/AnkiConnect-Required-green)](https://github.com/FooSoft/anki-connect)

  **中文** | [English](./README.md)
</div>

一个基于 Model Context Protocol (MCP) 的服务器，用于连接 Anki 与 AI 工具，实现智能化的记忆卡片管理和学习辅助。

> 💡 **兼容性说明**：本服务器支持**所有兼容 MCP 协议的 AI 工具**，包括 Claude Code、Cline、Zed AI 等。本文档以 Claude Code 为例进行说明，但其他工具的配置过程类似。

## 🌟 功能特性

- 📚 **牌组管理**：获取牌组列表、查看牌组统计信息
- 🔍 **卡片搜索**：支持 Anki 高级查询语法的卡片搜索
- ➕ **智能创建**：通过 AI 辅助创建和管理 Anki 卡片
- 📊 **数据分析**：获取学习统计和进度信息
- 🔧 **模板管理**：查看和使用不同的笔记类型

## 📋 前置要求

1. **Anki 桌面版** - [下载 Anki](https://apps.ankiweb.net/)
2. **AnkiConnect 插件** - 在 Anki 中安装插件（代码：`2055492159`）
3. **Node.js** - 版本 16 或更高
4. **支持 MCP 的 AI 工具** - 例如：
   - [Claude Code](https://claude.ai/code)
   - [Cline](https://github.com/clinebot/cline)
   - [Zed AI](https://zed.dev)
   - 其他任何支持 MCP 的工具

## 🚀 快速开始

### 1. 安装 AnkiConnect

在 Anki 中：
1. 工具 → 插件 → 获取插件
2. 输入代码：`2055492159`
3. 重启 Anki

### 2. 配置 MCP 客户端

> 以下示例使用 Claude Code，但其他 MCP 兼容工具的配置方式类似。

#### 方式 A：使用命令行

```bash
# Claude Code 示例
claude mcp add anki -- npx mcp-server-anki

# 其他工具请参考其文档中的相应命令
```

#### 方式 B：手动配置

在 MCP 客户端的配置文件中添加：

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

## 📖 使用指南

### 基本工作流程

1. **启动 Anki** - 确保 Anki 正在运行且 AnkiConnect 已启用
2. **启动 MCP Server** - 通过 Claude Code 自动启动
3. **使用 AI 工具** - 在 Claude Code 中与 Anki 交互

### 示例对话

```
用户：帮我查看"英语词汇"牌组的学习进度

Claude：我来帮您查看"英语词汇"牌组的统计信息...
[调用 get_deck_stats 工具]

用户：创建一个新的英语单词卡片，单词是"ephemeral"

Claude：我来为您创建这个单词卡片...
[调用 add_note 工具]
```

## 🛠️ 可用工具

| 工具名称 | 功能描述 | 参数 |
|---------|---------|------|
| `get_deck_names` | 获取所有牌组名称 | 无 |
| `get_cards_in_deck` | 获取指定牌组的卡片 | `deckName` |
| `get_deck_stats` | 获取牌组统计信息 | `deckName` |
| `search_cards` | 搜索卡片 | `query` |
| `add_note` | 添加新笔记 | `deckName`, `modelName`, `fields`, `tags` |
| `get_models` | 获取所有笔记类型 | 无 |
| `get_model_fields` | 获取笔记类型字段 | `modelName` |

## 🏗️ 项目结构

```
mcp-server-anki/
├── src/
│   ├── index.ts           # MCP 服务器入口
│   ├── ankiConnect.ts      # AnkiConnect API 客户端
│   └── tools/              # MCP 工具定义
│       ├── deckTools.ts    # 牌组相关工具
│       ├── cardTools.ts    # 卡片相关工具
│       └── noteTools.ts    # 笔记相关工具
├── dist/                   # 编译后的 JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 开发

### 构建命令

```bash
# 开发模式（监听文件变化）
npm run dev

# 生产构建
npm run build
```

### 架构说明

```
Claude Code (MCP 客户端) ←→ Anki MCP Server ←→ AnkiConnect ←→ Anki 桌面版
```

## 📝 API 文档

### get_deck_names
获取所有牌组的名称列表。

**返回示例：**
```json
["默认", "英语词汇", "编程知识"]
```

### search_cards(query)
使用 Anki 查询语法搜索卡片。

**参数：**
- `query`：Anki 查询字符串（如 `deck:英语词汇 is:due`）

**查询语法示例：**
- `deck:牌组名` - 指定牌组
- `tag:标签名` - 按标签搜索
- `is:due` - 到期的卡片
- `is:new` - 新卡片
- `added:7` - 最近 7 天添加的卡片

### add_note
添加新的笔记到 Anki。

**参数：**
- `deckName`：目标牌组名称
- `modelName`：笔记类型（如 "Basic", "Cloze"）
- `fields`：字段内容对象
- `tags`：标签数组（可选）

**示例：**
```json
{
  "deckName": "英语词汇",
  "modelName": "Basic",
  "fields": {
    "Front": "ephemeral",
    "Back": "短暂的；朝生暮死的"
  },
  "tags": ["vocabulary", "adjective"]
}
```

## 🔧 从源码构建

如果您想贡献代码或自定义服务器：

```bash
# 克隆仓库
git clone https://github.com/here-tunan/mcp-server-anki.git
cd mcp-server-anki

# 安装依赖
npm install

# 编译 TypeScript
npm run build
```

要在 Claude Code 中使用本地构建版本，配置如下：
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

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

Apache License

## 🔗 相关链接

- [Anki 官网](https://apps.ankiweb.net/)
- [AnkiConnect 文档](https://foosoft.net/projects/anki-connect/)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Claude Code](https://claude.ai/code)

## ❓ 常见问题

**问：AnkiConnect 连接失败？**
答：确保 Anki 正在运行，并且 AnkiConnect 插件已安装并启用。默认端口是 8765。

**问：如何自定义笔记类型？**
答：在 Anki 中创建自定义笔记类型后，使用 `get_models` 和 `get_model_fields` 工具查看可用字段。

**问：支持移动端吗？**
答：目前仅支持桌面版 Anki，因为依赖 AnkiConnect 插件。

---

用 ❤️ 为 Anki 学习者和 AI 爱好者打造