# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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