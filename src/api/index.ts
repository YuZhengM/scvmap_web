import Axios from '@/plugins/axios';
import Method from '@/service/model/reponse/request';
import { Result } from '@/service/model/reponse/result';

export default class RequestApi {
  /**
   * request url options
   * @param url request url
   * @param params request params
   */
  public static requestOptions<T>(url: string, params: object = {}) {
    return new Promise<Result<T>>((resolve, reject) => {
      Axios({
        url,
        method: 'OPTIONS',
        headers: {
          'Access-Control-Allow-Methods': 'OPTIONS'
        },
        data: params
      })
        .then((res: any) => resolve(res.data as Result<T>))
        .catch((err: any) => reject(err));
    });
  }

  /**
   * request url options
   * @param url request url
   * @param method request method
   * @param params request params
   */
  public static request<T>(url: string, method: Method, params: object) {
    return new Promise<Result<T>>((resolve, reject) => {
      Axios({
        url,
        method,
        headers: {
          'Access-Control-Allow-Methods': `${method}, OPTIONS`
        },
        data: params
      })
        .then((res: any) => resolve(res.data as Result<T>))
        .catch((err: any) => reject(err));
    });
  }

  /**
   * request url options
   * @param url request url
   * @param params request params
   */
  public static requestGet<T>(url: string, params: object) {
    return new Promise<Result<T>>((resolve, reject) => {
      Axios({
        url,
        method: Method.GET,
        headers: {
          'Access-Control-Allow-Methods': `${Method.GET}, OPTIONS`
        },
        params
      })
        .then((res: any) => resolve(res.data as Result<T>))
        .catch((err: any) => reject(err));
    });
  }

  /**
   * request url options
   * @param url request url
   */
  public static requestGetNoParams<T>(url: string) {
    return this.requestGet<T>(url, {});
  }

  /**
   * request url options
   * @param url request url
   * @param params request params
   */
  public static requestPost<T>(url: string, params: object) {
    return this.request<T>(url, Method.POST, params);
  }

  /**
   * request url options
   * @param url request url
   * @param params request params
   */
  public static requestPut<T>(url: string, params: object) {
    return this.request<T>(url, Method.PUT, params);
  }

  /**
   * request url options
   * @param url request url
   * @param params request params
   */
  public static requestDelete<T>(url: string, params: object) {
    return new Promise<Result<T>>((resolve, reject) => {
      Axios({
        url,
        method: Method.DELETE,
        headers: {
          'Access-Control-Allow-Methods': `${Method.DELETE}, OPTIONS`
        },
        params
      })
        .then((res: any) => resolve(res.data as Result<T>))
        .catch((err: any) => reject(err));
    });
  }
}
