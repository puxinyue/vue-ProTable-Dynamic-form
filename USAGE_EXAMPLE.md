# 使用示例

这是一个完整的示例，展示如何在Vue 3项目中使用`@chl1860/dynamic-form-vue3`。

## 项目设置

### 1. 创建新的Vue项目

```bash
npm create vue@latest my-form-project
cd my-form-project
npm install
```

### 2. 安装动态表单组件

```bash
npm install @chl1860/dynamic-form-vue3 ant-design-vue
```

### 3. 配置主应用

```typescript
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import DynamicForm from '@chl1860/dynamic-form-vue3'

// 导入样式
import 'ant-design-vue/dist/reset.css'
import '@chl1860/dynamic-form-vue3/dist/style.css'

const app = createApp(App)

// 注册Ant Design Vue
app.use(Antd)

// 注册动态表单组件
app.use(DynamicForm, {
  componentPrefix: 'Simple',
  debug: false
})

app.mount('#app')
```

## 基础使用示例

### 用户注册表单

```vue
<!-- src/components/UserRegistrationForm.vue -->
<template>
  <div class="registration-form">
    <h2>用户注册</h2>
    <SimpleForm
      v-model="formData"
      :schema="registrationSchema"
      @submit="handleSubmit"
      @change="handleFormChange"
      @validate="handleValidate"
    />
    
    <div v-if="submitResult" class="submit-result">
      <h3>提交结果：</h3>
      <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { SimpleForm, type SimpleFormSchema } from '@chl1860/dynamic-form-vue3'

// 表单数据
const formData = ref({})
const submitResult = ref(false)

// 表单配置
const registrationSchema: SimpleFormSchema = {
  fields: [
    // 基本信息组
    {
      name: 'basicInfo',
      type: 'group',
      label: '基本信息',
      bordered: true,
      children: [
        {
          name: 'username',
          type: 'input',
          label: '用户名',
          placeholder: '请输入用户名',
          rules: [
            { required: true, message: '用户名为必填项' },
            { min: 3, message: '用户名至少3个字符' }
          ]
        },
        {
          name: 'email',
          type: 'input',
          label: '邮箱',
          placeholder: '请输入邮箱地址',
          rules: [
            { required: true, message: '邮箱为必填项' },
            { type: 'email', message: '请输入正确的邮箱格式' }
          ]
        },
        {
          name: 'phone',
          type: 'input',
          label: '手机号码',
          placeholder: '请输入手机号码',
          rules: [
            { required: true, message: '手机号码为必填项' },
            { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码' }
          ]
        }
      ]
    },
    
    // 用户类型选择
    {
      name: 'userType',
      type: 'radio',
      label: '用户类型',
      options: [
        { label: '个人用户', value: 'personal' },
        { label: '企业用户', value: 'enterprise' }
      ],
      rules: [{ required: true, message: '请选择用户类型' }]
    },
    
    // 企业信息（条件显示）
    {
      name: 'companyInfo',
      type: 'group',
      label: '企业信息',
      bordered: true,
      linkage: {
        dependsOn: 'userType',
        visibleWhen: (value, formData) => formData.userType === 'enterprise'
      },
      children: [
        {
          name: 'companyName',
          type: 'input',
          label: '公司名称',
          placeholder: '请输入公司名称',
          rules: [{ required: true, message: '请输入公司名称' }]
        },
        {
          name: 'industry',
          type: 'select',
          label: '所属行业',
          placeholder: '请选择所属行业',
          options: [
            { label: 'IT/互联网', value: 'it' },
            { label: '金融', value: 'finance' },
            { label: '制造业', value: 'manufacturing' },
            { label: '教育', value: 'education' },
            { label: '医疗', value: 'medical' },
            { label: '其他', value: 'other' }
          ],
          rules: [{ required: true, message: '请选择所属行业' }]
        }
      ]
    },
    
    // 地区选择（联动示例）
    {
      name: 'region',
      type: 'select',
      label: '所在地区',
      placeholder: '请选择地区',
      options: [
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
        { label: '广州', value: 'guangzhou' },
        { label: '深圳', value: 'shenzhen' }
      ],
      rules: [{ required: true, message: '请选择所在地区' }]
    },
    
    {
      name: 'area',
      type: 'select',
      label: '具体区域',
      placeholder: '请先选择地区',
      linkage: {
        dependsOn: 'region',
        optionsMap: {
          beijing: [
            { label: '朝阳区', value: 'chaoyang' },
            { label: '海淀区', value: 'haidian' },
            { label: '西城区', value: 'xicheng' },
            { label: '东城区', value: 'dongcheng' }
          ],
          shanghai: [
            { label: '浦东新区', value: 'pudong' },
            { label: '黄浦区', value: 'huangpu' },
            { label: '静安区', value: 'jingan' },
            { label: '徐汇区', value: 'xuhui' }
          ],
          guangzhou: [
            { label: '天河区', value: 'tianhe' },
            { label: '越秀区', value: 'yuexiu' },
            { label: '海珠区', value: 'haizhu' }
          ],
          shenzhen: [
            { label: '南山区', value: 'nanshan' },
            { label: '福田区', value: 'futian' },
            { label: '罗湖区', value: 'luohu' }
          ]
        }
      },
      rules: [{ required: true, message: '请选择具体区域' }]
    }
  ]
}

// 事件处理
const handleSubmit = (data: any) => {
  console.log('表单提交:', data)
  submitResult.value = true
  
  // 模拟API调用
  setTimeout(() => {
    alert('注册成功！')
    submitResult.value = false
  }, 1000)
}

const handleFormChange = (data: any) => {
  console.log('表单变化:', data)
}

const handleValidate = (isValid: boolean, errors: Record<string, string>) => {
  console.log('表单验证:', { isValid, errors })
}
</script>

<style scoped>
.registration-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.submit-result {
  margin-top: 20px;
  padding: 15px;
  background: #f0f0f0;
  border-radius: 4px;
}

.submit-result pre {
  background: white;
  padding: 10px;
  border-radius: 4px;
  overflow: auto;
}
</style>
```

### 在App.vue中使用

```vue
<!-- src/App.vue -->
<template>
  <div id="app">
    <UserRegistrationForm />
  </div>
</template>

<script setup lang="ts">
import UserRegistrationForm from './components/UserRegistrationForm.vue'
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding: 20px;
}
</style>
```

## 高级用法

### 1. 按需导入

```typescript
// 只导入需要的组件
import { SimpleForm, SimpleFormItem, useSimpleForm } from '@chl1860/dynamic-form-vue3'

export default {
  components: {
    SimpleForm,
    SimpleFormItem
  },
  setup() {
    const { formData, validateForm, resetForm } = useSimpleForm()
    
    return {
      formData,
      validateForm,
      resetForm
    }
  }
}
```

### 2. 自定义组件注册

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import DynamicForm from '@chl1860/dynamic-form-vue3'
import CustomDateRange from './components/CustomDateRange.vue'

const app = createApp(App)

app.use(DynamicForm, {
  customComponents: {
    'date-range': CustomDateRange
  }
})

app.mount('#app')
```

### 3. 高级状态管理模式

组件内置轻量级状态管理，也可以扩展为更复杂的状态管理模式：

```typescript
// 使用 Composables 进行状态管理
import { ref, reactive, watch, readonly, computed } from 'vue'
import type { SimpleFormSchema } from '@chl1860/dynamic-form-vue3'

export function useFormStore() {
  const currentFormData = ref({})
  const formHistory = reactive<any[]>([])
  const undoStack = reactive<any[]>([])
  
  // 监听表单数据变化，自动保存历史
  watch(
    () => currentFormData.value,
    (newData, oldData) => {
      if (oldData && Object.keys(oldData).length > 0) {
        formHistory.push({ ...oldData, timestamp: Date.now() })
      }
    },
    { deep: true }
  )
  
  const updateFormData = (data: any) => {
    currentFormData.value = data
  }
  
  const undoLastChange = () => {
    if (formHistory.length > 0) {
      const lastData = formHistory.pop()
      if (lastData) {
        undoStack.push({ ...currentFormData.value })
        currentFormData.value = lastData
      }
    }
  }
  
  const redoLastUndo = () => {
    if (undoStack.length > 0) {
      const redoData = undoStack.pop()
      if (redoData) {
        formHistory.push({ ...currentFormData.value })
        currentFormData.value = redoData
      }
    }
  }
  
  return {
    currentFormData,
    formHistory: readonly(formHistory),
    updateFormData,
    undoLastChange,
    redoLastUndo,
    canUndo: computed(() => formHistory.length > 0),
    canRedo: computed(() => undoStack.length > 0)
  }
}
```

## 运行示例

1. 将上述代码保存到对应文件
2. 运行 `npm run dev`
3. 打开浏览器访问开发服务器地址
4. 测试表单功能：
   - 输入验证
   - 字段联动
   - 条件显示
   - 表单提交

这个示例展示了动态表单组件的核心功能，包括字段联动、条件显示、验证规则等。您可以基于这个示例进一步定制自己的表单。
