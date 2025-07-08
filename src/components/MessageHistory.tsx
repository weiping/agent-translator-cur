import React from 'react';
import { Box, Text } from 'ink';
import { Message } from '../types/index.js';

interface MessageHistoryProps {
  messages: Message[];
}

// 获取消息类型的显示信息
const getMessageDisplay = (message: Message) => {
  switch (message.type) {
    case 'user':
      return { icon: '👤', color: 'cyan', label: '用户' };
    case 'system':
      return { icon: '🤖', color: 'green', label: 'AI' };
    case 'tool-call':
      return { icon: '🔧', color: 'yellow', label: '工具调用' };
    case 'tool-result':
      return { icon: '📋', color: 'magenta', label: '工具结果' };
    default:
      return { icon: '💬', color: 'gray', label: '消息' };
  }
};

export const MessageHistory: React.FC<MessageHistoryProps> = ({ messages }) => {
  return (
    <Box flexDirection="column" flexGrow={1} paddingX={1}>
      {messages.length === 0 ? (
        <Box justifyContent="center" alignItems="center" height={5}>
          <Text color="gray" dimColor>
            开始您的第一次对话...
          </Text>
        </Box>
      ) : (
        messages.map((message) => {
          const display = getMessageDisplay(message);
          
          return (
            <Box key={message.id} marginBottom={1}>
              <Box marginRight={1}>
                <Text color={display.color} bold>
                  {display.icon}
                </Text>
              </Box>
              <Box flexDirection="column" flexGrow={1}>
                {/* 消息类型标签 */}
                <Box marginBottom={0}>
                  <Text color={display.color} bold dimColor>
                    {display.label}
                    {message.toolName && ` (${message.toolName})`}
                  </Text>
                </Box>
                
                {/* 消息内容 */}
                <Text color={message.type === 'user' ? 'cyan' : 'white'}>
                  {message.content}
                </Text>
                
                {/* 时间戳 */}
                <Text color="gray" dimColor>
                  {message.timestamp.toLocaleTimeString()}
                </Text>
              </Box>
            </Box>
          );
        })
      )}
    </Box>
  );
}; 