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
    // 渲染信息: canvas 或者 svg
    renderer: {
      type: String,
      default: () => ('svg')
    },
    // 指定的相关结点
    resizeValue: {
      type: Object,
      default: () => ({
        width: 500,
        height: 500
      })
    },
    // 是否自动绘制图形
    automatic: {
      type: Boolean,
      default: () => true
    },
    // 是否自动绘制图形
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
    // 获取 ref 元素
    const loading = ref();
    const container = ref();
    const expandContainer = ref();
    // 设置响应数据
    const data = reactive({
      // 搜索的内容
      echartsId: StringUtil.randomString(10) as string,
      expandEchartsId: StringUtil.randomString(10) as string,
      expandVisible: false,
      option: {},
      expandOption: {},
      resize: props.resizeValue
    });

    let myChart: ECharts;
    let expandChart: ECharts;
    // 重设宽高
    const resizeEcharts = (resize: Object | undefined) => {
      // 保证容器存在
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

    // 绘制图表
    const drawEcharts = (option: object) => {
      if (option && typeof option === 'object' && myChart) {
        data.option = option;
        myChart.setOption(option as EChartsOption, true);
        setResize();
      }
    };

    // 绘制图表
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
      // 转换类型为 RendererType
      const renderer = props.renderer as RendererType;
      // 基于准备好的 dom, 初始化 echarts 实例
      expandChart = echarts.init(expandContainer.value, undefined, { renderer });
      if (props.isCluster) {
        // @ts-ignore ecStat.transform 这个在 ts 中报错, 忽略下一行一切错误
        echarts.registerTransform(ecStat.transform.clustering);
      }
      if (option && Object.keys(option).length > 0) {
        expandDrawEcharts(option);
        return;
      }
      // 绘制图表
      expandDrawEcharts(Object.keys(data.expandOption).length > 0 ? data.expandOption : data.option);
    };

    const expandOpen = () => {
      Time.delay(() => {
        startExpand(props.expandOption);
      }, 100);
    };

    // 修改样式信息
    onMounted(() => {
      data.option = props.option;
      // 初始化长度和宽度
      container.value.style.width = data.resize.width;
      container.value.style.height = data.resize.height;
      // 转换类型为 RendererType
      const renderer = props.renderer as RendererType;
      // 基于准备好的 dom, 初始化 echarts 实例
      myChart = echarts.init(container.value, undefined, { renderer });
      if (props.isCluster) {
        // @ts-ignore ecStat.transform 这个在 ts 中报错, 忽略下一行一切错误
        echarts.registerTransform(ecStat.transform.clustering);
      }
      // 绘制图表
      if (props.automatic) {
        drawEcharts(data.option);
      }
      // 自动适应大小
      // window.onresize = () => {
      //   // 保证容器存在
      //   setResize();
      // };
    });
    const startLoading = () => {
      loading.value.loading = true;
    };
    const endLoading = () => {
      loading.value.loading = false;
    };
    // 监控
    watch(() => props.option, (newValue) => {
      data.option = newValue;
      drawEcharts(data.option);
    }, {
      immediate: true,
      deep: true
    });
    // 监控
    watch(() => props.expandOption, (newValue) => {
      data.expandOption = newValue;
      expandDrawEcharts(data.expandOption);
    }, {
      immediate: true,
      deep: true
    });
    // 监控
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

<style lang="less">
.echarts_template {
  position: relative;

  .echarts_expand {
    position: absolute;
    display: block;
    font-size: larger;
    cursor: pointer;
    margin-left: -20px;
    z-index: 10;
    left: 100%;
  }
}

</style>
