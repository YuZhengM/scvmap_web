<template>
  <div class="select_input_template">
    <span class="title" v-html="title" v-if="title"></span>
    <el-autocomplete v-model="input" :fetch-suggestions="querySearch" class="inline-input" :placeholder="placeholder"
                     @select="handleSelect" @clear="clickClear"
                     :style="isLine ? `display: inline-block; width: ${width};` : 'display: block;'" :clearable="clearable">
      <template #default="{ item }">
        <span style="float: left">{{ item.label }}</span>
        &nbsp;
        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.description }}</span>
      </template>
      <template #append v-if="isAppend">
        <slot></slot>
      </template>
    </el-autocomplete>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue';
import '@/assets/less/components/input/SelectInput.less';

export default defineComponent({
  name: 'SelectInput',
  props: {
    title: {
      type: String,
      default: () => undefined
    },
    // 这个数据的 value 属性是显示在页面上的
    selectData: {
      type: Array,
      default: () => [] as Array<any>
    },
    placeholder: {
      type: String,
      default: () => 'Please input'
    },
    handleEvent: {
      type: Function,
      default: () => ({})
    },
    handleClear: {
      type: Function,
      default: () => ({})
    },
    isLine: {
      type: Boolean,
      default: () => false
    },
    isAppend: {
      type: Boolean,
      default: () => false
    },
    clearable: {
      type: Boolean,
      default: () => false
    },
    showNumber: {
      type: Number,
      default: () => -1
    },
    selectType: {
      type: String,
      default: () => 'value'
    },
    width: {
      type: String,
      default: () => '50%'
    }
  },
  setup(props) {
    const data = reactive({
      input: '',
      showData: [] as Array<any>
    });

    const createFilter = (queryString: string) => (data: any) => {
      if (props.selectType === 'value') {
        return data.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
      }
      if (props.selectType === 'description') {
        return data.description.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
      }
    };

    const querySearch = (queryString: string, cb: any) => {
      let results: Array<any> = queryString ? props.selectData.filter(createFilter(queryString)) : props.selectData;
      // call callback function to return suggestions
      results = props.showNumber > 0 ? results?.slice(0, props.showNumber) : results;
      cb(results);
    };

    const handleSelect = (item: any) => props.handleEvent(item);

    const clickClear = () => {
      data.input = '';
      props.handleClear();
    };

    onMounted(() => {
      data.showData = props.showNumber > 0 ? props.selectData?.slice(0, props.showNumber) : props.selectData;
    });
    return {
      ...toRefs(data),
      querySearch,
      handleSelect,
      clickClear
    };
  }
});
</script>
