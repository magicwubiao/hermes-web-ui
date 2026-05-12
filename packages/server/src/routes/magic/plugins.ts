import Router from '@koa/router'
import * as ctrl from '../../controllers/magic/plugins'

export const pluginRoutes = new Router()

pluginRoutes.get('/api/magic/plugins', ctrl.list)
