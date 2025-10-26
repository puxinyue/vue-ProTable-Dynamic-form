<script lang="tsx">
import { defineComponent, ref, computed, watch } from 'vue'
import { Modal, Button, Table, Input, DatePicker, Select, InputNumber, message } from 'ant-design-vue'
import type { Key } from 'ant-design-vue/es/_util/type'
import dayjs from 'dayjs'
import DynamicPartitionDialog from '../DynamicPartitionDialog/index.vue'
import type { DynamicPartitionConfig } from '../DynamicPartitionDialog/index.vue'

export interface PartitionRecord {
  id: string
  partitionValue: string
  Dynamic?: {
    enabled?: boolean
    timeUnit?: string
    startOffset?: number
    endOffset?: number
    prefix?: string
    buckets?: number
  }
  [key: string]: any
}

export interface SelectedField {
  name: string
  dataType: string
  length?: number
  precision?: number
}

export interface PartitionInputProps {
  visible: boolean
  selectedFields: SelectedField[]
  dataSource: PartitionRecord[]
  onDynamicPartitionSubmit?: (config: DynamicPartitionConfig) => void
}

export default defineComponent({
  name: 'PartitionInputDialog',
  props: {
    visible: Boolean,
    selectedFields: {
      type: Array,
      default: () => []
    },
    dataSource: {
      type: Array,
      default: () => []
    },
    onDynamicPartitionSubmit: {
      type: Function as any,
      default: () => {}
    }
  },
  emits: ['update:visible', 'save', 'dynamicPartition'],
  setup(props, { emit }) {
    const internalDataSource = ref<PartitionRecord[]>([])
    const selectedRowKeys = ref<Key[]>([])
    const dynamicPartitionDialogVisible = ref(false)

    // 检查是否所有字段都是日期类型
    const isAllDateType = computed(() => {
      return props.selectedFields.length > 0 && 
             props.selectedFields.every((field: any) => 
               field.dataType === 'DATE' || 
               field.dataType === 'DATETIME' || 
               field.dataType === 'TIMESTAMP'
             )
    })

    // 监听外部数据源变化
    watch(() => props.dataSource, (newVal) => {
      if (newVal && newVal.length > 0) {
        internalDataSource.value = [...newVal] as PartitionRecord[]
      }
    }, { immediate: true, deep: true })

    // 根据数据类型渲染输入组件
    const renderInputComponent = (field: any, record: PartitionRecord) => {
      const { dataType, length } = field

      if (dataType === 'DATE' || dataType === 'DATETIME' || dataType === 'TIMESTAMP') {
        const dateValue = record[field.name] ? dayjs(record[field.name] as string) : undefined
        return (
          <DatePicker
            value={dateValue as any}
            onChange={(date: any) => {
              const index = internalDataSource.value.findIndex(item => item.id === record.id)
              if (index !== -1) {
                internalDataSource.value[index][field.name] = date ? date.format('YYYY-MM-DD HH:mm:ss') : ''
              }
            }}
            showTime={dataType === 'DATETIME' || dataType === 'TIMESTAMP'}
            placeholder={`请输入${field.name}`}
            style={{ width: '100%' }}
          />
        )
      } else if (dataType === 'BOOLEAN') {
        return (
          <Select
            value={record[field.name] as any}
            onChange={(value) => {
              const index = internalDataSource.value.findIndex(item => item.id === record.id)
              if (index !== -1) {
                internalDataSource.value[index][field.name] = value
              }
            }}
            options={[
              { label: 'true', value: 'true' },
              { label: 'false', value: 'false' }
            ]}
            style={{ width: '100%' }}
          />
        )
      } else if (dataType === 'INT' || dataType === 'BIGINT') {
        return (
          <InputNumber
            value={record[field.name]}
            onChange={(value) => {
              const index = internalDataSource.value.findIndex(item => item.id === record.id)
              if (index !== -1) {
                internalDataSource.value[index][field.name] = value
              }
            }}
            placeholder={`请输入${field.name}`}
            style={{ width: '100%' }}
            precision={0}
          />
        )
      } else if (dataType === 'DECIMAL' || dataType === 'DOUBLE' || dataType === 'FLOAT') {
        return (
          <InputNumber
            value={record[field.name]}
            onChange={(value) => {
              const index = internalDataSource.value.findIndex(item => item.id === record.id)
              if (index !== -1) {
                internalDataSource.value[index][field.name] = value
              }
            }}
            placeholder={`请输入${field.name}`}
            style={{ width: '100%' }}
            precision={2}
          />
        )
      } else {
        // VARCHAR, TEXT等文本类型
        return (
          <Input
            value={record[field.name]}
            onChange={(e: Event) => {
              const index = internalDataSource.value.findIndex(item => item.id === record.id)
              if (index !== -1) {
                internalDataSource.value[index][field.name] = (e.target as HTMLInputElement).value
              }
            }}
            maxlength={length || 255}
            placeholder={`请输入${field.name}`}
          />
        )
      }
    }

    // 生成表格列配置
    const columns = computed(() => {
      const cols: any[] = [
        {
          title: '分区字段',
          dataIndex: 'partitionValue',
          key: 'partitionValue',
          width: 200,
          fixed: 'left',
          customRender: ({ record }: { record: PartitionRecord }) => {
            return (
              <Input
                value={record.partitionValue}
                maxlength={40}
                showCount={true}
                placeholder="请输入分区字段"
                onChange={(e: Event) => {
                  const index = internalDataSource.value.findIndex(item => item.id === record.id)
                  if (index !== -1) {
                    internalDataSource.value[index].partitionValue = (e.target as HTMLInputElement).value
                  }
                }}
              />
            )
          }
        }
      ]

      // 根据选择的字段生成列
      props.selectedFields.forEach((field: any) => {
        cols.push({
          title: field.name,
          dataIndex: field.name,
          key: field.name,
          width: 200,
          customRender: ({ record }: { record: PartitionRecord }) => {
            return renderInputComponent(field, record)
          }
        })
      })

      return cols
    })

    // 新增分区行
    const handleAddPartition = () => {
      const newRecord: PartitionRecord = {
        id: `partition_${Date.now()}`,
        partitionValue: `p${internalDataSource.value.length}`
      }
      
      // 为每个选中的字段初始化空值
      props.selectedFields.forEach((field: any) => {
        newRecord[field.name] = ''
      })

      // 初始化 Dynamic 字段
      newRecord.Dynamic = {}

      internalDataSource.value.push(newRecord)
    }

    // 删除分区行
    const handleDeletePartition = (id: string) => {
      const index = internalDataSource.value.findIndex(item => item.id === id)
      if (index !== -1) {
        internalDataSource.value.splice(index, 1)
      }
    }

    // 批量删除分区行
    const handleBatchDelete = () => {
      if (selectedRowKeys.value.length === 0) {
        message.warning('请先选择要删除的分区行')
        return
      }
      internalDataSource.value = internalDataSource.value.filter(
        item => !selectedRowKeys.value.includes(item.id)
      )
      message.success(`已删除 ${selectedRowKeys.value.length} 条分区数据`)
      selectedRowKeys.value = []
    }

    // 保存数据
    const handleSave = () => {
      // 校验所有必填字段是否填写
      for (const record of internalDataSource.value) {
        // 校验分区字段
        if (!record.partitionValue || !record.partitionValue.trim()) {
          message.error('请填写所有分区字段')
          return
        }
        
        // 校验所有选中字段的值
        for (const field of props.selectedFields as any[]) {
          const fieldValue = record[field.name] as any
          
          // 根据数据类型进行不同的校验
          if (field.dataType === 'BOOLEAN') {
            // 布尔值可以是 undefined，但如果有值必须明确
            continue
          } else if (field.dataType === 'DATE' || field.dataType === 'DATETIME' || field.dataType === 'TIMESTAMP') {
            // 日期类型必须填写
            if (!fieldValue || typeof fieldValue !== 'string' || !fieldValue.trim()) {
              message.error(`分区 "${record.partitionValue}" 的字段 "${field.name}" 未填写`)
              return
            }
          } else if (field.dataType === 'INT' || field.dataType === 'BIGINT' || field.dataType === 'DECIMAL' || field.dataType === 'DOUBLE' || field.dataType === 'FLOAT') {
            // 数字类型必须填写
            if (fieldValue === null || fieldValue === undefined || fieldValue === '') {
              message.error(`分区 "${record.partitionValue}" 的字段 "${field.name}" 未填写`)
              return
            }
          } else {
            // 文本类型必须填写
            if (!fieldValue || typeof fieldValue !== 'string' || !fieldValue.trim()) {
              message.error(`分区 "${record.partitionValue}" 的字段 "${field.name}" 未填写`)
              return
            }
          }
        }
      }
      
      emit('save', internalDataSource.value)
      emit('update:visible', false)
      message.success('分区数据保存成功')
    }

    // 取消
    const handleCancel = () => {
      emit('update:visible', false)
    }

    // 打开动态分区配置弹窗
    const handleOpenDynamicPartition = () => {
      dynamicPartitionDialogVisible.value = true
    }

    // 提交动态分区配置
    const handleDynamicPartitionSubmit = (config: DynamicPartitionConfig) => {
      console.log('动态分区配置:', config)
      
      // 通过事件将配置传递给父组件
      emit('dynamicPartition', config)
      
      message.success('动态分区配置已保存')
    }

    // 当弹窗打开时，如果没有数据则自动添加一行
    watch(() => props.visible, (visible) => {
      if (visible && internalDataSource.value.length === 0) {
        handleAddPartition()
      }
    })

    return () => (
      <>
      <Modal
        title="分区录入"
        open={props.visible}
        width={800}
        onCancel={handleCancel}
        onOk={handleSave}
        okText={'确定'}
        cancelText={'取消'}
      >
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Button type="primary" onClick={handleAddPartition}>
              新增分区
            </Button>
            <Button 
              danger 
              onClick={handleBatchDelete}
              disabled={selectedRowKeys.value.length === 0}
              style={{ marginLeft: '8px' }}
            >
              批量删除 ({selectedRowKeys.value.length})
            </Button>
            {isAllDateType.value && (
              <Button 
                type="default" 
                onClick={handleOpenDynamicPartition}
                style={{ marginLeft: '8px' }}
              >
                动态分区
              </Button>
            )}
          </div>
        </div>
        <Table
          columns={columns.value}
          dataSource={internalDataSource.value}
          rowKey="id"
          size="small"
          scroll={{ x: 'max-content', y: 400 }}
          pagination={false}
          rowSelection={{
            selectedRowKeys: selectedRowKeys.value,
            onChange: (keys: Key[]) => {
              selectedRowKeys.value = keys
            }
          }}
          locale={{ emptyText: '暂无数据，请点击新增分区' }}
        />
      </Modal>

      {/* 动态分区配置弹窗 */}
      <DynamicPartitionDialog
        v-model:visible={dynamicPartitionDialogVisible.value}
        onSubmit={handleDynamicPartitionSubmit}
      />
      </>
    )
  }
})
</script>

<style scoped>
</style>

