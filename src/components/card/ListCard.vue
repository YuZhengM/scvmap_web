<template>
  <div class="list_card_template">
    <el-card class="box-card" shadow="never">
      <div class="clearfix">
        <span v-text="title"></span>
      </div>
      <div v-for="(list, i) in showData" :key="i" @click="cardClick(list)" :class="list.show ? 'text item active' : 'text item'">
        <span :class="list.show ? 'label active' : 'label'" v-text="list.label"></span>
        <BaseTooltip :content="list.description" v-if="list.description">
          <i class="fas fa-question"></i>
        </BaseTooltip>
        <span class="number" v-text="list.number"></span>
      </div>
      <!-- 分页数据显示 -->
      <Paging :change-page="changePage" :change-size="changeSize" v-if="isPaging" v-show="isShowPaging" :is-simple="true" :pager-count="5" ref="paging"/>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import '@/assets/less/components/card/ListCard.less';
import BaseTooltip from '@/components/tooltip/BaseTooltip.vue';
import { CardList } from '@/service/model/components/card';
import Paging from '@/components/page/Paging.vue';
import ArrayUtil from '@/service/util/base/array';

export default defineComponent({
  name: 'ListCard',
  components: { Paging, BaseTooltip },
  props: {
    // 标题名称
    title: {
      type: String,
      default: () => ('Title')
    },
    // 所有数据
    listCard: {
      type: Array,
      default: () => ([] as Array<CardList>)
    },
    // 执行标签的函数
    listCardClick: {
      type: Function,
      default: () => ([])
    },
    // 是否带有分页
    isPaging: {
      type: Boolean,
      default: () => true
    }
  },
  setup(props) {
    const paging = ref();
    // 设置响应数据
    const data = reactive({
      isShowPaging: true,
      showData: [] as Array<CardList>,
      highlightLabel: {} as CardList
    });
    /**
     * 更新数据
     */
    const dataUpdate = () => {
      if (data.highlightLabel && data.highlightLabel.show) {
        // 需要筛选出来, 保证其他属性更新
        const label: CardList = props.listCard ? (props.listCard.filter((item: any) => item.label === data.highlightLabel.label) as Array<CardList>)[0] : data.highlightLabel;
        // 标签为 true
        label.show = true;
        data.showData = [label];
        data.isShowPaging = false;
      } else {
        data.isShowPaging = true;
        const { length } = props.listCard as Array<CardList>;
        paging.value.total = length;
        // 清空 showData
        ArrayUtil.clear(data.showData);
        // 获取展示数据的开始和结束的范围
        const start = (paging.value.currentPage - 1) * paging.value.pageSize;
        const end = start + paging.value.pageSize > paging.value.total ? paging.value.total : start + paging.value.pageSize;
        // 添加显示数据
        for (let i = start; i < end; i++) {
          data.showData.push(props.listCard[i] as CardList);
        }
      }
    };
    onMounted(() => {
      // 设置分页
      if (props.isPaging) {
        // 初始化每页行数
        paging.value.pageSize = 5;
        dataUpdate();
      }
    });
    // 改变页数
    const changePage = () => {
      dataUpdate();
    };
    // 改变大小
    const changeSize = () => {
      dataUpdate();
    };
    const cardClick = (list: CardList) => {
      // 高亮
      list.show = !list.show;
      data.highlightLabel = list.show ? list : {} as CardList;
      props.listCardClick(list).then(dataUpdate);
    };
    return {
      ...toRefs(data),
      paging,
      cardClick,
      changePage,
      changeSize,
      dataUpdate
    };
  }
});
</script>
