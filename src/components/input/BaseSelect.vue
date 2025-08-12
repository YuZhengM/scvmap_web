<template>
  <div class="base_select_template">
    <span class="title" v-if="title">
      <span v-html="title"></span>
      <BaseTooltip placement="top" v-if="description" :content="description">
        <i class="fas fa-question-circle"></i>
      </BaseTooltip>
    </span>
    <el-select v-model="select" :placeholder="placeholder" @change="change" :style="isLine ? `display: inline-block;width: ${width};` : `display: block;width: ${width};`" :clearable="clearable">
      <el-option v-for="item in selectData" :key="item.value" :label="item.label" :value="item.value">
        <!-- Cannot use class to specify here, because this is generated in the sibling node of #app and cannot be specified normally -->
        <span style="float: left">{{ item.label }}</span>
        &nbsp;
        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.description }}</span>
      </el-option>
    </el-select>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue';
import '@/assets/less/components/input/BaseSelect.less';
import { InputSelect } from '@/service/model/components/input';
import BaseTooltip from '@/components/tooltip/BaseTooltip.vue';

export default defineComponent({
  name: 'BaseSelect',
  components: { BaseTooltip },
  props: {
    title: {
      type: String,
      default: () => undefined
    },
    selectData: {
      type: Array,
      default: () => [] as Array<InputSelect>
    },
    description: {
      type: String,
      default: () => undefined
    },
    placeholder: {
      type: String,
      default: () => 'Please select'
    },
    width: {
      type: String,
      default: () => '60%'
    },
    changeEvent: {
      type: Function,
      default: () => ({})
    },
    isLine: {
      type: Boolean,
      default: () => false
    },
    clearable: {
      type: Boolean,
      default: () => false
    }
  },
  setup(props) {
    const data = reactive({
      select: '' as String | number
    });
    const change = (value: any) => props.changeEvent(value);
    // Get default information
    const defaultData = (props.selectData as Array<InputSelect>)?.filter((value: InputSelect) => value.default);
    onMounted(() => {
      // select
      if (defaultData.length > 0) {
        data.select = defaultData[0].value;
      }
    });
    return {
      ...toRefs(data),
      change
    };
  }
});
</script>
