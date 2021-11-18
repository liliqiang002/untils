import axios from "axios"
import { Message } from 'element-ui'
const config = {
  baseURL: process.env.VUE_APP_BASEURL,
  timeout: 5000
}
const instance = axios.create(config)
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
}, function (error) {
  console.log(error)
  // 对请求错误做些什么
  return Promise.reject(error)
})
// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response
}, function (error) {
  if (error.response.status === 422) {
    let data = error.response.data.errors
    let content = ''

    Object.keys(data).map(function (key) {
      let value = data[key]
      content = value[0]
    })

    Message.error(content)
  } else if (error.response.status === 403) {
    Message.error(error.response.data.message || '您没有此操作权限！')
  } else if (error.response.status === 401) {
    // console.log(12212)
    location.href = '/login'   
  } else if (error.response.status === 429) {
    Message.error(error.response.data.message || '请求过于频繁！')
  } else {
    Message.error('服务器错误!')
  }
})
const httpRequst = {}
httpRequst.get = function (url, params) {
  return new Promise((resolve, reject) => {
    instance.get(url, { params: params })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}
httpRequst.post = function (url, params = {}) {
  return new Promise((resolve, reject) => {
    instance.post(url, params)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}
httpRequst.put = function (url, params = {}) {
  return new Promise((resolve, reject) => {
    instance.put(url, params)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}
httpRequst.delete = function (url, params = {}) {
  return new Promise((resolve, reject) => {
    instance.delete(url, params)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}
export default httpRequst