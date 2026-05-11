/**
 * Magic API Client (Frontend)
 * 
 * 前端调用的 Magic API 模块，封装与后端 /api/magic/* 的通信。
 */

import { request } from '../client'

// ============================
// Types
// ============================

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

export interface MagicConfig {
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

// ============================
// Sessions API
// ============================

export async function fetchSessions(): Promise<MagicSession[]> {
  const res = await request<{ sessions: MagicSession[] }>('/api/magic/sessions')
  return res.sessions
}

export async function createSession(name?: string): Promise<MagicSession> {
  const res = await request<{ session: MagicSession }>('/api/magic/sessions', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
  return res.session
}

export async function fetchSession(id: string): Promise<MagicSession> {
  const res = await request<{ session: MagicSession }>(`/api/magic/sessions/${id}`)
  return res.session
}

export async function sendMessage(sessionId: string, message: string): Promise<MagicSession> {
  const res = await request<{ session: MagicSession }>(`/api/magic/sessions/${sessionId}`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  })
  return res.session
}

export async function deleteSession(id: string): Promise<void> {
  await request<void>(`/api/magic/sessions/${id}`, {
    method: 'DELETE',
  })
}

// ============================
// Chat API
// ============================

export async function checkMagicHealth(): Promise<MagicHealthResponse> {
  return request<MagicHealthResponse>('/api/magic/chat/health')
}

export async function fetchTools(): Promise<MagicTool[]> {
  const res = await request<{ tools: MagicTool[] }>('/api/magic/chat/tools')
  return res.tools
}

export async function fetchToolsets(): Promise<MagicToolset[]> {
  const res = await request<{ toolsets: MagicToolset[] }>('/api/magic/chat/toolsets')
  return res.toolsets
}

// ============================
// Config API
// ============================

export async function fetchMagicConfig(): Promise<MagicConfig> {
  return request<MagicConfig>('/api/magic/config')
}

// ============================
// Skills API
// ============================

export async function fetchSkills(): Promise<MagicSkill[]> {
  const res = await request<{ skills: MagicSkill[] }>('/api/magic/skills')
  return res.skills
}

// ============================
// Logs API
// ============================

export async function fetchLogs(): Promise<any[]> {
  const res = await request<{ logs: any[] }>('/api/magic/logs')
  return res.logs
}
