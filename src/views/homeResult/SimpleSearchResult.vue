<template>
  <div id="sample_search_result">
    <div>
      <span class="title">Search By `{{ label }}`: {{ content }}</span>
      <BaseTable :update-new-data="listSampleInformation"
                 :download-url="overviewDownload(filename)"
                 :table-description="tableDescription" ref="table"/>
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
import { SEARCH_SAMPLE_TABLE_DESCRIPTION, SEARCH_TRAIT_TABLE_DESCRIPTION, STATIC_DOWNLOAD_PATH } from '@/assets/ts';
import { ElNotification } from 'element-plus';
import HomeApi from '@/api/service/homeApi';
import { Page } from '@/service/model/reponse/request';

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
      filename: '' as string,
      tableDescription: [] as Array<any>
    });
    // 请求后台数据
    const listSampleInformation = async (page: Page) => {
      table.value.startLoading();
      return HomeApi.listInfoByContent(String(route.query.title), String(route.query.value), page).then((res: any) => {
        table.value.endLoading();
        const { name, content, dataList } = res;
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
            data.filename = 'trait_info.xlsx';
            return dataList;
          case 'sampleList':
            data.label = 'Single cell sample';
            data.tableDescription = SEARCH_SAMPLE_TABLE_DESCRIPTION;
            data.filename = 'sample_info.txt';
            return dataList;
          default:
            Jump.routerDefault(router, '/');
            break;
        }
      });
    };

    const overviewDownload = (filename: string) => `${STATIC_DOWNLOAD_PATH}/overview/${filename}`;

    onMounted(() => {
      if (Base.isNull(route.query.title) && Base.isNull(route.query.value)) {
        Jump.routerDefault(router, '/');
        ElNotification({ title: 'Please check', message: `${route.fullPath}: The path is not feasible!`, type: 'error' });
      }
    });
    return {
      ...toRefs(data),
      table,
      listSampleInformation,
      overviewDownload
    };
  }
});
</script>
