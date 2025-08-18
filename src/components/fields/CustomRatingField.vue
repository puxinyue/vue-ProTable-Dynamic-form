<template>
  <div class="custom-rating-field">
    <div class="rating-stars">
      <span
        v-for="star in maxStars"
        :key="star"
        class="star"
        :class="{ active: star <= currentValue, disabled }"
        @click="!disabled && handleStarClick(star)"
        @mouseenter="!disabled && handleStarHover(star)"
        @mouseleave="!disabled && handleStarLeave()"
      >
        ★
      </span>
    </div>
    <div v-if="showText" class="rating-text">
      {{ getRatingText(currentValue) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { SimpleFieldConfig } from '../../types/form'

interface Props {
  value?: number
  field: SimpleFieldConfig
  disabled?: boolean
  maxStars?: number
  showText?: boolean
  textLabels?: string[]
}

interface Emits {
  (e: 'update:value', value: number): void
  (e: 'blur'): void
  (e: 'focus'): void
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  disabled: false,
  maxStars: 5,
  showText: true,
  textLabels: () => ['很差', '较差', '一般', '较好', '很好']
})

const emit = defineEmits<Emits>()

const currentValue = ref(props.value || 0)
const hoverValue = ref(0)

// 监听外部值变化
watch(
  () => props.value,
  (newValue) => {
    currentValue.value = newValue || 0
  }
)

// 计算显示的值（悬停时显示悬停值）
const displayValue = computed(() => {
  return hoverValue.value || currentValue.value
})

const handleStarClick = (star: number) => {
  currentValue.value = star
  emit('update:value', star)
  emit('blur') // 模拟失焦事件
}

const handleStarHover = (star: number) => {
  hoverValue.value = star
}

const handleStarLeave = () => {
  hoverValue.value = 0
}

const getRatingText = (rating: number): string => {
  if (rating === 0) return '未评分'
  const index = Math.min(rating - 1, props.textLabels.length - 1)
  return props.textLabels[index] || `${rating}星`
}

// 处理焦点事件
const handleFocus = () => {
  emit('focus')
}
</script>

<style scoped>
.custom-rating-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rating-stars {
  display: flex;
  gap: 4px;
}

.star {
  font-size: 20px;
  color: #d9d9d9;
  cursor: pointer;
  transition: color 0.2s ease;
  user-select: none;
}

.star:hover {
  color: #fadb14;
}

.star.active {
  color: #fadb14;
}

.star.disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.star.disabled:hover {
  color: #d9d9d9;
}

.star.disabled.active {
  color: #fadb14;
  opacity: 0.6;
}

.rating-text {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}
</style>