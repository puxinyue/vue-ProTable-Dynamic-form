/**
 * @author 蒲鑫宇
 * @description ProForm 高级表单
 */
import {
  defineComponent,
  ref,
  watch,
  nextTick
} from 'vue'
import {
  Form,
  Row,
  Col,
  Input,
  InputNumber,
  Radio,
  Checkbox,
  DatePicker,
  Select,
  Switch,
  TimePicker,
  TreeSelect,
  Upload,
  Cascader,
  Button,
  Space,
  Textarea,
  type FormInstance,
} from 'ant-design-vue'
import { UpOutlined, DownOutlined, UploadOutlined,SyncOutlined } from '@ant-design/icons-vue'

import { fnCopy } from '../ProTable/utils'
import { ThemeColor } from '../ProTable/conf'
// import BtnContent from '@/components/btnContent/index.vue'
import  './style.less'

import type { ProFormProps, FormEmit } from './types'
import type { PMColumnType, ValueType, PMSetupContext } from '../ProTable/types'

export default defineComponent<ProFormProps>(function ProForm(_, {
  attrs,
  expose,
  emit
}: PMSetupContext<ProFormProps, FormEmit>) {
  const {
    search,
    isShowToolRender
  } = attrs

  // 初始值 form表单绑定值
  const formVals: Record<string, any> = {}
  let formColSpanNum = 0
  attrs.formListData?.forEach((item: any) => {
    if (item.valueType === 'doubleDatePicker') {
      formVals[item.doubleFieldList![0]] = item.initialValue?.[0] ?? undefined
      formVals[item.doubleFieldList![1]] = item.initialValue?.[1] ?? undefined
    }
    formVals[item.dataIndex as string] = item.initialValue ?? undefined

    // 出现了多少次
    item.formColSpan && formColSpanNum++
  })

  const formState = ref<Record<string, any>>(formVals)
  const gutter = ref(24)
  const colSpan = ref(attrs.search?.colSpan || 8)
  const lastColSpan = ref(gutter.value)
  // 是否收起，默认收起
  const isCollapsed = ref(isShowToolRender !== false ? search?.isCollapsed ?? true : false)
  const tQProFormRef = ref<FormInstance>()
  const inputSearchRef = ref()

  /**
   * 选项自动拉取引擎（增量增强，不影响原逻辑）
   */
  const requestResults = ref<Record<string, any>>({})
  const requestAborters = new Map<string, AbortController>()
  const requestCache = new Map<string, { data: any }>()
  const debounceTimers = new Map<string, any>()
  // 响应式的选项数据存储
  const dynamicOptions = ref<Record<string, any[]>>({})

  const get = (obj: any, path: string, def?: any) => {
    try {
      if (!obj) return def
      const parts = path.split('.').filter(Boolean)
      let cur = obj
      for (const p of parts) {
        if (cur == null) return def
        cur = cur[p]
      }
      return cur == null ? def : cur
    } catch (_) {
      return def
    }
  }

  const stableStringify = (v: any) => {
    try {
      return JSON.stringify(v, Object.keys(v || {}).sort())
    } catch (_) {
      return String(v)
    }
  }

  const buildCtx = () => ({
    values: formState.value,
    requestResults: requestResults.value
  })

  const resolveCacheKey = (node: any) => {
    const { url, cacheKey } = node.optionsSource || {}
    if (typeof cacheKey === 'function') return cacheKey({ values: formState.value })
    if (typeof cacheKey === 'string') return cacheKey
    const params = typeof node.optionsSource?.params === 'function'
      ? node.optionsSource?.params(buildCtx())
      : node.optionsSource?.params
    return `${url || ''}|${stableStringify(params)}`
  }

  const setItemOptions = (node: any, options: any[]) => {
    console.log('setItemOptions:', node.dataIndex, options)
    const normalizedOptions = normalizeOptions(options)
    // 使用响应式存储
    dynamicOptions.value[node.dataIndex as string] = normalizedOptions
    console.log('setItemOptions after:', node.dataIndex, normalizedOptions)
  }

  const runFetch = async (node: any) => {
    const os = node.optionsSource
    if (!os?.url) return

    const key = os.key || node.dataIndex || os.url
    const debounceMs = os.debounceMs ?? 0

    if (debounceMs > 0) {
      clearTimeout(debounceTimers.get(key))
      return new Promise<void>((resolve) => {
        const t = setTimeout(async () => {
          debounceTimers.delete(key)
          await _fetchInternal()
          resolve()
        }, debounceMs)
        debounceTimers.set(key, t)
      })
    }

    return _fetchInternal()

    async function _fetchInternal() {
      // 取消在途
      requestAborters.get(key)?.abort()
      const controller = new AbortController()
      requestAborters.set(key, controller)

      const ctx = buildCtx()
      const rawParams = typeof os.params === 'function' ? os.params(ctx) : (os.params || {})
      const cacheKey = resolveCacheKey(node)
      if (cacheKey && requestCache.has(cacheKey)) {
        const cached = requestCache.get(cacheKey)!.data
        const options = (os.transform ? os.transform(cached, ctx) : (get(cached, 'data', cached))) || []
        setItemOptions(node, normalizeOptions(options))
        requestResults.value[os.key || key] = cached
        return
      }

      try {
        const method = (os.method || 'GET').toUpperCase()
        const isGet = method === 'GET'
        const url = os.url as string
        const fullUrl = isGet && rawParams && Object.keys(rawParams).length
          ? `${url}?${new URLSearchParams(rawParams).toString()}`
          : url
        const res = await fetch(fullUrl, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: !isGet ? JSON.stringify(rawParams) : undefined,
          signal: controller.signal
        })
        const data = await res.json()
        requestResults.value[os.key || key] = data
        if (cacheKey) requestCache.set(cacheKey, { data })
        const options = (os.transform ? os.transform(data, ctx) : (get(data, 'data', data))) || []
        setItemOptions(node, normalizeOptions(options))
      } catch (err) {
        os.onError?.(err, buildCtx())
        if (os.emptyAs) setItemOptions(node, os.emptyAs)
      }
    }
  }

  const normalizeOptions = (list: any[]): { label: any; value: any }[] => {
    if (!Array.isArray(list)) return []
    return list.map((it: any) => {
      if (it && typeof it === 'object' && 'label' in it && 'value' in it) return it
      const label = it?.name ?? it?.title ?? it?.label ?? it?.text ?? it?.id ?? it
      const value = it?.id ?? it?.value ?? it?.code ?? it
      return { label, value }
    })
  }

  const runOptionsEngine = async () => {
    const nodes = (attrs.formListData || []).filter((i: any) => i?.optionsSource?.url)
    if (nodes.length === 0) return

    const keyToNode = new Map<string, any>()
    const indeg = new Map<string, number>()
    const adj = new Map<string, string[]>()

    for (const n of nodes) {
      const key = n.optionsSource.key || n.dataIndex || n.optionsSource.url
      keyToNode.set(key, n)
      const deps = n.optionsSource.dependsOnRequests || []
      indeg.set(key, deps.length)
      for (const d of deps) {
        adj.set(d, [...(adj.get(d) || []), key])
      }
    }

    // 执行拓扑
    const queue: string[] = []
    indeg.forEach((v, k) => { if (v === 0) queue.push(k) })

    const visited = new Set<string>()
    while (queue.length) {
      const k = queue.shift()!
      const node = keyToNode.get(k)
      if (!node) continue
      visited.add(k)
      await runFetch(node)
      for (const nxt of adj.get(k) || []) {
        const nv = (indeg.get(nxt) || 0) - 1
        indeg.set(nxt, nv)
        if (nv === 0) queue.push(nxt)
      }
    }
  }

  const bindFieldWatchers = () => {
    const nodes = (attrs.formListData || []).filter((i: any) => i?.optionsSource?.url)
    if (nodes.length === 0) return
    for (const n of nodes) {
      const fields = n.optionsSource?.dependsOnFields || []
      if (!fields.length) continue
      watch(() => fields.map((f: string) => formState.value[f]), async () => {
        // 依赖变化可选重置自身值
        if (n.optionsSource?.resetOnChange) {
          formState.value[n.dataIndex as string] = undefined
        }
        await runFetch(n)
        // 下游依赖当前请求 key 的也要触发
        const curKey = n.optionsSource?.key || n.dataIndex || n.optionsSource?.url
        const downstream = (attrs.formListData || []).filter((x: any) => x?.optionsSource?.dependsOnRequests?.includes(curKey))
        for (const dn of downstream) await runFetch(dn)
      }, { deep: true })
    }
  }

  // 初始化：在状态准备好后运行
  nextTick(() => {
    runOptionsEngine()
    bindFieldWatchers()
  })

  watch([isCollapsed], () => {
    // 计算 lastColSpan
    // 每一行展示多少个
    const rowNum = gutter.value / colSpan.value
    // 拿到最后一行展示的多少个  rowNum - 1 是收起时要展示的数目
    const lastRowNum = isCollapsed.value ? rowNum - 1 : (attrs.formListData!.length - formColSpanNum) % rowNum
    // 就是 lastColSpan 的数目
    lastColSpan.value = gutter.value - lastRowNum * colSpan.value
  }, { immediate: true, deep: true })

  watch(() => attrs.search?.colSpan, () => {
    colSpan.value = attrs.search?.colSpan!
  })

  /**
   * 渲染组件
   * @param item 每一个 
   * @returns JSX.Element
   */
  const formComponentRender = (item: PMColumnType) => {
    const {
      valueType = 'input',
      dataIndex
    } = item
    // 优先使用动态选项，然后使用静态选项
    const options = dynamicOptions.value[dataIndex as string] || item.options || []
    

    // 公共的属性
    const commonProps = {
      value: formState.value[dataIndex as string],
      onChange: (val: any, ...args: any[]) => {
        // 表单改变，展开表单
        // isCollapsed.value = false
        // 传递收起展开事件
        // emit('collapsed', isCollapsed.value)
        if (valueType === 'inputSearch') {
          inputSearchRef.value.blur()
          return
        }

        if (['input', 'radio', 'textarea', 'inputSearchFillIn'].includes(valueType)) {
          formState.value[dataIndex as string] = val.target.value
        } else {
          item.fieldProps?.componentProps.onSelfChange?.(val, args)
          formState.value[dataIndex as string] = val
        }

        // 进行复制
        if (
          item.valueType === 'select'
          && !item.fieldProps?.componentProps.mode
          && item.fieldProps?.componentProps.showSearch
        ) {
          fnCopy(args[0].label)
        }
      },
      onfocus() {
        // 表单改变，展开表单
        // isCollapsed.value = false
        // 传递收起展开事件
        // emit('collapsed', isCollapsed.value)
      }
    }

    const componentMap: Record<ValueType, JSX.Element> = {
      input: (
        <Input
          placeholder={`请输入${item.title}`}
          allowClear
          {...commonProps}
          {...item.fieldProps?.componentProps as any}
          autocomplete="off"
        />
      ),
      inputSearch: (
        <Input.Search
          ref={inputSearchRef}
          placeholder={`请选择${item.title}`}
          maxlength={0}
          enterButton
          autocomplete="off"
          {...commonProps}
          {...item.fieldProps?.componentProps as any}
        />
      ),
      inputSearchFillIn: (
        <Input.Search
          ref={inputSearchRef}
          placeholder={`请输入${item.title}`}
          autocomplete="off"
          {...commonProps}
          {...item.fieldProps?.componentProps as any}
        />
      ),
      textarea: (
        <Textarea
          placeholder={`请输入内容...`}
          maxlength={500}
          showCount
          autocomplete="off"
          {...commonProps}
          {...item.fieldProps?.componentProps as any}
        />
      ),
      inputNumber: (
        <InputNumber
          placeholder={`请输入${item.title}`}
          autocomplete="off"
          {...commonProps}
          {...item.fieldProps?.componentProps as any}
        />
      ),
      select: (
        <Select
          allowClear
          placeholder={`请选择${item.title}`}
          autocomplete="off"
          {...commonProps}
          options={options}
          {...item.fieldProps?.componentProps as any}
        />
      ),
      datePicker: (
        <DatePicker
          style={{ width: '100%' }}
          {...commonProps}
          {...item.fieldProps?.componentProps as any}
        />
      ),
      monthPicker: (
        <DatePicker.MonthPicker
          style={{ width: '100%' }}
          {...commonProps}
          {...item.fieldProps?.componentProps as any}
        />
      ),
      quarterPicker: (
        <DatePicker.QuarterPicker
          style={{ width: '100%' }}
          {...commonProps}
          {...item.fieldProps?.componentProps as any}
        />
      ),
      rangePicker: (
        <DatePicker.RangePicker
          {...commonProps}
          {...item.fieldProps?.componentProps as any}
        />
      ),
      weekPicker: (
        <DatePicker.WeekPicker
          {...commonProps}
          {...item.fieldProps?.componentProps as any}
        />
      ),
      yearPicker: (
        <DatePicker.YearPicker
          {...commonProps}
          {...item.fieldProps?.componentProps as any}
        />
      ),
      radio: (
        <Radio.Group
          {...commonProps}
          options={options}
          {...item.fieldProps?.componentProps as any}
        />
      ),
      checkbox: (
        <Checkbox.Group
          options={options}
          {...commonProps}
          {...item.fieldProps?.componentProps as any}
        />
      ),
      switch: (
        <Switch
          checked={formState.value[dataIndex as string]}
          onChange={(val) => formState.value[dataIndex as string] = val}
          {...item.fieldProps?.componentProps as any}
        />
      ),
      timePicker: (
        <TimePicker
          {...commonProps}
          {...item.fieldProps?.componentProps as any}
        />
      ),
      upload: (
        <Upload
          fileList={formState.value[dataIndex as string]}
          onChange={(val) => formState.value[dataIndex as string] = val.fileList}
          {...item.fieldProps?.componentProps as any}
        >
          <Button><UploadOutlined />
            {(item.fieldProps?.componentProps as any).uploadText || '点击上传'}
          </Button>
        </Upload>
      ),
      treeSelect: (
        <TreeSelect
          autocomplete="off"
          treeData={options || []}
          {...commonProps}
          {...item.fieldProps?.componentProps as any}
        />
      ),
      cascader: (
        <Cascader
          {...commonProps}
          options={options || []}
          {...item.fieldProps?.componentProps as any}
        />
      ),
      doubleDatePicker: (
        <div>{"下面👇🏻render函数遍历有写"}</div>
      )
    }

    if ((componentMap)[valueType]) return (componentMap)[valueType]
  }

  // 点击查询
  const handleFinish = (values: any) => {
    emit('query', values)
  }

  // 点击重置
  const handleReset = () => {
    emit('reset')
  }

  // 修改 formState 值
  const setFieldsValue = (val: Record<string, any>) => {
    for (const key of Object.keys(val)) {
      formState.value[key] = val[key]
    }
  }

  expose({
    setFieldsValue,
    formRef: tQProFormRef
  })

  return () => (
    <div class='tq_proform'>
      <Form
        ref={tQProFormRef}
        model={formState.value}
        labelCol={{
          style: {
            width: `${search?.labelWidth || 80}px`
          }
        }}
        onFinish={handleFinish}
      >
        <Row gutter={gutter.value} wrap>
          {
            attrs.formListData?.map((item: any, idx: number) => {
              return (
                <Col
                  style={{
                    // gutter.value / colSpan.value - 1 收起是要展开的数目
                    display: !isCollapsed.value || idx < ((gutter.value / colSpan.value)*2 - 1) ? 'block' : 'none'
                  }}
                  span={item.formColSpan || colSpan.value}
                >
                  {
                    item.valueType !== 'doubleDatePicker' ? (
                      <Form.Item
                        class={'form_item'}
                        name={item.dataIndex as string}
                        label={item.title}
                        {...item.formItemProps}
                        hidden={item.hidden}
                      >
                        {formComponentRender(item)}
                      </Form.Item>
                    ) : (
                      <Form.Item
                        class={'form_item'}
                        name={item.dataIndex as string}
                        label={item.title}
                        {...item.formItemProps}
                      >
                        <div style={{ display: 'flex' }}>
                          {
                            item.doubleFieldList?.map((itex: any, idx: number) => (
                              <Form.Item
                                class={'form_item'}
                                name={itex}
                                {...item.formItemProps}
                              >
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <DatePicker
                                    value={formState.value[itex]}
                                    onChange={(val) => {
                                      formState.value[itex] = val
                                      const key = item.dataIndex as string
                                      key && (formState.value[key][idx] = val)
                                    }}
                                    placement='bottomRight'
                                    {...item.fieldProps?.componentProps as any}
                                  />
                                  {idx === 0 && <span>~</span>}
                                </div>
                              </Form.Item>
                            ))
                          }
                        </div>
                      </Form.Item>
                    )
                  }
                </Col>
              )
            })
          }
          {
            isShowToolRender && (
              <Col
                class='last_col'
                span={lastColSpan.value}
              >
                <Form.Item class={'form_item'}>
                  <Space>
                    {/* 收起展开 */}
                    {
                      search?.isShowDefaultCollapsed !== false && attrs.formListData!.length>5 &&(
                        <div
                          style={{ cursor: 'pointer', color: ThemeColor }}
                          onClick={() => {
                            isCollapsed.value = !isCollapsed.value
                            // 传递收起展开事件
                            emit('collapsed', isCollapsed.value)
                          }}
                        >
                          {
                            isCollapsed.value
                              ? <span>展开<DownOutlined /></span>
                              : <span>收起<UpOutlined /></span>
                          }
                        </div>
                      )
                    }
                    {
                      search?.toolBarRender?.()
                    }
                    {
                      search?.isShowDefaultQuery !== false && (
                         <Button loading={attrs.queryLoading} type='primary' htmlType='submit'>
                          {search?.searchText || '查询'}
                          {/* <BtnContent type='search' btnText={search?.searchText || '查询'} /> */}
                         </Button>
                      )
                    }
                    {
                      search?.isShowDefaultReset !== false && (
                        <>
                        <Button onClick={handleReset}>
                          {search?.searchText || '重置'}
                        {/* <BtnContent type='reset' btnText={search?.searchText || '重置'} /> */}
                         </Button>
                        </>
                      )
                    }


                  </Space>
                </Form.Item>
              </Col>
            )
          }
        </Row>
      </Form>
    </div>
  )
})
