<template>
  <BaseLoading id="sample_overview_detail" ref="loading">
    <SingleCard :title="{ icon: 'fas fa-th-large', content: 'Sample overview' }" id="position_overview">
      <template #head>
        <el-link :href="scatacDownload()">
          <el-button size="small" type="primary"> scATAC-seq data &nbsp; <i class="fas fa-file-download"></i></el-button>
        </el-link>
      </template>
      <template #default>
        <LeftRight :is-left-right="isLeftRight" ref="leftRight">
          <template #left>
            <table class="table table-hover table-striped table_sample_overview">
              <thead></thead>
              <tbody>
              <tr v-for="(item, i) in overviewTableData" :key="i">
                <th v-html="item.key" v-if="i != overviewTableData.length - 1"></th>
                <td v-html="item.value" v-if="i != overviewTableData.length - 1"></td>
                <th v-if="i == overviewTableData.length - 1 && isShow">
                  {{ item.key }}
                  <span @click="isShow = false">
                   <i class="fas fa-minus-square"></i>
                </span>
                </th>
                <th v-if="i == overviewTableData.length - 1 && !isShow">
                  {{ item.key }}
                </th>
                <td v-if="i == overviewTableData.length - 1 && isShow">
                  {{ item.value }}
                  <span @click="isShow = false">
                   <i class="fas fa-minus-square"></i>
                </span>
                </td>
                <td v-if="i == overviewTableData.length - 1 && !isShow">
                  {{ item.value.toString().substring(0, 30) }}
                  <span @click="isShow = true"> ... <i class="fas fa-plus-square"></i></span>
                </td>
              </tr>
              </tbody>
            </table>
          </template>
          <template #right>
            <BaseTabs active="cell_type" :change="metadataChange" :tabs-data="metadataTabs"/>
            <Echarts :resize-value="cellTypeResizeValue" :expand-option="expandOption" ref="cellTypeEcharts"/>
          </template>
        </LeftRight>
      </template>
    </SingleCard>
  </BaseLoading>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import SingleCard from '@/components/card/SingleCard.vue';
import '@/assets/less/views/Detail.less';
import DetailApi from '@/api/service/detailApi';
import { KeyValue } from '@/service/model/data';
import LeftRight from '@/components/layout/LeftRight.vue';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import { cellTypeCountOption, getSampleArrayTable, STATIC_DOWNLOAD_PATH } from '@/assets/ts';
import Echarts from '@/components/echarts/Echarts.vue';
import Time from '@/service/util/base/time';
import BaseTabs from '@/components/tabs/BaseTabs.vue';

export default defineComponent({
  name: 'SampleOverview',
  components: {
    BaseTabs,
    Echarts,
    BaseLoading,
    LeftRight,
    SingleCard
  },
  props: {
    sampleId: {
      type: String,
      default: () => ''
    },
    isLeftRight: {
      type: Boolean,
      default: () => true
    }
  },
  setup(props) {
    const loading = ref();
    const leftRight = ref();
    const cellTypeEcharts = ref();
    const data = reactive({
      overviewTableData: [] as Array<KeyValue>,
      expandOption: {},
      label: '',
      metadataValue: 'cell_type',
      metadataTabs: [{
        name: 'cell_type',
        title: 'Cell type'
      }],
      cellTypeResizeValue: {},
      isShow: false
    });
    // Get the sample overview data
    const getOverview = () => {
      loading.value.loading = true;
      // sample ID
      DetailApi.getSampleInfo(props.sampleId).then((res: any) => {
        loading.value.loading = false;
        data.label = res.label;
        getSampleArrayTable(data.overviewTableData, res);

        if (res.timeExist === 1) {
          data.metadataTabs.push({ title: 'Age/day/time', name: 'time' });
        }

        if (res.sexExist === 1) {
          data.metadataTabs.push({ title: 'Sex', name: 'sex' });
        }

        if (res.drugExist === 1) {
          data.metadataTabs.push({ title: 'Drug resistance', name: 'drug' });
        }
      });
    };

    const getMetadataLabel = (metadata: string) => {
      switch (metadata as string) {
        case 'cell_type':
          return 'Cell type';
        case 'time':
          return 'Age/day/time';
        case 'sex':
          return 'Sex';
        case 'drug':
          return 'Drug resistance';
        default:
          return 'Cell type';
      }
    };

    // Plot the clustering graph for each cell type
    const getCellTypeCountPie = () => {
      cellTypeEcharts.value.startLoading();
      DetailApi.getCellTypeCount(props.sampleId, data.metadataValue).then((res: any) => {
        cellTypeEcharts.value.endLoading();
        // echarts
        cellTypeEcharts.value.drawEcharts(cellTypeCountOption(res, false, `${getMetadataLabel(data.metadataValue)} count`));
        data.expandOption = cellTypeCountOption(res, true, `${getMetadataLabel(data.metadataValue)} count`);
        data.cellTypeResizeValue = Time.awaitData(() => ({
          width: leftRight.value.getLeftLabel().offsetWidth,
          height: leftRight.value.getLeftLabel().offsetHeight
        }), leftRight.value && leftRight.value.getLeftLabel().offsetHeight > 100);
        cellTypeEcharts.value.setResize();
      });
    };
    const plotResize = () => {
      cellTypeEcharts.value.setResize();
    };

    const metadataChange = (tag: any) => {
      data.metadataValue = tag.paneName;
      getCellTypeCountPie();
    };

    const scatacDownload = () => `${STATIC_DOWNLOAD_PATH}/scatac/${data.label}_sc_atac_snapATAC2.h5ad`;

    onMounted(() => {
      getOverview();
      getCellTypeCountPie();
    });
    return {
      ...toRefs(data),
      loading,
      leftRight,
      cellTypeEcharts,
      metadataChange,
      plotResize,
      scatacDownload
    };
  }
});
</script>
