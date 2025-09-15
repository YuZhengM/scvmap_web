<template>
  <div id="on_line_exec">
    <BaseLoading ref="loading">
      <div class="start_test">
        <div>
          The task is still in progress. Please check your email.
        </div>
        <div>
          Please be patient, it will take about half an hour. After execution, an email prompt will be automatically sent.
        </div>
      </div>
      <table class="table table-hover table-striped">
        <tbody>
        <tr v-for="(item, i) in tableData" :key="i">
          <th>{{ item.key }}:</th>
          <td v-html="item.value"></td>
        </tr>
        <tr>
          <th>All tasks:</th>
          <td>
            <el-button><a :href="`on_line_information`" target="_blank"> View all tasks </a></el-button>
          </td>
        </tr>
        </tbody>
      </table>
    </BaseLoading>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import '@/assets/less/views/OnLine.less';
import { getJobDetailLink, ON_LINE_USER_SAMPLE_TABLE_DESCRIPTION } from '@/assets/ts';
import OnLineApi from '@/api/service/onLineApi';
import Base from '@/service/util/base/base';
import { useRoute, useRouter } from 'vue-router';
import { KeyValue } from '@/service/model/data';
import Jump from '@/service/util/base/jump';
import { ElNotification } from 'element-plus';
import BaseLoading from '@/components/loading/BaseLoading.vue';

export default defineComponent({
  name: 'OnLineExec',
  components: { BaseLoading },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const loading = ref();
    const table = ref();
    const data = reactive({
      jobId: '' as any,
      tableData: [] as Array<KeyValue>,
      params: {} as any
    });

    const execAnalysis = async () => {
      data.jobId = await OnLineApi.execUserAnalysisFunction(data.params.scFileId, data.params.variantFileId, data.params);
    };

    const checkJobStatus = async () => {
      loading.value.loading = true;
      const jobInfo = await OnLineApi.getJobStatusInfo(data.params.scFileId, data.params.variantFileId, data.params) as any;
      loading.value.loading = false;
      if (Base.isNull(jobInfo)) {
        await execAnalysis();
      } else {
        data.tableData.push({ key: 'Job ID', value: getJobDetailLink(jobInfo.jobId) });
        data.jobId = jobInfo.jobId;
        data.tableData.push({ key: 'Genome', value: jobInfo.genome });
        data.tableData.push({ key: 'Job status', value: jobInfo.jobStatus });
        data.tableData.push({ key: 'Layer', value: jobInfo.layer });
        data.tableData.push({ key: 'scATAC-seq file name', value: jobInfo.scFileId });
        data.tableData.push({ key: 'Trait file name', value: jobInfo.variantFileId });
        data.tableData.push({ key: 'Create time', value: jobInfo.createTime });
        table.value.formatTable();
      }
    };

    onMounted(async () => {
      if (Base.isNull(route.query.scFileId) && Base.isNull(route.query.variantFileId)) {
        Jump.routerDefault(router, '/');
        ElNotification({ title: 'Please check', message: `${route.fullPath}: The path is not feasible!`, type: 'error' });
      }
      data.params = route.query;
      await checkJobStatus();
    });
    return {
      ...toRefs(data),
      table,
      loading,
      tableDescription: ON_LINE_USER_SAMPLE_TABLE_DESCRIPTION
    };
  }
});
</script>
