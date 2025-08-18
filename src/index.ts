// 🎯 Dynamic Form - Vue 3 动态表单组件
// 基于 Vue 3 + TypeScript + 单一数据源设计

// 主要组件导出
export { default as SimpleForm } from './components/SimpleForm.vue'
export { default as SimpleFormItem } from './components/SimpleFormItem.vue'

// 字段组件导出
export { default as SimpleInput } from './components/fields/SimpleInput.vue'
export { default as SimpleSelect } from './components/fields/SimpleSelect.vue'
export { default as SimpleRadio } from './components/fields/SimpleRadio.vue'
export { default as SimpleGroup } from './components/fields/SimpleGroup.vue'

// 自定义字段组件示例导出
export { default as CustomRatingField } from './components/fields/CustomRatingField.vue'
export { default as CustomColorPicker } from './components/fields/CustomColorPicker.vue'

// Composables 导出
export { useSimpleForm } from './composables/useSimpleForm'

// 工具类导出
export { getByPath, setByPath, deleteByPath, hasPath, getAllPaths } from './utils/pathHelper'

// 组件注册系统导出
export { 
  globalComponentRegistry, 
  createComponentRegistry, 
  SimpleFormPlugin,
  type ComponentRegistry
} from './utils/componentRegistry'

// 类型导出
export type {
  SimpleFieldConfig,
  SelectOption,
  FieldLinkage,
  ValidationRule,
  SimpleFormSchema,
  FormGroup,
  AsyncState,
  AsyncResult
} from './types/form'

// Vue 插件安装函数
import type { App, Component } from 'vue'
import SimpleForm from './components/SimpleForm.vue'
import { SimpleFormPlugin } from './utils/componentRegistry'

export interface DynamicFormOptions {
  // 全局配置选项
  componentPrefix?: string
  debug?: boolean
  // 自定义组件配置
  customComponents?: Record<string, Component>
}

export const install = (app: App, options: DynamicFormOptions = {}) => {
  const { componentPrefix = 'Simple', customComponents } = options
  
  // 注册主要组件
  app.component(`${componentPrefix}Form`, SimpleForm)
  
  // 安装组件注册系统
  SimpleFormPlugin.install(app, { components: customComponents })
  
  // 设置全局属性
  app.config.globalProperties.$dynamicForm = {
    version: '2.0.0',
    debug: options.debug || false,
    architecture: 'simplified',
    customComponentsEnabled: true
  }
  
  // 设置全局配置
  app.provide('dynamicFormGlobalConfig', options)
}

// 默认导出
export default {
  install,
  version: '2.0.0',
  architecture: 'simplified'
}

// 工具方法导出
export const createFormSchema = (fields: any[], options: any = {}): any => {
  return {
    fields,
    ...options
  }
}

export const createFieldConfig = (config: any): any => {
  return {
    name: '',
    type: 'input',
    label: '',
    required: false,
    placeholder: '',
    options: [],
    rules: [],
    ...config
  }
}

// 版本信息
export const VERSION_INFO = {
  current: '2.0.0',
  architecture: 'simplified'
}

// 注意：示例组件不导出到npm包，仅用于开发演示