import React from 'react';
import { Box, Text } from 'ink';
import { TranslationResponse } from '../types/index.js';

interface TranslationResultProps {
  translation: TranslationResponse;
}

export const TranslationResult: React.FC<TranslationResultProps> = ({ translation }) => {
  return (
    <Box flexDirection="column" borderStyle="single" borderColor="green" padding={1} marginY={1}>
      <Text color="green" bold>翻译结果:</Text>
      <Box marginTop={1}>
        <Text>{translation.translatedText}</Text>
      </Box>
      <Box marginTop={1}>
        <Text color="gray" dimColor>
          {translation.sourceLanguage} → {translation.targetLanguage}
          {translation.confidence && ` (置信度: ${Math.round(translation.confidence * 100)}%)`}
        </Text>
      </Box>
    </Box>
  );
}; 