import Json from '@/service/util/base/json';
import Base from '@/service/util/base/base';

interface DateElement {
  year: number,
  month: number,
  day: number
}

/**
 * Time utility class
 * A common class for time operations
 */
class Time {
  /**
   * Get the current timestamp
   */
  public static timeStamp = () => (new Date()).getTime();

  /**
   * Return a JSON object with a timestamp
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
   * Get the date element from a date string or Date object
   * 2021-3-16 08:06:34
   * @param date
   */
  public static getDateElement(date?: string | Date): DateElement {
    const nowDate = new Date();
    const newDate = typeof date === 'string' ? new Date(date) : Base.noNull(date) ? date : nowDate;
    // This step can be removed. It's unnecessary and only used to avoid warnings.
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

  public static getDate(date: string) {
    const newDate = new Date(date);
    return `${newDate.getFullYear()}/${newDate.getMonth() + 1}/${newDate.getDate()} ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`;
  }

  /**
   * Debounce function execution
   * @param callback Callback function
   * @param delay Delay time in milliseconds (default: 500ms)
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
   * Wait for a specified delay before executing a function
   * @param callback Callback function
   * @param delay Delay time in milliseconds (default: 1000ms)
   */
  public static delay(callback: Function, delay = 1000): void {
    setTimeout(() => {
      callback();
    }, delay);
  }

  /**
   * Wait for a specified delay before resolving a Promise
   * @param delay Delay time in milliseconds (default: 1000ms)
   */
  public static sleep(delay = 1000): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  /**
   * Wait for a specified delay before iterating over data
   * @param callback Callback function
   * @param data Data to iterate over
   * @param delay Delay time in milliseconds (default: 1000ms)
   * @param totalTime Total wait time in milliseconds (default: 10000ms)
   * @param judge Judgment function to check if the data is valid (default: always true)
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
   * Wait for a specified delay before iterating over data until a condition is met
   * @param data Data to iterate over
   * @param delay Delay time in milliseconds (default: 1000ms)
   * @param totalTime Total wait time in milliseconds (default: 10000ms)
   * @param judge Judgment function to check if the data is valid (default: always true)
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
