/**
 * Magic Services
 * 
 * 为 go-magic 后端提供 API 封装。
 */

export { MagicApiClient, getMagicApiClient, resetMagicApiClient } from './magic-api'
export type {
  MagicConfig,
  MagicSession,
  MagicMessage,
  MagicTool,
  MagicToolset,
  MagicSkill,
  MagicConfigResponse,
  MagicHealthResponse,
} from './magic-api'

export { MagicWebSocketClient, getMagicWsClient, resetMagicWsClient } from './magic-websocket'
export type { MagicWsMessage, MagicWsConfig } from './magic-websocket'
