<template>
  <div class="simple-linkage-example">
    <div class="example-header">
      <h2>🔗 联动示例</h2>
      <p>展示动态表单的联动功能，包括条件显示、选项联动和自动重置</p>
    </div>
    
    <!-- 功能说明 -->
    <div class="feature-overview">
      <div class="feature-grid">
        <div class="feature-card">
          <div class="feature-icon">👁️</div>
          <h4>条件显示</h4>
          <p>根据其他字段的值动态显示/隐藏字段</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🔄</div>
          <h4>选项联动</h4>
          <p>根据选择的值动态更新选项列表</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🔄</div>
          <h4>自动重置</h4>
          <p>依赖字段变化时自动重置到初始状态</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">⚙️</div>
          <h4>可配置</h4>
          <p>支持启用/禁用重置功能</p>
        </div>
      </div>
    </div>
    
    <!-- 示例表单 -->
    <div class="examples-container">
      <!-- 基础联动示例 -->
      <div class="example-section">
        <h3>📋 基础联动示例</h3>
        <p class="section-desc">用户类型变化时，相关字段自动显示/隐藏并重置</p>
        <div class="form-wrapper">
          <SimpleForm
            v-model="basicFormData"
            :schema="basicSchema"
            @change="handleBasicChange"
          />
        </div>
        <div class="data-panel">
          <h4>📊 表单数据</h4>
          <pre class="data-content">{{ JSON.stringify(basicFormData, null, 2) }}</pre>
        </div>
      </div>
      
      <!-- 地区联动示例 -->
      <div class="example-section">
        <h3>🌍 地区联动示例</h3>
        <p class="section-desc">地区变化时，区域自动重置，确保数据一致性</p>
        <div class="form-wrapper">
          <SimpleForm
            v-model="regionFormData"
            :schema="regionSchema"
            @change="handleRegionChange"
          />
        </div>
        <div class="data-panel">
          <h4>📊 表单数据</h4>
          <pre class="data-content">{{ JSON.stringify(regionFormData, null, 2) }}</pre>
        </div>
      </div>
      
      <!-- 车辆信息联动示例 -->
      <div class="example-section">
        <h3>🚗 车辆信息联动示例</h3>
        <p class="section-desc">车辆类型变化时，品牌自动重置，支持级联联动</p>
        <div class="form-wrapper">
          <SimpleForm
            v-model="vehicleFormData"
            :schema="vehicleSchema"
            @change="handleVehicleChange"
          />
        </div>
        <div class="data-panel">
          <h4>📊 表单数据</h4>
          <pre class="data-content">{{ JSON.stringify(vehicleFormData, null, 2) }}</pre>
        </div>
      </div>
      
      <!-- 自定义重置行为示例 -->
      <div class="example-section">
        <h3>⚙️ 自定义重置行为示例</h3>
        <p class="section-desc">通过 resetOnChange 配置精确控制字段重置行为，展示不同业务场景下的重置策略</p>
        
        <!-- 重置行为说明 -->
        <div class="reset-behavior-guide">
          <div class="behavior-item">
            <span class="behavior-badge reset">🔄 会重置</span>
            <span>具体产品、价格区间、库存状态</span>
          </div>
          <div class="behavior-item">
            <span class="behavior-badge keep">📌 保持不变</span>
            <span>品牌名称、备注信息</span>
          </div>
        </div>
        
        <div class="form-wrapper">
          <SimpleForm
            v-model="customFormData"
            :schema="customSchema"
            @change="handleCustomChange"
          />
        </div>
        <div class="data-panel">
          <h4>📊 表单数据</h4>
          <pre class="data-content">{{ JSON.stringify(customFormData, null, 2) }}</pre>
        </div>
      </div>
    </div>
    
    <!-- 使用说明 -->
    <div class="usage-guide">
      <h3>💡 使用说明</h3>
      <div class="guide-content">
        <div class="guide-section">
          <h4>🔄 联动重置功能</h4>
          <p>当依赖字段的值发生变化时，被依赖的字段会自动恢复到初始状态，避免数据不一致的问题。</p>
          <div class="code-example">
            <h5>基础用法：</h5>
            <pre><code>{
  name: 'personalName',
  type: 'input',
  label: '个人姓名',
  linkage: {
    dependsOn: 'userType',
    visibleWhen: (value, formData) => formData.userType === 'personal',
    resetOnChange: true // 默认值，可以省略
  }
}</code></pre>
          </div>
          <div class="code-example">
            <h5>禁用重置：</h5>
            <pre><code>{
  name: 'brand',
  type: 'input',
  label: '品牌名称',
  linkage: {
    dependsOn: 'product',
    visibleWhen: (value, formData) => !!formData.product,
    resetOnChange: false // 禁用重置功能
  }
}</code></pre>
          </div>
        </div>
        
        <div class="guide-section">
          <h4>🎯 智能初始值</h4>
          <p>系统会根据字段类型自动选择合适的初始值：</p>
          <ul>
            <li>输入框、文本域：空字符串 <code>""</code></li>
            <li>选择器、单选框：<code>undefined</code></li>
            <li>复选框：<code>false</code></li>
            <li>数字输入框：<code>undefined</code></li>
            <li>日期选择器：<code>undefined</code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { SimpleFormSchema } from '../types/form'
import SimpleForm from '../components/SimpleForm.vue'

// 基础联动表单数据
const basicFormData = ref({})

// 地区联动表单数据
const regionFormData = ref({})

// 车辆信息联动表单数据
const vehicleFormData = ref({})

// 自定义重置行为表单数据
const customFormData = ref({})

// 基础联动Schema
const basicSchema: SimpleFormSchema = {
  fields: [
    {
      name: 'userType',
      type: 'radio',
      label: '用户类型',
      options: [
        { label: '个人用户', value: 'personal' },
        { label: '企业用户', value: 'enterprise' }
      ],
      rules: [{ required: true, message: '请选择用户类型' }]
    },
    {
      name: 'personalName',
      type: 'input',
      label: '个人姓名',
      placeholder: '请输入姓名',
      linkage: {
        dependsOn: 'userType',
        visibleWhen: (value, formData) => formData.userType === 'personal',
        resetOnChange: true // 默认值，可以省略
      },
      rules: [{ required: true, message: '请输入个人姓名' }]
    },
    {
      name: 'companyName',
      type: 'input',
      label: '公司名称',
      placeholder: '请输入公司名称',
      linkage: {
        dependsOn: 'userType',
        visibleWhen: (value, formData) => formData.userType === 'enterprise',
        resetOnChange: true
      },
      rules: [{ required: true, message: '请输入公司名称' }]
    }
  ]
}

// 地区联动Schema
const regionSchema: SimpleFormSchema = {
  fields: [
    {
      name: 'region',
      type: 'select',
      label: '地区',
      placeholder: '请选择地区',
      options: [
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
        { label: '广州', value: 'guangzhou' },
        { label: '深圳', value: 'shenzhen' }
      ]
    },
    {
      name: 'area',
      type: 'select',
      label: '区域',
      placeholder: '请选择区域',
      linkage: {
        dependsOn: 'region',
        optionsMap: {
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
        },
        resetOnChange: true
      }
    }
  ]
}

// 车辆信息联动Schema
const vehicleSchema: SimpleFormSchema = {
  fields: [
    {
      name: 'hasVehicle',
      type: 'radio',
      label: '是否有车',
      options: [
        { label: '是', value: true },
        { label: '否', value: false }
      ]
    },
    {
      name: 'vehicleType',
      type: 'select',
      label: '车辆类型',
      placeholder: '请选择车辆类型',
      options: [
        { label: '轿车', value: 'sedan' },
        { label: 'SUV', value: 'suv' },
        { label: '货车', value: 'truck' }
      ],
      linkage: {
        dependsOn: 'hasVehicle',
        visibleWhen: (value, formData) => formData.hasVehicle === true,
        resetOnChange: true
      }
    },
    {
      name: 'vehicleBrand',
      type: 'select',
      label: '车辆品牌',
      placeholder: '请选择车辆品牌',
      linkage: {
        dependsOn: 'vehicleType',
        visibleWhen: (value, formData) => formData.hasVehicle === true && !!formData.vehicleType,
        optionsMap: {
          sedan: [
            { label: '奔驰', value: 'benz' },
            { label: '宝马', value: 'bmw' },
            { label: '奥迪', value: 'audi' }
          ],
          suv: [
            { label: '途观', value: 'tiguan' },
            { label: 'Q5', value: 'q5' },
            { label: 'GLC', value: 'glc' }
          ],
          truck: [
            { label: '东风', value: 'dongfeng' },
            { label: '解放', value: 'jiefang' },
            { label: '重汽', value: 'zhongqi' }
          ]
        },
        resetOnChange: true
      }
    }
  ]
}

// 自定义重置行为Schema - 商品管理场景
const customSchema: SimpleFormSchema = {
  fields: [
    {
      name: 'category',
      type: 'select',
      label: '📦 产品分类',
      placeholder: '请选择产品分类',
      options: [
        { label: '电子产品', value: 'electronics' },
        { label: '服装箱包', value: 'clothing' },
        { label: '食品饮料', value: 'food' },
        { label: '家居用品', value: 'home' }
      ],
      rules: [{ required: true, message: '请选择产品分类' }]
    },
    {
      name: 'product',
      type: 'select',
      label: '📱 具体产品',
      placeholder: '请选择具体产品',
      linkage: {
        dependsOn: 'category',
        optionsMap: {
          electronics: [
            { label: '智能手机', value: 'smartphone' },
            { label: '笔记本电脑', value: 'laptop' },
            { label: '平板电脑', value: 'tablet' },
            { label: '智能手表', value: 'smartwatch' }
          ],
          clothing: [
            { label: '休闲上衣', value: 'casual_shirt' },
            { label: '商务西装', value: 'business_suit' },
            { label: '运动鞋', value: 'sneakers' },
            { label: '手提包', value: 'handbag' }
          ],
          food: [
            { label: '有机水果', value: 'organic_fruit' },
            { label: '进口零食', value: 'imported_snacks' },
            { label: '功能饮料', value: 'energy_drink' },
            { label: '健康代餐', value: 'meal_replacement' }
          ],
          home: [
            { label: '智能家电', value: 'smart_appliance' },
            { label: '家具装饰', value: 'furniture' },
            { label: '收纳用品', value: 'storage' },
            { label: '清洁用品', value: 'cleaning' }
          ]
        },
        resetOnChange: true // 🔄 分类变化时会重置具体产品
      }
    },
    {
      name: 'priceRange',
      type: 'select',
      label: '💰 价格区间',
      placeholder: '请选择价格区间',
      options: [
        { label: '100以下', value: 'under_100' },
        { label: '100-500', value: '100_500' },
        { label: '500-1000', value: '500_1000' },
        { label: '1000-5000', value: '1000_5000' },
        { label: '5000以上', value: 'over_5000' }
      ],
      linkage: {
        dependsOn: 'product',
        visibleWhen: (value, formData) => !!formData.product,
        resetOnChange: true // 🔄 产品变化时会重置价格区间
      }
    },
    {
      name: 'stockStatus',
      type: 'radio',
      label: '📦 库存状态',
      options: [
        { label: '有库存', value: 'in_stock' },
        { label: '库存紧张', value: 'low_stock' },
        { label: '缺货', value: 'out_of_stock' }
      ],
      linkage: {
        dependsOn: 'product',
        visibleWhen: (value, formData) => !!formData.product,
        resetOnChange: true // 🔄 产品变化时会重置库存状态
      }
    },
    {
      name: 'brand',
      type: 'input',
      label: '🏷️ 品牌名称',
      placeholder: '请输入品牌名称（切换产品时不会清空）',
      linkage: {
        dependsOn: 'product',
        visibleWhen: (value, formData) => !!formData.product,
        resetOnChange: false // 📌 产品变化时不会重置品牌名称
      }
    },
    {
      name: 'description',
      type: 'textarea',
      label: '📝 备注信息',
      placeholder: '请输入备注信息（切换分类时也不会清空）',
      linkage: {
        dependsOn: 'category',
        visibleWhen: (value, formData) => !!formData.category,
        resetOnChange: false // 📌 分类变化时不会重置备注信息
      }
    },
    {
      name: 'isRecommended',
      type: 'checkbox',
      label: '⭐ 推荐商品',
      linkage: {
        dependsOn: 'product',
        visibleWhen: (value, formData) => !!formData.product,
        resetOnChange: true // 🔄 产品变化时会重置推荐状态
      }
    }
  ]
}

// 事件处理函数
const handleBasicChange = (data: any) => {
  console.log('基础表单变化:', data)
}

const handleRegionChange = (data: any) => {
  console.log('地区表单变化:', data)
}

const handleVehicleChange = (data: any) => {
  console.log('车辆表单变化:', data)
}

const handleCustomChange = (data: any) => {
  console.log('自定义表单变化:', data)
}
</script>

<style scoped>
.simple-linkage-example {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.example-header {
  text-align: center;
  margin-bottom: 32px;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
}

.example-header h2 {
  margin: 0 0 12px 0;
  font-size: 2rem;
  font-weight: 700;
}

.example-header p {
  margin: 0;
  font-size: 1.1rem;
  opacity: 0.9;
}

/* 功能概览 */
.feature-overview {
  margin-bottom: 32px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.feature-card {
  text-align: center;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 12px;
}

.feature-card h4 {
  margin: 0 0 8px 0;
  color: #2d3748;
  font-size: 1.1rem;
}

.feature-card p {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* 示例容器 */
.examples-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.example-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.example-section h3 {
  margin: 0 0 8px 0;
  color: #2d3748;
  font-size: 1.3rem;
}

.section-desc {
  margin: 0 0 20px 0;
  color: #6b7280;
  font-size: 0.95rem;
}

.form-wrapper {
  margin-bottom: 20px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.data-panel {
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.data-panel h4 {
  margin: 0 0 12px 0;
  color: #374151;
  font-size: 1rem;
}

.data-content {
  background: white;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  font-size: 11px;
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  line-height: 1.4;
}

/* 重置行为说明样式 */
.reset-behavior-guide {
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-bottom: 20px;
}

.behavior-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.behavior-item:last-child {
  margin-bottom: 0;
}

.behavior-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  min-width: 80px;
  text-align: center;
}

.behavior-badge.reset {
  background: #fef3cd;
  color: #92400e;
  border: 1px solid #f59e0b;
}

.behavior-badge.keep {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #10b981;
}

.behavior-item > span:last-child {
  color: #6b7280;
  font-size: 14px;
}

/* 使用说明 */
.usage-guide {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  margin-top: 32px;
}

.usage-guide h3 {
  text-align: center;
  margin: 0 0 24px 0;
  color: #2d3748;
  font-size: 1.5rem;
}

.guide-content {
  display: grid;
  gap: 24px;
}

.guide-section {
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.guide-section h4 {
  margin: 0 0 12px 0;
  color: #374151;
  font-size: 1.1rem;
}

.guide-section p {
  margin: 0 0 16px 0;
  color: #6b7280;
  line-height: 1.6;
}

.guide-section ul {
  margin: 0 0 16px 0;
  padding-left: 20px;
  color: #6b7280;
}

.guide-section li {
  margin: 4px 0;
  line-height: 1.5;
}

.guide-section code {
  background: #e5e7eb;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
  color: #374151;
}

.code-example {
  margin: 16px 0;
}

.code-example h5 {
  margin: 0 0 8px 0;
  color: #374151;
  font-size: 0.95rem;
}

.code-example pre {
  background: #1e293b;
  color: #e2e8f0;
  border-radius: 6px;
  padding: 16px;
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.5;
  overflow-x: auto;
}

.code-example code {
  background: transparent;
  color: inherit;
  padding: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .simple-linkage-example {
    padding: 16px;
  }
  
  .example-header h2 {
    font-size: 1.5rem;
  }
  
  .example-header p {
    font-size: 1rem;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
  
  .form-wrapper {
    padding: 16px;
  }
  
  .data-content {
    font-size: 10px;
  }
}
</style>