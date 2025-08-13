<template>
  <div id="variant_detail">
    <el-affix :offset="51">
      <BaseSelect title="Genome:" :select-data="genomeData" width="20%" is-line :change-event="genomeChange" ref="genome"/>
    </el-affix>
    <el-divider></el-divider>
    <SingleCard :title="{ icon: 'fas fa-list', content: 'Trait or disease information' }" ref="singleCard1">
      <BaseTable :table-data="TraitData" :is-service-paging="false" :before-column-number="7" :table-description="tableDescription" ref="traitTable">
        <template #default>
          <el-table-column label="The third Category" stripe align="center" width="250">
            <template #default="scope">
              <BaseTooltip placement="top" :content="scope.row.threeCategory">
                <span>{{ scope.row.threeCategory.length > 25 ? `${scope.row.threeCategory.substring(0, 25)}...` : scope.row.threeCategory }}</span>
              </BaseTooltip>
            </template>
          </el-table-column>
        </template>
      </BaseTable>
    </SingleCard>
    <br/>
    <SingleCard :title="{ icon: 'fas fa-list', content: `${variant}-relevant regulatory network` }" ref="singleCard2">
      <Echarts :resize-value="graphResize" ref="echarts" v-show="isShowPlot"/>
      <div v-show="!isShowPlot">No relevant data for visualization.</div>
    </SingleCard>
    <br/>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Base from '@/service/util/base/base';
import Jump from '@/service/util/base/jump';
import '@/assets/less/views/Detail.less';
import VariantDetailApi from '@/api/service/variantDetailApi';
import SingleCard from '@/components/card/SingleCard.vue';
import BaseTable from '@/components/table/BaseTable.vue';
import {
  ANALYSIS_GENOME_DATA,
  GENE_DETAIL_GENOME_TABS,
  VARIANT_DETAIL_TRAIT_TABLE_DESCRIPTION,
  variantGraphCircularOption,
  variantGraphOption
} from '@/assets/ts';
import Echarts from '@/components/echarts/Echarts.vue';
import BaseSelect from '@/components/input/BaseSelect.vue';
import BaseTooltip from '@/components/tooltip/BaseTooltip.vue';
import { ElNotification } from 'element-plus';

export default defineComponent({
  name: 'VariantDetail',
  components: {
    BaseTooltip,
    BaseSelect,
    Echarts,
    BaseTable,
    SingleCard
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const singleCard1 = ref();
    const singleCard2 = ref();
    const echarts = ref();
    const genome = ref();

    const data = reactive({
      genomeValue: 'hg19' as string,
      variant: '' as string,
      isShowPlot: true as boolean,
      traitId: '' as string,
      TraitData: [] as Array<any>,
      graphResize: {
        width: 1100,
        height: 800
      }
    });

    const getTraitInfo = () => {
      singleCard1.value.startLoading();
      VariantDetailApi.listTraitByRsId(data.variant, genome.value.select).then((res: any) => {
        singleCard1.value.endLoading();
        data.TraitData = res;
      });
    };

    const getGraph = () => {
      echarts.value.startLoading();
      VariantDetailApi.getVariantRelevanceGraph(data.variant, genome.value.select).then((res: any) => {
        echarts.value.endLoading();
        data.isShowPlot = res.nodes != null && res.nodes.length > 0;
        if (data.isShowPlot) {
          if (res.nodes.length > 50) {
            res.nodes.forEach((element: any) => {
              element.symbolSize = 20;
            });
            res.links.forEach((element: any) => {
              element.lineStyle.width = 1;
            });
            echarts.value.drawEcharts(variantGraphOption(res));
          } else {
            echarts.value.drawEcharts(variantGraphCircularOption(res));
          }
        }
      });
    };

    const overviewChange = (tag: any) => {
      data.genomeValue = tag.paneName;
    };

    const genomeChange = () => {
      getTraitInfo();
      getGraph();
    };

    onMounted(() => {
      if (Base.isNull(route.query.variant)) {
        Jump.routerDefault(router, '/');
        ElNotification({
          title: 'Please check',
          message: `${route.fullPath}: The path is not feasible!`,
          type: 'error'
        });
      }

      if (!Base.checkParam(route.query.variant)) {
        Jump.routerDefault(router, '/');
      }

      data.variant = route.query.variant as string;
      genome.value.select = 'hg19';
      getTraitInfo();
      getGraph();
    });
    return {
      ...toRefs(data),
      singleCard1,
      singleCard2,
      echarts,
      genome,
      overviewChange,
      genomeChange,
      genomeData: ANALYSIS_GENOME_DATA,
      tableDescription: VARIANT_DETAIL_TRAIT_TABLE_DESCRIPTION,
      genomeTabs: GENE_DETAIL_GENOME_TABS
    };
  }
});
</script>
