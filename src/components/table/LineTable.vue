<template>
  <div class="line_table_template">
    <el-table :data="tableData" border class="table_info">
      <ColumnTable :table-description="tableDescription"/>
    </el-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import '@/assets/less/components/table/LineTable.less';
import { TableHead } from '@/service/model/components/table';
import ColumnTable from '@/components/table/ColumnTable.vue';

export default defineComponent({
  name: 'LineTable',
  components: { ColumnTable },
  props: {
    // 传递的数据
    tableData: {
      type: Array,
      default: () => ([])
    },
    // 传递的数据
    tableDescription: {
      type: Array,
      default: () => ([] as Array<TableHead>)
    }
  },
  setup() {
    return {};
  }
});
</script>
