import { z } from "zod";
import TurndownService from 'turndown';
import { Tool, ToolInput, ToolResult } from './fileReader.js';

// URL抓取工具输入参数
export interface UrlFetcherInput extends ToolInput {
  url: string;
}

// URL抓取工具结果
export interface UrlFetcherResult {
  url: string;
  content: string; // markdown
  title: string;
}

export const urlFetcherTool: Tool<UrlFetcherInput> = {
  name: 'urlFetcher',
  description: '抓取网页内容并转换为Markdown格式',
  
  inputSchema: z.object({
    url: z.string().url().describe('要抓取的网页URL地址')
  }),

  async prompt(tool: UrlFetcherInput): Promise<string> {
    return `用户想要抓取网页内容: ${tool.url}`;
  },

  async *call(
    input: UrlFetcherInput, 
    context: { abortController: AbortController; options: { isNonInteractiveSession: boolean } }
  ): AsyncGenerator<ToolResult, void, unknown> {
    try {
      const { url } = input;
      
      // 验证URL格式
      let parsedUrl: URL;
      try {
        parsedUrl = new URL(url);
      } catch (error) {
        yield {
          type: 'error',
          data: {
            error: `无效的URL格式: ${url}`
          }
        };
        return;
      }

      // 检查协议
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        yield {
          type: 'error',
          data: {
            error: `仅支持HTTP和HTTPS协议，当前协议: ${parsedUrl.protocol}`
          }
        };
        return;
      }

      // 抓取网页内容
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; TranslatorAgent/1.0)'
        },
        signal: context.abortController.signal
      });

      if (!response.ok) {
        yield {
          type: 'error',
          data: {
            error: `HTTP请求失败: ${response.status} ${response.statusText}`
          }
        };
        return;
      }

      // 检查内容类型
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('text/html')) {
        yield {
          type: 'error',
          data: {
            error: `不支持的内容类型: ${contentType}。仅支持HTML页面。`
          }
        };
        return;
      }

      const html = await response.text();
      
      // 提取页面标题
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : parsedUrl.hostname;

      // 转换HTML为Markdown
      const turndownService = new TurndownService({
        headingStyle: 'atx',
        bulletListMarker: '-',
        codeBlockStyle: 'fenced'
      });
      
      const markdown = turndownService.turndown(html);

      const result: UrlFetcherResult = {
        url,
        content: markdown,
        title
      };

      yield {
        type: 'success',
        data: result
      };

    } catch (error: any) {
      if (error.name === 'AbortError') {
        yield {
          type: 'error',
          data: {
            error: '请求被取消'
          }
        };
      } else {
        yield {
          type: 'error',
          data: {
            error: `网页抓取失败: ${error.message}`
          }
        };
      }
    }
  }
}; 