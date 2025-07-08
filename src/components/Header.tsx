import React from 'react';
import { Box, Text } from 'ink';

export const Header: React.FC = () => {
  return (
    <Box borderStyle="round" borderColor="cyan" padding={1}>
      <Text color="cyan" bold>
        Translator Agent v0.1.0
      </Text>
    </Box>
  );
}; 