<template>
  <div
    class="simple-group"
    :class="{ 'simple-group-bordered': field.bordered }"
  >
    <!-- 分组标题和描述 -->
    <div
      v-if="field.label || field.props?.description"
      class="simple-group-header"
    >
      <h4
        v-if="field.label"
        class="simple-group-title"
      >
        {{ field.label }}
      </h4>
      <p
        v-if="field.props?.description"
        class="simple-group-description"
      >
        {{ field.props.description }}
      </p>
    </div>
    
    <!-- 分组内容 -->
    <div
      class="simple-group-content"
      :class="layoutClass"
    >
      <SimpleFormItem
        v-for="childField in visibleChildren"
        :key="childField.name"
        :field="childField"
        :path="getChildPath(childField.name)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import type { FormGroup } from '../../types/form'
import SimpleFormItem from '../SimpleFormItem.vue'

interface Props {
  field: FormGroup
  path: string
}

const props = defineProps<Props>()

// 注入表单上下文
const formContext = inject('formContext') as any

// 布局类名
const layoutClass = computed(() => {
  return props.field.layout === 'horizontal' 
    ? 'simple-group-horizontal' 
    : 'simple-group-vertical'
})

// 获取子字段的完整路径
const getChildPath = (childName: string) => {
  return props.path ? `${props.path}.${childName}` : childName
}

// 计算可见的子字段
const visibleChildren = computed(() => {
  if (!props.field.children) return []
  
  return props.field.children.filter(child => {
    if (!child.linkage?.visibleWhen) return true
    
    const childPath = getChildPath(child.name)
    const value = formContext?.getValue(childPath)
    return child.linkage.visibleWhen(value, formContext?.formData)
  })
})
</script>

<style scoped>
.simple-group {
  width: 100%;
}

.simple-group-bordered {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 16px;
}

.simple-group-header {
  margin-bottom: 16px;
}

.simple-group-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.simple-group-description {
  margin: 0;
  color: #8c8c8c;
  font-size: 14px;
}

.simple-group-content {
  width: 100%;
}

.simple-group-vertical {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.simple-group-horizontal {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}
</style>