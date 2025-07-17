/**
 * 存储的公共类 <br/>
 * 以 key 为名称存储一个值 value
 * <pre>
 *   localStorage.setItem(key, value);
 * </pre>
 * 获取名称为 key 的值
 * <pre>
 *   localStorage.getItem(key);
 * </pre>
 * 删除名称为 key 的信息
 * <pre>
 *   localStorage.removeItem(key);
 * </pre>
 * 清空 localStorage 中所有信息
 * <pre>
 *   localStorage.clear();
 * </pre>
 * 以 key 为名称存储一个值 value
 * <pre>
 *   sessionStorage.setItem(key, value);
 * </pre>
 * 获取名称为 key 的值
 * <pre>
 *   sessionStorage.getItem(key);
 * </pre>
 * 删除名称为 key 的信息
 * <pre>
 *   sessionStorage.removeItem(key);
 * </pre>
 * 清空 sessionStorage 中所有信息
 * <pre>
 *   sessionStorage.clear();
 * </pre>
 */
import Json from '@/service/util/base/json';
import Base from '@/service/util/base/base';

class Storage {
  /**
   * 存储信息
   * @param key
   * @param value
   */
  public static save(key: string, value: any): void {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  }

  /**
   * 批量存储信息
   * @param array
   */
  public static saves(array: { [key: string]: any; }): void {
    Json.foreach(array, (key) => {
      this.save(key, array[key]);
    });
  }

  /**
   * 获取信息
   * @param key
   */
  public static get<T>(key: string): string | T | undefined {
    const item = localStorage.getItem(key);
    if (typeof item === 'string') {
      return item;
    }
    if (item && Base.noNull(item)) {
      return JSON.parse(item);
    }
    return undefined;
  }

  /**
   * 获取信息
   * @param key
   */
  public static getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  /**
   * 批量获取信息
   * @param array
   */
  public static array(array: string | Array<string>): any | Array<any> {
    // 判断类型
    if (typeof array === 'string') {
      return this.get(array);
    }
    // 不是字符串类型进行循环获取
    const container: Array<{} | undefined> = [];
    array.forEach((key: string) => {
      container.push(this.get(key));
    });
    return container;
  }

  /**
   * 移除信息
   * @param key
   */
  public static remove(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * 批量移除信息
   * @param array
   */
  public static removes(array: string | Array<string>): void {
    if (typeof array === 'string') {
      this.remove(array);
    } else {
      array.forEach((key: string) => {
        this.remove(key);
      });
    }
  }

  /**
   * 清空信息
   */
  public static clear(): void {
    localStorage.clear();
  }

  /**
   * vuex 进行统一存储管理
   * @param value 数据值
   * @param requestApi 请求 API 的函数
   * @param callback 回调函数
   * @param storageValue 存储 key 值
   */
  public static async handlerStore(value: any, requestApi: Function, callback: Function, storageValue: string): Promise<void> {
    if (Base.isNull(value)) {
      // 得到存储信息, 浏览器没有存储查询数据库
      const storageData = Storage.get<any>(storageValue);
      if (storageData && Base.noNull(storageData)) {
        callback();
      } else {
        await requestApi().then((res: any) => {
          // 存储数据信息
          Storage.save(storageValue, res);
          callback();
        });
      }
    } else {
      callback();
    }
  }
}

export default Storage;
