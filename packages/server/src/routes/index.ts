import type { Context, Next } from 'koa'

// Shared route modules
import { healthRoutes } from './health'
import { webhookRoutes } from './webhook'
import { uploadRoutes } from './upload'
import { updateRoutes } from './update'
import { authPublicRoutes, authProtectedRoutes } from './auth'

// Hermes route modules
import { sessionRoutes } from './magic/sessions'
import { profileRoutes } from './magic/profiles'
import { skillRoutes } from './magic/skills'
import { pluginRoutes } from './magic/plugins'
import { memoryRoutes } from './magic/memory'
import { modelRoutes } from './magic/models'
import { providerRoutes } from './magic/providers'
import { configRoutes } from './magic/config'
import { logRoutes } from './magic/logs'
import { codexAuthRoutes } from './magic/codex-auth'
import { nousAuthRoutes } from './magic/nous-auth'
import { copilotAuthRoutes } from './magic/copilot-auth'
import { gatewayRoutes } from './magic/gateways'
import { weixinRoutes } from './magic/weixin'
import { fileRoutes } from './magic/files'
import { downloadRoutes } from './magic/download'
import { jobRoutes } from './magic/jobs'
import { cronHistoryRoutes } from './magic/cron-history'
import { kanbanRoutes } from './magic/kanban'
import { ttsRoutes } from './magic/tts'
import { proxyRoutes, proxyMiddleware } from './magic/proxy'
import { groupChatRoutes, setGroupChatServer } from './magic/group-chat'

// Magic route modules (go-magic backend adapter)
import { sessionRoutes as magicSessionRoutes } from './magic/sessions'
import { chatRoutes as magicChatRoutes } from './magic/chat'
import { configRoutes as magicConfigRoutes } from './magic/config'
import { skillRoutes as magicSkillRoutes } from './magic/skills'
import { logRoutes as magicLogRoutes } from './magic/logs'

/**
 * Register all routes on the Koa app.
 * Public routes are registered first, then auth middleware,
 * then all protected routes. Returns the proxy middleware (must be mounted last).
 */
export function registerRoutes(app: any, requireAuth: (ctx: Context, next: Next) => Promise<void>) {
  // --- Public routes (no auth required) ---
  app.use(healthRoutes.routes())
  app.use(webhookRoutes.routes())
  app.use(authPublicRoutes.routes())
  app.use(ttsRoutes.routes())              // TTS proxy/generation — must be before auth

  // --- Auth middleware: all routes below require authentication ---
  app.use(requireAuth)

  // --- Protected routes (auth required) ---
  app.use(authProtectedRoutes.routes())
  app.use(uploadRoutes.routes())
  app.use(updateRoutes.routes())           // Must be before proxy (proxy catch-all matches everything)
  app.use(sessionRoutes.routes())
  app.use(profileRoutes.routes())
  app.use(skillRoutes.routes())
  app.use(pluginRoutes.routes())
  app.use(memoryRoutes.routes())
  app.use(modelRoutes.routes())
  app.use(providerRoutes.routes())
  app.use(configRoutes.routes())
  app.use(logRoutes.routes())
  app.use(codexAuthRoutes.routes())
  app.use(nousAuthRoutes.routes())
  app.use(copilotAuthRoutes.routes())
  app.use(gatewayRoutes.routes())
  app.use(weixinRoutes.routes())
  app.use(groupChatRoutes.routes())       // Must be before proxy
  app.use(fileRoutes.routes())              // Must be before proxy (proxy catch-all matches everything)
  app.use(downloadRoutes.routes())          // Must be before proxy
  app.use(jobRoutes.routes())               // Must be before proxy
  app.use(cronHistoryRoutes.routes())        // Must be before proxy
  app.use(kanbanRoutes.routes())             // Must be before proxy
  app.use(proxyRoutes.routes())

  // --- Magic (go-magic backend) routes ---
  // These routes proxy requests to the go-magic backend
  app.use(magicSessionRoutes.routes())
  app.use(magicChatRoutes.routes())
  app.use(magicConfigRoutes.routes())
  app.use(magicSkillRoutes.routes())
  app.use(magicLogRoutes.routes())

  // Proxy catch-all middleware (must be last)
  return proxyMiddleware
}
