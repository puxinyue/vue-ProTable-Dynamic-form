<template>
  <a-select
    :value="value"
    :placeholder="field.placeholder"
    :disabled="disabled"
    :loading="loading || isLoadingOptions"
    :allow-clear="field.props?.allowClear"
    :show-search="field.props?.showSearch"
    :filter-option="field.props?.filterOption"
    :mode="field.props?.mode"
    :size="field.props?.size"
    @update:value="handleChange"
    @blur="handleBlur"
    @focus="handleFocus"
  >
    <a-select-option
      v-for="option in currentOptions"
      :key="option.value"
      :value="option.value"
      :disabled="option.disabled"
    >
      {{ option.label }}
    </a-select-option>
  </a-select>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import type { SimpleFieldConfig, SelectOption } from '../../types/form'

interface Props {
  field: SimpleFieldConfig
  value?: any
  disabled?: boolean
  loading?: boolean
}

interface Emits {
  (e: 'update:value', value: any): void
  (e: 'blur'): void
  (e: 'focus'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 注入表单上下文
const formContext = inject('formContext') as any

// 计算当前可用的选项 - 支持同步和异步联动
const currentOptions = computed((): SelectOption[] => {
  // 如果有联动配置
  if (props.field.linkage?.dependsOn && formContext) {
    const dependentValue = formContext.getValue(props.field.linkage.dependsOn)
    
    // 优先使用异步选项
    if (props.field.linkage.asyncOptionsLoader && dependentValue !== undefined) {
      return formContext.getFieldOptions(props.field.name, dependentValue)
    }
    
    // 使用同步联动选项
    if (props.field.linkage.optionsMap && dependentValue !== undefined) {
      return props.field.linkage.optionsMap[dependentValue] || []
    }
  }
  
  // 使用默认选项
  return props.field.options || []
})

// 计算当前加载状态
const isLoadingOptions = computed(() => {
  if (!props.field.linkage?.dependsOn || !formContext) return false
  
  const dependentValue = formContext.getValue(props.field.linkage.dependsOn)
  if (props.field.linkage.asyncOptionsLoader && dependentValue !== undefined) {
    const cacheKey = `${props.field.name}_${dependentValue}`
    return formContext.getAsyncState(cacheKey).loading
  }
  
  return false
})

const handleChange = (value: any) => {
  emit('update:value', value)
}

const handleBlur = () => {
  emit('blur')
}

const handleFocus = () => {
  emit('focus')
}
</script>