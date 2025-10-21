import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

// 健康检查
app.get('/health', (_req, res) => res.json({ ok: true }))

// /api/areas（根据地区返回区域列表）
app.get('/api/areas', (req, res) => {
  const { region } = req.query as { region?: string }
  const areaMap: Record<string, Array<{ label: string; value: string }>> = {
    beijing: [
      { label: '朝阳区', value: 'chaoyang' },
      { label: '海淀区', value: 'haidian' },
      { label: '西城区', value: 'xicheng' },
      { label: '东城区', value: 'dongcheng' }
    ],
    shanghai: [
      { label: '浦东新区', value: 'pudong' },
      { label: '黄浦区', value: 'huangpu' },
      { label: '静安区', value: 'jingan' },
      { label: '徐汇区', value: 'xuhui' }
    ],
    guangzhou: [
      { label: '天河区', value: 'tianhe' },
      { label: '越秀区', value: 'yuexiu' },
      { label: '海珠区', value: 'haizhu' }
    ],
    shenzhen: [
      { label: '南山区', value: 'nanshan' },
      { label: '福田区', value: 'futian' },
      { label: '罗湖区', value: 'luohu' }
    ]
  }
  const data = region ? (areaMap[region] || []) : []
  res.json({ data })
})

// /api/orgs（组织列表）
app.get('/api/orgs', (_req, res) => {
  res.json({
    data: [
      { id: 1, name: '技术部' },
      { id: 2, name: '产品部' },
      { id: 3, name: '运营部' }
    ]
  })
})

// /api/departments（部门列表，依赖 orgId）
app.get('/api/departments', (req, res) => {
  const { orgId } = req.query as { orgId?: string }
  const id = Number(orgId)
  const data = [
    { id: 101, name: id === 1 ? '前端组' : id === 2 ? '产品设计组' : '市场组' },
    { id: 102, name: id === 1 ? '后端组' : id === 2 ? '产品运营组' : '推广组' }
  ]
  res.json({ data })
})

// /api/users（用户列表，依赖 deptId/orgId）
app.get('/api/users', (req, res) => {
  const { deptId, orgId } = req.query as { deptId?: string; orgId?: string }
  const d = Number(deptId)
  const o = Number(orgId)
  const data = [
    { id: 1001, name: `用户A-${o || ''}-${d || ''}` },
    { id: 1002, name: `用户B-${o || ''}-${d || ''}` },
    { id: 1003, name: `用户C-${o || ''}-${d || ''}` }
  ]
  res.json({ data })
})

// /api/product-types（产品类型）
app.get('/api/product-types', (_req, res) => {
  res.json({
    data: [
      { id: 1, name: '电子产品' },
      { id: 2, name: '服装' },
      { id: 3, name: '食品' }
    ]
  })
})

// /api/products（产品，依赖 typeId）
app.get('/api/products', (req, res) => {
  const { typeId } = req.query as { typeId?: string }
  const t = Number(typeId)
  const data = [
    { id: 201, name: t === 1 ? '手机' : t === 2 ? 'T恤' : '面包' },
    { id: 202, name: t === 1 ? '电脑' : t === 2 ? '裤子' : '牛奶' }
  ]
  res.json({ data })
})

// /api/specs（规格，依赖 productId）
app.get('/api/specs', (req, res) => {
  const { productId } = req.query as { productId?: string }
  const p = Number(productId)
  const data = [
    { id: 301, name: p === 201 ? '64GB' : p === 202 ? '16GB' : 'L码' },
    { id: 302, name: p === 201 ? '128GB' : p === 202 ? '32GB' : 'XL码' }
  ]
  res.json({ data })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`backEnd started at http://localhost:${PORT}`)
})

