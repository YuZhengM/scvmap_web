<template>
  <div id="variant_search">
    <LeftRight ref="leftRight">
      <template #left>
        <BaseInput title="SNP" placeholder="Please input  e.g. rs57142672" :show-number="100" clearable ref="snp"/>
        <BaseButton :content="buttonContent" :button-click="buttonClick"/>
      </template>
      <template #right>
        <div class="content">
          <span class="font_red">Function introduction:</span> Search for traits or diseases through `rsID`.
          <el-divider></el-divider>
          <span class="font_red">Parameter explanation:</span>
          <p>
            <span class="region">
            1) <strong>SNP</strong>: Please select a rsID of variant.
            </span>
          </p>
        </div>
      </template>
    </LeftRight>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import '@/assets/less/views/Search.less';
import LeftRight from '@/components/layout/LeftRight.vue';
import BaseButton from '@/components/button/BaseButton.vue';
import { SEARCH_BUTTON } from '@/assets/ts';
import Jump from '@/service/util/base/jump';
import Base from '@/service/util/base/base';
import { ElNotification } from 'element-plus';
import BaseInput from '@/components/input/BaseInput.vue';

export default defineComponent({
  name: 'VariantSearch',
  components: { BaseInput, BaseButton, LeftRight },
  setup() {
    const router = useRouter();
    const snp = ref();
    const buttonClick = (id: String) => {
      // Click the search button to start the search
      if (id === 'start') {
        if (Base.isNull(snp.value.input)) {
          snp.value.input = 'rs57142672';
          ElNotification({ title: 'Default parameter settings', message: 'SNP defaults to `rs57142672`!', type: 'info' });
        }
        Jump.routerQuery(router, '/variant_detail', {
          variant: snp.value.input
        });
      }
      // Click the example or reset button to set the SNP value
      snp.value.input = id === 'reset' ? '' : id === 'example' ? 'rs57142672' : '';
    };
    return {
      snp,
      buttonClick,
      buttonContent: SEARCH_BUTTON
    };
  }
});
</script>
