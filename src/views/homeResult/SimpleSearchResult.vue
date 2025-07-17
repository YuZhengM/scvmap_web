<template>
  <div id="sample_search_result">
    <div>
      <span class="title">Search By `{{ label }}`: {{ content }}</span>
      <BaseTable :table-data="tableData" :is-service-paging="false" :table-description="tableDescription" ref="table"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Base from '@/service/util/base/base';
import '@/assets/less/views/Search.less';
import Jump from '@/service/util/base/jump';
import BaseTable from '@/components/table/BaseTable.vue';
import { SEARCH_SAMPLE_TABLE_DESCRIPTION, SEARCH_TRAIT_TABLE_DESCRIPTION } from '@/assets/ts';
import { ElNotification } from 'element-plus';
import HomeApi from '@/api/service/homeApi';

export default defineComponent({
  name: 'SimpleSearchResult',
  components: { BaseTable },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const table = ref();
    const data = reactive({
      label: '' as string,
      content: '' as string,
      tableData: [] as Array<any>,
      tableDescription: [] as Array<any>
    });
    // 请求后台数据
    const listSampleInformation = () => {
      table.value.startLoading();
      HomeApi.listInfoByContent(String(route.query.title), String(route.query.value)).then((res: any) => {
        table.value.endLoading();
        const { name, content, traitList, sampleList } = res;
        data.content = content;
        switch (name) {
          case 'trait':
            Jump.routerQuery(router, '/detail', {
              traitId: content
            });
            break;
          case 'sample':
            Jump.routerQuery(router, '/detail', {
              sampleId: content
            });
            break;
          case 'traitList':
            data.label = 'Trait or disease';
            data.tableDescription = SEARCH_TRAIT_TABLE_DESCRIPTION;
            data.tableData = traitList;
            break;
          case 'sampleList':
            data.label = 'Single cell sample';
            data.tableDescription = SEARCH_SAMPLE_TABLE_DESCRIPTION;
            data.tableData = sampleList;
            break;
          default:
            Jump.routerDefault(router, '/');
            break;
        }
      });
    };
    onMounted(() => {
      if (Base.isNull(route.query.title) && Base.isNull(route.query.value)) {
        Jump.routerDefault(router, '/');
        ElNotification({ title: 'Please check', message: `${route.fullPath}: The path is not feasible!`, type: 'error' });
      }
      listSampleInformation();
    });
    return {
      ...toRefs(data),
      table,
      listSampleInformation
    };
  }
});
</script>
