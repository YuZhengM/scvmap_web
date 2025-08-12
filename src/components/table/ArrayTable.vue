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
    // Passed data, type is Array<KeyValue>
    tableData: {
      type: Array,
      default: () => ([] as Array<KeyValue>)
    },
    // Title content
    title: {
      type: String,
      default: () => undefined
    },
    // Number of pairs
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
    // Create `tr` and `td` elements under the table
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
    // Form the table
    const formatTable = () => {
      const { tableData, columnPair } = props;
      const data = tableData as Array<KeyValue>;
      // Check if the data is empty
      if (tableData?.length === 0) {
        tbody.value.innerHTML = trAddThTd();
        return;
      }
      // Get the number of rows
      let tbodyHtml = '';
      const dataSize: number = tableData?.length;
      const line: number = Math.ceil(dataSize / columnPair);
      // Add content
      for (let i = 0; i < line; i++) {
        const start: number = i * columnPair;
        const end: number = dataSize < (i + 1) * columnPair ? dataSize : (i + 1) * columnPair;
        const keyValues: Array<any> = [];
        // Add content for one row
        for (let j = start; j < end; j++) {
          keyValues.push(String(data[j].key));
          keyValues.push(String(data[j].value));
        }
        tbodyHtml += trAddThTd(keyValues);
      }
      // Copy to the front - end
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
