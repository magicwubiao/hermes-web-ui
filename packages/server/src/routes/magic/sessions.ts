import Router from '@koa/router'
import * as ctrl from '../../controllers/magic/sessions'

export const sessionRoutes = new Router()

sessionRoutes.get('/api/magic/sessions/conversations', ctrl.listConversations)
sessionRoutes.get('/api/magic/sessions/conversations/:id/messages', ctrl.getConversationMessages)
sessionRoutes.get('/api/magic/sessions/conversations/:id/messages/paginated', ctrl.getConversationMessagesPaginated)
sessionRoutes.get('/api/magic/sessions', ctrl.list)
sessionRoutes.get('/api/magic/sessions/hermes', ctrl.listHermesSessions)
sessionRoutes.get('/api/magic/sessions/hermes/:id', ctrl.getHermesSession)
sessionRoutes.get('/api/magic/search/sessions', ctrl.search)
sessionRoutes.get('/api/magic/sessions/search', ctrl.search)
sessionRoutes.get('/api/magic/sessions/usage', ctrl.usageBatch)
sessionRoutes.get('/api/magic/usage/stats', ctrl.usageStats)
sessionRoutes.get('/api/magic/sessions/context-length', ctrl.contextLength)
sessionRoutes.get('/api/magic/sessions/:id', ctrl.get)
sessionRoutes.get('/api/magic/sessions/:id/export', ctrl.exportSession)
sessionRoutes.get('/api/magic/sessions/:id/usage', ctrl.usageSingle)
sessionRoutes.delete('/api/magic/sessions/:id', ctrl.remove)
sessionRoutes.post('/api/magic/sessions/batch-delete', ctrl.batchRemove)
sessionRoutes.post('/api/magic/sessions/:id/rename', ctrl.rename)
sessionRoutes.post('/api/magic/sessions/:id/workspace', ctrl.setWorkspace)
sessionRoutes.get('/api/magic/workspace/folders', ctrl.listWorkspaceFolders)
