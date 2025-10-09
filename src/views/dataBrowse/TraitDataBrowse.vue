<template>
  <BaseLoading id="trait_data_browse" ref="loading">
    <div class="trait_data_browse">
      <LeftRight :leftWidth="30" :padding="0">
        <template #left>
          <br/>
          <ListCard title="Type" :list-card="typeList" :list-card-click="typeClick" ref="type"/>
          <ListCard title="Category (ICD-10)" :list-card="categoryList" :list-card-click="categoryClick" ref="category"/>
          <ListCard title="Subcategory (ICD-10)" :list-card="subcategoryList" :list-card-click="subcategoryClick" ref="subcategory"/>
          <ListCard title="Source cohort" :list-card="cohortList" :list-card-click="cohortClick" ref="cohort" v-show="method === 'finemap'"/>
        </template>
        <template #right>
          <BaseBr/>
          <BaseTabs active="finemap" :tabs-data="[{ name: 'finemap', title: 'FINEMAP' }, { name: 'susie', title: 'SuSiE' }]" :change="methodChange"/>
          <BaseBr/>
          <BaseTable :update-new-data="tableInformation"
                     :callback-function="callBackFunction"
                     :service-search-width="75"
                     :download-urls="[{
                       title: method === 'finemap' ? 'trait_finemap_info.xlsx' : 'trait_susie_info.xlsx',
                       url: overviewDownload(method === 'finemap' ? 'trait_info.xlsx' : 'trait_info_susie.xlsx')
                     }]"
                     :table-description="tableDescription"
                     ref="table"/>
        </template>
      </LeftRight>
    </div>
  </BaseLoading>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue';
import { DATA_BROWSE_TRAIT_TABLE_DESCRIPTION, STATIC_DOWNLOAD_PATH } from '@/assets/ts';
import DataBrowseApi from '@/api/service/dataBrowseApi';
import BaseTable from '@/components/table/BaseTable.vue';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import LeftRight from '@/components/layout/LeftRight.vue';
import ListCard from '@/components/card/ListCard.vue';
import { CardList } from '@/service/model/components/card';
import ArrayUtil from '@/service/util/base/array';
import { Page } from '@/service/model/reponse/request';
import BaseTabs from '@/components/tabs/BaseTabs.vue';
import BaseBr from '@/components/divider/BaseBr.vue';

export default defineComponent({
  name: 'TraitDataBrowse',
  components: { BaseBr, BaseTabs, ListCard, LeftRight, BaseLoading, BaseTable },
  setup() {
    const loading = ref();
    const type = ref();
    const category = ref();
    const subcategory = ref();
    const cohort = ref();
    const table = ref();
    // Set reactive data
    const data = reactive({
      typeList: [] as Array<CardList>,
      categoryList: [] as Array<CardList>,
      subcategoryList: [] as Array<CardList>,
      cohortList: [] as Array<CardList>,
      typeValue: '',
      categoryValue: '',
      subcategoryValue: '',
      cohortValue: '',
      method: 'finemap'
    });
    const params = (page: Page) => ({
      type: data.typeValue,
      category: data.categoryValue,
      subcategory: data.subcategoryValue,
      cohort: data.cohortValue,
      method: data.method,
      page
    });
    // Add field numbers to the list
    const addFieldNumber = (nowData: Array<CardList>, newData: Array<any>, name?: CardList) => {
      // const oldData = ArrayUtil.deepCopy(nowData) as Array<CardList>;
      // Clear the list
      ArrayUtil.clear(nowData);
      newData.forEach((item: any) => {
        nowData.push({
          label: item.field,
          show: name && item.field === name.label ? name.show : false,
          number: item.number
        });
      });
    };
    // Handle the result data
    const handlerResultData = (res: any, label?: string, name?: CardList) => {
      // Get the data content
      const { typeList, categoryList, subcategoryList, cohortList } = res;
      // Refactor the data
      addFieldNumber(data.typeList, typeList as Array<any>, label === 'type' ? name : undefined);
      addFieldNumber(data.categoryList, categoryList as Array<any>, label === 'category' ? name : undefined);
      addFieldNumber(data.subcategoryList, subcategoryList as Array<any>, label === 'subcategory' ? name : undefined);
      addFieldNumber(data.cohortList, cohortList as Array<any>, label === 'cohort' ? name : undefined);
    };

    // Request data from the backend
    const getDataAndCount = (dataBrowseInfo: any, label?: string, name?: CardList) => {
      // Loading animation
      loading.value.loading = true;
      // Get the data
      return DataBrowseApi.getTraitBrowseData(dataBrowseInfo).then((res: any) => {
        loading.value.loading = false;
        // Get the data content
        handlerResultData(res, label, name);
        return res.dataBrowseDataList;
      });
    };

    // 更新类型和数量
    const updateTypeNumber = () => {
      type.value.dataUpdate();
      category.value.dataUpdate();
      subcategory.value.dataUpdate();
      cohort.value.dataUpdate();
    };

    const typeClick = (name: CardList) => {
      data.typeValue = name.show ? name.label : '';
      table.value.dataUpdate();
    };
    const categoryClick = (name: CardList) => {
      data.categoryValue = name.show ? name.label : '';
      table.value.dataUpdate();
    };
    const subcategoryClick = (name: CardList) => {
      data.subcategoryValue = name.show ? name.label : '';
      table.value.dataUpdate();
    };
    const cohortClick = (name: CardList) => {
      data.cohortValue = name.show ? name.label : '';
      table.value.dataUpdate();
    };

    const methodChange = (tag: any) => {
      data.method = tag.paneName;
      table.value.dataUpdate();
    };

    const overviewDownload = (filename: string) => `${STATIC_DOWNLOAD_PATH}/overview/${filename}`;

    const tableInformation = (page: Page) => getDataAndCount(params(page));

    const callBackFunction = () => {
      updateTypeNumber();
    };

    return {
      ...toRefs(data),
      loading,
      type,
      category,
      subcategory,
      cohort,
      table,
      typeClick,
      categoryClick,
      subcategoryClick,
      cohortClick,
      methodChange,
      tableInformation,
      callBackFunction,
      overviewDownload,
      tableDescription: DATA_BROWSE_TRAIT_TABLE_DESCRIPTION
    };
  }
});
</script>
