import Router from '@koa/router'
import * as ctrl from '../../controllers/magic/models'

export const modelRoutes = new Router()

modelRoutes.get('/api/magic/available-models', ctrl.getAvailable)
modelRoutes.get('/api/magic/config/models', ctrl.getConfigModels)
modelRoutes.put('/api/magic/config/model', ctrl.setConfigModel)

// Model context routes
modelRoutes.get('/api/magic/model-context', ctrl.getModelContext)
modelRoutes.get('/api/magic/model-context/:provider/:model', ctrl.getModelContext)
modelRoutes.put('/api/magic/model-context/:provider/:model', ctrl.updateModelContext)
modelRoutes.put('/api/magic/model-context', ctrl.updateModelContext)
