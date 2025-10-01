<template>
  <BaseLoading id="tf_info_annotation" ref="loading">
    <SingleCard :title="{ content: `Differential TFs of cell types` }" id="position_difference_tf" ref="singleCard">
      <template #head>
        <el-link :href="differenceTfH5adDownload()">
          <el-button size="small" type="primary"> Differential TFs (Complete) &nbsp; <i class="fas fa-file-download"></i></el-button>
        </el-link>
      </template>
      <template #default>

        <BaseTabs active="snapatac2" :tabs-data="TfStrategyData">
          <template #snapatac2>
            <LeftRight :is-left-right="isLeftRight" :left-width="48" :padding="2">
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
          <template #chromvar>
            <BaseSelect title="Cell type:" is-line width="20%" :change-event="cellTypeChromvarChange" :select-data="cellTypeData" ref="cellTypeChromvar"/>
            <BaseTable :table-data="chromvarDifferenceTfTableData"
                       :is-service-paging="false"
                       :download-url="differenceTfDownload()"
                       layout="total, prev, pager, next"
                       :table-description="chromvarDifferenceTfTableDescription"
                       ref="chromvarDifferenceTfTable"/>
          </template>
        </BaseTabs>

      </template>
    </SingleCard>
    <BaseBr/>
    <SingleCard :title='{ content: `"${traitName}"-relevant TFs` }' id="position_homer_tf" ref="singleCard">
      <template #head>
        <el-link :href="linkHomerDetailUrl" target="_blank" v-show="linkHomerDetailUrl">
          <el-button size="small" type="primary"><i class="fas fa-link"></i></el-button>
        </el-link>
      </template>
      <template #default>
        <BaseTabs active="gimme" :tabs-data="TraitTfStrategyData">
          <template #gimme>
            <BaseTable :update-new-data="gimmeTraitTfTableInformation"
                       :is-mounted="gimmeTraitTfIsMounted"
                       :before-column-number="5"
                       :table-description="gimmeTraitTfTableDescription"
                       ref="gimmeTraitTfTable">
              <template #default>
                <el-table-column label="Motif set" stripe align="center">
                  <template #default="scope">
                    <BaseTooltip placement="top" :content="scope.row.motifSet">
                      <span>{{ scope.row.motifSet.length > 10 ? `${scope.row.motifSet.substring(0, 10)}...` : scope.row.motifSet }}</span>
                    </BaseTooltip>
                  </template>
                </el-table-column>
              </template>
            </BaseTable>
          </template>
          <template #homer>
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
        </BaseTabs>
      </template>
    </SingleCard>
    <BaseBr/>
    <SingleCard :title='{ content: `TF regulatory network associated with "${traitName}" and "${sampleLabel}"` }' id="position_tf_network" ref="singleCard">
      <LeftRight>
        <template #left>
          <BaseSelect title="Cell type:" is-line width="40%" :change-event="cellTypeGraphChange" :select-data="cellTypeData" ref="cellTypeGraph"/>
        </template>
        <template #right>
          <BaseSwitch active-text="Core:" inactive-text="All:" :is-inline="false" :change-event="tfCoreChange" ref="tfCoreSwitch"/>
        </template>
      </LeftRight>
      <BaseBr/>
      <LeftRight :is-left-right="isLeftRight" ref="graphLeftRight">
        <template #left>
          <span class="element_title_strategy">Trait-relevant TFs:</span>
          <BaseTabs active="gimme" :change="graphTraitTfStrategyChange" :tabs-data="TraitTfStrategyData">
            <template #gimme>
              <div class="element_info">
                <BaseSelect title="Co-score:" clearable :is-line="true" width="62%" :change-event="cellTypeGraphChange" :select-data="coScoreSelectData" ref="coScore"/>
                <BaseSelect title="Mean score:" clearable :is-line="true" width="62%" :change-event="cellTypeGraphChange" :select-data="meanScoreSelectData" ref="meanScore"/>
                <BaseSelect title="Count:" clearable :is-line="true" width="62%" :change-event="cellTypeGraphChange" :select-data="countSelectData" ref="count"/>
              </div>
            </template>
            <template #homer>
              <div class="element_info">
                <BaseSelect title="P value:" clearable :is-line="true" width="62%" :change-event="cellTypeGraphChange" :select-data="pValueTraitSelectData" ref="pValueTrait"/>
                <BaseSelect title="Q value:" clearable :is-line="true" width="62%" :change-event="cellTypeGraphChange" :select-data="qValueTraitSelectData" ref="qValueTrait"/>
              </div>
            </template>
          </BaseTabs>
        </template>
        <template #right>
          <span class="element_title_strategy">TF (Difference):</span>
          <BaseTabs active="snapatac2" :change="graphTfStrategyChange" :tabs-data="TfStrategyData">
            <template #snapatac2>
              <div class="element_info">
                <BaseSelect title="P value:" clearable :is-line="true" width="62%" :change-event="cellTypeGraphChange" :select-data="pValueSelectData" ref="pValue"/>
                <BaseSelect title="Adjusted p value:" clearable :is-line="true" width="62%" :change-event="cellTypeGraphChange" :select-data="AdjustedPValueSelectData" ref="adjustedPValue"/>
                <BaseSelect title="Log<sub>2</sub>(Fold change):"
                            clearable :is-line="true" width="62%"
                            :change-event="cellTypeGraphChange" :select-data="Log2FoldChangeSelectData" ref="log2FoldChange"/>
              </div>
            </template>
            <template #chromvar>
              <div class="element_info">
                <BaseSelect title="P value:" clearable :is-line="true" width="62%" :change-event="cellTypeGraphChange" :select-data="pValueSelectData" ref="pValueChromvar"/>
                <BaseSelect title="Adjusted p value:" clearable :is-line="true" width="62%" :change-event="cellTypeGraphChange" :select-data="AdjustedPValueSelectData" ref="adjustedPValueChromvar"/>
                <BaseSelect title="Mean:" clearable :is-line="true" width="62%" :change-event="cellTypeGraphChange" :select-data="MeanSelectData" ref="mean"/>
              </div>
            </template>
          </BaseTabs>
        </template>
      </LeftRight>
      <BaseBr/>
      <Echarts :resize-value="graphSize" ref="graphECharts"/>
    </SingleCard>
  </BaseLoading>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue';
import DetailApi from '@/api/service/detailApi';
import {
  ANALYSIS_LOG2_FOLD_CHANGE_SELECT_DATA,
  DATA_ANALYSIS_DIFFERENCE_TF_TABLE_DESCRIPTION,
  DATA_ANALYSIS_SAMPLE_TABLE_DESCRIPTION,
  DATA_ANALYSIS_TRAIT_TABLE_DESCRIPTION,
  DATA_ANALYSIS_TRAIT_TF_TABLE_DESCRIPTION,
  DIFFERENCE_TF_P_VALUE_DATA,
  DIFFERENCE_TF_ADJUSTED_P_VALUE_DATA,
  geneGraphOption,
  HOMER_TF_P_VALUE_DATA,
  HOMER_TF_Q_VALUE_DATA,
  STATIC_DOWNLOAD_PATH,
  STATIC_HOMER_PATH,
  ANALYSIS_TF_STRATEGY_TABS,
  DATA_ANALYSIS_CHROMVAR_DIFFERENCE_TF_TABLE_DESCRIPTION,
  ANALYSIS_MEAN_SELECT_DATA,
  ANALYSIS_TRAIT_TF_STRATEGY_TABS,
  DATA_ANALYSIS_GIMME_TRAIT_TF_TABLE_DESCRIPTION,
  ANALYSIS_CICERO_CO_SCORE_DATA,
  ANALYSIS_MEAN_SCORE_DATA,
  ANALYSIS_TF_COUNT_DATA
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
import BaseTabs from '@/components/tabs/BaseTabs.vue';
import { Page } from '@/service/model/reponse/request';

export default defineComponent({
  name: 'TfInfoAnnotation',
  components: {
    BaseTabs,
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
    },
    metadata: {
      type: String,
      default: () => 'cell_type'
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
    const differenceTfTable = ref();
    const chromvarDifferenceTfTable = ref();
    const traitTfTable = ref();
    const gimmeTraitTfTable = ref();
    const graphECharts = ref();
    const cellType = ref();
    const cellTypeChromvar = ref();
    const tfCoreSwitch = ref();
    const cellTypeGraph = ref();
    const graphLeftRight = ref();
    const log2FoldChange = ref();
    const adjustedPValue = ref();
    const adjustedPValueChromvar = ref();
    const pValue = ref();
    const pValueChromvar = ref();
    const qValueTrait = ref();
    const pValueTrait = ref();
    const coScore = ref();
    const meanScore = ref();
    const count = ref();
    const mean = ref();

    const data = reactive({
      id: NumberUtil.random10(),
      sample: {} as any,
      sampleLabel: '',
      traitLabel: '',
      traitName: '',
      scTfStrategyValue: 'snapatac2',
      traitTfStrategyValue: 'gimme',
      isTfCore: true,
      gimmeTraitTfIsMounted: false,
      clusterId: StringUtil.randomString(10),
      cellTypeData: [] as Array<any>,
      sampleTfData: [] as Array<any>,
      traitTableDataAll: [] as Array<any>,
      traitTableData: [] as Array<any>,
      differenceTfTableData: [] as Array<any>,
      chromvarDifferenceTfTableData: [] as Array<any>,
      traitTfTableData: [] as Array<any>,
      gimmeTraitTfTableData: [] as Array<any>,
      homerTfDownloadUrl: '' as string | undefined,
      linkHomerDetailUrl: '' as string | undefined,
      graphSize: { width: 1100, height: 800 }
    });

    const getCellTypeData = async () => {
      ArrayUtil.clear(data.cellTypeData);
      return DetailApi.listSampleCellTypeTimeSexDrug(props.sampleId, data.id).then((res: any) => {
        (res as Array<any>).forEach((item: any) => {
          data.cellTypeData.push({ label: item.field, value: item.field });
        });
        data.cellTypeData.push({ label: 'All', value: 'All' });
        cellType.value.select = data.cellTypeData[0].value;
        cellTypeChromvar.value.select = data.cellTypeData[0].value;
        cellTypeGraph.value.select = data.cellTypeData[0].value;
      });
    };

    const getParams = () => ({
      log2FoldChange: log2FoldChange.value.select,
      adjustedPValue: data.scTfStrategyValue === 'snapatac2' ? adjustedPValue.value.select : adjustedPValueChromvar.value.select,
      pvalue: data.scTfStrategyValue === 'snapatac2' ? pValue.value.select : pValueChromvar.value.select,
      qvalueTrait: qValueTrait.value.select,
      pvalueTrait: pValueTrait.value.select,
      mean: mean.value.select,
      coScore: coScore.value.select,
      meanScore: meanScore.value.select,
      count: count.value.select,
      scStrategy: data.scTfStrategyValue,
      traitStrategy: data.traitTfStrategyValue
    });

    // Plot the clustering graph for each cell type
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
        data.graphSize = {
          width: graphLeftRight.value.$el.clientWidth,
          height: 800
        };
        graphECharts.value.drawEcharts(geneGraphOption(res));
      });
    };

    const listHomerTfByTraitId = () => {
      traitTfTable.value.startLoading();
      DetailApi.listHomerTfByTraitId(props.traitId, data.sample.genome).then((res: any) => {
        traitTfTable.value.endLoading();
        data.traitTfTableData = res;
      });
    };

    const gimmeTraitTfTableInformation = (page: Page) => DetailApi.listGimmeTfByTraitId(props.sampleId, props.traitId, page);

    const listDifferenceTfBySampleId = () => {
      differenceTfTable.value.startLoading();
      DetailApi.listDifferenceTfBySampleId(props.sampleId, cellType.value.select).then((res: any) => {
        differenceTfTable.value.endLoading();
        data.differenceTfTableData = res;
      });
    };

    const listChromvarDifferenceTfBySampleId = () => {
      chromvarDifferenceTfTable.value.startLoading();
      DetailApi.listChromvarDifferenceTfBySampleId(props.sampleId, cellTypeChromvar.value.select).then((res: any) => {
        chromvarDifferenceTfTable.value.endLoading();
        data.chromvarDifferenceTfTableData = res;
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

    const cellTypeChromvarChange = () => {
      listChromvarDifferenceTfBySampleId();
    };

    const tfCoreChange = (value: boolean) => {
      data.isTfCore = value;
      getGraphData();
    };

    const getSampleInfo = async () => DetailApi.getSampleInfo(props.sampleId).then((res: any) => {
      data.sample = res;
      data.sampleLabel = res.label;
      DetailApi.getVariantTrait(props.traitId).then((res: any) => {
        data.traitLabel = res.traitCode;
        data.traitName = res.traitName;
        homerTfDownload();
        linkHomerDetail();
      });
    });

    const cellTypeGraphChange = () => {
      getGraphData();
    };

    const graphTraitTfStrategyChange = (tag: any) => {
      data.traitTfStrategyValue = tag.paneName;
      getGraphData();
    };

    const graphTfStrategyChange = (tag: any) => {
      data.scTfStrategyValue = tag.paneName;
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

    onMounted(async () => {
      tfCoreSwitch.value.value = true;
      log2FoldChange.value.select = ANALYSIS_LOG2_FOLD_CHANGE_SELECT_DATA[3].value;
      adjustedPValue.value.select = DIFFERENCE_TF_ADJUSTED_P_VALUE_DATA[1].value;
      adjustedPValueChromvar.value.select = DIFFERENCE_TF_ADJUSTED_P_VALUE_DATA[1].value;
      pValue.value.select = DIFFERENCE_TF_P_VALUE_DATA[1].value;
      pValueChromvar.value.select = DIFFERENCE_TF_P_VALUE_DATA[1].value;
      qValueTrait.value.select = HOMER_TF_P_VALUE_DATA[0].value;
      pValueTrait.value.select = HOMER_TF_Q_VALUE_DATA[0].value;
      coScore.value.select = ANALYSIS_CICERO_CO_SCORE_DATA[4].value;
      meanScore.value.select = ANALYSIS_MEAN_SCORE_DATA[6].value;
      mean.value.select = ANALYSIS_MEAN_SELECT_DATA[0].value;
      if (Base.noNull(props.sampleId) && Base.noNull(props.traitId)) {
        await getSampleInfo();
        if (Base.noNull(cellType.value)) {
          await getCellTypeData();
          listDifferenceTfBySampleId();
          listChromvarDifferenceTfBySampleId();
          listHomerTfByTraitId();
          if (!data.gimmeTraitTfIsMounted) {
            data.gimmeTraitTfIsMounted = true;
          } else {
            gimmeTraitTfTable.value.dataUpdate();
          }
          getGraphData();
        }
      }
    });

    // Monitor the sampleId, traitId, and metadata properties
    watch(() => ({ value1: props.sampleId, value2: props.traitId, value3: props.metadata }), async () => {
      if (Base.noNull(props.sampleId) && Base.noNull(props.traitId)) {
        await getSampleInfo();
        if (Base.noNull(cellType.value)) {
          await getCellTypeData();
          listDifferenceTfBySampleId();
          listChromvarDifferenceTfBySampleId();
          listHomerTfByTraitId();
          if (!data.gimmeTraitTfIsMounted) {
            data.gimmeTraitTfIsMounted = true;
          } else {
            gimmeTraitTfTable.value.dataUpdate();
          }
          getGraphData();
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
      differenceTfTable,
      chromvarDifferenceTfTable,
      traitTfTable,
      gimmeTraitTfTable,
      graphECharts,
      cellType,
      cellTypeChromvar,
      tfCoreSwitch,
      cellTypeGraph,
      graphLeftRight,
      log2FoldChange,
      adjustedPValue,
      adjustedPValueChromvar,
      pValue,
      pValueChromvar,
      qValueTrait,
      pValueTrait,
      coScore,
      meanScore,
      count,
      mean,
      differenceTfDownload,
      differenceTfH5adDownload,
      linkHomerDetail,
      cellTypeChange,
      cellTypeChromvarChange,
      gimmeTraitTfTableInformation,
      tfCoreChange,
      cellTypeGraphChange,
      graphTraitTfStrategyChange,
      graphTfStrategyChange,
      topCountGraphChange,
      startLoading,
      endLoading,
      TfStrategyData: ANALYSIS_TF_STRATEGY_TABS,
      TraitTfStrategyData: ANALYSIS_TRAIT_TF_STRATEGY_TABS,
      Log2FoldChangeSelectData: ANALYSIS_LOG2_FOLD_CHANGE_SELECT_DATA,
      MeanSelectData: ANALYSIS_MEAN_SELECT_DATA,
      AdjustedPValueSelectData: DIFFERENCE_TF_ADJUSTED_P_VALUE_DATA,
      pValueSelectData: DIFFERENCE_TF_P_VALUE_DATA,
      pValueTraitSelectData: HOMER_TF_P_VALUE_DATA,
      qValueTraitSelectData: HOMER_TF_Q_VALUE_DATA,
      differenceTfTableDescription: DATA_ANALYSIS_DIFFERENCE_TF_TABLE_DESCRIPTION,
      chromvarDifferenceTfTableDescription: DATA_ANALYSIS_CHROMVAR_DIFFERENCE_TF_TABLE_DESCRIPTION,
      traitTfTableDescription: DATA_ANALYSIS_TRAIT_TF_TABLE_DESCRIPTION,
      coScoreSelectData: ANALYSIS_CICERO_CO_SCORE_DATA,
      meanScoreSelectData: ANALYSIS_MEAN_SCORE_DATA,
      countSelectData: ANALYSIS_TF_COUNT_DATA,
      gimmeTraitTfTableDescription: DATA_ANALYSIS_GIMME_TRAIT_TF_TABLE_DESCRIPTION,
      sampleTableDescription: DATA_ANALYSIS_SAMPLE_TABLE_DESCRIPTION,
      tableDescription: DATA_ANALYSIS_TRAIT_TABLE_DESCRIPTION
    };
  }
});
</script>
