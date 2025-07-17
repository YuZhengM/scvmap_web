<template>
  <BaseLoading id="trait_data_browse" ref="loading">
    <div class="trait_data_browse">
      <LeftRight :leftWidth="30" :padding="0">
        <template #left>
          <br/>
          <ListCard title="Type" :list-card="typeList" :list-card-click="typeClick" ref="type"/>
          <ListCard title="Category (ICD-10)" :list-card="categoryList" :list-card-click="categoryClick" ref="category"/>
          <ListCard title="Subcategory (ICD-10)" :list-card="subcategoryList" :list-card-click="subcategoryClick" ref="subcategory"/>
          <ListCard title="Source cohort" :list-card="cohortList" :list-card-click="cohortClick" ref="cohort"/>
        </template>
        <template #right>
          <BaseTable :update-new-data="tableInformation"
                     :callback-function="callBackFunction"
                     :service-search-width="85"
                     :download-url="overviewDownload('trait_info.xlsx')"
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

export default defineComponent({
  name: 'TraitDataBrowse',
  components: { ListCard, LeftRight, BaseLoading, BaseTable },
  setup() {
    const loading = ref();
    const type = ref();
    const category = ref();
    const subcategory = ref();
    const cohort = ref();
    const table = ref();
    // 设置响应数据
    const data = reactive({
      typeList: [] as Array<CardList>,
      categoryList: [] as Array<CardList>,
      subcategoryList: [] as Array<CardList>,
      cohortList: [] as Array<CardList>,
      typeValue: '',
      categoryValue: '',
      subcategoryValue: '',
      cohortValue: '',
      tableDescription: DATA_BROWSE_TRAIT_TABLE_DESCRIPTION
    });
    const params = (page: Page) => ({
      type: data.typeValue,
      category: data.categoryValue,
      subcategory: data.subcategoryValue,
      cohort: data.cohortValue,
      page
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
      const { typeList, categoryList, subcategoryList, cohortList } = res;
      // 重构数据
      addFieldNumber(data.typeList, typeList as Array<any>, label === 'type' ? name : undefined);
      addFieldNumber(data.categoryList, categoryList as Array<any>, label === 'category' ? name : undefined);
      addFieldNumber(data.subcategoryList, subcategoryList as Array<any>, label === 'subcategory' ? name : undefined);
      addFieldNumber(data.cohortList, cohortList as Array<any>, label === 'cohort' ? name : undefined);
    };

    // 向后台请求数据
    const getDataAndCount = (dataBrowseInfo: any, label?: string, name?: CardList) => {
      // 加载动画
      loading.value.loading = true;
      // 获取数据
      return DataBrowseApi.getTraitBrowseData(dataBrowseInfo).then((res: any) => {
        loading.value.loading = false;
        // 获得数据内容
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
      tableInformation,
      callBackFunction,
      overviewDownload
    };
  }
});
</script>
