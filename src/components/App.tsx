import React, { useState } from 'react';
import { Box, Text } from 'ink';
import { AppState } from '../types/index.js';
import { getDefaultConfig } from '../utils/config.js';
import { InputArea } from './InputArea.js';
import { TranslationResult } from './TranslationResult.js';
import { Header } from './Header.js';

export const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    isLoading: false,
    currentInput: '',
    config: getDefaultConfig(),
    history: []
  });

  const updateState = (updates: Partial<AppState>) => {
    setAppState((prev: AppState) => ({ ...prev, ...updates }));
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Header />
      
      <Box marginY={1}>
        <Text color="cyan">
          🌍 翻译助手 - 智能AI翻译工具
        </Text>
      </Box>
      
      <InputArea 
        appState={appState}
        updateState={updateState}
      />
      
      {appState.lastTranslation && (
        <TranslationResult 
          translation={appState.lastTranslation}
        />
      )}
      
      <Box marginTop={1}>
        <Text color="gray" dimColor>
          输入文本、文件路径或URL进行翻译。输入 /help 查看帮助。
        </Text>
      </Box>
    </Box>
  );
}; 