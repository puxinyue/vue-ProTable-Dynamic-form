import { ref, reactive, computed, markRaw } from 'vue'
import type { Component } from 'vue'

// 全局组件注册表（使用响应式）
const globalComponents = reactive(new Map<string, Component>())
const globalComponentsVersion = ref(0)

/**
 * 组件注册接口
 */
export interface ComponentRegistry {
  register(type: string, component: Component): void
  get(type: string): Component | undefined
  has(type: string): boolean
  unregister(type: string): void
  clear(): void
  getAll(): Record<string, Component>
}

/**
 * 创建组件注册表
 */
export function createComponentRegistry(): ComponentRegistry {
  const components = reactive(new Map<string, Component>())
  const localVersion = ref(0)

  return {
    register(type: string, component: Component) {
      // 自动使用 markRaw 包装组件，避免 Vue 将其设为响应式
      components.set(type, markRaw(component))
      localVersion.value++
    },
    
    get(type: string): Component | undefined {
      // 通过访问version来建立响应式依赖
      localVersion.value
      globalComponentsVersion.value
      // 优先从实例注册表查找，再从全局注册表查找
      return components.get(type) || globalComponents.get(type)
    },
    
    has(type: string): boolean {
      // 通过访问version来建立响应式依赖
      localVersion.value
      globalComponentsVersion.value
      return components.has(type) || globalComponents.has(type)
    },
    
    unregister(type: string) {
      components.delete(type)
      localVersion.value++
    },
    
    clear() {
      components.clear()
      localVersion.value++
    },
    
    getAll(): Record<string, Component> {
      // 通过访问version来建立响应式依赖
      localVersion.value
      globalComponentsVersion.value
      
      const allComponents: Record<string, Component> = {}
      
      // 先添加全局组件
      globalComponents.forEach((component, type) => {
        allComponents[type] = component
      })
      
      // 再添加实例组件（会覆盖同名的全局组件）
      components.forEach((component, type) => {
        allComponents[type] = component
      })
      
      return allComponents
    }
  }
}

/**
 * 全局组件注册器
 */
export const globalComponentRegistry = {
  /**
   * 注册全局自定义字段组件
   * @param type 字段类型
   * @param component Vue 组件
   */
  register(type: string, component: Component) {
    // 自动使用 markRaw 包装组件，避免 Vue 将其设为响应式
    globalComponents.set(type, markRaw(component))
    globalComponentsVersion.value++
  },
  
  /**
   * 获取全局注册的组件
   * @param type 字段类型
   */
  get(type: string): Component | undefined {
    // 通过访问version来建立响应式依赖
    globalComponentsVersion.value
    return globalComponents.get(type)
  },
  
  /**
   * 检查是否存在指定类型的组件
   * @param type 字段类型
   */
  has(type: string): boolean {
    // 通过访问version来建立响应式依赖
    globalComponentsVersion.value
    return globalComponents.has(type)
  },
  
  /**
   * 取消注册全局组件
   * @param type 字段类型
   */
  unregister(type: string) {
    globalComponents.delete(type)
    globalComponentsVersion.value++
  },
  
  /**
   * 清空所有全局组件
   */
  clear() {
    globalComponents.clear()
    globalComponentsVersion.value++
  },
  
  /**
   * 获取所有全局注册的组件
   */
  getAll(): Record<string, Component> {
    // 通过访问version来建立响应式依赖
    globalComponentsVersion.value
    const result: Record<string, Component> = {}
    globalComponents.forEach((component, type) => {
      result[type] = component
    })
    return result
  },
  
  /**
   * 批量注册组件
   * @param components 组件映射表
   */
  registerBatch(components: Record<string, Component>) {
    Object.entries(components).forEach(([type, component]) => {
      this.register(type, component)
    })
  }
}

/**
 * Vue 插件形式的全局注册器
 */
export const SimpleFormPlugin = {
  install(app: any, options: { components?: Record<string, Component> } = {}) {
    // 将全局注册器添加到应用实例
    app.config.globalProperties.$simpleFormRegistry = globalComponentRegistry
    
    // 注册配置中的组件
    if (options.components) {
      globalComponentRegistry.registerBatch(options.components)
    }
    
    // 提供全局方法
    app.provide('simpleFormRegistry', globalComponentRegistry)
  }
}