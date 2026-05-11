/**
 * Magic Sessions Routes
 * 
 * 会话管理 API 路由，将请求代理到 go-magic 后端。
 */

import Router from '@koa/router'
import type { Context } from 'koa'
import { getMagicApiClient } from '../../services/magic'

const sessionRoutes = new Router({ prefix: '/api/magic/sessions' })

// GET /api/magic/sessions - List all sessions
sessionRoutes.get('/', async (ctx: Context) => {
  try {
    const client = getMagicApiClient()
    const sessions = await client.listSessions()
    ctx.body = { sessions }
  } catch (error: any) {
    ctx.status = error.status || 500
    ctx.body = { error: error.message || 'Failed to fetch sessions' }
  }
})

// POST /api/magic/sessions - Create a new session
sessionRoutes.post('/', async (ctx: Context) => {
  try {
    const { name } = ctx.request.body as { name?: string }
    const client = getMagicApiClient()
    const session = await client.createSession(name)
    ctx.body = { session }
  } catch (error: any) {
    ctx.status = error.status || 500
    ctx.body = { error: error.message || 'Failed to create session' }
  }
})

// GET /api/magic/sessions/:id - Get a session
sessionRoutes.get('/:id', async (ctx: Context) => {
  try {
    const { id } = ctx.params
    const client = getMagicApiClient()
    const session = await client.getSession(id)
    ctx.body = { session }
  } catch (error: any) {
    ctx.status = error.status || 500
    ctx.body = { error: error.message || 'Failed to fetch session' }
  }
})

// POST /api/magic/sessions/:id - Send a message to a session
sessionRoutes.post('/:id', async (ctx: Context) => {
  try {
    const { id } = ctx.params
    const { message } = ctx.request.body as { message: string }
    
    if (!message) {
      ctx.status = 400
      ctx.body = { error: 'Message is required' }
      return
    }

    const client = getMagicApiClient()
    const session = await client.sendMessage(id, message)
    ctx.body = { session }
  } catch (error: any) {
    ctx.status = error.status || 500
    ctx.body = { error: error.message || 'Failed to send message' }
  }
})

// DELETE /api/magic/sessions/:id - Delete a session
sessionRoutes.delete('/:id', async (ctx: Context) => {
  try {
    const { id } = ctx.params
    const client = getMagicApiClient()
    await client.deleteSession(id)
    ctx.status = 204
  } catch (error: any) {
    ctx.status = error.status || 500
    ctx.body = { error: error.message || 'Failed to delete session' }
  }
})

export { sessionRoutes }
