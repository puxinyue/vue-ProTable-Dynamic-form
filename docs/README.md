# 📚 Dynamic Form 文档中心

欢迎来到 Dynamic Form 组件的文档中心！

## 🎯 快速导航

### 📖 使用指南
- **[📖 详细使用指南](./USAGE_GUIDE.md)** - 完整的使用说明和示例（推荐先阅读）
- **[🚀 功能特性概览](./FEATURES_OVERVIEW.md)** - 功能列表和使用场景
- **[📚 API 参考](./API_REFERENCE.md)** - 完整的类型定义和接口说明

## 🚀 快速开始

### 1. 安装
```bash
npm install dynamic-form
```

### 2. 基础使用
```vue
<template>
  <SimpleForm
    v-model="formData"
    :schema="schema"
    @submit="handleSubmit"
  />
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
      rules: [{ required: true, message: '请输入用户名' }]
    }
  ]
}

const handleSubmit = (data: any) => {
  console.log('表单数据:', data)
}
</script>
```

## ✨ 核心特性

- 🔗 **字段联动** - 支持条件显示、选项联动、自动重置
- 🎨 **自定义组件** - 支持注册和使用自定义表单组件
- ⚡ **异步功能** - 支持异步数据加载、异步验证
- 📝 **表单验证** - 支持同步和异步验证规则
- 🎛️ **灵活配置** - 通过配置对象定义表单结构
- 🚀 **TypeScript** - 完整的类型支持

## 📋 支持的字段类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `input` | 输入框 | 文本、密码、邮箱等 |
| `textarea` | 文本域 | 多行文本输入 |
| `number` | 数字输入框 | 年龄、价格等 |
| `select` | 选择器 | 下拉选择 |
| `radio` | 单选框 | 单选选项 |
| `checkbox` | 复选框 | 多选选项 |
| `switch` | 开关 | 布尔值选择 |
| `date` | 日期选择器 | 日期选择 |
| `group` | 分组字段 | 字段分组 |

## 🔗 相关链接

- [项目主页](../README.md) - 项目的主要说明文档
- [在线演示](http://localhost:3000) - 本地开发服务器
- [GitHub 仓库](https://github.com/your-repo/dynamic-form) - 源代码仓库

## 🆘 获取帮助

如果您在使用过程中遇到问题：

1. **首先查看** [详细使用指南](./USAGE_GUIDE.md)
2. 查看 [功能特性概览](./FEATURES_OVERVIEW.md)
3. 参考 [API 参考](./API_REFERENCE.md)
4. 提交 Issue 描述问题

---

**最后更新**: 2025年1月  
**版本**: 2.0.0  
**维护者**: Dynamic Form 开发团队 