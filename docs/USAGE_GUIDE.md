# 📖 Dynamic Form 使用指南

## 🎯 概述

Dynamic Form 是一个基于 Vue 3 的声明式动态表单组件，支持字段联动、自定义组件、异步数据加载等高级功能。通过简单的配置即可创建复杂的表单。

## 🚀 快速开始

### 1. 安装和引入

```bash
npm install dynamic-form
```

```typescript
import { createApp } from 'vue'
import { install as DynamicFormInstall } from 'dynamic-form'
import App from './App.vue'

const app = createApp(App)
app.use(DynamicFormInstall)
app.mount('#app')
```

### 2. 基础使用

```vue
<template>
  <div>
    <SimpleForm
      v-model="formData"
      :schema="schema"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { SimpleFormSchema } from 'dynamic-form'

const formData = ref({})

const schema: SimpleFormSchema = {
  fields: [
    {
      name: 'username',
      type: 'input',
      label: '用户名',
      placeholder: '请输入用户名',
      rules: [{ required: true, message: '请输入用户名' }]
    },
    {
      name: 'email',
      type: 'input',
      label: '邮箱',
      placeholder: '请输入邮箱',
      rules: [
        { required: true, message: '请输入邮箱' },
        { 
          validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
          message: '请输入有效的邮箱地址'
        }
      ]
    }
  ]
}

const handleSubmit = (data: any) => {
  console.log('表单数据:', data)
}
</script>
```

## 📋 字段类型详解

### 基础字段类型

#### 1. 输入框 (input)
```typescript
{
  name: 'username',
  type: 'input',
  label: '用户名',
  placeholder: '请输入用户名',
  props: {
    maxLength: 20,
    showCount: true
  }
}
```

#### 2. 文本域 (textarea)
```typescript
{
  name: 'description',
  type: 'textarea',
  label: '描述',
  placeholder: '请输入描述',
  props: {
    rows: 4,
    maxLength: 500,
    showCount: true
  }
}
```

#### 3. 数字输入框 (number)
```typescript
{
  name: 'age',
  type: 'number',
  label: '年龄',
  placeholder: '请输入年龄',
  props: {
    min: 0,
    max: 120,
    step: 1,
    precision: 0
  }
}
```

#### 4. 选择器 (select)
```typescript
{
  name: 'city',
  type: 'select',
  label: '城市',
  placeholder: '请选择城市',
  options: [
    { label: '北京', value: 'beijing' },
    { label: '上海', value: 'shanghai' },
    { label: '广州', value: 'guangzhou' }
  ]
}
```

#### 5. 单选框 (radio)
```typescript
{
  name: 'gender',
  type: 'radio',
  label: '性别',
  options: [
    { label: '男', value: 'male' },
    { label: '女', value: 'female' }
  ]
}
```

#### 6. 复选框 (checkbox)
```typescript
{
  name: 'hobbies',
  type: 'checkbox',
  label: '兴趣爱好',
  options: [
    { label: '阅读', value: 'reading' },
    { label: '运动', value: 'sports' },
    { label: '音乐', value: 'music' }
  ]
}
```

#### 7. 开关 (switch)
```typescript
{
  name: 'notification',
  type: 'switch',
  label: '接收通知'
}
```

#### 8. 日期选择器 (date)
```typescript
{
  name: 'birthday',
  type: 'date',
  label: '生日',
  props: {
    format: 'YYYY-MM-DD',
    placeholder: '请选择生日'
  }
}
```

### 高级字段类型

#### 9. 分组字段 (group)
```typescript
{
  name: 'basicInfo',
  type: 'group',
  label: '基本信息',
  bordered: true,
  layout: 'vertical',
  children: [
    {
      name: 'firstName',
      type: 'input',
      label: '姓',
      placeholder: '请输入姓'
    },
    {
      name: 'lastName',
      type: 'input',
      label: '名',
      placeholder: '请输入名'
    }
  ]
}
```

## 🧱 布局配置

### 内联布局（inline）

内联布局用于将多个字段与操作按钮放在一行内，适合登录、搜索等紧凑场景。该布局下，标签与控件默认同行展示并垂直居中，操作按钮也会自动与字段同行展示。

 
```vue
<template>
  <SimpleForm :schema="schema" v-model="formData" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { SimpleFormSchema } from 'dynamic-form'

const formData = ref({})

const schema: SimpleFormSchema = {
  layout: {
    type: 'inline',
    gutter: 8 // 控制同一行项目之间的水平间距，默认紧凑
  },
  fields: [
    {
      name: 'username',
      type: 'input',
      label: '用户名',
      placeholder: '请输入用户名',
      rules: [{ required: true, message: '请输入用户名' }]
    },
    {
      name: 'password',
      type: 'input',
      label: '密码',
      placeholder: '请输入密码',
      props: { type: 'password' },
      rules: [{ required: true, message: '请输入密码' }]
    },
    {
      name: 'remember',
      type: 'checkbox',
      label: '', // 无标签时也会预留标签占位以保证对齐
      props: { label: '记住我' }
    }
  ]
}
</script>
```

- 内联布局特点：
  - 标签与控件同行显示、垂直居中对齐；按钮默认与字段同行显示。
  - `layout.gutter` 数值控制项目间距；也支持数组，但内联布局仅使用第一项作为水平间距。
  - 小屏幕下（≤576px）会自动改为上下堆叠，提升可读性。

- 对齐与宽度：
  - 默认标签宽度为 72px、控件宽度为 200px，保证多项整齐对齐。
  - 可通过样式覆盖进行自定义，例如：

    ```css
    /* 调整标签与控件宽度 */
    .my-form :deep(.simple-form-item-inline .simple-form-item-label) { width: 96px; }
    .my-form :deep(.simple-form-item-inline .simple-form-item-control .ant-input) { width: 240px; }
    .my-form :deep(.simple-form-item-inline .simple-form-item-control .ant-select) { min-width: 240px; }

    /* 按钮若需换行，可强制换到下一行 */
    .my-form :deep(.simple-form-inline .inline-actions) { flex-basis: 100%; }
    ```

- 典型用例：登录表单、搜索工具条、筛选面板顶部简表单等。

## 🔗 字段联动功能

### 1. 条件显示

根据其他字段的值动态显示/隐藏字段：

```typescript
{
  name: 'userType',
  type: 'radio',
  label: '用户类型',
  options: [
    { label: '个人用户', value: 'personal' },
    { label: '企业用户', value: 'enterprise' }
  ]
},
{
  name: 'personalName',
  type: 'input',
  label: '个人姓名',
  placeholder: '请输入姓名',
  linkage: {
    dependsOn: 'userType',
    visibleWhen: (value, formData) => formData.userType === 'personal'
  }
},
{
  name: 'companyName',
  type: 'input',
  label: '公司名称',
  placeholder: '请输入公司名称',
  linkage: {
    dependsOn: 'userType',
    visibleWhen: (value, formData) => formData.userType === 'enterprise'
  }
}
```

### 2. 选项联动

根据选择的值动态更新选项列表：

```typescript
{
  name: 'country',
  type: 'select',
  label: '国家',
  options: [
    { label: '中国', value: 'china' },
    { label: '美国', value: 'usa' }
  ]
},
{
  name: 'province',
  type: 'select',
  label: '省份',
  linkage: {
    dependsOn: 'country',
    optionsMap: {
      'china': [
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' }
      ],
      'usa': [
        { label: '加利福尼亚', value: 'california' },
        { label: '纽约', value: 'newyork' }
      ]
    }
  }
}
```

### 3. 异步选项联动

从远程API动态加载选项：

```typescript
{
  name: 'city',
  type: 'select',
  label: '城市',
  linkage: {
    dependsOn: 'province',
    asyncOptionsLoader: async (province, formData) => {
      const response = await fetch(`/api/cities?province=${province}`)
      const cities = await response.json()
      return cities.map((city: any) => ({
        label: city.name,
        value: city.code
      }))
    }
  }
}
```

### 4. 自动重置功能

当依赖字段变化时，自动重置被依赖字段的值：

```typescript
{
  name: 'region',
  type: 'select',
  label: '地区',
  options: [
    { label: '华东', value: 'east' },
    { label: '华南', value: 'south' }
  ]
},
{
  name: 'area',
  type: 'select',
  label: '区域',
  linkage: {
    dependsOn: 'region',
    optionsMap: {
      'east': [
        { label: '上海', value: 'shanghai' },
        { label: '江苏', value: 'jiangsu' }
      ],
      'south': [
        { label: '广东', value: 'guangdong' },
        { label: '福建', value: 'fujian' }
      ]
    },
    resetOnChange: true // 默认值，可以省略
  }
}
```

禁用自动重置：
```typescript
{
  name: 'brand',
  type: 'input',
  label: '品牌名称',
  linkage: {
    dependsOn: 'product',
    visibleWhen: (value, formData) => !!formData.product,
    resetOnChange: false // 禁用重置功能
  }
}
```

## 🎨 自定义组件

### 1. 创建自定义组件

```vue
<!-- CustomRatingField.vue -->
<template>
  <div class="custom-rating-field">
    <label>{{ field.label }}</label>
    <div class="rating-stars">
      <span
        v-for="star in 5"
        :key="star"
        :class="['star', { active: star <= value }]"
        @click="handleStarClick(star)"
      >
        ⭐
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SimpleFieldConfig } from 'dynamic-form'

interface Props {
  value?: number
  field: SimpleFieldConfig
  disabled?: boolean
}

interface Emits {
  (e: 'update:value', value: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleStarClick = (star: number) => {
  if (!props.disabled) {
    emit('update:value', star)
  }
}
</script>

<style scoped>
.rating-stars {
  display: flex;
  gap: 4px;
}

.star {
  cursor: pointer;
  opacity: 0.3;
  transition: opacity 0.2s;
}

.star.active {
  opacity: 1;
}
</style>
```

### 2. 注册自定义组件

#### 全局注册
```typescript
import { createApp } from 'vue'
import { install as DynamicFormInstall } from 'dynamic-form'
import CustomRatingField from './components/CustomRatingField.vue'

const app = createApp({})

app.use(DynamicFormInstall, {
  customComponents: {
    'rating': CustomRatingField
  }
})
```

#### 手动注册
```typescript
import { globalComponentRegistry } from 'dynamic-form'
import CustomRatingField from './components/CustomRatingField.vue'

globalComponentRegistry.register('rating', CustomRatingField)
```

### 3. 使用自定义组件

```typescript
{
  name: 'rating',
  type: 'rating', // 使用注册的类型名
  label: '评分',
  componentProps: {
    // 传递给自定义组件的额外属性
    showLabel: true
  }
}
```

## ⚡ 异步功能

### 1. 异步数据初始化

表单初始化时从远程API加载数据：

```typescript
const schema: SimpleFormSchema = {
  asyncInitializer: async () => {
    const response = await fetch('/api/user-profile')
    const data = await response.json()
    return data
  },
  fields: [
    {
      name: 'username',
      type: 'input',
      label: '用户名'
    },
    {
      name: 'email',
      type: 'input',
      label: '邮箱'
    }
  ]
}
```

### 2. 异步验证

```typescript
{
  name: 'username',
  type: 'input',
  label: '用户名',
  rules: [
    { required: true, message: '请输入用户名' },
    {
      asyncValidator: async (value) => {
        const response = await fetch(`/api/check-username?username=${value}`)
        const { available } = await response.json()
        return available || '用户名已存在'
      }
    }
  ]
}
```

### 3. 获取异步状态

```typescript
// 获取初始化状态
const initState = formRef.value?.getAsyncState('__init__')
console.log(initState.loading) // 是否正在加载
console.log(initState.error)   // 错误信息

// 获取联动加载状态
const loadingState = formRef.value?.getAsyncState(`city_${provinceValue}`)
console.log(loadingState.loading) // 是否正在加载选项
```

## 📝 表单验证

### 1. 基础验证规则

```typescript
{
  name: 'email',
  type: 'input',
  label: '邮箱',
  rules: [
    { required: true, message: '请输入邮箱' },
    { 
      validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: '请输入有效的邮箱地址'
    }
  ]
}
```

### 2. 自定义验证器

```typescript
{
  name: 'password',
  type: 'input',
  label: '密码',
  props: { type: 'password' },
  rules: [
    { required: true, message: '请输入密码' },
    {
      validator: (value) => {
        if (value.length < 8) {
          return '密码长度至少8位'
        }
        if (!/[A-Z]/.test(value)) {
          return '密码必须包含大写字母'
        }
        if (!/[a-z]/.test(value)) {
          return '密码必须包含小写字母'
        }
        if (!/\d/.test(value)) {
          return '密码必须包含数字'
        }
        return true
      }
    }
  ]
}
```

### 3. 异步验证

```typescript
{
  name: 'email',
  type: 'input',
  label: '邮箱',
  rules: [
    { required: true, message: '请输入邮箱' },
    {
      asyncValidator: async (value) => {
        const response = await fetch(`/api/check-email?email=${value}`)
        const { available } = await response.json()
        return available || '邮箱已被注册'
      }
    }
  ]
}
```

## 🎛️ 组件属性

### SimpleForm 组件属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `v-model` | `any` | - | 表单数据 |
| `schema` | `SimpleFormSchema` | - | 表单配置 |
| `disabled` | `boolean` | `false` | 是否禁用整个表单 |
| `loading` | `boolean` | `false` | 是否显示加载状态 |
| `layout` | `'vertical' \| 'horizontal'` | `'vertical'` | 表单布局 |
| `labelWidth` | `string \| number` | - | 标签宽度 |
| `labelPosition` | `'left' \| 'top'` | `'left'` | 标签位置 |

### 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `submit` | `(data: any) => void` | 表单提交事件 |
| `change` | `(data: any, field: string) => void` | 字段值变化事件 |
| `validate` | `(valid: boolean, errors: any[]) => void` | 验证事件 |

## 📚 完整示例

### 用户注册表单

```vue
<template>
  <div class="user-registration">
    <h2>用户注册</h2>
    <SimpleForm
      v-model="formData"
      :schema="schema"
      @submit="handleSubmit"
      @change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { SimpleFormSchema } from 'dynamic-form'

const formData = ref({})

const schema: SimpleFormSchema = {
  fields: [
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
            { required: true, message: '请输入用户名' },
            { 
              validator: (value) => value.length >= 3,
              message: '用户名至少3个字符'
            }
          ]
        },
        {
          name: 'email',
          type: 'input',
          label: '邮箱',
          placeholder: '请输入邮箱',
          rules: [
            { required: true, message: '请输入邮箱' },
            {
              validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
              message: '请输入有效的邮箱地址'
            }
          ]
        },
        {
          name: 'password',
          type: 'input',
          label: '密码',
          placeholder: '请输入密码',
          props: { type: 'password' },
          rules: [
            { required: true, message: '请输入密码' },
            {
              validator: (value) => value.length >= 8,
              message: '密码至少8个字符'
            }
          ]
        }
      ]
    },
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
    {
      name: 'personalName',
      type: 'input',
      label: '个人姓名',
      placeholder: '请输入姓名',
      linkage: {
        dependsOn: 'userType',
        visibleWhen: (value, formData) => formData.userType === 'personal'
      }
    },
    {
      name: 'companyName',
      type: 'input',
      label: '公司名称',
      placeholder: '请输入公司名称',
      linkage: {
        dependsOn: 'userType',
        visibleWhen: (value, formData) => formData.userType === 'enterprise'
      }
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
      label: '省份',
      placeholder: '请选择省份',
      linkage: {
        dependsOn: 'country',
        optionsMap: {
          'china': [
            { label: '北京', value: 'beijing' },
            { label: '上海', value: 'shanghai' }
          ],
          'usa': [
            { label: '加利福尼亚', value: 'california' },
            { label: '纽约', value: 'newyork' }
          ]
        }
      }
    }
  ]
}

const handleSubmit = (data: any) => {
  console.log('提交数据:', data)
  // 处理表单提交
}

const handleChange = (data: any, field: string) => {
  console.log(`字段 ${field} 变化:`, data)
}
</script>
```

## 🛠️ 最佳实践

### 1. 性能优化

- 使用 `optionsMap` 而不是 `asyncOptionsLoader` 处理静态选项
- 合理使用 `resetOnChange` 避免不必要的数据重置
- 避免在 `visibleWhen` 和 `disabledWhen` 中执行复杂计算

### 2. 错误处理

- 为异步操作添加适当的错误处理
- 使用 `getAsyncState` 检查异步操作状态
- 提供用户友好的错误提示

### 3. 代码组织

- 将复杂的表单配置拆分为多个小配置
- 使用 TypeScript 类型定义确保类型安全
- 将自定义组件放在独立的文件中

### 4. 用户体验

- 为必填字段添加清晰的标识
- 提供有意义的占位符文本
- 使用适当的字段类型和验证规则

## 🔧 故障排除

### 常见问题

1. **联动不生效**
   - 检查 `dependsOn` 字段名是否正确
   - 确认依赖字段的值变化是否触发联动

2. **自定义组件不显示**
   - 确认组件已正确注册
   - 检查组件是否遵循接口规范

3. **异步数据加载失败**
   - 检查网络连接和API端点
   - 查看浏览器控制台的错误信息

4. **验证规则不生效**
   - 确认验证器函数返回正确的值
   - 检查异步验证器的Promise处理

## 📞 获取帮助

如果您在使用过程中遇到问题：

1. 查看本文档的相关章节
2. 运行测试文件验证功能
3. 检查浏览器控制台的错误信息
4. 提交 Issue 描述问题

---

**版本**: 2.0.0  
**最后更新**: 2025年1月  
**维护者**: Dynamic Form 开发团队 