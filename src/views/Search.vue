<template>
  <div id="search">
    <div class="search">
      <h2 class="title">
        Search
      </h2>
      <el-divider></el-divider>
      <BaseCollapse active-name="trait" :collapse-data="collapseData" :change="change" ref="loading">
        <template #trait>
          <TraitSearch ref="trait"/>
        </template>
        <template #sample>
          <SampleSearch ref="sample"/>
        </template>
        <template #gene>
          <GeneSearch ref="gene"/>
        </template>
        <template #tf>
          <TfSearch ref="tf"/>
        </template>
        <template #variant>
          <VariantSearch/>
        </template>
      </BaseCollapse>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import '@/assets/less/views/Search.less';
import BaseCollapse from '@/components/collapse/BaseCollapse.vue';
import { SEARCH_COLLAPSE_DATA } from '@/assets/ts';
import TraitSearch from '@/views/search/TraitSearch.vue';
import SampleSearch from '@/views/search/SampleSearch.vue';
import GeneSearch from '@/views/search/GeneSearch.vue';
import TfSearch from '@/views/search/TfSearch.vue';
import VariantSearch from '@/views/search/VariantSearch.vue';

export default defineComponent({
  name: 'Search',
  components: { VariantSearch, TfSearch, GeneSearch, SampleSearch, TraitSearch, BaseCollapse },
  setup() {
    const loading = ref();
    const trait = ref();
    const sample = ref();
    const gene = ref();
    const tf = ref();
    // 手风琴切换事件
    const change = (val: string) => {
      // 切换到 tissue 的时候， 重新指定 echarts 宽和高
      if (val === 'trait') {
        trait.value.resizeEcharts();
      } else if (val === 'sample') {
        sample.value.resizeEcharts();
      }
    };
    const startLoading = () => {
      loading.value.startLoading();
    };
    const endLoading = () => {
      loading.value.endLoading();
    };
    return {
      loading,
      trait,
      gene,
      sample,
      tf,
      change,
      collapseData: SEARCH_COLLAPSE_DATA,
      startLoading,
      endLoading
    };
  }
});
</script>
