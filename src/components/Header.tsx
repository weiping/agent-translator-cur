import React from 'react';
import { Box, Text } from 'ink';

export const Header: React.FC = () => {
  return (
    <Box flexDirection="column" alignItems="center" marginBottom={1}>
      <Box borderStyle="round" borderColor="cyan" padding={1}>
        <Text color="cyan" bold>
          Translator Agent <Text dimColor>v0.4.0</Text>
        </Text>
      </Box>
    </Box>
  );
}; 