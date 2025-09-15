<template>
  <div id="on_line_information">
    <div>
      <BaseTable :update-new-data="listUserSampleInformation" :table-description="tableDescription"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import '@/assets/less/views/OnLine.less';
import BaseTable from '@/components/table/BaseTable.vue';
import { ON_LINE_USER_SAMPLE_TABLE_DESCRIPTION } from '@/assets/ts';
import { Page } from '@/service/model/reponse/request';
import OnLineApi from '@/api/service/onLineApi';

export default defineComponent({
  name: 'OnLineInformation',
  components: { BaseTable },
  setup() {
    const data = reactive({
      tableData: [] as Array<any>
    });
    // 请求后台数据
    const listUserSampleInformation = (page: Page) => OnLineApi.listUserJob(page);
    return {
      ...toRefs(data),
      listUserSampleInformation,
      tableDescription: ON_LINE_USER_SAMPLE_TABLE_DESCRIPTION
    };
  }
});
</script>
