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
      // 回车提交
      if (input.trim()) {
        onSubmit(input.trim());
        setInput('');
      }
    } else if (key.backspace) {
      // 退格键删除最后一个字符
      setInput(prev => prev.slice(0, -1));
    } else if (key.ctrl && inputText === 'c') {
      // Ctrl+C 退出应用
      process.exit(0);
    } else if (key.ctrl && inputText === 'u') {
      // Ctrl+U 清空输入
      setInput('');
    } else if (key.ctrl && inputText === 'l') {
      // Ctrl+L 清空输入
      setInput('');
    } else if (!key.ctrl && !key.meta && !key.escape && inputText) {
      // 普通字符输入（排除所有控制键）
      // 过滤掉不可见字符和控制字符
      if (inputText.length > 0 && inputText.charCodeAt(0) >= 32) {
        setInput(prev => prev + inputText);
      }
    }
  });

  return (
    <Box borderStyle="round" borderColor="cyan" paddingX={1}>
      <Text>
        <Text color="cyan" bold>{'> '}</Text>
        <Text>{input}</Text>
        <Text color={isLoading ? "yellow" : "green"}>
          {isLoading ? ' (正在处理...)' : '_'}
        </Text>
      </Text>
      {!isLoading && (
        <Box marginTop={1}>
          <Text dimColor>
            提示: 回车发送 | Ctrl+U 清空 | Ctrl+C 退出
          </Text>
        </Box>
      )}
    </Box>
  );
}; 