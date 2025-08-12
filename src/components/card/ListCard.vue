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
      <!-- Paging data display -->
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
    // Title name
    title: {
      type: String,
      default: () => ('Title')
    },
    // All data
    listCard: {
      type: Array,
      default: () => ([] as Array<CardList>)
    },
    // Execute the function of the label
    listCardClick: {
      type: Function,
      default: () => ([])
    },
    // Whether to include pagination
    isPaging: {
      type: Boolean,
      default: () => true
    }
  },
  setup(props) {
    const paging = ref();
    // Set the response data
    const data = reactive({
      isShowPaging: true,
      showData: [] as Array<CardList>,
      highlightLabel: {} as CardList
    });
    /**
     * Update data
     */
    const dataUpdate = () => {
      if (data.highlightLabel && data.highlightLabel.show) {
        // Need to filter out, ensure that other attributes are updated
        const label: CardList = props.listCard ? (props.listCard.filter((item: any) => item.label === data.highlightLabel.label) as Array<CardList>)[0] : data.highlightLabel;
        // Label is true
        label.show = true;
        data.showData = [label];
        data.isShowPaging = false;
      } else {
        data.isShowPaging = true;
        const { length } = props.listCard as Array<CardList>;
        paging.value.total = length;
        // Clear showData
        ArrayUtil.clear(data.showData);
        // Get the start and end range of the displayed data
        const start = (paging.value.currentPage - 1) * paging.value.pageSize;
        const end = start + paging.value.pageSize > paging.value.total ? paging.value.total : start + paging.value.pageSize;
        // Add display data
        for (let i = start; i < end; i++) {
          data.showData.push(props.listCard[i] as CardList);
        }
      }
    };
    onMounted(() => {
      // Set pagination
      if (props.isPaging) {
        // Initialize the number of rows per page
        paging.value.pageSize = 5;
        dataUpdate();
      }
    });
    // Change the page
    const changePage = () => {
      dataUpdate();
    };
    // Change the size
    const changeSize = () => {
      dataUpdate();
    };
    const cardClick = (list: CardList) => {
      // Highlight
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
