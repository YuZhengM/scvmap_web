<template>
  <BaseLoading id="gene_info_annotation" ref="loading">
    <SingleCard :title="{ content: `Differential TFs of cell types` }" id="position_difference_tf" ref="singleCard">
      <template #head>
        <el-link :href="differenceTfH5adDownload()">
          <el-button size="small" type="primary"> Differential TFs (Complete) &nbsp; <i class="fas fa-file-download"></i></el-button>
        </el-link>
      </template>
      <template #default>
        <LeftRight :left-width="48" :padding="2">
          <template #left>
            <BaseSelect title="Cell type:" is-line width="20%" :change-event="cellTypeChange" :select-data="cellTypeData" ref="cellType"/>
            <BaseTable :table-data="differenceTfTableData"
                       :is-service-paging="false"
                       :download-url="differenceTfDownload()"
                       layout="total, prev, pager, next"
                       :table-description="differenceTfTableDescription"
                       ref="differenceTfTable"/>
          </template>
          <template #right>
            <DifferenceHeatMap :sample-id="sampleId" element="tf" top-description="Limit the number of TFs.
                 For single-cell data differential TF analysis, select the top number based on the `f_p_value` from the table above."/>
          </template>
        </LeftRight>
      </template>
    </SingleCard>
    <BaseBr/>
    <SingleCard :title="{ content: `${traitId}-relevant TFs` }" id="position_homer_tf" ref="singleCard">
      <template #head>
        <el-link :href="linkHomerDetailUrl" target="_blank" v-show="linkHomerDetailUrl">
          <el-button size="small" type="primary"><i class="fas fa-link"></i></el-button>
        </el-link>
      </template>
      <template #default>
        <BaseSelect title="Genome:" is-line width="20%" :select-data="genomeData" ref="genome" v-show="false"/>
        <BaseTable :table-data="traitTfTableData"
                   :is-service-paging="false"
                   :before-column-number="2"
                   :download-url="homerTfDownloadUrl"
                   :table-description="traitTfTableDescription"
                   ref="traitTfTable">
          <template #default>
            <el-table-column label="Motif name" stripe align="center" width="250">
              <template #default="scope">
                <BaseTooltip placement="top" :content="scope.row.motifName">
                  <span>{{ scope.row.motifName.length > 25 ? `${scope.row.motifName.substring(0, 25)}...` : scope.row.motifName }}</span>
                </BaseTooltip>
              </template>
            </el-table-column>
          </template>
        </BaseTable>
      </template>
    </SingleCard>
    <BaseBr/>
    <SingleCard :title='{ content: `TF regulatory network associated with ${traitId} and ${sampleId}` }' id="position_tf_network" ref="singleCard">
      <LeftRight>
        <template #left>
          <BaseSelect title="Cell type:" is-line width="40%" :change-event="cellTypeGraphChange" :select-data="cellTypeData" ref="cellTypeGraph"/>
        </template>
        <template #right>
          <BaseSwitch active-text="Core:" inactive-text="All:" :is-inline="false" :change-event="tfCoreChange" ref="tfCoreSwitch"/>
        </template>
      </LeftRight>
      <BaseBr/>
      <LeftRight>
        <template #left>
          <span class="element_title_strategy">TF (HOMER):</span>
          <div class="element_info">
            <BaseSelect title="P value:" clearable :is-line="true" width="62%" :change-event="cellTypeGraphChange" :select-data="pValueTraitSelectData" ref="pValueTrait"/>
            <BaseSelect title="Q value:" clearable :is-line="true" width="62%" :change-event="cellTypeGraphChange" :select-data="qValueTraitSelectData" ref="qValueTrait"/>
          </div>
        </template>
        <template #right>
          <span class="element_title_strategy">TF (Difference):</span>
          <div class="element_info">
            <BaseSelect title="P value:" clearable :is-line="true" width="62%" :change-event="cellTypeGraphChange" :select-data="pValueSelectData" ref="pValue"/>
            <BaseSelect title="Adjusted p value:" clearable :is-line="true" width="62%" :change-event="cellTypeGraphChange" :select-data="AdjustedPValueSelectData" ref="adjustedPValue"/>
            <BaseSelect title="Log<sub>2</sub>(Fold change):" clearable :is-line="true" width="62%" :change-event="cellTypeGraphChange" :select-data="Log2FoldChangeSelectData" ref="log2FoldChange"/>
          </div>
        </template>
      </LeftRight>
      <BaseBr/>
      <Echarts :resize-value="{ width: 1100, height: 600 }" ref="graphECharts"/>
    </SingleCard>
  </BaseLoading>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue';
import DetailApi from '@/api/service/detailApi';
import {
  ANALYSIS_GENOME_DATA,
  ANALYSIS_LOG2_FOLD_CHANGE_SELECT_DATA,
  DATA_ANALYSIS_DIFFERENCE_TF_TABLE_DESCRIPTION,
  DATA_ANALYSIS_SAMPLE_TABLE_DESCRIPTION,
  DATA_ANALYSIS_TRAIT_TABLE_DESCRIPTION,
  DATA_ANALYSIS_TRAIT_TF_TABLE_DESCRIPTION,
  DIFFERENCE_TF_P_VALUE_DATA,
  DIFFERENCE_TF_ADJUSTED_P_VALUE_DATA,
  geneGraphOption,
  HOMER_TF_P_VALUE_DATA,
  HOMER_TF_Q_VALUE_DATA, STATIC_DOWNLOAD_PATH, STATIC_HOMER_PATH
} from '@/assets/ts';
import StringUtil from '@/service/util/base/string';
import Base from '@/service/util/base/base';
import SingleCard from '@/components/card/SingleCard.vue';
import BaseSelect from '@/components/input/BaseSelect.vue';
import BaseTable from '@/components/table/BaseTable.vue';
import BaseBr from '@/components/divider/BaseBr.vue';
import Echarts from '@/components/echarts/Echarts.vue';
import ArrayUtil from '@/service/util/base/array';
import AnalysisApi from '@/api/service/analysisApi';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import NumberUtil from '@/service/util/base/number';
import LeftRight from '@/components/layout/LeftRight.vue';
import '@/assets/less/views/detail/ElementInfoAnnotation.less';
import BaseSwitch from '@/components/switch/BaseSwitch.vue';
import DifferenceHeatMap from '@/views/detail/common/DifferenceHeatMap.vue';
import BaseTooltip from '@/components/tooltip/BaseTooltip.vue';
import FileApi from '@/api/service/fileApi';

export default defineComponent({
  name: 'TfInfoAnnotation',
  components: {
    BaseTooltip,
    DifferenceHeatMap,
    BaseSwitch,
    LeftRight,
    BaseLoading,
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
    const differenceTfTable = ref();
    const traitTfTable = ref();
    const graphECharts = ref();
    const genome = ref();
    const cellType = ref();
    const tfCoreSwitch = ref();
    const cellTypeGraph = ref();
    const log2FoldChange = ref();
    const adjustedPValue = ref();
    const pValue = ref();
    const qValueTrait = ref();
    const pValueTrait = ref();

    const data = reactive({
      id: NumberUtil.random10(),
      sample: {} as any,
      sampleLabel: '',
      traitLabel: '',
      isTfCore: false,
      clusterId: StringUtil.randomString(10),
      cellTypeData: [] as Array<any>,
      sampleTfData: [] as Array<any>,
      traitTableDataAll: [] as Array<any>,
      traitTableData: [] as Array<any>,
      differenceTfTableData: [] as Array<any>,
      traitTfTableData: [] as Array<any>,
      homerTfDownloadUrl: '' as string | undefined,
      linkHomerDetailUrl: '' as string | undefined
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

    const getParams = () => ({
      log2FoldChange: log2FoldChange.value.select,
      adjustedPValue: adjustedPValue.value.select,
      pvalue: pValue.value.select,
      qvalueTrait: qValueTrait.value.select,
      pvalueTrait: pValueTrait.value.select
    });

    // 画聚类每个细胞类型数量配图
    const getGraphData = () => {
      graphECharts.value.startLoading();
      AnalysisApi.getTfGraphData({
        sampleId: props.sampleId,
        traitId: props.traitId,
        cellType: cellTypeGraph.value.select,
        analysisTf: getParams(),
        isCore: data.isTfCore
      }).then((res: any) => {
        graphECharts.value.endLoading();
        // echarts
        graphECharts.value.drawEcharts(geneGraphOption(res));
      });
    };

    const listHomerTfByTraitId = async () => {
      traitTfTable.value.startLoading();
      return DetailApi.listHomerTfByTraitId(props.traitId, data.sample.genome).then((res: any) => {
        traitTfTable.value.endLoading();
        data.traitTfTableData = res;
      });
    };

    const listDifferenceTfBySampleId = async () => {
      differenceTfTable.value.startLoading();
      return DetailApi.listDifferenceTfBySampleId(props.sampleId, cellType.value.select).then((res: any) => {
        differenceTfTable.value.endLoading();
        data.differenceTfTableData = res;
      });
    };

    const differenceTfDownload = () => `${STATIC_DOWNLOAD_PATH}/difference/difference_tf/${props.sampleId}_difference_tf_data.txt`;
    const differenceTfH5adDownload = () => `${STATIC_DOWNLOAD_PATH}/difference/difference_tf_h5ad/${data.sampleLabel}_tf_activity_data.h5ad`;
    const homerTfDownload = () => {
      const fileUrl = `${STATIC_HOMER_PATH}/${data.sample.genome}/${data.traitLabel}/knownResults.txt`;
      const filePath = `homer/${data.sample.genome}/${data.traitLabel}/knownResults.txt`;
      FileApi.isExist(filePath).then((res: boolean) => {
        data.homerTfDownloadUrl = res ? fileUrl : undefined;
      });
    };
    const linkHomerDetail = () => {
      const fileUrl = `${STATIC_HOMER_PATH}/${data.sample.genome}/${data.traitLabel}/knownResults.html`;
      const filePath = `homer/${data.sample.genome}/${data.traitLabel}/knownResults.html`;
      FileApi.isExist(filePath).then((res: boolean) => {
        data.linkHomerDetailUrl = res ? fileUrl : undefined;
      });
    };

    const cellTypeChange = () => {
      listDifferenceTfBySampleId();
    };

    const tfCoreChange = (value: boolean) => {
      data.isTfCore = value;
      getGraphData();
    };

    const getSampleInfo = () => {
      DetailApi.getSampleInfo(props.sampleId).then((res: any) => {
        data.sample = res;
        data.sampleLabel = res.label;
      });
      DetailApi.getVariantTrait(props.traitId).then((res: any) => {
        data.traitLabel = res.traitCode;
        homerTfDownload();
        linkHomerDetail();
      });
    };

    const cellTypeGraphChange = () => {
      getGraphData();
    };

    const topCountGraphChange = () => {
      getGraphData();
    };

    const startLoading = () => {
      loading.value.loading = true;
    };
    const endLoading = () => {
      loading.value.loading = false;
    };

    onMounted(() => {
      tfCoreSwitch.value.value = false;
      log2FoldChange.value.select = ANALYSIS_LOG2_FOLD_CHANGE_SELECT_DATA[1].value;
      adjustedPValue.value.select = DIFFERENCE_TF_ADJUSTED_P_VALUE_DATA[1].value;
      pValue.value.select = DIFFERENCE_TF_P_VALUE_DATA[1].value;
      qValueTrait.value.select = HOMER_TF_P_VALUE_DATA[0].value;
      pValueTrait.value.select = HOMER_TF_Q_VALUE_DATA[0].value;
    });

    // 监控
    watch(() => ({ value1: props.sampleId, value2: props.traitId }), async () => {
      if (Base.noNull(props.sampleId) && Base.noNull(props.traitId) && Base.noNull(cellType.value)) {
        getSampleInfo();
        await getCellTypeData();
        await listDifferenceTfBySampleId();
        await listHomerTfByTraitId();
        getGraphData();
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
      differenceTfTable,
      traitTfTable,
      graphECharts,
      genome,
      cellType,
      tfCoreSwitch,
      cellTypeGraph,
      log2FoldChange,
      adjustedPValue,
      pValue,
      qValueTrait,
      pValueTrait,
      differenceTfDownload,
      differenceTfH5adDownload,
      linkHomerDetail,
      cellTypeChange,
      tfCoreChange,
      cellTypeGraphChange,
      topCountGraphChange,
      startLoading,
      endLoading,
      Log2FoldChangeSelectData: ANALYSIS_LOG2_FOLD_CHANGE_SELECT_DATA,
      AdjustedPValueSelectData: DIFFERENCE_TF_ADJUSTED_P_VALUE_DATA,
      pValueSelectData: DIFFERENCE_TF_P_VALUE_DATA,
      pValueTraitSelectData: HOMER_TF_P_VALUE_DATA,
      qValueTraitSelectData: HOMER_TF_Q_VALUE_DATA,
      differenceTfTableDescription: DATA_ANALYSIS_DIFFERENCE_TF_TABLE_DESCRIPTION,
      traitTfTableDescription: DATA_ANALYSIS_TRAIT_TF_TABLE_DESCRIPTION,
      genomeData: ANALYSIS_GENOME_DATA,
      sampleTableDescription: DATA_ANALYSIS_SAMPLE_TABLE_DESCRIPTION,
      tableDescription: DATA_ANALYSIS_TRAIT_TABLE_DESCRIPTION
    };
  }
});
</script>
