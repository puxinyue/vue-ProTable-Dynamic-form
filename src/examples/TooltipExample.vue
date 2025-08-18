<template>
  <div class="tooltip-example">
    <div class="example-header">
      <h2>💡 提示功能示例</h2>
      <p>展示动态表单的提示功能，包括简单文本提示和高级配置提示</p>
    </div>
    
    <!-- 功能说明 -->
    <div class="feature-overview">
      <div class="feature-grid">
        <div class="feature-card">
          <div class="feature-icon">💬</div>
          <h4>简单文本提示</h4>
          <p>使用字符串直接配置提示内容</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">⚙️</div>
          <h4>高级配置提示</h4>
          <p>支持位置、颜色、样式等详细配置</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎨</div>
          <h4>自定义样式</h4>
          <p>支持自定义提示框样式和类名</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🖱️</div>
          <h4>交互体验</h4>
          <p>鼠标悬停显示，友好的用户交互</p>
        </div>
      </div>
    </div>
    
    <!-- 示例表单 -->
    <div class="examples-container">
      <!-- 简单提示示例 -->
      <div class="example-section">
        <h3>📝 简单提示示例</h3>
        <p class="section-desc">使用字符串直接配置提示内容，适合简单的说明文字</p>
        <div class="form-wrapper">
          <SimpleForm
            v-model="simpleFormData"
            :schema="simpleSchema"
            @change="handleSimpleChange"
          />
        </div>
        <div class="data-panel">
          <h4>📊 表单数据</h4>
          <pre class="data-content">{{ JSON.stringify(simpleFormData, null, 2) }}</pre>
        </div>
      </div>
      
      <!-- 高级提示示例 -->
      <div class="example-section">
        <h3>🔧 高级提示示例</h3>
        <p class="section-desc">使用对象配置提示，支持位置、颜色、样式等详细配置</p>
        <div class="form-wrapper">
          <SimpleForm
            v-model="advancedFormData"
            :schema="advancedSchema"
            @change="handleAdvancedChange"
          />
        </div>
        <div class="data-panel">
          <h4>📊 表单数据</h4>
          <pre class="data-content">{{ JSON.stringify(advancedFormData, null, 2) }}</pre>
        </div>
      </div>
      
      <!-- 不同位置提示示例 -->
      <div class="example-section">
        <h3>📍 不同位置提示示例</h3>
        <p class="section-desc">展示不同位置的提示效果，适应不同的布局需求</p>
        <div class="form-wrapper">
          <SimpleForm
            v-model="positionFormData"
            :schema="positionSchema"
            @change="handlePositionChange"
          />
        </div>
        <div class="data-panel">
          <h4>📊 表单数据</h4>
          <pre class="data-content">{{ JSON.stringify(positionFormData, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SimpleForm, type SimpleFormSchema } from '../index'

// 简单提示示例数据
const simpleFormData = ref({})

const simpleSchema: SimpleFormSchema = {
  fields: [
    {
      name: 'username',
      type: 'input',
      label: '用户名',
      placeholder: '请输入用户名',
      tooltip: '用户名用于登录系统，建议使用字母、数字和下划线的组合',
      rules: [{ required: true, message: '用户名为必填项' }]
    },
    {
      name: 'email',
      type: 'input',
      label: '邮箱地址',
      placeholder: '请输入邮箱地址',
      tooltip: '邮箱地址将用于接收重要通知和找回密码',
      rules: [
        { required: true, message: '邮箱为必填项' },
        {
          validator: (value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            return emailRegex.test(value) || '请输入有效的邮箱地址'
          }
        }
      ]
    },
    {
      name: 'password',
      type: 'input',
      label: '密码',
      placeholder: '请输入密码',
      tooltip: '密码长度至少8位，建议包含大小写字母、数字和特殊字符',
      props: { type: 'password' },
      rules: [
        { required: true, message: '密码为必填项' },
        {
          validator: (value) => {
            return value.length >= 8 || '密码长度至少8位'
          }
        }
      ]
    }
  ]
}

// 高级提示示例数据
const advancedFormData = ref({})

const advancedSchema: SimpleFormSchema = {
  fields: [
    {
      name: 'projectName',
      type: 'input',
      label: '项目名称',
      placeholder: '请输入项目名称',
      tooltip: {
        title: '项目名称将用于系统标识和显示，建议使用简洁明了的名称',
        placement: 'right',
        color: '#52c41a',
        overlayClassName: 'custom-tooltip-success'
      },
      rules: [{ required: true, message: '项目名称为必填项' }]
    },
    {
      name: 'projectType',
      type: 'select',
      label: '项目类型',
      placeholder: '请选择项目类型',
      tooltip: {
        title: '选择项目类型将影响后续的配置选项和功能模块',
        placement: 'bottom',
        color: '#1890ff',
        overlayStyle: {
          fontSize: '13px',
          lineHeight: '1.6'
        }
      },
      options: [
        { label: 'Web应用', value: 'web' },
        { label: '移动应用', value: 'mobile' },
        { label: '桌面应用', value: 'desktop' },
        { label: 'API服务', value: 'api' }
      ],
      rules: [{ required: true, message: '请选择项目类型' }]
    },
    {
      name: 'budget',
      type: 'number',
      label: '项目预算',
      placeholder: '请输入项目预算',
      tooltip: {
        title: '项目预算将用于资源分配和成本控制，请根据实际情况填写',
        placement: 'left',
        color: '#fa8c16',
        overlayClassName: 'custom-tooltip-warning'
      },
      props: {
        min: 0,
        step: 1000,
        formatter: (value: number) => `¥${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        parser: (value: string) => value.replace(/¥\s?|(,*)/g, '')
      },
      rules: [{ required: true, message: '项目预算为必填项' }]
    }
  ]
}

// 不同位置提示示例数据
const positionFormData = ref({})

const positionSchema: SimpleFormSchema = {
  fields: [
    {
      name: 'topTip',
      type: 'input',
      label: '顶部提示',
      placeholder: '提示显示在标签上方',
      tooltip: {
        title: '这是顶部提示，适合在空间有限时使用',
        placement: 'top'
      }
    },
    {
      name: 'bottomTip',
      type: 'input',
      label: '底部提示',
      placeholder: '提示显示在标签下方',
      tooltip: {
        title: '这是底部提示，适合在标签下方有足够空间时使用',
        placement: 'bottom'
      }
    },
    {
      name: 'leftTip',
      type: 'input',
      label: '左侧提示',
      placeholder: '提示显示在标签左侧',
      tooltip: {
        title: '这是左侧提示，适合在标签左侧有足够空间时使用',
        placement: 'left'
      }
    },
    {
      name: 'rightTip',
      type: 'input',
      label: '右侧提示',
      placeholder: '提示显示在标签右侧',
      tooltip: {
        title: '这是右侧提示，适合在标签右侧有足够空间时使用',
        placement: 'right'
      }
    }
  ]
}

// 事件处理函数
const handleSimpleChange = (data: any) => {
  console.log('简单提示表单变化:', data)
}

const handleAdvancedChange = (data: any) => {
  console.log('高级提示表单变化:', data)
}

const handlePositionChange = (data: any) => {
  console.log('位置提示表单变化:', data)
}
</script>

<style scoped>
.tooltip-example {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.example-header {
  text-align: center;
  margin-bottom: 40px;
}

.example-header h2 {
  color: #1890ff;
  margin-bottom: 8px;
}

.example-header p {
  color: #666;
  font-size: 16px;
}

.feature-overview {
  margin-bottom: 40px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.feature-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.feature-card h4 {
  color: #333;
  margin-bottom: 8px;
}

.feature-card p {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.examples-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.example-section {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 24px;
}

.example-section h3 {
  color: #333;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-desc {
  color: #666;
  margin-bottom: 20px;
  font-size: 14px;
}

.form-wrapper {
  margin-bottom: 20px;
  padding: 20px;
  background: #fafafa;
  border-radius: 6px;
}

.data-panel {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 16px;
}

.data-panel h4 {
  color: #333;
  margin-bottom: 12px;
  font-size: 14px;
}

.data-content {
  background: #2d3748;
  color: #e2e8f0;
  padding: 12px;
  border-radius: 4px;
  font-size: 12px;
  overflow-x: auto;
  margin: 0;
  line-height: 1.4;
}

/* 自定义提示样式 */
:deep(.custom-tooltip-success) {
  background-color: #f6ffed !important;
  border: 1px solid #b7eb8f !important;
  color: #52c41a !important;
}

:deep(.custom-tooltip-warning) {
  background-color: #fffbe6 !important;
  border: 1px solid #ffe58f !important;
  color: #fa8c16 !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tooltip-example {
    padding: 16px;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
  
  .example-section {
    padding: 16px;
  }
  
  .form-wrapper {
    padding: 16px;
  }
}
</style>

