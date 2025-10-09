/**
 * JSON utility class
 */
class Json {
  /**
   * Add an element
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
   * Deep copy: assign json to newJson
   * @param json
   */
  public static deepCopy(json: {}): {} {
    const newJson = {};
    Object.assign(newJson, json);
    return newJson;
  }

  /**
   * Add multiple elements
   * @param json
   * @param items
   */
  public static addItems(json: {}, items: {}): void {
    Object.assign(json, items);
  }

  /**
   * Update multiple elements
   * @param json
   * @param items
   */
  public static updateItems(json: {}, items: {}): void {
    Object.assign(json, items);
  }

  /**
   * Traverse elements
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
   * Get keys
   * @param json
   */
  public static getKeys(json: {}): string[] {
    // 获得对象属性名组成的数组
    return Object.keys(json);
  }

  /**
   * Get value by key
   * @param json
   * @param key
   */
  static getValueByKey(json: {}, key: string): any {
    return json[key as keyof typeof json];
  }
}

export default Json;
