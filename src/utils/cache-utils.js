const cache = new Map()

/**
 * 设置缓存
 * @param {string} key - 缓存键
 * @param {any} value - 缓存值
 */
export function setCache(key, value) {
    cache.set(key, value)
}

/**
 * 获取缓存
 * @param {string} key - 缓存键
 * @returns {any} 缓存值
 */
export function getCache(key) {
    return cache.get(key)
}

/**
 * 删除缓存
 * @param {string} key - 缓存键
 */
export function deleteCache(key) {
    cache.delete(key)
}

/**
 * 清空缓存
 */
export function clearCache() {
    cache.clear()
}
