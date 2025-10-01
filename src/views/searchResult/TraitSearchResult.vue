<template>
  <div id="trait_search_result">
    <div>
      <BaseTable :update-new-data="listTraitInformation" :table-description="tableDescription"/>
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
import { SEARCH_TRAIT_TABLE_DESCRIPTION } from '@/assets/ts';
import SearchApi from '@/api/service/searchApi';
import { Page } from '@/service/model/reponse/request';
import { ElNotification } from 'element-plus';

export default defineComponent({
  name: 'TraitSearchResult',
  components: { BaseTable },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const data = reactive({
      params: {},
      tableData: [] as Array<any>
    });
    // Request background data
    const listTraitInformation = (page: Page) => SearchApi.listTraitBySearchTrait({
      ...data.params,
      page
    });
    onMounted(() => {
      if (Base.isNull(route.query.category) && Base.isNull(route.query.sourceId)) {
        Jump.routerDefault(router, '/');
        ElNotification({ title: 'Please check', message: `${route.fullPath}: The path is not feasible!`, type: 'error' });
      }
      data.params = route.query;
    });
    return {
      ...toRefs(data),
      listTraitInformation,
      tableDescription: SEARCH_TRAIT_TABLE_DESCRIPTION
    };
  }
});
</script>
