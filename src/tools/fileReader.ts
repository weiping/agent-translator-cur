import { z } from "zod";
import { readFile } from 'fs/promises';
import { extname, basename } from 'path';

export type ToolInput = { [key: string]: string };

export interface ToolResult {
  type: string;
  data: any;
}

export interface Tool<T extends ToolInput> {
  name: string;
  description: string;
  inputSchema: z.ZodSchema;
  prompt(tool: T): Promise<string>;
  call(input: T, context: {
    abortController: AbortController;
    options: { isNonInteractiveSession: boolean }
  }): AsyncGenerator<ToolResult, void, unknown>;
}

// 文件读取工具输入参数
export interface FileReaderInput extends ToolInput {
  filePath: string;
}

// 文件读取工具结果
export interface FileReaderResult {
  filename: string;
  content: string;
}

// 支持的文件扩展名
const SUPPORTED_EXTENSIONS = ['.md', '.txt', '.html', '.htm', '.json', '.csv', '.xml', '.yml', '.yaml'];

export const fileReaderTool: Tool<FileReaderInput> = {
  name: 'fileReader',
  description: '读取本地文本文件内容，支持 .md, .txt, .html 等格式',
  
  inputSchema: z.object({
    filePath: z.string().describe('要读取的文件路径')
  }),

  async prompt(tool: FileReaderInput): Promise<string> {
    return `用户想要读取文件: ${tool.filePath}`;
  },

  async *call(
    input: FileReaderInput, 
    context: { abortController: AbortController; options: { isNonInteractiveSession: boolean } }
  ): AsyncGenerator<ToolResult, void, unknown> {
    try {
      const { filePath } = input;
      const extension = extname(filePath).toLowerCase();
      
      // 检查文件扩展名
      if (!SUPPORTED_EXTENSIONS.includes(extension)) {
        yield {
          type: 'error',
          data: {
            error: `不支持的文件格式: ${extension}。支持的格式: ${SUPPORTED_EXTENSIONS.join(', ')}`
          }
        };
        return;
      }

      // 读取文件内容
      const content = await readFile(filePath, 'utf-8');
      const filename = basename(filePath);

      const result: FileReaderResult = {
        filename,
        content
      };

      yield {
        type: 'success',
        data: result
      };

    } catch (error: any) {
      yield {
        type: 'error',
        data: {
          error: `文件读取失败: ${error.message}`
        }
      };
    }
  }
}; 