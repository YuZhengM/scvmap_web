<template>
  <div id="gene_search">
    <LeftRight ref="leftRight">
      <template #left>
        <SelectInput title="TF" :select-data="tfData" :placeholder="`Please input  e.g. ${tfExample}`" :show-number="100" clearable ref="tf"/>
        <BaseButton :content="buttonContent" :button-click="buttonClick"/>
      </template>
      <template #right>
        <div class="content">
          <div class="content">
            <span class="font_red">Function introduction:</span> Search for causal variant data or scATAC-seq data associated with the TF.
            <el-divider></el-divider>
            <span class="font_red">Parameter explanation:</span>
            <p>
              <span class="region">
                1) <strong>TF</strong>: Please select a TF of interest.
              </span>
            </p>
          </div>
        </div>
      </template>
    </LeftRight>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import '@/assets/less/views/Search.less';
import LeftRight from '@/components/layout/LeftRight.vue';
import BaseButton from '@/components/button/BaseButton.vue';
import { SEARCH_BUTTON } from '@/assets/ts';
import Jump from '@/service/util/base/jump';
import Base from '@/service/util/base/base';
import { InputSelect } from '@/service/model/components/input';
import SelectInput from '@/components/input/SelectInput.vue';
import SearchApi from '@/api/service/searchApi';
import ArrayUtil from '@/service/util/base/array';
import { ElNotification } from 'element-plus';

export default defineComponent({
  name: 'TfSearch',
  components: { SelectInput, BaseButton, LeftRight },
  setup() {
    const router = useRouter();
    const tf = ref();
    const data = reactive({
      tfData: [] as Array<InputSelect>,
      tfExample: 'HIF1A'
    });
    const buttonClick = (id: String) => {
      // 点击开始搜索
      if (id === 'start') {
        if (Base.isNull(tf.value.input)) {
          tf.value.input = data.tfExample;
          ElNotification({ title: 'Default parameter settings', message: `TF defaults to \`${data.tfExample}\`!`, type: 'info' });
        }
        Jump.routerQuery(router, '/tf_detail', {
          tf: tf.value.input
        });
      }
      // 点击例子和重设
      tf.value.input = id === 'reset' ? '' : id === 'example' ? data.tfExample : '';
    };
    const getTfData = () => {
      ArrayUtil.clear(data.tfData);
      SearchApi.listTf().then((res: any) => {
        (res as Array<string>).forEach((item: string) => {
          // 添加 SelectInput 数据
          data.tfData.push({ label: item, value: item, description: item });
        });
      });
    };
    onMounted(() => {
      getTfData();
    });
    return {
      ...toRefs(data),
      tf,
      buttonClick,
      buttonContent: SEARCH_BUTTON
    };
  }
});
</script>
