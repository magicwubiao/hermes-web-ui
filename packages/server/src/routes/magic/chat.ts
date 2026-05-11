/**
 * Magic Chat Routes
 * 
 * 聊天 API 路由，通过 WebSocket 与 go-magic 通信。
 */

import Router from '@koa/router'
import type { Context } from 'koa'
import { getMagicApiClient } from '../../services/magic'

const chatRoutes = new Router({ prefix: '/api/magic/chat' })

// GET /api/magic/chat/health - Check magic backend health
chatRoutes.get('/health', async (ctx: Context) => {
  try {
    const client = getMagicApiClient()
    const health = await client.health()
    ctx.body = health
  } catch (error: any) {
    ctx.status = 503
    ctx.body = { 
      status: 'unhealthy', 
      error: error.message || 'Cannot connect to go-magic backend'
    }
  }
})

// GET /api/magic/chat/tools - List available tools
chatRoutes.get('/tools', async (ctx: Context) => {
  try {
    const client = getMagicApiClient()
    const tools = await client.listTools()
    ctx.body = { tools }
  } catch (error: any) {
    ctx.status = error.status || 500
    ctx.body = { error: error.message || 'Failed to fetch tools' }
  }
})

// GET /api/magic/chat/toolsets - List available toolsets
chatRoutes.get('/toolsets', async (ctx: Context) => {
  try {
    const client = getMagicApiClient()
    const toolsets = await client.listToolsets()
    ctx.body = { toolsets }
  } catch (error: any) {
    ctx.status = error.status || 500
    ctx.body = { error: error.message || 'Failed to fetch toolsets' }
  }
})

export { chatRoutes }
