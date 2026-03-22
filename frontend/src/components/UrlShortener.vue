<template>
  <div class="url-shortener">
    <!-- 输入区域 -->
    <div class="input-section">
      <div class="input-wrapper" :class="{ 'focused': isFocused }">
        <el-input
          v-model="url"
          placeholder="请输入长链接，例如: https://example.com/very/long/url"
          size="large"
          clearable
          @focus="isFocused = true"
          @blur="isFocused = false"
          @keyup.enter="handleShorten"
        >
          <template #prefix>
            <el-icon><Link /></el-icon>
          </template>
        </el-input>
        <el-button
          type="primary"
          size="large"
          :loading="loading"
          @click="handleShorten"
          class="shorten-btn"
        >
          <el-icon class="btn-icon"><Scissor /></el-icon>
          生成短链
        </el-button>
      </div>
      <p v-if="error" class="error-message">
        <el-icon><Warning /></el-icon>
        {{ error }}
      </p>
    </div>

    <!-- 结果展示区域 -->
    <transition name="slide-up">
      <div v-if="result" class="result-section">
        <div class="result-card">
          <div class="result-header">
            <el-icon class="success-icon"><CircleCheck /></el-icon>
            <span>短链生成成功！</span>
          </div>
          <div class="result-content">
            <div class="short-url-display">
              <span class="short-url">{{ shortUrl }}</span>
              <el-button
                type="primary"
                size="small"
                @click="copyToClipboard"
                class="copy-btn"
              >
                <el-icon><CopyDocument /></el-icon>
                {{ copied ? '已复制' : '一键复制' }}
              </el-button>
            </div>
            <div class="original-url">
              <span class="label">原始链接：</span>
              <el-tooltip :content="result.original_url" placement="top">
                <span class="url-text">{{ truncateUrl(result.original_url) }}</span>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- 统计卡片 -->
    <div class="stats-section">
      <h3 class="section-title">
        <el-icon><DataAnalysis /></el-icon>
        访问统计
      </h3>
      <div class="stats-grid">
        <div class="stat-card" v-for="(stat, index) in statsList" :key="index">
          <div class="stat-icon" :style="{ background: stat.gradient }">
            <el-icon><component :is="stat.icon" /></el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ formatNumber(stat.value) }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近生成的短链 -->
    <div class="recent-section">
      <h3 class="section-title">
        <el-icon><Clock /></el-icon>
        最近生成
      </h3>
      <div class="recent-list">
        <div 
          v-for="(item, index) in recentUrls" 
          :key="index"
          class="recent-item"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="recent-url-info">
            <span class="recent-short-code">{{ item.short_code }}</span>
            <el-tooltip :content="item.original_url" placement="top">
              <span class="recent-original">{{ truncateUrl(item.original_url, 40) }}</span>
            </el-tooltip>
          </div>
          <div class="recent-stats">
            <span class="visit-count">
              <el-icon><View /></el-icon>
              {{ item.visit_count }}
            </span>
            <el-button 
              type="primary" 
              link 
              size="small"
              @click="copyUrl(item.short_url)"
            >
              <el-icon><CopyDocument /></el-icon>
            </el-button>
          </div>
        </div>
        <el-empty v-if="recentUrls.length === 0" description="暂无数据" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { StatsResponse, URLResponse, APIResponse } from '../types'
import { shortenUrl, getStats, getRecentUrls } from '../api'

const url = ref('')
const loading = ref(false)
const isFocused = ref(false)
const error = ref('')
const result = ref<URLResponse | null>(null)
const copied = ref(false)
const stats = ref<StatsResponse>({
  total_urls: 0,
  total_visits: 0,
  today_new_urls: 0,
  today_total_visits: 0
})
const recentUrls = ref<URLResponse[]>([])

const shortUrl = computed(() => {
  if (!result.value) return ''
  return `${window.location.origin}/${result.value.short_code}`
})

const statsList = computed(() => [
  { 
    label: '总链接数', 
    value: stats.value.total_urls, 
    icon: 'Link',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  { 
    label: '总访问量', 
    value: stats.value.total_visits, 
    icon: 'View',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  { 
    label: '今日新增', 
    value: stats.value.today_new_urls, 
    icon: 'TrendCharts',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  { 
    label: '今日访问', 
    value: stats.value.today_total_visits, 
    icon: 'DataLine',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  }
])

const handleShorten = async () => {
  if (!url.value.trim()) {
    error.value = '请输入有效的 URL'
    return
  }

  try {
    loading.value = true
    error.value = ''
    
    const response = await shortenUrl(url.value)
    result.value = response.data
    
    ElMessage.success('短链生成成功！')
    
    // 刷新统计数据和最近列表
    await fetchStats()
    await fetchRecentUrls()
    
    // 清空输入
    url.value = ''
  } catch (err: any) {
    error.value = err.message || '生成短链失败，请重试'
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(shortUrl.value)
    copied.value = true
    ElMessage.success('链接已复制到剪贴板')
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    ElMessage.error('复制失败，请手动复制')
  }
}

const copyUrl = async (url: string) => {
  try {
    await navigator.clipboard.writeText(url)
    ElMessage.success('链接已复制')
  } catch {
    ElMessage.error('复制失败')
  }
}

const truncateUrl = (url: string, maxLength: number = 50) => {
  if (url.length <= maxLength) return url
  return url.substring(0, maxLength) + '...'
}

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const fetchStats = async () => {
  try {
    const response = await getStats()
    stats.value = response.data
  } catch (err) {
    console.error('Failed to fetch stats:', err)
  }
}

const fetchRecentUrls = async () => {
  try {
    const response = await getRecentUrls()
    recentUrls.value = response.data
  } catch (err) {
    console.error('Failed to fetch recent URLs:', err)
  }
}

onMounted(() => {
  fetchStats()
  fetchRecentUrls()
  
  // 定时刷新统计数据
  setInterval(fetchStats, 30000)
})
</script>

<style scoped>
.url-shortener {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

/* 输入区域 */
.input-section {
  margin-bottom: 30px;
}

.input-wrapper {
  display: flex;
  gap: 12px;
  background: rgba(255, 255, 255, 0.95);
  padding: 8px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.input-wrapper.focused {
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  transform: translateY(-2px);
}

.input-wrapper :deep(.el-input__wrapper) {
  box-shadow: none !important;
  background: transparent;
}

.input-wrapper :deep(.el-input__inner) {
  font-size: 16px;
  height: 48px;
}

.shorten-btn {
  height: 48px;
  padding: 0 24px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s ease;
}

.shorten-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn-icon {
  margin-right: 6px;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #f56c6c;
  font-size: 14px;
  margin: 12px 0 0 16px;
}

/* 结果区域 */
.result-section {
  margin-bottom: 30px;
}

.result-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.result-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: #67c23a;
  font-weight: 600;
  font-size: 16px;
}

.success-icon {
  font-size: 24px;
}

.result-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.short-url-display {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.short-url {
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
  font-family: 'Monaco', 'Consolas', monospace;
  word-break: break-all;
}

.copy-btn {
  border-radius: 8px;
}

.original-url {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #606266;
}

.original-url .label {
  color: #909399;
}

.original-url .url-text {
  color: #606266;
  word-break: break-all;
}

/* 统计区域 */
.stats-section {
  margin-bottom: 30px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 4px;
}

/* 最近生成区域 */
.recent-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.recent-section .section-title {
  color: #303133;
  margin-bottom: 16px;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recent-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f5f7fa;
  border-radius: 12px;
  transition: all 0.3s ease;
  animation: slideIn 0.5s ease forwards;
  opacity: 0;
  transform: translateX(-20px);
}

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.recent-item:hover {
  background: #ebeef5;
  transform: translateX(4px);
}

.recent-url-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.recent-short-code {
  font-size: 16px;
  font-weight: 600;
  color: #667eea;
  font-family: 'Monaco', 'Consolas', monospace;
}

.recent-original {
  font-size: 13px;
  color: #909399;
  word-break: break-all;
}

.recent-stats {
  display: flex;
  align-items: center;
  gap: 12px;
}

.visit-count {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #606266;
}

/* 动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 响应式 */
@media (max-width: 600px) {
  .input-wrapper {
    flex-direction: column;
  }
  
  .shorten-btn {
    width: 100%;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stat-card {
    padding: 16px;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
  
  .stat-value {
    font-size: 20px;
  }
}
</style>
