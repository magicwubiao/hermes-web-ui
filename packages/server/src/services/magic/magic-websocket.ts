/**
 * Magic WebSocket Client
 * 
 * 与 go-magic WebSocket /ws 端点通信，处理流式聊天。
 */

import WebSocket from 'ws'

export interface MagicWsMessage {
  type: string
  data?: any
}

export interface MagicWsConfig {
  baseUrl?: string
  apiKey?: string
  onMessage?: (msg: MagicWsMessage) => void
  onOpen?: () => void
  onClose?: () => void
  onError?: (error: Error) => void
}

export class MagicWebSocketClient {
  private ws: WebSocket | null = null
  private baseUrl: string
  private apiKey?: string
  private reconnectAttempts = 0
  private maxReconnectAttempts = 3
  private reconnectDelay = 1000
  private messageQueue: MagicWsMessage[] = []
  private isConnected = false

  public onMessage?: (msg: MagicWsMessage) => void
  public onOpen?: () => void
  public onClose?: () => void
  public onError?: (error: Error) => void

  constructor(config: MagicWsConfig = {}) {
    // Convert http:// to ws:// or https:// to wss://
    const httpUrl = config.baseUrl || process.env.MAGIC_API_URL || 'http://localhost:8080'
    this.baseUrl = httpUrl.replace(/^http/, 'ws')
    this.apiKey = config.apiKey
    this.onMessage = config.onMessage
    this.onOpen = config.onOpen
    this.onClose = config.onClose
    this.onError = config.onError
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = new URL('/ws', this.baseUrl)
      if (this.apiKey) {
        url.searchParams.set('api_key', this.apiKey)
      }

      this.ws = new WebSocket(url.toString())

      this.ws.on('open', () => {
        this.isConnected = true
        this.reconnectAttempts = 0
        this.flushMessageQueue()
        this.onOpen?.()
        resolve()
      })

      this.ws.on('message', (data: WebSocket.Data) => {
        try {
          const msg = JSON.parse(data.toString()) as MagicWsMessage
          this.onMessage?.(msg)
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e)
        }
      })

      this.ws.on('close', () => {
        this.isConnected = false
        this.onClose?.()
        this.attemptReconnect()
      })

      this.ws.on('error', (error) => {
        this.onError?.(error)
        reject(error)
      })
    })
  }

  send(message: MagicWsMessage): void {
    if (this.isConnected && this.ws) {
      this.ws.send(JSON.stringify(message))
    } else {
      this.messageQueue.push(message)
    }
  }

  sendChatMessage(content: string, sessionId?: string): void {
    this.send({
      type: 'chat',
      data: {
        content,
        session_id: sessionId,
      },
    })
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.isConnected) {
      const msg = this.messageQueue.shift()
      if (msg) {
        this.send(msg)
      }
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)

    setTimeout(() => {
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`)
      this.connect().catch(() => {
        // Error handled in connect()
      })
    }, delay)
  }

  close(): void {
    this.maxReconnectAttempts = 0 // Prevent reconnection
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.isConnected = false
    this.messageQueue = []
  }

  isReady(): boolean {
    return this.isConnected
  }
}

// Singleton instance
let magicWsClient: MagicWebSocketClient | null = null

export function getMagicWsClient(config?: MagicWsConfig): MagicWebSocketClient {
  if (!magicWsClient) {
    magicWsClient = new MagicWebSocketClient(config)
  }
  return magicWsClient
}

export function resetMagicWsClient(): void {
  if (magicWsClient) {
    magicWsClient.close()
    magicWsClient = null
  }
}
