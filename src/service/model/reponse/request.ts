// 请求的所有方法
enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS'
}

export default Method;

export interface Page {
  page: number;
  size: number;
  field: string;
  order: number;
  type?: number;
  searchField?: string;
  content?: string;
}
