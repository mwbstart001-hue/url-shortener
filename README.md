# URL Shortener - 短链生成服务

一个完整的短链生成服务，包含前端可视化页面、后端 REST API、Redis+SQLite 数据层以及 Docker 一键部署。

## 功能特性

### 前端功能
- 简洁美观的可视化界面
- 短链生成与一键复制
- 丰富的交互动效（渐变背景、悬浮动画、滑入效果）
- 实时访问统计展示
- 最近生成的短链列表
- 响应式设计，支持移动端

### 后端功能
- RESTful API 设计
- 短链生成与跳转重定向
- 访问统计（总链接数、总访问量、今日新增、今日访问）
- Redis 缓存加速
- SQLite 持久化存储
- 统一响应格式

### 技术栈
- **后端**: Go + Gin + GORM + go-redis
- **前端**: Vue3 + TypeScript + Vite + Element Plus
- **数据层**: Redis (缓存) + SQLite (持久化)
- **部署**: Docker + Docker Compose

## 快速开始

### 使用 Docker 一键部署

```bash
# 克隆项目
git clone <repository-url>
cd url-shortener

# 启动服务
docker-compose up -d

# 访问前端页面
open http://localhost
```

### 本地开发

#### 后端开发

```bash
cd backend

# 安装依赖
go mod download

# 启动 Redis
docker run -d -p 6379:6379 redis:7-alpine

# 运行服务
go run main.go

# 后端服务将在 http://localhost:8080 启动
```

#### 前端开发

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 前端页面将在 http://localhost:3000 启动
```

## API 文档

### 生成短链
```http
POST /api/shorten
Content-Type: application/json

{
  "url": "https://example.com/very/long/url"
}
```

响应：
```json
{
  "code": 200,
  "message": "Short URL created successfully",
  "data": {
    "short_code": "abc123",
    "original_url": "https://example.com/very/long/url",
    "short_url": "localhost:8080/abc123",
    "visit_count": 0,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### 获取统计信息
```http
GET /api/stats
```

响应：
```json
{
  "code": 200,
  "message": "Stats retrieved successfully",
  "data": {
    "total_urls": 100,
    "total_visits": 5000,
    "today_new_urls": 10,
    "today_total_visits": 500
  }
}
```

### 获取最近生成的短链
```http
GET /api/urls
```

### 短链跳转
```http
GET /{shortCode}
```

## 项目结构

```
url-shortener/
├── backend/                 # 后端代码
│   ├── config/             # 配置管理
│   ├── handlers/           # HTTP 处理器
│   ├── models/             # 数据模型
│   ├── storage/            # 存储层 (Redis + SQLite)
│   ├── utils/              # 工具函数
│   ├── main.go             # 入口文件
│   ├── go.mod              # Go 模块定义
│   ├── Dockerfile          # 后端 Dockerfile
│   └── ...
├── frontend/               # 前端代码
│   ├── src/
│   │   ├── api/            # API 接口
│   │   ├── components/     # Vue 组件
│   │   ├── types/          # TypeScript 类型
│   │   ├── App.vue         # 根组件
│   │   └── main.ts         # 入口文件
│   ├── package.json
│   ├── vite.config.ts
│   ├── Dockerfile          # 前端 Dockerfile
│   └── ...
├── docker-compose.yml      # Docker Compose 配置
└── README.md
```

## 测试

### 后端测试

```bash
cd backend

# 运行所有测试
go test ./...

# 运行特定测试
go test ./handlers -v
go test ./utils -v

# 运行基准测试
go test ./utils -bench=.
```

## 环境变量

### 后端环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| REDIS_ADDR | localhost:6379 | Redis 地址 |
| REDIS_PASSWORD | - | Redis 密码 |
| DB_PATH | ./urls.db | SQLite 数据库路径 |
| SERVER_PORT | 8080 | 服务端口 |

## 性能优化

- **Redis 缓存**: 短链映射缓存 24 小时，减少数据库查询
- **连接池**: SQLite 使用连接池优化并发性能
- **前端优化**: 静态资源缓存、懒加载、动画优化

## 许可证

MIT License
