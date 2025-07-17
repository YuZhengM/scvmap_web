import { AxiosPromise } from 'axios';

/**
 * 返回的结果信息
 */
export interface Result<T = any> extends AxiosPromise<T> {
  code: number;
  status: boolean;
  message: string;
  data?: T;
}

export interface ErrorResult {
  code: number;
  status: boolean;
  message: string;
  data?: any;
}

export interface PageResult<T = any> extends AxiosPromise<T> {
  total: number;
  pageNum: number;
  pageSize: number;
  size: number;
  startRow: number;
  endRow: number;
  pages: number;
  data?: T;
}
