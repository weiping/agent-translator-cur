import { createOpenAI } from "@ai-sdk/openai";
import { CoreMessage, generateText } from "ai";
import dotenv from "dotenv";

// 加载环境变量
dotenv.config();

// 配置验证函数
export function validateConfig(): { isValid: boolean; error?: string } {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseURL = process.env.OPENAI_BASE_URL;
  
  if (!apiKey || apiKey === 'your-api-key-here') {
    return {
      isValid: false,
      error: '请在 .env 文件中配置真实的 OPENAI_API_KEY'
    };
  }
  
  if (!baseURL) {
    return {
      isValid: false,
      error: '请在 .env 文件中配置 OPENAI_BASE_URL'
    };
  }
  
  return { isValid: true };
}

export const openai = createOpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
});

export const getLanguageModel = (modelName?: string): any => {
  const model = modelName ?? (process.env.MODEL_NAME || "doubao-seed-1-6-250615");
  return openai(model);
};

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function sendMessageToLLM(
  messages: ChatMessage[],
  systemPrompt?: string
): Promise<string> {
  // 首先验证配置
  const configCheck = validateConfig();
  if (!configCheck.isValid) {
    throw new Error(configCheck.error || '配置无效');
  }

  try {
    const result = await generateText({
      model: getLanguageModel(),
      system: systemPrompt || 'You are a helpful assistant.',
      temperature: 0.1,
      messages: messages as CoreMessage[],
    });

    return result.text;
  } catch (error: any) {
    console.error('LLM API Error:', error);
    
    // 提供更详细的错误信息
    if (error?.message?.includes('401') || error?.message?.includes('unauthorized')) {
      throw new Error('API密钥无效，请检查 .env 文件中的 OPENAI_API_KEY');
    }
    
    if (error?.message?.includes('network') || error?.code === 'ENOTFOUND') {
      throw new Error('网络连接失败，请检查网络连接和 OPENAI_BASE_URL');
    }
    
    if (error?.message?.includes('quota') || error?.message?.includes('limit')) {
      throw new Error('API配额不足或超出限制，请检查账户余额');
    }
    
    throw new Error(`AI服务连接失败: ${error?.message || '未知错误'}`);
  }
}

export function getConfigStatus(): string {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseURL = process.env.OPENAI_BASE_URL;
  const modelName = process.env.MODEL_NAME;
  
  return `配置状态:
- API Key: ${apiKey === 'your-api-key-here' ? '❌ 未配置 (请设置真实密钥)' : '✅ 已配置'}
- Base URL: ${baseURL ? '✅ ' + baseURL : '❌ 未配置'}
- Model: ${modelName || 'doubao-seed-1-6-250615 (默认)'}`;
} 