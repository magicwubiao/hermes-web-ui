import Router from '@koa/router'
import * as ctrl from '../../controllers/magic/codex-auth'

export const codexAuthRoutes = new Router()

codexAuthRoutes.post('/api/magic/auth/codex/start', ctrl.start)
codexAuthRoutes.get('/api/magic/auth/codex/poll/:sessionId', ctrl.poll)
codexAuthRoutes.get('/api/magic/auth/codex/status', ctrl.status)
