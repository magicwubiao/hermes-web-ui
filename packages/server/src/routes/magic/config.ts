/**
 * Magic Config Routes
 * 
 * 配置 API 路由。
 */

import Router from '@koa/router'
import type { Context } from 'koa'
import { getMagicApiClient } from '../../services/magic'

const configRoutes = new Router({ prefix: '/api/magic/config' })

// GET /api/magic/config - Get configuration
configRoutes.get('/', async (ctx: Context) => {
  try {
    const client = getMagicApiClient()
    const config = await client.getConfig()
    ctx.body = config
  } catch (error: any) {
    ctx.status = error.status || 500
    ctx.body = { error: error.message || 'Failed to fetch config' }
  }
})

export { configRoutes }
