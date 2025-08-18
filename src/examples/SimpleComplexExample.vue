<template>
  <div class="simple-complex-example">
    <div class="example-header">
      <h2>简化复杂表单示例</h2>
      <p>展示嵌套分组、字段验证和复杂联动功能</p>
    </div>
    
    <div class="example-content">
      <div class="form-container">
        <SimpleForm
          v-model="formData"
          :schema="schema"
          @submit="handleSubmit"
          @change="handleChange"
          @validate="handleValidate"
        />
      </div>
      
      <div class="data-display">
        <div class="data-title">
          实时数据
        </div>
        <pre class="data-content">{{ JSON.stringify(formData, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { SimpleFormSchema, FormGroup } from '../types/form'
import SimpleForm from '../components/SimpleForm.vue'

// 表单数据
const formData = ref({})

// 表单配置
const schema: SimpleFormSchema = {
  fields: [
    {
      name: 'basicInfo',
      type: 'group',
      label: '基本信息',
      bordered: true,
      layout: 'vertical',
      props: {
        description: '项目的基本信息'
      },
      children: [
        {
          name: 'projectName',
          type: 'input',
          label: '项目名称',
          placeholder: '请输入项目名称',
          rules: [{ required: true, message: '项目名称为必填项' }]
        },
        {
          name: 'projectType',
          type: 'select',
          label: '项目类型',
          placeholder: '请选择项目类型',
          options: [
            { label: 'Web应用', value: 'web' },
            { label: '移动应用', value: 'mobile' },
            { label: '桌面应用', value: 'desktop' },
            { label: 'API服务', value: 'api' }
          ],
          rules: [{ required: true, message: '请选择项目类型' }]
        },
        {
          name: 'priority',
          type: 'radio',
          label: '优先级',
          options: [
            { label: '高', value: 'high' },
            { label: '中', value: 'medium' },
            { label: '低', value: 'low' }
          ],
          rules: [{ required: true, message: '请选择优先级' }]
        },
        {
          name: 'budget',
          type: 'number',
          label: '预算(万元)',
          placeholder: '请输入预算',
          props: {
            min: 0,
            max: 1000,
            step: 0.1,
            precision: 1
          }
        },
        {
          name: 'description',
          type: 'textarea',
          label: '项目描述',
          placeholder: '请输入项目描述',
          props: {
            rows: 4,
            maxLength: 500,
            showCount: true
          }
        }
      ]
    } as FormGroup,
    
    {
      name: 'schedule',
      type: 'group',
      label: '时间安排',
      bordered: true,
      children: [
        {
          name: 'startDate',
          type: 'date',
          label: '开始日期',
          placeholder: '请选择开始日期',
          rules: [{ required: true, message: '请选择开始日期' }]
        },
        {
          name: 'endDate',
          type: 'date',
          label: '结束日期',
          placeholder: '请选择结束日期',
          rules: [{ required: true, message: '请选择结束日期' }]
        },
        {
          name: 'isUrgent',
          type: 'checkbox',
          label: '紧急项目',
          props: {
            label: '该项目为紧急项目'
          }
        }
      ]
    } as FormGroup,

    {
      name: 'techStack',
      type: 'group',
      label: '技术栈选择',
      bordered: true,
      linkage: {
        dependsOn: 'basicInfo.projectType',
        visibleWhen: (value, formData) => !!formData.basicInfo?.projectType
      },
      children: [
        {
          name: 'frontend',
          type: 'select',
          label: '前端技术',
          placeholder: '请选择前端技术',
          linkage: {
            dependsOn: 'basicInfo.projectType',
            optionsMap: {
              web: [
                { label: 'Vue.js', value: 'vue' },
                { label: 'React', value: 'react' },
                { label: 'Angular', value: 'angular' }
              ],
              mobile: [
                { label: 'React Native', value: 'rn' },
                { label: 'Flutter', value: 'flutter' },
                { label: 'Ionic', value: 'ionic' }
              ],
              desktop: [
                { label: 'Electron', value: 'electron' },
                { label: 'Tauri', value: 'tauri' },
                { label: 'Qt', value: 'qt' }
              ]
            }
          }
        },
        {
          name: 'backend',
          type: 'select',
          label: '后端技术',
          placeholder: '请选择后端技术',
          options: [
            { label: 'Node.js', value: 'nodejs' },
            { label: 'Python', value: 'python' },
            { label: 'Java', value: 'java' },
            { label: 'Go', value: 'go' }
          ]
        },
        {
          name: 'database',
          type: 'select',
          label: '数据库',
          placeholder: '请选择数据库',
          options: [
            { label: 'MySQL', value: 'mysql' },
            { label: 'PostgreSQL', value: 'postgresql' },
            { label: 'MongoDB', value: 'mongodb' },
            { label: 'Redis', value: 'redis' }
          ]
        }
      ]
    } as FormGroup,

    {
      name: 'approval',
      type: 'group',
      label: '审批设置',
      children: [
        {
          name: 'needApproval',
          type: 'checkbox',
          label: '需要审批',
          props: {
            label: '该项目需要经过审批流程'
          }
        },
        {
          name: 'approver',
          type: 'input',
          label: '审批人',
          placeholder: '请输入审批人姓名',
          linkage: {
            dependsOn: 'approval.needApproval',
            visibleWhen: (value, formData) => formData.approval?.needApproval === true
          },
          rules: [{ required: true, message: '请输入审批人姓名' }]
        }
      ]
    } as FormGroup
  ]
}

// 处理表单提交
const handleSubmit = (data: any) => {
  console.log('表单提交:', data)
  alert('表单提交成功！请查看控制台输出')
}

// 处理表单变化
const handleChange = (data: any) => {
  console.log('表单变化:', data)
}

// 处理表单验证
const handleValidate = (isValid: boolean, errors: Record<string, string>) => {
  console.log('表单验证:', { isValid, errors })
}
</script>

<style scoped>
.simple-complex-example {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.example-header {
  margin-bottom: 24px;
}

.example-header h2 {
  margin: 0 0 8px 0;
  color: #262626;
}

.example-header p {
  margin: 0;
  color: #8c8c8c;
  font-size: 14px;
}

.example-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
}

.form-container {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #d9d9d9;
}

.data-display {
  background: #fafafa;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #d9d9d9;
}

.data-title {
  margin-bottom: 12px;
  font-weight: 600;
  color: #262626;
}

.data-content {
  background: #fff;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  font-size: 12px;
  overflow-x: auto;
  max-height: 600px;
  overflow-y: auto;
}
</style>