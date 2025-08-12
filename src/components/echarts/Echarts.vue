<template>
  <BaseLoading class="echarts_template" ref="loading">
    <span class="echarts_expand" @click="expandVisible = true">
      <i class="fas fa-expand"></i>
    </span>
    <div :id="echartsId" class="template_echarts" ref="container"></div>
    <el-dialog v-model="expandVisible" @open="expandOpen" :title="expandTitle" :width="`${String(expandWidth)}%`">
      <div :id="expandEchartsId" class="template_echarts" ref="expandContainer"></div>
    </el-dialog>
  </BaseLoading>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue';
import '@/assets/less/components/echarts/Echarts.less';
import * as echarts from 'echarts';
import { ECharts, EChartsOption, RendererType } from '@/service/model/components/echarts';
import StringUtil from '@/service/util/base/string';
import ecStat from 'echarts-stat';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import Base from '@/service/util/base/base';
import Time from '@/service/util/base/time';

export default defineComponent({
  name: 'Echarts',
  components: { BaseLoading },
  props: {
    option: {
      type: Object,
      default: () => ({})
    },
    // Rendering information: canvas or svg
    renderer: {
      type: String,
      default: () => ('svg')
    },
    // Specified related nodes
    resizeValue: {
      type: Object,
      default: () => ({
        width: 500,
        height: 500
      })
    },
    // Whether to draw the graph automatically
    automatic: {
      type: Boolean,
      default: () => true
    },
    // Whether to draw clustered graph
    isCluster: {
      type: Boolean,
      default: () => false
    },
    expandTitle: {
      type: String,
      default: () => ('Zoom in to view:')
    },
    expandOption: {
      type: Object,
      default: () => ({})
    },
    expandWidth: {
      type: Number,
      default: () => 90
    },
    expandHeight: {
      type: Number,
      default: () => 600
    }
  },
  setup(props) {
    // Get ref elements
    const loading = ref();
    const container = ref();
    const expandContainer = ref();
    // Set reactive data
    const data = reactive({
      // Random ID for ECharts instance
      echartsId: StringUtil.randomString(10) as string,
      expandEchartsId: StringUtil.randomString(10) as string,
      expandVisible: false,
      option: {},
      expandOption: {},
      resize: props.resizeValue
    });

    let myChart: ECharts;
    let expandChart: ECharts;
    // Reset width and height
    const resizeEcharts = (resize: Object | undefined) => {
      // Ensure the container exists
      if (container.value && resize) {
        myChart.resize(resize);
      }
    };

    const setResize = () => {
      Base.valueNoNull(data.resize, () => {
        resizeEcharts(data.resize);
      }, () => {
        // eslint-disable-next-line no-console
        console.log('The self-defined value did not have an effect.');
      });
    };

    // Draw the chart
    const drawEcharts = (option: object) => {
      if (option && typeof option === 'object' && myChart) {
        data.option = option;
        myChart.setOption(option as EChartsOption, true);
        setResize();
      }
    };

    // Draw the expanded chart
    const expandDrawEcharts = (option: object) => {
      if (expandContainer.value && option && typeof option === 'object' && expandChart) {
        expandChart.setOption(option as EChartsOption, true);
        expandChart.resize({
          width: 'auto',
          height: props.expandHeight
        });
      }
    };

    const startExpand = (option?: Object) => {
      // expandContainer.value.style.width = props.expandWidth;
      expandContainer.value.style.height = props.expandHeight;
      // Convert type to RendererType
      const renderer = props.renderer as RendererType;
      // Initialize the ECharts instance based on the prepared DOM
      expandChart = echarts.init(expandContainer.value, undefined, { renderer });
      if (props.isCluster) {
        // @ts-ignore ecStat.transform reports an error in TypeScript, ignore all errors on the next line
        echarts.registerTransform(ecStat.transform.clustering);
      }
      if (option && Object.keys(option).length > 0) {
        expandDrawEcharts(option);
        return;
      }
      // Draw the chart
      expandDrawEcharts(Object.keys(data.expandOption).length > 0 ? data.expandOption : data.option);
    };

    const expandOpen = () => {
      Time.delay(() => {
        startExpand(props.expandOption);
      }, 100);
    };

    // Modify style information
    onMounted(() => {
      data.option = props.option;
      // Initialize width and height
      container.value.style.width = data.resize.width;
      container.value.style.height = data.resize.height;
      // Convert type to RendererType
      const renderer = props.renderer as RendererType;
      // Initialize the ECharts instance based on the prepared DOM
      myChart = echarts.init(container.value, undefined, { renderer });
      if (props.isCluster) {
        // @ts-ignore ecStat.transform reports an error in TypeScript, ignore all errors on the next line
        echarts.registerTransform(ecStat.transform.clustering);
      }
      // Draw the chart
      if (props.automatic) {
        drawEcharts(data.option);
      }
      // Auto-adjust size
      // window.onresize = () => {
      //   // Ensure the container exists
      //   setResize();
      // };
    });
    const startLoading = () => {
      loading.value.loading = true;
    };
    const endLoading = () => {
      loading.value.loading = false;
    };
    // Watch for changes
    watch(() => props.option, (newValue) => {
      data.option = newValue;
      drawEcharts(data.option);
    }, {
      immediate: true,
      deep: true
    });
    // Watch for changes
    watch(() => props.expandOption, (newValue) => {
      data.expandOption = newValue;
      expandDrawEcharts(data.expandOption);
    }, {
      immediate: true,
      deep: true
    });
    // Watch for changes
    watch(() => props.resizeValue, (newValue) => {
      data.resize = newValue as any;
      drawEcharts(data.option);
    }, {
      immediate: true,
      deep: true
    });
    return {
      ...toRefs(data),
      loading,
      container,
      expandContainer,
      drawEcharts,
      setResize,
      expandOpen,
      startLoading,
      endLoading
    };
  }
});
</script>
