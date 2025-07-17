import { Result } from '@/service/model/reponse/result';
import RequestApi from '@/api';
import type { UploadFile } from 'element-plus';

export default class FileApi {
  /**
   * 文件处理接口路径前缀
   * @private
   */
  private static PATH_PREFIX = '/file';

  /**
   * 文件上传接口
   *
   * @param file 文件信息
   */
  public static async uploadFile(file: UploadFile): Promise<Result<String>> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/upload`, { file })
      .then((res: any) => res.data);
  }

  /**
   * 文件删除接口
   *
   * @param gfsId gfsId
   */
  public static async deleteFile(gfsId: string): Promise<String> {
    return RequestApi.requestDelete(`${this.PATH_PREFIX}/`, { gfsId })
      .then((res: any) => res.data);
  }

  /**
   * 通过文件内容形成文件接口
   *
   * @param content 文件内容
   * @param filename
   */
  public static async formatFile(content: String, filename?: string): Promise<String> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/format`, { content, filename })
      .then((res: any) => res.data);
  }

  public static async isExist(filepath: string): Promise<boolean> {
    return RequestApi.requestGet(`${this.PATH_PREFIX}/exist`, { filepath })
      .then((res: any) => res.data);
  }
}
