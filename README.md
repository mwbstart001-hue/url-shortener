# URL Shortener Service
## 项目概述
一个功能完整的短链接生成服务，基于 **Go + Cobra** 技术栈开发，包含前端可视化交互页面、标准化 REST API、Redis+SQLite 数据存储，支持 Docker 容器化一键部署。

## 技术栈
### 前端
- 框架：React 18 + Vite
- 样式：Tailwind CSS + Shadcn/ui
- 动效：Framer Motion
- 请求：Axios

### 后端
- 核心：Go + Cobra
- Web 框架：Gin
- 持久化：SQLite + GORM
- 缓存：Redis 7
- 依赖：Go Mod

### 部署
- Docker + Docker Compose

## 功能特性
1. 基于 Go + Cobra 技术栈，提供前端可视化页面，具备短链生成、一键复制、交互动效与基础统计展示
2. 提供标准化 REST API，实现短链生成、跳转重定向、访问统计与统一响应格式
3. 采用 Redis+SQLite 数据层，实现缓存加速与数据持久化存储
4. 支持 Docker 一键部署，完成服务容器化打包与快速启动

## 快速开始
### 环境要求
- Docker 20.10+
- Docker Compose 1.29+

### 一键部署
```bash
docker compose up -d --build
```

### 服务访问
- 前端页面：http://localhost
- 后端 API：http://localhost:8080
- Redis：localhost:6379

## API 接口
### 统一响应格式
```json
{
  "code": 200,
  "msg": "success",
  "data": {}
}
```

### 核心接口
- POST /api/shorten：生成短链接
- GET /{shortCode}：重定向跳转
- GET /api/stats/{shortCode}：访问统计
- GET /health：健康检查

## 项目结构
```
url-shortener/
├── frontend/      # 前端可视化页面
├── cmd/           # Cobra 命令行
├── internal/      # 后端核心逻辑
├── go.mod
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Cobra 核心命令
```bash
shortener serve    # 启动服务
shortener stats    # 查询统计
shortener migrate  # 初始化数据库
```

## 部署管理
```bash
# 停止服务
docker compose down

# 查看日志
docker compose logs -f

# 重启服务
docker compose restart
```

## 许可证
MIT License

MIT License

## 贡献

欢迎提交Issue和Pull Request！

## 联系方式

如有问题，请通过GitHub Issues联系我们。
