// 路径处理工具函数

/**
 * 根据路径获取对象中的值
 * @param obj 目标对象
 * @param path 路径字符串，如 'basicInfo.projectName'
 * @returns 对应路径的值
 */
export function getByPath(obj: any, path: string): any {
  if (!obj || !path) return undefined
  
  const keys = path.split('.')
  let current = obj
  
  for (const key of keys) {
    if (current == null || typeof current !== 'object') {
      return undefined
    }
    current = current[key]
  }
  
  return current
}

/**
 * 根据路径设置对象中的值
 * @param obj 目标对象
 * @param path 路径字符串，如 'basicInfo.projectName'
 * @param value 要设置的值
 */
export function setByPath(obj: any, path: string, value: any): void {
  if (!obj || !path) return
  
  const keys = path.split('.')
  let current = obj
  
  // 遍历到倒数第二个key，确保路径上的对象都存在
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {}
    }
    current = current[key]
  }
  
  // 设置最后一个key的值
  const lastKey = keys[keys.length - 1]
  current[lastKey] = value
}

/**
 * 根据路径删除对象中的值
 * @param obj 目标对象
 * @param path 路径字符串
 */
export function deleteByPath(obj: any, path: string): void {
  if (!obj || !path) return
  
  const keys = path.split('.')
  let current = obj
  
  // 遍历到倒数第二个key
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (!(key in current) || typeof current[key] !== 'object') {
      return // 路径不存在
    }
    current = current[key]
  }
  
  // 删除最后一个key
  const lastKey = keys[keys.length - 1]
  delete current[lastKey]
}

/**
 * 检查路径是否存在
 * @param obj 目标对象
 * @param path 路径字符串
 * @returns 是否存在该路径
 */
export function hasPath(obj: any, path: string): boolean {
  return getByPath(obj, path) !== undefined
}

/**
 * 获取所有路径及其值
 * @param obj 目标对象
 * @param prefix 路径前缀
 * @returns 路径值对象
 */
export function getAllPaths(obj: any, prefix = ''): Record<string, any> {
  const result: Record<string, any> = {}
  
  if (obj == null || typeof obj !== 'object') {
    return result
  }
  
  for (const key in obj) {
    const value = obj[key]
    const fullPath = prefix ? `${prefix}.${key}` : key
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      // 递归处理嵌套对象
      Object.assign(result, getAllPaths(value, fullPath))
    } else {
      result[fullPath] = value
    }
  }
  
  return result
}