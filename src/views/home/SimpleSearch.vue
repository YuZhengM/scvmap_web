<template>
  <div id="simple_search">
    <div class="title"> Welcome to {{ name }} <sub>{{ version }}</sub></div>
    <div class="introduction">
      A comprehensive platform for human
      <strong> integrating </strong>
      <span class="font_red"> single-cell chromatin accessibility data </span> with
      <span class="font_red"> causal variants</span>.
    </div>
    <div class="search">
      <CompositeSelectInput :placeholder="placeholder" :title-select-data="titleData" :title-change-event="titleChangeEvent" :handle-event="searchEvent"/>
    </div>
    <div class="example">
      Example:
      <span v-for="(item, i) in exampleData" :key="i" @click="exampleClick(item)">
        {{ item.label }}: {{ item.value }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import {
  PROJECT_NAME,
  PROJECT_VERSION,
  HOME_TITLE_DATA,
  HOME_EXAMPLE_DATA
} from '@/assets/ts';
import '@/assets/less/views/home/SimpleSearch.less';
import CompositeSelectInput from '@/components/input/CompositeSelectInput.vue';
import Jump from '@/service/util/base/jump';
import Json from '@/service/util/base/json';
import { useRouter } from 'vue-router';
import { ElNotification } from 'element-plus';
import Base from '@/service/util/base/base';

export default defineComponent({
  name: 'SimpleSearch',
  components: { CompositeSelectInput },
  setup() {
    const router = useRouter();

    const data = reactive({
      placeholder: 'Please input  e.g. trait_id_894  (Default to all)'
    });

    const titleChangeEvent = (item: any) => {
      if (item === 'trait') {
        data.placeholder = 'Please input  e.g. trait_id_894  (Default to all)';
      } else if (item === 'sample') {
        data.placeholder = 'Please input  e.g. sample_id_1  (Default to all)';
      } else if (item === 'gene') {
        data.placeholder = 'Please input  e.g. RCC2';
      } else if (item === 'tf') {
        data.placeholder = 'Please input  e.g. HIF1A';
      } else if (item === 'variant') {
        data.placeholder = 'Please input  e.g. rs57142672';
      }
    };

    const searchEvent = (title: string, value: string) => {
      let paramValue: string;

      if (value === '') {
        switch (title) {
          case 'trait':
            paramValue = 'Trait or disease ==> All data';
            break;
          case 'sample':
            paramValue = 'scATAC-seq sample ==> All data';
            break;
          case 'gene':
            paramValue = 'RCC2';
            break;
          case 'tf':
            paramValue = 'HIF1A';
            break;
          case 'variant':
            paramValue = 'rs57142672';
            break;
          default:
            paramValue = 'trait_id_894';
            break;
        }
        ElNotification({ title: 'Search', message: `The default value is ${paramValue}!`, type: 'info' });
      } else {
        paramValue = value;
      }

      if (!Base.checkParam(paramValue)) {
        return;
      }

      if (title === 'trait' || title === 'sample') {
        Jump.routerBlank(router, '/simple_search', { title, value: paramValue });
      } else {
        const params = {};
        Json.addItem(params, title, paramValue);
        Jump.routerBlank(router, `/${title}_detail`, params);
      }
    };

    const exampleClick = (item: any) => {
      searchEvent(item.label.toLowerCase(), item.id);
    };

    return {
      ...toRefs(data),
      name: PROJECT_NAME,
      version: PROJECT_VERSION,
      titleData: HOME_TITLE_DATA,
      exampleData: HOME_EXAMPLE_DATA,
      titleChangeEvent,
      searchEvent,
      exampleClick
    };
  }
});
</script>
