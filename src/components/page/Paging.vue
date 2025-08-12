<template>
  <div class="paging_template">
    <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :pager-count="pagerCount"
        :page-size="pageSize"
        :layout="isSimple ? simpleLayout : layout"
        :total="total">
    </el-pagination>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import '@/assets/less/components/page/Paging.less';

export default defineComponent({
  name: 'Paging',
  props: {
    // Change the current page
    changePage: {
      type: Function,
      default: () => ({})
    },
    // Change the page size
    changeSize: {
      type: Function,
      default: () => ({})
    },
    // Whether to use simple mode
    isSimple: {
      type: Boolean,
      default: () => false
    },
    // Maximum number of page buttons
    pagerCount: {
      type: Number,
      default: () => 7
    },
    // Dropdown list of page sizes
    pageSizes: {
      type: Array,
      default: () => [10, 25, 45, 50, 75, 100]
    },
    // Display layout
    layout: {
      type: String,
      default: () => 'total, sizes, prev, pager, next, jumper'
    }
  },
  setup(props) {
    const data = reactive({
      // Current page number
      currentPage: 1,
      // Number of items per page
      pageSize: props.pageSizes[0],
      // Total number of items
      total: 100,
      simpleLayout: 'prev, pager, next'
    });
    // Switch the number of rows displayed per page
    const handleSizeChange = (value: number) => {
      // Assign value
      data.pageSize = value;
      props.changeSize(value);
    };
    // Switch the current page
    const handleCurrentChange = (value: number) => {
      data.currentPage = value;
      props.changePage(value);
    };
    return {
      ...toRefs(data),
      handleSizeChange,
      handleCurrentChange
    };
  }
});
</script>
