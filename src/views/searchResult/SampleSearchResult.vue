<template>
  <div id="sample_search_result">
    <div>
      <BaseTable :update-new-data="listSampleInformation" :table-description="tableDescription"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Base from '@/service/util/base/base';
import '@/assets/less/views/Search.less';
import Jump from '@/service/util/base/jump';
import BaseTable from '@/components/table/BaseTable.vue';
import { SEARCH_SAMPLE_TABLE_DESCRIPTION } from '@/assets/ts';
import SearchApi from '@/api/service/searchApi';
import { Page } from '@/service/model/reponse/request';
import { ElNotification } from 'element-plus';

export default defineComponent({
  name: 'SampleSearchResult',
  components: { BaseTable },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const data = reactive({
      params: {},
      tableData: [] as Array<any>
    });
    // Request the background data
    const listSampleInformation = (page: Page) => SearchApi.listSampleBySearchSample({
      ...data.params,
      page
    });
    onMounted(() => {
      if (Base.isNull(route.query.tissueType) && Base.isNull(route.query.cellType)) {
        Jump.routerDefault(router, '/');
        ElNotification({ title: 'Please check', message: `${route.fullPath}: The path is not feasible!`, type: 'error' });
      }
      data.params = route.query;
    });
    return {
      ...toRefs(data),
      listSampleInformation,
      tableDescription: SEARCH_SAMPLE_TABLE_DESCRIPTION
    };
  }
});
</script>
