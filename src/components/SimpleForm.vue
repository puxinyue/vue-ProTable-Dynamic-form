<template>
  <div
    class="simple-form"
    :class="formLayoutClasses"
  >
    <a-row
      v-if="isGridLayout"
      :gutter="gutterConfig"
    >
      <a-col
        v-for="field in visibleFields"
        :key="field.name"
        :span="getFieldSpan(field)"
        :offset="getFieldOffset(field)"
        :xs="getResponsiveSpan('xs', field)"
        :sm="getResponsiveSpan('sm', field)"
        :md="getResponsiveSpan('md', field)"
        :lg="getResponsiveSpan('lg', field)"
        :xl="getResponsiveSpan('xl', field)"
        :xxl="getResponsiveSpan('xxl', field)"
      >
        <SimpleFormItem :field="field" />
      </a-col>
    </a-row>
    
    <div
      v-else
      :class="fieldsContainerClass"
      :style="getFieldsContainerStyle()"
    >
      <SimpleFormItem
        v-for="field in visibleFields"
        :key="field.name"
        :field="field"
        :class="getFieldItemClass(field)"
        :style="getFieldItemStyle(field)"
      />

      <!-- 内联布局下，将操作按钮放入同一行 -->
      <div
        v-if="showActions && isInlineLayout"
        class="simple-form-actions inline-actions"
      >
        <a-button
          :type="submitButtonConfig.type"
          :size="submitButtonConfig.size"
          :loading="submitting || submitButtonConfig.loading"
          :disabled="submitButtonConfig.disabled"
          :html-type="submitButtonConfig.htmlType"
          @click="handleSubmit"
        >
          {{ submitButtonConfig.text }}
        </a-button>
        <a-button
          v-if="showReset && !schema.extraButtons?.length"
          @click="handleReset"
        >
          {{ resetText }}
        </a-button>
        <a-button
          v-for="(button, index) in schema.extraButtons"
          :key="`inline-extra-button-${index}`"
          :type="button.type"
          :size="button.size"
          :loading="button.loading"
          :disabled="button.disabled"
          @click="button.onClick"
        >
          <template
            v-if="button.icon"
            #icon
          >
            <DownOutlined v-if="button.icon === 'down'" />
          </template>
          {{ button.text }}
        </a-button>
      </div>
    </div>
    
    <div
      v-if="showActions && !isInlineLayout"
      class="simple-form-actions"
    >
      <!-- 自定义提交按钮或默认提交按钮 -->
      <a-button
        :type="submitButtonConfig.type"
        :size="submitButtonConfig.size"
        :loading="submitting || submitButtonConfig.loading"
        :disabled="submitButtonConfig.disabled"
        :html-type="submitButtonConfig.htmlType"
        @click="handleSubmit"
      >
        {{ submitButtonConfig.text }}
      </a-button>
      
      <!-- 默认重置按钮 -->
      <a-button
        v-if="showReset && !schema.extraButtons?.length"
        @click="handleReset"
      >
        {{ resetText }}
      </a-button>
      
      <!-- 额外按钮 -->
      <a-button
        v-for="(button, index) in schema.extraButtons"
        :key="`extra-button-${index}`"
        :type="button.type"
        :size="button.size"
        :loading="button.loading"
        :disabled="button.disabled"
        @click="button.onClick"
      >
        <template
          v-if="button.icon"
          #icon
        >
          <DownOutlined v-if="button.icon === 'down'" />
        </template>
        {{ button.text }}
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide, watch, onMounted } from 'vue'
import { DownOutlined } from '@ant-design/icons-vue'
import type { SimpleFormSchema } from '../types/form'
import { useSimpleForm } from '../composables/useSimpleForm'
import SimpleFormItem from './SimpleFormItem.vue'

interface Props {
  schema: SimpleFormSchema
  modelValue?: any
  showActions?: boolean
  showReset?: boolean
  submitText?: string
  resetText?: string
  submitting?: boolean
  validateOnChange?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: any): void
  (e: 'submit', data: any): void
  (e: 'reset'): void
  (e: 'change', data: any): void
  (e: 'validate', isValid: boolean, errors: Record<string, string>): void
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
  showReset: true,
  submitText: '提交',
  resetText: '重置',
  submitting: false,
  validateOnChange: true
})

const emit = defineEmits<Emits>()

// 使用表单状态管理
const formContext = useSimpleForm(props.schema, props.modelValue)

// 布局相关计算属性
const formLayout = computed(() => props.schema.layout || {})

// 提供表单上下文给子组件
provide('formContext', formContext)

// 提供布局配置给子组件
provide('formLayout', formLayout)

// 计算可见字段
const visibleFields = computed(() => {
  return props.schema.fields.filter(field => {
    if (!field.linkage?.visibleWhen) return true
    
    // 获取依赖字段的值，而不是当前字段的值
    const dependentValue = field.linkage.dependsOn 
      ? formContext.getValue(field.linkage.dependsOn)
      : undefined
    return field.linkage.visibleWhen(dependentValue, formContext.formData)
  })
})

const isGridLayout = computed(() => {
  const layoutType = formLayout.value.type
  // horizontal布局和grid布局需要使用栅格系统
  // inline布局使用简单布局，让每个字段自己处理内联样式
  return layoutType === 'horizontal' || layoutType === 'grid'
})

const formLayoutClasses = computed(() => {
  const classes = []
  const layoutType = formLayout.value.type || 'vertical'
  
  classes.push(`simple-form-${layoutType}`)
  
  if (formLayout.value.labelAlign) {
    classes.push(`simple-form-label-${formLayout.value.labelAlign}`)
  }
  
  return classes
})

const fieldsContainerClass = computed(() => {
  const layoutType = formLayout.value.type || 'vertical'
  return `simple-form-fields simple-form-fields-${layoutType}`
})

const isInlineLayout = computed(() => (formLayout.value.type || 'vertical') === 'inline')

const gutterConfig = computed(() => {
  const gutter = formLayout.value.gutter
  if (Array.isArray(gutter)) {
    return gutter
  }
  return gutter ? [gutter, gutter] : [16, 16]
})

// 提交按钮配置
const submitButtonConfig = computed(() => {
  const defaultConfig = {
    text: props.submitText,
    type: 'primary' as const,
    size: 'middle' as const,
    loading: false,
    disabled: false,
    htmlType: 'submit' as const
  }
  
  if (props.schema.submitButton) {
    return {
      ...defaultConfig,
      ...props.schema.submitButton
    }
  }
  
  return defaultConfig
})

// 获取字段的栅格占位数
const getFieldSpan = (field: any) => {
  // 如果字段有明确的span配置，直接使用
  if (field.layout?.span) return field.layout.span
  
  // 获取网格布局配置
  const cols = formLayout.value.cols || formLayout.value.columns
  
  if (cols) {
    // 计算每列的基础跨度
    const baseSpan = Math.floor(24 / cols)
    // 如果字段有colSpan配置，则乘以colSpan
    const colSpan = field.layout?.colSpan || 1
    return baseSpan * colSpan
  }
  
  return 24
}

// 获取字段的栅格偏移数
const getFieldOffset = (field: any) => {
  return field.layout?.offset || 0
}

// 获取响应式栅格配置
const getResponsiveSpan = (breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl', field: any) => {
  const breakpoints = formLayout.value.breakpoints
  if (breakpoints && breakpoints[breakpoint]) {
    return Math.floor(24 / breakpoints[breakpoint]!)
  }
  return undefined
}

// 获取字段项的CSS类
const getFieldItemClass = (field: any) => {
  const classes = []
  if (field.layout?.className) {
    classes.push(field.layout.className)
  }
  return classes.join(' ')
}

// 获取字段项的内联样式
const getFieldItemStyle = (field: any) => {
  return field.layout?.style || {}
}

// 获取字段容器样式（处理非网格布局的间距）
const getFieldsContainerStyle = () => {
  const layoutType = formLayout.value.type || 'vertical'
  const gutter = gutterConfig.value
  const [horizontalGutter, verticalGutter] = Array.isArray(gutter) ? gutter : [gutter, gutter]
  
  const styles: Record<string, string> = {}
  
  // 为不同布局类型设置间距
  if (layoutType === 'vertical' && verticalGutter > 0) {
    styles.gap = `${verticalGutter}px`
    styles.display = 'flex'
    styles.flexDirection = 'column'
  } else if (layoutType === 'inline' && horizontalGutter > 0) {
    styles.gap = `${horizontalGutter}px`
    styles.display = 'flex'
    styles.flexWrap = 'wrap'
    styles.alignItems = 'center'
  }
  
  return styles
}

// 监听表单数据变化，同步到父组件
watch(
  () => formContext.formValues.value,
  (newValue) => {
    emit('update:modelValue', newValue)
    emit('change', newValue)
    
    if (props.validateOnChange) {
      const isValid = formContext.validateForm()
      emit('validate', isValid, formContext.errors.value)
    }
  },
  { deep: true }
)

// 监听外部数据变化
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && JSON.stringify(newValue) !== JSON.stringify(formContext.formValues.value)) {
      Object.keys(formContext.formData).forEach(key => {
        delete formContext.formData[key]
      })
      Object.assign(formContext.formData, newValue)
    }
  },
  { deep: true }
)

// 处理提交
const handleSubmit = () => {
  const isValid = formContext.validateForm()
  if (isValid) {
    emit('submit', formContext.formValues.value)
  } else {
    emit('validate', false, formContext.errors.value)
  }
}

// 处理重置
const handleReset = () => {
  formContext.resetForm()
  emit('reset')
}

// 组件挂载时执行异步初始化
onMounted(async () => {
  await formContext.initializeAsync()
})

// 暴露方法给父组件
defineExpose({
  validate: formContext.validateForm,
  validateAsync: formContext.validateFieldAsync,
  reset: formContext.resetForm,
  setFieldValue: formContext.setValue,
  getFieldValue: formContext.getValue,
  formData: formContext.formValues,
  getAsyncState: formContext.getAsyncState,
  initializeAsync: formContext.initializeAsync,
  // 组件注册功能
  registerComponent: formContext.componentRegistry.register,
  unregisterComponent: formContext.componentRegistry.unregister,
  getComponent: formContext.componentRegistry.get,
  hasComponent: formContext.componentRegistry.has,
  getAllComponents: formContext.componentRegistry.getAll,
  clearComponents: formContext.componentRegistry.clear
})
</script>

<style scoped>
.simple-form {
  width: 100%;
}

/* 垂直布局 */
.simple-form-vertical .simple-form-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 水平布局 - horizontal布局主要通过栅格系统实现，这里只是备用样式 */
.simple-form-horizontal {
  width: 100%;
}

/* 水平字段布局 - 让字段水平排列，每个字段平等宽度 */
.simple-form-horizontal-fields .simple-form-fields {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
}

.simple-form-horizontal-fields .simple-form-fields .simple-form-item {
  flex: 1;
  min-width: 200px;
}

/* 水平字段布局中的表单控件 */
.simple-form-horizontal-fields .simple-form-fields .simple-form-item .simple-form-item-control :deep(.ant-input),
.simple-form-horizontal-fields .simple-form-fields .simple-form-item .simple-form-item-control :deep(.ant-select),
.simple-form-horizontal-fields .simple-form-fields .simple-form-item .simple-form-item-control :deep(.ant-input-number),
.simple-form-horizontal-fields .simple-form-fields .simple-form-item .simple-form-item-control :deep(.ant-picker) {
  width: 100%;
}

/* 内联布局 */
.simple-form-inline .simple-form-fields {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px 24px;
  align-items: baseline;
}

.simple-form-inline .simple-form-fields .simple-form-item {
  flex: 0 0 auto;
  margin-bottom: 0;
}

.simple-form-inline .simple-form-fields .simple-form-item .simple-form-item-label {
  display: inline-block;
  margin-right: 8px;
  margin-bottom: 0;
  white-space: nowrap;
}

.simple-form-inline .simple-form-fields .simple-form-item .simple-form-item-control {
  display: inline-block;
  vertical-align: top;
}

/* 内联布局中的表单控件宽度限制 */
.simple-form-inline .simple-form-fields .simple-form-item .simple-form-item-control :deep(.ant-input),
.simple-form-inline .simple-form-fields .simple-form-item .simple-form-item-control :deep(.ant-select),
.simple-form-inline .simple-form-fields .simple-form-item .simple-form-item-control :deep(.ant-input-number),
.simple-form-inline .simple-form-fields .simple-form-item .simple-form-item-control :deep(.ant-picker) {
  width: 200px;
}

.simple-form-inline .simple-form-fields .simple-form-item .simple-form-item-control :deep(.ant-select) {
  min-width: 100px;
}

/* 网格布局 */
.simple-form-grid {
  width: 100%;
}

/* 标签对齐 */
.simple-form-label-left .simple-form-item-label {
  text-align: left;
}

.simple-form-label-right .simple-form-item-label {
  text-align: right;
}

/* 响应式布局 */
@media (max-width: 576px) {
  .simple-form-horizontal .simple-form-fields,
  .simple-form-inline .simple-form-fields {
    flex-direction: column;
  }
  
  .simple-form-inline .simple-form-fields .simple-form-item .simple-form-item-label {
    display: block;
    margin-bottom: 4px;
  }
  
  .simple-form-inline .simple-form-fields .simple-form-item .simple-form-item-control {
    display: block;
  }
}

.simple-form-actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  justify-content: flex-start;
}

/* 内联布局下的按钮区域，与字段同列展示且去掉上边距 */
.simple-form-inline .inline-actions {
  margin-top: 0;
  display: inline-flex;
  gap: 12px;
  align-items: center;
}
</style>