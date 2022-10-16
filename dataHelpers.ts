import qs from 'query-string'
import he from 'he'

export class dataHelpers {

  const debounce = (func, timeout = 300) => {
    let timer;
    return (...args) => {
      if (!timer) {
        func.apply(this, args);
      }
      clearTimeout(timer);
      timer = setTimeout(() => {
        timer = undefined;
      }, timeout);
    };
  };

  const getHistoryElement = (key) => {
    const parsed = qs.parse(location.search)
    return parsed[key]
  }

  export const openUrl = (url) => window.open(url, '_blank')
  export const createQueryURL = (path, params) => {
    return params ? `${path}?${qs.stringify(params)}` : path
  }
  export const getQueryString = (params) => {
    return `?${qs.stringify(params)}`
  }

  export function uuidv4 () {
    const uuid = new Array(36)
    for (let i = 0; i < 36; i++) {
      uuid[i] = Math.floor(Math.random() * 16)
    }
    uuid[14] = 4 // set bits 12-15 of time-high-and-version to 0100
    uuid[19] = uuid[19] &= ~(1 << 2) // set bit 6 of clock-seq-and-reserved to zero
    uuid[19] = uuid[19] |= (1 << 3) // set bit 7 of clock-seq-and-reserved to one
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    return uuid.map((x) => x.toString(16)).join('')
  }

  export const range = (size, startAt = 1) => {
    return [...Array(size).keys()].map(i => i + startAt)
  }

  export const hexValidator = (value) => {
    return /^#([0-9a-f]{3}){1,2}$/i.test(value)
  }
  

  export const clearThree = (obj) => {
    while (obj.children.length > 0) {
      clearThree(obj.children[0])
      obj.remove(obj.children[0])
    }
    if (obj.geometry) {
      obj.geometry.dispose()
      obj.geometry = undefined
    }
  
    if (obj.material) {
      Object.keys(obj.material).forEach(prop => {
        if (!obj.material[prop]) { return }
        if (obj.material[prop] !== null && typeof obj.material[prop].dispose === 'function') { obj.material[prop].dispose() }
      })
      obj.material.dispose()
      obj.material = undefined
    }
  }
}