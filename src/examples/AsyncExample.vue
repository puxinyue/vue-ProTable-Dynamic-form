<template>
  <div class="async-example">
    <div class="example-header">
      <h2>异步特性示例</h2>
      <p>展示异步数据初始化、异步数据联动、异步数据校验功能</p>
    </div>
    
    <div class="example-content">
      <div class="form-container">
        <!-- 始终渲染SimpleForm组件，通过overlay显示loading状态 -->
        <div
          class="form-wrapper"
          :class="{ 'loading': initLoading }"
        >
          <div
            v-if="initLoading"
            class="init-loading-overlay"
          >
            <a-spin size="large" />
            <div class="loading-text">
              正在初始化表单数据...
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
      </div>
      
      <div class="data-display">
        <div class="data-title">
          实时数据
        </div>
        <pre class="data-content">{{ JSON.stringify(formData, null, 2) }}</pre>
        
        <div
          class="data-title"
          style="margin-top: 16px;"
        >
          异步状态
        </div>
        <pre class="data-content">{{ JSON.stringify(asyncStates, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import type { SimpleFormSchema } from '../types/form'
import SimpleForm from '../components/SimpleForm.vue'

// 表单数据
const formData = ref({})
const formRef = ref()

// 简单的响应式状态，不使用计算属性
const initLoading = ref(true)
const asyncStates = ref({})

// 手动更新异步状态
const updateAsyncStates = () => {
  if (!formRef.value?.getAsyncState) {
    return
  }
  
  const initState = formRef.value.getAsyncState('__init__')
  
  // 修复状态同步逻辑：只有当initState存在且loading为false时才设置为false
  if (initState && initState.loading !== undefined) {
    initLoading.value = initState.loading
  }
  
  asyncStates.value = {
    __init__: initState,
    username_validation: formRef.value.getAsyncState('username_validation'),
    email_validation: formRef.value.getAsyncState('email_validation')
  }
}

// 定期检查状态变化的定时器
let interval: number

// 在组件挂载后开始监听状态变化
onMounted(async () => {
  // 等待表单完全初始化
  await nextTick()
  
  // 等待更长时间确保表单组件完全准备好
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // 初始更新
  updateAsyncStates()
  
  // 定期检查状态变化（较少频率）
  interval = window.setInterval(() => {
    if (formRef.value) {
      updateAsyncStates()
    }
  }, 500) // 每500ms检查一次，避免过于频繁
})

// 组件销毁时清理
onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})

// 模拟API调用
const mockApiCall = (delay: number = 1000) => {
  return new Promise(resolve => setTimeout(resolve, delay))
}

// 模拟初始化数据
const mockInitializeData = async () => {
  await mockApiCall(2000) // 模拟2秒加载时间
  return {
    username: 'admin',
    userType: 'enterprise',
    companyName: '测试公司',
    country: 'china'
  }
}

// 模拟根据国家加载省份
const loadProvinces = async (country: string) => {
  await mockApiCall(1500) // 模拟1.5秒加载时间
  
  const provinces: Record<string, Array<{label: string, value: string}>> = {
    china: [
      { label: '北京市', value: 'beijing' },
      { label: '上海市', value: 'shanghai' },
      { label: '广东省', value: 'guangdong' },
      { label: '江苏省', value: 'jiangsu' }
    ],
    usa: [
      { label: 'California', value: 'california' },
      { label: 'New York', value: 'newyork' },
      { label: 'Texas', value: 'texas' }
    ]
  }
  
  return provinces[country] || []
}

// 模拟根据省份加载城市
const loadCities = async (province: string) => {
  await mockApiCall(1000) // 模拟1秒加载时间
  
  const cities: Record<string, Array<{label: string, value: string}>> = {
    beijing: [
      { label: '朝阳区', value: 'chaoyang' },
      { label: '海淀区', value: 'haidian' },
      { label: '西城区', value: 'xicheng' },
      { label: '东城区', value: 'dongcheng' },
      { label: '丰台区', value: 'fengtai' }
    ],
    shanghai: [
      { label: '浦东新区', value: 'pudong' },
      { label: '黄浦区', value: 'huangpu' },
      { label: '静安区', value: 'jingan' },
      { label: '徐汇区', value: 'xuhui' },
      { label: '长宁区', value: 'changning' }
    ],
    guangdong: [
      { label: '广州市', value: 'guangzhou' },
      { label: '深圳市', value: 'shenzhen' },
      { label: '珠海市', value: 'zhuhai' },
      { label: '东莞市', value: 'dongguan' },
      { label: '佛山市', value: 'foshan' }
    ],
    jiangsu: [
      { label: '南京市', value: 'nanjing' },
      { label: '苏州市', value: 'suzhou' },
      { label: '无锡市', value: 'wuxi' },
      { label: '常州市', value: 'changzhou' },
      { label: '徐州市', value: 'xuzhou' }
    ]
  }
  
  return cities[province] || []
}

// 模拟异步验证用户名
const validateUsername = async (username: string) => {
  if (!username) return true
  
  await mockApiCall(800) // 模拟800ms验证时间
  
  // 模拟已存在的用户名
  const existingUsers = ['admin', 'test', 'user123']
  if (existingUsers.includes(username.toLowerCase())) {
    return '用户名已存在'
  }
  
  return true
}

// 模拟异步验证邮箱
const validateEmail = async (email: string) => {
  if (!email) return true
  
  await mockApiCall(600) // 模拟600ms验证时间
  
  // 简单邮箱格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return '邮箱格式不正确'
  }
  
  // 模拟检查邮箱是否已注册
  const registeredEmails = ['admin@test.com', 'user@example.com']
  if (registeredEmails.includes(email.toLowerCase())) {
    return '邮箱已被注册'
  }
  
  return true
}

// 表单配置
const schema: SimpleFormSchema = {
  // 异步数据初始化
  asyncInitializer: mockInitializeData,
  
  fields: [
    {
      name: 'username',
      type: 'input',
      label: '用户名',
      placeholder: '请输入用户名',
      required: true,
      rules: [
        { required: true, message: '请输入用户名' },
        { asyncValidator: validateUsername } // 异步验证
      ]
    },
    {
      name: 'email',
      type: 'input',
      label: '邮箱',
      placeholder: '请输入邮箱地址',
      rules: [
        { asyncValidator: validateEmail } // 异步验证
      ]
    },
    {
      name: 'userType',
      type: 'radio',
      label: '用户类型',
      required: true,
      options: [
        { label: '个人用户', value: 'personal' },
        { label: '企业用户', value: 'enterprise' }
      ]
    },
    {
      name: 'companyName',
      type: 'input',
      label: '公司名称',
      placeholder: '请输入公司名称',
      linkage: {
        dependsOn: 'userType',
        visibleWhen: (value, formData) => formData.userType === 'enterprise'
      },
      rules: [{ required: true, message: '请输入公司名称' }]
    },
    {
      name: 'country',
      type: 'select',
      label: '国家',
      placeholder: '请选择国家',
      options: [
        { label: '中国', value: 'china' },
        { label: '美国', value: 'usa' }
      ]
    },
    {
      name: 'province',
      type: 'select',
      label: '省份/州',
      placeholder: '请选择省份',
      linkage: {
        dependsOn: 'country',
        asyncOptionsLoader: loadProvinces // 异步联动
      }
    },
    {
      name: 'city',
      type: 'select',
      label: '城市',
      placeholder: '请选择城市',
      linkage: {
        dependsOn: 'province',
        asyncOptionsLoader: loadCities // 异步联动
      }
    },
    {
      name: 'description',
      type: 'textarea',
      label: '描述',
      placeholder: '请输入描述信息',
      props: {
        rows: 4
      }
    }
  ]
}

// 处理表单提交
const handleSubmit = (data: any) => {
  console.log('表单提交:', data)
}

// 处理表单变化
const handleChange = (data: any) => {
  console.log('表单变化:', data)
}
</script>

<style scoped>
.async-example {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.example-header {
  margin-bottom: 24px;
}

.example-header h2 {
  margin: 0 0 8px 0;
  color: #262626;
}

.example-header p {
  margin: 0;
  color: #8c8c8c;  
  font-size: 14px;
}

.example-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
}

.form-container {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #d9d9d9;
  min-height: 400px;
  position: relative;
}

.form-wrapper {
  position: relative;
}

.form-wrapper.loading {
  pointer-events: none;
  opacity: 0.7;
}

.init-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  z-index: 10;
  gap: 16px;
}

.loading-text {
  color: #8c8c8c;
  font-size: 14px;
}

.data-display {
  background: #fafafa;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #d9d9d9;
}

.data-title {
  margin-bottom: 12px;
  font-weight: 600;
  color: #262626;
}

.data-content {
  background: #fff;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  font-size: 12px;
  overflow-x: auto;
  max-height: 300px;
  overflow-y: auto;
}
</style>