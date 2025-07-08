import { AppConfig } from '../types';

const DEFAULT_CONFIG: AppConfig = {
  defaultTargetLanguage: 'zh',
  provider: 'openai',
  theme: 'dark'
};

export function getDefaultConfig(): AppConfig {
  return { ...DEFAULT_CONFIG };
}

export function loadConfig(): AppConfig {
  // TODO: 从配置文件加载
  return getDefaultConfig();
}

export function saveConfig(config: AppConfig): void {
  // TODO: 保存到配置文件
  console.log('Config saved:', config);
} 