import { beforeEach, describe, expect, it, vi } from 'vitest'

const handlers = {
  listBoards: vi.fn(async (ctx: any) => { ctx.body = { boards: [] } }),
  createBoard: vi.fn(async (ctx: any) => { ctx.body = { board: {} } }),
  archiveBoard: vi.fn(async (ctx: any) => { ctx.body = { ok: true } }),
  capabilities: vi.fn(async (ctx: any) => { ctx.body = { capabilities: {} } }),
  stats: vi.fn(async (ctx: any) => { ctx.body = { stats: {} } }),
  assignees: vi.fn(async (ctx: any) => { ctx.body = { assignees: [] } }),
  readArtifact: vi.fn(async (ctx: any) => { ctx.body = { content: 'x' } }),
  searchSessions: vi.fn(async (ctx: any) => { ctx.body = { results: [] } }),
  list: vi.fn(async (ctx: any) => { ctx.body = { tasks: [] } }),
  get: vi.fn(async (ctx: any) => { ctx.body = { task: {} } }),
  create: vi.fn(async (ctx: any) => { ctx.body = { task: {} } }),
  complete: vi.fn(async (ctx: any) => { ctx.body = { ok: true } }),
  unblock: vi.fn(async (ctx: any) => { ctx.body = { ok: true } }),
  block: vi.fn(async (ctx: any) => { ctx.body = { ok: true } }),
  assign: vi.fn(async (ctx: any) => { ctx.body = { ok: true } }),
}

vi.mock('../../packages/server/src/controllers/magic/kanban', () => handlers)

describe('kanban routes', () => {
  beforeEach(() => {
    vi.resetModules()
    Object.values(handlers).forEach(fn => fn.mockClear())
  })

  it('registers all kanban routes', async () => {
    const { kanbanRoutes } = await import('../../packages/server/src/routes/magic/kanban')
    const paths = kanbanRoutes.stack.map((entry: any) => entry.path)

    expect(paths).toEqual(expect.arrayContaining([
      '/api/magic/kanban/boards',
      '/api/magic/kanban/boards/:slug',
      '/api/magic/kanban/capabilities',
      '/api/magic/kanban/stats',
      '/api/magic/kanban/assignees',
      '/api/magic/kanban/artifact',
      '/api/magic/kanban/search-sessions',
      '/api/magic/kanban',
      '/api/magic/kanban/:id',
      '/api/magic/kanban/complete',
      '/api/magic/kanban/unblock',
      '/api/magic/kanban/:id/block',
      '/api/magic/kanban/:id/assign',
    ]))
  })

  it('delegates search-sessions to the controller', async () => {
    const { kanbanRoutes } = await import('../../packages/server/src/routes/magic/kanban')
    const layer = kanbanRoutes.stack.find((entry: any) => entry.path === '/api/magic/kanban/search-sessions')
    const ctx: any = { query: { task_id: 'task-1', profile: 'alice' }, body: null, params: {} }

    await layer.stack[0](ctx)

    expect(handlers.searchSessions).toHaveBeenCalledWith(ctx)
    expect(ctx.body).toEqual({ results: [] })
  })
})
