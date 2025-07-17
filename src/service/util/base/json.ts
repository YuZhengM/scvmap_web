/**
 * 关于 JSON 的处理方法
 */
class Json {
  /**
   * 添加元素
   * @param json
   * @param key
   * @param value
   */
  public static addItem(json: {}, key: any, value: any): void {
    Object.assign(json, {
      [key]: value
    });
  }

  /**
   * 深拷贝: json 赋值给 newJson
   * @param json
   */
  public static deepCopy(json: {}): {} {
    const newJson = {};
    Object.assign(newJson, json);
    return newJson;
  }

  /**
   * 添加元素
   * @param json
   * @param items
   */
  public static addItems(json: {}, items: {}): void {
    Object.assign(json, items);
  }

  /**
   * 更新元素
   * @param json
   * @param items
   */
  public static updateItems(json: {}, items: {}): void {
    Object.assign(json, items);
  }

  /**
   * 遍历元素
   * @param callback
   * @param json
   */
  public static foreach(json: {}, callback: (key: any) => void): void {
    Object.keys(json)
      .forEach((key: any) => {
        callback(key);
      });
  }

  /**
   * 获取 key
   * @param json
   */
  public static getKeys(json: {}): string[] {
    // 获得对象属性名组成的数组
    return Object.keys(json);
  }

  /**
   * 获取 value
   * @param json
   * @param key
   */
  static getValueByKey(json: {}, key: string): any {
    return json[key as keyof typeof json];
  }
}

export default Json;
