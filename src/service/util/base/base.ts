/**
 * 通过身份正可以回去到的信息内容
 */
interface ContentByIdCard {
  age: number,
  sex: string,
  birthday: string
}

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
   * 通过身份证号获取 年龄 生日 性别 信息
   * @param value
   * @returns {{birthday: null, sex: null, age: null}}
   */
  public static getContentByIdCard(value: string): {} {
    // 得到年月日.
    const nowDate = new Date();
    // 获取当时年月日
    const date: { [key: string]: number; } = {
      year: nowDate.getFullYear(),
      month: nowDate.getMonth() + 1,
      date: nowDate.getDate()
    };
    // 定义返回值
    const content: ContentByIdCard = {
      age: 0,
      sex: '',
      birthday: ''
    };
    // 判断身份证
    if (value.length === 18) {
      // 得到用户的出生年份.
      const userYear = Number(value.substring(6, 10));
      // 设置用户的年龄.
      content.age = date.year - userYear;
      // 设置用户的性别.
      content.sex = Number(value.substring(16, 17)) % 2 === 1 ? '男' : '女';
      // 设置用户的出生日期.
      content.birthday = `${userYear}-${Number(value.substring(10, 12))}-${Number(value.substring(12, 14))}`;
    } else if (value.length === 15) {
      const userYear = Number(`19${value.substring(6, 8)}`);
      // 设置用户的年龄.
      content.age = date.year - userYear;
      // 设置用户的性别.
      content.sex = Number(value.substring(13, 14)) % 2 === 1 ? '男' : '女';
      // 设置用户的出生日期.
      content.birthday = `${userYear}-${Number(value.substring(8, 10))}-${Number(value.substring(10, 12))}`;
    }
    return content;
  }

  /**
   * Java 传过来的时间处理
   * @param value
   * @returns {string}
   */
  public static getTimeByJava(value: string): string {
    const time = new Date(value);
    const date = {
      year: time.getFullYear(),
      month: time.getMonth() + 1,
      date: time.getDate(),
      hour: time.getHours(),
      minutes: time.getMinutes(),
      seconds: time.getSeconds()
    };
    return `${date.year}年${date.month}月${date.date}日 ${date.hour}时${date.minutes}分${date.seconds}秒`;
  }

  /**
   * 判断是否为数组类型
   * @param obj
   */
  public static isArray(obj: any) {
    return Array.isArray ? Array.isArray(obj) : Object.prototype.toString.call(obj) === '[object Array]';
  }

  /**
   * 确保 ref 中的值不为空
   * <p>
   *   此步的目的是在 onMounted() 函数中防止切换到其他页面中还执行
   * </p>
   * @param refs
   * @param callback 回调函数
   */
  public static interceptParams(refs: any[] | any, callback: Function) {
    let judge = true;
    // 判断类型
    if (this.isArray(refs)) {
      // 循环确保每个都不为空
      const { length } = refs;
      for (let i = 0; i < length; i++) {
        judge = judge && refs[i];
      }
    } else {
      judge = refs;
    }
    // 不为空执行
    if (judge) {
      callback();
    }
  }

  /**
   * 确保 ref 中的值不为空
   * <p>
   *   此步的目的是在 onMounted() 函数中防止切换到其他页面中还执行
   * </p>
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
}

export default Base;
