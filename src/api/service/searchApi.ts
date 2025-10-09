import { PageResult, Result } from '@/service/model/reponse/result';
import RequestApi from '@/api';
import NumberUtil from '@/service/util/base/number';

/**
 * searchApi
 */
export default class SearchApi {
  /**
   * search interface path prefix
   * @private
   */
  private static PATH_PREFIX = '/search';

  public static async listSourceInfo(): Promise<Result<Array<any>>> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/source/list?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }

  public static async listCategory(): Promise<Result<Array<any>>> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/trait/category/list?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }

  public static async listSubcategoryByCategory(category: string): Promise<Result<Array<any>>> {
    const newCategory = category.replaceAll('/', '-----');
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/trait/subcategory/list/${newCategory}?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }

  public static async listTissueType(): Promise<Result<Array<any>>> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/sample/tissue_type/list?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }

  public static async listCellType(): Promise<Result<Array<any>>> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/sample/cell_type/list?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }

  public static async listTraitBySearchTrait(params: any): Promise<Result<PageResult<Array<any>>>> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/result/trait?id=${NumberUtil.random10()}`, params).then((res: any) => res.data);
  }

  public static async listSampleBySearchSample(params: any): Promise<Result<PageResult<Array<any>>>> {
    return RequestApi.requestPost(`${this.PATH_PREFIX}/result/sample?id=${NumberUtil.random10()}`, params).then((res: any) => res.data);
  }

  public static async listGene(): Promise<Result<Array<any>>> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/gene/list?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }

  public static async listTf(): Promise<Result<Array<any>>> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/tf/list?id=${NumberUtil.random10()}`).then((res: any) => res.data);
  }
}
