<script lang="tsx">
import { defineComponent, reactive, ref, computed } from 'vue'
import { Modal, Form, FormItem, Checkbox, Select, InputNumber, Input, Button, message } from 'ant-design-vue'

export interface DynamicPartitionConfig {
  enabled: boolean
  timeUnit: string
  startOffset: number | undefined
  endOffset: number
  prefix: string
  buckets: number
}

export interface DynamicPartitionDialogProps {
  visible: boolean
}

export default defineComponent({
  name: 'DynamicPartitionDialog',
  props: {
    visible: Boolean
  },
  emits: ['update:visible', 'submit'],
  setup(props, { emit }) {
    const formRef = ref()
    
    // 时间单位选项
    const timeUnitOptions = [
      { label: 'DAY', value: 'DAY' },
      { label: 'WEEK', value: 'WEEK' },
      { label: 'MONTH', value: 'MONTH' },
      { label: 'YEAR', value: 'YEAR' }
    ]

    // 表单数据
    const formData = reactive<DynamicPartitionConfig>({
      enabled: true,
      timeUnit: 'DAY',
      startOffset: undefined,
      endOffset: 7,
      prefix: 'p',
      buckets: 1
    })

    // 是否开启分区变化时的处理
    const handleEnabledChange = (e: any) => {
      formData.enabled = e.target.checked
    }

    // 确定按钮
    const handleSubmit = () => {
      // 校验表单
      if (!formData.enabled) {
        message.error('请开启动态分区')
        return
      }

      if (!formData.timeUnit) {
        message.error('请选择分区时间单位')
        return
      }

      if (formData.startOffset !== undefined && formData.startOffset >= 0) {
        message.error('起始偏移量必须为负数')
        return
      }

      if (!formData.endOffset || formData.endOffset <= 0) {
        message.error('结束偏移量必须为正数')
        return
      }

      if (!formData.prefix || !formData.prefix.trim()) {
        message.error('请输入分区名前缀')
        return
      }

      if (formData.prefix.length > 40) {
        message.error('分区名前缀最长40个字符')
        return
      }

      if (!formData.buckets || formData.buckets <= 0) {
        message.error('每个分区桶数量必须大于0')
        return
      }

      emit('submit', { ...formData })
      emit('update:visible', false)
      message.success('动态分区配置保存成功')
    }

    // 取消按钮
    const handleCancel = () => {
      emit('update:visible', false)
    }

    return () => (
      <Modal
        title="动态分区配置"
        open={props.visible}
        width={500}
        onCancel={handleCancel}
        onOk={handleSubmit}
        okText="确定"
        cancelText="取消"
      >
        <div style={{ padding: '20px 0' }}>
          <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
            <FormItem label="是否开启分区" required>
              <Checkbox
                checked={formData.enabled}
                onChange={handleEnabledChange}
              >
                开启动态分区
              </Checkbox>
            </FormItem>

            <FormItem label="分区时间单位" required>
              <Select
                v-model:value={formData.timeUnit}
                options={timeUnitOptions}
                placeholder="请选择分区时间单位"
                style={{ width: '100%' }}
              />
            </FormItem>

            <FormItem label="起始偏移量">
              <InputNumber
                v-model:value={formData.startOffset}
                placeholder="请输入负数，如 -7"
                style={{ width: '100%' }}
                min={undefined}
                max={-1}
              />
              <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                只能填写负数，例如：-7 表示从7天前开始
              </div>
            </FormItem>

            <FormItem label="结束偏移量" required>
              <InputNumber
                v-model:value={formData.endOffset}
                placeholder="请输入正数，如 7"
                style={{ width: '100%' }}
                min={1}
              />
              <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                只能填写正数，例如：7 表示到7天后结束
              </div>
            </FormItem>

            <FormItem label="分区名前缀" required>
              <Input
                v-model:value={formData.prefix}
                placeholder="请输入分区名前缀"
                maxlength={40}
                showCount
              />
            </FormItem>

            <FormItem label="每个分区桶数量" required>
              <InputNumber
                v-model:value={formData.buckets}
                placeholder="请输入桶数量"
                style={{ width: '100%' }}
                min={1}
              />
            </FormItem>
          </Form>
        </div>
      </Modal>
    )
  }
})
</script>

<style scoped>
</style>

