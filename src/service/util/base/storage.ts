/**
 * Storage utility class
 * A common class for storing and retrieving information
 * <pre>
 *   localStorage.setItem(key, value);
 * </pre>
 * Get the value of the item with the specified key from localStorage
 * <pre>
 *   localStorage.getItem(key);
 * </pre>
 * Remove the item with the specified key from localStorage
 * <pre>
 *   localStorage.removeItem(key);
 * </pre>
 * Clear all items from localStorage
 * <pre>
 *   localStorage.clear();
 * </pre>
 * Store the value of the item with the specified key in sessionStorage
 * <pre>
 *   sessionStorage.setItem(key, value);
 * </pre>
 * Get the value of the item with the specified key from sessionStorage
 * <pre>
 *   sessionStorage.getItem(key);
 * </pre>
 * Remove the item with the specified key from sessionStorage
 * <pre>
 *   sessionStorage.removeItem(key);
 * </pre>
 * Clear all items from sessionStorage
 * <pre>
 *   sessionStorage.clear();
 * </pre>
 */
import Json from '@/service/util/base/json';
import Base from '@/service/util/base/base';

class Storage {
  /**
   * Store the value of the item with the specified key in localStorage
   * @param key
   * @param value
   */
  public static save(key: string, value: any): void {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  }

  /**
   * Batch store multiple items in localStorage
   * @param array
   */
  public static saves(array: { [key: string]: any; }): void {
    Json.foreach(array, (key) => {
      this.save(key, array[key]);
    });
  }

  /**
   * Get the value of the item with the specified key from localStorage
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
   * Get the value of the item with the specified key from sessionStorage
   * @param key
   */
  public static getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  /**
   * Batch get multiple items from localStorage
   * @param array
   */
  public static array(array: string | Array<string>): any | Array<any> {
    // Check the type of array
    if (typeof array === 'string') {
      return this.get(array);
    }
    // If it is not a string type, loop through each key in the array to get the value
    const container: Array<{} | undefined> = [];
    array.forEach((key: string) => {
      container.push(this.get(key));
    });
    return container;
  }

  /**
   * Remove the item with the specified key from localStorage
   * @param key
   */
  public static remove(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Batch remove multiple items from localStorage
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
   * Clear all items from localStorage
   */
  public static clear(): void {
    localStorage.clear();
  }

  /**
   * Unified storage management with vuex
   * @param value Data value
   * @param requestApi Function to request API
   * @param callback Callback function
   * @param storageValue Storage key value
   */
  public static async handlerStore(value: any, requestApi: Function, callback: Function, storageValue: string): Promise<void> {
    if (Base.isNull(value)) {
      // Get the stored data from localStorage
      const storageData = Storage.get<any>(storageValue);
      if (storageData && Base.noNull(storageData)) {
        callback();
      } else {
        await requestApi().then((res: any) => {
          // Store data
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
