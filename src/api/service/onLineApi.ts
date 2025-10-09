import { PageResult, Result } from '@/service/model/reponse/result';
import RequestApi from '@/api';
import NumberUtil from '@/service/util/base/number';

/**
 * onLineApi
 */
export default class OnLineApi {
  /**
   * on-line interface path prefix
   * @private
   */
  private static PATH_PREFIX = '/on_line';

  public static async execUserAnalysisFunction(scFileId: string, variantFileId: string, params: any): Promise<Result<string>> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/user/analysis/${scFileId}/${variantFileId}?id=${NumberUtil.random10()}`, params).then((res: any) => res.data);
  }

  public static async getJobStatusInfo(scFileId: string, variantFileId: string, params: any): Promise<Result<string>> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/user/job/status/${scFileId}/${variantFileId}?id=${NumberUtil.random10()}`, params).then((res: any) => res.data);
  }

  public static async listUserJob(params: any): Promise<Result<PageResult<Array<any>>>> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/user/job/list?id=${NumberUtil.random10()}`, params).then((res: any) => res.data);
  }

  public static async getUserJobInfo(jobId: string): Promise<Result> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/user/job/${jobId}?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }

  public static async getColumns(jobId: string): Promise<Result> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/job/result/column/${jobId}?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }

  public static async jobResultAnalysis(jobId: string): Promise<Result> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/job/result/analysis/${jobId}?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }

  public static async listClusterCoordinate(jobId: string, axis1: string, axis2: string, cellType: string): Promise<Result> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/cluster_coordinate/cluster/${jobId}/${axis1}/${axis2}/${cellType}?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }

  public static async listJobClusterCoordinate(jobId: string, method: string, axis1: string, axis2: string, cellType: string): Promise<Result> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/cluster_coordinate/cell_score/${jobId}/${method}/${axis1}/${axis2}/${cellType}?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }
}
