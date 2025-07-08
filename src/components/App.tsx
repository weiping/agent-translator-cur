import React, { useState } from 'react';
import { Box, Text } from 'ink';
import { AppState, Message } from '../types/index.js';
import { Header } from './Header.js';
import { MessageHistory } from './MessageHistory.js';
import { InputBox } from './InputBox.js';
import { StatusBar } from './StatusBar.js';
import { sendMessageToLLM, ChatMessage } from '../utils/llm.js';

export const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    messages: [],
    currentInput: '',
    isLoading: false,
    statusMessage: '欢迎使用 Translator Agent AI 聊天助手！',
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
      statusMessage: '正在与AI对话...',
      error: undefined
    }));

    try {
      // 准备消息历史，包含新的用户消息
      const chatHistory: ChatMessage[] = [
        ...appState.messages.map(msg => ({
          role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content
        })),
        {
          role: 'user' as const,
          content: message
        }
      ];

      // 发送到LLM并获取回复
      const response = await sendMessageToLLM(chatHistory, 'You are a helpful assistant.');
      
      // 添加AI回复
      addMessage(response, 'system');
      
      setAppState(prev => ({
        ...prev,
        isLoading: false,
        statusMessage: 'AI回复完成'
      }));
    } catch (error) {
      console.error('LLM Error:', error);
      setAppState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : '与AI服务通信失败'
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