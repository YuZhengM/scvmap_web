<template>
  <div id="statistics">
    <div class="statistics">
      <h2 class="title">
        Statistics
      </h2>
      <el-divider></el-divider>
      <SwitchButton left_text="Display"
                    right_text="Visualization"
                    :left-event="displayEvent"
                    :right-event="visualizationEvent"/>
      <el-divider></el-divider>
      <BaseCard icon="fas fa-list" title="Statistics of fine-mapping results">
        <ArrayTable :table-data="fineMappingResults" :column-pair="2" :is_striped="false" v-show="!isVisualization"/>
        <div v-show="isVisualization">
          <br/>
          <div class="plot">
            <Echarts :resize-value="{ width: 600, height: 400 }" v-show="isVisualization" ref="traitCountECharts"/>
            <Echarts :resize-value="{ width: 500, height: 400 }" v-show="isVisualization" ref="genomePieECharts"/>
          </div>
        </div>
      </BaseCard>
      <BaseBr/>
      <BaseCard icon="fas fa-list" title="Statistics of scATAC-seq data">
        <ArrayTable :table-data="chromatinAccessibility" :is_striped="false" :column-pair="2" v-show="!isVisualization"/>
        <div v-show="isVisualization">
          <br/>
          <div class="plot">
            <div>
              <div class="text-center">Number of annotations in single-cell samples</div>
              <br/>
              <div class="plot">
                <Echarts :resize-value="{ width: 500, height: 500 }" ref="sampleCountECharts"/>
                <Echarts :resize-value="{ width: 300, height: 500 }" ref="cellCountECharts"/>
                <Echarts :resize-value="{ width: 350, height: 500 }" ref="regionCountECharts"/>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
      <BaseBr/>
      <BaseCard icon="fas fa-list" title="Statistics of trait-relevant cell score (TRS) data">
        <ArrayTable :table-data="trsCount" :is_striped="false" :column-pair="2" v-show="!isVisualization"/>
        <div v-show="isVisualization">
          <br/>
          <div class="plot">
            <Echarts :resize-value="{ width: 1100, height: 220 }" ref="pairECharts"/>
            <br/>
          </div>
        </div>
      </BaseCard>
      <BaseBr/>
      <BaseCard icon="fas fa-list" title="Statistics of annotation data">
        <ArrayTable :table-data="annotation" :column-pair="2" :is_striped="false" v-show="!isVisualization"/>
        <div v-show="isVisualization">
          <br/>
          <div class="plot">
            <Echarts :resize-value="{ width: 800, height: 500 }" v-show="isVisualization" ref="annotationECharts"/>
            <Echarts :resize-value="{ width: 400, height: 500 }" v-show="isVisualization" ref="elementECharts"/>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import '@/assets/less/views/Statistics.less';
import ArrayTable from '@/components/table/ArrayTable.vue';
import {
  ANNOTATION,
  CHROMATIN_ACCESSIBILITY,
  FINE_MAPPING_RESULTS,
  echartsBarOption,
  echartsPieOption,
  echartsPopulationPieOption,
  echartsPairPieOption,
  annotationOption,
  STATISTICS_TRS
} from '@/assets/ts';
import BaseBr from '@/components/divider/BaseBr.vue';
import BaseCard from '@/components/card/BaseCard.vue';
import SwitchButton from '@/components/button/SwitchButton.vue';
import Echarts from '@/components/echarts/Echarts.vue';

export default defineComponent({
  name: 'Statistics',
  components: { Echarts, SwitchButton, BaseCard, BaseBr, ArrayTable },
  setup() {
    const sampleCountECharts = ref();
    const cellCountECharts = ref();
    const regionCountECharts = ref();
    const pairECharts = ref();
    const traitCountECharts = ref();
    const genomePieECharts = ref();
    const annotationECharts = ref();
    const elementECharts = ref();

    const data = reactive({
      isVisualization: true,
      chromatinAccessibility: CHROMATIN_ACCESSIBILITY,
      fineMappingResults: FINE_MAPPING_RESULTS,
      trsCount: STATISTICS_TRS,
      annotation: ANNOTATION
    });

    const displayEvent = () => {
      data.isVisualization = false;
    };

    const visualizationEvent = () => {
      data.isVisualization = true;
    };

    const sampleShow = () => {
      sampleCountECharts.value.drawEcharts(echartsBarOption({
        data: ['scATAC-seq sample', 'Tissue type', 'Cell type'],
        value: [183, 20, 206],
        color: '#c8961f'
      }, '10%'));

      cellCountECharts.value.drawEcharts(echartsBarOption({
        data: ['Cell'],
        value: [1342173],
        color: '#1fc86e'
      }, '30%'));

      regionCountECharts.value.drawEcharts(echartsBarOption({
        data: ['Accessible chromatin region'],
        value: [54615438],
        color: '#1f68c8'
      }, '30%'));

      pairECharts.value.drawEcharts(echartsPairPieOption([
        {
          title: 'trait-sample pair count',
          data: [
            { value: 1937588, name: 'SCAVENGE' },
            { value: 1939308, name: 'g-chromVAR' }
          ],
          color: ['#114587', '#158711']
        },
        {
          title: 'trait-cell type pair count',
          data: [
            { value: 13152640, name: 'SCAVENGE' },
            { value: 13163419, name: 'g-chromVAR' }
          ],
          color: ['#111787', '#878111']
        },
        {
          title: 'trait-cell pair count',
          data: [
            { value: 16053257050, name: 'SCAVENGE' },
            { value: 16064377248, name: 'g-chromVAR' }
          ],
          color: ['#601187', '#87114c']
        }
      ]));
    };

    const traitShow = () => {
      traitCountECharts.value.drawEcharts(echartsPopulationPieOption({
        title: 'Population distribution in fine-mapping results',
        data: [
          { value: 30, name: 'SAS' },
          { value: 53, name: 'AFR' },
          { value: 79, name: 'AMR' },
          { value: 289, name: 'EAS' },
          { value: 5108, name: 'EUR' },
          { value: 10325, name: 'UKB' }
        ],
        color: [
          '#2598a3', '#3625a3',
          '#9225a3', '#9fa325',
          '#d86514', '#13c513'
        ],
        text: '15884'
      }));

      genomePieECharts.value.drawEcharts(echartsPieOption({
        title: 'The number of all variants',
        data: [
          { value: 22243178, name: 'hg19' },
          { value: 22240611, name: 'hg38' }
        ],
        color: ['#439c2b', '#256fa3'],
        show: true
      }, 'center'));
    };

    const annotationShow = () => {
      annotationECharts.value.drawEcharts(annotationOption({
        title: 'The number of annotation data',
        xData: ['eQTL', 'Common SNP', 'Risk SNP', 'TE (SEA v3)', 'TE (SEdb v3)', 'SE (SEA v3)', 'SE (dbSUPER)', 'SE (SEdb v3)'],
        yData: [
          [101034022, 37906832, 97080, 2152998, 107116, 65950, 1159763, 24599529],
          [101558011, 37302978, 96950, 2171877, 109304, 65893, 1168518, 24738376]
        ]
      }));
      elementECharts.value.drawEcharts(echartsPieOption({
        title: 'Gene/TF count',
        data: [
          { value: 125456, name: 'Gene' },
          { value: 1176, name: 'TF' }
        ],
        color: ['#0d916e', '#092e8a'],
        show: true
      }, 'center'));
    };

    onMounted(() => {
      sampleShow();
      traitShow();
      annotationShow();
    });

    return {
      ...toRefs(data),
      sampleCountECharts,
      cellCountECharts,
      regionCountECharts,
      pairECharts,
      traitCountECharts,
      genomePieECharts,
      annotationECharts,
      elementECharts,
      displayEvent,
      visualizationEvent
    };
  }
});
</script>
