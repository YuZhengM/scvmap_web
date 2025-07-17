/**
 * 公共类
 */
class StringUtil {
  /**
   * 替换指定字符
   * @param value
   * @param pattern 原字符
   * @param flags 替换的字符
   */
  public static replace(value: string, pattern: string, flags: string): string {
    const reg = new RegExp(pattern, flags);
    return value.replace(reg, '');
  }

  /**
   * 去除指定字符
   * @param value
   * @param pattern 去除的字符
   */
  public static remove(value: string, pattern: string): string {
    const reg = new RegExp(pattern, '');
    return value.replace(reg, '');
  }

  /**
   * 随机产生出指定长度的字符串
   * @param length
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
   * 将一个字符串以数组形式出现
   * @param elem
   */
  public static stringToOneList(elem: string | Array<String>) {
    if (typeof elem === 'string') {
      return Array(elem);
    }
    return elem;
  }
}

export default StringUtil;
