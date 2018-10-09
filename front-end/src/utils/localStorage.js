let storageSecret = 'merchant-admin'

const storage = window.localStorage || {
  setItem: () => {},
  getItem: () => {},
  removeItem: () => {}
}

export default {
  set: (key, val) => {
    if (!val) return false
    storage.setItem(`${storageSecret}_${key}`, JSON.stringify(val))
  },
  get: key => {
    let item = storage.getItem(`${storageSecret}_${key}`)
    if (item) {
      try {
        return JSON.parse(item)
      } catch (e) {
        return item
      }
    } else {
      return null
    }
  },
  remove: key => {
    storage.removeItem(`${storageSecret}_${key}`)
  }
}