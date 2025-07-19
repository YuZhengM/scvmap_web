<template>
  <BaseLoading id="trait_data_browse" ref="loading">
    <div class="trait_data_browse">
      <LeftRight :left-width="30" :padding="0">
        <template #left>
          <br/>
          <ListCard title="Tissue type" :list-card="tissueType1List" :list-card-click="tissueTypeClick" ref="tissueType1" v-show="isShow"/>
          <ListCard title="Health type" :list-card="healthTypeList" :list-card-click="healthTypeClick" ref="healthType" v-show="isShow"/>
          <ListCard title="Tissue type" :list-card="tissueType2List" :list-card-click="tissueTypeClick" ref="tissueType2" v-show="!isShow"/>
          <ListCard title="Cell type" :list-card="cellTypeList" :list-card-click="cellTypeClick" ref="cellType" v-show="!isShow"/>
        </template>
        <template #right>
          <BaseBr/>
          <BaseTabs active="sampleId" :tabs-data="annotationTabs" :change="annotationChange">
            <template #sampleId>
              <BaseBr/>
              <BaseTable :table-data="tableData1" :is-service-paging="false" :download-url="overviewDownload('sample_info.txt')" :table-description="tableDescription1"/>
            </template>
            <template #cellType>
              <BaseBr/>
              <BaseTable :table-data="tableData2" :is-service-paging="false" :download-url="overviewDownload('cell_type_anno.txt')" :table-description="tableDescription2"/>
            </template>
          </BaseTabs>
        </template>
      </LeftRight>
    </div>
  </BaseLoading>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { DATA_BROWSE_SAMPLE_TABLE_DESCRIPTION1, DATA_BROWSE_SAMPLE_TABLE_DESCRIPTION2, STATIC_DOWNLOAD_PATH } from '@/assets/ts';
import DataBrowseApi from '@/api/service/dataBrowseApi';
import BaseTable from '@/components/table/BaseTable.vue';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import BaseTabs from '@/components/tabs/BaseTabs.vue';
import { TabsBase } from '@/service/model/components/tabs';
import LeftRight from '@/components/layout/LeftRight.vue';
import ListCard from '@/components/card/ListCard.vue';
import { CardList } from '@/service/model/components/card';
import ArrayUtil from '@/service/util/base/array';
import { TabsPaneContext } from 'element-plus/es';
import BaseBr from '@/components/divider/BaseBr.vue';

export default defineComponent({
  name: 'SampleDataBrowse',
  components: { BaseBr, ListCard, LeftRight, BaseTabs, BaseLoading, BaseTable },
  setup() {
    const loading = ref();
    const tissueType1 = ref();
    const tissueType2 = ref();
    const healthType = ref();
    const cellType = ref();
    // 设置响应数据
    const data = reactive({
      isShow: true,
      tissueType1List: [] as Array<CardList>,
      tissueType2List: [] as Array<CardList>,
      healthTypeList: [] as Array<CardList>,
      cellTypeList: [] as Array<CardList>,
      tissueTypeValue: '',
      healthTypeValue: '',
      cellTypeValue: '',
      tableData1: [],
      tableData2: [],
      tableDescription1: DATA_BROWSE_SAMPLE_TABLE_DESCRIPTION1,
      tableDescription2: DATA_BROWSE_SAMPLE_TABLE_DESCRIPTION2,
      annotationTabs: [
        {
          name: 'sampleId',
          title: 'Metadata: Sample ID'
        },
        {
          name: 'cellType',
          title: 'Metadata: Cell type'
        }
      ] as Array<TabsBase>
    });
    const params = () => (data.isShow ? {
      tissueType: data.tissueTypeValue,
      healthType: data.healthTypeValue
    } : {
      tissueType: data.tissueTypeValue,
      cellType: data.cellTypeValue
    });

    // 添加字段数量
    const addFieldNumber = (nowData: Array<CardList>, newData: Array<any>, name?: CardList) => {
      // const oldData = ArrayUtil.deepCopy(nowData) as Array<CardList>;
      // 清空
      ArrayUtil.clear(nowData);
      newData.forEach((item: any) => {
        nowData.push({
          label: item.field,
          show: name && item.field === name.label ? name.show : false,
          number: item.number
        });
      });
    };
    // 处理结果值
    const handlerResultData = (res: any, label?: string, name?: CardList) => {
      // 获得数据内容
      const { healthTypeList, tissueTypeList, cellTypeList, dataBrowseDataList } = res;
      // 重构数据
      if (data.isShow) {
        data.tableData1 = dataBrowseDataList;
        addFieldNumber(data.tissueType1List, tissueTypeList as Array<any>, label === 'tissueType' ? name : undefined);
        addFieldNumber(data.healthTypeList, healthTypeList as Array<any>, label === 'healthType' ? name : undefined);
      } else {
        data.tableData2 = dataBrowseDataList;
        addFieldNumber(data.tissueType2List, tissueTypeList as Array<any>, label === 'tissueType' ? name : undefined);
        addFieldNumber(data.cellTypeList, cellTypeList as Array<any>, label === 'cellType' ? name : undefined);
      }
    };

    // 向后台请求数据
    const getDataAndCount = (dataBrowseInfo: any, label?: string, name?: CardList) => {
      // 加载动画
      loading.value.loading = true;
      // 获取数据
      return (data.isShow ? DataBrowseApi.getSampleBrowseData(dataBrowseInfo) : DataBrowseApi.getSampleCellTypeBrowseData(dataBrowseInfo)).then((res: any) => {
        loading.value.loading = false;
        // 获得数据内容
        handlerResultData(res, label, name);
      });
    };

    // 更新类型和数量
    const updateTypeNumber = () => {
      if (data.isShow) {
        tissueType1.value.dataUpdate();
        healthType.value.dataUpdate();
      } else {
        tissueType2.value.dataUpdate();
        cellType.value.dataUpdate();
      }
    };

    const tissueTypeClick = (name: CardList) => {
      data.tissueTypeValue = name.show ? name.label : '';
      return getDataAndCount(params(), 'tissueType', name).then(updateTypeNumber);
    };

    const healthTypeClick = (name: CardList) => {
      data.healthTypeValue = name.show ? name.label : '';
      return getDataAndCount(params(), 'healthType', name).then(updateTypeNumber);
    };

    const cellTypeClick = (name: CardList) => {
      data.cellTypeValue = name.show ? name.label : '';
      return getDataAndCount(params(), 'cellType', name).then(updateTypeNumber);
    };

    const annotationChange = (tag: TabsPaneContext) => {
      data.isShow = (tag.paneName === 'sampleId');
      if (data.tableData1.length === 0 || data.tableData2.length === 0) {
        getDataAndCount(params()).then(updateTypeNumber);
      } else {
        updateTypeNumber();
      }
    };

    const overviewDownload = (filename: string) => `${STATIC_DOWNLOAD_PATH}/overview/${filename}`;

    onMounted(() => {
      // 更新类型和数量
      getDataAndCount(params()).then(updateTypeNumber);
    });
    return {
      ...toRefs(data),
      loading,
      tissueType1,
      tissueType2,
      healthType,
      cellType,
      annotationChange,
      tissueTypeClick,
      healthTypeClick,
      cellTypeClick,
      overviewDownload
    };
  }
});
</script>
