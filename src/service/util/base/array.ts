/**
 * Array utility class
 */
export default class ArrayUtil {
  /**
   * Sort the array by the value of the specified property
   * @param array The array to be sorted
   * @param key The property to be sorted by
   * @param direction The sort direction, 1 for ascending order, 0 for default order, -1 for descending order
   */
  public static sort(array: { [key: string]: any; }, key: any, direction: number) {
    // Equal to 0 means using the default sorting method
    if (direction === 0) {
      return array;
    }
    // Return the sorted array
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
   * Deep copy: assign the value of json to newJson
   * @param array The array to be deep copied
   */
  public static deepCopy(array: { [key: string]: any; }): { [key: string]: any; } {
    const newArray: { [key: string]: any; } = [];
    array.forEach((item: any) => {
      newArray.push(item);
    });
    return newArray;
  }

  /**
   * Clear the array
   * @param array The array to be cleared
   */
  public static clear(array: { [key: string]: any; }): void {
    if (array.length > 0) {
      array.splice(0, array.length);
    }
  }
}
