/**
 * 消息数字公共类
 */
export default class ArrayUtil {
  /**
   * 根据数组中某个属性值进行排序
   * @param array 数组
   * @param key 属性
   * @param direction 排序方向 1: 升序, 0: 默认, -1 降序
   */
  public static sort(array: { [key: string]: any; }, key: any, direction: number) {
    // 等于 0 为默认排序方法
    if (direction === 0) {
      return array;
    }
    // 返回排序信息
    return array.sort((a: any, b: any) => {
      const x = a[key];
      const y = b[key];
      if (x > y) {
        return direction;
      }
      if (x < y) {
        return direction * -1;
      }
      return 0;
    });
  }

  /**
   * 深拷贝: json 赋值给 newJson
   * @param array
   */
  public static deepCopy(array: { [key: string]: any; }): { [key: string]: any; } {
    const newArray: { [key: string]: any; } = [];
    array.forEach((item: any) => {
      newArray.push(item);
    });
    return newArray;
  }

  /**
   * 清空数据
   * @param array
   */
  public static clear(array: { [key: string]: any; }): void {
    if (array.length > 0) {
      array.splice(0, array.length);
    }
  }
}
