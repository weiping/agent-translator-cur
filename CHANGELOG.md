# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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