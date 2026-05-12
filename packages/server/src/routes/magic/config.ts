import Router from '@koa/router'
import * as ctrl from '../../controllers/magic/config'

export const configRoutes = new Router()

configRoutes.get('/api/magic/config', ctrl.getConfig)
configRoutes.put('/api/magic/config', ctrl.updateConfig)
configRoutes.put('/api/magic/config/credentials', ctrl.updateCredentials)
