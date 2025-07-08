import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';

interface InputBoxProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
}

export const InputBox: React.FC<InputBoxProps> = ({ onSubmit, isLoading }) => {
  const [input, setInput] = useState('');
  
  useInput((inputText, key) => {
    if (isLoading) return;
    
    if (key.return) {
      if (input.trim()) {
        onSubmit(input.trim());
        setInput('');
      }
    } else if (key.backspace) {
      setInput(prev => prev.slice(0, -1));
    } else if (inputText) {
      setInput(prev => prev + inputText);
    }
  });

  return (
    <Box borderStyle="round" borderColor="cyan" paddingX={1}>
      <Text color="cyan" bold>
        {'> '}
      </Text>
      <Text>{input}</Text>
      <Text color="gray">
        {isLoading ? ' (正在处理...)' : '_'}
      </Text>
    </Box>
  );
}; 