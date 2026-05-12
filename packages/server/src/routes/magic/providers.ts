import Router from '@koa/router'
import * as ctrl from '../../controllers/magic/providers'

export const providerRoutes = new Router()

providerRoutes.post('/api/magic/config/providers', ctrl.create)
providerRoutes.put('/api/magic/config/providers/:poolKey', ctrl.update)
providerRoutes.delete('/api/magic/config/providers/:poolKey', ctrl.remove)
