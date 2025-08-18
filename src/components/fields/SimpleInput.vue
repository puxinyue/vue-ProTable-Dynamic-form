<template>
  <a-input
    :value="value"
    :placeholder="field.placeholder"
    :disabled="disabled"
    :size="field.props?.size"
    :allow-clear="field.props?.allowClear"
    :max-length="field.props?.maxLength"
    @update:value="handleChange"
    @blur="handleBlur"
    @focus="handleFocus"
  />
</template>

<script setup lang="ts">
import type { SimpleFieldConfig } from '../../types/form'

interface Props {
  field: SimpleFieldConfig
  value?: string
  disabled?: boolean
}

interface Emits {
  (e: 'update:value', value: string): void
  (e: 'blur'): void
  (e: 'focus'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleChange = (value: string) => {
  emit('update:value', value)
}

const handleBlur = () => {
  emit('blur')
}

const handleFocus = () => {
  emit('focus')
}
</script>