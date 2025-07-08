import React from 'react';
import { Box, Text } from 'ink';

interface StatusBarProps {
  statusMessage: string;
  error?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ statusMessage, error }) => {
  return (
    <Box paddingX={1} marginTop={1}>
      {error ? (
        <Text color="red">
          ❌ {error}
        </Text>
      ) : (
        <Text color="gray" dimColor>
          {statusMessage || '准备就绪 - 输入消息并按回车发送'}
        </Text>
      )}
    </Box>
  );
}; 