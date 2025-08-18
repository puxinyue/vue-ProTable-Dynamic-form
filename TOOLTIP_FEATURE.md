# 💡 表单项提示功能

## 功能概述

为 Dynamic Form 组件添加了完整的表单项提示功能，支持在字段标签右侧显示问号图标，鼠标悬停时通过 tooltip 展示提示信息。

## 功能特性

### 1. 简单文本提示
- 使用字符串直接配置提示内容
- 默认显示在标签上方
- 适合简单的说明文字

### 2. 高级配置提示
- 支持自定义提示位置（top/left/right/bottom等）
- 支持自定义提示框颜色
- 支持自定义样式类名和样式对象
- 适合复杂的提示需求

### 3. 交互体验
- 鼠标悬停显示提示
- 友好的用户交互
- 响应式设计，适配不同屏幕尺寸

## 实现细节

### 1. 类型定义更新

在 `src/types/form.ts` 中添加了提示配置类型：

```typescript
// 在 SimpleFieldConfig 和 FormGroup 接口中添加
tooltip?: string | {
  title: string
  placement?: 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom'
  color?: string
  overlayClassName?: string
  overlayStyle?: Record<string, any>
}
```

### 2. 组件实现

在 `src/components/SimpleFormItem.vue` 中：

1. **导入 QuestionCircleOutlined 图标**
2. **添加 tooltip 相关计算属性**
3. **在标签区域添加提示图标和 tooltip 组件**
4. **添加相应的 CSS 样式**

### 3. 样式设计

```css
/* 提示图标样式 */
.field-tooltip-icon {
  margin-left: 4px;
  color: #8c8c8c;
  font-size: 14px;
  cursor: help;
  transition: color 0.2s ease;
}

.field-tooltip-icon:hover {
  color: #1890ff;
}

.simple-form-item-label {
  display: flex;
  align-items: center;
  gap: 4px;
}
```

## 使用示例

### 1. 简单文本提示

```typescript
const schema: SimpleFormSchema = {
  fields: [
    {
      name: 'username',
      type: 'input',
      label: '用户名',
      tooltip: '用户名用于登录系统，建议使用字母、数字和下划线的组合',
      rules: [{ required: true, message: '用户名为必填项' }]
    }
  ]
}
```

### 2. 高级配置提示

```typescript
const schema: SimpleFormSchema = {
  fields: [
    {
      name: 'projectName',
      type: 'input',
      label: '项目名称',
      tooltip: {
        title: '项目名称将用于系统标识和显示，建议使用简洁明了的名称',
        placement: 'right',
        color: '#52c41a',
        overlayClassName: 'custom-tooltip-success'
      },
      rules: [{ required: true, message: '项目名称为必填项' }]
    }
  ]
}
```

### 3. 不同位置提示

```typescript
const schema: SimpleFormSchema = {
  fields: [
    {
      name: 'topTip',
      type: 'input',
      label: '顶部提示',
      tooltip: {
        title: '这是顶部提示，适合在空间有限时使用',
        placement: 'top'
      }
    },
    {
      name: 'rightTip',
      type: 'input',
      label: '右侧提示',
      tooltip: {
        title: '这是右侧提示，适合在标签右侧有足够空间时使用',
        placement: 'right'
      }
    }
  ]
}
```

## 示例页面

创建了完整的示例页面 `src/examples/TooltipExample.vue`，包含：

1. **简单提示示例** - 展示基本的文本提示功能
2. **高级提示示例** - 展示自定义配置的提示功能
3. **不同位置提示示例** - 展示各种位置的提示效果

## 更新内容

### 1. 类型定义
- ✅ 更新 `SimpleFieldConfig` 接口，添加 `tooltip` 属性
- ✅ 更新 `FormGroup` 接口，添加 `tooltip` 属性
- ✅ 修复类型兼容性问题

### 2. 组件实现
- ✅ 在 `SimpleFormItem.vue` 中添加提示功能
- ✅ 支持栅格布局和简单布局两种模式
- ✅ 添加相应的计算属性和样式

### 3. 文档更新
- ✅ 更新 README.md，添加提示功能说明
- ✅ 添加使用示例和 API 文档
- ✅ 创建专门的示例页面

### 4. 示例和测试
- ✅ 创建 `TooltipExample.vue` 示例页面
- ✅ 更新主应用，添加提示功能示例入口
- ✅ 创建测试文件验证功能

## 技术要点

### 1. 响应式设计
- 提示图标在不同布局模式下都能正确显示
- 支持栅格布局和简单布局

### 2. 类型安全
- 完整的 TypeScript 类型支持
- 支持字符串和对象两种配置方式

### 3. 用户体验
- 鼠标悬停显示提示
- 平滑的颜色过渡动画
- 友好的光标样式

### 4. 可扩展性
- 支持自定义样式类名
- 支持自定义样式对象
- 支持所有 Ant Design Vue Tooltip 的配置选项

## 兼容性

- ✅ Vue 3.4.0+
- ✅ Ant Design Vue 4.0.0+
- ✅ TypeScript 5.3.0+
- ✅ 支持所有现代浏览器

## 总结

提示功能的添加大大提升了 Dynamic Form 组件的用户体验，为用户提供了更好的表单填写指导。该功能设计简洁、使用方便、扩展性强，完全符合组件库的设计理念。

