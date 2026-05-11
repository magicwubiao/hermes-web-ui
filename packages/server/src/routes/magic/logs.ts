/**
 * Magic Logs Routes
 * 
 * 日志 API 路由。
 */

import Router from '@koa/router'
import type { Context } from 'koa'
import { getMagicApiClient } from '../../services/magic'

const logRoutes = new Router({ prefix: '/api/magic/logs' })

// GET /api/magic/logs - Get logs
logRoutes.get('/', async (ctx: Context) => {
  try {
    const client = getMagicApiClient()
    const logs = await client.getLogs()
    ctx.body = { logs }
  } catch (error: any) {
    ctx.status = error.status || 500
    ctx.body = { error: error.message || 'Failed to fetch logs' }
  }
})

export { logRoutes }
