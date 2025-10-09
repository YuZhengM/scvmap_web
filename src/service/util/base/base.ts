import { ElNotification } from 'element-plus';

/**
 * Common class
 */
class Base {
  private static readonly RULE_TIMEOUT_MS: number = 500;

  /**
   * Verify whether the value is not empty
   * @param value
   * @returns {boolean} Not empty
   */
  public static noNull(value: object | string | null | undefined | Array<any> | number): boolean {
    return value !== null && typeof value !== 'undefined' && value !== undefined && value !== 'undefined' && value !== '';
  }

  /**
   * Verify whether the value is empty
   * @param value
   * @returns {boolean} Empty
   */
  public static isNull(value: object | string | null | undefined | Array<any> | number): boolean {
    return !this.noNull(value);
  }

  /**
   * Verify whether the value is an array
   * @param obj
   * @returns {boolean} Whether the value is an array
   */
  public static isArray(obj: any) {
    return Array.isArray ? Array.isArray(obj) : Object.prototype.toString.call(obj) === '[object Array]';
  }

  /**
   * Ensure that the value in the value is not empty
   * @param value
   * @param callback Callback function
   * @param errorCallback Callback function
   */
  public static valueNoNull(value: any, callback: Function, errorCallback: Function = () => null) {
    let judge = true;
    // Check if the value is an array
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
