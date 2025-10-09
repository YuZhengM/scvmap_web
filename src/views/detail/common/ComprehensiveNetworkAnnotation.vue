<template>
  <BaseLoading id="comprehensive_network_annotation" ref="loading">
    <SingleCard :title='{ content: `Integrated regulatory network associated with "${traitName}" and "${sampleLabel}"` }' id="position_comprehensive_network" ref="singleCard">
      <LeftRight>
        <template #left>
          <BaseSelect title="Cell type:" is-line width="40%" :change-event="cellTypeGraphChange" :select-data="cellTypeData" ref="cellTypeGraph"/>
        </template>
        <template #right>
          <BaseSwitch active-text="Coordinates:" inactive-text="Force:" :is-inline="false" :change-event="layoutChange" ref="layoutSwitch"/>
        </template>
      </LeftRight>
      <BaseBr/>
      <LeftRight :is-left-right="isLeftRight" ref="graphTfLeftRight">
        <template #left>
          <span class="element_title_strategy">TF (GimmeMotifs):</span>
          <BaseTabs active="gimme" :tabs-data="[{ name: 'gimme', title: 'GimmeMotifs' }]">
            <template #gimme></template>
          </BaseTabs>
          <div class="element_info">
            <BaseSelect title="Co-score:" clearable :is-line="true" width="62%" :change-event="cellTypeGraphChange" :select-data="coScoreSelectData" ref="gimmeTfCoScore"/>
            <BaseSelect title="Mean score:" clearable :is-line="true" width="62%" :change-event="cellTypeGraphChange" :select-data="meanScoreSelectData" ref="gimmeTfMeanScore"/>
            <BaseSelect title="Count:" clearable :is-line="true" width="62%" :change-event="cellTypeGraphChange" :select-data="countSelectData" ref="gimmeTfCount"/>
          </div>
        </template>
        <template #right>
          <span class="element_title_strategy">TF (Difference):</span>
          <BaseTabs active="snapatac2" :change="graphTfStrategyChange" :tabs-data="TfStrategyData">
            <template #snapatac2>
              <div class="element_info">
                <BaseSelect title="P value:" clearable :is-line="true" width="62%" :change-event="cellTypeGraphChange" :select-data="pValueSelectData" ref="snapatac2TfPValue"/>
                <BaseSelect title="Adjusted p value:"
                            clearable :is-line="true" width="62%"
                            :change-event="cellTypeGraphChange" :select-data="AdjustedPValueSelectData" ref="snapatac2TfAdjustedPValue"/>
                <BaseSelect title="Log<sub>2</sub>(Fold change):"
                            clearable :is-line="true" width="62%"
                            :change-event="cellTypeGraphChange" :select-data="Log2FoldChangeSelectData" ref="snapatac2TfLog2FoldChange"/>
              </div>
            </template>
            <template #chromvar>
              <div class="element_info">
                <BaseSelect title="P value:" clearable :is-line="true" width="62%" :change-event="cellTypeGraphChange" :select-data="pValueSelectData" ref="chromvarTfPValue"/>
                <BaseSelect title="Adjusted p value:" clearable :is-line="true" width="62%" :change-event="cellTypeGraphChange" :select-data="AdjustedPValueSelectData" ref="chromvarTfAdjustedPValue"/>
                <BaseSelect title="Mean:" clearable :is-line="true" width="62%" :change-event="cellTypeGraphChange" :select-data="MeanSelectData" ref="chromvarTfMean"/>
              </div>
            </template>
          </BaseTabs>
        </template>
      </LeftRight>
      <BaseBr/>
      <LeftRight :is-left-right="isLeftRight" ref="graphGeneLeftRight">
        <template #left>
          <span class="element_title_strategy">Gene ({{ networkTraitGeneStrategy === 'cicero' ? 'Cicero' : (networkTraitGeneStrategy === 'magma' ? 'MAGMA' : 'Overlap') }}):</span>
          <BaseTabs active="magma" :change="networkTraitGeneStrategyChange" :tabs-data="GeneStrategyData">
            <template #magma></template>
            <template #cicero></template>
            <template #overlap></template>
          </BaseTabs>
          <div class="element_info">
            <div v-show="networkTraitGeneStrategy === 'magma' || networkTraitGeneStrategy === 'overlap'">
              <BaseInput class="trait_number"
                         title="Number of SNPs:"
                         type="number"
                         :min="0"
                         :width="200"
                         description="The minimum number of SNPs annotated onto a gene"
                         is-line
                         ref="geneTraitMin"/>
              <el-button @click="cellTypeGraphChange"> Analysis</el-button>
            </div>
            <BaseSelect title="P value:"
                        clearable
                        :is-line="true"
                        width="62%"
                        :change-event="cellTypeGraphChange"
                        :select-data="pValueTraitSelectData"
                        ref="geneTraitPValue"
                        v-show="networkTraitGeneStrategy === 'magma' || networkTraitGeneStrategy === 'overlap'"/>
            <BaseSelect title="Co-score:"
                        clearable
                        :is-line="true"
                        width="62%"
                        :change-event="cellTypeGraphChange"
                        :select-data="coScoreSelectData"
                        ref="geneTraitCoScore"
                        v-show="networkTraitGeneStrategy === 'cicero' || networkTraitGeneStrategy === 'overlap'"/>
          </div>
        </template>
        <template #right>
          <span class="element_title_strategy">Gene (Difference):</span>
          <BaseTabs active="sanpatac2" :tabs-data="[{ name: 'sanpatac2', title: 'SnapATAC2' }]"/>
          <div class="element_info">
            <BaseSelect title="Score:" clearable :is-line="true" width="62%" :change-event="cellTypeGraphChange" :select-data="scoreSelectData" ref="snapatac2GeneScore"/>
            <BaseSelect title="P value:" clearable :is-line="true" width="62%" :change-event="cellTypeGraphChange" :select-data="pValueSelectData" ref="snapatac2GenePValue"/>
            <BaseSelect title="Adjusted p value:" clearable :is-line="true" width="62%" :change-event="cellTypeGraphChange" :select-data="AdjustedPValueSelectData" ref="snapatac2GeneAdjustedPValue"/>
            <BaseSelect title="Log<sub>2</sub>(Fold change):"
                        clearable :is-line="true" width="62%"
                        :change-event="cellTypeGraphChange" :select-data="Log2FoldChangeSelectData" ref="snapatac2GeneLog2FoldChange"/>
          </div>
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
  DIFFERENCE_TF_P_VALUE_DATA,
  DIFFERENCE_TF_ADJUSTED_P_VALUE_DATA,
  geneGraphOption,
  ANALYSIS_TF_STRATEGY_TABS,
  ANALYSIS_MEAN_SELECT_DATA,
  ANALYSIS_TRAIT_TF_STRATEGY_TABS,
  ANALYSIS_CICERO_CO_SCORE_DATA,
  ANALYSIS_MEAN_SCORE_DATA,
  ANALYSIS_GENE_STRATEGY_TABS,
  MAGMA_GENE_P_VALUE_DATA,
  ANALYSIS_TF_COUNT_DATA,
  DIFFERENCE_GENE_ADJUSTED_P_VALUE_DATA,
  DIFFERENCE_GENE_P_VALUE_DATA,
  ANALYSIS_GENE_SCORE_DATA
} from '@/assets/ts';
import StringUtil from '@/service/util/base/string';
import Base from '@/service/util/base/base';
import SingleCard from '@/components/card/SingleCard.vue';
import BaseSelect from '@/components/input/BaseSelect.vue';
import BaseBr from '@/components/divider/BaseBr.vue';
import Echarts from '@/components/echarts/Echarts.vue';
import ArrayUtil from '@/service/util/base/array';
import AnalysisApi from '@/api/service/analysisApi';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import NumberUtil from '@/service/util/base/number';
import LeftRight from '@/components/layout/LeftRight.vue';
import '@/assets/less/views/detail/ElementInfoAnnotation.less';
import BaseTabs from '@/components/tabs/BaseTabs.vue';
import BaseInput from '@/components/input/BaseInput.vue';
import BaseSwitch from '@/components/switch/BaseSwitch.vue';

export default defineComponent({
  name: 'ComprehensiveNetworkAnnotation',
  components: {
    BaseSwitch,
    BaseInput,
    BaseTabs,
    LeftRight,
    BaseLoading,
    Echarts,
    BaseBr,
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

    const cellTypeGraph = ref();
    const graphTfLeftRight = ref();
    const gimmeTfCoScore = ref();
    const gimmeTfMeanScore = ref();
    const gimmeTfCount = ref();
    const snapatac2TfPValue = ref();
    const snapatac2TfAdjustedPValue = ref();
    const snapatac2TfLog2FoldChange = ref();
    const chromvarTfPValue = ref();
    const chromvarTfAdjustedPValue = ref();
    const chromvarTfMean = ref();
    const geneTraitMin = ref();
    const geneTraitPValue = ref();
    const geneTraitCoScore = ref();
    const snapatac2GeneScore = ref();
    const snapatac2GenePValue = ref();
    const snapatac2GeneAdjustedPValue = ref();
    const snapatac2GeneLog2FoldChange = ref();
    const graphECharts = ref();
    const layoutSwitch = ref();

    const data = reactive({
      id: NumberUtil.random10(),
      sample: {} as any,
      graphResult: {} as any,
      sampleLabel: '',
      traitLabel: '',
      traitName: '',
      isLayoutCoordinates: true,
      scTfStrategyValue: 'snapatac2',
      traitTfStrategyValue: 'gimme',
      traitGeneStrategy: 'magma',
      networkTraitGeneStrategy: 'magma',
      clusterId: StringUtil.randomString(10),
      cellTypeData: [] as Array<any>,
      graphSize: { width: 1100, height: 800 }
    });

    const getCellTypeData = async () => {
      ArrayUtil.clear(data.cellTypeData);
      return DetailApi.listSampleCellTypeTimeSexDrug(props.sampleId, data.id).then((res: any) => {
        (res as Array<any>).forEach((item: any) => {
          data.cellTypeData.push({ label: item.field, value: item.field });
        });
        data.cellTypeData.push({ label: 'All', value: 'All' });
        cellTypeGraph.value.select = data.cellTypeData[0].value;
      });
    };

    const getGeneParams = () => ({
      log2FoldChange: snapatac2GeneLog2FoldChange.value.select,
      adjustedPValue: snapatac2GeneAdjustedPValue.value.select,
      pvalue: snapatac2GenePValue.value.select,
      strategy: data.networkTraitGeneStrategy,
      coScore: geneTraitCoScore.value.select,
      score: snapatac2GeneScore.value.select,
      min: geneTraitMin.value.input,
      pvalueTrait: geneTraitPValue.value.select
    });

    const getTFParams = () => ({
      log2FoldChange: snapatac2TfLog2FoldChange.value.select,
      adjustedPValue: data.scTfStrategyValue === 'snapatac2' ? snapatac2TfAdjustedPValue.value.select : chromvarTfAdjustedPValue.value.select,
      pvalue: data.scTfStrategyValue === 'snapatac2' ? snapatac2TfPValue.value.select : chromvarTfPValue.value.select,
      mean: chromvarTfMean.value.select,
      coScore: gimmeTfCoScore.value.select,
      meanScore: gimmeTfMeanScore.value.select,
      count: gimmeTfCount.value.select,
      scStrategy: data.scTfStrategyValue,
      traitStrategy: data.traitTfStrategyValue
    });

    const drawGraphEcharts = () => {
      const graphResultCopy = {
        ...data.graphResult,
        nodes: data.graphResult.nodes.map((node: any) => ({
          ...node,
          symbolSize: node.symbolSize / (data.isLayoutCoordinates ? 1.2 : 2)
        }))
      };
      graphECharts.value.drawEcharts(geneGraphOption(graphResultCopy, data.isLayoutCoordinates ? 'none' : 'force'));
    };

    // Draw the clustering graph for each cell type
    const getGraphData = () => {
      graphECharts.value.startLoading();
      AnalysisApi.getTfGeneGraphData({
        sampleId: props.sampleId,
        traitId: props.traitId,
        cellType: cellTypeGraph.value.select,
        analysisTf: getTFParams(),
        analysisGene: getGeneParams(),
        isCore: true
      }).then((res: any) => {
        graphECharts.value.endLoading();
        data.graphResult = res;
        // echarts
        data.graphSize = {
          width: graphTfLeftRight.value.$el.clientWidth,
          height: 800
        };
        drawGraphEcharts();
      });
    };

    const getSampleInfo = async () => DetailApi.getSampleInfo(props.sampleId).then((res: any) => {
      data.sample = res;
      data.sampleLabel = res.label;
      DetailApi.getVariantTrait(props.traitId).then((res: any) => {
        data.traitLabel = res.traitCode;
        data.traitName = res.traitName;
      });
    });

    const cellTypeGraphChange = () => {
      getGraphData();
    };

    const layoutChange = (value: boolean) => {
      data.isLayoutCoordinates = value;
      drawGraphEcharts();
    };

    const graphTraitTfStrategyChange = (tag: any) => {
      data.traitTfStrategyValue = tag.paneName;
      getGraphData();
    };

    const graphTfStrategyChange = (tag: any) => {
      data.scTfStrategyValue = tag.paneName;
      getGraphData();
    };

    const networkTraitGeneStrategyChange = (tag: any) => {
      data.networkTraitGeneStrategy = tag.paneName;
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
      snapatac2GeneScore.value.select = ANALYSIS_GENE_SCORE_DATA[2].value;
      snapatac2GeneLog2FoldChange.value.select = ANALYSIS_LOG2_FOLD_CHANGE_SELECT_DATA[8].value;
      snapatac2GeneAdjustedPValue.value.select = DIFFERENCE_GENE_ADJUSTED_P_VALUE_DATA[20].value;
      snapatac2GenePValue.value.select = DIFFERENCE_GENE_P_VALUE_DATA[20].value;
      snapatac2TfLog2FoldChange.value.select = ANALYSIS_LOG2_FOLD_CHANGE_SELECT_DATA[3].value;
      snapatac2TfAdjustedPValue.value.select = DIFFERENCE_TF_ADJUSTED_P_VALUE_DATA[6].value;
      snapatac2TfPValue.value.select = DIFFERENCE_TF_P_VALUE_DATA[6].value;
      chromvarTfAdjustedPValue.value.select = DIFFERENCE_TF_ADJUSTED_P_VALUE_DATA[1].value;
      chromvarTfPValue.value.select = DIFFERENCE_TF_P_VALUE_DATA[1].value;
      chromvarTfMean.value.select = ANALYSIS_MEAN_SELECT_DATA[1].value;
      geneTraitPValue.value.select = MAGMA_GENE_P_VALUE_DATA[8].value;
      geneTraitCoScore.value.select = ANALYSIS_CICERO_CO_SCORE_DATA[4].value;
      geneTraitMin.value.input = 1;
      gimmeTfCoScore.value.select = ANALYSIS_CICERO_CO_SCORE_DATA[4].value;
      gimmeTfMeanScore.value.select = ANALYSIS_MEAN_SCORE_DATA[6].value;
      gimmeTfCount.value.select = ANALYSIS_TF_COUNT_DATA[2].value;

      if (Base.noNull(props.sampleId) && Base.noNull(props.traitId)) {
        await getSampleInfo();
        if (Base.noNull(cellTypeGraph.value)) {
          await getCellTypeData();
          getGraphData();
        }
      }
    });

    // Monitor props changes
    watch(() => ({ value1: props.sampleId, value2: props.traitId }), async () => {
      if (Base.noNull(props.sampleId) && Base.noNull(props.traitId)) {
        await getSampleInfo();
        if (Base.noNull(cellTypeGraph.value)) {
          await getCellTypeData();
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
      cellTypeGraph,
      graphTfLeftRight,
      gimmeTfCoScore,
      gimmeTfMeanScore,
      gimmeTfCount,
      snapatac2TfPValue,
      snapatac2TfAdjustedPValue,
      snapatac2TfLog2FoldChange,
      chromvarTfPValue,
      chromvarTfAdjustedPValue,
      chromvarTfMean,
      geneTraitMin,
      geneTraitPValue,
      geneTraitCoScore,
      snapatac2GeneScore,
      snapatac2GenePValue,
      snapatac2GeneAdjustedPValue,
      snapatac2GeneLog2FoldChange,
      graphECharts,
      layoutSwitch,
      cellTypeGraphChange,
      layoutChange,
      graphTraitTfStrategyChange,
      graphTfStrategyChange,
      networkTraitGeneStrategyChange,
      topCountGraphChange,
      startLoading,
      endLoading,
      GeneStrategyData: ANALYSIS_GENE_STRATEGY_TABS,
      TfStrategyData: ANALYSIS_TF_STRATEGY_TABS,
      TraitTfStrategyData: ANALYSIS_TRAIT_TF_STRATEGY_TABS,
      Log2FoldChangeSelectData: ANALYSIS_LOG2_FOLD_CHANGE_SELECT_DATA,
      MeanSelectData: ANALYSIS_MEAN_SELECT_DATA,
      pValueTraitSelectData: MAGMA_GENE_P_VALUE_DATA,
      AdjustedPValueSelectData: DIFFERENCE_TF_ADJUSTED_P_VALUE_DATA,
      pValueSelectData: DIFFERENCE_GENE_P_VALUE_DATA,
      scoreSelectData: ANALYSIS_GENE_SCORE_DATA,
      coScoreSelectData: ANALYSIS_CICERO_CO_SCORE_DATA,
      meanScoreSelectData: ANALYSIS_MEAN_SCORE_DATA,
      countSelectData: ANALYSIS_TF_COUNT_DATA
    };
  }
});
</script>
