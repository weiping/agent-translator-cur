#!/usr/bin/env node

import React from 'react';
import { render } from 'ink';
import { App } from './components/App.js';
import { validateConfig, getConfigStatus } from './utils/llm.js';
import { getNetworkStatus } from './utils/network.js';

// 检查命令行参数
const args = process.argv.slice(2);

if (args.includes('--config') || args.includes('-c')) {
  // 显示配置状态
  console.log('\n🔧 Translator Agent - 配置状态检查\n');
  console.log(getConfigStatus());
  
  // 测试网络连接
  console.log('\n🌐 网络连接测试:');
  try {
    const networkStatus = await getNetworkStatus();
    console.log(networkStatus);
  } catch (error) {
    console.log('❌ 网络测试失败:', error);
  }
  
  const configCheck = validateConfig();
  if (configCheck.isValid) {
    console.log('\n✅ 配置正常，可以正常使用AI服务');
  } else {
    console.log(`\n❌ 配置有误: ${configCheck.error}`);
    console.log('\n📝 解决方法:');
    console.log('1. 编辑 .env 文件');
    console.log('2. 将 OPENAI_API_KEY 设置为您的真实API密钥');
    console.log('3. 重新运行应用');
  }
  process.exit(0);
}

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
🌍 Translator Agent - 智能AI翻译助手

用法:
  npm run dev                 启动聊天界面
  npm run dev -- --config    检查配置状态
  npm run dev -- --help      显示帮助信息

配置:
  编辑 .env 文件，设置您的API密钥
  参考 .env.example 文件获取配置说明
`);
  process.exit(0);
}

// 启动应用
render(<App />);

export default App; 