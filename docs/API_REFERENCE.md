# 📚 Dynamic Form API 参考

## 🎯 概述

本文档提供 Dynamic Form 组件的完整 API 参考，包括类型定义、组件属性、事件等。

## 📋 类型定义

### SimpleFormSchema
表单配置的主接口

```typescript
interface SimpleFormSchema {
  fields: SimpleFieldConfig[]                    // 字段配置数组
  asyncInitializer?: () => Promise<any>          // 异步数据初始化器
}
```

### SimpleFieldConfig
字段配置接口

```typescript
interface SimpleFieldConfig {
  name: string                                   // 字段名（必需）
  type: string                                   // 字段类型（必需）
  label: string                                  // 显示标签（必需）
  placeholder?: string                           // 占位符文本
  required?: boolean                             // 是否必填
  options?: SelectOption[]                       // 选项列表（用于 select、radio、checkbox）
  props?: Record<string, any>                    // 传递给组件的属性
  rules?: ValidationRule[]                       // 验证规则数组
  linkage?: FieldLinkage                         // 联动配置
  component?: any                                // 自定义组件
  componentProps?: Record<string, any>           // 传递给自定义组件的属性
}
```

### SelectOption
选项配置接口

```typescript
interface SelectOption {
  label: string                                  // 显示文本
  value: any                                     // 选项值
  disabled?: boolean                             // 是否禁用
}
```

### FieldLinkage
字段联动配置接口

```typescript
interface FieldLinkage {
  dependsOn: string                              // 依赖的字段名
  optionsMap?: Record<string, SelectOption[]>    // 值到选项的映射
  asyncOptionsLoader?: (value: any, formData: any) => Promise<SelectOption[]> // 异步选项加载器
  visibleWhen?: (value: any, formData: any) => boolean // 显示条件函数
  disabledWhen?: (value: any, formData: any) => boolean // 禁用条件函数
  resetOnChange?: boolean                        // 是否在依赖字段变化时重置（默认 true）
}
```

### ValidationRule
验证规则接口

```typescript
interface ValidationRule {
  required?: boolean                             // 是否必填
  message?: string                               // 错误消息
  validator?: (value: any, formData: any) => boolean | string // 同步验证器
  asyncValidator?: (value: any, formData: any) => Promise<boolean | string> // 异步验证器
}
```

### FormGroup
分组字段配置接口

```typescript
interface FormGroup extends SimpleFieldConfig {
  type: 'group'                                  // 固定为 'group'
  children: SimpleFieldConfig[]                  // 子字段配置
  layout?: 'vertical' | 'horizontal'             // 布局方式
  bordered?: boolean                             // 是否显示边框
}
```

### AsyncState
异步状态接口

```typescript
interface AsyncState {
  loading: boolean                               // 是否正在加载
  error?: string                                 // 错误信息
}
```

### AsyncResult
异步操作结果接口

```typescript
interface AsyncResult<T = any> {
  success: boolean                               // 是否成功
  data?: T                                       // 返回数据
  error?: string                                 // 错误信息
}
```

## 🎛️ 组件属性

### SimpleForm 组件属性

| 属性 | 类型 | 默认值 | 必需 | 说明 |
|------|------|--------|------|------|
| `v-model` | `any` | - | ✅ | 表单数据，支持双向绑定 |
| `schema` | `SimpleFormSchema` | - | ✅ | 表单配置对象 |
| `disabled` | `boolean` | `false` | ❌ | 是否禁用整个表单 |
| `loading` | `boolean` | `false` | ❌ | 是否显示加载状态 |
| `layout` | `'vertical' \| 'horizontal'` | `'vertical'` | ❌ | 表单布局方式 |
| `labelWidth` | `string \| number` | - | ❌ | 标签宽度 |
| `labelPosition` | `'left' \| 'top'` | `'left'` | ❌ | 标签位置 |

### SimpleFormItem 组件属性

| 属性 | 类型 | 默认值 | 必需 | 说明 |
|------|------|--------|------|------|
| `field` | `SimpleFieldConfig` | - | ✅ | 字段配置 |
| `value` | `any` | - | ❌ | 字段值 |
| `disabled` | `boolean` | `false` | ❌ | 是否禁用字段 |
| `formData` | `any` | - | ❌ | 整个表单的数据 |

## 📡 事件

### SimpleForm 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `submit` | `(data: any) => void` | 表单提交事件 |
| `change` | `(data: any, field: string) => void` | 字段值变化事件 |
| `validate` | `(valid: boolean, errors: any[]) => void` | 验证事件 |

### SimpleFormItem 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `update:value` | `(value: any) => void` | 字段值更新事件 |
| `blur` | `() => void` | 字段失焦事件 |
| `focus` | `() => void` | 字段聚焦事件 |

## 🔧 方法

### SimpleForm 实例方法

| 方法名 | 参数 | 返回值 | 说明 |
|--------|------|--------|------|
| `validate` | - | `Promise<boolean>` | 验证整个表单 |
| `resetFields` | - | `void` | 重置所有字段 |
| `clearValidate` | `field?: string` | `void` | 清除验证错误 |
| `getAsyncState` | `key: string` | `AsyncState` | 获取异步操作状态 |
| `setFieldValue` | `field: string, value: any` | `void` | 设置字段值 |
| `getFieldValue` | `field: string` | `any` | 获取字段值 |

## 🎨 自定义组件接口

### 自定义组件 Props 接口

```typescript
interface CustomComponentProps {
  value?: any                    // 字段值
  field: SimpleFieldConfig       // 字段配置
  disabled?: boolean            // 是否禁用
  formData?: any                // 整个表单的数据
  [key: string]: any            // 其他自定义属性
}
```

### 自定义组件 Emits 接口

```typescript
interface CustomComponentEmits {
  (e: 'update:value', value: any): void  // 值更新事件（必需）
  (e: 'blur'): void                      // 失焦事件（可选）
  (e: 'focus'): void                     // 聚焦事件（可选）
}
```

## 📝 字段类型参考

### 支持的字段类型

| 类型 | 说明 | 特殊属性 |
|------|------|----------|
| `input` | 输入框 | `props.type` (text, password, email 等) |
| `textarea` | 文本域 | `props.rows`, `props.maxLength` |
| `number` | 数字输入框 | `props.min`, `props.max`, `props.step` |
| `select` | 选择器 | `options` (必需) |
| `radio` | 单选框 | `options` (必需) |
| `checkbox` | 复选框 | `options` (必需) |
| `switch` | 开关 | - |
| `date` | 日期选择器 | `props.format`, `props.placeholder` |
| `group` | 分组字段 | `children` (必需), `layout`, `bordered` |

### 字段类型特殊属性

#### input 类型
```typescript
{
  name: 'username',
  type: 'input',
  label: '用户名',
  props: {
    type: 'text',              // 输入框类型
    maxLength: 20,             // 最大长度
    showCount: true,           // 显示字符计数
    placeholder: '请输入用户名'
  }
}
```

#### textarea 类型
```typescript
{
  name: 'description',
  type: 'textarea',
  label: '描述',
  props: {
    rows: 4,                   // 行数
    maxLength: 500,            // 最大长度
    showCount: true,           // 显示字符计数
    placeholder: '请输入描述'
  }
}
```

#### number 类型
```typescript
{
  name: 'age',
  type: 'number',
  label: '年龄',
  props: {
    min: 0,                    // 最小值
    max: 120,                  // 最大值
    step: 1,                   // 步长
    precision: 0,              // 精度
    placeholder: '请输入年龄'
  }
}
```

#### select 类型
```typescript
{
  name: 'city',
  type: 'select',
  label: '城市',
  options: [                   // 选项列表（必需）
    { label: '北京', value: 'beijing' },
    { label: '上海', value: 'shanghai' }
  ],
  props: {
    placeholder: '请选择城市',
    multiple: false,           // 是否多选
    clearable: true            // 是否可清空
  }
}
```

## 🔗 联动配置示例

### 条件显示
```typescript
{
  name: 'personalName',
  type: 'input',
  label: '个人姓名',
  linkage: {
    dependsOn: 'userType',
    visibleWhen: (value, formData) => formData.userType === 'personal'
  }
}
```

### 选项联动
```typescript
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

### 异步选项联动
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
      return cities.map(city => ({
        label: city.name,
        value: city.code
      }))
    }
  }
}
```

## 📝 验证规则示例

### 基础验证
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

### 自定义验证
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
        return true
      }
    }
  ]
}
```

### 异步验证
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

## 🎨 自定义组件示例

### 评分组件
```vue
<template>
  <div class="rating-field">
    <label>{{ field.label }}</label>
    <div class="stars">
      <span
        v-for="star in 5"
        :key="star"
        :class="['star', { active: star <= value }]"
        @click="handleClick(star)"
      >
        ⭐
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const handleClick = (star: number) => {
  if (!props.disabled) {
    emit('update:value', star)
  }
}
</script>
```

## 📚 相关文档

- [详细使用指南](./USAGE_GUIDE.md) - 完整的使用说明和示例
- [功能特性概览](./FEATURES_OVERVIEW.md) - 功能列表和使用场景

---

**版本**: 2.0.0  
**最后更新**: 2025年1月 