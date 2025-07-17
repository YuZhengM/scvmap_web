/**
 * 关于 Boolean 的处理方法
 */
class BooleanUtil {
  /**
   * 判断多个 boolean 值
   * @param booleans
   * @return 全为 true 则返回 true
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
