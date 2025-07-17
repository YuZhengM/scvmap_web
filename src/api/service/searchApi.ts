import { PageResult, Result } from '@/service/model/reponse/result';
import RequestApi from '@/api';

/**
 * searchApi
 */
export default class SearchApi {
  /**
   * search 接口路径前缀
   * @private
   */
  private static PATH_PREFIX = '/search';

  public static async listSourceInfo(): Promise<Result<Array<any>>> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/source/list`).then((res: any) => res.data);
  }

  public static async listCategory(): Promise<Result<Array<any>>> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/trait/category/list`).then((res: any) => res.data);
  }

  public static async listSubcategoryByCategory(category: string): Promise<Result<Array<any>>> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/trait/subcategory/list/${category}`).then((res: any) => res.data);
  }

  public static async listTissueType(): Promise<Result<Array<any>>> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/sample/tissue_type/list`).then((res: any) => res.data);
  }

  public static async listCellType(): Promise<Result<Array<any>>> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/sample/cell_type/list`).then((res: any) => res.data);
  }

  public static async listTraitBySearchTrait(params: any): Promise<Result<PageResult<Array<any>>>> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/result/trait`, params).then((res: any) => res.data);
  }

  public static async listSampleBySearchSample(params: any): Promise<Result<PageResult<Array<any>>>> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/result/sample`, params).then((res: any) => res.data);
  }

  public static async listGene(): Promise<Result<Array<any>>> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/gene/list`).then((res: any) => res.data);
  }

  public static async listTf(): Promise<Result<Array<any>>> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/tf/list`).then((res: any) => res.data);
  }
}
