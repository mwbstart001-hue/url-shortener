
# 短链接服务
一个功能完整的短链接服务，基于 **Go + Cobra** 技术栈开发，包含前端可视化页面、标准化 REST API、Redis 缓存加速与 SQLite 持久化存储，支持 Docker 容器化一键部署。

## 功能特性
1. 基于 Go + Cobra 技术栈，提供前端可视化页面，具备短链生成、一键复制、交互动效与基础统计展示
2. 提供标准化 REST API，实现短链生成、跳转重定向、访问统计与统一响应格式
3. 采用 Redis+SQLite 数据层，实现缓存加速与数据持久化存储
4. 支持 Docker 一键部署，完成服务容器化打包与快速启动

## 快速开始
### 方式一：Docker 部署（推荐）
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
- 后端 API: http://localhost:8080

### 方式二：本地开发
#### 启动后端服务
```bash
go mod tidy
go run main.go serve
```
后端服务运行在 http://localhost:8080

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
  "originalUrl": "https://example.com"
}
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "shortCode": "abc123",
    "shortUrl": "http://localhost/abc123",
    "originalUrl": "https://example.com"
  }
}
```

### 访问短链接
```bash
GET /{shortCode}
```
成功访问会 302 重定向到原始 URL

### 获取链接统计
```bash
GET /api/stats/{shortCode}
```

### 服务健康检查
```bash
GET /health
```

## 项目结构
```
.
├── cmd/                    # Go Cobra 命令行入口
│   ├── serve.go            # 启动服务
│   ├── stats.go            # 统计查询
│   └── root.go
├── internal/               # 后端核心逻辑
│   ├── api/                # API 控制器
│   ├── service/            # 业务逻辑
│   ├── dao/                # 数据访问层
│   ├── redis/              # Redis 缓存
│   └── sqlite/             # SQLite 持久化
├── frontend/               # 前端可视化页面
├── go.mod
├── Dockerfile
└── docker-compose.yml
```

## 技术栈
### 后端
- Go + Cobra
- Gin Web 框架
- Redis（缓存加速）
- SQLite（数据持久化）

### 前端
- React + TypeScript
- Vite
- Tailwind CSS
- 交互动效与统计展示

### 部署
- Docker
- Docker Compose
