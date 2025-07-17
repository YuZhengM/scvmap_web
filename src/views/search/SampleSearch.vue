<template>
  <div id="sample_search">
    <LeftRight ref="leftRight">
      <template #left>
        <BaseSwitch active-text="Tissue type:" inactive-text="Cell type:" :change-event="fileChange" ref="fileSwitch"/>
        <SelectInput title="Tissue type" :select-data="tissueTypeData" placeholder="Please input  e.g. Brain" clearable ref="tissueType" v-show="isTissueType"/>
        <SelectInput title="Cell type" :select-data="cellTypeData" placeholder="Please input  e.g. CD4+ T cells" clearable ref="cellType" v-show="!isTissueType"/>
        <BaseButton :content="buttonContent" :button-click="buttonClick"/>
        <div class="content">
          <span class="font_red">Function introduction:</span>
          <span v-if="!isTissueType">
            User submits cell type to obtain scATAC-seq data
          </span>
          <span v-if="isTissueType">
            User submits tissue type to obtain scATAC-seq data
          </span>
          <el-divider></el-divider>
          <span class="font_red">Parameter explanation:</span>
          <p v-if="!isTissueType">
            <span class="region">
              1) <strong>Cell type</strong>: The cell type contained within scATAC-seq data.
            </span>
          </p>
          <p v-if="isTissueType">
            <span class="region">
              1) <strong>Tissue type</strong>: The tissue type to which scATAC-seq data belongs.
            </span>
          </p>
        </div>
      </template>
      <template #right>
        <Echarts :resize-value="{ width: 450, height: 420 }" ref="echarts"/>
      </template>
    </LeftRight>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import LeftRight from '@/components/layout/LeftRight.vue';
import BaseButton from '@/components/button/BaseButton.vue';
import { pieCountOption, SEARCH_BUTTON } from '@/assets/ts';
import Jump from '@/service/util/base/jump';
import Base from '@/service/util/base/base';
import { InputSelect } from '@/service/model/components/input';
import ArrayUtil from '@/service/util/base/array';
import SearchApi from '@/api/service/searchApi';
import Echarts from '@/components/echarts/Echarts.vue';
import BaseSwitch from '@/components/switch/BaseSwitch.vue';
import SelectInput from '@/components/input/SelectInput.vue';
import { ElNotification } from 'element-plus';

export default defineComponent({
  name: 'SampleSearch',
  components: { SelectInput, BaseSwitch, Echarts, BaseButton, LeftRight },
  setup() {
    const router = useRouter();
    const leftRight = ref();
    const tissueType = ref();
    const cellType = ref();
    const echarts = ref();
    const data = reactive({
      isTissueType: true,
      tissueTypeData: [] as Array<InputSelect>,
      cellTypeData: [] as Array<InputSelect>,
      echartsTissueTypeOption: {},
      echartsCellTypeOption: {}
    });
    const buttonClick = (id: String) => {
      // 点击开始搜索
      if (id === 'start') {
        if (data.isTissueType) {
          if (Base.isNull(tissueType.value.input)) {
            tissueType.value.input = 'Brain';
            ElNotification({ title: 'Default parameter settings', message: 'Tissue type defaults to `all`!', type: 'info' });
          }
        } else if (Base.isNull(cellType.value.input)) {
          cellType.value.input = 'CD4+ T cells';
          ElNotification({ title: 'Default parameter settings', message: 'Cell type defaults to `CD4+ T cells`!', type: 'info' });
        }
        Jump.routerQuery(router, '/search_sample', data.isTissueType ? {
          tissueType: tissueType.value.input
        } : {
          cellType: cellType.value.input
        });
      } else if (id === 'reset') {
        tissueType.value.input = '';
        cellType.value.input = '';
      } else if (id === 'example') {
        if (data.isTissueType) {
          tissueType.value.input = 'Brain';
        } else {
          cellType.value.input = 'CD4+ T cells';
        }
      }
    };
    const getCellTypeData = () => {
      // 清空
      ArrayUtil.clear(data.cellTypeData);
      // 请求性状数量信息
      SearchApi.listCellType().then((res: any) => {
        const echartsData: any[] = [];
        (res as Array<any>).forEach((item: any) => {
          // 添加 SelectInput 数据
          data.cellTypeData.push({ label: item.field, value: item.field, description: item.number });
          echartsData.push({ name: item.field, value: item.number });
        });
        // echarts
        data.echartsCellTypeOption = pieCountOption(echartsData, 'Cell type');
      });
    };
    const getTissueTypeData = () => {
      // 清空
      ArrayUtil.clear(data.tissueTypeData);
      // 请求性状数量信息
      SearchApi.listTissueType().then((res: any) => {
        const echartsData: any[] = [];
        (res as Array<any>).forEach((item: any) => {
          // 添加 SelectInput 数据
          data.tissueTypeData.push({ label: item.field, value: item.field, description: item.number });
          echartsData.push({ name: item.field, value: item.number });
        });
        // echarts
        data.echartsTissueTypeOption = pieCountOption(echartsData, 'Tissue type');
        echarts.value.drawEcharts(data.echartsTissueTypeOption);
      });
    };

    const fileChange = (value: boolean) => {
      data.isTissueType = value;
      if (value) {
        echarts.value.drawEcharts(data.echartsTissueTypeOption);
      } else {
        echarts.value.drawEcharts(data.echartsCellTypeOption);
      }
    };

    onMounted(() => {
      getCellTypeData();
      getTissueTypeData();
    });
    return {
      ...toRefs(data),
      leftRight,
      tissueType,
      cellType,
      echarts,
      buttonClick,
      fileChange,
      resizeEcharts: () => echarts.value.setResize(),
      buttonContent: SEARCH_BUTTON
    };
  }
});
</script>
