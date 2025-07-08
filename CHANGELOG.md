# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.1] - 2025-01-08

### Fixed
- 🐛 **输入框Backspace键修复**: 解决Backspace键无法正常回退删除字符的问题
- ⌨️ **键盘事件优化**: 改进键盘输入处理逻辑，分离特殊键和普通字符处理
- 🚀 **性能提升**: 使用useCallback优化InputBox组件性能，减少不必要重渲染
- 🛡️ **边缘情况处理**: 添加字符串长度检查，避免空字符串操作错误

### Added
- ✨ **ESC键清空**: 支持使用ESC键快速清空输入框
- 🔧 **Delete键支持**: Delete键与Backspace键行为一致
- 📋 **测试指南**: 新增BACKSPACE_FIX_TEST.md详细测试说明

### Changed
- 🎯 **键盘交互改进**: 更严格的控制键过滤，避免乱码字符输入
- 💬 **用户体验优化**: 更响应的键盘交互和一致的键盘行为

## [0.3.0] - 2025-01-08

### Added
- 🛠️ **工具系统核心**: 实现完整的工具调用框架和接口定义
- 📁 **文件读取工具**: 支持读取本地文本文件(.md, .txt, .html, .json, .csv, .xml, .yml等)
- 🌐 **URL抓取工具**: 自动抓取网页内容并转换为Markdown格式
- 🤖 **AI工具集成**: 使用AI SDK的tool功能，支持智能工具调用和结果处理
- 📝 **智能识别**: AI自动识别用户意图，决定是否需要使用工具
- 🔄 **多步处理**: 支持maxSteps工具链调用，自动处理工具结果

### Changed
- 🧠 **LLM增强**: 更新系统提示词，包含工具使用说明和指导
- 📋 **工具说明**: 详细的工具参数说明和返回格式文档
- 🔍 **错误处理**: 完善的工具调用错误处理和用户友好提示

### Technical
- 新增依赖：`zod`用于参数验证，`turndown`用于HTML到Markdown转换
- 新增目录：`src/tools/`包含所有工具实现
- 工具接口：标准化的Tool、ToolInput、ToolResult接口
- AI SDK集成：使用`tool()`函数定义和`generateText`集成
- 异步生成器：使用AsyncGenerator模式处理工具结果

### Usage Examples
```bash
# 文件读取示例
用户: "读取 test.md 文件的内容"
AI: [自动调用fileReader工具] -> 返回文件内容摘要

# 网页抓取示例  
用户: "帮我看看 https://example.com 的内容"
AI: [自动调用urlFetcher工具] -> 返回网页内容摘要
```

## [0.2.1] - 2025-01-08

### Added
- 🔧 配置诊断系统：实现.env文件读取验证和API配置检查
- 🌐 网络连接测试：添加网络状态检测和延迟测量功能
- 📋 配置状态显示：在聊天界面实时显示配置状态和错误指南
- ⚙️ 命令行诊断：添加`npm run dev -- --config`配置检查命令
- 🛡️ 输入保护：配置无效时阻止消息发送，避免无效请求

### Changed
- 🔍 错误提示优化：提供API密钥、网络、配额等分类错误信息
- 💡 用户体验改进：显示详细的配置指南和解决步骤
- 📝 环境文件更新：完善.env.example配置说明和注释

### Technical
- 新增`validateConfig()`和`getConfigStatus()`配置验证函数
- 新增`src/utils/network.ts`网络连接测试模块
- 改进LLM错误处理：401、网络、配额错误分类
- App组件集成配置检查和实时状态显示
- CLI入口支持配置诊断和帮助命令

## [0.2.0] - 2025-07-08

### Added
- 🤖 LLM集成：使用 `ai` 和 `@ai-sdk/openai` 实现真实AI对话
- 📡 AI服务工具：创建可复用的LLM访问工具函数 `src/utils/llm.ts`
- ⚙️ 环境配置：支持 `.env` 文件配置API密钥和模型参数
- 💬 真实对话：用户消息直接发送到LLM，获取AI回复
- 🔄 状态管理：显示"正在与AI对话..."、"AI回复完成"等状态
- ❌ 错误处理：优雅处理API连接失败和网络错误

### Changed
- 升级聊天体验：从模拟回复转为真实AI对话
- 状态消息优化：更准确的loading和成功状态描述
- 版本号更新：从 0.1.0 升级到 0.2.0

### Technical
- 新增依赖：`ai@^3.0.0`, `@ai-sdk/openai`, `dotenv`
- 环境变量支持：`OPENAI_BASE_URL`, `OPENAI_API_KEY`, `MODEL_NAME`
- 消息格式转换：App.tsx中的Message转换为LLM的ChatMessage格式

## [0.1.0] - 2025-07-08

### Added
- 实现类似 Gemini-CLI 的基础聊天界面
- 消息历史显示功能（用户消息👤 和系统回复🤖）
- 实时输入框和消息提交功能
- 状态栏显示处理状态和错误信息
- 新的UI组件：MessageHistory、InputBox、StatusBar
- 完整的消息类型定义和状态管理

### Changed
- 重构主界面布局：顶部欢迎消息 + 中间历史 + 底部输入 + 状态栏
- 更新版本号从 0.0.0 到 0.1.0
- 替换原有翻译界面为通用聊天界面

### Removed
- 移除废弃组件：InputArea、TranslationResult
- 清理旧的翻译相关UI逻辑

## [0.0.0] - 2025-07-08

### Added
- 初始化项目架构
- 基本的TypeScript配置和类型定义
- React + Ink 终端界面框架
- 智能输入类型检测（文本/文件/URL）
- 基础翻译服务接口
- 配置管理系统
- 主要UI组件：App、Header、InputArea、TranslationResult
- CLI入口文件设置
- 项目依赖和构建脚本配置

### Fixed
- 修复 npm run build 构建错误
- 解决 ESM 模块导入路径问题（添加 .js 扩展名）
- 修复 TypeScript 严格模式下的类型错误
- 确保开发和生产版本都能正常运行

### 技术栈
- Node.js v20+
- TypeScript (严格模式)
- React + Ink
- AI SDK集成准备
- npm包管理 