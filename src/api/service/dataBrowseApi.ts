import RequestApi from '@/api';
import { Result } from '@/service/model/reponse/result';

export default class DataBrowseApi {
  /**
   * data browse 接口路径前缀
   * @private
   */
  private static PATH_PREFIX = '/data_browse';

  /**
   * dataBrowse table 数据
   */
  public static async getTraitBrowseData(param: any = {}): Promise<Result<Array<any>>> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/trait`, param).then((res: any) => res.data);
  }

  /**
   * dataBrowse table 数据
   */
  public static async getSampleBrowseData(param: any = {}): Promise<Result<Array<any>>> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/sample`, param).then((res: any) => res.data);
  }

  public static async getSampleCellTypeBrowseData(param: any = {}): Promise<Result> {
    return RequestApi.requestPost(`${DataBrowseApi.PATH_PREFIX}/sample_cell_type`, param).then((res: any) => res.data);
  }
}
