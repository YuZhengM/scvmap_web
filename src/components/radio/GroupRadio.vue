<template>
  <div class="group_radio_template">
    <el-radio-group v-model="radio" @change="change">
      <el-radio-button v-for="(radio, i) in radioData" :key="i" :label="radio.label">
        {{ radio.title }}
      </el-radio-button>
    </el-radio-group>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import { RadioGroup } from '@/service/model/components/radio';

export default defineComponent({
  name: 'GroupRadio',
  props: {
    radioData: {
      type: Array,
      default: () => [] as Array<RadioGroup>
    },
    eventChange: {
      type: Function,
      default: () => ({})
    }
  },
  setup(props) {
    const data = reactive({
      radio: ''
    });
    const change = (value: string) => {
      props.eventChange(value);
    };
    return {
      ...toRefs(data),
      change
    };
  }
});
</script>
