/**
 * String utility class
 * A common class for string operations
 */
class StringUtil {
  /**
   * Replace specified characters in a string
   * @param value
   * @param pattern Original character
   * @param flags Replacement character
   */
  public static replace(value: string, pattern: string, flags: string): string {
    const reg = new RegExp(pattern, flags);
    return value.replace(reg, '');
  }

  /**
   * Remove specified characters from a string
   * @param value
   * @param pattern Character to remove
   */
  public static remove(value: string, pattern: string): string {
    const reg = new RegExp(pattern, '');
    return value.replace(reg, '');
  }

  /**
   * Generate a random string of specified length
   * @param length Length of the random string
   */
  public static randomString(length: number) {
    const str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = length; i > 0; --i) {
      result += str[Math.floor(Math.random() * str.length)];
    }
    return result;
  }

  /**
   * Convert a string to an array of characters
   * @param elem String or array of characters
   */
  public static stringToOneList(elem: string | Array<String>) {
    if (typeof elem === 'string') {
      return Array(elem);
    }
    return elem;
  }
}

export default StringUtil;
