import Router from '@koa/router'
import * as ctrl from '../../controllers/magic/kanban'

export const kanbanRoutes = new Router()

kanbanRoutes.get('/api/magic/kanban/boards', ctrl.listBoards)
kanbanRoutes.post('/api/magic/kanban/boards', ctrl.createBoard)
kanbanRoutes.delete('/api/magic/kanban/boards/:slug', ctrl.archiveBoard)
kanbanRoutes.get('/api/magic/kanban/capabilities', ctrl.capabilities)
kanbanRoutes.get('/api/magic/kanban/stats', ctrl.stats)
kanbanRoutes.get('/api/magic/kanban/assignees', ctrl.assignees)
kanbanRoutes.get('/api/magic/kanban/artifact', ctrl.readArtifact)
kanbanRoutes.get('/api/magic/kanban/search-sessions', ctrl.searchSessions)
kanbanRoutes.get('/api/magic/kanban', ctrl.list)
kanbanRoutes.get('/api/magic/kanban/:id', ctrl.get)
kanbanRoutes.post('/api/magic/kanban', ctrl.create)
kanbanRoutes.post('/api/magic/kanban/complete', ctrl.complete)
kanbanRoutes.post('/api/magic/kanban/unblock', ctrl.unblock)
kanbanRoutes.post('/api/magic/kanban/:id/block', ctrl.block)
kanbanRoutes.post('/api/magic/kanban/:id/assign', ctrl.assign)
