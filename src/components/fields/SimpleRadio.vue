<template>
  <a-radio-group
    :value="value"
    :disabled="disabled"
    :size="field.props?.size"
    :direction="field.props?.direction || 'horizontal'"
    @update:value="handleChange"
  >
    <a-radio
      v-for="option in currentOptions"
      :key="option.value"
      :value="option.value"
      :disabled="option.disabled"
    >
      {{ option.label }}
    </a-radio>
  </a-radio-group>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import type { SimpleFieldConfig, SelectOption } from '../../types/form'

interface Props {
  field: SimpleFieldConfig
  value?: any
  disabled?: boolean
}

interface Emits {
  (e: 'update:value', value: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 注入表单上下文
const formContext = inject('formContext') as any

// 计算当前可用的选项 - 支持联动
const currentOptions = computed((): SelectOption[] => {
  // 如果有联动配置
  if (props.field.linkage?.dependsOn && formContext) {
    const dependentValue = formContext.getValue(props.field.linkage.dependsOn)
    
    if (props.field.linkage.optionsMap && dependentValue !== undefined) {
      return props.field.linkage.optionsMap[dependentValue] || []
    }
  }
  
  // 使用默认选项
  return props.field.options || []
})

const handleChange = (value: any) => {
  emit('update:value', value)
}
</script>