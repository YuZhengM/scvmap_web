<template>
  <div id="analysis_compare_sc">
    <PositionButton :button-content="buttonContent" :top="125"/>
    <BaseBr/>
    <LeftRight :padding="0">
      <template #left>
        <SampleOverview :sample-id="sampleId1" :is-left-right="false"/>
      </template>
      <template #right>
        <SampleOverview :sample-id="sampleId2" :is-left-right="false"/>
      </template>
    </LeftRight>
    <br/>
    <LeftRight :padding="0">
      <template #left>
        <SingleCard :title='{ content: `The TRS: "${sampleId1}"` }' id="position_cell">
          <ClusterAnnotationWithButton :trait-id="traitId" :sample-id="sampleId1" :cluster-height="400" :is-left-right="false"/>
        </SingleCard>
      </template>
      <template #right>
        <SingleCard :title='{ content: `The TRS: "${sampleId2}"` }'>
          <ClusterAnnotationWithButton :trait-id="traitId" :sample-id="sampleId2" :cluster-height="400" :is-left-right="false"/>
        </SingleCard>
      </template>
    </LeftRight>
    <br/>
    <LeftRight :padding="0">
      <template #left>
        <GeneInfoAnnotation :sample-id="sampleId1" :trait-id="traitId" :is-left-right="false"/>
      </template>
      <template #right>
        <GeneInfoAnnotation :sample-id="sampleId2" :trait-id="traitId" :is-left-right="false"/>
      </template>
    </LeftRight>
    <br/>
    <LeftRight :padding="0">
      <template #left>
        <TfInfoAnnotation :sample-id="sampleId1" :trait-id="traitId" :is-left-right="false"/>
      </template>
      <template #right>
        <TfInfoAnnotation :sample-id="sampleId2" :trait-id="traitId" :is-left-right="false"/>
      </template>
    </LeftRight>
    <br/>
    <LeftRight :padding="0">
      <template #left>
        <ComprehensiveNetworkAnnotation :sample-id="sampleId1" :trait-id="traitId" :is-left-right="false"/>
      </template>
      <template #right>
        <ComprehensiveNetworkAnnotation :sample-id="sampleId2" :trait-id="traitId" :is-left-right="false"/>
      </template>
    </LeftRight>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Base from '@/service/util/base/base';
import Jump from '@/service/util/base/jump';
import '@/assets/less/views/analysisResult/AnalysisResult.less';
import {
  DETAIL_BUTTON_POSITION_DATA
} from '@/assets/ts';
import BaseBr from '@/components/divider/BaseBr.vue';
import { ElNotification } from 'element-plus';
import GeneInfoAnnotation from '@/views/detail/common/GeneInfoAnnotation.vue';
import LeftRight from '@/components/layout/LeftRight.vue';
import ClusterAnnotationWithButton from '@/views/detail/common/ClusterAnnotationWithButton.vue';
import PositionButton from '@/components/button/PositionButton.vue';
import SampleOverview from '@/views/detail/sampleDetail/SampleOverview.vue';
import SingleCard from '@/components/card/SingleCard.vue';
import TfInfoAnnotation from '@/views/detail/common/TfInfoAnnotation.vue';
import ComprehensiveNetworkAnnotation from '@/views/detail/common/ComprehensiveNetworkAnnotation.vue';

export default defineComponent({
  name: 'AnalysisCompareSc',
  components: {
    ComprehensiveNetworkAnnotation,
    TfInfoAnnotation,
    SingleCard,
    SampleOverview,
    GeneInfoAnnotation,
    PositionButton,
    ClusterAnnotationWithButton,
    LeftRight,
    BaseBr
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const loading = ref();
    const data = reactive({
      sampleId1: route.query.sampleId1 as string,
      sampleId2: route.query.sampleId2 as string,
      traitId: route.query.traitId as string
    });

    onMounted(() => {
      if ((Base.isNull(route.query.traitId) && Base.isNull(route.query.sampleId1)) || Base.isNull(route.query.sampleId2)) {
        Jump.routerDefault(router, '/');
        ElNotification({
          title: 'Please check',
          message: `${route.fullPath}: The path is not feasible!`,
          type: 'error'
        });
      }
    });
    return {
      ...toRefs(data),
      loading,
      buttonContent: DETAIL_BUTTON_POSITION_DATA
    };
  }
});
</script>
