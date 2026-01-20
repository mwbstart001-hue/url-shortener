# URL Shortener Service

## 项目概述

一个功能完整的短链接生成服务，包含**前端可视化页面（带交互动效）+ 后端REST API + Redis/SQLite数据层**，支持Docker一键部署。

## 技术栈

### 前端
- **框架**: React 18 + Vite
- **样式**: Tailwind CSS + Shadcn/ui
- **动效**: Framer Motion
- **路由**: React Router
- **HTTP请求**: Axios

### 后端
- **框架**: Java (Spring Boot)
- **持久化**: SQLite
- **缓存**: Redis 7
- **构建工具**: Maven

### 部署
- **容器化**: Docker + Docker Compose
- **CI/CD**: GitHub Actions

## 功能特性

### 前端功能
- ✅ 长链接输入与验证
- ✅ 短链接生成与展示
- ✅ 短链接复制功能
- ✅ 原链接跳转
- ✅ 优雅的交互动效
- ✅ 错误处理与提示
- ✅ 响应式设计

### 后端功能
- ✅ RESTful API接口
- ✅ 短码生成与管理
- ✅ 302重定向
- ✅ Redis缓存优化
- ✅ SQLite持久化存储
- ✅ 点击量统计
- ✅ 健康检查接口

## 快速开始

### 环境要求
- Docker 20.10+
- Docker Compose 1.29+

### 一键部署

在项目根目录执行以下命令：

```bash
docker compose up -d --build
```

这将自动构建并启动所有服务：
- 前端服务：http://localhost
- 后端服务：http://localhost:8080
- Redis服务：localhost:6379

### 服务访问

- **前端页面**: 打开浏览器访问 http://localhost
- **API文档**: 后端提供REST API接口
- **健康检查**: http://localhost:8080/actuator/health

## API接口

### 1. 生成短链接

```
POST /api/shorten
Content-Type: application/json

请求体:
{
  "longUrl": "https://www.example.com"
}

响应:
{
  "longUrl": "https://www.example.com",
  "shortUrl": "http://localhost/s/abc123",
  "shortCode": "abc123",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### 2. 短链接重定向

```
GET /s/{shortCode}

响应:
302 Found
Location: https://www.example.com
```

### 3. 获取短链接信息

```
GET /api/info/{shortCode}

响应:
{
  "longUrl": "https://www.example.com",
  "shortUrl": "http://localhost/s/abc123",
  "shortCode": "abc123",
  "createdAt": "2024-01-01T00:00:00Z",
  "clickCount": 42
}
```

### 4. 健康检查

```
GET /actuator/health

响应:
{
  "status": "UP"
}
```

## 项目结构

```
url-shortener/
├── frontend/             # 前端服务
│   ├── src/             # 前端源码
│   │   ├── components/  # 组件
│   │   ├── pages/       # 页面
│   │   ├── services/    # API服务
│   │   ├── hooks/       # 自定义钩子
│   │   └── App.jsx      # 入口组件
│   ├── Dockerfile       # 前端Dockerfile
│   ├── nginx.conf       # Nginx配置
│   └── vite.config.js   # Vite配置
├── backend/              # 后端服务
│   ├── src/             # 后端源码
│   │   ├── controller/  # 控制器
│   │   ├── service/     # 服务层
│   │   ├── repository/  # 数据访问层
│   │   ├── model/       # 数据模型
│   │   ├── config/      # 配置
│   │   ├── exception/   # 异常处理
│   │   └── util/        # 工具类
│   ├── Dockerfile       # 后端Dockerfile
│   └── pom.xml          # Maven配置
├── docker-compose.yml   # Docker Compose配置
├── .github/workflows/   # CI/CD配置
└── README.md            # 项目说明
```

## 开发说明

### 前端开发

1. 进入前端目录：
   ```bash
   cd frontend
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 启动开发服务器：
   ```bash
   npm run dev
   ```

4. 构建生产版本：
   ```bash
   npm run build
   ```

### 后端开发

1. 进入后端目录：
   ```bash
   cd backend
   ```

2. 安装依赖并构建：
   ```bash
   ./mvnw clean install
   ```

3. 启动开发服务器：
   ```bash
   ./mvnw spring-boot:run
   ```

## 测试

### 手动测试

1. 访问前端页面：http://localhost
2. 输入长链接，点击生成短链接
3. 复制并测试短链接
4. 检查点击量统计

### 自动化测试

项目配置了GitHub Actions自动测试：
- 自动构建Docker镜像
- 启动所有服务
- 测试API接口
- 验证重定向功能

## 部署管理

### 停止服务

```bash
docker compose down
```

### 重启服务

```bash
docker compose restart
```

### 查看日志

```bash
docker compose logs -f
```

### 查看服务状态

```bash
docker compose ps
```

## 环境变量

### 后端环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| SPRING_PROFILES_ACTIVE | Spring配置文件 | docker |
| SPRING_DATASOURCE_URL | SQLite数据库URL | jdbc:sqlite:/app/db/url_shortener.db |
| SPRING_REDIS_HOST | Redis主机 | redis |
| SPRING_REDIS_PORT | Redis端口 | 6379 |
| URLSHORTENER_BASE_URL | 短链接基础URL | http://localhost |

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

## 联系方式

如有问题，请通过GitHub Issues联系我们。