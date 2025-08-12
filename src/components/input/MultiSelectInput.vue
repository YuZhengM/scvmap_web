<template>
  <div class="multi_select_input_template">
    <span class="title" v-text="title" v-if="title"></span>
    <el-select
        v-model="input"
        multiple
        filterable
        default-first-option
        :reserve-keyword="false"
        :placeholder="placeholder"
        :filter-method="filterMethod"
        :multiple-limit="maxSelectNumber"
        @change="change"
        :style="isLine ? `width: ${width}; display: inline-block;` : 'display: block;'"
        v-if="isMounted"
    >

      <div v-infinite-scroll="load" class="infinite-list" style="overflow: hidden">
        <el-option v-for="item in showData" :key="item.value" :value="item.value" :label="item.label">
          <template #default>
            {{ item.label }}
            <span class="description" v-if="isDescription">
              {{ item.description }}
            </span>
          </template>
        </el-option>
      </div>

    </el-select>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { InputSelect } from '@/service/model/components/input';
import '@/assets/less/components/input/MultiSelectInput.less';

export default defineComponent({
  name: 'MultiSelectInput',
  props: {
    title: {
      type: String,
      default: () => undefined
    },
    // The value property of this data is displayed on the page
    selectData: {
      type: Array,
      default: () => [] as Array<InputSelect>
    },
    placeholder: {
      type: String,
      default: () => 'Please input'
    },
    width: {
      type: String,
      default: () => '80%'
    },
    isLine: {
      type: Boolean,
      default: () => false
    },
    isDescription: {
      type: Boolean,
      default: () => false
    },
    maxSelectNumber: {
      type: Number,
      default: () => 3000
    },
    changeEvent: {
      type: Function,
      default: () => ({})
    }
  },
  setup(prop) {
    const isMounted = ref(false);

    const data = reactive({
      input: [],
      showData: [] as Array<InputSelect>,
      allData: [] as Array<InputSelect>,
      start: 50,
      addCount: 50,
      record: 50
    });

    const change = (value: string[]) => {
      const dataList = prop.selectData?.filter((item: any) => value.indexOf(item.value) >= 0);
      prop.changeEvent(dataList);
    };

    const load = () => {
      const { length } = data.allData;
      const end = data.record + data.addCount > length ? length : data.record + data.addCount;
      for (let i = data.record; i < end; i++) {
        data.showData.push(data.allData[i] as InputSelect);
      }
      data.record = end;
    };

    const setShowData = (dataInfo: Array<InputSelect>) => {
      data.allData = dataInfo;
      const { length } = dataInfo;
      if (length <= data.start) {
        data.showData = dataInfo as Array<InputSelect>;
      } else {
        for (let i = 0; i < data.start; i++) {
          data.showData.push(dataInfo[i] as InputSelect);
        }
      }
    };

    const createFilter = (queryString: string) => (data: any) => (data.description.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);

    const filterMethod = (value: any) => {
      const results: Array<any> = value ? prop.selectData.filter(createFilter(value)) : prop.selectData;
      // call callback function to return suggestions
      data.showData = data.start > 0 ? results?.slice(0, data.start) : results;
    };

    onMounted(() => {
      data.record = data.start;
      // Handle this to prevent the error "el[SCOPE] is undefined"
      isMounted.value = true;
    });

    return {
      ...toRefs(data),
      isMounted,
      change,
      load,
      filterMethod,
      setShowData
    };
  }
});
</script>
