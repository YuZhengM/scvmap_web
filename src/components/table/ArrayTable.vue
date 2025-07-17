<template>
  <BaseLoading class="array_table_template" ref="loading">
    <h3 v-if="title" v-text="title"></h3>
    <table :class="is_striped ? 'table table-hover table-striped' : 'table table-hover'">
      <tbody ref="tbody"></tbody>
    </table>
  </BaseLoading>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import '@/assets/less/components/table/ArrayTable.less';
import { KeyValue } from '@/service/model/data';
import BaseLoading from '@/components/loading/BaseLoading.vue';

export default defineComponent({
  name: 'ArrayTable',
  components: { BaseLoading },
  props: {
    // 传递的数据 类型为 Array<KeyValue>
    tableData: {
      type: Array,
      default: () => ([] as Array<KeyValue>)
    },
    // 标题内容
    title: {
      type: String,
      default: () => undefined
    },
    // 对数
    columnPair: {
      type: Number,
      default: () => 1
    },
    is_striped: {
      type: Boolean,
      default: () => true
    }
  },
  setup(props) {
    // 创建 table 下的 tr td
    const addTh = (content: string) => `<th>${content}</th>`;
    const addTd = (content: string) => `<td>${content}</td>`;
    const addTr = (content: string) => `<tr>${content}</tr>`;
    const trAddThTd = (thTds: Array<any> = []) => {
      let thString = '';
      const { length } = thTds;
      for (let i = 0; i < length; i++) {
        thString += i % 2 === 0 ? addTh(thTds[i]) : addTd(thTds[i]);
      }
      return addTr(thString);
    };
    const loading = ref();
    const tbody = ref();
    // 形成表格
    const formatTable = () => {
      const { tableData, columnPair } = props;
      const data = tableData as Array<KeyValue>;
      // 判断数据是否为空
      if (tableData?.length === 0) {
        tbody.value.innerHTML = trAddThTd();
        return;
      }
      // 获取行数
      let tbodyHtml = '';
      const dataSize: number = tableData?.length;
      const line: number = Math.ceil(dataSize / columnPair);
      // 添加内容
      for (let i = 0; i < line; i++) {
        const start: number = i * columnPair;
        const end: number = dataSize < (i + 1) * columnPair ? dataSize : (i + 1) * columnPair;
        const keyValues: Array<any> = [];
        // 添加一行的内容
        for (let j = start; j < end; j++) {
          keyValues.push(String(data[j].key));
          keyValues.push(String(data[j].value));
        }
        tbodyHtml += trAddThTd(keyValues);
      }
      // 复制到前端
      tbody.value.innerHTML = tbodyHtml;
    };
    const startLoading = () => {
      loading.value.loading = true;
    };
    const endLoading = () => {
      loading.value.loading = false;
    };
    onMounted(() => {
      if (tbody.value) {
        formatTable();
      }
    });
    return {
      loading,
      tbody,
      formatTable,
      startLoading,
      endLoading
    };
  }
});
</script>
