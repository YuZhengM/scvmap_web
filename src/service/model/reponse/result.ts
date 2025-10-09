import { AxiosPromise } from 'axios';

/**
 * The result information returned by the request
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
  // The total number of items
  total: number;
  // The current page number
  pageNum: number;
  // The number of items per page
  pageSize: number;
  // The number of items on the current page
  size: number;
  // The starting row number of the current page
  startRow: number;
  // The ending row number of the current page
  endRow: number;
  // The total number of pages
  pages: number;
  // The list of items on the current page
  data?: T;
}
