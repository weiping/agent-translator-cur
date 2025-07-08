import { createOpenAI } from "@ai-sdk/openai";
import { CoreMessage, generateText } from "ai";
import dotenv from "dotenv";

// 加载环境变量
dotenv.config();

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
  try {
    const result = await generateText({
      model: getLanguageModel(),
      system: systemPrompt || 'You are a helpful assistant.',
      temperature: 0.1,
      messages: messages as CoreMessage[],
    });

    return result.text;
  } catch (error) {
    console.error('LLM API Error:', error);
    throw new Error('无法连接到AI服务，请检查网络连接和API配置');
  }
} 