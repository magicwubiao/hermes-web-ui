import Router from '@koa/router'
import * as ctrl from '../../controllers/magic/copilot-auth'

export const copilotAuthRoutes = new Router()

copilotAuthRoutes.post('/api/magic/auth/copilot/start', ctrl.start)
copilotAuthRoutes.get('/api/magic/auth/copilot/poll/:sessionId', ctrl.poll)
copilotAuthRoutes.get('/api/magic/auth/copilot/check-token', ctrl.checkToken)
copilotAuthRoutes.post('/api/magic/auth/copilot/enable', ctrl.enable)
copilotAuthRoutes.post('/api/magic/auth/copilot/disable', ctrl.disable)
