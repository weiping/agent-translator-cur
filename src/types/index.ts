export interface TranslationRequest {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
  type: InputType;
}

export interface TranslationResponse {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence?: number;
}

export type InputType = 'text' | 'file' | 'url';

export interface AppConfig {
  defaultTargetLanguage: string;
  apiKey?: string;
  provider: string;
  theme: 'light' | 'dark';
  vocabulary?: Record<string, string>;
}

export interface Command {
  name: string;
  description: string;
  execute: (args?: string[]) => Promise<void> | void;
}

export interface AppState {
  isLoading: boolean;
  currentInput: string;
  lastTranslation?: TranslationResponse;
  config: AppConfig;
  history: TranslationResponse[];
} 