### ProForm 高级表单

基于 ant-design-vue 的查询表单封装，支持多种输入控件、收起/展开、工具栏、双日期字段拆分、初始值、受控查询与重置、以及与 `ProTable` 的无缝联动。

[ProFormApi使用参考链接](https://procomponents.ant.design/components/form)

---

## 安装前置
- 依赖：`vue`, `ant-design-vue`, `@ant-design/icons-vue`

---

## 基本用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import ProForm from '@/components/ProForm'
import type { TableColumnsType } from '@/components/ProTable/types'

const loading = ref(false)

const columns: TableColumnsType = [
  { title: '名称', dataIndex: 'name', valueType: 'input', initialValue: '' },
  { title: '状态', dataIndex: 'status', valueType: 'select', options: [
    { label: '启用', value: 1 },
    { label: '停用', value: 0 }
  ]},
  { title: '日期', dataIndex: 'date', valueType: 'datePicker' },
]

function handleQuery(values: Record<string, any>) {
  loading.value = true
  // 请求... 完成后置为 false
  setTimeout(() => loading.value = false, 800)
}

function handleReset() {
  // 自定义重置逻辑（可选）
}
</script>

<template>
  <ProForm
    :formListData="columns"
    :search="{ colSpan: 8, labelWidth: 80 }"
    :queryLoading="loading"
    @query="handleQuery"
    @reset="handleReset"
  />
  <!-- 你的表格/列表 -->
  <div style="margin-top: 12px">内容区</div>
  
</template>
```

---

## 属性（Props）

- `formListData?: TableColumnsType`
  - 描述查询项配置（与 `ProTable.columns` 复用）；支持 `valueType`、`options`、`initialValue`、`formItemProps`、`fieldProps` 等。
- `search?: SearchConfig`
  - 查询区域配置：
  - `searchText?` 查询按钮文本；`resetText?` 重置按钮文本；`labelWidth?` 标签宽度；`colSpan?` 每项所占栅格；`isCollapsed?` 默认是否收起；`isShowDefaultReset?` 是否显示重置；`isShowDefaultQuery?` 是否显示查询；`isShowDefaultCollapsed?` 是否显示折叠；`toolBarRender?` 自定义工具栏渲染。
- `isShowToolRender?: boolean`
  - 是否渲染默认工具栏区域（包含折叠、查询、重置与 `toolBarRender`）。
- `queryLoading?: boolean`
  - 查询按钮 `loading` 状态。
- 其余 `FormProps` 透传至 `ant-design-vue` 的 `Form`。

---

## 事件（Emits）

- `@query(values: Record<string, any>)`
  - 点击“查询”时触发，返回当前所有表单值。
- `@reset()`
  - 点击“重置”时触发。
- `@collapsed(isCollapsed: boolean)`
  - 点击收起/展开时触发。

---

## 暴露方法（Expose）

通过 `ref` 可拿到：

```ts
interface FormInstance {
  setFieldsValue: (val: Record<string, any>) => void
  formRef: {
    getFieldsValue: () => Record<string, any>
    resetFields: () => void
    validateFields: (...args: any[]) => Promise<any>
  }
}
```

使用示例：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import ProForm from '@/components/ProForm'
import type { FormInstance } from '@/components/ProForm/types'

const formRef = ref<FormInstance>()

function fill() {
  formRef.value?.setFieldsValue({ name: '预填名称' })
}
</script>

<template>
  <ProForm ref="formRef" :formListData="[]" @query="() => {}" />
  <a-button @click="fill">一键填充</a-button>
</template>
```

---

## 查询项（columns）配置要点

- `valueType`
  - 支持：`input` | `inputSearch` | `inputSearchFillIn` | `textarea` | `inputNumber` | `select` | `datePicker` | `monthPicker` | `quarterPicker` | `rangePicker` | `weekPicker` | `yearPicker` | `radio` | `checkbox` | `switch` | `timePicker` | `upload` | `treeSelect` | `cascader` | `doubleDatePicker`。
- `options`
  - 适用于 `select` / `treeSelect` / `cascader` 等。
- `initialValue`
  - 初始值。`doubleDatePicker` 下可结合 `doubleFieldList` 将一个字段拆分为两个独立日期字段。
- `formItemProps`
  - 透传到 `a-form-item` 的属性。
- `fieldProps`
  - 具体控件的属性，如 `InputProps`、`SelectProps` 等；支持扩展 `onSelfChange`、`style`、`uploadText` 等。

示例：

```ts
const columns = [
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    valueType: 'doubleDatePicker',
    doubleFieldList: ['createdAtStart', 'createdAtEnd'],
    fieldProps: { type: 'datePicker', componentProps: { placement: 'bottomRight' } }
  }
]
```

---

## 与 ProTable 联动

在 `ProTable` 中传入 `search` 与 `columns` 后，会自动渲染 `ProForm` 作为查询区域；`ProForm` 的 `@query` 与 `@reset` 会触发表格数据请求或重置。

最简联动：见 `../ProTable/README.md` 示例。

---

## 进阶技巧

- 复制选项：`select` 且 `showSearch` 时，选择后会自动将 label 复制到剪贴板。
- `isShowToolRender` 为 `false` 时可完全自定义工具栏（通过 `search.toolBarRender`）。


