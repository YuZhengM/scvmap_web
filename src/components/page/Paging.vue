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
    // 改变页数
    changePage: {
      type: Function,
      default: () => ({})
    },
    // 改变页数大小
    changeSize: {
      type: Function,
      default: () => ({})
    },
    // 是否为简单形式
    isSimple: {
      type: Boolean,
      default: () => false
    },
    // 最大页码按钮数
    pagerCount: {
      type: Number,
      default: () => 7
    },
    // 下拉页数列表
    pageSizes: {
      type: Array,
      default: () => [10, 25, 45, 50, 75, 100]
    },
    // 显示的样式
    layout: {
      type: String,
      default: () => 'total, sizes, prev, pager, next, jumper'
    }
  },
  setup(props) {
    const data = reactive({
      // 当前页数
      currentPage: 1,
      // 每页的显示数量
      pageSize: props.pageSizes[0],
      // 总数量
      total: 100,
      simpleLayout: 'prev, pager, next'
    });
    // 切换每页显示的行数
    const handleSizeChange = (value: number) => {
      // 赋值
      data.pageSize = value;
      props.changeSize(value);
    };
    // 切换页数
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
