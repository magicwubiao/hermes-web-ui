/**
 * Magic Skills Routes
 * 
 * Skills API 路由。
 */

import Router from '@koa/router'
import type { Context } from 'koa'
import { getMagicApiClient } from '../../services/magic'

const skillRoutes = new Router({ prefix: '/api/magic/skills' })

// GET /api/magic/skills - List all skills
skillRoutes.get('/', async (ctx: Context) => {
  try {
    const client = getMagicApiClient()
    const skills = await client.listSkills()
    ctx.body = { skills }
  } catch (error: any) {
    ctx.status = error.status || 500
    ctx.body = { error: error.message || 'Failed to fetch skills' }
  }
})

export { skillRoutes }
