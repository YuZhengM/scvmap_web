import { Result } from '@/service/model/reponse/result';
import RequestApi from '@/api';
import type { UploadFile } from 'element-plus';

export default class FileApi {
  /**
   * file interface path prefix
   * @private
   */
  private static PATH_PREFIX = '/file';

  /**
   * file upload interface
   *
   * @param file file information
   */
  public static async uploadFile(file: UploadFile): Promise<Result<String>> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/upload`, { file })
      .then((res: any) => res.data);
  }

  /**
   * file delete interface
   *
   * @param gfsId gfsId
   */
  public static async deleteFile(gfsId: string): Promise<String> {
    return RequestApi.requestDelete(`${this.PATH_PREFIX}/`, { gfsId })
      .then((res: any) => res.data);
  }

  /**
   * file format interface
   *
   * @param content file content
   * @param filename file name
   */
  public static async formatFile(content: String, filename?: string): Promise<String> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/format`, { content, filename })
      .then((res: any) => res.data);
  }

  /**
   * file exist interface
   *
   * @param filepath filepath
   */
  public static async isExist(filepath: string): Promise<boolean> {
    return RequestApi.requestGet(`${this.PATH_PREFIX}/exist`, { filepath })
      .then((res: any) => res.data);
  }
}
