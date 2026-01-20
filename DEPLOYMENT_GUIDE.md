# URL 缩短工具部署启动指南

## 一、前置条件

确保已安装以下软件：
- Docker 20.10+（容器化环境）
- Docker Compose 1.29+（多容器管理）

## 二、部署步骤

### 1. 克隆或进入项目目录

```bash
# 如果是克隆的项目，先进入项目目录
cd /Users/lucas/Documents/LearnWorkSpace/URLShortener/url-shortener
```

### 2. 一键部署启动

在项目根目录执行以下命令，自动构建并启动所有服务：

```bash
docker compose up -d --build
```

> **参数说明**：
> - `-d`: 后台运行容器（守护模式）
> - `--build`: 构建或重新构建镜像

### 3. 验证部署状态

等待命令执行完成后，查看服务状态：

```bash
docker compose ps
```

预期输出应显示三个服务都处于运行状态：
- `url-shortener-frontend`: 运行中 (健康)
- `url-shortener-backend`: 运行中 (健康)
- `url-shortener-redis`: 运行中 (健康)

## 三、服务访问

### 1. 前端界面

打开浏览器访问：
```
http://localhost
```

### 2. 后端API

后端服务地址：
```
http://localhost:8080
```

### 3. 健康检查

验证后端服务是否正常：
```bash
curl http://localhost:8080/actuator/health
```

预期响应：`{"status":"UP"}`

## 四、功能测试

### 1. 生成短链接

在前端页面：
- 输入长链接（如：https://www.example.com）
- 点击「缩短链接」按钮
- 查看生成的短链接

或使用API测试：

```bash
curl -X POST -H "Content-Type: application/json" -d '{"longUrl":"https://www.example.com"}' http://localhost:8080/api/shorten
```

### 2. 测试短链接重定向

复制生成的短链接（如：http://localhost/s/abc123），在浏览器中访问，应自动重定向到原长链接。

或使用curl测试：

```bash
curl -L -I http://localhost/s/abc123
```

## 五、管理命令

### 1. 停止服务

```bash
docker compose down
```

### 2. 重启服务

```bash
docker compose restart
```

### 3. 查看服务日志

```bash
# 查看所有服务日志
docker compose logs -f

# 查看特定服务日志
docker compose logs -f backend
```

### 4. 查看容器状态

```bash
docker ps
```

## 六、常见问题排查

### 1. 端口占用问题

如果80、8080或6379端口已被占用，可修改`docker-compose.yml`中的端口映射：

```yaml
# 前端端口映射（可修改左侧主机端口）
ports:
  - "8081:80"

# 后端端口映射（可修改左侧主机端口）
ports:
  - "8082:8080"

# Redis端口映射（可修改左侧主机端口）
ports:
  - "6380:6379"
```

### 2. 构建失败

- 检查网络连接是否正常
- 确保Docker环境可用
- 查看详细构建日志：`docker compose logs --no-color | grep "ERROR"`

### 3. 服务启动缓慢

- 首次启动需要下载依赖和构建镜像，时间较长
- 后续启动会使用缓存，速度更快

## 七、项目结构

```
url-shortener/
├── frontend/              # 前端代码
├── backend/               # 后端代码
├── docker-compose.yml     # Docker Compose配置
├── README.md              # 详细项目说明
└── DEPLOYMENT_GUIDE.md    # 本部署指南
```

## 八、联系方式

如有问题，请参考项目的README.md文件或提交Issue。