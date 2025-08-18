<template>
  <div id="app">
    <a-layout class="layout">
      <!-- 头部 -->
      <a-layout-header class="header">
        <div class="logo">
          <h2>Dynamic Form 动态表单组件</h2>
        </div>
        <a-menu
          v-model:selectedKeys="selectedKeys"
          theme="dark"
          mode="horizontal"
          class="menu"
          @select="handleMenuSelect"
        >
          <a-menu-item key="linkage">联动示例</a-menu-item>
          <a-menu-item key="complex">复杂表单示例</a-menu-item>
          <a-menu-item key="async">异步功能示例</a-menu-item>
          <a-menu-item key="custom">自定义组件示例</a-menu-item>
          <a-menu-item key="layout">布局配置示例</a-menu-item>
          <a-menu-item key="tooltip">提示功能示例</a-menu-item>
        </a-menu>
      </a-layout-header>
      
      <!-- 内容区域 -->
      <a-layout-content class="content">
        <div class="content-wrapper">
          <!-- 主版本 -->
          <LinkageExample v-if="currentExample === 'linkage'" />
          <ComplexExample v-else-if="currentExample === 'complex'" />
          <AsyncExample v-else-if="currentExample === 'async'" />
          <CustomComponentExample v-else-if="currentExample === 'custom'" />
          <LayoutExample v-else-if="currentExample === 'layout'" />
          <TooltipExample v-else-if="currentExample === 'tooltip'" />
          
          <!-- 欢迎页面 -->
          <div v-else class="welcome">
            <div class="welcome-content">
              <h1>🎯 Vue3 动态表单组件</h1>
              <p class="description">
                基于 Vue 3 + TypeScript + Ant Design Vue 构建的高性能动态表单组件
              </p>
              <div class="version-notice">
                <a-alert
                  message="架构升级完成"
                  description="采用全新的简化架构设计，彻底解决了联动和验证问题，提供更好的开发体验和性能表现。"
                  type="success"
                  show-icon
                  closable
                />
              </div>
              
              <div class="features">
                <a-row :gutter="24">
                  <a-col :span="8">
                    <a-card title="🚀 高性能" class="feature-card">
                      <p>基于 Vue 3 Composition API，支持 TypeScript</p>
                      <p>虚拟化渲染，智能更新优化</p>
                    </a-card>
                  </a-col>
                  
                  <a-col :span="8">
                    <a-card title="🔗 智能联动" class="feature-card">
                      <p>强大的字段联动引擎</p>
                      <p>支持显示/隐藏、启用/禁用、值设置等</p>
                    </a-card>
                  </a-col>
                  
                  <a-col :span="8">
                    <a-card title="📡 异步数据" class="feature-card">
                      <p>完善的异步数据管理</p>
                      <p>支持缓存、依赖更新、错误处理</p>
                    </a-card>
                  </a-col>
                </a-row>
                
                <a-row :gutter="24" style="margin-top: 24px;">
                  <a-col :span="8">
                    <a-card title="🎨 丰富组件" class="feature-card">
                      <p>内置多种字段类型组件</p>
                      <p>支持自定义组件扩展</p>
                    </a-card>
                  </a-col>
                  
                  <a-col :span="8">
                    <a-card title="📝 Schema驱动" class="feature-card">
                      <p>JSON Schema 完全驱动表单渲染</p>
                      <p>运行时类型验证和推导</p>
                    </a-card>
                  </a-col>
                  
                  <a-col :span="8">
                    <a-card title="🛠 开发友好" class="feature-card">
                      <p>完整的 TypeScript 类型支持</p>
                      <p>丰富的 API 和事件系统</p>
                    </a-card>
                  </a-col>
                </a-row>
              </div>
              
              <div class="quick-start">
                <h3>快速开始</h3>
                <a-space size="large" wrap>
                  <a-button type="primary" size="large" @click="handleMenuSelect({ key: 'linkage' })">
                    🔗 联动示例
                  </a-button>
                  <a-button size="large" @click="handleMenuSelect({ key: 'complex' })">
                    复杂表单示例
                  </a-button>
                  <a-button type="dashed" size="large" @click="handleMenuSelect({ key: 'async' })">
                    异步功能示例
                  </a-button>
                  <a-button type="dashed" size="large" style="background: #fff7e6; border-color: #ffa940; color: #fa8c16;" @click="handleMenuSelect({ key: 'custom' })">
                    🎨 自定义组件示例
                  </a-button>
                </a-space>
              </div>
            </div>
          </div>
        </div>
      </a-layout-content>
      
      <!-- 底部 -->
      <a-layout-footer class="footer">
        <div class="footer-content">
          <p>&copy; 2025 Dynamic Form Component. Built with Vue 3 + TypeScript + Ant Design Vue</p>
        </div>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// 主版本
import LinkageExample from './examples/SimpleLinkageExample.vue'
import ComplexExample from './examples/SimpleComplexExample.vue'
import AsyncExample from './examples/AsyncExample.vue'
import CustomComponentExample from './examples/CustomComponentExample.vue'
import LayoutExample from './examples/LayoutExample.vue'
import TooltipExample from './examples/TooltipExample.vue'

const selectedKeys = ref<string[]>([])
const currentExample = ref<string>('')

const handleMenuSelect = ({ key }: { key: string }) => {
  selectedKeys.value = [key]
  currentExample.value = key
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  padding: 0 24px;
}

.logo {
  flex: 1;
}

.logo h2 {
  color: white;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.menu {
  flex: none;
  background: transparent;
  border-bottom: none;
}

.content {
  padding: 24px;
  background: #f0f2f5;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome {
  text-align: center;
  padding: 48px 24px;
}

.welcome-content {
  max-width: 800px;
  margin: 0 auto;
}

.welcome h1 {
  font-size: 48px;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #1890ff, #722ed1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.description {
  font-size: 18px;
  color: #666;
  margin-bottom: 24px;
  line-height: 1.6;
}

.version-notice {
  margin-bottom: 48px;
  text-align: left;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.features {
  margin-bottom: 48px;
}

.feature-card {
  height: 100%;
  text-align: left;
}

.feature-card :deep(.ant-card-head-title) {
  font-size: 16px;
  font-weight: 600;
}

.feature-card p {
  margin-bottom: 8px;
  color: #666;
  line-height: 1.5;
}

.quick-start h3 {
  font-size: 24px;
  margin-bottom: 24px;
  color: #262626;
}

.footer {
  text-align: center;
  background: #001529;
  color: rgba(255, 255, 255, 0.65);
}

.footer-content p {
  margin: 0;
  font-size: 14px;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    height: auto;
    padding: 16px;
  }
  
  .menu {
    width: 100%;
    justify-content: center;
    margin-top: 16px;
  }
  
  .welcome h1 {
    font-size: 32px;
  }
  
  .description {
    font-size: 16px;
  }
  
  :deep(.ant-col) {
    margin-bottom: 16px;
  }
}
</style>