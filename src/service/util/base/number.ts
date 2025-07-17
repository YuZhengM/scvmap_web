/**
 * 公共类
 */
class NumberUtil {
  /**
   * 转换
   * @param value
   */
  public static toNumber(value: object): number {
    return Number(value);
  }

  /**
   * 生成随机数
   */
  public static random10(): number {
    return Math.round(Math.random() * 10E10);
  }
}

export default NumberUtil;
