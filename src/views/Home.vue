<template>
  <div id="home">
    <!-- Simple Search -->
    <SimpleSearch/>
    <div class="line"></div>
    <!-- Countdown Area -->
    <div class="countdownLift">{{ countdown + 1 }}</div>
    <div class="countdownRight">{{ countdown + 1 }}</div>
    <!-- Photo -->
    <BaseImage fit="fill" :url="graphicalAbstractImg" v-if="shift"/>
    <BaseImage fit="fill" :url="overviewImg" v-if="!shift"/>
    <div class="line"></div>
    <BaseCard title="Publication" icon="fas fa-rectangle-list">
      Yu ZM, Qian FC, Fang QL, Meng XY, Li YY, Feng CC, Li LD, Li BL, Feng YR, Jiang H, Wang QY, Fan X, Guo JC, Li CQ.
      <strong>scVMAP: a comprehensive platform for integrating single-cell chromatin accessibility regions with causal variants. </strong>
      <i>Nucleic Acids Res</i>.
      2026 Jan 6;54(D1):D1270-D1280.
      doi: <a href="http://doi.org/10.1093/nar/gkaf1112" target="_blank">10.1093/nar/gkaf1112</a>.
      PMID: <a href="https://pubmed.ncbi.nlm.nih.gov/41171141/" target="_blank">41171141</a>.
      PMCID: <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12807677/" target="_blank">PMC12807677</a>.
    </BaseCard>
    <div class="line"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, onUnmounted } from 'vue';
import '@/assets/less/views/Home.less';
import BaseImage from '@/components/image/BaseImage.vue';
import SimpleSearch from '@/views/home/SimpleSearch.vue';
import BaseCard from '@/components/card/BaseCard.vue';

const overview = require('@/assets/img/home/overview.png');
const graphicalAbstract = require('@/assets/img/home/graphical_abstract.png');

export default defineComponent({
  name: 'Home',
  components: {
    BaseCard,
    SimpleSearch,
    BaseImage
  },
  setup() {
    const data = reactive({
      overviewImg: overview,
      graphicalAbstractImg: graphicalAbstract,
      shift: true,
      countdown: 15,
      totalNumber: 15
    });

    // Define timer variables
    let timer: any;
    let countdownTimer: any;

    // Function to toggle images
    const toggleImage = () => {
      data.shift = !data.shift;
      data.countdown = data.totalNumber;
    };

    // Countdown function
    const startCountdown = () => {
      countdownTimer = setInterval(() => {
        if (data.countdown > 0) {
          data.countdown--;
        }
      }, 1000);
    };

    // Start the timer when the component is mounted
    onMounted(() => {
      timer = setInterval(toggleImage, data.countdown * 1000);
      startCountdown();
    });

    // Clear the timer when the component is unmounted
    onUnmounted(() => {
      clearInterval(timer);
      clearInterval(countdownTimer);
    });

    return {
      ...toRefs(data)
    };
  }
});
</script>
