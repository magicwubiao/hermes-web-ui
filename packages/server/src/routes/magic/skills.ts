import Router from '@koa/router'
import * as ctrl from '../../controllers/magic/skills'

export const skillRoutes = new Router()

skillRoutes.get('/api/magic/skills', ctrl.list)
skillRoutes.put('/api/magic/skills/toggle', ctrl.toggle)
skillRoutes.put('/api/magic/skills/pin', ctrl.pin_)
skillRoutes.get('/api/magic/skills/:category/:skill/files', ctrl.listFiles)
skillRoutes.get('/api/magic/skills/{*path}', ctrl.readFile_)
