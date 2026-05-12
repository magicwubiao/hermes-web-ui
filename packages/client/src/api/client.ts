/**
 * Hermes Web UI API Client
 * Modified to support direct connection to go-magic backend
 */
import router from '@/router'

// Direct mode: connect directly to go-magic backend
const DIRECT_MODE = true
const GO_MAGIC_BASE_URL = import.meta.env.VITE_MAGIC_API_URL || 'http://localhost:5000'

// Legacy mode: connect through local BFF (Hermes CLI)
const DEFAULT_BASE_URL = ''

function getBaseUrl(): string {
  if (DIRECT_MODE) {
    return GO_MAGIC_BASE_URL
  }
  return localStorage.getItem('magic_server_url') || DEFAULT_BASE_URL
}

export function getApiKey(): string {
  return localStorage.getItem('magic_api_key') || ''
}

export function setServerUrl(url: string) {
  localStorage.setItem('magic_server_url', url)
}

export function setApiKey(key: string) {
  localStorage.setItem('magic_api_key', key)
}

export function clearApiKey() {
  localStorage.removeItem('magic_api_key')
}

export function hasApiKey(): boolean {
  return !!getApiKey()
}

/**
 * Get current active profile name.
 * Reads from store first (authoritative source), falls back to localStorage.
 */
function getActiveProfileName(): string | null {
  try {
    // Dynamic import to avoid circular dependency
    const { useProfilesStore } = require('@/stores/magic/profiles')
    const store = useProfilesStore()
    // Store is the source of truth - it's updated from /api/magic/profiles
    return store.activeProfileName
  } catch {
    // Fallback to localStorage if store is not available (e.g., during initialization)
    return localStorage.getItem('magic_active_profile_name')
  }
}

/**
 * Transform path for go-magic compatibility
 * Hermes Web UI uses /api/magic/* but go-magic uses /api/*
 */
function transformPath(path: string): string {
  if (DIRECT_MODE && path.startsWith('/api/magic/')) {
    return path.replace(/^\/api\/magic\//, '/api/')
  }
  return path
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const base = getBaseUrl()
  const transformedPath = transformPath(path)
  const url = `${base}${transformedPath}`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  }

  const apiKey = getApiKey()
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`
  }

  // Inject active profile header for proxied gateway requests
  const profileName = getActiveProfileName()
  if (profileName && profileName !== 'default') {
    headers['X-Magic-Profile'] = profileName
  }

  const res = await fetch(url, { ...options, headers })

  // In direct mode, don't redirect to login on 401 (go-magic may not require auth)
  const isLocalBff = !DIRECT_MODE && !path.startsWith('/api/magic/v1/') &&
    !path.startsWith('/api/magic/jobs') &&
    !path.startsWith('/api/magic/skills')

  if (res.status === 401 && isLocalBff) {
    clearApiKey()
    if (router.currentRoute.value.name !== 'login') {
      router.replace({ name: 'login' })
    }
    throw new Error('Unauthorized')
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`API Error ${res.status}: ${text || res.statusText}`)
  }

  return res.json()
}

export function getBaseUrlValue(): string {
  return getBaseUrl()
}
