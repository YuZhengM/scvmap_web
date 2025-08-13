import { ElNotification } from 'element-plus';

/**
 * 公共类
 */
class Base {
  private static readonly RULE_TIMEOUT_MS: number = 500;

  /**
   * 验证 value 是否为空
   * @param value
   * @returns {boolean} 不为空
   */
  public static noNull(value: object | string | null | undefined | Array<any> | number): boolean {
    return value !== null && typeof value !== 'undefined' && value !== undefined && value !== 'undefined' && value !== '' && value !== {};
  }

  /**
   * 验证 value 是否为空
   * @param value
   * @returns {boolean} 为空
   */
  public static isNull(value: object | string | null | undefined | Array<any> | number): boolean {
    return !this.noNull(value);
  }

  /**
   * 判断是否为数组类型
   * @param obj
   */
  public static isArray(obj: any) {
    return Array.isArray ? Array.isArray(obj) : Object.prototype.toString.call(obj) === '[object Array]';
  }

  /**
   * 确保 value 中的值不为空
   * @param value
   * @param callback 回调函数
   * @param errorCallback 回调函数
   */
  public static valueNoNull(value: any, callback: Function, errorCallback: Function = () => null) {
    let judge = true;
    // 判断类型
    if (this.isNull(value)) {
      judge = false;
    }
    return judge ? callback() : errorCallback();
  }

  public static checkParam(value: any) {
    const valueIsStr = value && typeof value === 'string';
    if (valueIsStr && value.includes('?')) {
      ElNotification({
        title: 'Please check',
        message: 'The input value is incorrect. Please re-enter it without invalid characters such as "?".',
        type: 'error'
      });
      return false;
    }
    return valueIsStr;
  }
}

export default Base;
