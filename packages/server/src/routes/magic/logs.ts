import Router from '@koa/router'
import * as ctrl from '../../controllers/magic/logs'

export const logRoutes = new Router()

logRoutes.get('/api/magic/logs', ctrl.list)
logRoutes.get('/api/magic/logs/:name', ctrl.read)
