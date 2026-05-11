/**
 * Magic API Client
 * 
 * 与 go-magic 后端 HTTP API 通信的客户端封装。
 * 
 * go-magic API 端点:
 * - GET  /api/health       - 健康检查
 * - GET  /api/sessions     - 会话列表
 * - POST /api/sessions     - 创建会话
 * - GET  /api/sessions/{id} - 获取会话
 * - POST /api/sessions/{id} - 发送消息
 * - DELETE /api/sessions/{id} - 删除会话
 * - GET  /api/tools        - 工具列表
 * - GET  /api/toolsets     - 工具集
 * - GET  /api/skills       - Skills
 * - GET  /api/config       - 配置
 * - GET  /api/logs         - 日志
 */

const DEFAULT_MAGIC_BASE_URL = process.env.MAGIC_API_URL || 'http://localhost:8080'

export interface MagicConfig {
  baseUrl?: string
  apiKey?: string
}

export interface MagicSession {
  id: string
  name: string
  created_at: string
  updated_at: string
  messages: MagicMessage[]
}

export interface MagicMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

export interface MagicTool {
  name: string
  description: string
}

export interface MagicToolset {
  name: string
  tools: string[]
}

export interface MagicSkill {
  name: string
  category: string
  description: string
}

export interface MagicConfigResponse {
  provider: string
  model: string
  theme: string
  language: string
  streaming: boolean
}

export interface MagicHealthResponse {
  status: string
  version: string
  time: number
}

export class MagicApiClient {
  private baseUrl: string
  private apiKey?: string

  constructor(config: MagicConfig = {}) {
    this.baseUrl = config.baseUrl || DEFAULT_MAGIC_BASE_URL
    this.apiKey = config.apiKey
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${path}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    }
    
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`Magic API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Health check
  async health(): Promise<MagicHealthResponse> {
    return this.request<MagicHealthResponse>('/api/health')
  }

  // Sessions
  async listSessions(): Promise<MagicSession[]> {
    return this.request<MagicSession[]>('/api/sessions')
  }

  async createSession(name?: string): Promise<MagicSession> {
    return this.request<MagicSession>('/api/sessions', {
      method: 'POST',
      body: JSON.stringify({ name: name || 'New Session' }),
    })
  }

  async getSession(id: string): Promise<MagicSession> {
    return this.request<MagicSession>(`/api/sessions/${id}`)
  }

  async sendMessage(sessionId: string, message: string): Promise<MagicSession> {
    return this.request<MagicSession>(`/api/sessions/${sessionId}`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    })
  }

  async deleteSession(id: string): Promise<void> {
    await this.request<void>(`/api/sessions/${id}`, {
      method: 'DELETE',
    })
  }

  // Tools
  async listTools(): Promise<MagicTool[]> {
    return this.request<MagicTool[]>('/api/tools')
  }

  async listToolsets(): Promise<MagicToolset[]> {
    return this.request<MagicToolset[]>('/api/toolsets')
  }

  // Skills
  async listSkills(): Promise<MagicSkill[]> {
    return this.request<MagicSkill[]>('/api/skills')
  }

  // Config
  async getConfig(): Promise<MagicConfigResponse> {
    return this.request<MagicConfigResponse>('/api/config')
  }

  // Logs
  async getLogs(): Promise<any[]> {
    return this.request<any[]>('/api/logs')
  }
}

// Singleton instance
let magicApiClient: MagicApiClient | null = null

export function getMagicApiClient(config?: MagicConfig): MagicApiClient {
  if (!magicApiClient) {
    magicApiClient = new MagicApiClient(config)
  }
  return magicApiClient
}

export function resetMagicApiClient(): void {
  magicApiClient = null
}
