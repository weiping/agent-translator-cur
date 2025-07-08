import { createOpenAI } from "@ai-sdk/openai";
import { CoreMessage, generateText, tool } from "ai";
import { z } from "zod";
import dotenv from "dotenv";
import { fileReaderTool, urlFetcherTool } from "../tools/index.js";

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

// 工具调用回调接口
export interface ToolCallbacks {
  onStatusUpdate: (status: string) => void;
  onToolCall: (toolName: string, args: any) => void;
  onToolResult: (toolName: string, result: any) => void;
}

// 创建工具定义，用于AI SDK
const aiTools = {
  fileReader: tool({
    description: '读取本地文本文件内容，支持 .md, .txt, .html 等格式',
    parameters: z.object({
      filePath: z.string().describe('要读取的文件路径')
    }),
    execute: async ({ filePath }) => {
      const abortController = new AbortController();
      const context = { 
        abortController, 
        options: { isNonInteractiveSession: true } 
      };
      
      // 调用自定义工具
      const generator = fileReaderTool.call({ filePath }, context);
      const result = await generator.next();
      
      if (result.value?.type === 'error') {
        throw new Error(result.value.data.error);
      }
      
      return result.value?.data || { error: '文件读取失败' };
    }
  }),
  
  urlFetcher: tool({
    description: '抓取网页内容并转换为Markdown格式',
    parameters: z.object({
      url: z.string().url().describe('要抓取的网页URL地址')
    }),
    execute: async ({ url }) => {
      const abortController = new AbortController();
      const context = { 
        abortController, 
        options: { isNonInteractiveSession: true } 
      };
      
      // 调用自定义工具
      const generator = urlFetcherTool.call({ url }, context);
      const result = await generator.next();
      
      if (result.value?.type === 'error') {
        throw new Error(result.value.data.error);
      }
      
      return result.value?.data || { error: '网页抓取失败' };
    }
  })
};

export async function sendMessageToLLM(
  messages: ChatMessage[],
  systemPrompt?: string,
  callbacks?: ToolCallbacks
): Promise<string> {
  // 首先验证配置
  const configCheck = validateConfig();
  if (!configCheck.isValid) {
    throw new Error(configCheck.error || '配置无效');
  }

  // 改进的系统提示词，包含工具使用说明
  const enhancedSystemPrompt = `${systemPrompt || 'You are a helpful assistant.'}

你拥有以下工具可以使用：

1. fileReader: 读取本地文件内容
   - 支持的格式：.md, .txt, .html, .htm, .json, .csv, .xml, .yml, .yaml
   - 参数：filePath (文件路径)
   - 返回：{ filename: string, content: string }

2. urlFetcher: 抓取网页内容
   - 支持HTTP/HTTPS协议的网页
   - 参数：url (网页地址)
   - 返回：{ url: string, content: string (markdown), title: string }

当用户询问文件内容或提供文件路径时，使用 fileReader 工具。
当用户询问网页内容或提供网址时，使用 urlFetcher 工具。
工具调用后，请基于返回的内容回答用户的问题。`;

  // 创建增强的工具定义，包含状态回调
  const enhancedAiTools = {
    fileReader: tool({
      description: '读取本地文本文件内容，支持 .md, .txt, .html 等格式',
      parameters: z.object({
        filePath: z.string().describe('要读取的文件路径')
      }),
      execute: async ({ filePath }) => {
        // 通知工具调用开始
        callbacks?.onStatusUpdate(`正在读取文件: ${filePath}`);
        callbacks?.onToolCall('fileReader', { filePath });
        
        const abortController = new AbortController();
        const context = { 
          abortController, 
          options: { isNonInteractiveSession: true } 
        };
        
        try {
          // 调用自定义工具
          const generator = fileReaderTool.call({ filePath }, context);
          const result = await generator.next();
          
          if (result.value?.type === 'error') {
            const error = result.value.data.error;
            callbacks?.onToolResult('fileReader', { error });
            throw new Error(error);
          }
          
          const toolResult = result.value?.data || { error: '文件读取失败' };
          callbacks?.onToolResult('fileReader', toolResult);
          callbacks?.onStatusUpdate('文件读取完成');
          
          return toolResult;
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : '文件读取失败';
          callbacks?.onToolResult('fileReader', { error: errorMsg });
          throw error;
        }
      }
    }),
    
    urlFetcher: tool({
      description: '抓取网页内容并转换为Markdown格式',
      parameters: z.object({
        url: z.string().url().describe('要抓取的网页URL地址')
      }),
      execute: async ({ url }) => {
        // 通知工具调用开始
        callbacks?.onStatusUpdate(`正在抓取网页: ${url}`);
        callbacks?.onToolCall('urlFetcher', { url });
        
        const abortController = new AbortController();
        const context = { 
          abortController, 
          options: { isNonInteractiveSession: true } 
        };
        
        try {
          // 调用自定义工具
          const generator = urlFetcherTool.call({ url }, context);
          const result = await generator.next();
          
          if (result.value?.type === 'error') {
            const error = result.value.data.error;
            callbacks?.onToolResult('urlFetcher', { error });
            throw new Error(error);
          }
          
          const toolResult = result.value?.data || { error: '网页抓取失败' };
          callbacks?.onToolResult('urlFetcher', toolResult);
          callbacks?.onStatusUpdate('网页抓取完成');
          
          return toolResult;
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : '网页抓取失败';
          callbacks?.onToolResult('urlFetcher', { error: errorMsg });
          throw error;
        }
      }
    })
  };

  try {
    callbacks?.onStatusUpdate('正在等待AI响应...');
    
    const result = await generateText({
      model: getLanguageModel(),
      system: enhancedSystemPrompt,
      temperature: 0.1,
      messages: messages as CoreMessage[],
      tools: enhancedAiTools,
      maxSteps: 3, // 允许最多3步工具调用
    });

    callbacks?.onStatusUpdate('AI响应完成');
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