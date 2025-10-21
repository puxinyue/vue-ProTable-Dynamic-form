<script lang="tsx">
import { defineComponent, ref, reactive, computed, onMounted } from 'vue'
import { Button, Input, Select, Switch, Space, message, InputNumber } from 'ant-design-vue'
import { DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined, PlusOutlined } from '@ant-design/icons-vue'
import PMProTable from '../components/ProTable'
import type { PMProTableProps } from '../components/ProTable/types'
import type { Key } from 'ant-design-vue/es/_util/type'

// 数据类型定义
interface TableDataItem {
  id: string
  serialNumber: number
  name: string
  cname: string
  dataType: string
  dataStandardCode: string
  isPrimaryKey: boolean
  isNotEmpty: boolean
  length?: number
  precision?: number
}

export default defineComponent({
  name: 'EditableTableExample',
  setup() {
    // 表格引用
    const proTableRef = ref()

    // 数据源
    const dataSource = ref<TableDataItem[]>([])

    // 数据类型选项
    const dataTypeOptions = [
      { label: 'VARCHAR', value: 'VARCHAR' },
      { label: 'INT', value: 'INT' },
      { label: 'BIGINT', value: 'BIGINT' },
      { label: 'DECIMAL', value: 'DECIMAL' },
      { label: 'DATETIME', value: 'DATETIME' },
      { label: 'TEXT', value: 'TEXT' },
      { label: 'BOOLEAN', value: 'BOOLEAN' }
    ]

    // 数据标准选项
    const dataStandardOptions = [
      { label: 'GB/T 2260-2007', value: 'GB/T 2260-2007' },
      { label: 'GB/T 2659-2000', value: 'GB/T 2659-2000' },
      { label: 'GB/T 7408-2005', value: 'GB/T 7408-2005' },
      { label: '自定义标准', value: 'CUSTOM' }
    ]

    // 不同数据类型是否需要长度/精度配置
    const typeConfig: Record<string, { length?: boolean; precision?: boolean }> = {
      VARCHAR: { length: true },
      INT: { length: true },
      BIGINT: { length: true },
      DECIMAL: { length: true, precision: true },
      DATETIME: {},
      TEXT: { length: true },
      BOOLEAN: {}
    }

    const shouldShowLength = (t?: string) => !!(t && typeConfig[t]?.length)
    const shouldShowPrecision = (t?: string) => !!(t && typeConfig[t]?.precision)

    const ensureLenGtePrec = (row: TableDataItem) => {
      if (shouldShowLength(row.dataType) && shouldShowPrecision(row.dataType)) {
        if (
          typeof row.length === 'number' && typeof row.precision === 'number' &&
          !Number.isNaN(row.length) && !Number.isNaN(row.precision) &&
          row.length < row.precision
        ) {
          row.length = row.precision
          message.warning('长度必须大于等于精度，已自动调整长度为精度值')
        }
      }
    }

    // 行选择配置
    const rowSelection = reactive({
      type: 'checkbox' as const,
      selectedRowKeys: [] as Key[],
      onChange: (selectedRowKeys: Key[], selectedRows: any[]) => {
        rowSelection.selectedRowKeys = selectedRowKeys
        console.log('选中的行:', selectedRowKeys, selectedRows)
      }
    })

    // 表格列配置
    const columns = computed(() => [
      {
        title: '序号',
        dataIndex: 'serialNumber',
        key: 'serialNumber',
        width: 80,
        // customRender: ({ record }: { record: TableDataItem }) => {
        //   return (
        //     <Input
        //       value={record.serialNumber}
        //       onChange={(e: Event) => handleCellChange(record.id, 'serialNumber', Number((e.target as HTMLInputElement).value))}
        //       type="number"
        //     />
        //   )
        // }
      },
      {
        title: '字段英文名',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        customRender: ({ record }: { record: TableDataItem }) => {
          return (
            <Input
              showCount={true}
              maxlength={40}
              value={record.name}
              onChange={(e: Event) => handleCellChange(record.id, 'name', (e.target as HTMLInputElement).value)}
              placeholder="请输入字段英文名"
            />
          )
        }
      },
      {
        title: '字段中文名',
        dataIndex: 'cname',
        key: 'cname',
        width: 150,
        customRender: ({ record }: { record: TableDataItem }) => {
          return (
            <Input
              showCount={true}
              maxlength={40}
              value={record.cname}
              onChange={(e: Event) => handleCellChange(record.id, 'cname', (e.target as HTMLInputElement).value)}
              placeholder="请输入字段中文名"
            />
          )
        }
      },
      {
        title: '数据类型',
        dataIndex: 'dataType',
        key: 'dataType',
        width: 280,
        customRender: ({ record }: { record: TableDataItem }) => {
          return (
            <div style={{ height: '100%', display: 'flex', gap: '2px', alignItems: 'center' }}>
              <Select
                value={record.dataType}
                onChange={(value: any) => handleCellChange(record.id, 'dataType', value)}
                options={dataTypeOptions}
                style={{ width: shouldShowLength(record.dataType) || shouldShowPrecision(record.dataType) ? '120px' : '100%' }}
              />
              {shouldShowLength(record.dataType) && (
                <InputNumber
                  placeholder="长度"
                  value={record.length}
                  min={0}
                  precision={0}
                  style={{ width: '90px' }}
                  onChange={(val: any) => {
                    const parsed = (val === null || val === undefined || val === '') ? undefined : Number(val)
                    handleCellChange(record.id, 'length', typeof parsed === 'number' && !Number.isNaN(parsed) ? parsed : undefined)
                  }}
                />
              )}
              {shouldShowPrecision(record.dataType) && (
                <InputNumber
                  placeholder="精度"
                  value={record.precision}
                  min={0}
                  precision={0}
                  style={{ width: '90px' }}
                  onChange={(val: any) => {
                    const parsed = (val === null || val === undefined || val === '') ? undefined : Number(val)
                    handleCellChange(record.id, 'precision', typeof parsed === 'number' && !Number.isNaN(parsed) ? parsed : undefined)
                  }}
                />
              )}
            </div>
          )
        }
      },
      {
        title: '数据标准',
        dataIndex: 'dataStandardCode',
        key: 'dataStandardCode',
        tooltip: '选择需要引用的数据标准，字段属性将自动继承标准定义',
        width: 150,
        customRender: ({ record }: { record: TableDataItem }) => {
          return (
            <Select
              value={record.dataStandardCode}
              onChange={(value: any) => handleCellChange(record.id, 'dataStandardCode', value)}
              options={dataStandardOptions}
              style={{ width: '100%' }}
            />
          )
        }
      },
      {
        title: '主键',
        dataIndex: 'isPrimaryKey',
        key: 'isPrimaryKey',
        width: 80,
        customRender: ({ record }: { record: TableDataItem }) => {
          return (
            <Switch
              checked={record.isPrimaryKey}
              onChange={(checked: any) => handleCellChange(record.id, 'isPrimaryKey', checked)}
            />
          )
        }
      },
      {
        title: '不为空',
        dataIndex: 'isNotEmpty',
        key: 'isNotEmpty',
        width: 80,
        customRender: ({ record }: { record: TableDataItem }) => {
          return (
            <Switch
              checked={record.isNotEmpty}
              onChange={(checked: any) => handleCellChange(record.id, 'isNotEmpty', checked)}
            />
          )
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        fixed: 'right' as const,
        width: 120,
        customRender: ({ record, index }: { record: TableDataItem; index: number }) => {
          return (
            <Space>
              <Button
                type="link"
                size="small"
                icon={<ArrowUpOutlined />}
                onClick={() => handleMoveUp(index)}
                disabled={index === 0}
                title="上移"
              />
              <Button
                type="link"
                size="small"
                icon={<ArrowDownOutlined />}
                onClick={() => handleMoveDown(index)}
                disabled={index === dataSource.value.length - 1}
                title="下移"
              />
              <Button
                type="link"
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record.id)}
                title="删除"
              />
            </Space>
          )
        }
      }
    ])

    // 工具栏渲染
    const toolBarRender = () => {
      return (
        <div style={{ display: 'flex', justifyContent: 'flex-start',marginBottom: '10px' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRow}>
            新增行
          </Button>
        </div>
      )
    }

    // 底部渲染
    const footer = (data: readonly any[]) => {
      return (
        <div style={{ textAlign: 'center', padding: '10px' }}>
          <span>共 {data.length} 条数据</span>
        </div>
      )
    }

    // 处理单元格值变化
    const handleCellChange = (id: string, field: keyof TableDataItem, value: any) => {
      const index = dataSource.value.findIndex(item => item.id === id)
      if (index !== -1) {
        const row = { ...dataSource.value[index], [field]: value } as TableDataItem
        // 数据类型联动：重置不需要的字段
        if (field === 'dataType') {
          if (!shouldShowLength(value)) row.length = undefined
          if (!shouldShowPrecision(value)) row.precision = undefined
        }
        // 规则：当同时出现时，长度必须 >= 精度
        if (field === 'length' || field === 'precision' || field === 'dataType') {
          ensureLenGtePrec(row)
        }
        dataSource.value[index] = row
        // 如果是序号字段，需要重新排序
        if (field === 'serialNumber') {
          updateSerialNumbers()
        }
      }
    }

    // 更新序号
    const updateSerialNumbers = () => {
      dataSource.value.forEach((item, index) => {
        item.serialNumber = index + 1
      })
    }

    // 新增行
    const handleAddRow = () => {
      const newId = `row_${Date.now()}`
      const newRow: TableDataItem = {
        id: newId,
        serialNumber: dataSource.value.length + 1,
        name: '',
        cname: '',
        dataType: 'VARCHAR',
        dataStandardCode: 'CUSTOM',
        isPrimaryKey: false,
        isNotEmpty: false,
        length: 255,
        precision: undefined
      }
      dataSource.value.unshift(newRow)
      message.success('新增行成功')
    }

    // 删除行
    const handleDelete = (id: string) => {
      const index = dataSource.value.findIndex(item => item.id === id)
      if (index !== -1) {
        dataSource.value.splice(index, 1)
        updateSerialNumbers()
        message.success('删除成功')
      }
    }

    // 上移
    const handleMoveUp = (index: number) => {
      if (index > 0) {
        const temp = dataSource.value[index]
        dataSource.value[index] = dataSource.value[index - 1]
        dataSource.value[index - 1] = temp
        updateSerialNumbers()
        message.success('上移成功')
      }
    }

    // 下移
    const handleMoveDown = (index: number) => {
      if (index < dataSource.value.length - 1) {
        const temp = dataSource.value[index]
        dataSource.value[index] = dataSource.value[index + 1]
        dataSource.value[index + 1] = temp
        updateSerialNumbers()
        message.success('下移成功')
      }
    }

    // 处理筛选列表变化
    const handleFilterListChange = (filteredData: Record<string, any>[]) => {
      console.log('筛选后的数据:', filteredData)
    }

    // 初始化测试数据
    const initTestData = () => {
      const testData: TableDataItem[] = []
      for (let i = 1; i <= 100; i++) {
        const t = dataTypeOptions[i % dataTypeOptions.length].value as string
        testData.push({
          id: `test_${i}`,
          serialNumber: i,
          name: `field_${i}`,
          cname: `字段${i}`,
          dataType: t,
          dataStandardCode: dataStandardOptions[i % dataStandardOptions.length].value,
          isPrimaryKey: i === 1,
          isNotEmpty: i <= 10,
          length: shouldShowLength(t) ? (t === 'DECIMAL' ? 10 : 255) : undefined,
          precision: shouldShowPrecision(t) ? 2 : undefined
        })
      }
      dataSource.value = testData
    }

    // 组件挂载时初始化数据
    onMounted(() => {
      initTestData()
    })

    // 返回渲染函数
    return () => {
      return (
        <div class="editable-table-example">
          <h2>可编辑表格示例（虚拟列表）</h2>
          <PMProTable
            ref={proTableRef}
            columns={columns.value}
            dataSource={dataSource.value}
            search={false}
            isVirtual={true}
            rowHeight={40}
            isSearch={false}
            rowSelection={rowSelection}
            title={toolBarRender}
            footer={footer}
            scroll={{ y: 500 }}
            isShowColumnSetting={false}
            isRightMenu={false}
            cellBGC={false}
            classKey="editable-table"
            onFilterListChange={handleFilterListChange}
          />
        </div>
      )
    }
  }
})
</script>

<style scoped>
.editable-table-example {
  padding: 20px;
}

.editable-table-example h2 {
  margin-bottom: 20px;
  color: #1890ff;
}
</style>
