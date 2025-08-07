<template>
  <div id="home">
    <!-- Simple Search -->
    <SimpleSearch/>
    <div class="line"></div>
    <!-- Countdown Area -->
    <div class="countdownLift">{{ countdown + 1 }}</div>
    <div class="countdownRight">{{ countdown + 1 }}</div>
    <!-- Photo -->
    <BaseImage :url="graphicalAbstractImg" v-if="shift"/>
    <BaseImage :url="overviewImg" v-if="!shift"/>
    <div class="line"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, onUnmounted } from 'vue';
import '@/assets/less/views/Home.less';
import BaseImage from '@/components/image/BaseImage.vue';
import SimpleSearch from '@/views/home/SimpleSearch.vue';

const overview = require('@/assets/img/home/overview.png');
const graphicalAbstract = require('@/assets/img/home/graphical_abstract.png');

export default defineComponent({
  name: 'Home',
  components: {
    SimpleSearch,
    BaseImage
  },
  setup() {
    const data = reactive({
      overviewImg: overview,
      graphicalAbstractImg: graphicalAbstract,
      shift: true,
      countdown: 6
    });

    // Define timer variables
    let timer: any;
    let countdownTimer: any;

    // Function to toggle images
    const toggleImage = () => {
      data.shift = !data.shift;
      data.countdown = 6;
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
