### ProTable 高级表格

基于 ant-design-vue Table 的业务增强：内置与 `ProForm` 的联动、分页/请求驱动、虚拟滚动、列设置、复制/省略号、右键菜单、行拖拽排序、批量选择复制、可搜索标题工具栏等。

[ProTableApi使用参考链接](https://procomponents.ant.design/components/table?tab=api&current=1&pageSize=5)
---

## 安装前置
- 依赖：`vue`, `ant-design-vue`, `@ant-design/icons-vue`

---

## 快速开始（带查询）

```vue
<script setup lang="ts">
import { ref } from 'vue'
import ProTable from '@/components/ProTable'
import type { PMProTableProps, TableColumnsType } from '@/components/ProTable/types'

const columns: TableColumnsType = [
  { title: 'ID', dataIndex: 'id', width: 80, valueType: 'inputNumber', hideInSearch: true },
  { title: '名称', dataIndex: 'name', valueType: 'input' },
  { title: '状态', dataIndex: 'status', valueType: 'select', options: [
    { label: '启用', value: 1 },
    { label: '停用', value: 0 }
  ]},
  { title: '备注', dataIndex: 'remark', ellipsis: true, copy: true, hideInSearch: true },
]

async function request(params: any) {
  // 与后端对接：params 包含分页与表单值
  // 这里示例直接返回本地数据
  const data = Array.from({ length: 37 }).map((_, i) => ({ id: i + 1, name: `Name-${i+1}`, status: i % 2, remark: '这是一段很长很长的备注文本...' }))
  const { page = 1, limit = 10 } = params
  const start = (page - 1) * limit
  return {
    data: data.slice(start, start + limit),
    total: data.length
  }
}

function onQuery(values: Record<string, any>) {
  // 点击查询回调（可选），真实请求由组件内部触发
  console.log('query values', values)
}

const tableProps: PMProTableProps = {
  rowKey: 'id',
  columns,
  request,
  search: { colSpan: 8, labelWidth: 80 },
  isShowColumnSetting: true,
}
</script>

<template>
  <ProTable v-bind="tableProps" @query="onQuery" />
</template>
```

---

## 属性（Props）

- `columns?: TableColumnsType`
  - 表头/搜索项的统一配置。字段详见“列配置”。
- `request?: (params) => Promise<{ data?: any[]; total?: number }>`
  - 请求驱动模式。内部会自动注入分页与表单值；返回 `data` 与 `total`。
- `isInitRequest?: boolean`（默认 true）
  - 是否挂载后自动发送一次请求；为 `false` 时首次显示“请手动点击查询”。
- `search?: false | SearchConfig`
  - 若为对象则渲染联动的 `ProForm`。`false` 则不渲染搜索区域。
- `formProps?: FormProps`
  - 透传至内部 `ProForm` 的 `Form`。
- `isVirtual?: boolean`（默认 false）
  - 开启虚拟滚动，使用内置 `VirtualList` 渲染大量数据。
- `rowHeight?: number`（默认 26）
  - 虚拟滚动行高。
- `tableHeader?: number`
  - 表头高度修正（个别场景用于计算滚动高度）。
- `isSerialNumber?: boolean`
  - 自动在首列插入“序号”。
- `toolBarRender?: () => JSX.Element[] | JSX.Element`
  - 表格右上工具栏内容。
- `isShowColumnSetting?: boolean`（默认 true）
  - 是否展示列设置。
- `isSearch?: boolean`（默认 true）
  - 虚拟表格下是否展示标题处的全局搜索框。
- `cellBGC?: boolean`
  - 是否开启单元格点击背景高亮。
- `defaultScroll?: boolean`
  - 是否默认开启纵向滚动（虚拟表格与手动指定高度时常用）。
- `isRightMenu?: boolean`
  - 是否启用行右键菜单。
- `dragRow?: { column?: PMColumnType; onDragSortEnd?: (beforeIndex, afterIndex, newDataSource) => void }`
  - 开启行拖拽排序。
- `fileNames?: { current: string; pageSize: string }`
  - 自定义分页字段名。
- 其它 `TableProps` 透传至 `ant-design-vue` 的 `Table`。

---

## 事件（Emits）

- `@reset()`
  - 点击查询区“重置”触发，表格也会恢复初始数据。
- `@query(values, callback)`
  - 点击查询区“查询”触发，内部会自动调用 `request(values)` 刷新数据。
- `@filterListChange(filterList)`
  - 可搜索/表头筛选时返回筛选后的数据（主要用于虚拟滚动模式）。

---

## 插槽（Slots）

- 表格 `title` 槽位已内置并复用：包含工具栏、列设置、可搜索框（在虚拟模式开启且 `isSearch` 为 `true` 时）。
- `customFilterDropdown`
  - 自定义表头筛选弹层内容，入参为 `FilterDropdownProps`。

---

## 暴露方法（Expose）

```ts
interface PMProTableInstance {
  reload: () => void
  tQProFormRef: FormInstance
  heightY: number
}
```

示例：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import ProTable from '@/components/ProTable'
import type { PMProTableInstance } from '@/components/ProTable/types'

const tableRef = ref<PMProTableInstance>()

function refresh() {
  tableRef.value?.reload()
}
</script>

<template>
  <ProTable ref="tableRef" :columns="[]" :request="async () => ({ data: [], total: 0 })" />
  <a-button @click="refresh">刷新</a-button>
</template>
```

---

## 列配置（Columns）常用字段

- `valueType`
  - 同 `ProForm`，决定筛选控件类型（`input`/`select`/`datePicker`/...）。
- `hideInSearch` / `hideInTable`
  - 分别控制列是否参与查询区/表格显示。
- `ellipsis` + `copy`
  - 自动省略与复制功能（非虚拟模式下）。
- `valueIsNumber`
  - 未自定义渲染时，数值类右对齐并保留两位小数。
- `virtualSort`
  - 虚拟模式下内置排序开关；支持 `{ isFieldDate: true }` 处理日期字段（如 `20200918`）。
- `customFilters`
  - 虚拟模式下自定义表头筛选项数据，未传入时会根据源数据自动推导。
- `idx`
  - 内部使用的列序标识。

---

## 虚拟滚动模式要点（isVirtual = true）

- 使用内置 `VirtualList` 渲染大数据集；`rowHeight` 决定行高。
- 表头筛选、全局搜索、排序均在前端进行，`request` 一次性返回全量数据更合适。
- 选择列在虚拟模式下会自动补齐（当 `rowSelection` 开启时）。

---

## VirtualList 使用说明

当 `ProTable` 设置 `isVirtual = true` 时，内部将启用 `VirtualList` 进行前端虚拟渲染，并关闭分页（`pagination=false`）。推荐让后端一次性返回全部数据，筛选/搜索/排序在前端完成。

### 最小可运行示例（前端虚拟渲染）

```vue
<script setup lang="ts">
import ProTable from '@/components/ProTable'
import type { TableColumnsType, PMProTableProps } from '@/components/ProTable/types'

const columns: TableColumnsType = [
  { title: '姓名', dataIndex: 'name' },
  { title: '部门', dataIndex: 'dept', valueType: 'select', options: [
    { label: '研发', value: 'RD' },
    { label: '测试', value: 'QA' },
    { label: '产品', value: 'PM' },
  ], customFilters: ['RD','QA','PM'] },
  { title: '入职日期', dataIndex: 'hireDate', virtualSort: { isFieldDate: true } },
]

// 一次性返回全量数据（不分页）
async function request() {
  const data = Array.from({ length: 5000 }).map((_, i) => ({
    id: i + 1,
    name: `用户-${i + 1}`,
    dept: ['RD','QA','PM'][i % 3],
    hireDate: `20200${(i % 9) + 1}1` // 例：20200101（支持 virtualSort 日期处理）
  }))
  return { data, total: data.length }
}

const props: PMProTableProps = {
  rowKey: 'id',
  columns,
  request,
  isVirtual: true,
  rowHeight: 28,
  classKey: 'employee-list', // 建议提供，避免横向滚动在特定场景异常
  search: { colSpan: 8, labelWidth: 80 },
  // 默认会根据容器动态计算 scroll.y；如计算不准，可手动指定：
  // scroll: { y: 560 }
}
</script>

<template>
  <ProTable v-bind="props" />
</template>
```

### 常见配置与注意点

- **高度与行高**
  - `rowHeight`：单行高度，需与单元格样式一致以获得最佳滚动体验。
  - `scroll.y`：默认交由组件内部计算（结合查询区高度、窗口高度）；如果出现计算偏差，可手动传入固定高度。
  - `classKey`：建议提供稳定值，减少某些场景下横向滚动定位误差。

- **筛选与搜索**
  - 表头筛选：优先使用列的 `customFilters`（未提供时组件会根据源数据自动推导去重后的选项）。
  - 标题全局搜索：开启虚拟模式且 `isSearch` 为 `true` 时，在表格标题右上角显示“可搜索数据”的搜索框，模糊匹配整行任意字段。

- **排序**
  - 开启 `virtualSort` 后，点击列头内置的上下箭头完成前端排序；日期字段可设置 `{ isFieldDate: true }` 以支持 `YYYYMMDD` 字符串的比较。

- **选择列**
  - 当 `rowSelection` 开启时，虚拟模式会自动在最左侧补齐多选列，并维护 `selectedRowKeys`。支持单选（`type: 'radio'`）与多选。

- **请求模式**
  - 虚拟模式推荐后端一次性返回全量数据；组件会将筛选/搜索/排序后的结果回传给 `@filterListChange`，便于外部需要时同步获知。

### 与查询表单联动（虚拟模式）

```vue
<script setup lang="ts">
import ProTable from '@/components/ProTable'
import type { TableColumnsType } from '@/components/ProTable/types'

const columns: TableColumnsType = [
  { title: '名称', dataIndex: 'name', valueType: 'input' },
  { title: '部门', dataIndex: 'dept', valueType: 'select', options: [
    { label: '研发', value: 'RD' },
    { label: '测试', value: 'QA' },
  ]},
]

async function request(params: any) {
  // params 为表单值（虚拟模式下不关注分页），返回全量数据
  const all = Array.from({ length: 2000 }).map((_, i) => ({ id: i + 1, name: `Name-${i+1}`, dept: i % 2 ? 'RD' : 'QA' }))
  // 服务器可根据 params 进行一次性筛选后返回全量结果
  return { data: all, total: all.length }
}
</script>

<template>
  <ProTable :columns="columns" :request="request" :isVirtual="true" :rowHeight="28" :search="{ colSpan: 8 }" />
</template>
```


## 简单纯前端表格（无请求）

```vue
<script setup lang="ts">
import ProTable from '@/components/ProTable'
import type { TableColumnsType } from '@/components/ProTable/types'

const columns: TableColumnsType = [
  { title: '姓名', dataIndex: 'name' },
  { title: '年龄', dataIndex: 'age', valueIsNumber: true },
]

const data = [
  { id: 1, name: '张三', age: 18 },
  { id: 2, name: '李四', age: 28 },
]
</script>

<template>
  <ProTable :columns="columns" :dataSource="data" :search="false" />
</template>
```


