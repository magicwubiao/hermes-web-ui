import Router from '@koa/router'
import * as ctrl from '../../controllers/magic/gateways'

export const gatewayRoutes = new Router()

gatewayRoutes.get('/api/magic/gateways', ctrl.list)
gatewayRoutes.post('/api/magic/gateways/:name/start', ctrl.start)
gatewayRoutes.post('/api/magic/gateways/:name/stop', ctrl.stop)
gatewayRoutes.get('/api/magic/gateways/:name/health', ctrl.health)
