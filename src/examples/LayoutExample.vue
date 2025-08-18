<template>
  <div class="layout-example">
    <h2>布局配置示例</h2>
    
    <!-- 垂直布局示例 -->
    <div class="example-section">
      <h3>1. 垂直布局（默认）</h3>
      <SimpleForm
        v-model="verticalFormData"
        :schema="verticalSchema"
        @submit="handleSubmit"
      />
    </div>

    <!-- 水平布局示例 -->
    <div class="example-section">
      <h3>2. 水平布局</h3>
      <SimpleForm
        v-model="horizontalFormData"
        :schema="horizontalSchema"
        @submit="handleSubmit"
      />
    </div>

    <!-- 内联布局示例 -->
    <div class="example-section">
      <h3>3. 内联布局</h3>
      <SimpleForm
        v-model="inlineFormData"
        :schema="inlineSchema"
        @submit="handleSubmit"
      />
    </div>

    <!-- 水平字段布局示例 -->
    <div class="example-section">
      <h3>4. 水平字段布局</h3>
      <SimpleForm
        v-model="horizontalFieldsFormData"
        :schema="horizontalFieldsSchema"
        @submit="handleSubmit"
      />
    </div>

    <!-- 网格布局示例 -->
    <div class="example-section">
      <h3>5. 网格布局</h3>
      <SimpleForm
        v-model="gridFormData"
        :schema="gridSchema"
        @submit="handleSubmit"
      />
    </div>

    <!-- 栅格系统布局示例 -->
    <div class="example-section">
      <h3>6. 栅格系统布局</h3>
      <SimpleForm
        v-model="colFormData"
        :schema="colSchema"
        @submit="handleSubmit"
      />
    </div>

    <!-- 响应式布局示例 -->
    <div class="example-section">
      <h3>7. 响应式布局</h3>
      <SimpleForm
        v-model="responsiveFormData"
        :schema="responsiveSchema"
        @submit="handleSubmit"
      />
    </div>

    <!-- 自定义字段布局示例 -->
    <div class="example-section">
      <h3>8. 自定义字段布局</h3>
      <SimpleForm
        v-model="customFieldLayoutFormData"
        :schema="customFieldLayoutSchema"
        @submit="handleSubmit"
      />
    </div>

    <!-- Gutter 间距配置示例 -->
    <div class="example-section">
      <h3>9. Gutter 间距配置示例</h3>
      <p class="section-description">
        Gutter 控制表单项之间的间距，支持统一间距或分别设置水平/垂直间距。
        合理的间距可以提升表单的可读性和美观度。
      </p>
      
      <!-- 水平布局间距对比 -->
      <div class="gutter-category">
        <h4>水平布局间距对比</h4>
        <div class="gutter-examples">
          <div class="gutter-demo compact">
            <div class="gutter-demo-header">
              <h5>紧密布局</h5>
              <code>gutter: 0</code>
              <span class="use-case">适用于信息密集表单</span>
            </div>
            <SimpleForm
              v-model="gutterCompactData"
              :schema="gutterCompactSchema"
              @submit="handleSubmit"
            />
          </div>
          
          <div class="gutter-demo standard">
            <div class="gutter-demo-header">
              <h5>标准布局</h5>
              <code>gutter: [16, 24]</code>
              <span class="use-case">推荐的默认设置</span>
            </div>
            <SimpleForm
              v-model="gutterStandardData"
              :schema="gutterStandardSchema"
              @submit="handleSubmit"
            />
          </div>
          
          <div class="gutter-demo relaxed">
            <div class="gutter-demo-header">
              <h5>宽松布局</h5>
              <code>gutter: [32, 48]</code>
              <span class="use-case">适用于重要表单</span>
            </div>
            <SimpleForm
              v-model="gutterRelaxedData"
              :schema="gutterRelaxedSchema"
              @submit="handleSubmit"
            />
          </div>
        </div>
      </div>
      
      <!-- 垂直布局间距对比 -->
      <div class="gutter-category">
        <h4>垂直布局间距对比</h4>
        <div class="gutter-examples vertical-examples">
          <div class="gutter-demo">
            <div class="gutter-demo-header">
              <h5>紧密垂直</h5>
              <code>gutter: [0, 8]</code>
            </div>
            <SimpleForm
              v-model="gutterVerticalCompactData"
              :schema="gutterVerticalCompactSchema"
              @submit="handleSubmit"
            />
          </div>
          
          <div class="gutter-demo">
            <div class="gutter-demo-header">
              <h5>宽松垂直</h5>
              <code>gutter: [0, 32]</code>
            </div>
            <SimpleForm
              v-model="gutterVerticalRelaxedData"
              :schema="gutterVerticalRelaxedSchema"
              @submit="handleSubmit"
            />
          </div>
        </div>
      </div>
      
      <!-- 内联布局间距对比 -->
      <div class="gutter-category">
        <h4>内联布局间距对比</h4>
        <div class="gutter-examples inline-examples">
          <div class="gutter-demo">
            <div class="gutter-demo-header">
              <h5>紧密内联</h5>
              <code>gutter: 8</code>
            </div>
            <SimpleForm
              v-model="gutterInlineCompactData"
              :schema="gutterInlineCompactSchema"
              @submit="handleSubmit"
            />
          </div>
          
          <div class="gutter-demo">
            <div class="gutter-demo-header">
              <h5>宽松内联</h5>
              <code>gutter: 24</code>
            </div>
            <SimpleForm
              v-model="gutterInlineRelaxedData"
              :schema="gutterInlineRelaxedSchema"
              @submit="handleSubmit"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SimpleForm from '../components/SimpleForm.vue'
import type { SimpleFormSchema } from '../types/form'

// 表单数据
const verticalFormData = ref({})
const horizontalFormData = ref({})
const inlineFormData = ref({})
const horizontalFieldsFormData = ref({})
const gridFormData = ref({})
const colFormData = ref({})
const responsiveFormData = ref({})
const customFieldLayoutFormData = ref({})

// Gutter 示例数据
const gutterCompactData = ref({})
const gutterStandardData = ref({})
const gutterRelaxedData = ref({})
const gutterVerticalCompactData = ref({})
const gutterVerticalRelaxedData = ref({})
const gutterInlineCompactData = ref({})
const gutterInlineRelaxedData = ref({})



// 1. 垂直布局示例
const verticalSchema: SimpleFormSchema = {
  layout: {
    type: 'vertical',
    labelAlign: 'left',
    gutter: [16, 24] // 水平16px，垂直24px
  },
  fields: [
    {
      name: 'name',
      type: 'input',
      label: '姓名',
      placeholder: '请输入姓名',
      required: true
    },
    {
      name: 'age',
      type: 'number',
      label: '年龄',
      placeholder: '请输入年龄'
    },
    {
      name: 'email',
      type: 'input',
      label: '邮箱',
      placeholder: '请输入邮箱'
    }
  ]
}

// 2. 水平布局示例
const horizontalSchema: SimpleFormSchema = {
  layout: {
    type: 'horizontal',
    labelAlign: 'right',
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
    gutter: [12, 16] // 标签和控件间距12px，垂直间距16px
  },
  fields: [
    {
      name: 'username',
      type: 'input',
      label: '用户名',
      placeholder: '请输入用户名',
      required: true
    },
    {
      name: 'password',
      type: 'input',
      label: '密码',
      placeholder: '请输入密码',
      props: { type: 'password' }
    },
    {
      name: 'role',
      type: 'select',
      label: '角色',
      placeholder: '请选择角色',
      options: [
        { label: '管理员', value: 'admin' },
        { label: '用户', value: 'user' },
        { label: '访客', value: 'guest' }
      ]
    }
  ]
}

// 3. 内联布局示例（参考 Ant Design Vue）
const inlineSchema: SimpleFormSchema = {
  layout: {
    type: 'inline',
    gutter: 8 // 与 Ant Design Vue 内联表单风格对齐，紧凑间距
  },
  fields: [
    {
      name: 'username',
      type: 'input',
      label: '用户名',
      placeholder: '请输入用户名',
      rules: [{ required: true, message: '请输入用户名' }]
    },
    {
      name: 'password',
      type: 'input',
      label: '密码',
      placeholder: '请输入密码',
      props: { type: 'password' },
      rules: [{ required: true, message: '请输入密码' }]
    },
    {
      name: 'remember',
      type: 'checkbox',
      label: '',
      props: { label: '记住我' }
    }
  ]
}

// 4. 水平字段布局示例（字段水平排列）
const horizontalFieldsSchema: SimpleFormSchema = {
  layout: {
    type: 'horizontal-fields'
  },
  fields: [
    {
      name: 'startDate',
      type: 'date',
      label: '开始日期',
      placeholder: '选择开始日期'
    },
    {
      name: 'endDate', 
      type: 'date',
      label: '结束日期',
      placeholder: '选择结束日期'
    },
    {
      name: 'department',
      type: 'select',
      label: '部门',
      placeholder: '选择部门',
      options: [
        { label: '技术部', value: 'tech' },
        { label: '产品部', value: 'product' },
        { label: '运营部', value: 'ops' }
      ]
    }
  ]
}

// 5. 网格布局示例
const gridSchema: SimpleFormSchema = {
  layout: {
    type: 'grid',
    columns: 2,
    gutter: [16, 16]
  },
  fields: [
    {
      name: 'firstName',
      type: 'input',
      label: '名',
      placeholder: '请输入名'
    },
    {
      name: 'lastName',
      type: 'input',
      label: '姓',
      placeholder: '请输入姓'
    },
    {
      name: 'phone',
      type: 'input',
      label: '电话',
      placeholder: '请输入电话号码'
    },
    {
      name: 'address',
      type: 'textarea',
      label: '地址',
      placeholder: '请输入详细地址',
      props: { rows: 2 }
    }
  ]
}

// 5. 栅格系统布局示例
const colSchema: SimpleFormSchema = {
  layout: {
    type: 'horizontal',
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  },
  fields: [
    {
      name: 'title',
      type: 'input',
      label: '标题',
      placeholder: '请输入标题'
    },
    {
      name: 'shortDesc',
      type: 'input',
      label: '简短描述',
      placeholder: '请输入简短描述',
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
      }
    },
    {
      name: 'content',
      type: 'textarea',
      label: '内容',
      placeholder: '请输入内容',
      props: { rows: 4 }
    }
  ]
}

// 6. 响应式布局示例
const responsiveSchema: SimpleFormSchema = {
  layout: {
    type: 'grid',
    gutter: [16, 16],
    breakpoints: {
      xs: 1,  // 手机端 1列
      sm: 1,  // 小平板 1列  
      md: 2,  // 平板 2列
      lg: 3,  // 桌面 3列
      xl: 4,  // 大屏 4列
      xxl: 4  // 超大屏 4列
    }
  },
  fields: [
    {
      name: 'field1',
      type: 'input',
      label: '字段1',
      placeholder: '字段1'
    },
    {
      name: 'field2',
      type: 'input',
      label: '字段2',
      placeholder: '字段2'
    },
    {
      name: 'field3',
      type: 'input',
      label: '字段3',
      placeholder: '字段3'
    },
    {
      name: 'field4',
      type: 'input',
      label: '字段4',
      placeholder: '字段4'
    },
    {
      name: 'field5',
      type: 'input',
      label: '字段5',
      placeholder: '字段5'
    },
    {
      name: 'field6',
      type: 'input',
      label: '字段6',
      placeholder: '字段6'
    }
  ]
}

// 7. 自定义字段布局示例
const customFieldLayoutSchema: SimpleFormSchema = {
  layout: {
    type: 'horizontal',
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
    gutter: [16, 20] // 自定义间距
  },
  fields: [
    {
      name: 'normalField',
      type: 'input',
      label: '普通字段',
      placeholder: '普通字段'
    },
    {
      name: 'customSpanField',
      type: 'input',
      label: '自定义宽度字段',
      placeholder: '占位12格',
      layout: {
        span: 12
      }
    },
    {
      name: 'offsetField',
      type: 'input',
      label: '偏移字段',
      placeholder: '偏移4格',
      layout: {
        span: 8,
        offset: 4
      }
    },
    {
      name: 'styledField',
      type: 'input',
      label: '自定义样式字段',
      placeholder: '带边框和背景',
      layout: {
        style: {
          border: '2px solid #1890ff',
          borderRadius: '8px',
          padding: '16px',
          backgroundColor: '#f6ffed'
        },
        className: 'custom-field'
      }
    }
  ]
}

// Gutter 示例基础字段 - 使用更丰富的字段类型以便观察间距效果
const gutterBaseFields = [
  {
    name: 'firstName',
    type: 'input',
    label: '姓名',
    placeholder: '请输入您的姓名',
    validation: { required: true }
  },
  {
    name: 'email',
    type: 'input',
    label: '邮箱地址',
    placeholder: '请输入邮箱地址',
    validation: { required: true, email: true }
  },
  {
    name: 'phone',
    type: 'input',
    label: '手机号码',
    placeholder: '请输入11位手机号码'
  },
  {
    name: 'department',
    type: 'select',
    label: '所属部门',
    placeholder: '请选择您的部门',
    options: [
      { label: '技术研发部', value: 'tech' },
      { label: '产品设计部', value: 'product' },
      { label: '市场运营部', value: 'marketing' },
      { label: '人事行政部', value: 'hr' }
    ]
  }
]

// 1. 紧密布局 - 无间距 (适用于信息密集的表单)
const gutterCompactSchema: SimpleFormSchema = {
  layout: {
    type: 'horizontal',
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
    gutter: 0 // 无间距，最紧密的布局
  },
  fields: gutterBaseFields
}

// 2. 标准布局 - 适中间距 (推荐的默认布局)
const gutterStandardSchema: SimpleFormSchema = {
  layout: {
    type: 'horizontal',
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
    gutter: [16, 24] // 水平16px，垂直24px间距
  },
  fields: gutterBaseFields
}

// 3. 宽松布局 - 大间距 (适用于重要表单或大屏幕)
const gutterRelaxedSchema: SimpleFormSchema = {
  layout: {
    type: 'horizontal',
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
    gutter: [32, 48] // 水平32px，垂直48px间距，更宽松舒适
  },
  fields: gutterBaseFields
}

// 额外示例：垂直布局的间距对比
const gutterVerticalCompactSchema: SimpleFormSchema = {
  layout: {
    type: 'vertical',
    gutter: [0, 8] // 垂直间距8px
  },
  fields: gutterBaseFields.slice(0, 3)
}

const gutterVerticalRelaxedSchema: SimpleFormSchema = {
  layout: {
    type: 'vertical',  
    gutter: [0, 32] // 垂直间距32px
  },
  fields: gutterBaseFields.slice(0, 3)
}

// 内联布局的间距对比
const gutterInlineFields = [
  {
    name: 'search',
    type: 'input',
    label: '搜索',
    placeholder: '输入关键词'
  },
  {
    name: 'category',
    type: 'select',
    label: '分类',
    placeholder: '选择分类',
    options: [
      { label: '全部', value: 'all' },
      { label: '新闻', value: 'news' },
      { label: '产品', value: 'product' }
    ]
  },
  {
    name: 'status',
    type: 'select',
    label: '状态',
    placeholder: '选择状态',
    options: [
      { label: '启用', value: 'active' },
      { label: '禁用', value: 'inactive' }
    ]
  }
]

const gutterInlineCompactSchema: SimpleFormSchema = {
  layout: {
    type: 'inline',
    gutter: 8 // 内联间距8px，紧密排列
  },
  fields: gutterInlineFields
}

const gutterInlineRelaxedSchema: SimpleFormSchema = {
  layout: {
    type: 'inline',
    gutter: 24 // 内联间距24px，宽松排列
  },
  fields: gutterInlineFields
}



const handleSubmit = (data: any) => {
  console.log('表单提交数据:', data)
  // 在实际应用中，这里会处理表单提交逻辑
}


</script>

<style scoped>
.layout-example {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.example-section {
  margin-bottom: 48px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 24px;
  background: #fafafa;
}

.example-section h3 {
  margin-top: 0;
  margin-bottom: 24px;
  color: #262626;
  font-size: 16px;
  font-weight: 600;
}

/* 自定义字段样式 */
:deep(.custom-field) {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* Gutter 示例样式 */
.section-description {
  color: #666;
  font-size: 14px;
  margin-bottom: 24px;
  line-height: 1.5;
}

.gutter-category {
  margin-bottom: 32px;
}

.gutter-category h4 {
  color: #1890ff;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
  border-left: 4px solid #1890ff;
  padding-left: 12px;
}

.gutter-examples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.vertical-examples {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

/* 为内联布局演示指定更大的最小宽度，避免小屏规则将其呈现为垂直布局 */
.inline-examples {
  grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
}

.gutter-demo {
  border: 2px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  transition: all 0.3s ease;
}

.gutter-demo:hover {
  border-color: #d9d9d9;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.gutter-demo.compact {
  border-color: #ff7875;
}

.gutter-demo.standard {
  border-color: #52c41a;
}

.gutter-demo.relaxed {
  border-color: #1890ff;
}

.gutter-demo-header {
  background: #f8f9fa;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.gutter-demo-header h5 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.gutter-demo-header code {
  background: #f5f5f5;
  color: #d4691a;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.gutter-demo-header .use-case {
  color: #666;
  font-size: 12px;
  margin-left: auto;
}

.gutter-demo .simple-form {
  padding: 20px;
}

/* 为不同布局类型添加视觉指示器 */
.gutter-demo.compact .gutter-demo-header {
  background: linear-gradient(135deg, #fff2f0 0%, #fff7f6 100%);
}

.gutter-demo.standard .gutter-demo-header {
  background: linear-gradient(135deg, #f6ffed 0%, #fcffe6 100%);
}

.gutter-demo.relaxed .gutter-demo-header {
  background: linear-gradient(135deg, #e6f7ff 0%, #f0f5ff 100%);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .gutter-examples {
    grid-template-columns: 1fr;
  }
  
  .gutter-demo-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .gutter-demo-header .use-case {
    margin-left: 0;
  }
}
</style>