import React, { useState, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';

interface InputBoxProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
}

export const InputBox: React.FC<InputBoxProps> = ({ onSubmit, isLoading }) => {
  const [input, setInput] = useState('');
  
  const handleKeyInput = useCallback((inputText: string, key: any) => {
    // 如果正在加载，禁用所有输入
    if (isLoading) return;
    
    // 处理特殊键
    if (key.return) {
      // 回车键：提交非空输入
      const trimmedInput = input.trim();
      if (trimmedInput) {
        onSubmit(trimmedInput);
        setInput('');
      }
      return;
    }
    
    if (key.backspace) {
      // 退格键：删除最后一个字符
      setInput(prev => prev.length > 0 ? prev.slice(0, -1) : '');
      return;
    }
    
    if (key.delete) {
      // Delete键：在CLI中通常与退格键行为相同
      setInput(prev => prev.length > 0 ? prev.slice(0, -1) : '');
      return;
    }
    
    if (key.escape) {
      // ESC键：清空整个输入
      setInput('');
      return;
    }
    
    // 处理普通字符输入
    if (inputText && 
        inputText.length > 0 && 
        !key.ctrl && 
        !key.meta && 
        !key.tab &&
        !key.return &&
        !key.backspace &&
        !key.delete &&
        !key.escape) {
      // 添加字符到输入
      setInput(prev => prev + inputText);
    }
  }, [input, onSubmit, isLoading]);
  
  useInput(handleKeyInput);

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