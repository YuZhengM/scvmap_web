<template>
  <div id="analysis_multi_trait">
    <PositionButton :button-content="buttonContent" :top="125"/>
    <BaseBr/>
    <BaseLoading class="analysis_multi_trait" ref="loading">
      <LeftRight :padding="0" ref="leftRight" id="position_enrichment">
        <template #left>
          <TraitHeatMap :sample-id="sampleId" :trait-id-list="traitIdList" :method="methodValue" :strategy="strategyValue" ref="heatMap"/>
        </template>
        <template #right>
          <div class="select_content">
            <span class="label_title">{{ sampleId }}: {{ sample.label }}</span>
            <el-button @click="sampleIdClick">Description</el-button>
            <BaseBr/>
            <LeftRight>
              <template #left>
                <BaseSelect title="Method: " :select-data="methodData" :change-event="methodEvent" width="60%" is-line ref="method"/>
              </template>
              <template #right>
                <BaseSelect title="Strategy: " :select-data="strategyData" :change-event="strategyEvent" width="60%" is-line ref="strategy"/>
              </template>
            </LeftRight>
            <BaseBr/>
            <MultiSelectInput title="Trait: " is-description is-line :change-event="traitEvent" width="92.6%" :select-data="traitData" ref="trait"/>
          </div>
          <BaseBr/>
          <Br/>
          <Br/>
          <BaseTable :table-data="traitTableData" :is-service-paging="false" :page-sizes="[5, 10, 25, 45, 50, 75, 100]"
                     is-selection :selection-change="selectionChange" :is-select-change="isSelectChange"
                     :table-description="tableDescription" ref="traitTable"/>
        </template>
      </LeftRight>
      <BaseBr/>
      <SingleCard :title='{ content: `The "${traitId}"-relevant score in "${sampleId}" data` }' id="position_cell" ref="singleCard">
        <ClusterAnnotationWithButton :trait-id="traitId" :sample-id="sampleId" ref="clusterAnno"/>
      </SingleCard>
      <BaseBr/>
      <GeneInfoAnnotation :sample-id="sampleId" :trait-id="traitId" ref="geneInfoAnno"/>
      <BaseBr/>
      <TfInfoAnnotation :sample-id="sampleId" :trait-id="traitId" ref="tfInfoAnno"/>
      <BaseDrawer title="Sample Information" size="35%" ref="drawer">
        <table class=" table table-hover table-striped">
          <thead></thead>
          <tbody>
          <tr v-for="(item, i) in tableData" :key="i">
            <th v-text="item.key"></th>
            <td v-html="item.value"></td>
          </tr>
          </tbody>
        </table>
      </BaseDrawer>
      <br/>
    </BaseLoading>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LeftRight from '@/components/layout/LeftRight.vue';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import BaseDrawer from '@/components/drawer/BaseDrawer.vue';
import TraitHeatMap from '@/views/analysisResult/common/TraitHeatMap.vue';
import BaseSelect from '@/components/input/BaseSelect.vue';
import BaseBr from '@/components/divider/BaseBr.vue';
import MultiSelectInput from '@/components/input/MultiSelectInput.vue';
import BaseTable from '@/components/table/BaseTable.vue';
import ClusterAnnotationWithButton from '@/views/detail/common/ClusterAnnotationWithButton.vue';
import { ElNotification } from 'element-plus';
import SingleCard from '@/components/card/SingleCard.vue';
import GeneInfoAnnotation from '@/views/detail/common/GeneInfoAnnotation.vue';
import TfInfoAnnotation from '@/views/detail/common/TfInfoAnnotation.vue';
import PositionButton from '@/components/button/PositionButton.vue';
import {
  ANALYSIS_MULTI_TRAIT_BUTTON_POSITION_DATA,
  ANALYSIS_STRATEGY_DATA,
  DATA_ANALYSIS_TRAIT_TABLE_DESCRIPTION,
  DETAIL_METHOD_DATA,
  getSampleArrayTable
} from '@/assets/ts';
import '@/assets/less/views/analysisResult/AnalysisResult.less';
import Base from '@/service/util/base/base';
import Jump from '@/service/util/base/jump';
import Time from '@/service/util/base/time';
import DetailApi from '@/api/service/detailApi';
import ArrayUtil from '@/service/util/base/array';
import AnalysisApi from '@/api/service/analysisApi';
import { KeyValue } from '@/service/model/data';
import { InputSelect } from '@/service/model/components/input';

export default defineComponent({
  name: 'AnalysisMultiTrait',
  components: {
    PositionButton,
    TfInfoAnnotation,
    GeneInfoAnnotation,
    SingleCard,
    ClusterAnnotationWithButton,
    BaseTable,
    MultiSelectInput,
    BaseBr,
    BaseSelect,
    TraitHeatMap,
    BaseDrawer,
    BaseLoading,
    LeftRight
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const loading = ref();
    const leftRight = ref();
    const heatMap = ref();
    const method = ref();
    const strategy = ref();
    const trait = ref();
    const traitTable = ref();
    const clusterAnno = ref();
    const geneInfoAnno = ref();
    const tfInfoAnno = ref();
    const drawer = ref();
    const data = reactive({
      traitId: '' as string,
      sampleId: route.query.sampleId as string,
      traitTableData: [] as Array<any>,
      tableData: [] as Array<KeyValue>,
      traitIdList: [] as Array<string>,
      sample: {} as any,
      isSelectChange: true as boolean,
      traitData: [] as Array<InputSelect>,
      desTraitData: [] as Array<InputSelect>,
      methodValue: DETAIL_METHOD_DATA[0].value as string,
      strategyValue: ANALYSIS_STRATEGY_DATA[0].value as string
    });

    const getSampleInfo = () => {
      loading.value.loading = true;
      DetailApi.getSampleInfo(data.sampleId).then((res: any) => {
        data.sample = res;
        getSampleArrayTable(data.tableData, res, true);
      });
    };

    const selectionChange = (val: any) => {
      if (val.length > 1) {
        data.isSelectChange = false;
        traitTable.value.selectionToggleChange(val.slice(0, val.length - 1));
        data.isSelectChange = true;
      } else if (val.length === 1) {
        data.traitId = val[0].traitId;
      }
    };

    const listTrait = () => {
      // 清空
      ArrayUtil.clear(data.traitData);
      clusterAnno.value.startLoading();
      geneInfoAnno.value.startLoading();
      tfInfoAnno.value.startLoading();
      AnalysisApi.listTraitBySampleId(data.sampleId).then((res: any) => {
        loading.value.loading = false;
        data.desTraitData = res;
        data.desTraitData.forEach((item: any) => {
          // 添加 SelectInput 数据
          data.traitData.push({ label: item.traitAbbr, value: item.traitId, description: `${item.trait}-(${item.traitId}) (${item.sourceName})`, id: item.traitId });
        });
        trait.value.setShowData(data.traitData);
        data.traitTableData = data.desTraitData.filter((item: any) => data.traitIdList.indexOf(item.traitId) > -1);
        trait.value.input = data.traitIdList;
        trait.value.input = data.traitTableData.map((item: any) => item.traitAbbr);
        data.traitId = data.traitTableData[0].traitId;
        Time.delay(() => {
          clusterAnno.value.endLoading();
          geneInfoAnno.value.endLoading();
          tfInfoAnno.value.endLoading();
          traitTable.value.selectionToggleChange([data.traitTableData[0]]);
        });
      });
    };

    const sampleIdClick = () => {
      drawer.value.drawer = true;
    };

    const methodEvent = () => {
      data.methodValue = method.value.select;
    };

    const strategyEvent = () => {
      data.strategyValue = strategy.value.select;
    };

    const checkTrait = (traitIdParam: any): string[] => {
      // If the input parameter is a string, convert it to an array
      const initialList = typeof traitIdParam === 'string' ? [traitIdParam] : Base.isArray(traitIdParam) ? traitIdParam : [];

      const traitIdList: string[] = [...initialList];

      // If the list contains fewer than 2 elements, add a default trait ID
      if (traitIdList.length < 2) {
        const traitTmp = initialList[0] !== 'trait_id_1' ? 'trait_id_1' : 'trait_id_2';
        ElNotification({
          title: 'Trait count',
          message: `A heatmap display requires at least two trait elements, and "${traitTmp}" is added by default.`,
          type: 'info'
        });
        traitIdList.push(traitTmp);
      }

      return traitIdList;
    };

    const traitEvent = () => {
      trait.value.input = checkTrait(trait.value.input);
      const traitIdList = trait.value.input.filter((item: string) => item.startsWith('trait_id'));
      const traitCodeList = trait.value.input.filter((item: string) => !item.startsWith('trait_id'));
      const traitIdList2 = data.traitData.filter((item: any) => traitCodeList.indexOf(item.label) > -1).map((item: any) => item.value);
      data.traitIdList = [...traitIdList, ...traitIdList2];
      data.traitTableData = data.desTraitData.filter((item: any) => data.traitIdList.indexOf(item.traitId) > -1);
      Time.delay(() => {
        traitTable.value.selectionToggleChange([data.traitTableData[0]]);
      });
    };

    onMounted(() => {
      if (Base.isNull(route.query.sampleId) || Base.isNull(route.query.traitIdList)) {
        Jump.routerDefault(router, '/');
        ElNotification({
          title: 'Please check',
          message: `${route.fullPath}: The path is not feasible!`,
          type: 'error'
        });
      }
      method.value.select = DETAIL_METHOD_DATA[0].value;
      strategy.value.select = ANALYSIS_STRATEGY_DATA[0].value as string;
      getSampleInfo();
      listTrait();
      data.traitIdList = checkTrait(route.query.traitIdList);
    });
    return {
      ...toRefs(data),
      loading,
      heatMap,
      leftRight,
      method,
      strategy,
      trait,
      traitTable,
      clusterAnno,
      geneInfoAnno,
      tfInfoAnno,
      drawer,
      sampleIdClick,
      methodEvent,
      strategyEvent,
      traitEvent,
      selectionChange,
      buttonContent: ANALYSIS_MULTI_TRAIT_BUTTON_POSITION_DATA,
      methodData: DETAIL_METHOD_DATA,
      strategyData: ANALYSIS_STRATEGY_DATA,
      tableDescription: DATA_ANALYSIS_TRAIT_TABLE_DESCRIPTION
    };
  }
});
</script>
