import { ref, computed, reactive, watch, nextTick } from 'vue'
import type { SimpleFormSchema, ValidationRule, AsyncState } from '../types/form'
import { getByPath, setByPath, getAllPaths } from '../utils/pathHelper'
import { createComponentRegistry, type ComponentRegistry } from '../utils/componentRegistry'

export function useSimpleForm(schema: SimpleFormSchema, initialData: any = {}) {
  // 单一数据源 - 表单数据
  const formData = reactive({ ...initialData })
  
  // 验证错误状态
  const errors = ref<Record<string, string>>({})
  
  // 异步状态管理
  const asyncStates = reactive<Record<string, AsyncState>>({})
  
  // 字段选项缓存（用于异步加载的选项）
  const fieldOptionsCache = reactive<Record<string, any[]>>({})
  
  // 组件注册表（实例级别）
  const componentRegistry = createComponentRegistry()
  
  // 获取字段值
  const getValue = (path: string) => {
    return getByPath(formData, path)
  }
  
  // 设置字段值
  const setValue = (path: string, value: any) => {
    setByPath(formData, path, value)
    // 清除该字段的验证错误
    if (errors.value[path]) {
      delete errors.value[path]
    }
  }
  
  // 获取字段配置
  const getFieldConfig = (fieldName: string) => {
    const findField = (fields: any[]): any => {
      for (const field of fields) {
        if (field.name === fieldName) {
          return field
        }
        if (field.type === 'group' && field.children) {
          const found = findField(field.children)
          if (found) return found
        }
      }
      return null
    }
    return findField(schema.fields)
  }
  
  // 验证单个字段
  const validateField = (path: string): boolean => {
    const fieldConfig = getFieldConfig(path.split('.').pop() || path)
    if (!fieldConfig || !fieldConfig.rules) return true
    
    const value = getValue(path)
    
    for (const rule of fieldConfig.rules) {
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.value[path] = rule.message || `${fieldConfig.label} is required`
        return false
      }
      
      if (rule.validator) {
        const result = rule.validator(value, formData)
        if (result !== true) {
          errors.value[path] = typeof result === 'string' ? result : (rule.message || 'Invalid value')
          return false
        }
      }
    }
    
    delete errors.value[path]
    return true
  }
  
  // 验证整个表单
  const validateForm = (): boolean => {
    const allPaths = getAllPaths(formData)
    let isValid = true
    
    // 验证所有有值的字段
    for (const path in allPaths) {
      if (!validateField(path)) {
        isValid = false
      }
    }
    
    // 验证必填字段（即使没有值）
    const validateRequiredFields = (fields: any[], prefix = '') => {
      for (const field of fields) {
        if (field.type === 'group' && field.children) {
          validateRequiredFields(field.children, field.name + '.')
        } else {
          const fieldPath = prefix + field.name
          if (field.rules?.some((rule: ValidationRule) => rule.required)) {
            if (!validateField(fieldPath)) {
              isValid = false
            }
          }
        }
      }
    }
    
    validateRequiredFields(schema.fields)
    return isValid
  }
  
  // 重置表单
  const resetForm = () => {
    Object.keys(formData).forEach(key => {
      delete formData[key]
    })
    Object.assign(formData, { ...initialData })
    errors.value = {}
  }
  
  // 获取表单数据的计算属性
  const formValues = computed(() => ({ ...formData }))
  
  // 是否有验证错误
  const hasErrors = computed(() => Object.keys(errors.value).length > 0)
  
    // 获取字段错误信息
  const getFieldError = (path: string) => {
    return errors.value[path]
  }

  // 异步数据初始化
  const initializeAsync = async () => {
    if (!schema.asyncInitializer) return

    const initKey = '__init__'
    asyncStates[initKey] = { loading: true }

    try {
      const asyncData = await schema.asyncInitializer()
      if (asyncData && typeof asyncData === 'object') {
        Object.assign(formData, asyncData)
      }
      asyncStates[initKey] = { loading: false }
      
      // 初始化完成后，触发异步联动选项的加载
      await nextTick() // 确保数据变化已经完成
      await triggerAsyncLinkageForInitialization()
    } catch (error) {
      asyncStates[initKey] = { 
        loading: false, 
        error: error instanceof Error ? error.message : '初始化失败' 
      }
    }
  }

  // 为初始化数据触发异步联动
  const triggerAsyncLinkageForInitialization = async () => {
    for (const field of schema.fields) {
      if (field.linkage?.asyncOptionsLoader && field.linkage.dependsOn) {
        const dependentValue = getByPath(formData, field.linkage.dependsOn)
        if (dependentValue !== undefined) {
          await loadFieldOptions(field.name, dependentValue)
        }
      }
    }
  }

  // 异步加载字段选项
  const loadFieldOptions = async (fieldName: string, dependentValue: any) => {
    const fieldConfig = getFieldConfig(fieldName)
    if (!fieldConfig?.linkage?.asyncOptionsLoader) return []

    const cacheKey = `${fieldName}_${dependentValue}`
    asyncStates[cacheKey] = { loading: true }

    try {
      const options = await fieldConfig.linkage.asyncOptionsLoader(dependentValue, formData)
      fieldOptionsCache[cacheKey] = options
      asyncStates[cacheKey] = { loading: false }
      return options
    } catch (error) {
      asyncStates[cacheKey] = { 
        loading: false, 
        error: error instanceof Error ? error.message : '加载选项失败' 
      }
      return []
    }
  }

  // 获取字段选项（支持异步）
  const getFieldOptions = (fieldName: string, dependentValue?: any) => {
    const fieldConfig = getFieldConfig(fieldName)
    if (!fieldConfig) return []

    // 如果有异步选项加载器
    if (fieldConfig.linkage?.asyncOptionsLoader && dependentValue !== undefined) {
      const cacheKey = `${fieldName}_${dependentValue}`
      return fieldOptionsCache[cacheKey] || []
    }

    // 如果有同步联动选项
    if (fieldConfig.linkage?.optionsMap && dependentValue !== undefined) {
      return fieldConfig.linkage.optionsMap[dependentValue] || []
    }

    // 返回默认选项
    return fieldConfig.options || []
  }

  // 获取异步状态
  const getAsyncState = (key: string): AsyncState => {
    return asyncStates[key] || { loading: false }
  }

  // 异步验证单个字段
  const validateFieldAsync = async (path: string): Promise<boolean> => {
    const fieldConfig = getFieldConfig(path.split('.').pop() || path)
    if (!fieldConfig || !fieldConfig.rules) return true

    const value = getValue(path)
    
    // 先执行同步验证
    if (!validateField(path)) return false

    // 执行异步验证
    for (const rule of fieldConfig.rules) {
      if (rule.asyncValidator) {
        const validationKey = `${path}_validation`
        asyncStates[validationKey] = { loading: true }

        try {
          const result = await rule.asyncValidator(value, formData)
          asyncStates[validationKey] = { loading: false }

          if (result !== true) {
            errors.value[path] = typeof result === 'string' ? result : (rule.message || 'Invalid value')
            return false
          }
        } catch (error) {
          asyncStates[validationKey] = { 
            loading: false, 
            error: error instanceof Error ? error.message : '验证失败' 
          }
          errors.value[path] = rule.message || '验证失败'
          return false
        }
      }
    }

    delete errors.value[path]
    return true
  }

  // 创建字段依赖关系的监听器
  const setupFieldWatchers = () => {
    // 获取所有有依赖关系的字段
    const fieldsWithDependencies = schema.fields.filter(field => field.linkage?.dependsOn)
    
    // 为每个依赖字段创建单独的监听器
    fieldsWithDependencies.forEach(field => {
      if (field.linkage?.dependsOn) {
        watch(
          () => getByPath(formData, field.linkage!.dependsOn),
          async (newValue, oldValue) => {
            // 只有在值真正发生变化时才触发
            if (newValue !== oldValue) {
              // 检查是否需要重置当前字段的值（默认为 true）
              const shouldReset = field.linkage?.resetOnChange !== false
              
              if (shouldReset) {
                // 重置当前字段的值到初始状态
                const initialValue = getInitialValue(field)
                setValue(field.name, initialValue)
              }
              
              // 如果有异步选项加载器，重新加载选项
              if (field.linkage?.asyncOptionsLoader && newValue !== undefined) {
                const cacheKey = `${field.name}_${newValue}`
                const hasCache = fieldOptionsCache[cacheKey] && fieldOptionsCache[cacheKey].length > 0
                
                if (!hasCache) {
                  await loadFieldOptions(field.name, newValue)
                }
              }
            }
          },
          { immediate: false } // 不在初始化时立即触发
        )
      }
    })
  }
  
  // 设置字段监听器
  setupFieldWatchers()

  // 获取字段的初始值
  const getInitialValue = (field: any) => {
    // 根据字段类型返回合适的初始值
    switch (field.type) {
      case 'input':
      case 'text':
      case 'textarea':
        return ''
      case 'select':
      case 'radio':
        return undefined
      case 'checkbox':
        return false
      case 'number':
        return undefined
      case 'date':
        return undefined
      default:
        return undefined
    }
  }

  return {
    formData,
    formValues,
    errors: computed(() => errors.value),
    hasErrors,
    getValue,
    setValue,
    getFieldConfig,
    validateField,
    validateFieldAsync,
    validateForm,
    resetForm,
    getFieldError,
    // 异步功能
    initializeAsync,
    loadFieldOptions,
    getFieldOptions,
    getAsyncState,
    asyncStates: computed(() => asyncStates),
    fieldOptionsCache: computed(() => fieldOptionsCache),
    // 组件注册功能
    componentRegistry,
    // Schema 配置
    schema
  }
}