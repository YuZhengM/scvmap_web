/**
 * Number utility class
 */
class NumberUtil {
  /**
   * Convert the value to a number
   * @param value
   */
  public static toNumber(value: object): number {
    return Number(value);
  }

  /**
   * Generate a random number between 0 and 10E10
   */
  public static random10(): number {
    return Math.round(Math.random() * 10E10);
  }
}

export default NumberUtil;
