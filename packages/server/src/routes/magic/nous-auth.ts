import Router from '@koa/router'
import * as ctrl from '../../controllers/magic/nous-auth'

export const nousAuthRoutes = new Router()

nousAuthRoutes.post('/api/magic/auth/nous/start', ctrl.start)
nousAuthRoutes.get('/api/magic/auth/nous/poll/:sessionId', ctrl.poll)
nousAuthRoutes.get('/api/magic/auth/nous/status', ctrl.status)
