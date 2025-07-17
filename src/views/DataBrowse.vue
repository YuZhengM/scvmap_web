<template>
  <BaseLoading id="data_browse" ref="loading">
    <div class="data_browse">
      <BaseTabs active="sample" :tabs-data="annotationTabs">
        <template #sample>
          <SampleDataBrowse/>
        </template>
        <template #trait>
          <TraitDataBrowse/>
        </template>
      </BaseTabs>
    </div>
  </BaseLoading>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import '@/assets/less/views/DataBrowse.less';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import SampleDataBrowse from '@/views/dataBrowse/SampleDataBrowse.vue';
import TraitDataBrowse from '@/views/dataBrowse/TraitDataBrowse.vue';
import BaseTabs from '@/components/tabs/BaseTabs.vue';
import { TabsBase } from '@/service/model/components/tabs';

export default defineComponent({
  name: 'DataBrowse',
  components: { BaseTabs, TraitDataBrowse, SampleDataBrowse, BaseLoading },
  setup() {
    const loading = ref();
    // 设置响应数据
    const data = reactive({
      value: true as boolean,
      annotationTabs: [
        {
          name: 'sample',
          title: 'Single cell chromatin accessibility data'
        },
        {
          name: 'trait',
          title: 'Trait or disease data'
        }
      ] as Array<TabsBase>
    });
    onMounted(() => {
      data.value = true;
    });
    return {
      ...toRefs(data),
      loading
    };
  }
});
</script>
