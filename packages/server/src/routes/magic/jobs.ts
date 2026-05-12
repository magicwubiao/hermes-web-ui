import Router from '@koa/router'
import * as ctrl from '../../controllers/magic/jobs'

export const jobRoutes = new Router()

jobRoutes.get('/api/magic/jobs', ctrl.list)
jobRoutes.get('/api/magic/jobs/:id', ctrl.get)
jobRoutes.post('/api/magic/jobs', ctrl.create)
jobRoutes.patch('/api/magic/jobs/:id', ctrl.update)
jobRoutes.delete('/api/magic/jobs/:id', ctrl.remove)
jobRoutes.post('/api/magic/jobs/:id/pause', ctrl.pause)
jobRoutes.post('/api/magic/jobs/:id/resume', ctrl.resume)
jobRoutes.post('/api/magic/jobs/:id/run', ctrl.run)
