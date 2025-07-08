import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { AppState, TranslationRequest } from '../types/index.js';
import { detectInputType } from '../utils/inputDetector.js';
import { translateText, translateFile, translateUrl } from '../utils/translator.js';

interface InputAreaProps {
  appState: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export const InputArea: React.FC<InputAreaProps> = ({ appState, updateState }) => {
  const [input, setInput] = useState('');
  const [cursor, setCursor] = useState(0);

  useInput((inputText, key) => {
    if (key.return) {
      handleSubmit(input);
    } else if (key.backspace) {
      setInput(prev => prev.slice(0, -1));
      setCursor(prev => Math.max(0, prev - 1));
    } else if (inputText) {
      setInput(prev => prev + inputText);
      setCursor(prev => prev + 1);
    }
  });

  const handleSubmit = async (value: string) => {
    if (!value.trim()) return;

    const inputType = detectInputType(value);
    updateState({ isLoading: true, currentInput: value });

    try {
      let result;
      
      switch (inputType) {
        case 'file':
          result = await translateFile(value, appState.config.defaultTargetLanguage);
          break;
        case 'url':
          result = await translateUrl(value, appState.config.defaultTargetLanguage);
          break;
        default:
          const request: TranslationRequest = {
            text: value,
            targetLanguage: appState.config.defaultTargetLanguage,
            type: inputType
          };
          result = await translateText(request);
      }

      updateState({
        isLoading: false,
        lastTranslation: result,
        history: [...appState.history, result]
      });
      
      setInput('');
      setCursor(0);
    } catch (error) {
      updateState({ isLoading: false });
      console.error('Translation error:', error);
    }
  };

  return (
    <Box flexDirection="column" marginY={1}>
      <Text color="green">输入要翻译的内容:</Text>
      <Box marginTop={1}>
        <Text color="gray">{'> '}</Text>
        <Text>{input}</Text>
        <Text color="gray">_</Text>
      </Box>
      {appState.isLoading && (
        <Box marginTop={1}>
          <Text color="yellow">翻译中...</Text>
        </Box>
      )}
      <Box marginTop={1}>
        <Text color="gray" dimColor>
          输入内容后按回车键翻译
        </Text>
      </Box>
    </Box>
  );
}; 