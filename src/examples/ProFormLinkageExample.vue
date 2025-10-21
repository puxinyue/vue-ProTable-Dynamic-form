<template>
  <div class="proform-linkage-example">
    <h2>ProForm 联动示例</h2>
    <p>展示字段值依赖和接口依赖的联动效果</p>
    
    <div class="example-section">
      <h3>1. 基础联动（地区 → 区域）</h3>
      <ProForm
        ref="basicFormRef"
        :formListData="basicFormData"
        :search="{
          searchText: '查询',
          resetText: '重置',
          colSpan: 8
        }"
        @query="handleQuery"
        @reset="handleReset"
      />
    </div>

    <div class="example-section">
      <h3>2. 接口依赖联动（组织 → 部门 → 用户）</h3>
      <ProForm
        ref="apiFormRef"
        :formListData="apiFormData"
        :search="{
          searchText: '查询',
          resetText: '重置',
          colSpan: 8
        }"
        @query="handleApiQuery"
        @reset="handleApiReset"
      />
    </div>

    <div class="example-section">
      <h3>3. 复杂联动（产品类型 → 产品 → 规格）</h3>
      <ProForm
        ref="complexFormRef"
        :formListData="complexFormData"
        :search="{
          searchText: '查询',
          resetText: '重置',
          colSpan: 8
        }"
        @query="handleComplexQuery"
        @reset="handleComplexReset"
      />
    </div>

    <div class="result-section">
      <h3>查询结果</h3>
      <pre>{{ JSON.stringify(queryResult, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { ref } from 'vue'
import ProForm from '@/components/ProForm/index.tsx'
import type { TableColumnsType } from '@/components/ProTable/types'

// 查询结果
const queryResult = ref({})

// 1. 基础联动表单数据
const basicFormData: TableColumnsType = [
  {
    title: '地区',
    dataIndex: 'region',
    valueType: 'select',
    options: [
      { label: '北京', value: 'beijing' },
      { label: '上海', value: 'shanghai' },
      { label: '广州', value: 'guangzhou' },
      { label: '深圳', value: 'shenzhen' }
    ]
  },
  {
    title: '区域',
    dataIndex: 'area',
    valueType: 'select',
    options:[],
    optionsSource: {
      key: 'areas',
      url: '/api/areas',
      dependsOnFields: ['region'],
      params: (ctx) => ({ region: ctx.values.region }),
      transform: (resp) => {
        // 直接使用接口返回的数据
        return resp.data || []
      },
      resetOnChange: true,
      debounceMs: 300
    }
  },
  {
    title: '详细地址',
    dataIndex: 'address',
    valueType: 'input',
    fieldProps: {
      type: 'input',
      componentProps: {
        placeholder: '请输入详细地址'
      }
    }
  }
]

// 2. 接口依赖联动表单数据
const apiFormData: TableColumnsType = [
  {
    title: '组织',
    dataIndex: 'orgId',
    valueType: 'select',
    options: [],
    optionsSource: {
      key: 'orgs',
      url: '/api/orgs',
      immediate: true,
      transform: (resp) => resp.data.map((org: any) => ({ label: org.name, value: org.id }))
    }
  },
  {
    title: '部门',
    dataIndex: 'deptId',
    valueType: 'select',
    options: [],
    optionsSource: {
      key: 'depts',
      url: '/api/departments',
      dependsOnFields: ['orgId'],
      dependsOnRequests: ['orgs'],
      params: (ctx) => ({ 
        orgId: ctx.values.orgId,
        // 也可以从其他接口结果获取默认值
        fallbackOrgId: ctx.requestResults.orgs?.data?.[0]?.id 
      }),
      transform: (resp) => resp.data.map((dept: any) => ({ label: dept.name, value: dept.id })),
      resetOnChange: true,
      debounceMs: 200
    }
  },
  {
    title: '用户',
    dataIndex: 'userId',
    valueType: 'select',
    options: [],
    optionsSource: {
      key: 'users',
      url: '/api/users',
      dependsOnFields: ['deptId'],
      dependsOnRequests: ['depts'],
      params: (ctx) => ({ 
        deptId: ctx.values.deptId,
        orgId: ctx.values.orgId 
      }),
      transform: (resp) => resp.data.map((user: any) => ({ label: user.label, value: user.value })),
      resetOnChange: true,
      debounceMs: 200,
      cacheKey: (ctx) => `users:${ctx.values.orgId}:${ctx.values.deptId}`
    }
  }
]

// 3. 复杂联动表单数据
const complexFormData: TableColumnsType = [
  {
    title: '产品类型',
    dataIndex: 'productType',
    valueType: 'select',
    options: [],
    optionsSource: {
      key: 'productTypes',
      url: '/api/product-types',
      immediate: true,
      transform: (resp) => resp.data.map((type: any) => ({ label: type.name, value: type.id }))
    }
  },
  {
    title: '产品',
    dataIndex: 'productId',
    valueType: 'select',
    options: [],
    optionsSource: {
      key: 'products',
      url: '/api/products',
      dependsOnFields: ['productType'],
      params: (ctx) => ({ typeId: ctx.values.productType }),
      transform: (resp) => resp.data.map((product: any) => ({ label: product.name, value: product.id })),
      resetOnChange: true,
      debounceMs: 300
    }
  },
  {
    title: '规格',
    dataIndex: 'specId',
    valueType: 'select',
    options: [],
    optionsSource: {
      key: 'specs',
      url: '/api/specs',
      dependsOnFields: ['productId'],
      dependsOnRequests: ['products'],
      params: (ctx) => ({ 
        productId: ctx.values.productId,
        typeId: ctx.values.productType 
      }),
      transform: (resp) => resp.data.map((spec: any) => ({ label: spec.name, value: spec.id })),
      resetOnChange: true,
      debounceMs: 200
    }
  },
  {
    title: '数量',
    dataIndex: 'quantity',
    valueType: 'inputNumber',
    fieldProps: {
      type: 'inputNumber',
      componentProps: {
        placeholder: '请输入数量'
      }
    }
  }
]

// 表单引用
const basicFormRef = ref()
const apiFormRef = ref()
const complexFormRef = ref()

// 事件处理
const handleQuery = (values: any) => {
  queryResult.value = { type: '基础联动', ...values }
  console.log('基础联动查询:', values)
}

const handleReset = () => {
  queryResult.value = {}
  console.log('基础联动重置')
}

const handleApiQuery = (values: any) => {
  queryResult.value = { type: '接口依赖联动', ...values }
  console.log('接口依赖联动查询:', values)
}

const handleApiReset = () => {
  queryResult.value = {}
  console.log('接口依赖联动重置')
}

const handleComplexQuery = (values: any) => {
  queryResult.value = { type: '复杂联动', ...values }
  console.log('复杂联动查询:', values)
}

const handleComplexReset = () => {
  queryResult.value = {}
  console.log('复杂联动重置')
}

// 现在使用真实的后端接口，通过 Vite 代理到 localhost:4000
</script>

<style scoped>
.proform-linkage-example {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.example-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background: #fafafa;
}

.example-section h3 {
  margin-top: 0;
  color: #1890ff;
  border-bottom: 2px solid #1890ff;
  padding-bottom: 8px;
}

.result-section {
  margin-top: 20px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.result-section pre {
  background: #fff;
  padding: 16px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.5;
}
</style>
