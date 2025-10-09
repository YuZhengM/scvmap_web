<template>
  <div id="on_line_result">
    <div class="start_test" v-if="jobStatus !== 'Finish'">
      <div v-if="jobStatus === 'none'">
        <span class="font_red">{{ jobId }}</span>: there is no such task, or this task has been cleared.
      </div>
      <div v-if="jobStatus === 'Error'">
        This task <span class="font_red">{{ jobId }}</span> has ended, but an error occurred. Please check the <strong>LOG</strong> information and correct if the input file format
        is consistent with the given example file.
      </div>
      <div v-if="jobStatus !== 'none' && jobStatus !== 'Error'">
        The task <span class="font_red">{{ jobId }}</span> is still in progress. Please check your email.
      </div>
      <div v-if="jobStatus !== 'none' && jobStatus !== 'Error'">
        Please be patient, it will take about half an hour. After execution, an email prompt will be automatically sent.
      </div>
    </div>
    <SingleCard :title="{ icon: 'fas fa-th-large', content: 'Job overview' }" v-if="jobStatus !== 'none'">
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
        <tr v-if="jobStatus === 'Finish'">
          <th><span class="font_red">TRS data:</span></th>
          <td>
            <el-link :href="resultDownload('_result.txt')">
              <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
            </el-link>
          </td>
        </tr>
        <tr v-if="jobStatus === 'Finish'">
          <th><span class="font_red">Intermediate data:</span></th>
          <td>
            <el-link :href="resultDownload('_intermediate_data.rda')">
              <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
            </el-link>
          </td>
        </tr>
        <tr v-if="jobStatus === 'Finish' || jobStatus === 'Error'">
          <th><span class="font_red">Log data:</span></th>
          <td>
            <el-link :href="resultDownload('.log')">
              <el-button size="small" type="primary"> Download &nbsp; <i class="fas fa-file-download"></i></el-button>
            </el-link>
          </td>
        </tr>
        </tbody>
      </table>
    </SingleCard>
    <br/>
    <SingleCard :title="{ icon: 'fas fa-list', content: 'TRS result' }" v-if="jobStatus !== 'none' && jobStatus === 'Finish'">
      <BaseTable :table-data="trsTableData"
                 :is-service-paging="false"
                 :download-urls="[{'url': resultDownload('_result.txt'), 'title': 'Download'}]"
                 :table-description="trsTableDescription"
                 ref="table"/>
    </SingleCard>
    <br/>
    <SingleCard :title="{ icon: 'fas fa-list', content: 'trait-relevant cell score' }" v-if="jobStatus !== 'none' && jobStatus === 'Finish'">
      <div>
        <LeftRight>
          <template #left>
            <BaseSelect title="Method: " :select-data="methodData" width="65%" is-line ref="method"/>
          </template>
          <template #right>
            <BaseSelect title="Cell Type: " :select-data="selectData" width="65%" is-line ref="cellType"/>
          </template>
        </LeftRight>
        <BaseBr/>
        <LeftRight>
          <template #left>
            <BaseSelect title="Axis1: " :select-data="selectData" width="65%" is-line ref="axis1"/>
          </template>
          <template #right>
            <BaseSelect title="Axis2: " :select-data="selectData" width="65%" is-line ref="axis2"/>
          </template>
        </LeftRight>
        <BaseBr/>
        <el-button class="analysis_button button-3d" @click="buttonClick"> Analysis </el-button>
      </div>
      <BaseLoading ref="loading">
        <LeftRight ref="leftRight">
          <template #left>
            <div :id="clusterId"></div>
          </template>
          <template #right>
            <div :id="traitClusterId"></div>
          </template>
        </LeftRight>
        <el-divider></el-divider>
        <TraitBoxPlot :box-data="boxData" :label="label" ref="boxPlot"/>
      </BaseLoading>
    </SingleCard>

  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import '@/assets/less/views/OnLine.less';
import { clusterForm, DETAIL_METHOD_DATA, formClusterPlotMethod, sampleClusterLayout, sampleClusterLayoutMain, STATIC_USER_PATH } from '@/assets/ts';
import OnLineApi from '@/api/service/onLineApi';
import Base from '@/service/util/base/base';
import { useRoute, useRouter } from 'vue-router';
import { KeyValue } from '@/service/model/data';
import Jump from '@/service/util/base/jump';
import { ElNotification } from 'element-plus';
import SingleCard from '@/components/card/SingleCard.vue';
import Time from '@/service/util/base/time';
import BaseTable from '@/components/table/BaseTable.vue';
import BaseSelect from '@/components/input/BaseSelect.vue';
import { InputSelect } from '@/service/model/components/input';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import TraitBoxPlot from '@/views/detail/common/TraitBoxPlot.vue';
import LeftRight from '@/components/layout/LeftRight.vue';
import StringUtil from '@/service/util/base/string';
import Plotly from 'plotly.js-dist-min';
import config from '@/service/util/plotly';
import BaseBr from '@/components/divider/BaseBr.vue';

export default defineComponent({
  name: 'OnLineResult',
  components: { BaseBr, LeftRight, TraitBoxPlot, BaseLoading, BaseSelect, BaseTable, SingleCard },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const loading = ref();
    const table = ref();
    const method = ref();
    const cellType = ref();
    const axis1 = ref();
    const axis2 = ref();
    const leftRight = ref();
    const boxPlot = ref();
    const data = reactive({
      jobId: '' as any,
      jobStatus: '',
      columnList: [] as any,
      tableData: [] as Array<KeyValue>,
      trsTableData: [] as Array<any>,
      selectData: [] as Array<InputSelect>,
      trsTableDescription: [] as Array<any>,
      params: {} as any,
      clusterId: StringUtil.randomString(10),
      traitClusterId: StringUtil.randomString(10),
      traitData: [] as Array<InputSelect>,
      boxData: {} as any,
      label: '' as string
    });

    const checkJobStatus = async () => {
      const jobInfo = await OnLineApi.getUserJobInfo(data.jobId) as any;
      if (Base.isNull(jobInfo)) {
        data.jobStatus = 'none';
      } else {
        data.tableData.push({ key: 'Job ID', value: jobInfo.jobId });
        data.jobId = jobInfo.jobId;
        data.tableData.push({ key: 'Genome', value: jobInfo.genome });
        data.tableData.push({ key: 'Job status', value: jobInfo.jobStatus });
        data.jobStatus = jobInfo.jobStatus;
        data.tableData.push({ key: 'Layer', value: jobInfo.layer });
        data.tableData.push({ key: 'scATAC-seq file name', value: jobInfo.scFileId });
        data.tableData.push({ key: 'Trait file name', value: jobInfo.variantFileId });
        data.tableData.push({ key: 'Create time', value: Time.getDate(jobInfo.createTime) });
        data.tableData.push({ key: 'Update time', value: Time.getDate(jobInfo.updateTime) });
      }
    };

    const resultDownload = (filename: string) => `${STATIC_USER_PATH}/${data.jobId}${filename}`;

    const getColumns = async () => {
      data.columnList = await OnLineApi.getColumns(data.jobId);
      data.columnList.forEach((item: any) => {
        data.selectData.push({ label: item, value: item });
        data.trsTableDescription.push({ column: item, title: item });
      });
    };

    const getTrsTableData = () => {
      OnLineApi.jobResultAnalysis(data.jobId).then((res: any) => {
        data.trsTableData = res;
      });
    };

    // Get the cluster coordinate data from the backend
    const getClusterValue = () => {
      OnLineApi.listClusterCoordinate(data.jobId, axis1.value.select, axis2.value.select, cellType.value.select).then((res: any) => {
        Plotly.newPlot(data.clusterId, clusterForm(res, 5), sampleClusterLayoutMain(580, 580), config);
      });
    };

    const getTraitClusterData = () => {
      boxPlot.value.startLoading();
      OnLineApi.listJobClusterCoordinate(data.jobId, method.value.select, axis1.value.select, axis2.value.select, cellType.value.select).then((res: any) => {
        data.label = method.value.select === 'scavenge' ? 'TRS' : 'Z score';
        data.boxData = res.plotlyDataList[0] as any;
        boxPlot.value.endLoading();
        const formClusterPlotData = formClusterPlotMethod(res.plotlyDataList, 2, data.label);
        Plotly.newPlot(data.traitClusterId, formClusterPlotData, sampleClusterLayout(leftRight.value.getLeftLabel().offsetWidth * 0.95, 580), config);
      });
    };

    const buttonClick = () => {
      if (Base.isNull(method.value.select)) {
        ElNotification({
          title: 'Please check',
          message: 'Please select method!',
          type: 'error'
        });
        return;
      }

      if (Base.isNull(axis1.value.select)) {
        ElNotification({
          title: 'Please check',
          message: 'Please select axis1!',
          type: 'error'
        });
        return;
      }

      if (Base.isNull(axis2.value.select)) {
        ElNotification({
          title: 'Please check',
          message: 'Please select axis2!',
          type: 'error'
        });
        return;
      }

      if (Base.isNull(cellType.value.select)) {
        ElNotification({
          title: 'Please check',
          message: 'Please select cell type or cluster!',
          type: 'error'
        });
        return;
      }

      getClusterValue();
      getTraitClusterData();
    };

    onMounted(async () => {
      if (Base.isNull(route.query.jobId)) {
        Jump.routerDefault(router, '/');
        ElNotification({ title: 'Please check', message: `${route.fullPath}: The path is not feasible!`, type: 'error' });
      }
      data.jobId = route.query.jobId;
      await checkJobStatus();
      await getColumns();
      getTrsTableData();
    });
    return {
      ...toRefs(data),
      loading,
      table,
      method,
      cellType,
      axis1,
      axis2,
      leftRight,
      boxPlot,
      resultDownload,
      buttonClick,
      methodData: DETAIL_METHOD_DATA
    };
  }
});
</script>
