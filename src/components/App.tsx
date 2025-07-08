import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { AppState, Message } from '../types/index.js';
import { Header } from './Header.js';
import { MessageHistory } from './MessageHistory.js';
import { InputBox } from './InputBox.js';
import { StatusBar } from './StatusBar.js';
import { sendMessageToLLM, ChatMessage, validateConfig, getConfigStatus, ToolCallbacks } from '../utils/llm.js';

export const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    messages: [],
    currentInput: '',
    isLoading: false,
    statusMessage: '正在检查配置...',
    error: undefined
  });

  const [configValid, setConfigValid] = useState<boolean>(false);

  // 初始化时检查配置
  useEffect(() => {
    const configCheck = validateConfig();
    setConfigValid(configCheck.isValid);
    
    if (configCheck.isValid) {
      setAppState(prev => ({
        ...prev,
        statusMessage: '✅ 配置正常，您可以开始聊天了！'
      }));
    } else {
      setAppState(prev => ({
        ...prev,
        error: configCheck.error,
        statusMessage: '❌ 配置有误，请查看下方错误信息'
      }));
    }
  }, []);

  const addMessage = (content: string, type: 'user' | 'system' | 'tool-call' | 'tool-result', toolName?: string, toolArgs?: Record<string, any>) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      type,
      toolName,
      toolArgs
    };
    
    setAppState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));
  };

  const handleSubmit = async (message: string) => {
    // 如果配置无效，不允许发送消息
    if (!configValid) {
      setAppState(prev => ({
        ...prev,
        error: '请先配置正确的API密钥'
      }));
      return;
    }

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
        ...appState.messages
          .filter(msg => msg.type === 'user' || msg.type === 'system') // 只包含对话消息，不包含工具消息
          .map(msg => ({
            role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
            content: msg.content
          })),
        {
          role: 'user' as const,
          content: message
        }
      ];

      // 创建工具调用回调
      const toolCallbacks: ToolCallbacks = {
        onStatusUpdate: (status: string) => {
          setAppState(prev => ({
            ...prev,
            statusMessage: status
          }));
        },
        onToolCall: (toolName: string, args: any) => {
          // 添加工具调用消息
          const argsStr = JSON.stringify(args, null, 2);
          addMessage(`调用工具: ${toolName}\n参数: ${argsStr}`, 'tool-call', toolName, args);
        },
        onToolResult: (toolName: string, result: any) => {
          // 添加工具结果消息
          let resultStr: string;
          if (result.error) {
            resultStr = `❌ 错误: ${result.error}`;
          } else if (result.filename && result.content) {
            resultStr = `✅ 成功读取文件: ${result.filename}\n内容长度: ${result.content.length} 字符`;
          } else if (result.url && result.title) {
            resultStr = `✅ 成功抓取网页: ${result.title}\n地址: ${result.url}\n内容长度: ${result.content?.length || 0} 字符`;
          } else {
            resultStr = `✅ 工具执行完成\n结果: ${JSON.stringify(result, null, 2)}`;
          }
          addMessage(resultStr, 'tool-result', toolName);
        }
      };

      // 发送到LLM并获取回复
      const response = await sendMessageToLLM(chatHistory, 'You are a helpful assistant.', toolCallbacks);
      
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
      
      {/* 配置状态显示 */}
      {!configValid && (
        <Box marginY={1} padding={1} borderStyle="round" borderColor="yellow">
          <Box flexDirection="column">
            <Text color="yellow" bold>⚠️  配置指南</Text>
            <Text>
              请编辑 .env 文件，将 OPENAI_API_KEY 设置为您的真实API密钥
            </Text>
            <Box marginTop={1}>
              <Text dimColor>配置状态：</Text>
            </Box>
            {getConfigStatus().split('\n').map((line, i) => (
              <Text key={i} dimColor>{line}</Text>
            ))}
          </Box>
        </Box>
      )}

      {/* 状态栏 */}
      <StatusBar 
        statusMessage={appState.statusMessage}
        error={appState.error}
      />
    </Box>
  );
}; 