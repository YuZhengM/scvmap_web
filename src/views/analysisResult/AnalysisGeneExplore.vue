<template>
  <div id="analysis_gene_explore">
    <PositionButton :button-content="buttonContent" :top="125"/>
    <BaseBr/>
    <BaseLoading class="analysis_gene_explore" id="position_information" ref="loading">
      <SingleCard :title="{ content: `scATAC-seq and trait or disease data information` }">
        <LeftRight>
          <template #left>
            <BaseTable :table-data="sampleTableData"
                       :is-service-paging="false"
                       :table-description="sampleTableDescription"
                       :page-sizes="[7, 10, 15, 25, 30, 40, 50, 100]"
                       layout="total, prev, pager, next"
                       :page-event="samplePageEvent"
                       :sort-change="samplePageEvent"
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
                       ref="traitTable"
                       v-show="isEn"/>
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
      <SingleCard :title='{ content: `The "${traitLabel}"-relevant score in "${sampleLabel}" data` }' id="position_cell">
        <ClusterAnnotationWithButton :trait-id="traitId" :sample-id="sampleId" ref="clusterAnno"/>
      </SingleCard>
      <BaseBr/>
      <GeneInfoAnnotation :sample-id="sampleId" :trait-id="traitId" ref="geneInfoAnno"/>
      <BaseBr/>
      <ComprehensiveNetworkAnnotation :sample-id="sampleId" :trait-id="traitId"/>
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
  DATA_ANALYSIS_SAMPLE_TABLE_DESCRIPTION,
  DATA_ANALYSIS_TRAIT_TABLE_DESCRIPTION,
  DETAIL_METHOD_DATA,
  ANALYSIS_GENE_BUTTON_POSITION_DATA
} from '@/assets/ts';
import BaseBr from '@/components/divider/BaseBr.vue';
import BaseTable from '@/components/table/BaseTable.vue';
import { ElNotification } from 'element-plus';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import GeneInfoAnnotation from '@/views/detail/common/GeneInfoAnnotation.vue';
import AnalysisApi from '@/api/service/analysisApi';
import LeftRight from '@/components/layout/LeftRight.vue';
import Time from '@/service/util/base/time';
import ClusterAnnotationWithButton from '@/views/detail/common/ClusterAnnotationWithButton.vue';
import SingleCard from '@/components/card/SingleCard.vue';
import BaseSelect from '@/components/input/BaseSelect.vue';
import PositionButton from '@/components/button/PositionButton.vue';
import ComprehensiveNetworkAnnotation from '@/views/detail/common/ComprehensiveNetworkAnnotation.vue';

export default defineComponent({
  name: 'AnalysisGeneExplore',
  components: {
    ComprehensiveNetworkAnnotation,
    GeneInfoAnnotation,
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
    const geneInfoAnno = ref();
    const data = reactive({
      sampleId: '' as string,
      sampleLabel: '' as string,
      traitId: '' as string,
      traitLabel: '' as string,
      traitIdListAll: [] as any,
      isEn: true as boolean,
      isDataEmpty: false as boolean,
      sample: {} as any,
      sampleTableData: [] as Array<any>,
      traitTableDataAll: [] as Array<any>,
      traitTableData: [] as Array<any>,
      traitTableDataNoEn: [] as Array<any>,
      sampleIsSelectChange: true as boolean,
      traitIsSelectChange: true as boolean
    });

    // 得到参数
    const getParams = () => ({
      content: route.query.content,
      fileId: route.query.fileId,
      log2FoldChange: Number(route.query.log2FoldChange),
      adjustedPValue: Number(route.query.adjustedPValue),
      pvalue: Number(route.query.pvalue),
      min: Number(route.query.minAngry),
      pvalueTrait: Number(route.query.pvalueTrait),
      coScore: route.query.coScore,
      isFile: Number(route.query.isFile)
    });

    const getEnrichedTraitIdList = () => {
      traitTable.value.startLoading();
      AnalysisApi.listTraitBySampleIdAndTraitIdList(data.sampleId, data.traitIdListAll).then((res: any) => {
        const traitIdList = res.map((item: any) => item.traitId);
        traitTable.value.endLoading();
        clusterAnno.value.endLoading();
        geneInfoAnno.value.endLoading();
        data.traitTableData = data.traitTableDataAll.filter((item: any) => traitIdList.indexOf(item.traitId) > -1);
        data.traitTableDataNoEn = data.traitTableDataAll.filter((item: any) => traitIdList.indexOf(item.traitId) < 0);
        Time.delay(() => {
          traitTable.value.selectionToggleChange([data.traitTableData[0]]);
          data.traitId = data.traitTableData[0].traitId;
        }, 600);
      });
    };

    const metaDataChange = () => {
      data.isEn = metaData.value.select === 'enrichment';
    };

    const listDataByGenes = () => {
      sampleTable.value.startLoading();
      traitTable.value.startLoading();
      clusterAnno.value.startLoading();
      geneInfoAnno.value.startLoading();
      AnalysisApi.listDataByGenes(getParams()).then((res: any) => {
        sampleTable.value.endLoading();

        if (Base.isNull(res.sampleList) || Base.isNull(res.traitList)) {
          Jump.routerDefault(router, '/analysis');
          ElNotification({
            title: 'Information:',
            message: 'The input gene list is too limited or the threshold setting is strict, with no enriched traits or significant differentially expressed genes in the sample.',
            type: 'success'
          });
        }

        data.sampleTableData = res.sampleList;
        data.traitTableDataAll = res.traitList;
        data.isDataEmpty = data.sampleTableData.length === 0 || data.traitTableDataAll.length === 0;

        if (data.isDataEmpty) {
          traitTable.value.endLoading();
          clusterAnno.value.endLoading();
          geneInfoAnno.value.endLoading();
        } else {
          data.traitIdListAll = [...new Set(data.traitTableDataAll.map((item: any) => item.traitId))];
          data.sampleId = data.sampleTableData[0].sampleId;
          data.sampleLabel = data.sampleTableData[0].label;
          Time.delay(() => {
            sampleTable.value.selectionToggleChange([data.sampleTableData[0]]);
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
          || Base.isNull(route.query.log2FoldChange) || Base.isNull(route.query.adjustedPValue) || Base.isNull(route.query.pvalue)
          || Base.isNull(route.query.minAngry) || Base.isNull(route.query.pvalueTrait) || Base.isNull(route.query.coScore)) {
        Jump.routerDefault(router, '/');
        ElNotification({
          title: 'Please check',
          message: `${route.fullPath}: The path is not feasible!`,
          type: 'error'
        });
      }
      metaData.value.select = 'enrichment';
      ElNotification({
        title: 'Wishing you a pleasant browsing experience!',
        message: 'Please be patient, if there are too many genes, it may take half a minute!',
        type: 'success'
      });
      listDataByGenes();
    });
    return {
      ...toRefs(data),
      loading,
      metaData,
      sampleTable,
      traitTable,
      clusterAnno,
      geneInfoAnno,
      metaDataChange,
      samplePageEvent,
      traitPageEvent,
      sampleSelectionChange,
      traitSelectionChange,
      buttonContent: ANALYSIS_GENE_BUTTON_POSITION_DATA,
      methodData: DETAIL_METHOD_DATA,
      metaDataData: ANALYSIS_META_DATA_DATA,
      sampleTableDescription: DATA_ANALYSIS_SAMPLE_TABLE_DESCRIPTION,
      tableDescription: DATA_ANALYSIS_TRAIT_TABLE_DESCRIPTION
    };
  }
});
</script>
