import { URL } from 'url';

/**
 * 测试网络连接
 */
export async function testNetworkConnection(baseURL: string): Promise<{ 
  success: boolean; 
  error?: string; 
  latency?: number 
}> {
  try {
    const url = new URL(baseURL);
    const startTime = Date.now();
    
    // 使用fetch测试连接
    const response = await fetch(url.origin, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000) // 5秒超时
    });
    
    const latency = Date.now() - startTime;
    
    if (response.ok || response.status === 405) { // 405 Method Not Allowed也表示连接正常
      return { success: true, latency };
    } else {
      return { 
        success: false, 
        error: `HTTP ${response.status}: ${response.statusText}` 
      };
    }
  } catch (error: any) {
    if (error.name === 'TimeoutError') {
      return { 
        success: false, 
        error: '连接超时 (5秒)' 
      };
    }
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return { 
        success: false, 
        error: '网络不可达或DNS解析失败' 
      };
    }
    
    return { 
      success: false, 
      error: error.message || '未知网络错误' 
    };
  }
}

/**
 * 获取网络状态报告
 */
export async function getNetworkStatus(): Promise<string> {
  const baseURL = process.env.OPENAI_BASE_URL;
  
  if (!baseURL) {
    return '❌ 未配置 OPENAI_BASE_URL';
  }
  
  const result = await testNetworkConnection(baseURL);
  
  if (result.success) {
    return `✅ 网络连接正常 (延迟: ${result.latency}ms)`;
  } else {
    return `❌ 网络连接失败: ${result.error}`;
  }
} 