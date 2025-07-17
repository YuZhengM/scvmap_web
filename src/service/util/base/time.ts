import Json from '@/service/util/base/json';
import Base from '@/service/util/base/base';

interface DateElement {
  year: number,
  month: number,
  day: number
}

/**
 * 关于时间的公共方法
 */
class Time {
  /**
   * 获取当前的时间戳
   */
  public static timeStamp = () => (new Date()).getTime();

  /**
   * 返回带有时间的 JSON
   * @param query
   */
  public static timeQuery(query?: {} | null): {} {
    const json: {} = { id: Time.timeStamp() };
    if (query != null) {
      Json.addItems(json, query);
    }
    return json;
  }

  /**
   * 获取日期
   * 2021-3-16 08:06:34
   * @param date
   */
  public static getDate(date?: string | Date): DateElement {
    const nowDate = new Date();
    const newDate = typeof date === 'string' ? new Date(date) : Base.noNull(date) ? date : nowDate;
    // 这步骤可以去掉, 没有必要, 只是为了没有警告
    if (newDate === undefined) {
      return {
        year: nowDate.getFullYear(),
        month: nowDate.getMonth() + 1,
        day: nowDate.getDate()
      };
    }
    return {
      year: newDate.getFullYear(),
      month: newDate.getMonth() + 1,
      day: newDate.getDate()
    };
  }

  /**
   * 延迟监听数据
   * @param callback 回调函数
   * @param delay 延迟的时间默认为 ms 单位
   */
  public static debounce(callback: Function, delay = 500) {
    let timer: any;
    return (...args: any[]) => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        callback.apply(this, args);
      }, delay);
    };
  }

  /**
   * 等待执行
   * @param callback 回调函数
   * @param delay 延迟的时间默认为 ms 单位
   */
  public static delay(callback: Function, delay = 1000): void {
    setTimeout(() => {
      callback();
    }, delay);
  }

  /**
   * 等待执行
   * @param delay 延迟的时间默认为 ms 单位
   */
  public static sleep(delay = 1000): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  /**
   * 延迟迭代获取数据
   * @param callback 回调函数
   * @param data 判断的数据
   * @param delay 延迟的时间默认为 ms 单位
   * @param totalTime 等待总时间 ms 单位
   * @param judge 判断的条件结果
   */
  public static awaitData(callback: Function, data: any, delay = 1000, totalTime = 10000, judge: Function = () => true): any {
    let computingTime = 0;
    const timer = setInterval(() => {
      if (data || judge()) {
        if (timer) {
          clearInterval(timer);
        }
        return callback();
      }
      computingTime += delay;
      // eslint-disable-next-line no-console
      console.log(`await ${computingTime} ms delay`);
      // 判断是否超时
      if (computingTime > totalTime) {
        // eslint-disable-next-line no-console
        console.log(`await ${computingTime} ms too long... error: Please contact the administrator.`);
        clearInterval(timer);
      }
    }, delay);
  }

  /**
   * 延迟迭代获取数据
   * @param data 判断的数据
   * @param delay 延迟的时间默认为 ms 单位
   * @param totalTime 等待总时间 ms 单位
   * @param judge 判断的条件结果
   */
  public static awaitPromise(data: any, delay = 1000, totalTime = 10000, judge: Function = () => true): Promise<void> {
    return new Promise((resolve) => {
      let computingTime = 0;
      const timer = setInterval(() => {
        if (data && judge()) {
          resolve();
          if (timer) {
            clearInterval(timer);
          }
        }
        computingTime += delay;
        // eslint-disable-next-line no-console
        console.log(`await ${computingTime} ms delay`);
        // 判断是否超时
        if (computingTime > totalTime) {
          // eslint-disable-next-line no-console
          console.log(`await ${computingTime} ms too long... error: Please contact the administrator.`);
          clearInterval(timer);
        }
      }, delay);
    });
  }
}

export default Time;
