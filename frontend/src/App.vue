<template>
  <div class="app-container">
    <div class="background-animation">
      <div class="gradient-sphere sphere-1"></div>
      <div class="gradient-sphere sphere-2"></div>
      <div class="gradient-sphere sphere-3"></div>
    </div>
    
    <div class="content-wrapper">
      <header class="header">
        <div class="logo">
          <el-icon class="logo-icon"><Link /></el-icon>
          <span class="logo-text">短链生成器</span>
        </div>
        <p class="subtitle">快速、简洁、高效的 URL 缩短服务</p>
      </header>

      <main class="main-content">
        <UrlShortener />
      </main>

      <footer class="footer">
        <p>© 2024 URL Shortener - 基于 Redis + SQLite 构建</p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import UrlShortener from './components/UrlShortener.vue'
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.background-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.gradient-sphere {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: float 20s infinite ease-in-out;
}

.sphere-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%);
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.sphere-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%);
  bottom: -50px;
  right: -50px;
  animation-delay: -7s;
}

.sphere-3 {
  width: 250px;
  height: 250px;
  background: linear-gradient(45deg, #43e97b 0%, #38f9d7 100%);
  top: 50%;
  left: 50%;
  animation-delay: -14s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(50px, -50px) scale(1.1);
  }
  50% {
    transform: translate(0, 50px) scale(0.9);
  }
  75% {
    transform: translate(-50px, -25px) scale(1.05);
  }
}

.content-wrapper {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 40px 20px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 12px;
}

.logo-icon {
  font-size: 40px;
  color: #fff;
}

.logo-text {
  font-size: 36px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.footer {
  text-align: center;
  padding-top: 40px;
}

.footer p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  margin: 0;
}
</style>
