<script lang="tsx">
import { defineComponent, ref, reactive, computed, onMounted } from 'vue'
import { Button, Input, Select, Switch, Space, message, InputNumber, Drawer, Table } from 'ant-design-vue'
import { DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined, PlusOutlined, DatabaseOutlined, ClearOutlined, EditOutlined } from '@ant-design/icons-vue'
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

// 数据标准项定义
interface DataStandardItem {
  id: string
  code: string
  name: string
  dataType: string
  length?: number
  precision?: number
  description: string
}

export default defineComponent({
  name: 'EditableTableExample',
  setup() {
    // 表格引用
    const proTableRef = ref()

    // 数据源
    const dataSource = ref<TableDataItem[]>([])

    // 数据标准抽屉相关状态
    const drawerVisible = ref(false)
    const currentEditingRowId = ref<string>('')
    const selectedStandardItem = ref<DataStandardItem | null>(null)

    // 数据标准列表
    const dataStandardList = ref<DataStandardItem[]>([
      {
        id: '1',
        code: 'GB/T 2260-2007',
        name: '行政区划代码',
        dataType: 'VARCHAR',
        length: 6,
        description: '中华人民共和国行政区划代码'
      },
      {
        id: '2',
        code: 'GB/T 2659-2000',
        name: '国家代码',
        dataType: 'VARCHAR',
        length: 3,
        description: '世界各国和地区名称代码'
      },
      {
        id: '3',
        code: 'GB/T 7408-2005',
        name: '日期时间格式',
        dataType: 'DATETIME',
        description: '数据元和交换格式 信息交换 日期和时间表示法'
      },
      {
        id: '4',
        code: 'CUSTOM_001',
        name: '用户ID',
        dataType: 'BIGINT',
        length: 20,
        description: '用户唯一标识符'
      },
      {
        id: '5',
        code: 'CUSTOM_002',
        name: '金额',
        dataType: 'DECIMAL',
        length: 10,
        precision: 2,
        description: '货币金额，保留两位小数'
      }
    ])

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {record.dataStandardCode || '未选择'}
              </span>
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleOpenDataStandardDrawer(record.id)}
                title="选择数据标准"
              />
            </div>
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

    const handleGenerateDDL = () => {
      console.log('生成DDL')
    }

    // 打开数据标准抽屉
    const handleOpenDataStandardDrawer = (rowId: string) => {
      currentEditingRowId.value = rowId
      selectedStandardItem.value = null
      drawerVisible.value = true
    }

    // 关闭数据标准抽屉
    const handleCloseDataStandardDrawer = () => {
      drawerVisible.value = false
      currentEditingRowId.value = ''
      selectedStandardItem.value = null
    }

    // 选择数据标准项
    const handleSelectDataStandard = (item: DataStandardItem) => {
      selectedStandardItem.value = item
    }

    // 确认选择数据标准
    const handleConfirmDataStandard = () => {
      if (!selectedStandardItem.value || !currentEditingRowId.value) {
        message.warning('请先选择一个数据标准')
        return
      }

      const rowIndex = dataSource.value.findIndex(item => item.id === currentEditingRowId.value)
      if (rowIndex !== -1) {
        const row = dataSource.value[rowIndex]
        const standardItem = selectedStandardItem.value
        
        // 应用数据标准到当前行
        dataSource.value[rowIndex] = {
          ...row,
          dataStandardCode: standardItem.code,
          dataType: standardItem.dataType,
          length: standardItem.length,
          precision: standardItem.precision,
          // 如果标准有名称，也可以更新字段名称
          cname: standardItem.name
        }
        
        message.success(`已应用数据标准：${standardItem.name}`)
        handleCloseDataStandardDrawer()
      }
    }

    // 工具栏渲染
    const toolBarRender = () => {
      return (
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px', gap: '8px' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRow}>
            新增行
          </Button>
          <Button 
            type="default" 
            icon={<DatabaseOutlined />} 
            onClick={handleGenerateDDL}
            disabled={dataSource.value.length === 0}
          >
            DDL建表
          </Button>
          <Button 
            danger 
            icon={<ClearOutlined />} 
            onClick={handleBatchDelete}
            disabled={rowSelection.selectedRowKeys.length === 0}
          >
            批量删除 ({rowSelection.selectedRowKeys.length})
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



    // 批量删除功能
    const handleBatchDelete = () => {
      if (rowSelection.selectedRowKeys.length === 0) {
        message.warning('请先选择要删除的行')
        return
      }
      
      // 确认删除
      const confirmDelete = () => {
        const selectedIds = rowSelection.selectedRowKeys
        dataSource.value = dataSource.value.filter(item => !selectedIds.includes(item.id))
        rowSelection.selectedRowKeys = []
        updateSerialNumbers()
        message.success(`已删除 ${selectedIds.length} 条数据`)
      }
      
      // 这里可以添加确认对话框
      confirmDelete()
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

    // 数据标准抽屉的列配置
    const dataStandardColumns = [
      {
        title: '标准代码',
        dataIndex: 'code',
        key: 'code',
        width: 120
      },
      {
        title: '标准名称',
        dataIndex: 'name',
        key: 'name',
        width: 150
      },
      {
        title: '数据类型',
        dataIndex: 'dataType',
        key: 'dataType',
        width: 100
      },
      {
        title: '长度',
        dataIndex: 'length',
        key: 'length',
        width: 80,
        customRender: ({ record }: { record: DataStandardItem }) => {
          return record.length ? record.length : '-'
        }
      },
      {
        title: '精度',
        dataIndex: 'precision',
        key: 'precision',
        width: 80,
        customRender: ({ record }: { record: DataStandardItem }) => {
          return record.precision ? record.precision : '-'
        }
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true
      }
    ]

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
          
          {/* 数据标准选择抽屉 */}
          <Drawer
            title="选择数据标准"
            placement="right"
            width={800}
            open={drawerVisible.value}
            onClose={handleCloseDataStandardDrawer}
            footer={
              <div style={{ textAlign: 'right' }}>
                <Space>
                  <Button onClick={handleCloseDataStandardDrawer}>
                    取消
                  </Button>
                  <Button 
                    type="primary" 
                    onClick={handleConfirmDataStandard}
                    disabled={!selectedStandardItem.value}
                  >
                    确定
                  </Button>
                </Space>
              </div>
            }
          >
            <div style={{ marginBottom: '16px' }}>
              <p>请选择一个数据标准，选择后将自动应用到当前字段：</p>
            </div>
            <Table
              columns={dataStandardColumns}
              dataSource={dataStandardList.value}
              rowKey="id"
              size="small"
              rowSelection={{
                type: 'radio',
                selectedRowKeys: selectedStandardItem.value ? [selectedStandardItem.value.id] : [],
                onChange: (selectedRowKeys, selectedRows) => {
                  if (selectedRows.length > 0) {
                    handleSelectDataStandard(selectedRows[0])
                  }
                }
              }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true
              }}
            />
          </Drawer>
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
