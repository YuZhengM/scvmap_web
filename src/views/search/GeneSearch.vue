<template>
  <div id="gene_search">
    <LeftRight ref="leftRight">
      <template #left>
        <SelectInput title="Gene" :select-data="geneData" :placeholder="`Please input  e.g. ${geneExample}`" :show-number="100" clearable ref="gene"/>
        <BaseButton :content="buttonContent" :button-click="buttonClick"/>
      </template>
      <template #right>
        <div class="content">
          <span class="font_red">Function introduction:</span> Search for traits/diseases or scATAC-seq data associated with the gene.
          <el-divider></el-divider>
          <span class="font_red">Parameter explanation:</span>
          <p>
            <span class="region">
            1) <strong>Gene</strong>: Please select a gene of interest.
            </span>
          </p>
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
  name: 'GeneSearch',
  components: { SelectInput, BaseButton, LeftRight },
  setup() {
    const router = useRouter();
    const gene = ref();
    const data = reactive({
      geneData: [] as Array<InputSelect>,
      geneExample: 'RCC2'
    });
    const buttonClick = (id: String) => {
      // Click the search button to start the search
      if (id === 'start') {
        if (Base.isNull(gene.value.input)) {
          gene.value.input = data.geneExample;
          ElNotification({ title: 'Default parameter settings', message: `Gene defaults to \`${data.geneExample}\`!`, type: 'info' });
        }

        if (!Base.checkParam(gene.value.input)) {
          return;
        }

        Jump.routerQuery(router, '/gene_detail', {
          gene: gene.value.input
        });
      }
      // Click the example or reset button to set the gene input
      gene.value.input = id === 'reset' ? '' : id === 'example' ? data.geneExample : '';
    };
    const getGeneData = () => {
      ArrayUtil.clear(data.geneData);
      SearchApi.listGene().then((res: any) => {
        (res as Array<string>).forEach((item: string) => {
          // Add SelectInput data
          data.geneData.push({ label: item, value: item, description: item });
        });
      });
    };
    onMounted(() => {
      getGeneData();
    });
    return {
      ...toRefs(data),
      gene,
      buttonClick,
      buttonContent: SEARCH_BUTTON
    };
  }
});
</script>
