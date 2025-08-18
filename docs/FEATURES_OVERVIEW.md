# 🚀 Dynamic Form 功能特性概览

## 📋 功能列表

### 🔗 字段联动
- **条件显示** - 根据其他字段值动态显示/隐藏字段
- **选项联动** - 根据选择值动态更新选项列表
- **自动重置** - 依赖字段变化时自动重置被依赖字段
- **异步联动** - 从远程API动态加载选项数据

### 🎨 自定义组件
- **全局注册** - 通过插件选项注册自定义组件
- **手动注册** - 使用组件注册器注册
- **内联使用** - 直接在字段配置中使用组件
- **完整支持** - 自定义组件支持所有联动和验证功能

### ⚡ 异步功能
- **异步初始化** - 表单初始化时从远程加载数据
- **异步联动** - 字段变化时异步加载相关选项
- **异步验证** - 支持远程验证规则
- **状态管理** - 提供异步操作状态查询

### 📝 表单验证
- **同步验证** - 支持自定义验证器函数
- **异步验证** - 支持远程验证规则
- **多种规则** - 必填、格式、自定义等验证规则
- **错误处理** - 友好的错误提示和状态管理

## 🎯 使用场景

### 1. 用户注册表单
```typescript
// 用户类型选择影响后续字段显示
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
  linkage: {
    dependsOn: 'userType',
    visibleWhen: (value, formData) => formData.userType === 'personal'
  }
}
```

### 2. 地区选择联动
```typescript
// 国家选择影响省份选项
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

### 3. 异步数据加载
```typescript
// 从远程API加载城市选项
{
  name: 'city',
  type: 'select',
  label: '城市',
  linkage: {
    dependsOn: 'province',
    asyncOptionsLoader: async (province) => {
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

### 4. 自定义评分组件
```typescript
// 使用自定义评分组件
{
  name: 'rating',
  type: 'rating', // 注册的自定义类型
  label: '评分',
  componentProps: {
    maxStars: 5,
    showLabel: true
  }
}
```

### 5. 异步验证
```typescript
// 检查用户名是否已存在
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

## 🔧 配置选项

### 字段配置 (SimpleFieldConfig)
```typescript
interface SimpleFieldConfig {
  name: string                    // 字段名
  type: string                    // 字段类型
  label: string                   // 显示标签
  placeholder?: string            // 占位符
  required?: boolean              // 是否必填
  options?: SelectOption[]        // 选项列表
  props?: Record<string, any>     // 组件属性
  rules?: ValidationRule[]        // 验证规则
  linkage?: FieldLinkage          // 联动配置
  component?: any                 // 自定义组件
  componentProps?: Record<string, any> // 自定义组件属性
}
```

### 联动配置 (FieldLinkage)
```typescript
interface FieldLinkage {
  dependsOn: string                                    // 依赖字段
  optionsMap?: Record<string, SelectOption[]>          // 选项映射
  asyncOptionsLoader?: (value: any, formData: any) => Promise<SelectOption[]> // 异步加载器
  visibleWhen?: (value: any, formData: any) => boolean // 显示条件
  disabledWhen?: (value: any, formData: any) => boolean // 禁用条件
  resetOnChange?: boolean                              // 是否自动重置
}
```

### 验证规则 (ValidationRule)
```typescript
interface ValidationRule {
  required?: boolean                                    // 是否必填
  message?: string                                      // 错误消息
  validator?: (value: any, formData: any) => boolean | string // 同步验证器
  asyncValidator?: (value: any, formData: any) => Promise<boolean | string> // 异步验证器
}
```

## 📊 性能优化建议

### 1. 选项数据优化
- 使用 `optionsMap` 处理静态选项数据
- 避免在 `asyncOptionsLoader` 中处理静态数据
- 合理使用选项缓存机制

### 2. 联动性能优化
- 避免在 `visibleWhen` 和 `disabledWhen` 中执行复杂计算
- 合理使用 `resetOnChange` 避免不必要的数据重置
- 使用 `optionsMap` 而不是 `asyncOptionsLoader` 处理静态选项

### 3. 验证性能优化
- 避免在验证器中执行复杂计算
- 合理使用异步验证，避免频繁的远程请求
- 使用防抖机制处理实时验证

## 🛠️ 最佳实践

### 1. 字段命名
- 使用有意义的字段名
- 遵循一致的命名规范
- 避免使用特殊字符

### 2. 联动设计
- 合理设计联动关系，避免循环依赖
- 使用清晰的依赖字段名
- 提供合理的默认值

### 3. 错误处理
- 为异步操作添加适当的错误处理
- 提供用户友好的错误提示
- 使用 `getAsyncState` 检查异步状态

### 4. 用户体验
- 为必填字段添加清晰的标识
- 提供有意义的占位符文本
- 使用适当的字段类型和验证规则

## 📚 相关文档

- [详细使用指南](./USAGE_GUIDE.md) - 完整的使用说明和示例
- [API 参考](./API_REFERENCE.md) - 完整的类型定义和接口说明

---

**版本**: 2.0.0  
**最后更新**: 2025年1月 