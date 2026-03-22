# 短链接服务

一个功能完整的短链接服务，包含前端可视化页面、后端REST API、Redis缓存和SQLite持久化存储。

## 功能特性

- ✨ 前端可视化页面，支持短链生成和一键复制
- 🎨 现代化UI设计，交互动画效果
- 📊 基础统计展示，包括访问量和热门链接
- 🔗 后端REST API，支持短链生成、跳转重定向
- 📈 访问统计功能，记录每一次访问信息
- 💾 Redis缓存加速，SQLite持久化存储
- 🐳 Docker一键部署

## 快速开始

### 方式一：Docker部署（推荐）

```bash
# 构建并启动服务
docker-compose up -d --build

# 查看服务状态
docker-compose ps

# 停止服务
docker-compose down
```

服务启动后：
- 前端页面: http://localhost
- 后端API: http://localhost:3000

### 方式二：本地开发

#### 启动后端服务

```bash
cd backend
npm install
npm run dev
```

后端服务运行在 http://localhost:3000

#### 启动前端服务

```bash
cd frontend
npm install
npm run dev
```

前端服务运行在 http://localhost:5173

## API 文档

### 生成短链接

```bash
POST /api/shorten
Content-Type: application/json

{
  "originalUrl": "https://example.com",
  "expiresAt": "2024-12-31T23:59:59.999Z"
}
```

响应：
```json
{
  "code": 200,
  "message": "Short URL created successfully",
  "data": {
    "shortCode": "abc123",
    "shortUrl": "http://localhost:3000/abc123",
    "originalUrl": "https://example.com"
  }
}
```

### 访问短链接

```bash
GET /{shortCode}
```

成功访问会重定向到原始URL

### 获取链接统计

```bash
GET /api/stats/{shortCode}
```

### 获取整体统计

```bash
GET /api/stats
```

## 项目结构

```
.
├── backend/
│   ├── src/
│   │   ├── controllers/    # 控制器层
│   │   ├── routes/         # 路由定义
│   │   ├── services/       # 业务逻辑
│   │   ├── app.ts          # 应用入口
│   │   ├── database.ts     # SQLite数据库
│   │   └── redis.ts        # Redis连接
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/     # React组件
│   │   ├── App.tsx         # 主应用
│   │   └── index.css       # 样式文件
│   ├── package.json
│   ├── vite.config.ts
│   ├── nginx.conf
│   └── Dockerfile
└── docker-compose.yml
```

## 技术栈

### 后端
- Node.js + TypeScript
- Express.js
- Redis (缓存)
- SQLite (持久化)
- better-sqlite3 (SQLite驱动)

### 前端
- React + TypeScript
- Vite
- Tailwind CSS 4.0

### 部署
- Docker
- Docker Compose
- Nginx (前端静态文件服务)
