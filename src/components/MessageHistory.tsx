import React from 'react';
import { Box, Text } from 'ink';
import { Message } from '../types/index.js';

interface MessageHistoryProps {
  messages: Message[];
}

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
        messages.map((message) => (
          <Box key={message.id} marginBottom={1}>
            <Box marginRight={1}>
              <Text color={message.type === 'user' ? 'cyan' : 'green'} bold>
                {message.type === 'user' ? '👤' : '🤖'}
              </Text>
            </Box>
            <Box flexDirection="column" flexGrow={1}>
              <Text color={message.type === 'user' ? 'cyan' : 'white'}>
                {message.content}
              </Text>
              <Text color="gray" dimColor>
                {message.timestamp.toLocaleTimeString()}
              </Text>
            </Box>
          </Box>
        ))
      )}
    </Box>
  );
}; 