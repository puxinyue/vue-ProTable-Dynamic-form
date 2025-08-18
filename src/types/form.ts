// 简化的表单类型定义

export interface SelectOption {
  label: string
  value: any
  disabled?: boolean
}

export interface FieldLinkage {
  dependsOn: string  // 依赖的字段路径
  optionsMap?: Record<string, SelectOption[]>  // 值到选项的映射
  asyncOptionsLoader?: (value: any, formData: any) => Promise<SelectOption[]>  // 异步选项加载器
  visibleWhen?: (value: any, formData: any) => boolean  // 显示条件
  disabledWhen?: (value: any, formData: any) => boolean  // 禁用条件
  resetOnChange?: boolean  // 当依赖字段变化时是否重置当前字段的值，默认为 true
}

export interface ValidationRule {
  required?: boolean
  message?: string
  validator?: (value: any, formData: any) => boolean | string
  asyncValidator?: (value: any, formData: any) => Promise<boolean | string>  // 异步验证器
}

export interface SimpleFormSchema {
  fields: SimpleFieldConfig[]
  asyncInitializer?: () => Promise<any>  // 异步数据初始化器
  // 整体布局配置
  layout?: FormLayoutConfig
  // 提交按钮配置
  submitButton?: {
    text?: string
    type?: 'primary' | 'default' | 'dashed' | 'text' | 'link'
    size?: 'large' | 'middle' | 'small'
    loading?: boolean
    disabled?: boolean
    htmlType?: 'submit' | 'button' | 'reset'
  }
  // 额外按钮配置
  extraButtons?: Array<{
    text: string
    type?: 'primary' | 'default' | 'dashed' | 'text' | 'link'
    size?: 'large' | 'middle' | 'small'
    icon?: string
    loading?: boolean
    disabled?: boolean
    onClick?: () => void
  }>
}

export interface FormGroup {
  name: string
  type: 'group'
  label: string
  placeholder?: string
  required?: boolean
  options?: SelectOption[]
  props?: Record<string, any>
  rules?: ValidationRule[]
  linkage?: FieldLinkage
  tooltip?: string | {
    title: string
    placement?: 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom'
    color?: string
    overlayClassName?: string
    overlayStyle?: Record<string, any>
  }
  component?: any
  componentProps?: Record<string, any>
  // 分组特有的属性
  children: SimpleFieldConfig[]
  layout?: FieldLayoutConfig | 'vertical' | 'horizontal'
  bordered?: boolean
}

// 异步状态类型
export interface AsyncState {
  loading: boolean
  error?: string
}

// 异步操作结果
export interface AsyncResult<T = any> {
  success: boolean
  data?: T
  error?: string
}

// 字段布局配置
export interface FieldLayoutConfig {
  // 字段宽度配置
  span?: number  // 栅格占位格数 (1-24)
  offset?: number  // 栅格左侧间隔格数
  // 网格布局中的列跨度
  colSpan?: number
  // 标签配置
  labelCol?: {
    span?: number
    offset?: number
  }
  // 控件配置 
  wrapperCol?: {
    span?: number
    offset?: number
  }
  // 自定义样式
  style?: Record<string, any>
  className?: string
}

// 扩展SimpleFieldConfig以支持FormGroup
export interface SimpleFieldConfig {
  name: string
  type: string
  label: string
  placeholder?: string
  required?: boolean
  options?: SelectOption[]
  props?: Record<string, any>
  rules?: ValidationRule[]
  linkage?: FieldLinkage
  // 提示信息配置
  tooltip?: string | {
    title: string
    placement?: 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom'
    color?: string
    overlayClassName?: string
    overlayStyle?: Record<string, any>
  }
  // 自定义组件支持
  component?: any  // Vue 组件构造函数或组件对象
  componentProps?: Record<string, any>  // 传递给自定义组件的额外属性
  // 布局配置
  layout?: FieldLayoutConfig | 'vertical' | 'horizontal'
  // 分组特有属性
  children?: SimpleFieldConfig[]
  bordered?: boolean
}

// 表单整体布局配置
export interface FormLayoutConfig {
  // 布局类型
  type?: 'vertical' | 'horizontal' | 'inline' | 'grid' | 'horizontal-fields'
  // 栅格配置
  gutter?: [number, number] | number  // 水平和垂直间距
  // 每行显示的字段数量 (仅在grid布局下有效)
  columns?: number
  // 网格布局列数 (grid布局下使用，优先级高于columns)
  cols?: number
  // 标签配置
  labelAlign?: 'left' | 'right'
  labelCol?: {
    span?: number
    offset?: number
  }
  // 控件配置
  wrapperCol?: {
    span?: number
    offset?: number
  }
  // 响应式断点
  breakpoints?: {
    xs?: number  // < 576px
    sm?: number  // >= 576px
    md?: number  // >= 768px
    lg?: number  // >= 992px
    xl?: number  // >= 1200px
    xxl?: number  // >= 1600px
  }
}