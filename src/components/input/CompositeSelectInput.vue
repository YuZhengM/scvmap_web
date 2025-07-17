<template>
  <div class="composite_select_input_template">
    <span class="front" v-if="title || titleSelectData.length > 0">
      <span class="title" v-if="title"> {{ title }} </span>
      <BaseSelect v-if="titleSelectData.length > 0" :select-data="titleSelectData" :change-event="titleChangeEvent" width="100%" is-line ref="searchTitle"/>
    </span>
    <SelectInput :select-data="selectData" :placeholder="placeholder" width="100%" :handleEvent="handleEvent" is-line isAppend ref="searchContent">
      <el-button class="back" @click="searchClick">
        <i class="fa fa-search"></i>
      </el-button>
    </SelectInput>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue';
import { InputSelect } from '@/service/model/components/input';
import '@/assets/less/components/input/CompositeSelectInput.less';
import SelectInput from '@/components/input/SelectInput.vue';
import BaseSelect from '@/components/input/BaseSelect.vue';

export default defineComponent({
  name: 'CompositeSelectInput',
  components: { BaseSelect, SelectInput },
  props: {
    title: {
      type: String,
      default: () => undefined
    },
    selectData: {
      type: Array,
      default: () => [] as Array<InputSelect>
    },
    titleSelectData: {
      type: Array,
      default: () => [] as Array<InputSelect>
    },
    placeholder: {
      type: String,
      default: () => 'Please input'
    },
    handleEvent: {
      type: Function,
      default: () => ({})
    },
    titleChangeEvent: {
      type: Function,
      default: () => ({})
    },
    searchEvent: {
      type: Function,
      default: () => ({})
    }
  },
  setup(props) {
    const searchTitle = ref();
    const searchContent = ref();
    const data = reactive({});
    const searchClick = () => {
      props.handleEvent(searchTitle.value.select, searchContent.value.input);
    };
    return {
      ...toRefs(data),
      searchTitle,
      searchContent,
      searchClick
    };
  }
});
</script>
