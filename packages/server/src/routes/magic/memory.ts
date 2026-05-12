import Router from '@koa/router'
import * as ctrl from '../../controllers/magic/memory'

export const memoryRoutes = new Router()

memoryRoutes.get('/api/magic/memory', ctrl.get)
memoryRoutes.post('/api/magic/memory', ctrl.save)
