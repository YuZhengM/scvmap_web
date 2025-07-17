<template>
  <el-table-column v-for="(description, i) in tableDescription" :key="i"
                   :width="description.width ? description.width : ''"
                   :prop="description.column"
                   :label="description.title"
                   sortable stripe align="center">
    <template #header>
      <span v-html="description.title"></span>
      <BaseTooltip placement="top" v-if="description.content" :content="description.content">
        <i class="fas fa-question-circle"></i>
      </BaseTooltip>
    </template>
    <template #default="scope">
      <span v-if="!description.information">
        <a :href="description.href(scope.row)" target="_blank" class="el-link" v-if="description.href">{{ scope.row[description.column] }}</a>
        <span v-if="!description.href">{{ scope.row[description.column] }}</span>
      </span>
      <span v-if="description.information" v-html="description.information(scope.row)"></span>
    </template>
  </el-table-column>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseTooltip from '@/components/tooltip/BaseTooltip.vue';
import { TableHead } from '@/service/model/components/table';

export default defineComponent({
  name: 'ColumnTable',
  props: {
    tableDescription: {
      type: Array,
      default: () => ([] as Array<TableHead>)
    }
  },
  components: { BaseTooltip },
  setup() {
    return {};
  }
});
</script>
