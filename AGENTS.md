# Hermes Web UI - Agent 项目文档

## 项目概述

Hermes Web UI 是 Hermes Agent 的全功能 Web Dashboard，提供 AI 聊天会话管理、平台渠道集成（8 个平台）、使用分析、定时任务、模型管理、配置文件管理和集成终端。

## 技术栈

- **前端**：Vue 3 (Composition API) + Naive UI + Pinia + vue-router (hash history) + vue-i18n + SCSS + Vite
- **后端**：Koa 2 + @koa/router v15+ + node-pty (WebSocket terminal)
- **语言**：TypeScript (strict mode)
- **运行时**：Node.js >= 23.0.0
- **包管理器**：pnpm（强制，禁止 npm/yarn）

## 目录结构

```
hermes-web-ui/
├── bin/                          # CLI 入口点
├── dist/                         # 构建产物
│   ├── client/                   # Vite 前端构建
│   └── server/                   # esbuild server 打包
├── packages/
│   ├── client/src/               # Vue 3 前端
│   │   ├── api/                  # API 层
│   │   ├── components/           # Vue 组件
│   │   ├── composables/          # Vue composables
│   │   ├── stores/              # Pinia stores
│   │   └── views/               # 页面级组件
│   └── server/src/              # Koa BFF 服务端
│       ├── controllers/          # 请求处理
│       ├── routes/              # 路由模块
│       └── services/            # 业务逻辑
├── scripts/
│   ├── build-server.mjs         # esbuild 打包 server
│   ├── coze-preview-build.sh    # 预览构建脚本
│   ├── coze-preview-run.sh      # 预览运行脚本
│   └── coze-deploy-run.sh       # 部署运行脚本
└── package.json
```

## 关键入口 / 核心模块

| 入口 | 路径 | 说明 |
|------|------|------|
| 前端入口 | `packages/client/src/main.ts` | Vue 应用入口 |
| 前端 Vite 配置 | `vite.config.ts` | 客户端 Vite 配置 |
| 后端入口 | `packages/server/src/index.ts` | Koa 服务器入口 |
| 端口配置 | `packages/server/src/config.ts` | `process.env.PORT \|\| '8648'` |
| CLI 入口 | `bin/hermes-web-ui.mjs` | 全局 CLI 命令 |

## 运行与预览

### 开发模式
```bash
pnpm install
pnpm run dev           # 同时启动 client + server
pnpm run dev:client    # 仅前端 Vite dev server
pnpm run dev:server    # 仅后端 nodemon
```

### 构建
```bash
pnpm run build         # 完整构建：TS 检查 + Vite build + esbuild server
```

### 预览（本地测试构建产物）
```bash
pnpm run preview       # vite preview（默认 4173）
```

### Coze 平台预览
- **preview_enable**: enabled
- **dev.build**: `bash scripts/coze-preview-build.sh`
- **dev.run**: `bash scripts/coze-preview-run.sh`（启动 vite preview，端口 5000）

### Coze 平台部署
- **deploy.build**: `pnpm run build`
- **deploy.run**: `bash scripts/coze-deploy-run.sh`（启动 Koa server，端口 5000）
- **runtime**: nodejs-24

## 用户偏好与长期约束

1. **包管理器强制**：Node.js 项目必须使用 `pnpm`，禁止 `npm` 或 `yarn`
2. **端口固定**：部署端口固定为 5000，server 通过 `process.env.PORT` 读取
3. **Hermes Agent 依赖**：dev 模式依赖 `hermes` CLI 在 `$PATH` 中
4. **运行时版本**：Node.js >= 23.0.0，建议使用 24

## 常见问题和预防

1. **端口冲突**：preview/run 脚本会先清理 5000 端口残留进程
2. **构建失败**：确保 TypeScript 类型检查通过后再构建
3. **后端启动失败**：检查 Hermes CLI 是否可用，以及 8648 端口是否被占用

## go-magic 后端适配

Hermes Web UI 支持通过 BFF 适配层连接 go-magic 后端。适配层位于：

### 后端适配

| 目录 | 说明 |
|------|------|
| `packages/server/src/services/magic/` | go-magic HTTP API 和 WebSocket 客户端 |
| `packages/server/src/routes/magic/` | Koa 路由，将请求代理到 go-magic |

### 前端适配

| 目录 | 说明 |
|------|------|
| `packages/client/src/api/magic/` | 前端 API 模块 |

### go-magic API 端点映射

| 路由 | 说明 | go-magic 后端 |
|------|------|---------------|
| `GET /api/magic/sessions` | 会话列表 | `/api/sessions` |
| `POST /api/magic/sessions` | 创建会话 | `/api/sessions` |
| `GET /api/magic/sessions/:id` | 获取会话 | `/api/sessions/:id` |
| `POST /api/magic/sessions/:id` | 发送消息 | `/api/sessions/:id` |
| `DELETE /api/magic/sessions/:id` | 删除会话 | `/api/sessions/:id` |
| `GET /api/magic/chat/health` | 健康检查 | `/api/health` |
| `GET /api/magic/chat/tools` | 工具列表 | `/api/tools` |
| `GET /api/magic/chat/toolsets` | 工具集 | `/api/toolsets` |
| `GET /api/magic/config` | 配置 | `/api/config` |
| `GET /api/magic/skills` | Skills | `/api/skills` |
| `GET /api/magic/logs` | 日志 | `/api/logs` |

### 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `MAGIC_API_URL` | `http://localhost:5000` | go-magic 后端 API 地址 |

### 使用方式

1. 确保 go-magic 后端正在运行
2. 设置 `MAGIC_API_URL` 环境变量（如果使用非默认地址）
3. 前端通过 `/api/magic/*` 调用，BFF 会自动代理到 go-magic
