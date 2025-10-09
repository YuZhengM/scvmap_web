import axios, { AxiosResponse } from 'axios';
import qs from 'qs';
import { ErrorResult } from '@/service/model/reponse/result';
import { ElNotification } from 'element-plus';

// 状态信息
const showStatus = (status: number) => {
  let message: string;
  switch (status) {
    case 400:
      message = 'Request error (400)!';
      break;
    case 401:
      message = 'Unauthorized, please log in again (401)!';
      break;
    case 403:
      message = 'Access denied (403)!';
      break;
    case 404:
      message = 'Request error (404)!';
      break;
    case 408:
      message = 'Request timeout (408)!';
      break;
    case 500:
      message = 'Server error (500)!';
      break;
    case 501:
      message = 'Service not implemented (501)!';
      break;
    case 502:
      message = 'Network error (502)!';
      break;
    case 503:
      message = 'Service unavailable (503)!';
      break;
    case 504:
      message = 'Network Timeout (504)!';
      break;
    case 505:
      message = 'HTTP version is not supported (505)!';
      break;
    default:
      message = `Link error (${status})!`;
  }
  return `${message}, Please check the network or contact the administrator!`;
};

// 声明一个 Map 用于存储每个请求的标识 和 取消函数
const pending = new Map();

/**
 * 添加请求
 * @param {Object} config
 */
const addPending = (config: any) => {
  const url = [
    config.method,
    config.url,
    qs.stringify(config.params),
    qs.stringify(config.data)
  ].join('&');
  config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
    // 如果 pending 中不存在当前请求, 则添加进去
    if (!pending.has(url)) {
      pending.set(url, cancel);
    }
  });
};

/**
 * 移除请求
 * @param {Object} config
 */
const removePending = (config: any) => {
  const url = [
    config.method,
    config.url,
    qs.stringify(config.params),
    qs.stringify(config.data)
  ].join('&');
  // 如果在 pending 中存在当前请求标识, 需要取消当前请求, 并且移除
  if (pending.has(url)) {
    const cancel = pending.get(url);
    cancel(url);
    pending.delete(url);
  }
};

/**
 * 清空 pending 中的请求（在路由跳转时调用）
 */
export const clearPending = () => {
  pending.forEach((cancel, url) => cancel(url));
  pending.clear();
};

axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8';
axios.defaults.headers['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';

const service = axios.create({
  // 联调
  baseURL: process.env.NODE_ENV === 'production' ? '/scvmap_service' : '/api',
  headers: {
    get: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    post: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  },
  // 是否跨站点访问控制请求
  withCredentials: true,
  // 请求超市时间 2 小时
  timeout: 2 * 60 * 60 * 1000,
  transformRequest: [(data) => JSON.stringify(data)],
  validateStatus() {
    // 使用 async-await, 处理 reject 情况较为繁琐, 所以全部返回 resolve, 在业务代码中处理异常
    return true;
  },
  transformResponse: [(data) => JSON.parse(data)]
});

// 请求拦截器
service.interceptors.request.use((config: any) => {
  // 在请求开始前, 对之前的请求做检查取消操作
  removePending(config);
  // 将当前请求添加到 pending 中
  addPending(config);
  return config;
}, (error) => {
  // 错误抛到业务代码
  error.data = {};
  error.data.msg = 'Server exception, please contact the administrator!';
  return Promise.resolve(error);
});

// 响应拦截器
service.interceptors.response.use((response: AxiosResponse) => {
  // 在请求结束后，移除本次请求
  removePending(response.config);
  {
    const { status } = response;
    if (status < 200 || status >= 300) {
      // 处理 http 错误, 抛到业务代码
      const message = showStatus(status);
      const result: ErrorResult = {
        code: status,
        message,
        status: false
      };
      ElNotification({ title: 'Request Error:', message, type: 'error' });
      return Promise.reject(result);
    }
  }
  {
    const {
      status,
      message,
      data
    } = response.data;
    if (status) {
      // Message.success(message);
      return response;
    }
    const result: ErrorResult = {
      code: response.status,
      message,
      status
    };
    result.data = data;
    ElNotification({ title: 'Request Error:', message, type: 'error' });
    return Promise.reject(result);
  }
}, (error) => {
  if (axios.isCancel(error)) {
    // eslint-disable-next-line no-console
    // console.log(`repeated request: ${error.message}`);
    return Promise.reject(error);
  }
  const result: ErrorResult = {
    code: 9999,
    message: 'Request timeout or server exception, please check the network or contact the administrator!',
    status: false
  };
  ElNotification({ title: 'Request Error:', message: result.message, type: 'error' });
  return Promise.reject(result);
});

export default service;
