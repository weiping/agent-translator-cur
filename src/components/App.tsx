import React, { useState } from 'react';
import { Box, Text } from 'ink';
import { AppState, Message } from '../types/index.js';
import { Header } from './Header.js';
import { MessageHistory } from './MessageHistory.js';
import { InputBox } from './InputBox.js';
import { StatusBar } from './StatusBar.js';

export const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    messages: [],
    currentInput: '',
    isLoading: false,
    statusMessage: '欢迎使用 Translator Agent！',
    error: undefined
  });

  const addMessage = (content: string, type: 'user' | 'system') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      type
    };
    
    setAppState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));
  };

  const handleSubmit = async (message: string) => {
    // 添加用户消息
    addMessage(message, 'user');
    
    // 设置loading状态
    setAppState(prev => ({
      ...prev,
      isLoading: true,
      statusMessage: '正在处理消息...',
      error: undefined
    }));

    try {
      // 模拟处理延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 添加系统回复
      addMessage(`收到您的消息: "${message}"`, 'system');
      
      setAppState(prev => ({
        ...prev,
        isLoading: false,
        statusMessage: '消息已处理'
      }));
    } catch (error) {
      setAppState(prev => ({
        ...prev,
        isLoading: false,
        error: '处理消息时发生错误'
      }));
    }
  };

  return (
    <Box flexDirection="column" height="100%" padding={1}>
      {/* 顶部欢迎消息 */}
      <Header />
      
      <Box marginY={1}>
        <Text color="cyan" bold>
          🌍 Translator Agent - 智能AI翻译助手
        </Text>
      </Box>
      
      {/* 中间消息历史区域 */}
      <MessageHistory messages={appState.messages} />
      
      {/* 底部输入框 */}
      <InputBox 
        onSubmit={handleSubmit}
        isLoading={appState.isLoading}
      />
      
      {/* 状态栏 */}
      <StatusBar 
        statusMessage={appState.statusMessage}
        error={appState.error}
      />
    </Box>
  );
}; 