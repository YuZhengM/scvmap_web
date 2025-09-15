<template>
  <div id="trait_box_plot">
    <BaseLoading ref="loading">
      <Echarts :resize-value="resize" ref="echarts"/>
    </BaseLoading>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue';
import StringUtil from '@/service/util/base/string';
import { traitBoxOption } from '@/assets/ts';
import BaseLoading from '@/components/loading/BaseLoading.vue';
import Echarts from '@/components/echarts/Echarts.vue';

export default defineComponent({
  name: 'TraitBoxPlot',
  components: { Echarts, BaseLoading },
  props: {
    boxData: {
      type: Object,
      default: () => ({})
    },
    label: {
      type: String,
      default: () => ('')
    }
  },
  setup(props) {
    const loading = ref();
    const echarts = ref();
    const data = reactive({
      clusterId: StringUtil.randomString(10),
      resize: {
        width: 1000,
        height: 350
      }
    });

    const calculateAverage = (arr: number[]): number => {
      const sum = arr.reduce((prev, next) => prev + next, 0);
      return sum / arr.length;
    };

    const showPlot = () => {
      const { color, extraText } = props.boxData;
      if (echarts.value && extraText) {
        const cellTypes = [...new Set(extraText)];

        const values = [] as any[];
        const colors: Array<string> = [
          '#f6b84b', '#fa7552', '#46d3e7', '#1199e5',
          '#44d26c', '#bf2e7b', '#f25e5e',
          '#83c9b1', '#42a0dd',
          '#21b279', '#599c7b', '#bee9c5', '#e97659',
          '#eda58d', '#f1e3d7',
          '#264891', '#3884ce', '#0ed4cb', '#67d29d',
          '#b7c0a5', '#deb48c', '#323337', '#a2abd6',
          '#4e5fb9', '#fcc9ce',
          '#b3a092', '#96add7', '#956f62', '#986925',
          '#fae6cb', '#cad9e0', '#79962c',
          '#507525', '#006851', '#fee3b8'
        ];

        cellTypes.forEach(() => values.push([]));
        for (let i = 0; i < extraText.length; i++) {
          values[cellTypes.indexOf(extraText[i])].push(color[i]);
        }

        const dataPlot: Array<any> = [];
        for (let i = 0; i < cellTypes.length; i++) {
          values[i].sort((a: number, b: number) => a - b);

          let mid;

          if (values[i].length === 1) {
            mid = values[i][values[i].length - 1];
          } else if (values[i].length === 2) {
            mid = (values[i][0] + values[i][1]) / 2;
          } else if (values[i].length % 2 === 0) {
            mid = (values[i][values[i].length / 2] + values[i][values[i].length / 2 + 1]) / 2;
          } else {
            mid = values[i][(values[i].length + 1) / 2];
          }

          let up4;
          let down4;

          if (values[i].length <= 4) {
            up4 = Math.min.apply(null, values[i]);
            down4 = calculateAverage(values[i]);
          } else {
            up4 = values[i][Math.ceil(values[i].length / 4)];
            down4 = values[i][Math.ceil(values[i].length * 0.75)];
          }

          dataPlot.push({
            value: [
              Math.min.apply(null, values[i]),
              up4,
              mid,
              down4,
              Math.max.apply(null, values[i])
            ],
            name: cellTypes[i],
            itemStyle: {
              color: colors[i]
            }
          });
        }
        // 根据中位数降序排序
        dataPlot.sort((a: any, b: any) => b.value[2] - a.value[2]);
        // echarts
        data.resize = {
          width: loading.value.$el.clientWidth - 50,
          height: 260
        };
        echarts.value.drawEcharts(traitBoxOption(dataPlot, props.label));
        echarts.value.setResize();
      }
    };
    const startLoading = () => {
      loading.value.loading = true;
    };
    const endLoading = () => {
      loading.value.loading = false;
    };
    onMounted(() => {
      showPlot();
    });
    // 监控
    watch(() => ({ value1: props.label, value2: props.boxData }), () => {
      showPlot();
    }, {
      immediate: true,
      deep: true
    });
    return {
      ...toRefs(data),
      loading,
      echarts,
      startLoading,
      endLoading,
      showPlot
    };
  }
});
</script>
