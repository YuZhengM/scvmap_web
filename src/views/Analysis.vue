<template>
  <div id="analysis">
    <div class="analysis">
      <h2 class="title">
        Analysis
      </h2>
      <el-divider></el-divider>
      <BaseCollapse active-name="multiTrait" :collapse-data="collapseData" ref="loading">
        <template #multiTrait>
          <MultiTrait/>
        </template>
        <template #gene>
          <GeneExplore/>
        </template>
        <template #tf>
          <TfExplore/>
        </template>
      </BaseCollapse>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import BaseCollapse from '@/components/collapse/BaseCollapse.vue';
import { ANALYSIS_COLLAPSE_DATA } from '@/assets/ts';
import '@/assets/less/views/Analysis.less';
import MultiTrait from '@/views/analysis/MultiTrait.vue';
import GeneExplore from '@/views/analysis/GeneExplore.vue';
import TfExplore from '@/views/analysis/TfExplore.vue';

export default defineComponent({
  name: 'Analysis',
  components: { TfExplore, GeneExplore, MultiTrait, BaseCollapse },
  setup() {
    const loading = ref();
    const startLoading = () => {
      loading.value.startLoading();
    };
    const endLoading = () => {
      loading.value.endLoading();
    };
    return {
      loading,
      collapseData: ANALYSIS_COLLAPSE_DATA,
      startLoading,
      endLoading
    };
  }
});
</script>
