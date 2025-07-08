import { InputType } from '../types';

export function detectInputType(input: string): InputType {
  // URL检测
  if (isUrl(input)) {
    return 'url';
  }
  
  // 文件路径检测
  if (isFilePath(input)) {
    return 'file';
  }
  
  // 默认为文本
  return 'text';
}

function isUrl(input: string): boolean {
  try {
    new URL(input);
    return true;
  } catch {
    return false;
  }
}

function isFilePath(input: string): boolean {
  // 简单的文件路径检测
  return input.includes('/') || input.includes('\\') || input.includes('.');
} 