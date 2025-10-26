import { Input, Select, InputNumber, Button, Checkbox } from 'ant-design-vue'
import { ArrowUpOutlined, ArrowDownOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons-vue'
import { Space } from 'ant-design-vue'

/**
 * 表类型枚举
 */
export type TableType = 'mysql' | 'doris' | 'hive' | 'postgresql' | 'oracle' | 'clickhouse'

/**
 * 列配置选项接口
 */
export interface ColumnConfigOptions {
  dataTypeOptions: any[]
  shouldShowLength: (type?: string) => boolean
  shouldShowPrecision: (type?: string) => boolean
  handleCellChange: (id: string, field: string, value: any) => void
  handleOpenDataStandardDrawer: (id: string) => void
  handleMoveUp: (index: number) => void
  handleMoveDown: (index: number) => void
  handleDelete: (id: string) => void
  getDataSourceLength: () => number
  getDataSource: () => any[] // 用于重复性检查
  checkDuplicate?: (record: any, value: string) => boolean // 检查是否重复，返回 true/false
}

/**
 * 生成固定列配置
 */
export const generateFixedColumns = (options: ColumnConfigOptions) => {
  const {
    dataTypeOptions,
    shouldShowLength,
    shouldShowPrecision,
    handleCellChange,
    handleOpenDataStandardDrawer,
    checkDuplicate
  } = options

  return [
    {
      title: '序号',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
      width: 80
    },
    {
      title: '字段英文名',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      customRender: ({ record }: any) => {
        // 检查重复性，如果有重复则显示红色边框
        const hasDuplicate = checkDuplicate ? checkDuplicate(record, record.name) : false
        
        return (
          <Input
            showCount={true}
            maxlength={40}
            value={record.name}
            onChange={(e: Event) => handleCellChange(record.id, 'name', (e.target as HTMLInputElement).value)}
            placeholder="请输入字段英文名"
            status={hasDuplicate ? 'error' : undefined}
          />
        )
      }
    },
    {
      title: '字段中文名',
      dataIndex: 'cname',
      key: 'cname',
      width: 150,
      customRender: ({ record }: any) => {
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
      customRender: ({ record }: any) => {
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
      customRender: ({ record }: any) => {
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
      customRender: ({ record }: any) => {
        return (
          <Checkbox
            checked={!!record.isPrimaryKey}
            onChange={(e: any) => handleCellChange(record.id, 'isPrimaryKey', e.target.checked)}
          />
        )
      }
    }
  ]
}

/**
 * 生成MySQL动态列配置
 */
export const generateMysqlColumns = (options: ColumnConfigOptions): any[] => {
  const { handleCellChange } = options
  return [
    {
      title: '不为空',
      dataIndex: 'isNotEmpty',
      key: 'isNotEmpty',
      width: 80,
      customRender: ({ record }: any) => {
        return (
          <Checkbox
            checked={!!record.isNotEmpty}
            onChange={(e: any) => handleCellChange(record.id, 'isNotEmpty', e.target.checked)}
          />
        )
      }
    }
  ]
}

/**
 * 生成Doris动态列配置
 */
export const generateDorisColumns = (options: ColumnConfigOptions): any[] => {
  const { handleCellChange } = options
  
  // 聚合类型选项
  const aggregateTypeOptions = [
    { label: 'SUM', value: 'SUM' },
    { label: 'REPLACE', value: 'REPLACE' },
    { label: 'MAX', value: 'MAX' },
    { label: 'MIN', value: 'MIN' }
  ]
  
  return [
    {
      title: '不为空',
      dataIndex: 'isNotEmpty',
      key: 'isNotEmpty',
      width: 80,
      customRender: ({ record }: any) => {
        return (
          <Checkbox
            checked={!!record.isNotEmpty}
            onChange={(e: any) => handleCellChange(record.id, 'isNotEmpty', e.target.checked)}
          />
        )
      }
    },
    {
      title: '分桶字段',
      dataIndex: 'isBucketKey',
      key: 'isBucketKey',
      width: 100,
      customRender: ({ record }: any) => {
        const isDisabled = !!record.aggregateType
        return (
          <Checkbox
            checked={!!record.isBucketKey}
            disabled={isDisabled}
            onChange={(e: any) => {
              const checked = e.target.checked
              // 选择分桶字段时，清除聚合类型
              if (checked && record.aggregateType) {
                handleCellChange(record.id, 'aggregateType', undefined)
              }
              handleCellChange(record.id, 'isBucketKey', checked)
            }}
          />
        )
      }
    },
    {
      title: '聚合Key',
      dataIndex: 'isAggregateKey',
      key: 'isAggregateKey',
      width: 100,
      customRender: ({ record }: any) => {
        const isDisabled = !!record.aggregateType
        return (
          <Checkbox
            checked={!!record.isAggregateKey}
            disabled={isDisabled}
            onChange={(e: any) => {
              const checked = e.target.checked
              // 选择聚合Key时，清除聚合类型
              if (checked && record.aggregateType) {
                handleCellChange(record.id, 'aggregateType', undefined)
              }
              handleCellChange(record.id, 'isAggregateKey', checked)
            }}
          />
        )
      }
    },
    {
      title: '聚合类型',
      dataIndex: 'aggregateType',
      key: 'aggregateType',
      width: 120,
      customRender: ({ record }: any) => {
        // 选择了聚合Key或分桶字段时禁用聚合类型
        const isDisabled = record.isAggregateKey === true || record.isBucketKey === true
        return (
          <Select
            value={record.aggregateType}
            placeholder="选择聚合类型"
            disabled={isDisabled}
            allowClear
            options={aggregateTypeOptions}
            onChange={(value) => {
              // 选择聚合类型时，清除聚合Key和分桶字段
              if (value) {
                if (record.isAggregateKey) {
                  handleCellChange(record.id, 'isAggregateKey', false)
                }
                if (record.isBucketKey) {
                  handleCellChange(record.id, 'isBucketKey', false)
                }
              }
              handleCellChange(record.id, 'aggregateType', value)
            }}
            style={{ width: '100%' }}
          />
        )
      }
    },
    {
      title: '分区Key',
      dataIndex: 'isPartitionKey',
      key: 'isPartitionKey',
      width: 100,
      customRender: ({ record }: any) => {
        // 只有选择了聚合Key才能选择分区Key
        const isDisabled = record.isAggregateKey !== true
        return (
          <Checkbox
            checked={!!record.isPartitionKey}
            disabled={isDisabled}
            onChange={(e: any) => handleCellChange(record.id, 'isPartitionKey', e.target.checked)}
          />
        )
      }
    }
  ]
}

/**
 * 生成Hive动态列配置
 */
export const generateHiveColumns = (options: ColumnConfigOptions): any[] => {
  const { handleCellChange } = options
  return [
    {
      title: '不为空',
      dataIndex: 'isNotEmpty',
      key: 'isNotEmpty',
      width: 80,
      customRender: ({ record }: any) => {
        return (
          <Checkbox
            checked={!!record.isNotEmpty}
            onChange={(e: any) => handleCellChange(record.id, 'isNotEmpty', e.target.checked)}
          />
        )
      }
    },
    {
      title: '分区Key',
      dataIndex: 'isPartitionKey',
      key: 'isPartitionKey',
      width: 100,
      customRender: ({ record }: any) => {
        return (
          <Checkbox
            checked={!!record.isPartitionKey}
            onChange={(e: any) => handleCellChange(record.id, 'isPartitionKey', e.target.checked)}
          />
        )
      }
    }
  ]
}

/**
 * 生成ClickHouse动态列配置
 */
export const generateClickHouseColumns = (options: ColumnConfigOptions): any[] => {
  const { handleCellChange } = options
  return [
    {
      title: '不为空',
      dataIndex: 'isNotEmpty',
      key: 'isNotEmpty',
      width: 80,
      customRender: ({ record }: any) => {
        return (
         <Checkbox
            checked={!!record.isNotEmpty}
            onChange={(e: any) => handleCellChange(record.id, 'isNotEmpty', e.target.checked)}
          />
        )
      }
    },
    {
      title: '排序Key',
      dataIndex: 'isSortKey',
      key: 'isSortKey',
      width: 100,
      customRender: ({ record }: any) => {
        return (
          <Checkbox
            checked={!!record.isSortKey}
            onChange={(e: any) => handleCellChange(record.id, 'isSortKey', e.target.checked)}
          />
        )
      }
    }
  ]
}

/**
 * 生成PostgreSQL动态列配置
 */
export const generatePostgresqlColumns = (options: ColumnConfigOptions): any[] => {
  const { handleCellChange } = options
  return [
    {
      title: '不为空',
      dataIndex: 'isNotEmpty',
      key: 'isNotEmpty',
      width: 80,
      customRender: ({ record }: any) => {
        return (
          <Checkbox
            checked={!!record.isNotEmpty}
            onChange={(e: any) => handleCellChange(record.id, 'isNotEmpty', e.target.checked)}
          />
        )
      }
    }
  ]
}

/** 
 * 生成Oracle动态列配置
 */
export const generateOracleColumns = (options: ColumnConfigOptions): any[] => {
  const { handleCellChange } = options
  return [
    {
      title: '不为空',
      dataIndex: 'isNotEmpty',
      key: 'isNotEmpty',
      width: 80,
      customRender: ({ record }: any) => {
        return (
          <Checkbox
            checked={!!record.isNotEmpty}
            onChange={(e: any) => handleCellChange(record.id, 'isNotEmpty', e.target.checked)}
          />
        )
      }
    }
  ]
}

/**
 * 生成操作列配置
 */
export const generateActionColumn = (options: ColumnConfigOptions) => {
  const { handleMoveUp, handleMoveDown, handleDelete, getDataSourceLength } = options
  
  return {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    fixed: 'right' as const,
    width: 120,
    customRender: ({ record, index }: any) => {
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
            disabled={index === getDataSourceLength() - 1}
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
}

/**
 * 根据表类型生成完整的列配置
 */
export const generateColumns = (tableType: TableType, options: ColumnConfigOptions) => {
  const fixedColumns = generateFixedColumns(options)
  const actionColumn = generateActionColumn(options)
  
  let dynamicColumns: any[] = []
  
  switch (tableType) {
    case 'mysql':
      dynamicColumns = generateMysqlColumns(options)
      break
    case 'doris':
      dynamicColumns = generateDorisColumns(options)
      break
    case 'hive':
      dynamicColumns = generateHiveColumns(options)
      break
    case 'postgresql':
      dynamicColumns = generatePostgresqlColumns(options)
      break
    case 'oracle':
      dynamicColumns = generateOracleColumns(options)
      break
    case 'clickhouse':
      dynamicColumns = generateClickHouseColumns(options)
      break
    default:
      dynamicColumns = []
  }
  
  return [...fixedColumns, ...dynamicColumns, actionColumn]
}

/**
 * 获取表类型选项
 */
export const getTableTypeOptions = () => [
  { label: 'MySQL', value: 'mysql' },
  { label: 'Doris', value: 'doris' },
  { label: 'Hive', value: 'hive' },
  { label: 'PostgreSQL', value: 'postgresql' },
  { label: 'Oracle', value: 'oracle' },
  { label: 'ClickHouse', value: 'clickhouse' }
]

