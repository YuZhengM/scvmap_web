<template>
  <div id="multi_trait">
    <LeftRight>
      <template #left>
        <BaseLoading ref="sampleLoading">
          <BaseSelect :select-data="sampleData" title="Select sample" placeholder="Sample   eg: GSE129785_TME-All" :change-event="sampleChange" width="100%" ref="sample"/>
        </BaseLoading>
        <BaseBr/>
        <BaseLoading ref="traitLoading">
          <MultiSelectInput title="Select traits" placeholder="Sample   eg: mono, AB1_ERYSIPELAS, hct, plt," is-description :select-data="traitData" ref="trait"/>
        </BaseLoading>
        <BaseBr/>
        <BaseButton :content="buttonContent" :button-click="buttonClick"/>
      </template>
      <template #right>
        <span class="title">Performing a comprehensive analysis by integrating a single scATAC-seq sample with various causal variant data.</span>
        <el-divider></el-divider>
        <div class="content">
          <span class="font_red">Parameter explanation:</span>
          <p>
            <span class="region">
              1) <strong>Select sample</strong>: Select a scATAC-seq sample.
            </span>
            <span class="region">
              2) <strong>Select traits</strong>: Select more traits or diseases.
            </span>
          </p>
        </div>
      </template>
    </LeftRight>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import LeftRight from '@/components/layout/LeftRight.vue';
import '@/assets/less/views/analysis/MultiTrait.less';
import { ANALYSIS_BUTTON_CONTENT } from '@/assets/ts';
import Base from '@/service/util/base/base';
import Jump from '@/service/util/base/jump';
import { useRouter } from 'vue-router';
import BaseBr from '@/components/divider/BaseBr.vue';
import ArrayUtil from '@/service/util/base/array';
import { InputSelect } from '@/service/model/components/input';
import BaseButton from '@/components/button/BaseButton.vue';
import BaseSelect from '@/components/input/BaseSelect.vue';
import DataBrowseApi from '@/api/service/dataBrowseApi';
import MultiSelectInput from '@/components/input/MultiSelectInput.vue';
import AnalysisApi from '@/api/service/analysisApi';
import BaseLoading from '@/components/loading/BaseLoading.vue';

export default defineComponent({
  name: 'MultiTrait',
  components: { BaseLoading, MultiSelectInput, BaseSelect, BaseBr, BaseButton, LeftRight },
  setup() {
    const router = useRouter();
    const sampleLoading = ref();
    const sample = ref();
    const traitLoading = ref();
    const trait = ref();

    const data = reactive({
      sampleData: [] as Array<InputSelect>,
      traitData: [] as Array<InputSelect>,
      exampleIdList: [
        'trait_id_48',
        'trait_id_894',
        'trait_id_895',
        'trait_id_897',
        'trait_id_899',
        'trait_id_1494',
        'trait_id_1495',
        'trait_id_1496',
        'trait_id_2448',
        'trait_id_6118',
        'trait_id_8687',
        'trait_id_14561',
        'trait_id_15763'
      ]
    });

    const listSample = async () => {
      // Clear
      ArrayUtil.clear(data.sampleData);
      sampleLoading.value.loading = true;
      traitLoading.value.loading = true;
      return DataBrowseApi.getSampleBrowseData().then((res: any) => {
        sampleLoading.value.loading = false;
        (res.dataBrowseDataList as Array<any>).forEach((item: any) => {
          // Add SelectInput data
          data.sampleData.push({ label: item.label, value: item.sampleId, description: `${item.sampleId} (${item.tissueType})`, id: item.sampleId });
        });
        sample.value.select = 'sample_id_1';
      });
    };

    const listTrait = () => {
      // Clear
      ArrayUtil.clear(data.traitData);
      AnalysisApi.listTraitBySampleId(sample.value.select).then((res: any) => {
        traitLoading.value.loading = false;
        (res as Array<any>).forEach((item: any) => {
          // Add SelectInput data
          data.traitData.push({ label: item.traitCode, value: item.traitId, description: `${item.trait}-(${item.traitId}) (${item.sourceName})`, id: item.traitId });
        });
        trait.value.setShowData(data.traitData);
      });
    };

    const sampleChange = () => {
      listTrait();
    };

    const buttonClick = (id: string) => {
      // Click the start button to start the analysis, reset the input, and use the example traits
      if (id === 'start') {
        if (Base.isNull(sample.value.select)) {
          sample.value.select = 'sample_id_1';
        }
        if (trait.value.input.length <= 0) {
          trait.value.input = data.exampleIdList;
        }

        const traitIdList = trait.value.input.filter((item: string) => item.startsWith('trait_id'));
        const traitCodeList = trait.value.input.filter((item: string) => !item.startsWith('trait_id'));
        const traitIdList2 = data.traitData.filter((item: any) => traitCodeList.indexOf(item.label) > -1).map((item: any) => item.value);

        Jump.routerQuery(router, '/analysis_multi_trait', {
          sampleId: sample.value.select,
          traitIdList: [...traitIdList, ...traitIdList2]
        });
      } else if (id === 'reset') {
        sample.value.select = '';
        trait.value.input = [];
      } else if (id === 'example') {
        // Define the default sample ID value
        sample.value.select = 'sample_id_1';
        trait.value.input = data.traitData.filter((item: any) => data.exampleIdList.indexOf(item.value) > -1).map((item: any) => item.label);
      }
    };

    onMounted(async () => {
      await listSample();
      listTrait();
    });

    return {
      ...toRefs(data),
      sampleLoading,
      sample,
      traitLoading,
      trait,
      sampleChange,
      buttonClick,
      buttonContent: ANALYSIS_BUTTON_CONTENT
    };
  }
});
</script>
