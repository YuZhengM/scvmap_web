<template>
  <BaseLoading id="gene_info_annotation" ref="loading">
    <SingleCard :title="{ content: `Differential genes of cell types` }" id="position_difference_gene" ref="singleCard">
      <template #head>
        <el-link :href="differenceGeneH5adDownload()">
          <el-button size="small" type="primary"> Differential genes (Complete) &nbsp; <i class="fas fa-file-download"></i></el-button>
        </el-link>
      </template>
      <template #default>
        <LeftRight :left-width="50" :padding="0">
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
                           :width="57"
                           :content-width="30"
                           :service-search-width="80"
                           :button-padding="7"
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
    <SingleCard :title="{ content: `Genes associated with ${traitId}` }" id="position_magma_gene" ref="singleCard">
      <LeftRight>
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
    </SingleCard>
    <BaseBr/>
    <SingleCard :title="{ content: `${sampleId} and ${traitId} related enrichment regulation landscape network` }" id="position_gene_network" ref="singleCard">
      <LeftRight>
        <template #left>
          <BaseSelect title="Cell type:" is-line width="40%" :change-event="cellTypeGraphChange" :select-data="cellTypeData" ref="cellTypeGraph"/>
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
      <LeftRight>
        <template #left>
          <span class="element_title_strategy">Gene (MAGMA):</span>
          <div class="element_info">
            <BaseInput class="trait_number" title="Number of SNPs:" type="number" :min="0" :width="200" description="The minimum number of SNPs annotated onto a gene" is-line ref="min"/>
            <el-button @click="cellTypeGraphChange"> Analysis</el-button>
            <BaseSelect title="P value:" clearable :is-line="true" width="62%" :change-event="cellTypeGraphChange" :select-data="pValueTraitSelectData" ref="pValueTrait"/>
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
      <Echarts :resize-value="{ width: 1100, height: 800 }" ref="graphECharts"/>
    </SingleCard>
    <BaseDrawer title="Annotation on variant information enriched in MAGAM" size="50%" ref="drawer">
      <BaseTable :table-data="magmaVariantInfoTableData"
                 :is-service-paging="false"
                 :download-url="magmaGeneAnnoDownloadUrl"
                 :table-description="magmaVariantInfoTableDescription"
                 ref="magmaVariantTable"/>
      <Echarts :resize-value="{ width: 500, height: 500 }" ref="geneSnpGraphECharts"/>
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
  DATA_ANALYSIS_DIFFERENCE_GENE_TABLE_DESCRIPTION,
  DATA_ANALYSIS_MAGMA_VARIANT_INFO_TABLE_DESCRIPTION,
  DATA_ANALYSIS_SAMPLE_TABLE_DESCRIPTION,
  DATA_ANALYSIS_TRAIT_GENE_TABLE_DESCRIPTION,
  DATA_ANALYSIS_TRAIT_TABLE_DESCRIPTION,
  DIFFERENCE_GENE_ADJUSTED_P_VALUE_DATA,
  DIFFERENCE_GENE_P_VALUE_DATA,
  geneGraphOption,
  geneSnpGraphOption,
  MAGMA_GENE_P_VALUE_DATA,
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
    }
  },
  setup(props) {
    const loading = ref();
    const sampleTable = ref();
    const traitTable = ref();
    const differenceGeneTable = ref();
    const traitGeneTable = ref();
    const graphECharts = ref();
    const genome = ref();
    const cellType = ref();
    const cellTypeGraph = ref();
    const topCountGraph = ref();
    const geneCoreSwitch = ref();
    const drawer = ref();
    const log2FoldChange = ref();
    const adjustedPValue = ref();
    const pValue = ref();
    const pValueTrait = ref();
    const min = ref();
    const geneSnpGraphECharts = ref();
    const magmaVariantTable = ref();

    const data = reactive({
      id: NumberUtil.random10(),
      clusterId: StringUtil.randomString(10),
      sample: {} as any,
      sampleLabel: '',
      traitLabel: '',
      isGeneCore: true,
      differenceGeneIsMounted: false,
      cellTypeData: [] as Array<any>,
      sampleTableData: [] as Array<any>,
      traitTableDataAll: [] as Array<any>,
      traitTableData: [] as Array<any>,
      differenceGeneTableData: [] as Array<any>,
      traitGeneTableData: [] as Array<any>,
      magmaVariantInfoTableData: [] as Array<any>,
      magmaGeneDownloadUrl: '' as string | undefined,
      magmaGeneAnnoDownloadUrl: '' as string | undefined
    });

    const getCellTypeData = () => {
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

    const listDifferenceGeneInformation = (page: Page) => DetailApi.listDifferenceGeneBySampleId(props.sampleId, cellType.value.select, page);

    const differenceGeneCallback = () => {
      listMagmaGeneByTraitId().then(() => {
        getGraphData();
      });
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

          const categories: Array<any> = [
            {
              name: 'Gene'
            },
            {
              name: 'Variant'
            }
          ];
          const nodes: Array<any> = [{
            id: row.gene,
            name: row.gene,
            category: 'Gene',
            symbolSize: 50
          }];
          const links: Array<any> = [];

          data.magmaVariantInfoTableData.forEach((item: any) => {
            links.push({
              source: item.rsId,
              target: row.gene
            });
            nodes.push({
              id: item.rsId,
              name: item.rsId,
              category: 'Variant',
              symbolSize: 25
            });
          });

          const geneSnpGraphData = {
            nodes,
            links,
            categories
          };

          geneSnpGraphECharts.value.drawEcharts(geneSnpGraphOption(geneSnpGraphData));
        });
      }, 300);
    };

    const startLoading = () => {
      loading.value.loading = true;
    };
    const endLoading = () => {
      loading.value.loading = false;
    };

    onMounted(() => {
      geneCoreSwitch.value.value = true;
      topCountGraph.value.select = 2000;
      log2FoldChange.value.select = ANALYSIS_LOG2_FOLD_CHANGE_SELECT_DATA[1].value;
      adjustedPValue.value.select = DIFFERENCE_GENE_ADJUSTED_P_VALUE_DATA[1].value;
      pValue.value.select = DIFFERENCE_GENE_P_VALUE_DATA[1].value;
      pValueTrait.value.select = MAGMA_GENE_P_VALUE_DATA[1].value;
      min.value.input = 1;
    });

    // 监控
    watch(() => ({ value1: props.sampleId, value2: props.traitId }), () => {
      if (Base.noNull(props.sampleId) && Base.noNull(props.traitId) && Base.noNull(cellType.value)) {
        getSampleInfo();
        getCellTypeData().then(() => {
          if (!data.differenceGeneIsMounted) {
            data.differenceGeneIsMounted = true;
          } else {
            differenceGeneTable.value.dataUpdate();
          }
        });
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
      traitGeneTable,
      graphECharts,
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
      magmaVariantTable,
      differenceGeneDownload,
      differenceGeneH5adDownload,
      cellTypeChange,
      cellTypeGraphChange,
      topCountGraphChange,
      variantInfoShow,
      startLoading,
      endLoading,
      listDifferenceGeneInformation,
      differenceGeneCallback,
      geneCoreChange,
      Log2FoldChangeSelectData: ANALYSIS_LOG2_FOLD_CHANGE_SELECT_DATA,
      AdjustedPValueSelectData: DIFFERENCE_GENE_ADJUSTED_P_VALUE_DATA,
      pValueSelectData: DIFFERENCE_GENE_P_VALUE_DATA,
      pValueTraitSelectData: MAGMA_GENE_P_VALUE_DATA,
      differenceGeneTableDescription: DATA_ANALYSIS_DIFFERENCE_GENE_TABLE_DESCRIPTION,
      magmaVariantInfoTableDescription: DATA_ANALYSIS_MAGMA_VARIANT_INFO_TABLE_DESCRIPTION,
      traitGeneTableDescription: DATA_ANALYSIS_TRAIT_GENE_TABLE_DESCRIPTION,
      genomeData: ANALYSIS_GENOME_DATA,
      topCountData: ANALYSIS_TOP_COUNT_DATA,
      sampleTableDescription: DATA_ANALYSIS_SAMPLE_TABLE_DESCRIPTION,
      tableDescription: DATA_ANALYSIS_TRAIT_TABLE_DESCRIPTION
    };
  }
});
</script>
