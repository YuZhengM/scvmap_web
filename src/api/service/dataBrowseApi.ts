import RequestApi from '@/api';
import { Result } from '@/service/model/reponse/result';
import NumberUtil from '@/service/util/base/number';

export default class DataBrowseApi {
  /**
   * data browse interface path prefix
   * @private
   */
  private static PATH_PREFIX = '/data_browse';

  /**
   * dataBrowse table data
   */
  public static async getTraitBrowseData(param: any = {}): Promise<Result<Array<any>>> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/trait?id=${NumberUtil.random10()}`, param).then((res: any) => res.data);
  }

  /**
   * dataBrowse sample data
   */
  public static async getSampleBrowseData(param: any = {}): Promise<Result<Array<any>>> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/sample?id=${NumberUtil.random10()}`, param).then((res: any) => res.data);
  }

  public static async getSampleCellTypeBrowseData(param: any = {}): Promise<Result> {
    return RequestApi.requestPost(`${DataBrowseApi.PATH_PREFIX}/sample_cell_type?id=${NumberUtil.random10()}`, param).then((res: any) => res.data);
  }
}
