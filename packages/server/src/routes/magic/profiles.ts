import Router from '@koa/router'
import * as ctrl from '../../controllers/magic/profiles'

export const profileRoutes = new Router()

profileRoutes.get('/api/magic/profiles', ctrl.list)
profileRoutes.post('/api/magic/profiles', ctrl.create)
profileRoutes.get('/api/magic/profiles/:name', ctrl.get)
profileRoutes.delete('/api/magic/profiles/:name', ctrl.remove)
profileRoutes.post('/api/magic/profiles/:name/rename', ctrl.rename)
profileRoutes.put('/api/magic/profiles/active', ctrl.switchProfile)
profileRoutes.post('/api/magic/profiles/:name/export', ctrl.exportProfile)
profileRoutes.post('/api/magic/profiles/import', ctrl.importProfile)
