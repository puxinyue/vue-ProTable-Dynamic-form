<template>
  <div class="simple-form-item" :class="formItemClasses" :style="formItemStyle">
    <!-- 标签和控件布局 -->
    <a-row v-if="useRowLayout" :gutter="formItemGutter">
      <!-- 字段标签 -->
      <a-col v-if="field.label" :span="labelColSpan" :offset="labelColOffset" class="simple-form-item-label-col">
        <div class="simple-form-item-label" :class="labelClasses">
          <span :class="{ required: isRequired }">{{ field.label }}</span>
          <!-- 提示图标 -->
          <a-tooltip
            v-if="field.tooltip"
            :title="getTooltipTitle"
            :placement="getTooltipPlacement"
            :color="getTooltipColor"
            :overlay-class-name="getTooltipOverlayClassName"
            :overlay-style="getTooltipOverlayStyle"
          >
            <QuestionCircleOutlined class="field-tooltip-icon" />
          </a-tooltip>
        </div>
      </a-col>
      
      <!-- 字段控件 -->
      <a-col :span="wrapperColSpan" :offset="wrapperColOffset" class="simple-form-item-control-col">
        <div class="simple-form-item-control">
          <!-- 分组字段 -->
          <SimpleGroup
            v-if="field.type === 'group'"
            :field="field as FormGroup"
            :path="path || ''"
          />
          
          <!-- 输入框 -->
          <SimpleInput
            v-else-if="field.type === 'input' || field.type === 'text'"
            :field="field"
            :value="fieldValue"
            :disabled="isDisabled"
            @update:value="handleValueChange"
            @blur="handleBlur"
          />
      
          <!-- 下拉选择 -->
          <SimpleSelect
            v-else-if="field.type === 'select'"
            :field="field"
            :value="fieldValue"
            :disabled="isDisabled"
            @update:value="handleValueChange"
            @blur="handleBlur"
          />
      
          <!-- 单选框 -->
          <SimpleRadio
            v-else-if="field.type === 'radio'"
            :field="field"
            :value="fieldValue"
            :disabled="isDisabled"
            @update:value="handleValueChange"
          />
      
          <!-- 数字输入框 -->
          <a-input-number
            v-else-if="field.type === 'number'"
            :value="fieldValue"
            :placeholder="field.placeholder"
            :disabled="isDisabled"
            :min="field.props?.min"
            :max="field.props?.max"
            :step="field.props?.step"
            :precision="field.props?.precision"
            @update:value="handleValueChange"
            @blur="handleBlur"
          />
      
          <!-- 多行文本 -->
          <a-textarea
            v-else-if="field.type === 'textarea'"
            :value="fieldValue"
            :placeholder="field.placeholder"
            :disabled="isDisabled"
            :rows="field.props?.rows || 4"
            :max-length="field.props?.maxLength"
            :show-count="field.props?.showCount"
            @update:value="handleValueChange"
            @blur="handleBlur"
          />
      
          <!-- 复选框 -->
          <a-checkbox
            v-else-if="field.type === 'checkbox'"
            :checked="fieldValue"
            :disabled="isDisabled"
            @update:checked="handleValueChange"
          >
            {{ field.props?.label }}
          </a-checkbox>
      
          <!-- 日期选择 -->
          <a-date-picker
            v-else-if="field.type === 'date'"
            :value="fieldValue"
            :placeholder="field.placeholder"
            :disabled="isDisabled"
            :format="field.props?.format"
            @update:value="handleValueChange"
            @blur="handleBlur"
          />
      
          <!-- 自定义组件 -->
          <component
            v-else-if="customComponent"
            :is="customComponent"
            :value="fieldValue"
            :field="field"
            :disabled="isDisabled"
            v-bind="mergedComponentProps"
            @update:value="handleValueChange"
            @blur="handleBlur"
            @focus="handleFocus"
            v-on="customComponentEvents"
          />
      
          <!-- 默认：显示不支持的字段类型，提供更详细的错误信息 -->
          <div v-else class="unsupported-field">
            <div class="error-title">
              <ExclamationCircleOutlined /> 不支持的字段类型: {{ field.type }}
            </div>
            <div class="error-details">
              <p>字段名: {{ field.name }}</p>
              <p>可能的解决方案:</p>
              <ul>
                <li>检查字段类型是否拼写正确</li>
                <li>确保自定义组件已正确注册</li>
                <li>使用 component 属性直接指定组件</li>
                <li>联系开发者添加对该字段类型的支持</li>
              </ul>
              <div class="debug-info">
                <details>
                  <summary>调试信息</summary>
                  <p>已注册的组件类型: {{ Object.keys(formContext?.componentRegistry.getAll() || {}).join(', ') || '无' }}</p>
                  <p>字段配置: {{ JSON.stringify(field, null, 2) }}</p>
                </details>
              </div>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
    
    <!-- 简单布局 (不使用栅格) -->
    <template v-else>
      <!-- 字段标签（内联布局下即使无标签也保留占位以保证对齐） -->
      <div v-if="field.label || isInlineLayout" class="simple-form-item-label" :class="labelClasses">
        <span v-if="field.label" :class="{ required: isRequired }">{{ field.label }}</span>
        <!-- 提示图标 -->
        <a-tooltip
          v-if="field.tooltip"
          :title="getTooltipTitle"
          :placement="getTooltipPlacement"
          :color="getTooltipColor"
          :overlay-class-name="getTooltipOverlayClassName"
          :overlay-style="getTooltipOverlayStyle"
        >
          <QuestionCircleOutlined class="field-tooltip-icon" />
        </a-tooltip>
        <span v-else-if="!field.label">&nbsp;</span>
      </div>
      
      <!-- 字段控件 -->
      <div class="simple-form-item-control">
        <!-- 分组字段 -->
        <SimpleGroup
          v-if="field.type === 'group'"
          :field="field as FormGroup"
          :path="path || ''"
        />
        
        <!-- 输入框 -->
        <SimpleInput
          v-else-if="field.type === 'input' || field.type === 'text'"
          :field="field"
          :value="fieldValue"
          :disabled="isDisabled"
          @update:value="handleValueChange"
          @blur="handleBlur"
        />
        
        <!-- 下拉选择 -->
        <SimpleSelect
          v-else-if="field.type === 'select'"
          :field="field"
          :value="fieldValue"
          :disabled="isDisabled"
          @update:value="handleValueChange"
          @blur="handleBlur"
        />
        
        <!-- 单选框 -->
        <SimpleRadio
          v-else-if="field.type === 'radio'"
          :field="field"
          :value="fieldValue"
          :disabled="isDisabled"
          @update:value="handleValueChange"
        />
        
        <!-- 数字输入框 -->
        <a-input-number
          v-else-if="field.type === 'number'"
          :value="fieldValue"
          :placeholder="field.placeholder"
          :disabled="isDisabled"
          :min="field.props?.min"
          :max="field.props?.max"
          :step="field.props?.step"
          :precision="field.props?.precision"
          @update:value="handleValueChange"
          @blur="handleBlur"
        />
        
        <!-- 多行文本 -->
        <a-textarea
          v-else-if="field.type === 'textarea'"
          :value="fieldValue"
          :placeholder="field.placeholder"
          :disabled="isDisabled"
          :rows="field.props?.rows || 4"
          :max-length="field.props?.maxLength"
          :show-count="field.props?.showCount"
          @update:value="handleValueChange"
          @blur="handleBlur"
        />
        
        <!-- 复选框 -->
        <a-checkbox
          v-else-if="field.type === 'checkbox'"
          :checked="fieldValue"
          :disabled="isDisabled"
          @update:checked="handleValueChange"
        >
          {{ field.props?.label }}
        </a-checkbox>
        
        <!-- 日期选择 -->
        <a-date-picker
          v-else-if="field.type === 'date'"
          :value="fieldValue"
          :placeholder="field.placeholder"
          :disabled="isDisabled"
          :format="field.props?.format"
          @update:value="handleValueChange"
          @blur="handleBlur"
        />
        
        <!-- 自定义组件 -->
        <component
          v-else-if="customComponent"
          :is="customComponent"
          :value="fieldValue"
          :field="field"
          :disabled="isDisabled"
          v-bind="mergedComponentProps"
          @update:value="handleValueChange"
          @blur="handleBlur"
          @focus="handleFocus"
          v-on="customComponentEvents"
        />
        
        <!-- 默认：显示不支持的字段类型，提供更详细的错误信息 -->
        <div v-else class="unsupported-field">
          <div class="error-title">
            <ExclamationCircleOutlined /> 不支持的字段类型: {{ field.type }}
          </div>
          <div class="error-details">
            <p>字段名: {{ field.name }}</p>
            <p>可能的解决方案:</p>
            <ul>
              <li>检查字段类型是否拼写正确</li>
              <li>确保自定义组件已正确注册</li>
              <li>使用 component 属性直接指定组件</li>
              <li>联系开发者添加对该字段类型的支持</li>
            </ul>
            <div class="debug-info">
              <details>
                <summary>调试信息</summary>
                <p>已注册的组件类型: {{ Object.keys(formContext?.componentRegistry.getAll() || {}).join(', ') || '无' }}</p>
                <p>字段配置: {{ JSON.stringify(field, null, 2) }}</p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </template>
    
    <!-- 验证状态和错误信息 -->
    <div v-if="isValidating" class="simple-form-item-validating">
      <a-spin size="small" /> 验证中...
    </div>
    <div v-else-if="hasError" class="simple-form-item-error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, markRaw } from 'vue'
import { ExclamationCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'
import type { SimpleFieldConfig, FormGroup } from '../types/form'
import SimpleInput from './fields/SimpleInput.vue'
import SimpleSelect from './fields/SimpleSelect.vue'
import SimpleRadio from './fields/SimpleRadio.vue'
import SimpleGroup from './fields/SimpleGroup.vue'

interface Props {
  field: SimpleFieldConfig | FormGroup
  path?: string
}

const props = defineProps<Props>()

// 注入表单上下文
const formContext = inject('formContext') as any

// 注入表单布局配置
const injectedFormLayout = inject('formLayout', null) as any

// 计算字段完整路径
const fieldPath = computed(() => {
  return props.path || props.field.name
})

// 计算字段值
const fieldValue = computed(() => {
  return formContext?.getValue(fieldPath.value)
})

// 计算是否必填
const isRequired = computed(() => {
  return props.field.rules?.some(rule => rule.required) || false
})

// 计算是否禁用
const isDisabled = computed(() => {
  if (!props.field.linkage?.disabledWhen) return false
  return props.field.linkage.disabledWhen(fieldValue.value, formContext?.formData)
})

// 计算是否有错误
const hasError = computed(() => {
  return !!formContext?.getFieldError(fieldPath.value)
})

// 计算错误信息
const errorMessage = computed(() => {
  return formContext?.getFieldError(fieldPath.value)
})

// 处理值变化
const handleValueChange = (value: any) => {
  formContext?.setValue(fieldPath.value, value)
}

// 处理失焦事件
const handleBlur = async () => {
  formContext?.validateField(fieldPath.value)
  // 如果有异步验证，也执行异步验证
  const fieldConfig = formContext?.getFieldConfig(props.field.name)
  if (fieldConfig?.rules?.some((rule: any) => rule.asyncValidator)) {
    await formContext?.validateFieldAsync(fieldPath.value)
  }
}

// 计算是否正在验证
const isValidating = computed(() => {
  const validationKey = `${fieldPath.value}_validation`
  return formContext?.getAsyncState(validationKey).loading || false
})

// 获取自定义组件
const customComponent = computed(() => {
  // 优先使用字段配置中的 component
  if (props.field.component) {
    console.log(`字段 ${props.field.name} 使用内联组件:`, props.field.component)
    // 自动使用 markRaw 包装内联组件，避免 Vue 将其设为响应式
    return markRaw(props.field.component)
  }
  
  // 从组件注册表中查找
  const registeredComponent = formContext?.componentRegistry.get(props.field.type)
  if (registeredComponent) {
    console.log(`字段 ${props.field.name} 找到注册组件:`, props.field.type)
  } else {
    console.warn(`字段 ${props.field.name} 未找到对应的组件:`, props.field.type)
    console.log('当前已注册的组件:', formContext?.componentRegistry.getAll())
  }
  
  return registeredComponent
})

// 合并组件属性
const mergedComponentProps = computed(() => {
  const baseProps = {
    placeholder: props.field.placeholder,
    ...props.field.props
  }
  
  // 合并字段配置中的 componentProps
  if (props.field.componentProps) {
    Object.assign(baseProps, props.field.componentProps)
  }
  
  return baseProps
})

// 自定义组件事件处理
const customComponentEvents = computed(() => {
  // 可以在这里添加更多事件处理逻辑
  return {}
})

// 处理焦点事件
const handleFocus = () => {
  // 自定义组件的焦点事件处理
}

// Tooltip 相关计算属性
const getTooltipTitle = computed(() => {
  if (typeof props.field.tooltip === 'string') {
    return props.field.tooltip
  }
  return props.field.tooltip?.title || ''
})

const getTooltipPlacement = computed(() => {
  if (typeof props.field.tooltip === 'string') {
    return 'top'
  }
  return props.field.tooltip?.placement || 'top'
})

const getTooltipColor = computed(() => {
  if (typeof props.field.tooltip === 'string') {
    return undefined
  }
  return props.field.tooltip?.color
})

const getTooltipOverlayClassName = computed(() => {
  if (typeof props.field.tooltip === 'string') {
    return undefined
  }
  return props.field.tooltip?.overlayClassName
})

const getTooltipOverlayStyle = computed(() => {
  if (typeof props.field.tooltip === 'string') {
    return undefined
  }
  return props.field.tooltip?.overlayStyle
})

// 布局相关计算属性
const fieldLayout = computed(() => props.field.layout || {})

// 获取表单级布局配置
const formLayout = computed(() => {
  // 优先使用注入的布局配置，回退到formContext中的schema布局配置
  return injectedFormLayout?.value || formContext?.schema?.layout || {}
})

// 是否为内联布局
const isInlineLayout = computed(() => (formLayout.value.type || 'vertical') === 'inline')

// 计算表单项的 gutter 配置
const formItemGutter = computed(() => {
  const gutter = formLayout.value.gutter
  if (Array.isArray(gutter)) {
    return gutter
  }
  return gutter ? [gutter, gutter] : [8, 8] // 默认8px间距
})

// 是否使用栅格布局
const useRowLayout = computed(() => {
  const layoutType = formLayout.value.type || 'vertical'
  
  // horizontal 布局和 grid 布局强制使用栅格系统
  if (layoutType === 'horizontal' || layoutType === 'grid') {
    return true
  }
  
  // 如果明确配置了 labelCol 或 wrapperCol，则使用栅格布局
  const hasFieldLayoutCols = typeof fieldLayout.value === 'object' && 
    (fieldLayout.value.labelCol || fieldLayout.value.wrapperCol)
  const hasFormLayoutCols = formLayout.value.labelCol || formLayout.value.wrapperCol
  
  return hasFieldLayoutCols || hasFormLayoutCols
})

// 表单项样式类
const formItemClasses = computed(() => {
  const classes = []
  const layoutType = formLayout.value.type || 'vertical'
  
// 布局调试已完成，移除调试代码
  
  // 添加布局类型样式类
  classes.push(`simple-form-item-${layoutType}`)
  
  if (hasError.value) {
    classes.push('simple-form-item-error')
  }
  
  if (typeof fieldLayout.value === 'object' && fieldLayout.value.className) {
    classes.push(fieldLayout.value.className)
  }
  
  return classes
})

// 表单项内联样式
const formItemStyle = computed(() => {
  return (typeof fieldLayout.value === 'object' && fieldLayout.value.style) || {}
})

// 标签样式类
const labelClasses = computed(() => {
  const classes = []
  const labelAlign = formLayout.value.labelAlign
  
  if (labelAlign) {
    classes.push(`label-${labelAlign}`)
  }
  
  return classes
})

// 标签栅格配置
const labelColSpan = computed(() => {
  const fieldLayoutCol = typeof fieldLayout.value === 'object' ? fieldLayout.value.labelCol?.span : undefined
  const formLayoutCol = formLayout.value.labelCol?.span
  const layoutType = formLayout.value.type || 'vertical'
  
  // 为不同布局类型设置合理的默认值
  let defaultSpan = 6
  if (layoutType === 'horizontal') {
    defaultSpan = 6  // horizontal布局标签占6格
  }
  
  return fieldLayoutCol || formLayoutCol || defaultSpan
})

const labelColOffset = computed(() => {
  const fieldLayoutOffset = typeof fieldLayout.value === 'object' ? fieldLayout.value.labelCol?.offset : undefined
  return fieldLayoutOffset || formLayout.value.labelCol?.offset || 0
})

// 控件栅格配置
const wrapperColSpan = computed(() => {
  const fieldLayoutSpan = typeof fieldLayout.value === 'object' ? fieldLayout.value.wrapperCol?.span : undefined
  const formLayoutSpan = formLayout.value.wrapperCol?.span
  const layoutType = formLayout.value.type || 'vertical'
  
  if (fieldLayoutSpan || formLayoutSpan) {
    return fieldLayoutSpan || formLayoutSpan
  }
  
  // 如果没有指定，根据标签占位和布局类型计算控件占位
  const labelSpan = labelColSpan.value
  const labelOffset = labelColOffset.value
  
  if (layoutType === 'horizontal') {
    // horizontal布局：控件占据剩余空间
    return 24 - labelSpan - labelOffset
  }
  
  return 24 - labelSpan - labelOffset
})

const wrapperColOffset = computed(() => {
  const fieldLayoutOffset = typeof fieldLayout.value === 'object' ? fieldLayout.value.wrapperCol?.offset : undefined
  return fieldLayoutOffset || formLayout.value.wrapperCol?.offset || 0
})
</script>

<style scoped>
.simple-form-item {
  margin-bottom: 16px;
}

.simple-form-item-label {
  margin-bottom: 4px;
}

.simple-form-item-label span {
  font-size: 14px;
  color: #262626;
}

.simple-form-item-label .required::before {
  content: '*';
  color: #ff4d4f;
  margin-right: 4px;
}

.simple-form-item-control {
  width: 100%;
}

/* 栅格布局样式 */
.simple-form-item-label-col {
  display: flex;
  align-items: center;
  min-height: 32px;
}

.simple-form-item-control-col {
  display: flex;
  align-items: center;
}

/* 标签对齐 */
.simple-form-item-label.label-left {
  text-align: left;
}

.simple-form-item-label.label-right {
  text-align: right;
}

/* 垂直布局样式 */
.simple-form-item-vertical .simple-form-item-label {
  display: block;
  margin-bottom: 4px;
}

.simple-form-item-vertical .simple-form-item-control {
  display: block;
  width: 100%;
}

/* 水平布局样式 */
.simple-form-item-horizontal {
  /* 水平布局主要通过栅格系统控制 */
  width: 100%;
}

.simple-form-item-horizontal .simple-form-item-label-col {
  text-align: right;
  padding-right: 8px;
}

/* 网格布局样式 - 确保使用栅格系统 */
.simple-form-item-grid .simple-form-item-label {
  /* 重置垂直布局的样式，让栅格系统生效 */
  display: inline-block !important;
  margin-bottom: 0 !important;
  width: 100%;
}

.simple-form-item-grid .simple-form-item-control {
  /* 重置垂直布局的样式，让栅格系统生效 */
  display: block !important;
  width: 100% !important;
}

.simple-form-item-grid .simple-form-item-label-col {
  text-align: right;
  padding-right: 8px;
}

/* 内联布局样式 */
.simple-form-item-inline {
  display: inline-flex;
  align-items: center;
  margin-right: 16px;
  margin-bottom: 0;
  vertical-align: top;
}

.simple-form-item-inline .simple-form-item-label {
  display: inline-block;
  margin-right: 8px;
  margin-bottom: 0;
  vertical-align: middle;
  white-space: nowrap;
  width: 72px;
  text-align: right;
}

.simple-form-item-inline .simple-form-item-control {
  display: inline-block;
  vertical-align: middle;
}

/* 内联布局中的表单控件宽度 */
.simple-form-item-inline .simple-form-item-control :deep(.ant-input),
.simple-form-item-inline .simple-form-item-control :deep(.ant-select),
.simple-form-item-inline .simple-form-item-control :deep(.ant-input-number),
.simple-form-item-inline .simple-form-item-control :deep(.ant-picker) {
  width: 200px !important;
  max-width: 200px;
}

.simple-form-item-inline .simple-form-item-control :deep(.ant-select) {
  min-width: 200px;
}

@media (max-width: 576px) {
  .simple-form-item-inline .simple-form-item-label {
    width: auto;
    text-align: left;
    margin-bottom: 4px;
    display: block;
  }
  .simple-form-item-inline .simple-form-item-control {
    display: block;
  }
}

.simple-form-item-error .simple-form-item-control :deep(.ant-input),
.simple-form-item-error .simple-form-item-control :deep(.ant-select-selector),
.simple-form-item-error .simple-form-item-control :deep(.ant-input-number) {
  border-color: #ff4d4f;
}

.simple-form-item-error-message {
  margin-top: 4px;
  color: #ff4d4f;
  font-size: 12px;
}

.simple-form-item-validating {
  margin-top: 4px;
  color: #1890ff;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.unsupported-field {
  padding: 16px;
  background-color: #fff2e8;
  border: 1px solid #ffbb96;
  border-radius: 6px;
  color: #fa8c16;
  font-size: 13px;
}

.unsupported-field .error-title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.unsupported-field .error-details {
  color: #8c5c00;
  line-height: 1.5;
}

.unsupported-field .error-details p {
  margin: 6px 0;
}

.unsupported-field .error-details ul {
  margin: 8px 0;
  padding-left: 20px;
}

.unsupported-field .error-details li {
  margin: 4px 0;
}

.unsupported-field .debug-info {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #ffcc80;
}

.unsupported-field .debug-info details {
  cursor: pointer;
}

.unsupported-field .debug-info summary {
  font-weight: 500;
  padding: 4px 0;
}

.unsupported-field .debug-info pre {
  background: #fafafa;
  padding: 8px;
  border-radius: 4px;
  font-size: 11px;
  overflow-x: auto;
  margin: 6px 0;
}

/* 提示图标样式 */
.field-tooltip-icon {
  margin-left: 4px;
  color: #8c8c8c;
  font-size: 14px;
  cursor: help;
  transition: color 0.2s ease;
}

.field-tooltip-icon:hover {
  color: #1890ff;
}

.simple-form-item-label {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>