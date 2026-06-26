const PREFIX = 'lucky-admin-'

export function getStorage<T = string>(key: string): T | null {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw === null) return null

    try {
      return JSON.parse(raw) as T
    } catch {
      return raw as T
    }
  } catch {
    return null
  }
}

export function setStorage(key: string, value: unknown): void {
  try {
    const raw = typeof value === 'string' ? value : JSON.stringify(value)
    localStorage.setItem(PREFIX + key, raw)
  } catch {
    // Ignore storage errors in private mode or quota-limited environments.
  }
}

export function removeStorage(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key)
  } catch {
    // Ignore storage errors.
  }
}

export function clearStorage(): void {
  try {
    const keysToRemove: string[] = []

    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index)
      if (key?.startsWith(PREFIX)) keysToRemove.push(key)
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key))
  } catch {
    // Ignore storage errors.
  }
}
