<template>
  <div class="custom-component-example">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>🎨 自定义组件示例</h2>
      <p class="page-description">
        探索动态表单中自定义组件的三种使用方式，掌握灵活的组件扩展技巧
      </p>
    </div>

    <!-- 目录导航 -->
    <div class="toc-container">
      <div class="toc-header">
        <h3>📋 目录导航</h3>
        <p>快速跳转到您感兴趣的内容</p>
      </div>
      <div class="toc-nav">
        <a 
          v-for="section in sections" 
          :key="section.id"
          :href="`#${section.id}`"
          class="toc-item"
          :class="{ active: activeSection === section.id }"
          @click.prevent="scrollToSection(section.id)"
        >
          <span class="toc-icon">{{ section.icon }}</span>
          <span class="toc-title">{{ section.title }}</span>
        </a>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 快速概览 -->
      <section
        id="overview"
        class="content-section"
      >
        <div class="section-header">
          <h3>⚡ 快速概览</h3>
          <p>通过这个示例，您将学会自定义组件的创建和使用</p>
        </div>
        <div class="overview-grid">
          <div class="overview-card">
            <div class="card-icon">
              ✨
            </div>
            <h4>创建自定义组件</h4>
            <p>如评分组件、颜色选择器等</p>
          </div>
          <div class="overview-card">
            <div class="card-icon">
              🔧
            </div>
            <h4>三种注册方式</h4>
            <p>全局注册、实例注册、直接指定</p>
          </div>
          <div class="overview-card">
            <div class="card-icon">
              🎯
            </div>
            <h4>实际应用场景</h4>
            <p>联动效果、动态管理、属性传递</p>
          </div>
          <div class="overview-card">
            <div class="card-icon">
              📚
            </div>
            <h4>最佳实践</h4>
            <p>如何选择合适的使用方式</p>
          </div>
        </div>
      </section>

      <!-- 实际演示 -->
      <section
        id="demo"
        class="content-section"
      >
        <div class="section-header">
          <h3>🎯 实际演示</h3>
          <p>以下表单展示了三种自定义组件的使用方式，您可以直接交互体验效果</p>
        </div>
        <div class="demo-container">
          <div class="demo-form">
            <div class="form-header">
              <h4>表单演示</h4>
              <div class="form-labels">
                <span class="label global">🌐 全局注册</span>
                <span class="label instance">🏠 实例注册</span>
                <span class="label inline">⚡ 直接指定</span>
              </div>
            </div>
            <SimpleForm
              ref="formRef"
              v-model="formData"
              :schema="schema"
              @submit="handleSubmit"
              @change="handleChange"
            />
          </div>
          <div class="demo-sidebar">
            <div class="sidebar-panel">
              <h4>📊 表单数据</h4>
              <pre class="data-display">{{ JSON.stringify(formData, null, 2) }}</pre>
            </div>
            <div class="sidebar-panel">
              <h4>🔧 组件状态</h4>
              <div class="status-grid">
                <div class="status-item">
                  <span class="status-icon">🌐</span>
                  <span class="status-text">全局组件: {{ globalComponentsCount }}个</span>
                </div>
                <div class="status-item">
                  <span class="status-icon">🏠</span>
                  <span class="status-text">实例组件: {{ instanceComponentsCount }}个</span>
                </div>
                <div class="status-item">
                  <span class="status-icon">⚡</span>
                  <span class="status-text">直接指定: {{ inlineComponentsCount }}个</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 使用方式详解 -->
      <section
        id="methods"
        class="content-section"
      >
        <div class="section-header">
          <h3>📋 三种使用方式详解</h3>
          <p>根据不同的应用场景，选择最合适的组件注册方式</p>
        </div>
        <div class="methods-grid">
          <div class="method-card">
            <div class="method-header">
              <span class="method-icon">🌐</span>
              <h4>全局注册</h4>
              <span class="method-badge">推荐</span>
            </div>
            <p class="method-desc">
              一次注册，全项目可用
            </p>
            <div class="method-pros">
              <h5>✅ 优点</h5>
              <ul>
                <li>全局可用，无需重复配置</li>
                <li>统一管理，便于维护</li>
                <li>适合通用组件</li>
              </ul>
            </div>
            <div class="method-cons">
              <h5>⚠️ 注意</h5>
              <ul>
                <li>需要在应用启动时注册</li>
                <li>增加打包体积</li>
              </ul>
            </div>
            <div class="method-scenario">
              <h5>💡 适用场景</h5>
              <p>评分组件、日期选择器等通用业务组件</p>
            </div>
          </div>

          <div class="method-card">
            <div class="method-header">
              <span class="method-icon">🏠</span>
              <h4>实例注册</h4>
              <span class="method-badge">作用域</span>
            </div>
            <p class="method-desc">
              仅在当前表单实例生效
            </p>
            <div class="method-pros">
              <h5>✅ 优点</h5>
              <ul>
                <li>按需注册，不影响其他表单</li>
                <li>灵活控制作用范围</li>
                <li>支持动态注册/注销</li>
              </ul>
            </div>
            <div class="method-cons">
              <h5>⚠️ 注意</h5>
              <ul>
                <li>需要手动管理生命周期</li>
                <li>多表单需要重复注册</li>
              </ul>
            </div>
            <div class="method-scenario">
              <h5>💡 适用场景</h5>
              <p>特定页面的自定义组件，需要动态控制的组件</p>
            </div>
          </div>

          <div class="method-card">
            <div class="method-header">
              <span class="method-icon">⚡</span>
              <h4>直接指定</h4>
              <span class="method-badge">灵活</span>
            </div>
            <p class="method-desc">
              在字段配置中直接指定组件
            </p>
            <div class="method-pros">
              <h5>✅ 优点</h5>
              <ul>
                <li>最灵活，即用即配</li>
                <li>支持每个字段独立配置</li>
                <li>便于传递自定义属性</li>
              </ul>
            </div>
            <div class="method-cons">
              <h5>⚠️ 注意</h5>
              <ul>
                <li>配置相对复杂</li>
                <li>不便于复用</li>
              </ul>
            </div>
            <div class="method-scenario">
              <h5>💡 适用场景</h5>
              <p>需要特殊配置的组件，一次性使用的组件</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 代码示例 -->
      <section
        id="code"
        class="content-section"
      >
        <div class="section-header">
          <h3>💻 代码示例</h3>
          <p>查看不同注册方式的具体实现代码</p>
        </div>
        <div class="code-tabs">
          <div class="tab-buttons">
            <button 
              v-for="tab in codeTabs" 
              :key="tab.key"
              class="tab-button"
              :class="{ active: activeTab === tab.key }"
              @click="activeTab = tab.key"
            >
              {{ tab.icon }} {{ tab.title }}
            </button>
          </div>
          <div class="tab-content">
            <div
              v-show="activeTab === 'global'"
              class="code-example"
            >
              <h4>🌐 全局注册方式</h4>
              <pre><code>// 1. 导入组件和注册器
import { globalComponentRegistry } from '@/utils/componentRegistry'
import CustomRatingField from '@/components/fields/CustomRatingField.vue'

// 2. 全局注册组件（通常在main.ts或应用初始化时）
// 注意：组件注册器会自动处理 markRaw，无需手动调用
globalComponentRegistry.register('rating', CustomRatingField)

// 3. 在Schema中使用
const schema = {
  fields: [
    {
      name: 'rating',
      type: 'rating',        // 使用注册的类型名
      label: '产品评分',
      placeholder: '请为产品评分'
    }
  ]
}</code></pre>
            </div>
            <div
              v-show="activeTab === 'instance'"
              class="code-example"
            >
              <h4>🏠 实例注册方式</h4>
              <pre><code>// 1. 获取表单实例引用
const formRef = ref()

// 2. 动态注册组件（组件挂载后）
watch(formRef, (newRef) => {
  if (newRef) {
    newRef.registerComponent('color', CustomColorPicker)
  }
}, { immediate: true })

// 3. 在Schema中使用
const schema = {
  fields: [
    {
      name: 'color',
      type: 'color',         // 使用实例注册的类型名
      label: '主题颜色',
      placeholder: '选择您喜欢的颜色'
    }
  ]
}</code></pre>
            </div>
            <div
              v-show="activeTab === 'inline'"
              class="code-example"
            >
              <h4>⚡ 直接指定方式</h4>
              <pre><code>// 1. 导入组件
import CustomRatingField from '@/components/fields/CustomRatingField.vue'

// 2. 在Schema中直接指定组件
const schema = {
  fields: [
    {
      name: 'inlineRating',
      type: 'custom',              // 类型可以任意
      label: '服务评分',
      component: CustomRatingField, // 直接指定组件（自动处理 markRaw）
      componentProps: {            // 传递组件属性
        maxStars: 10,
        textLabels: ['1分', '2分', '3分', ...]
      }
    }
  ]
}</code></pre>
            </div>
          </div>
        </div>
      </section>

      <!-- 动态组件管理 -->
      <section
        id="management"
        class="content-section"
      >
        <div class="section-header">
          <h3>🎛️ 动态组件管理</h3>
          <p>实例级注册的强大之处在于可以动态控制组件的注册和注销</p>
        </div>
        <div class="management-content">
          <div class="management-scenarios">
            <h4>应用场景</h4>
            <div class="scenarios-grid">
              <div class="scenario-item">
                <span class="scenario-icon">🔐</span>
                <div>
                  <strong>权限控制</strong>
                  <p>根据用户权限动态启用/禁用某些组件</p>
                </div>
              </div>
              <div class="scenario-item">
                <span class="scenario-icon">⚙️</span>
                <div>
                  <strong>功能开关</strong>
                  <p>基于配置动态加载不同的组件</p>
                </div>
              </div>
              <div class="scenario-item">
                <span class="scenario-icon">🧪</span>
                <div>
                  <strong>A/B测试</strong>
                  <p>为不同用户组提供不同的组件体验</p>
                </div>
              </div>
              <div class="scenario-item">
                <span class="scenario-icon">🔄</span>
                <div>
                  <strong>热更新</strong>
                  <p>在运行时替换组件实现</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="management-demo">
            <div class="demo-controls">
              <div class="control-info">
                <p class="current-status">
                  当前状态：<span class="status-highlight">"主题颜色"字段使用实例级注册的组件"</span>
                </p>
                <p class="tip">
                  💡 尝试注销组件，观察下方表单中"主题颜色"字段的变化
                </p>
              </div>
              <div class="control-buttons">
                <a-button
                  type="primary"
                  @click="registerInstanceComponents"
                >
                  🔧 重新注册组件
                </a-button>
                <a-button
                  danger
                  @click="unregisterInstanceComponents"
                >
                  🗑️ 注销组件（观察效果）
                </a-button>
              </div>
            </div>
            <div class="demo-result">
              <h4>🎯 实时效果展示</h4>
              <div class="result-grid">
                <div class="result-item">
                  <span class="result-label">主题颜色字段：</span>
                  <span
                    class="result-status"
                    :class="{ error: !isColorComponentRegistered }"
                  >
                    {{ isColorComponentRegistered ? '✅ 正常显示颜色选择器' : '❌ 显示"不支持的字段类型"错误' }}
                  </span>
                </div>
                <div class="result-item">
                  <span class="result-label">组件状态：</span>
                  <span class="result-status">实例组件: {{ instanceComponentsCount }}个</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 进阶技巧 -->
      <section
        id="advanced"
        class="content-section"
      >
        <div class="section-header">
          <h3>💡 进阶技巧与最佳实践</h3>
          <p>掌握组件设计和性能优化的关键要点</p>
        </div>
        <div class="advanced-grid">
          <div class="advanced-card">
            <div class="advanced-icon">
              🏗️
            </div>
            <h4>组件设计原则</h4>
            <ul>
              <li>保持组件的单一职责</li>
              <li>提供清晰的属性接口</li>
              <li>支持常见的事件回调</li>
              <li>考虑无障碍访问性</li>
            </ul>
          </div>
          <div class="advanced-card">
            <div class="advanced-icon">
              ⚡
            </div>
            <h4>性能优化</h4>
            <ul>
              <li>使用懒加载减少初始包大小</li>
              <li>合理使用Vue的响应式特性</li>
              <li>避免在render中创建新对象</li>
              <li>使用key优化列表渲染</li>
            </ul>
          </div>
          <div class="advanced-card">
            <div class="advanced-icon">
              🔧
            </div>
            <h4>调试技巧</h4>
            <ul>
              <li>使用Vue DevTools检查组件状态</li>
              <li>添加详细的控制台日志</li>
              <li>提供友好的错误提示</li>
              <li>编写组件的单元测试</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 高级用法 -->
      <section
        id="advanced-usage"
        class="content-section"
      >
        <div class="section-header">
          <h3>🚀 高级用法：自定义组件与联动效果</h3>
          <p>自定义组件可以与表单的联动功能完美结合，创造出丰富的交互体验</p>
        </div>
        <div class="advanced-usage-content">
          <div class="usage-features">
            <div class="feature-item">
              🔗 条件显示
            </div>
            <div class="feature-item">
              🎨 动态样式
            </div>
            <div class="feature-item">
              📊 实时计算
            </div>
            <div class="feature-item">
              🔄 级联更新
            </div>
          </div>
          
          <div class="advanced-form-demo">
            <h4>联动效果演示</h4>
            <SimpleForm
              v-model="advancedFormData"
              :schema="advancedSchema"
              @change="handleAdvancedChange"
            />
            <div class="interaction-guide">
              <h4>🎯 交互说明</h4>
              <div class="guide-steps">
                <div class="guide-step">
                  <span class="step-number">1</span>
                  <span class="step-text">选择"活泼风格"主题</span>
                </div>
                <div class="guide-step">
                  <span class="step-number">2</span>
                  <span class="step-text">主色调选择器自动显示</span>
                </div>
                <div class="guide-step">
                  <span class="step-number">3</span>
                  <span class="step-text">满意度评分组件同时出现</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeMount, onUnmounted, watch, computed } from 'vue'
import { SimpleForm, type SimpleFormSchema } from '../index'
import { globalComponentRegistry } from '../utils/componentRegistry'
import CustomRatingField from '../components/fields/CustomRatingField.vue'
import CustomColorPicker from '../components/fields/CustomColorPicker.vue'

// 表单引用
const formRef = ref()

// 目录导航数据
const sections = [
  { id: 'overview', title: '快速概览', icon: '⚡' },
  { id: 'demo', title: '实际演示', icon: '🎯' },
  { id: 'methods', title: '使用方式详解', icon: '📋' },
  { id: 'code', title: '代码示例', icon: '💻' },
  { id: 'management', title: '动态组件管理', icon: '🎛️' },
  { id: 'advanced', title: '进阶技巧', icon: '💡' },
  { id: 'advanced-usage', title: '高级用法', icon: '🚀' }
]

// 当前激活的目录项
const activeSection = ref('overview')

// 代码示例选项卡
const activeTab = ref('global')
const codeTabs = [
  { key: 'global', title: '全局注册', icon: '🌐' },
  { key: 'instance', title: '实例注册', icon: '🏠' },
  { key: 'inline', title: '直接指定', icon: '⚡' }
]

// 表单数据
const formData = ref({
  rating: 0,
  color: '',
  inlineRating: 0,
  favoriteColor: '#1890ff'
})

const advancedFormData = ref({
  theme: '',
  primaryColor: '',
  satisfaction: 0
})

// 组件状态统计
const globalComponentsCount = computed(() => {
  return Object.keys(globalComponentRegistry.getAll()).length
})

const instanceComponentsCount = computed(() => {
  if (!formRef.value) return 0
  const allComponents = formRef.value.getAllComponents()
  const globalComponents = globalComponentRegistry.getAll()
  // 计算实例级组件数量（总数 - 全局数量）
  return Object.keys(allComponents).length - Object.keys(globalComponents).length
})

const inlineComponentsCount = computed(() => {
  // 计算使用内联组件的字段数量
  return schema.fields.filter(field => field.component).length + 
         advancedSchema.fields.filter(field => field.component).length
})

// 计算颜色组件是否已注册
const isColorComponentRegistered = computed(() => {
  return formRef.value ? formRef.value.hasComponent('color') : false
})

// 基础表单Schema
const schema: SimpleFormSchema = {
  fields: [
    {
      name: 'rating',
      type: 'rating',  // 使用全局注册的组件
      label: '产品评分',
      placeholder: '请为产品评分',
      rules: [{ required: true, message: '请选择评分' }]
    },
    {
      name: 'color',
      type: 'color',  // 使用实例注册的组件
      label: '主题颜色',
      placeholder: '选择您喜欢的颜色'
    },
    {
      name: 'inlineRating',
      type: 'custom-inline',  // 这个类型不存在，会使用内联组件
      label: '服务评分',
      component: CustomRatingField,  // 内联指定组件
      componentProps: {
        maxStars: 10,
        textLabels: ['1分', '2分', '3分', '4分', '5分', '6分', '7分', '8分', '9分', '10分']
      }
    },
    {
      name: 'favoriteColor',
      type: 'inline-color',
      label: '喜爱颜色',
      component: CustomColorPicker,  // 内联指定组件
      componentProps: {
        showPresetColors: true,
        presetColors: ['#f5222d', '#fa541c', '#fa8c16', '#fadb14', '#52c41a', '#1890ff', '#722ed1']
      }
    },
    {
      name: 'feedback',
      type: 'textarea',
      label: '反馈意见',
      placeholder: '请输入您的反馈意见',
      props: {
        rows: 4
      }
    }
  ]
}

// 高级表单Schema（带联动）
const advancedSchema: SimpleFormSchema = {
  fields: [
    {
      name: 'theme',
      type: 'select',
      label: '主题风格',
      options: [
        { label: '简约风格', value: 'minimal' },
        { label: '商务风格', value: 'business' },
        { label: '活泼风格', value: 'colorful' }
      ]
    },
    {
      name: 'primaryColor',
      type: 'inline-color',
      label: '主色调',
      component: CustomColorPicker,
      linkage: {
        dependsOn: 'theme',
        visibleWhen: (value, formData) => formData.theme === 'colorful'
      },
      componentProps: {
        presetColors: ['#ff4d4f', '#52c41a', '#1890ff', '#722ed1', '#fa8c16']
      }
    },
    {
      name: 'satisfaction',
      type: 'rating',
      label: '满意度评分',
      component: CustomRatingField,
      linkage: {
        dependsOn: 'theme',
        visibleWhen: (value, formData) => !!formData.theme
      }
    }
  ]
}

// 手动注册实例级组件（演示用）
const registerInstanceComponents = () => {
  if (formRef.value) {
    formRef.value.registerComponent('color', CustomColorPicker)
    console.log('✅ 手动注册实例级组件成功')
  } else {
    console.warn('⚠️ 表单实例尚未准备就绪')
  }
}

// 注销实例级组件（演示用）
const unregisterInstanceComponents = () => {
  if (formRef.value) {
    formRef.value.unregisterComponent('color')
    console.log('🗑️ 已注销实例级组件')
  } else {
    console.warn('⚠️ 表单实例尚未准备就绪')
  }
}

// 监听表单引用变化，自动注册实例组件
watch(formRef, (newRef) => {
  if (newRef) {
    // 自动注册实例级组件
    newRef.registerComponent('color', CustomColorPicker)
    console.log('🚀 自动注册实例级组件成功')
  }
}, { immediate: true })

// 事件处理
const handleSubmit = (data: any) => {
  console.log('📤 表单提交:', data)
}

const handleChange = (data: any) => {
  console.log('🔄 表单数据变化:', data)
}

const handleAdvancedChange = (data: any) => {
  console.log('🔄 高级表单数据变化:', data)
}

// 组件挂载前注册全局组件（确保在表单渲染前注册）
onBeforeMount(() => {
  // 注册全局组件
  globalComponentRegistry.register('rating', CustomRatingField)
  console.log('🌐 全局组件注册成功 - rating')
})

// 滚动到指定区域
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
    activeSection.value = sectionId
  }
}

// 监听滚动，更新当前激活的目录项
const updateActiveSection = () => {
  const sections = document.querySelectorAll('.content-section')
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  
  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i] as HTMLElement
    const sectionTop = section.offsetTop - 100 // 偏移量，提前激活
    
    if (scrollTop >= sectionTop) {
      const sectionId = section.id
      if (activeSection.value !== sectionId) {
        activeSection.value = sectionId
      }
      break
    }
  }
}

// 组件挂载后检查注册状态
onMounted(() => {
  // 检查组件注册状态
  console.log('📊 组件注册状态检查:')
  console.log('  🌐 全局组件:', Object.keys(globalComponentRegistry.getAll()))
  
  // 检查表单组件注册状态
  if (formRef.value) {
    console.log('  🏠 表单实例组件:', Object.keys(formRef.value.getAllComponents()))
  }
  
  // 添加滚动监听
  window.addEventListener('scroll', updateActiveSection)
})

// 组件卸载时移除滚动监听
onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveSection)
})
</script>

<style scoped>
.custom-component-example {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 16px;
  line-height: 1.5;
}

/* 页面标题 */
.page-header {
  text-align: center;
  margin-bottom: 32px;
  padding: 24px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

/* 目录导航 */
.toc-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 32px;
  border: 1px solid #e0e7ff;
  position: sticky;
  top: 20px;
  z-index: 10;
}

.toc-header {
  text-align: center;
  margin-bottom: 24px;
}

.toc-header h3 {
  font-size: 1.5rem;
  margin-bottom: 8px;
  color: #2d3748;
}

.toc-header p {
  font-size: 0.9rem;
  color: #6b7280;
}

.toc-nav {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
}

.toc-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  color: #475569;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  text-decoration: none;
}

.toc-item:hover {
  background: #e2e8f0;
  color: #1e40af;
}

.toc-item.active {
  background: #1e40af;
  color: white;
  font-weight: 600;
}

.toc-item.active:hover {
  background: #1e40af;
  color: white;
}

.toc-icon {
  font-size: 1.2rem;
}

.toc-title {
  flex: 1;
}

/* 主要内容区域 */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.content-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  scroll-margin-top: 100px;
}

.section-header {
  text-align: center;
  margin-bottom: 20px;
}

.section-header h3 {
  font-size: 1.5rem;
  margin-bottom: 8px;
  color: #2d3748;
}

.section-header p {
  font-size: 0.9rem;
  color: #6b7280;
}

/* 快速概览 */
.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.overview-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  text-align: center;
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 12px;
  color: #3b82f6;
}

.overview-card h4 {
  font-size: 1.1rem;
  color: #2d3748;
  margin-bottom: 8px;
}

.overview-card p {
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 16px;
}

/* 实际演示 */
.demo-container {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 20px;
  align-items: start;
}

@media (max-width: 1024px) {
  .demo-container {
    grid-template-columns: 1fr;
  }
}

.demo-form {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
}

.form-header h4 {
  margin: 0;
  font-size: 1.1rem;
  color: #374151;
}

.form-labels {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.label {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.label.global {
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #10b981;
}

.label.instance {
  background: #eff6ff;
  color: #1e40af;
  border: 1px solid #3b82f6;
}

.label.inline {
  background: #f3e8ff;
  color: #6b21a8;
  border: 1px solid #8b5cf6;
}

/* 演示区域描述 */
.demo-description {
  margin-bottom: 24px;
  text-align: center;
}

.demo-description p {
  font-size: 1.05rem;
  color: #4b5563;
  margin-bottom: 16px;
}

.demo-labels {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.demo-label {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.demo-label.global {
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #10b981;
}

.demo-label.instance {
  background: #eff6ff;
  color: #1e40af;
  border: 1px solid #3b82f6;
}

.demo-label.inline {
  background: #f3e8ff;
  color: #6b21a8;
  border: 1px solid #8b5cf6;
}

/* 方式详解描述 */
.methods-description {
  text-align: center;
  margin-bottom: 32px;
}

.methods-description p {
  font-size: 1.05rem;
  color: #4b5563;
}

/* 适用场景 */
.method-usage {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.usage-title {
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #3b82f6;
}

.method-usage p {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
}

.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="25" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="25" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
}

.page-header h2 {
  margin: 0 0 12px 0;
  font-size: 2.5rem;
  font-weight: 700;
  position: relative;
  z-index: 1;
}

.page-description {
  margin: 0;
  font-size: 1.2rem;
  opacity: 0.9;
  position: relative;
  z-index: 1;
}

/* 方式对比网格 */
.methods-overview {
  margin-bottom: 48px;
}

.methods-overview h3 {
  font-size: 1.5rem;
  margin-bottom: 24px;
  color: #2d3748;
  text-align: center;
}

.methods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.method-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.method-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.method-card.global-method {
  border-color: #10b981;
}

.method-card.instance-method {
  border-color: #3b82f6;
}

.method-card.inline-method {
  border-color: #8b5cf6;
}

.method-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  position: relative;
}

.method-icon {
  font-size: 2rem;
  line-height: 1;
}

.method-header h4 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  flex: 1;
}

.method-badge {
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.method-badge {
  background: #10b981;
  color: white;
}

.method-badge.scope {
  background: #3b82f6;
  color: white;
}

.method-badge.flexible {
  background: #8b5cf6;
  color: white;
}

.method-desc {
  color: #6b7280;
  margin-bottom: 20px;
  font-size: 0.95rem;
}

.method-pros, .method-cons {
  margin-bottom: 16px;
}

.pros-title, .cons-title {
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.pros-title {
  color: #059669;
}

.cons-title {
  color: #d97706;
}

.method-pros ul, .method-cons ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.method-pros li, .method-cons li {
  padding: 4px 0;
  font-size: 0.85rem;
  position: relative;
  padding-left: 16px;
}

.method-pros li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #059669;
  font-weight: bold;
}

.method-cons li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #d97706;
  font-weight: bold;
}

/* 演示区域 */
.demo-section {
  margin-bottom: 48px;
}

.demo-section h3 {
  font-size: 1.5rem;
  margin-bottom: 24px;
  color: #2d3748;
  text-align: center;
}

.demo-container {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 20px;
  align-items: start;
}

@media (max-width: 1024px) {
  .demo-container {
    grid-template-columns: 1fr;
  }
}

.form-wrapper {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.demo-right {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.data-panel, .status-panel {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.data-panel h4, .status-panel h4 {
  margin: 0 0 16px 0;
  color: #374151;
  font-size: 1.1rem;
}

.data-display {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e2e8f0;
}

.data-display pre {
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.5;
  color: #475569;
}

.status-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.9rem;
}

.status-item.global {
  background: #ecfdf5;
  color: #065f46;
}

.status-item.instance {
  background: #eff6ff;
  color: #1e40af;
}

.status-item.inline {
  background: #f3e8ff;
  color: #6b21a8;
}

.status-icon {
  font-size: 1.2rem;
}

/* 代码示例 */
.code-examples-section {
  margin-bottom: 48px;
}

.code-examples-section h3 {
  font-size: 1.5rem;
  margin-bottom: 24px;
  color: #2d3748;
  text-align: center;
}

.code-tabs {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.tab-headers {
  display: flex;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.tab-header {
  flex: 1;
  padding: 16px 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  color: #64748b;
  transition: all 0.2s ease;
  position: relative;
}

.tab-header:hover {
  background: #e2e8f0;
  color: #475569;
}

.tab-header.active {
  background: white;
  color: #1e40af;
}

.tab-header.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: #1e40af;
}

.tab-content {
  padding: 24px;
}

.code-example h4 {
  margin: 0 0 16px 0;
  color: #374151;
  font-size: 1.1rem;
}

.code-example pre {
  background: #1e293b;
  color: #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.6;
  overflow-x: auto;
}

/* 实例管理 */
.instance-management {
  margin-bottom: 48px;
}

.instance-management h3 {
  font-size: 1.5rem;
  margin-bottom: 24px;
  color: #2d3748;
  text-align: center;
}

.management-description {
  background: #f8fafc;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  border-left: 4px solid #3b82f6;
}

.management-description p {
  color: #4b5563;
  margin-bottom: 16px;
  font-size: 1.05rem;
}

.management-scenarios {
  list-style: none;
  padding: 0;
  margin: 0;
}

.management-scenarios li {
  padding: 8px 0;
  color: #374151;
  font-size: 0.95rem;
}

.management-panel {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

@media (max-width: 768px) {
  .management-panel {
    flex-direction: column;
    align-items: stretch;
  }
}

.management-info {
  flex: 1;
}

.current-status {
  margin: 0 0 12px 0;
  color: #374151;
  font-weight: 500;
}

.status-highlight {
  color: #3b82f6;
  font-weight: 600;
}

.management-info p {
  margin: 0 0 8px 0;
  color: #4b5563;
}

.tip {
  background: #fef3c7;
  color: #92400e;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  border-left: 4px solid #f59e0b;
}

.management-buttons {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .management-buttons {
    justify-content: center;
  }
}

/* 实时效果展示 */
.effect-demo {
  margin-top: 24px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.effect-demo h4 {
  margin: 0 0 16px 0;
  color: #374151;
  font-size: 1.1rem;
}

.effect-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.effect-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.effect-label {
  font-weight: 500;
  color: #374151;
  min-width: 120px;
  flex-shrink: 0;
}

.effect-status {
  flex: 1;
}

.status-success {
  color: #059669;
  font-weight: 500;
}

.status-error-text {
  color: #dc2626;
  font-weight: 500;
}

.status-info {
  color: #3b82f6;
  font-weight: 500;
}

.status-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
}

/* 进阶技巧 */
.advanced-tips {
  margin-bottom: 48px;
  background: linear-gradient(135deg, #fefce8 0%, #f0fdf4 100%);
  border-radius: 12px;
  padding: 32px;
  border: 1px solid #eab308;
}

.advanced-tips h3 {
  font-size: 1.5rem;
  margin-bottom: 24px;
  color: #2d3748;
  text-align: center;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.tip-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.tip-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.tip-icon {
  font-size: 1.5rem;
}

.tip-header h4 {
  margin: 0;
  color: #374151;
  font-size: 1.1rem;
}

.tip-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tip-list li {
  padding: 6px 0;
  color: #6b7280;
  font-size: 0.9rem;
  position: relative;
  padding-left: 16px;
}

.tip-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #3b82f6;
  font-weight: bold;
}

/* 高级用法介绍 */
.advanced-intro {
  text-align: center;
  margin-bottom: 32px;
}

.advanced-intro p {
  font-size: 1.05rem;
  color: #4b5563;
  margin-bottom: 16px;
}

.advanced-features {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.feature-tag {
  padding: 6px 12px;
  background: white;
  border: 2px solid #e0e7ff;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #6366f1;
}

/* 高级演示区域 */
.advanced-demo {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;
  align-items: start;
}

@media (max-width: 1024px) {
  .advanced-demo {
    grid-template-columns: 1fr;
  }
}

.form-container {
  min-width: 300px;
}

.form-container :deep(.ant-select) {
  min-width: 200px;
}

.form-container :deep(.ant-form-item) {
  margin-bottom: 16px;
}

.advanced-explanation {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.advanced-explanation h4 {
  margin: 0 0 16px 0;
  color: #374151;
}

.explanation-steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.step {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  font-size: 0.85rem;
  font-weight: 600;
  flex-shrink: 0;
}

.step-text {
  color: #4b5563;
  font-size: 0.9rem;
}

/* 高级用法 */
.advanced-section {
  background: linear-gradient(135deg, #fef7ff 0%, #f0f9ff 100%);
  border-radius: 12px;
  padding: 32px;
  border: 1px solid #e0e7ff;
}

.advanced-section h3 {
  font-size: 1.5rem;
  margin-bottom: 24px;
  color: #2d3748;
  text-align: center;
}

.advanced-demo {
  display: grid;
  gap: 24px;
}

.advanced-desc p {
  margin: 0;
  color: #4b5563;
  text-align: center;
  font-size: 1.05rem;
}

.advanced-form {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* 响应式优化 */
@media (max-width: 768px) {
  .custom-component-example {
    padding: 16px;
  }
  
  .page-header h2 {
    font-size: 2rem;
  }
  
  .page-description {
    font-size: 1rem;
  }
  
  .methods-grid {
    grid-template-columns: 1fr;
  }
  
  .demo-container {
    grid-template-columns: 1fr;
  }
  
  .tab-headers {
    flex-direction: column;
  }
  
  .tab-header {
    text-align: center;
  }
}
</style>