<template>
  <div class="custom-color-picker">
    <div class="color-display" :style="{ backgroundColor: currentColor }" @click="!disabled && togglePicker">
      <span v-if="!currentColor" class="placeholder">{{ field.placeholder || '选择颜色' }}</span>
    </div>
    <input
      v-if="showInput"
      v-model="currentColor"
      type="color"
      :disabled="disabled"
      class="color-input"
      @change="handleColorChange"
      @blur="handleBlur"
      @focus="handleFocus"
    />
    <div v-if="showPresetColors" class="preset-colors">
      <div
        v-for="color in presetColors"
        :key="color"
        class="preset-color"
        :class="{ active: currentColor === color, disabled }"
        :style="{ backgroundColor: color }"
        @click="!disabled && selectPresetColor(color)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { SimpleFieldConfig } from '../../types/form'

interface Props {
  value?: string
  field: SimpleFieldConfig
  disabled?: boolean
  showInput?: boolean
  showPresetColors?: boolean
  presetColors?: string[]
}

interface Emits {
  (e: 'update:value', value: string): void
  (e: 'blur'): void
  (e: 'focus'): void
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
  disabled: false,
  showInput: true,
  showPresetColors: true,
  presetColors: () => [
    '#ff4d4f', '#fa541c', '#fa8c16', '#faad14', '#fadb14',
    '#a0d911', '#52c41a', '#13c2c2', '#1890ff', '#2f54eb',
    '#722ed1', '#eb2f96', '#f5222d', '#fa8c16', '#fadb14'
  ]
})

const emit = defineEmits<Emits>()

const currentColor = ref(props.value || '')

// 监听外部值变化
watch(
  () => props.value,
  (newValue) => {
    currentColor.value = newValue || ''
  }
)

const handleColorChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  currentColor.value = target.value
  emit('update:value', target.value)
}

const selectPresetColor = (color: string) => {
  currentColor.value = color
  emit('update:value', color)
  emit('blur')
}

const togglePicker = () => {
  // 这里可以添加更复杂的颜色选择器逻辑
  const colorInput = document.querySelector('.color-input') as HTMLInputElement
  if (colorInput) {
    colorInput.click()
  }
}

const handleBlur = () => {
  emit('blur')
}

const handleFocus = () => {
  emit('focus')
}
</script>

<style scoped>
.custom-color-picker {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.color-display {
  width: 100%;
  height: 32px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s ease;
}

.color-display:hover {
  border-color: #40a9ff;
}

.color-display .placeholder {
  color: #bfbfbf;
  font-size: 14px;
}

.color-input {
  width: 100%;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.color-input:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.preset-colors {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px;
  background-color: #fafafa;
  border-radius: 6px;
}

.preset-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.preset-color:hover {
  transform: scale(1.1);
  border-color: #40a9ff;
}

.preset-color.active {
  border-color: #1890ff;
  transform: scale(1.1);
}

.preset-color.disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.preset-color.disabled:hover {
  transform: none;
  border-color: transparent;
}
</style>