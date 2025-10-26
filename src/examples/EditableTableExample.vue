<script lang="tsx">
import { defineComponent, ref, reactive, computed, onMounted, watch } from 'vue'
import { Button, Input, Select, Switch, Space, message, InputNumber, Drawer, Table } from 'ant-design-vue'
import { DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined, PlusOutlined, DatabaseOutlined, ClearOutlined, EditOutlined } from '@ant-design/icons-vue'
import PMProTable from '../components/ProTable'
import type { PMProTableProps } from '../components/ProTable/types'
import type { Key } from 'ant-design-vue/es/_util/type'
import { generateColumns, getTableTypeOptions, type TableType } from '../utils/tableColumnConfig'
import PartitionInputDialog from '../components/PartitionInputDialog/index.vue'
import type { PartitionRecord } from '../components/PartitionInputDialog/index.vue'
import type { DynamicPartitionConfig } from '../components/DynamicPartitionDialog/index.vue'

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
  // Doris特有字段
  isBucketKey?: boolean      // 分桶字段
  isAggregateKey?: boolean   // 聚合key
  aggregateType?: string     // 聚合类型: SUM, REPLACE, MAX, MIN
  isPartitionKey?: boolean   // 分区key
  // Hive特有字段
  isSortKey?: boolean        // 排序Key
  // 动态分区配置
  Dynamic?: {
    enabled?: boolean
    timeUnit?: string
    startOffset?: number
    endOffset?: number
    prefix?: string
    buckets?: number
  }
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

    // 表类型
    const tableType = ref<TableType>('mysql')

    // 数据标准抽屉相关状态
    const drawerVisible = ref(false)
    const currentEditingRowId = ref<string>('')
    const selectedStandardItem = ref<DataStandardItem | null>(null)

    // 分区录入弹窗相关状态
    const partitionDialogVisible = ref(false)
    const partitionDataSource = ref<PartitionRecord[]>([])

    // 搜索相关状态
    const searchValue = ref('')
    const filteredDataSource = ref<TableDataItem[]>([])

    // 表类型选项
    const tableTypeOptions = getTableTypeOptions()

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

    // 检查字段英文名是否重复
    const checkDuplicate = (currentRecord: TableDataItem, value: string) => {
      if (!value || !value.trim()) {
        return false
      }
      
      // 查找所有具有相同字段名的记录（排除当前记录）
      const duplicates = dataSource.value.filter(
        item => item.name === value && item.id !== currentRecord.id
      )
      
      return duplicates.length > 0
    }

    // 表格列配置 - 使用公共方法生成
    const columns = computed(() => {
      return generateColumns(tableType.value, {
        dataTypeOptions,
        shouldShowLength,
        shouldShowPrecision,
        handleCellChange: (id: string, field: string, value: any) => handleCellChange(id, field as keyof TableDataItem, value),
        handleOpenDataStandardDrawer,
        handleMoveUp,
        handleMoveDown,
        handleDelete,
        getDataSourceLength: () => dataSource.value.length,
        getDataSource: () => dataSource.value,
        checkDuplicate: checkDuplicate
      })
    })

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

    // 搜索功能
    const handleSearch = (value: string) => {
      searchValue.value = value
      if (!value.trim()) {
        filteredDataSource.value = dataSource.value
        return
      }

      const searchTerm = value.toLowerCase()
      filteredDataSource.value = dataSource.value.filter(item => {
        return (
          item.name.toLowerCase().includes(searchTerm) ||
          item.cname.toLowerCase().includes(searchTerm) ||
          item.dataType.toLowerCase().includes(searchTerm) ||
          item.dataStandardCode.toLowerCase().includes(searchTerm)
        )
      })
    }

    // 清空搜索
    const handleClearSearch = () => {
      searchValue.value = ''
      filteredDataSource.value = dataSource.value
    }

    // 检查是否有分区Key
    const hasPartitionKey = computed(() => {
      return dataSource.value.some(item => item.isPartitionKey === true)
    })

    // 打开分区录入弹窗
    const handleOpenPartitionDialog = () => {
      partitionDialogVisible.value = true
    }

    // 获取分区字段列表
    const getPartitionFields = computed(() => {
      return dataSource.value
        .filter(item => item.isPartitionKey === true)
        .map(item => ({
          name: item.name,
          dataType: item.dataType,
          length: item.length,
          precision: item.precision
        }))
    })

    // 保存分区数据
    const handleSavePartitionData = (data: PartitionRecord[]) => {
      partitionDataSource.value = data
    //   message.success('分区数据保存成功')
    }

    // 处理动态分区配置提交
    const handleDynamicPartitionSubmit = (config: DynamicPartitionConfig) => {
      // 找到所有勾选了分区Key的字段，将Dynamic配置保存到这些字段所在的dataSource记录中
      const partitionKeyItems = dataSource.value.filter(item => item.isPartitionKey === true)
      
      partitionKeyItems.forEach(item => {
        item.Dynamic = {
          enabled: config.enabled,
          timeUnit: config.timeUnit,
          startOffset: config.startOffset,
          endOffset: config.endOffset,
          prefix: config.prefix,
          buckets: config.buckets
        }
      })
      
      message.success(`动态分区配置已应用到 ${partitionKeyItems.length} 个分区字段`)
    }

    // 工具栏渲染
    const toolBarRender = () => {
      return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold', marginRight: '8px' }}>表类型:</span>
            <Select
              value={tableType.value}
              onChange={(value: any) => { tableType.value = value }}
              options={tableTypeOptions}
              style={{ width: '120px' }}
            />
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
            {hasPartitionKey.value && (
              <Button 
                type="default" 
                icon={<DatabaseOutlined />} 
                onClick={handleOpenPartitionDialog}
              >
                分区录入
              </Button>
            )}
            <Button 
              danger 
              icon={<ClearOutlined />} 
              onClick={handleBatchDelete}
              disabled={rowSelection.selectedRowKeys.length === 0}
            >
              批量删除 ({rowSelection.selectedRowKeys.length})
            </Button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Input.Search
              placeholder="搜索字段名、中文名、数据类型..."
              value={searchValue.value}
              onChange={(e) => handleSearch(e.target.value || '')}
              onSearch={(value) => handleSearch(value)}
              allowClear
              style={{ width: '300px' }}
            />
            <span style={{ color: '#666', fontSize: '12px' }}>
              {searchValue.value ? `找到 ${filteredDataSource.value.length} 条结果` : `共 ${dataSource.value.length} 条数据`}
            </span>
          </div>
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
        const row = { ...dataSource.value[index] } as TableDataItem
        // 数据类型联动：重置不需要的字段
        if (field === 'dataType') {
          if (!shouldShowLength(value)) row.length = undefined
          if (!shouldShowPrecision(value)) row.precision = undefined
        }
        // 规则：当同时出现时，长度必须 >= 精度
        if (field === 'length' || field === 'precision' || field === 'dataType') {
          ensureLenGtePrec(row)
        }
        
        // 更新字段值
        if (field === 'isPrimaryKey') row.isPrimaryKey = value
        else if (field === 'isNotEmpty') row.isNotEmpty = value
        else if (field === 'name') {
          row.name = value
          // 检查字段名重复性
          if (value && value.trim()) {
            const duplicates = dataSource.value.filter(
              item => item.name === value && item.id !== id
            )
            if (duplicates.length > 0) {
              const duplicateRows = duplicates.map(item => {
                const index = dataSource.value.findIndex(row => row.id === item.id)
                return index + 1
              })
              message.warning(`字段名重复，已在第 ${duplicateRows.join('、')} 行使用`)
            }
          }
        }
        else if (field === 'cname') row.cname = value
        else if (field === 'dataType') row.dataType = value
        else if (field === 'dataStandardCode') row.dataStandardCode = value
        else if (field === 'length') row.length = value
        else if (field === 'precision') row.precision = value
        else if (field === 'isBucketKey') {
          row.isBucketKey = value
          // 如果选择了分桶字段，自动清除聚合类型
          if (value && row.aggregateType) {
            row.aggregateType = undefined
          }
        }
        else if (field === 'isAggregateKey') {
          row.isAggregateKey = value
          // 如果选择了聚合Key，自动清除聚合类型
          if (value && row.aggregateType) {
            row.aggregateType = undefined
          }
        }
        else if (field === 'aggregateType') {
          row.aggregateType = value
          // 如果选择了聚合类型，自动清除聚合Key和分桶字段
          if (value) {
            if (row.isAggregateKey) {
              row.isAggregateKey = false
            }
            if (row.isBucketKey) {
              row.isBucketKey = false
            }
          }
        }
        else if (field === 'isPartitionKey') row.isPartitionKey = value
        else if (field === 'isSortKey') row.isSortKey = value
        
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
      
      // 根据表类型初始化特殊字段
      if (tableType.value === 'doris') {
        newRow.isBucketKey = false
        newRow.isAggregateKey = false
        newRow.aggregateType = undefined
        newRow.isPartitionKey = false
      } else if (tableType.value === 'hive') {
        newRow.isPartitionKey = false
      } else if (tableType.value === 'clickhouse') {
        newRow.isSortKey = false
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
        const baseData = {
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
        }
        
        // 根据当前表类型添加特殊字段
        if (tableType.value === 'doris') {
          (baseData as TableDataItem).isBucketKey = i <= 5
          ;(baseData as TableDataItem).isAggregateKey = i <= 3
          // 注意：不自动设置聚合类型，因为它们是互斥的
          // ;(baseData as TableDataItem).aggregateType = i <= 2 ? 'SUM' : undefined
          ;(baseData as TableDataItem).isPartitionKey = i === 1
        } else if (tableType.value === 'hive') {
          ;(baseData as TableDataItem).isPartitionKey = i === 1
        } else if (tableType.value === 'clickhouse') {
          ;(baseData as TableDataItem).isSortKey = i <= 3
        }
        
        testData.push(baseData as TableDataItem)
      }
      dataSource.value = testData
    }

    // 组件挂载时初始化数据
    onMounted(() => {
      initTestData()
      // 初始化过滤数据
      filteredDataSource.value = dataSource.value
    })

    // 监听数据源变化，更新过滤结果
    watch(() => dataSource.value, () => {
      if (searchValue.value) {
        handleSearch(searchValue.value)
      } else {
        filteredDataSource.value = dataSource.value
      }
    }, { deep: true })

    // 监听表类型变化，重新初始化数据
    watch(() => tableType.value, () => {
      if (dataSource.value.length > 0) {
        // 保留现有的基础数据，只更新特殊字段
        dataSource.value.forEach((item, index) => {
          // 清除所有特殊字段
          item.isBucketKey = false
          item.isAggregateKey = false
          item.aggregateType = undefined
          item.isPartitionKey = false
          item.isSortKey = false
          
          // 根据当前表类型初始化对应字段
          if (tableType.value === 'doris') {
            item.isBucketKey = index < 5
            // 注意：不自动设置聚合Key和聚合类型，因为它们是互斥的
            // item.isAggregateKey = index < 3
            // item.aggregateType = index < 2 ? 'SUM' : undefined
            item.isPartitionKey = index === 0
          } else if (tableType.value === 'hive') {
            item.isPartitionKey = index === 0
          } else if (tableType.value === 'clickhouse') {
            item.isSortKey = index < 3
          }
        })
      }
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

    // 获取数据
    const handleGetData = () => {
      console.log(dataSource.value)
    }

    // 返回渲染函数
    return () => {
      return (
        <div class="editable-table-example">
          <h2>可编辑表格示例（虚拟列表）</h2>
          <Button type="primary" onClick={handleGetData}>获取数据</Button>
          <PMProTable
            ref={proTableRef}
            columns={columns.value}
            dataSource={searchValue.value ? filteredDataSource.value : dataSource.value}
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

          {/* 分区录入弹窗 */}
          <PartitionInputDialog
            v-model:visible={partitionDialogVisible.value}
            selectedFields={getPartitionFields.value}
            dataSource={partitionDataSource.value}
            onSave={handleSavePartitionData}
            onDynamicPartition={handleDynamicPartitionSubmit}
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
:deep(.ant-input-search-button) {
  height: 29px;
}
</style>
