#!/usr/bin/env bash
set -euo pipefail

# 基于脚本位置定位项目根目录
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

# 清理 5000 端口残留进程（幂等性：绝不碰 9000）
fuser -k 5000/tcp 2>/dev/null || true
sleep 1

# 构建项目（如果 dist 不存在）
if [ ! -d "dist/client" ]; then
  pnpm run build
fi

# 使用 vite preview 在 5000 端口提供服务
# Vite preview 默认端口是 4173，需要显式指定 5000
exec pnpm exec vite preview --host 0.0.0.0 --port 5000
