import { createRouter, createWebHashHistory } from 'vue-router'
import { hasApiKey } from '@/api/client'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/magic/chat',
      name: 'magic.chat',
      component: () => import('@/views/magic/ChatView.vue'),
    },
    {
      path: '/magic/history',
      name: 'magic.history',
      component: () => import('@/views/magic/HistoryView.vue'),
    },
    {
      path: '/magic/jobs',
      name: 'magic.jobs',
      component: () => import('@/views/magic/JobsView.vue'),
    },
    {
      path: '/magic/kanban',
      name: 'magic.kanban',
      component: () => import('@/views/magic/KanbanView.vue'),
    },
    {
      path: '/magic/models',
      name: 'magic.models',
      component: () => import('@/views/magic/ModelsView.vue'),
    },
    {
      path: '/magic/profiles',
      name: 'magic.profiles',
      component: () => import('@/views/magic/ProfilesView.vue'),
    },
    {
      path: '/magic/logs',
      name: 'magic.logs',
      component: () => import('@/views/magic/LogsView.vue'),
    },
    {
      path: '/magic/usage',
      name: 'magic.usage',
      component: () => import('@/views/magic/UsageView.vue'),
    },
    {
      path: '/magic/skills',
      name: 'magic.skills',
      component: () => import('@/views/magic/SkillsView.vue'),
    },
    {
      path: '/magic/plugins',
      name: 'magic.plugins',
      component: () => import('@/views/magic/PluginsView.vue'),
    },
    {
      path: '/magic/memory',
      name: 'magic.memory',
      component: () => import('@/views/magic/MemoryView.vue'),
    },
    {
      path: '/magic/settings',
      name: 'magic.settings',
      component: () => import('@/views/magic/SettingsView.vue'),
    },
    {
      path: '/magic/gateways',
      name: 'magic.gateways',
      component: () => import('@/views/magic/GatewaysView.vue'),
    },
    {
      path: '/magic/channels',
      name: 'magic.channels',
      component: () => import('@/views/magic/ChannelsView.vue'),
    },
    {
      path: '/magic/terminal',
      name: 'magic.terminal',
      component: () => import('@/views/magic/TerminalView.vue'),
    },
    {
      path: '/magic/group-chat',
      name: 'magic.groupChat',
      component: () => import('@/views/magic/GroupChatView.vue'),
    },
    {
      path: '/magic/files',
      name: 'magic.files',
      component: () => import('@/views/magic/FilesView.vue'),
    },
  ],
})

router.beforeEach((to, _from, next) => {
  // Public pages don't need auth
  if (to.meta.public) {
    // Already has key, skip login
    if (to.name === 'login' && hasApiKey()) {
      next({ path: '/magic/chat' })
      return
    }
    next()
    return
  }

  // All other pages require token
  if (!hasApiKey()) {
    next({ name: 'login' })
    return
  }

  next()
})

export default router
