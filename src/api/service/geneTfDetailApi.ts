import RequestApi from '@/api';
import { Result } from '@/service/model/reponse/result';

export default class GeneTfDetailApi {
  /**
   * detail 接口路径前缀
   * @private
   */
  private static PATH_PREFIX = 'element/detail';

  /**
   * Sample Overview 数据
   */
  public static async getGeneInfo(gene: string, genome: string): Promise<Result<Array<any>>> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/gene/${gene}/${genome}`).then((res: any) => res.data);
  }

  public static async getGeneById(geneId: string, genome: string): Promise<Result> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/gene/id/${geneId}/${genome}`).then((res: any) => res.data);
  }

  public static async getTfInfo(tf: string): Promise<Result<Array<any>>> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/tf/${tf}`).then((res: any) => res.data);
  }

  public static async listGeneInteractiveCommonSnp(geneId: string, genome: string): Promise<Result<Array<any>>> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/gene/annotation/common_snp/${geneId}/${genome}`).then((res: any) => res.data);
  }

  public static async listGeneInteractiveRiskSnp(geneId: string, genome: string): Promise<Result<Array<any>>> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/gene/annotation/risk_snp/${geneId}/${genome}`).then((res: any) => res.data);
  }

  public static async listGeneInteractiveEqtl(geneId: string, genome: string): Promise<Result<Array<any>>> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/gene/annotation/eqtl/${geneId}/${genome}`).then((res: any) => res.data);
  }

  public static async listGeneInteractiveEnhancerSea(geneId: string, genome: string): Promise<Result<Array<any>>> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/gene/annotation/enhancer_sea/${geneId}/${genome}`).then((res: any) => res.data);
  }

  public static async listGeneInteractiveEnhancerSedb(geneId: string, genome: string): Promise<Result<Array<any>>> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/gene/annotation/enhancer_se_db/${geneId}/${genome}`).then((res: any) => res.data);
  }

  public static async listGeneInteractiveSuperEnhancerDbsuper(geneId: string, genome: string): Promise<Result<Array<any>>> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/gene/annotation/super_enhancer_dbsuper/${geneId}/${genome}`).then((res: any) => res.data);
  }

  public static async listGeneInteractiveSuperEnhancerSea(geneId: string, genome: string): Promise<Result<Array<any>>> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/gene/annotation/super_enhancer_sea/${geneId}/${genome}`).then((res: any) => res.data);
  }

  public static async listGeneInteractiveSuperEnhancerSedb(geneId: string, genome: string): Promise<Result<Array<any>>> {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/gene/annotation/super_enhancer_se_db/${geneId}/${genome}`).then((res: any) => res.data);
  }

  public static async getGeneTraitCount(gene: string) {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/gene/trait/count/${gene}`).then((res: any) => res.data);
  }

  public static async getTfTraitCount(gene: string) {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/tf/trait/count/${gene}`).then((res: any) => res.data);
  }

  public static async listTraitByGeneGenome(gene: string, genome: string) {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/gene/trait/${gene}/${genome}`).then((res: any) => res.data);
  }

  public static async listTraitByTfGenome(gene: string, genome: string) {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/tf/trait/${gene}/${genome}`).then((res: any) => res.data);
  }

  public static async listMagmaInfoDataByTraitIdAndGene(traitId: string, gene: string, genome: string) {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/gene/trait/${traitId}/${gene}/${genome}`).then((res: any) => res.data);
  }

  public static async listHomerInfoDataByTraitIdAndTf(traitId: string, tf: string, genome: string) {
    return RequestApi.requestGetNoParams(`${this.PATH_PREFIX}/tf/trait/${traitId}/${tf}/${genome}`).then((res: any) => res.data);
  }
}
