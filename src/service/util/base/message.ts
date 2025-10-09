import { ElMessage } from 'element-plus';

/**
 * Message utility class
 * A common class for message prompts
 */
class Message {
  /**
   * Success message prompt
   * @param content
   */
  public static success(content: string) {
    return ElMessage.success(content);
  }

  /**
   * Warning message prompt
   * @param content
   */
  public static warning(content: string) {
    return ElMessage.warning(content);
  }

  /**
   * Info message prompt
   * @param content
   */
  public static info(content: string) {
    return ElMessage.info(content);
  }

  /**
   * Error message prompt
   * @param content
   */
  public static error(content: string) {
    return ElMessage.error(content);
  }
}

export default Message;
