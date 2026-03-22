#!/bin/bash

echo "========================================="
echo "  短链接服务 - 一键部署脚本"
echo "========================================="

if ! command -v docker &> /dev/null; then
    echo "错误: Docker 未安装，请先安装 Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "错误: Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

echo ""
echo "正在停止现有容器..."
docker-compose down 2>/dev/null

echo ""
echo "正在构建镜像..."
docker-compose build

echo ""
echo "正在启动服务..."
docker-compose up -d

echo ""
echo "等待服务启动..."
sleep 5

echo ""
echo "检查服务状态..."
docker-compose ps

echo ""
echo "========================================="
echo "  部署完成!"
echo "========================================="
echo ""
echo "访问地址:"
echo "  - 前端页面: http://localhost"
echo "  - 后端API: http://localhost:5000/api"
echo "  - 健康检查: http://localhost:5000/api/health"
echo ""
echo "管理命令:"
echo "  - 查看日志: docker-compose logs -f"
echo "  - 停止服务: docker-compose down"
echo "  - 重启服务: docker-compose restart"
echo ""
