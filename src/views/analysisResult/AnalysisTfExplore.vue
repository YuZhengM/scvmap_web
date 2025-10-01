<template>
  <div id="analysis_tf_explore">
    <PositionButton :button-content="buttonContent" :top="125"/>
    <BaseBr />
    <BaseLoading class="analysis_gene_explore" ref="loading">
      <SingleCard :title="{ content: `scATAC-seq and trait or disease data information` }" id="position_information" ref="singleCard">
        <LeftRight>
          <template #left>
            <BaseTable :table-data="sampleTableData"
                       :is-service-paging="false"
                       :table-description="sampleTableDescription"
                       :page-sizes="[7, 10, 15, 25, 30, 40, 50, 100]"
                       layout="total, prev, pager, next"
                       :page-event="samplePageEvent"
                       is-selection
                       :selection-change="sampleSelectionChange"
                       :is-select-change="sampleIsSelectChange"
                       ref="sampleTable"/>
          </template>
          <template #right>
            <BaseSelect title="MetaData:" is-line :change-event="metaDataChange" :select-data="metaDataData" ref="metaData"/>
            <BaseTable :table-data="traitTableData"
                       :is-service-paging="false"
                       :table-description="tableDescription"
                       :page-sizes="[5, 10, 15, 25, 30, 40, 50, 100]"
                       layout="total, prev, pager, next"
                       :page-event="traitPageEvent"
                       is-selection
                       :selection-change="traitSelectionChange"
                       :is-select-change="traitIsSelectChange"
                       ref="traitTable" v-show="isEn"/>
            <BaseTable :table-data="traitTableDataNoEn"
                       :is-service-paging="false"
                       :table-description="tableDescription"
                       :page-sizes="[5, 10, 15, 25, 30, 40, 50, 100]"
                       layout="total, prev, pager, next"
                       :page-event="traitPageEvent"
                       v-show="!isEn"/>
          </template>
        </LeftRight>
      </SingleCard>
      <BaseBr/>
      <SingleCard :title='{ content: `The "${traitLabel}"-relevant score in "${sampleLabel}" data` }' id="position_cell" v-show="!isDataEmpty">
        <ClusterAnnotationWithButton :trait-id="traitId" :sample-id="sampleId" ref="clusterAnno"/>
      </SingleCard>
      <BaseBr/>
      <TfInfoAnnotation :sample-id="sampleId" :trait-id="traitId" ref="tfInfoAnno" v-show="!isDataEmpty"/>
      <BaseBr/>
      <ComprehensiveNetworkAnnotation :sample-id="sampleId" :trait-id="traitId" v-show="!isDataEmpty"/>
      <SingleCard :title='{ content: "Empty data" }' id="position_cell" v-show="isDataEmpty">
        <div>There are no single-cell samples or trait data related to the input TFs.</div>
      </SingleCard>
    </BaseLoading>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Base from '@/service/util/base/base';
import Jump from '@/service/util/base/jump';
import '@/assets/less/views/analysisResult/AnalysisResult.less';
import {
  ANALYSIS_META_DATA_DATA,
  ANALYSIS_TF_BUTTON_POSITION_DATA,
  DATA_ANALYSIS_SAMPLE_TABLE_DESCRIPTION,
  DATA_ANALYSIS_TRAIT_TABLE_DESCRIPTION,
  DETAIL_METHOD_DATA
} from '@/assets/ts';
import BaseBr from '@/components/divider/BaseBr.vue';
import BaseTable from '@/components/table/BaseTable.vue';
import { ElNotification } from 'element-plus';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import AnalysisApi from '@/api/service/analysisApi';
import LeftRight from '@/components/layout/LeftRight.vue';
import Time from '@/service/util/base/time';
import ClusterAnnotationWithButton from '@/views/detail/common/ClusterAnnotationWithButton.vue';
import SingleCard from '@/components/card/SingleCard.vue';
import BaseSelect from '@/components/input/BaseSelect.vue';
import PositionButton from '@/components/button/PositionButton.vue';
import TfInfoAnnotation from '@/views/detail/common/TfInfoAnnotation.vue';
import ComprehensiveNetworkAnnotation from '@/views/detail/common/ComprehensiveNetworkAnnotation.vue';

export default defineComponent({
  name: 'AnalysisTfExplore',
  components: {
    ComprehensiveNetworkAnnotation,
    TfInfoAnnotation,
    PositionButton,
    BaseSelect,
    SingleCard,
    ClusterAnnotationWithButton,
    LeftRight,
    BaseLoading,
    BaseTable,
    BaseBr
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const loading = ref();
    const metaData = ref();
    const sampleTable = ref();
    const traitTable = ref();
    const clusterAnno = ref();
    const tfInfoAnno = ref();
    const data = reactive({
      sampleId: '' as string,
      sampleLabel: '' as string,
      traitId: '' as string,
      traitLabel: '' as string,
      traitIdListAll: [] as any,
      isEn: true as boolean,
      isDataEmpty: false as boolean,
      sampleIsSelectChange: true as boolean,
      traitIsSelectChange: true as boolean,
      sample: {} as any,
      sampleTableData: [] as Array<any>,
      traitTableDataAll: [] as Array<any>,
      traitTableData: [] as Array<any>,
      traitTableDataNoEn: [] as Array<any>,
      traitTfTableDataAll: [] as Array<any>,
      traitTfTableData: [] as Array<any>
    });

    // Get query parameters from the URL
    const getParams = () => ({
      log2FoldChange: Number(route.query.log2FoldChange),
      adjustedPValue: Number(route.query.adjustedPValue),
      pvalue: Number(route.query.pvalue),
      qvalueTrait: Number(route.query.qvalueTrait),
      pvalueTrait: Number(route.query.pvalueTrait),
      mean: Number(route.query.chromvarMean),
      coScore: Number(route.query.coScore),
      meanScore: Number(route.query.meanScore),
      scStrategy: route.query.scStrategy,
      traitStrategy: route.query.traitStrategy,
      content: route.query.content,
      fileId: route.query.fileId,
      strategy: route.query.strategy,
      isFile: Number(route.query.isFile)
    });

    const getEnrichedTraitIdList = () => {
      traitTable.value.startLoading();
      AnalysisApi.listTraitBySampleIdAndTraitIdList(data.sampleId, data.traitIdListAll).then((res: any) => {
        const traitIdList = res.map((item: any) => item.traitId);
        traitTable.value.endLoading();
        clusterAnno.value.endLoading();
        tfInfoAnno.value.endLoading();
        data.traitTableData = data.traitTableDataAll.filter((item: any) => traitIdList.indexOf(item.traitId) > -1);
        data.traitTableDataNoEn = data.traitTableDataAll.filter((item: any) => traitIdList.indexOf(item.traitId) < 0);
        Time.delay(() => {
          traitTable.value.selectionToggleChange([data.traitTableData[0]]);
          data.traitId = data.traitTableData[0].traitId;
          data.traitLabel = data.traitTableData[0].traitCode;
        }, 1000);
      });
    };

    const metaDataChange = () => {
      data.isEn = metaData.value.select === 'enrichment';
    };

    const listDataByTfs = () => {
      sampleTable.value.startLoading();
      traitTable.value.startLoading();
      clusterAnno.value.startLoading();
      tfInfoAnno.value.startLoading();
      AnalysisApi.listDataByTfs(getParams()).then((res: any) => {
        sampleTable.value.endLoading();

        if (Base.isNull(res.sampleList) || Base.isNull(res.traitList)) {
          Jump.routerDefault(router, '/analysis');
          ElNotification({
            title: 'Information:',
            message: 'The input TF list is too limited or the threshold setting is strict, with no enriched traits or significant differentially expressed genes in the sample.',
            type: 'success'
          });
        }

        data.sampleTableData = res.sampleList;
        data.traitTableDataAll = res.traitList;
        data.isDataEmpty = data.sampleTableData.length === 0 || data.traitTableDataAll.length === 0;

        if (data.isDataEmpty) {
          traitTable.value.endLoading();
          clusterAnno.value.endLoading();
          tfInfoAnno.value.endLoading();
        } else {
          data.traitIdListAll = [...new Set(data.traitTableDataAll.map((item: any) => item.traitId))];
          data.sampleId = data.sampleTableData[0].sampleId;
          data.sampleLabel = data.sampleTableData[0].label;
          Time.delay(() => {
            sampleTable.value.selectionToggleChange([data.sampleTableData[0]]);
            // getEnrichedTraitIdList();
          }, 600);
        }
      });
    };

    const samplePageEvent = () => {
      const sampleShowData = sampleTable.value.showData.filter((item: any) => item.sampleId === data.sampleId);
      if (Base.noNull(sampleShowData)) {
        Time.delay(() => {
          sampleTable.value.selectionToggleChange(sampleShowData);
        }, 300);
      }
    };

    const sampleSelectionChange = (val: any) => {
      if (!data.isDataEmpty) {
        if (val.length > 1) {
          data.sampleIsSelectChange = false;
          sampleTable.value.selectionToggleChange(val.slice(0, val.length - 1));
          data.sampleIsSelectChange = true;
        } else if (val.length === 1) {
          data.sampleId = val[0].sampleId;
          data.sampleLabel = val[0].label;
        }
        getEnrichedTraitIdList();
      }
    };

    const traitPageEvent = () => {
      const traitShowData = traitTable.value.showData.filter((item: any) => item.traitId === data.traitId);
      if (Base.noNull(traitShowData)) {
        Time.delay(() => {
          traitTable.value.selectionToggleChange(traitShowData);
        }, 300);
      }
    };

    const traitSelectionChange = (val: any) => {
      if (val.length > 1) {
        data.traitIsSelectChange = false;
        traitTable.value.selectionToggleChange(val.slice(0, val.length - 1));
        data.traitIsSelectChange = true;
      } else if (val.length === 1) {
        data.traitId = val[0].traitId;
        data.traitLabel = val[0].traitCode;
      }
    };

    onMounted(() => {
      if ((Base.isNull(route.query.content) && Base.isNull(route.query.fileId))
          || Base.isNull(route.query.log2FoldChange) || Base.isNull(route.query.adjustedPValue) || Base.isNull(route.query.pvalue)) {
        Jump.routerDefault(router, '/');
        ElNotification({
          title: 'Please check',
          message: `${route.fullPath}: The path is not feasible!`,
          type: 'error'
        });
      }
      ElNotification({
        title: 'Wishing you a pleasant browsing experience!',
        message: 'Please be patient, if there are too many genes, it may take half a minute!',
        type: 'success'
      });
      metaData.value.select = 'enrichment';
      listDataByTfs();
    });
    return {
      ...toRefs(data),
      loading,
      metaData,
      sampleTable,
      traitTable,
      clusterAnno,
      tfInfoAnno,
      metaDataChange,
      samplePageEvent,
      traitPageEvent,
      sampleSelectionChange,
      traitSelectionChange,
      buttonContent: ANALYSIS_TF_BUTTON_POSITION_DATA,
      methodData: DETAIL_METHOD_DATA,
      metaDataData: ANALYSIS_META_DATA_DATA,
      sampleTableDescription: DATA_ANALYSIS_SAMPLE_TABLE_DESCRIPTION,
      tableDescription: DATA_ANALYSIS_TRAIT_TABLE_DESCRIPTION
    };
  }
});
</script>
