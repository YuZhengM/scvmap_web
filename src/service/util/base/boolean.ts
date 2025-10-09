/**
 * Boolean utility class
 */
class BooleanUtil {
  /**
   * Judge multiple boolean values
   * @param booleans
   * @return If all are true, return true
   */
  public static judgeMore(...booleans: boolean[]): boolean {
    let judge = true;
    const { length } = booleans;
    for (let i = 0; i < length; i++) {
      judge = judge && booleans[i];
      if (!judge) {
        break;
      }
    }
    return judge;
  }
}

export default BooleanUtil;
