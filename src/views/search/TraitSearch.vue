<template>
  <div id="trait_search">
    <LeftRight ref="leftRight">
      <template #left>
        <BaseSwitch active-text="Category:" inactive-text="Source cohort:" :change-event="fileChange" ref="fileSwitch"/>
        <SelectInput title="Category (ICD-10)"
                     :select-data="categoryData"
                     :handle-event="categoryClick"
                     clearable
                     :handle-clear="categoryClearClick"
                     placeholder="Please input  e.g. II Neoplasms (C00-D48)"
                     v-show="isCategory"
                     ref="category"/>
        <SelectInput title="Subcategory (ICD-10)"
                     :select-data="subcategoryData"
                     placeholder="Please input  e.g. All"
                     clearable
                     v-show="isCategory && isSubCategory"
                     ref="subcategory"/>
        <BaseSelect title="Cohort" :select-data="sourceData" :change-event="sourceChange" width="100%" placeholder="eg: source_id_2" ref="source" v-show="!isCategory"/>
        <BaseButton :content="buttonContent" :button-click="buttonClick"/>
        <div class="content">
          <span class="font_red">Function introduction:</span>
          <span v-if="!isCategory">
            The source of data submitted by the user obtains traits/diseases.
          </span>
          <span v-if="isCategory">
            User submitted data category to obtain traits/diseases.
          </span>
          <el-divider></el-divider>
          <span class="font_red">Parameter explanation:</span>
          <p v-if="!isCategory">
            <span class="region">
              1) <strong>Cohort</strong>: which dataset does this trait come from.
            </span>
          </p>
          <p v-if="isCategory">
            <span class="region">
              1) <strong>Category (ICD-10)</strong>: The major category to which the trait or disease belongs.
            </span>
            <span class="region">
              2) <strong>Subcategory (ICD-10)</strong>: Subclass to which the trait or disease belongs.
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
import BaseSelect from '@/components/input/BaseSelect.vue';
import BaseSwitch from '@/components/switch/BaseSwitch.vue';
import SelectInput from '@/components/input/SelectInput.vue';
import { ElNotification } from 'element-plus';

export default defineComponent({
  name: 'TraitSearch',
  components: { SelectInput, BaseSwitch, BaseSelect, Echarts, BaseButton, LeftRight },
  setup() {
    const router = useRouter();
    const leftRight = ref();
    const fileSwitch = ref();
    const category = ref();
    const subcategory = ref();
    const source = ref();
    const echarts = ref();
    const data = reactive({
      isCategory: true,
      isSubCategory: false,
      categoryData: [] as Array<InputSelect>,
      subcategoryData: [] as Array<InputSelect>,
      sourceData: [] as Array<InputSelect>,
      echartsCategoryOption: {},
      echartsCohortOption: {}
    });
    const buttonClick = (id: String) => {
      // 点击开始搜索
      if (id === 'start') {
        if (data.isCategory) {
          if (Base.isNull(category.value.input)) {
            category.value.input = 'II Neoplasms (C00-D48)';
            ElNotification({ title: 'Default parameter settings', message: 'Category (ICD-10) defaults to `II Neoplasms (C00-D48)`!', type: 'info' });
          }
          if (data.isSubCategory) {
            if (Base.isNull(subcategory.value.input)) {
              subcategory.value.input = 'All';
              ElNotification({ title: 'Default parameter settings', message: 'Subcategory (ICD-10) defaults to `All`!', type: 'info' });
            }
          }
        } else if (Base.isNull(source.value.select)) {
          source.value.select = 'source_id_2';
          ElNotification({ title: 'Default parameter settings', message: 'Cohort defaults to `UKBB`!', type: 'info' });
        }
        Jump.routerQuery(router, '/search_trait', data.isCategory ? (data.isSubCategory ? {
          category: category.value.input,
          subcategory: subcategory.value.input
        } : {
          category: category.value.input
        }) : {
          sourceId: source.value.select
        });
      } else if (id === 'reset') {
        category.value.input = '';
        subcategory.value.input = '';
        source.value.select = '';
      } else if (id === 'example') {
        source.value.select = 'source_id_2';
        if (data.isCategory) {
          category.value.input = 'II Neoplasms (C00-D48)';
          data.isSubCategory = true;
          subcategory.value.input = 'All';
        } else {
          source.value.select = 'source_id_2';
        }
      }
    };

    const sourceDataHandler = (result: Array<any>) => {
      // 清空
      ArrayUtil.clear(data.sourceData);
      // 添加 All
      const echartsData: any[] = [];
      result.forEach((item: any) => {
        // 添加 SelectInput 数据
        data.sourceData.push({ label: item.id, value: item.id, description: `${item.name}(${item.source})` });
        echartsData.push({ name: item.name, value: item.filterCount });
      });
      // echarts
      data.echartsCohortOption = pieCountOption(echartsData, 'Cohort');
    };

    const sourceClick = () => {
      SearchApi.listSourceInfo().then((res: any) => sourceDataHandler(res as Array<any>));
    };

    const getData = () => {
      // 清空
      ArrayUtil.clear(data.categoryData);
      // 添加 All
      SearchApi.listCategory().then((res: any) => {
        const echartsData: any[] = [];
        (res as Array<any>).forEach((item: any) => {
          // 添加 SelectInput 数据
          data.categoryData.push({ label: item.field, value: item.field, description: item.number });
          echartsData.push({ name: item.field, value: item.number });
        });
        // echarts
        data.echartsCategoryOption = pieCountOption(echartsData, 'Category');
        echarts.value.drawEcharts(data.echartsCategoryOption);
      });
    };

    const categoryClick = () => {
      data.isSubCategory = Base.noNull(category.value.input);
      if (data.isSubCategory) {
        // 清空
        ArrayUtil.clear(data.subcategoryData);
        subcategory.value.input = '';
        data.subcategoryData.push({ label: 'All', value: 'All' });
        // 添加 All
        SearchApi.listSubcategoryByCategory(category.value.input).then((res: any) => {
          (res as Array<any>).forEach((item: any) => {
            data.subcategoryData.push({ label: item.field, value: item.field, description: item.number });
          });
        });
      }
    };

    const categoryClearClick = categoryClick;

    const sourceChange = () => {
      categoryClick();
    };

    const fileChange = (value: boolean) => {
      data.isCategory = value;
      if (value) {
        echarts.value.drawEcharts(data.echartsCategoryOption);
      } else {
        echarts.value.drawEcharts(data.echartsCohortOption);
      }
    };

    onMounted(() => {
      sourceClick();
      getData();
    });

    return {
      ...toRefs(data),
      leftRight,
      source,
      fileSwitch,
      category,
      subcategory,
      echarts,
      fileChange,
      categoryClick,
      categoryClearClick,
      sourceChange,
      buttonClick,
      resizeEcharts: () => echarts.value.setResize(),
      buttonContent: SEARCH_BUTTON
    };
  }
});
</script>
