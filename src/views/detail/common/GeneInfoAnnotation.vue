<template>
  <BaseLoading id="gene_info_annotation" ref="loading">
    <SingleCard :title="{ content: `Differential genes of cell types` }" id="position_difference_gene" ref="singleCard">
      <template #head>
        <el-link :href="differenceGeneH5adDownload()">
          <el-button size="small" type="primary"> Differential genes (Complete) &nbsp; <i class="fas fa-file-download"></i></el-button>
        </el-link>
      </template>
      <template #default>
        <LeftRight :is-left-right="isLeftRight" :left-width="50" :padding="0">
          <template #left>
            <BaseTabs active="heatmap" :tabs-data="[{ name: 'heatmap', title: 'Visualization' }, { name: 'table', title: 'Display' }]">
              <template #heatmap>
                <DifferenceHeatMap :sample-id="sampleId" element="gene" top-description="Limit the number of genes.
                 For single-cell data differential gene analysis, select the top number based on the `abs(Score)` from the table above."/>
              </template>
              <template #table>
                <BaseSelect title="Cell type:" is-line width="40%" :change-event="cellTypeChange" :select-data="cellTypeData" ref="cellType"/>
                <BaseTable :update-new-data="listDifferenceGeneInformation"
                           :is-mounted="differenceGeneIsMounted"
                           :callback-function="differenceGeneCallback"
                           search-title=""
                           :width="98"
                           :content-width="26"
                           :field-width="26"
                           :service-search-width="90"
                           :button-size="[60, 30]"
                           :removeSelectContent="['Sample ID']"
                           layout="total, prev, pager, next"
                           :download-url="differenceGeneDownload()"
                           :table-description="differenceGeneTableDescription"
                           ref="differenceGeneTable"/>
              </template>
            </BaseTabs>
          </template>
          <template #right>
            <GeneEnrichment :sample-id="sampleId"/>
          </template>
        </LeftRight>
      </template>
    </SingleCard>
    <BaseBr/>
    <SingleCard :title="{ content: `${traitLabel}-relevant genes` }" id="position_magma_gene" ref="singleCard">
      <template #head>
        <BaseSelect class="trait_gene_strategy" title="Strategy:" is-line width="50%" :select-data="traitGeneMethodData" :change-event="traitGeneStrategyChange" ref="traitGeneStrategy"/>
        <el-button @click="traitGeneStrategyOverlapShow()"> View overlap</el-button>
      </template>
      <template #default>
        <LeftRight :is-left-right="isLeftRight" v-show="!isTraitGeneCicero">
          <template #left>
            <BaseSelect title="Genome:" is-line width="20%" :select-data="genomeData" ref="genome" v-show="false"/>
            <BaseTable :table-data="traitGeneTableData"
                       :is-service-paging="false"
                       layout="total, prev, pager, next"
                       :download-url="magmaGeneDownloadUrl"
                       :before-column-number="0"
                       :table-description="traitGeneTableDescription"
                       ref="traitGeneTable">
              <template #default>
                <el-table-column label="Description" stripe align="center">
                  <template #default="scope">
                    <el-button @click="variantInfoShow(scope.row)"> View</el-button>
                  </template>
                </el-table-column>
              </template>
            </BaseTable>
          </template>
          <template #right>
            <TraitGeneEnrichment :trait-id="traitId" :genome="sample.genome"/>
          </template>
        </LeftRight>
        <div v-show="isTraitGeneCicero">
          <BaseTable :table-data="traitGeneCiceroTableData"
                     :is-service-paging="false"
                     :download-url="ciceroGeneDownloadUrl"
                     :table-description="traitGeneCiceroTableDescription"
                     ref="traitGeneCiceroTable"/>
        </div>
      </template>
    </SingleCard>
    <BaseBr/>
    <SingleCard :title='{ content: `Gene regulatory network associated with ${traitLabel} and ${sampleLabel}` }' id="position_gene_network" ref="singleCard">
      <template #head>
        <BaseSelect class="network_trait_gene_strategy"
                    title="Strategy:"
                    is-line
                    width="50%"
                    :select-data="traitGeneMethodAllData"
                    :change-event="networkTraitGeneStrategyChange"
                    ref="networkTraitGeneStrategy"/>
      </template>
      <template #default>
        <LeftRight :is-left-right="isLeftRight">
          <template #left>
            <BaseSelect title="Cell type:" is-line width="40%" :change-event="cellTypeGraphChange" :select-data="cellTypeData" ref="cellTypeGraph"/>
            <BaseBr/>
          </template>
          <template #right>
            <LeftRight>
              <template #left>
                <BaseSelect title="Top count:" is-line width="50%" :change-event="topCountGraphChange" :select-data="topCountData" ref="topCountGraph"
                            description="Limit the number of genes. For MAGMA analysis/single-cell data differential gene analysis,
                             select the top number based on the `P value` from the table above."/>
              </template>
              <template #right>
                <BaseSwitch active-text="Core:" inactive-text="All:" :is-inline="false" :change-event="geneCoreChange" ref="geneCoreSwitch"/>
              </template>
            </LeftRight>
          </template>
        </LeftRight>
        <BaseBr/>
        <LeftRight :is-left-right="isLeftRight" ref="graphLeftRight">
          <template #left>
            <span class="element_title_strategy">Gene ({{ networkCiceroValue === 'cicero' ? 'Cicero' : (networkCiceroValue === 'magma' ? 'MAGMA' : 'Overlap') }}):</span>
            <div class="element_info">
              <div v-show="networkCiceroValue === 'magma' || networkCiceroValue === 'overlap'">
                <BaseInput class="trait_number"
                           title="Number of SNPs:"
                           type="number"
                           :min="0"
                           :width="200"
                           description="The minimum number of SNPs annotated onto a gene"
                           is-line
                           ref="min"/>
                <el-button @click="cellTypeGraphChange"> Analysis</el-button>
              </div>
              <BaseSelect title="P value:"
                          clearable
                          :is-line="true"
                          width="62%"
                          :change-event="cellTypeGraphChange"
                          :select-data="pValueTraitSelectData"
                          ref="pValueTrait"
                          v-show="networkCiceroValue === 'magma' || networkCiceroValue === 'overlap'"/>
              <BaseSelect title="Co-score:"
                          clearable
                          :is-line="true"
                          width="62%"
                          :change-event="cellTypeGraphChange"
                          :select-data="coScoreSelectData"
                          ref="coScoreTrait"
                          v-show="networkCiceroValue === 'cicero' || networkCiceroValue === 'overlap'"/>
            </div>
          </template>
          <template #right>
            <span class="element_title_strategy">Gene (Difference):</span>
            <div class="element_info">
              <BaseSelect title="P value:" clearable :is-line="true" width="62%" :change-event="cellTypeGraphChange" :select-data="pValueSelectData" ref="pValue"/>
              <BaseSelect title="Adjusted p value:" clearable :is-line="true" width="62%" :change-event="cellTypeGraphChange" :select-data="AdjustedPValueSelectData" ref="adjustedPValue"/>
              <BaseSelect title="Log<sub>2</sub>(Fold change):" clearable :is-line="true" width="62%" :change-event="cellTypeGraphChange" :select-data="Log2FoldChangeSelectData" ref="log2FoldChange"/>
            </div>
          </template>
        </LeftRight>
        <BaseBr/>
        <Echarts :resize-value="graphSize" ref="graphECharts"/>
      </template>
    </SingleCard>
    <BaseDrawer title="Annotation on variant information enriched in MAGAM" size="50%" ref="drawer">
      <SingleCard :title="{ content: `Information mapping of gene and variants in ${traitLabel}` }">
        <BaseTable :table-data="magmaVariantInfoTableData"
                   :is-service-paging="false"
                   :download-url="magmaGeneAnnoDownloadUrl"
                   :table-description="magmaVariantInfoTableDescription"
                   ref="magmaVariantTable"/>
      </SingleCard>
      <br/>
      <SingleCard :title="{ content: 'Gene-relevant SNP regulatory network' }">
        <Echarts :resize-value="{ width: 500, height: 500 }" ref="geneSnpGraphECharts"/>
      </SingleCard>
    </BaseDrawer>
    <BaseDrawer title="Cicero (ATAC-based) and MAGMA (LD) identify the overlap of trait-relevant genes" size="50%" ref="overlapDrawer">
      <SingleCard :title="{ content: 'Gene overlap information' }" ref="geneOverlapLoading">
        <div ref="geneOverlap">
          <canvas :id="geneOverlapId" width="450" height="200"></canvas>
        </div>
      </SingleCard>
      <br/>
      <SingleCard :title="{ content: 'Overlapping gene-relevant SNPs network' }">
        <Echarts :resize-value="{ width: 650, height: 500 }" ref="overlapGeneGraphECharts"/>
      </SingleCard>
      <br/>
      <SingleCard :title="{ content: 'Number of overlapping SNP-relevant genes in overlapping gene contexts' }">
        <Echarts :resize-value="{ width: 650, height: 500 }" ref="overlapSnpCountECharts" v-show="!isOverlapSnpZero"/>
        <div v-show="isOverlapSnpZero">The number of overlapping SNP-relevant genes in the overlapping gene contexts is zero.</div>
      </SingleCard>
    </BaseDrawer>
  </BaseLoading>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue';
import DetailApi from '@/api/service/detailApi';
import {
  ANALYSIS_GENOME_DATA,
  ANALYSIS_LOG2_FOLD_CHANGE_SELECT_DATA,
  ANALYSIS_TOP_COUNT_DATA,
  ANALYSIS_TRAIT_GENE_ALL_METHOD_DATA,
  ANALYSIS_TRAIT_GENE_METHOD_DATA,
  CICERO_CO_SCORE_DATA,
  DATA_ANALYSIS_DIFFERENCE_GENE_TABLE_DESCRIPTION,
  DATA_ANALYSIS_MAGMA_VARIANT_INFO_TABLE_DESCRIPTION,
  DATA_ANALYSIS_SAMPLE_TABLE_DESCRIPTION,
  DATA_ANALYSIS_TRAIT_GENE_CICERO_TABLE_DESCRIPTION,
  DATA_ANALYSIS_TRAIT_GENE_TABLE_DESCRIPTION,
  DATA_ANALYSIS_TRAIT_TABLE_DESCRIPTION,
  DIFFERENCE_GENE_ADJUSTED_P_VALUE_DATA,
  DIFFERENCE_GENE_P_VALUE_DATA,
  geneGraphOption,
  geneSnpGraphOption,
  MAGMA_GENE_P_VALUE_DATA,
  overlapGeneGraphOption,
  overlapSnpCountBarOption,
  STATIC_DOWNLOAD_PATH,
  STATIC_MAGMA_PATH
} from '@/assets/ts';
import StringUtil from '@/service/util/base/string';
import Base from '@/service/util/base/base';
import SingleCard from '@/components/card/SingleCard.vue';
import BaseSelect from '@/components/input/BaseSelect.vue';
import BaseTable from '@/components/table/BaseTable.vue';
import BaseBr from '@/components/divider/BaseBr.vue';
import Echarts from '@/components/echarts/Echarts.vue';
import BaseDrawer from '@/components/drawer/BaseDrawer.vue';
import ArrayUtil from '@/service/util/base/array';
import AnalysisApi from '@/api/service/analysisApi';
import Time from '@/service/util/base/time';
import LeftRight from '@/components/layout/LeftRight.vue';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import GeneEnrichment from '@/views/analysisResult/common/GeneEnrichment.vue';
import NumberUtil from '@/service/util/base/number';
import BaseInput from '@/components/input/BaseInput.vue';
import '@/assets/less/views/detail/ElementInfoAnnotation.less';
import TraitGeneEnrichment from '@/views/analysisResult/common/TraitGeneEnrichment.vue';
import { Page } from '@/service/model/reponse/request';
import BaseSwitch from '@/components/switch/BaseSwitch.vue';
import DifferenceHeatMap from '@/views/detail/common/DifferenceHeatMap.vue';
import BaseTabs from '@/components/tabs/BaseTabs.vue';
import FileApi from '@/api/service/fileApi';

export default defineComponent({
  name: 'GeneInfoAnnotation',
  components: {
    BaseTabs,
    DifferenceHeatMap,
    BaseSwitch,
    TraitGeneEnrichment,
    BaseInput,
    GeneEnrichment,
    BaseLoading,
    LeftRight,
    BaseDrawer,
    Echarts,
    BaseBr,
    BaseTable,
    BaseSelect,
    SingleCard
  },
  props: {
    sampleId: {
      type: String,
      default: () => ''
    },
    traitId: {
      type: String,
      default: () => ''
    },
    isLeftRight: {
      type: Boolean,
      default: () => true
    }
  },
  setup(props) {
    const loading = ref();
    const sampleTable = ref();
    const traitTable = ref();
    const differenceGeneTable = ref();
    const traitGeneStrategy = ref();
    const traitGeneTable = ref();
    const traitGeneCiceroTable = ref();
    const networkTraitGeneStrategy = ref();
    const overlapGeneGraphECharts = ref();
    const overlapSnpCountECharts = ref();
    const graphECharts = ref();
    const overlapDrawer = ref();
    const graphLeftRight = ref();
    const genome = ref();
    const cellType = ref();
    const cellTypeGraph = ref();
    const topCountGraph = ref();
    const coScoreTrait = ref();
    const geneCoreSwitch = ref();
    const drawer = ref();
    const log2FoldChange = ref();
    const adjustedPValue = ref();
    const pValue = ref();
    const pValueTrait = ref();
    const min = ref();
    const geneSnpGraphECharts = ref();
    const geneOverlap = ref();
    const geneOverlapLoading = ref();
    const magmaVariantTable = ref();

    const data = reactive({
      id: NumberUtil.random10(),
      geneOverlapId: StringUtil.randomString(10),
      clusterId: StringUtil.randomString(10),
      sample: {} as any,
      sampleLabel: '',
      traitLabel: '',
      isOverlapSnpZero: false,
      isTraitGeneCicero: true,
      networkCiceroValue: 'cicero',
      isGeneCore: true,
      differenceGeneIsMounted: false,
      cellTypeData: [] as Array<any>,
      sampleTableData: [] as Array<any>,
      traitTableDataAll: [] as Array<any>,
      traitTableData: [] as Array<any>,
      differenceGeneTableData: [] as Array<any>,
      traitGeneTableData: [] as Array<any>,
      traitGeneCiceroTableData: [] as Array<any>,
      magmaVariantInfoTableData: [] as Array<any>,
      magmaGeneDownloadUrl: '' as string | undefined,
      ciceroGeneDownloadUrl: '' as string | undefined,
      magmaGeneAnnoDownloadUrl: '' as string | undefined,
      graphSize: { width: 1100, height: 800 }
    });

    const getCellTypeData = async () => {
      ArrayUtil.clear(data.cellTypeData);
      return DetailApi.listSampleCellType(props.sampleId, data.id).then((res: any) => {
        (res as Array<any>).forEach((item: any) => {
          data.cellTypeData.push({ label: item.cellType, value: item.cellType });
        });
        data.cellTypeData.push({ label: 'All', value: 'All' });
        cellType.value.select = data.cellTypeData[0].value;
        cellTypeGraph.value.select = data.cellTypeData[0].value;
      });
    };

    // 得到参数
    const getParams = () => ({
      log2FoldChange: log2FoldChange.value.select,
      adjustedPValue: adjustedPValue.value.select,
      strategy: networkTraitGeneStrategy.value.select,
      coScore: coScoreTrait.value.select,
      pvalue: pValue.value.select,
      min: min.value.input,
      pvalueTrait: pValueTrait.value.select
    });

    // 画聚类每个细胞类型数量配图
    const getGraphData = () => {
      graphECharts.value.startLoading();
      AnalysisApi.getGeneGraphData({
        sampleId: props.sampleId,
        traitId: props.traitId,
        cellType: cellTypeGraph.value.select,
        analysisGene: getParams(),
        topCount: topCountGraph.value.select,
        isCore: data.isGeneCore
      }).then((res: any) => {
        graphECharts.value.endLoading();
        // echarts
        data.graphSize = {
          width: graphLeftRight.value.$el.clientWidth,
          height: 800
        };
        graphECharts.value.drawEcharts(geneGraphOption(res));
      });
    };

    const listMagmaGeneByTraitId = () => {
      traitGeneTable.value.startLoading();
      return DetailApi.listMagmaGeneByTraitId(props.traitId, data.sample.genome).then((res: any) => {
        traitGeneTable.value.endLoading();
        data.traitGeneTableData = res;
      });
    };

    const listCiceroTraitGeneBySampleIdAndTraitId = () => {
      traitGeneCiceroTable.value.startLoading();
      return DetailApi.listCiceroTraitGeneBySampleIdAndTraitId(props.sampleId, props.traitId).then((res: any) => {
        traitGeneCiceroTable.value.endLoading();
        data.traitGeneCiceroTableData = res;
      });
    };

    const listDifferenceGeneInformation = (page: Page) => DetailApi.listDifferenceGeneBySampleId(props.sampleId, cellType.value.select, page);

    const differenceGeneCallback = () => {
      listCiceroTraitGeneBySampleIdAndTraitId();
      listMagmaGeneByTraitId();
      getGraphData();
    };

    const differenceGeneDownload = () => `${STATIC_DOWNLOAD_PATH}/difference/difference_gene/${props.sampleId}_difference_gene_data.txt`;
    const differenceGeneH5adDownload = () => `${STATIC_DOWNLOAD_PATH}/difference/difference_gene_h5ad/${data.sampleLabel}_difference_gene.h5ad`;

    const magmaGeneDownload = () => {
      const fileUrl = `${STATIC_MAGMA_PATH}/magma_output/${data.sample.genome}_gene/${data.traitLabel}.genes.out`;
      const filePath = `magma/magma_output/${data.sample.genome}_gene/${data.traitLabel}.genes.out`;
      FileApi.isExist(filePath).then((res: boolean) => {
        data.magmaGeneDownloadUrl = res ? fileUrl : undefined;
      });
    };
    const magmaGeneAnnoDownload = () => {
      const fileUrl = `${STATIC_MAGMA_PATH}/magma_output/${data.sample.genome}_anno/${data.traitLabel}.genes.annot`;
      const filePath = `magma/magma_output/${data.sample.genome}_anno/${data.traitLabel}.genes.annot`;
      FileApi.isExist(filePath).then((res: boolean) => {
        data.magmaGeneAnnoDownloadUrl = res ? fileUrl : undefined;
      });
    };

    const cellTypeChange = () => {
      differenceGeneTable.value.dataUpdate();
    };

    const geneCoreChange = (value: boolean) => {
      data.isGeneCore = value;
      getGraphData();
    };

    const getSampleInfo = () => {
      DetailApi.getSampleInfo(props.sampleId).then((res: any) => {
        data.sample = res;
        data.sampleLabel = res.label;
      });
      DetailApi.getVariantTrait(props.traitId).then((res: any) => {
        data.traitLabel = res.traitCode;
        magmaGeneDownload();
        magmaGeneAnnoDownload();
      });
    };

    const cellTypeGraphChange = () => {
      getGraphData();
    };

    const traitGeneStrategyChange = () => {
      data.isTraitGeneCicero = traitGeneStrategy.value.select === 'cicero';
    };

    const networkTraitGeneStrategyChange = () => {
      data.networkCiceroValue = networkTraitGeneStrategy.value.select;
      getGraphData();
    };

    const topCountGraphChange = () => {
      getGraphData();
    };

    const variantInfoShow = (row: any) => {
      drawer.value.drawer = true;
      Time.delay(() => {
        magmaVariantTable.value.startLoading();
        geneSnpGraphECharts.value.startLoading();
        AnalysisApi.listMagmaVariantInfoDataByTraitIdAndGene(props.traitId, data.sample.genome, row.gene).then((res: any) => {
          magmaVariantTable.value.endLoading();
          geneSnpGraphECharts.value.endLoading();
          data.magmaVariantInfoTableData = res;
          geneSnpGraphECharts.value.drawEcharts(geneSnpGraphOption(res, row.gene));
        });
      }, 300);
    };

    // 画热图
    const plotGeneOverlap = (vennData: any) => {
      // 需要先重新添加
      geneOverlap.value.innerHTML = `<canvas id="${data.geneOverlapId}" width="500" height="400"></canvas>`;
      // @ts-ignore CanvasXpress 这个在 ts 中报错, 忽略下一行一切错误
      // eslint-disable-next-line no-undef,no-new
      new CanvasXpress(data.geneOverlapId, {
        venn: {
          data: {
            A: vennData[0],
            AB: vennData[1],
            B: vennData[2]
          },
          legend: {
            A: 'Cicero',
            B: 'MAGMA'
          }
        }
      }, {
        graphType: 'Venn',
        vennGroups: 2
      }, false);
    };

    const traitGeneStrategyOverlapShow = () => {
      overlapDrawer.value.drawer = true;
      Time.delay(() => {
        geneOverlapLoading.value.startLoading();
        overlapGeneGraphECharts.value.startLoading();
        overlapSnpCountECharts.value.startLoading();
        DetailApi.getCiceroAndMagmaOverlapGene(props.sampleId, props.traitId, data.sample.genome).then((res: any) => {
          geneOverlapLoading.value.endLoading();
          overlapGeneGraphECharts.value.endLoading();
          overlapSnpCountECharts.value.endLoading();
          plotGeneOverlap(res.venn);
          overlapGeneGraphECharts.value.drawEcharts(overlapGeneGraphOption(res.graph));
          if (res.snpCount.xdata.length !== 0) {
            overlapSnpCountECharts.value.drawEcharts(overlapSnpCountBarOption(res.snpCount));
          } else {
            data.isOverlapSnpZero = true;
          }
        });
      }, 300);
    };

    const startLoading = () => {
      loading.value.loading = true;
    };
    const endLoading = () => {
      loading.value.loading = false;
    };

    onMounted(async () => {
      geneCoreSwitch.value.value = true;
      traitGeneStrategy.value.select = ANALYSIS_TRAIT_GENE_METHOD_DATA[0].value;
      coScoreTrait.value.select = CICERO_CO_SCORE_DATA[0].value;
      networkTraitGeneStrategy.value.select = ANALYSIS_TRAIT_GENE_METHOD_DATA[0].value;
      topCountGraph.value.select = 2000;
      log2FoldChange.value.select = ANALYSIS_LOG2_FOLD_CHANGE_SELECT_DATA[1].value;
      adjustedPValue.value.select = DIFFERENCE_GENE_ADJUSTED_P_VALUE_DATA[1].value;
      pValue.value.select = DIFFERENCE_GENE_P_VALUE_DATA[1].value;
      pValueTrait.value.select = MAGMA_GENE_P_VALUE_DATA[1].value;
      min.value.input = 1;
      if (Base.noNull(props.sampleId) && Base.noNull(props.traitId) && Base.noNull(cellType.value)) {
        getSampleInfo();
        await getCellTypeData();
        if (!data.differenceGeneIsMounted) {
          data.differenceGeneIsMounted = true;
        } else {
          differenceGeneTable.value.dataUpdate();
        }
      }
    });

    // 监控
    watch(() => ({ value1: props.sampleId, value2: props.traitId }), async () => {
      if (Base.noNull(props.sampleId) && Base.noNull(props.traitId) && Base.noNull(cellType.value)) {
        getSampleInfo();
        await getCellTypeData();
        if (!data.differenceGeneIsMounted) {
          data.differenceGeneIsMounted = true;
        } else {
          differenceGeneTable.value.dataUpdate();
        }
      }
    }, {
      immediate: true,
      deep: true
    });

    return {
      ...toRefs(data),
      loading,
      sampleTable,
      traitTable,
      differenceGeneTable,
      traitGeneStrategy,
      traitGeneTable,
      coScoreTrait,
      traitGeneCiceroTable,
      networkTraitGeneStrategy,
      overlapDrawer,
      overlapGeneGraphECharts,
      overlapSnpCountECharts,
      graphECharts,
      graphLeftRight,
      genome,
      cellType,
      cellTypeGraph,
      topCountGraph,
      geneCoreSwitch,
      drawer,
      log2FoldChange,
      adjustedPValue,
      pValue,
      pValueTrait,
      min,
      geneSnpGraphECharts,
      geneOverlap,
      geneOverlapLoading,
      magmaVariantTable,
      differenceGeneDownload,
      differenceGeneH5adDownload,
      cellTypeChange,
      cellTypeGraphChange,
      traitGeneStrategyChange,
      networkTraitGeneStrategyChange,
      topCountGraphChange,
      variantInfoShow,
      traitGeneStrategyOverlapShow,
      startLoading,
      endLoading,
      listDifferenceGeneInformation,
      differenceGeneCallback,
      geneCoreChange,
      Log2FoldChangeSelectData: ANALYSIS_LOG2_FOLD_CHANGE_SELECT_DATA,
      AdjustedPValueSelectData: DIFFERENCE_GENE_ADJUSTED_P_VALUE_DATA,
      pValueSelectData: DIFFERENCE_GENE_P_VALUE_DATA,
      coScoreSelectData: CICERO_CO_SCORE_DATA,
      pValueTraitSelectData: MAGMA_GENE_P_VALUE_DATA,
      differenceGeneTableDescription: DATA_ANALYSIS_DIFFERENCE_GENE_TABLE_DESCRIPTION,
      magmaVariantInfoTableDescription: DATA_ANALYSIS_MAGMA_VARIANT_INFO_TABLE_DESCRIPTION,
      traitGeneTableDescription: DATA_ANALYSIS_TRAIT_GENE_TABLE_DESCRIPTION,
      traitGeneCiceroTableDescription: DATA_ANALYSIS_TRAIT_GENE_CICERO_TABLE_DESCRIPTION,
      genomeData: ANALYSIS_GENOME_DATA,
      traitGeneMethodData: ANALYSIS_TRAIT_GENE_METHOD_DATA,
      traitGeneMethodAllData: ANALYSIS_TRAIT_GENE_ALL_METHOD_DATA,
      topCountData: ANALYSIS_TOP_COUNT_DATA,
      sampleTableDescription: DATA_ANALYSIS_SAMPLE_TABLE_DESCRIPTION,
      tableDescription: DATA_ANALYSIS_TRAIT_TABLE_DESCRIPTION
    };
  }
});
</script>
