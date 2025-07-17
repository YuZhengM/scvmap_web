import { ElMessage } from 'element-plus';

/**
 * 消息提示公共类
 */
class Message {
  /**
   * 成功提示
   * @param content
   */
  public static success(content: string) {
    return ElMessage.success(content);
  }

  /**
   * 警告提示
   * @param content
   */
  public static warning(content: string) {
    return ElMessage.warning(content);
  }

  /**
   * 正常消息提示
   * @param content
   */
  public static info(content: string) {
    return ElMessage.info(content);
  }

  /**
   * 错误消息提示
   * @param content
   */
  public static error(content: string) {
    return ElMessage.error(content);
  }
}

export default Message;
