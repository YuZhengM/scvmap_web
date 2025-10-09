<template>
  <div id="sample_comparative">
    <LeftRight>
      <template #left>
        <span class="title_strategy">Comparison of</span>
        <BaseSwitch active-text="scATAC-seq:" inactive-text="trait or disease:" :is-inline="false" :change-event="compareChange" ref="compareSwitch"/>
        <BaseBr/>
        <BaseSelect title="Single cell sample:" :select-data="sampleData" placeholder="Sample   eg: GSE129785_TME-All" width="100%" ref="sample" v-show="!isScSample"/>
        <SelectInput title="Trait:"
                     :select-data="traitData"
                     placeholder="Please input  e.g. trait_id_14527"
                     :handle-event="traitChange"
                     :show-number="100"
                     clearable
                     ref="trait"
                     v-show="isScSample"/>
        <BaseBr/>
        <span class="title_strategy">Compare data:</span>
        <div class="compare_info">
          <BaseSelect title="Select sample1:" :select-data="sampleData" placeholder="Sample   eg: GSE174367_scATAC_Ref" width="100%" ref="sample1" v-show="isScSample"/>
          <BaseSelect title="Select sample2:" :select-data="sampleData" placeholder="Sample   eg: GSM5292875" width="100%" ref="sample2" v-show="isScSample"/>
          <SelectInput title="Select Trait1:"
                       :select-data="traitData"
                       placeholder="Please input  e.g. trait_id_894"
                       :handle-event="trait1Change"
                       :show-number="100"
                       select-type="description"
                       clearable ref="trait1"
                       v-show="!isScSample"/>
          <SelectInput title="Select Trait2:"
                       :select-data="traitData"
                       placeholder="Please input  e.g. trait_id_1495"
                       :handle-event="trait2Change"
                       :show-number="100"
                       select-type="description"
                       clearable ref="trait2"
                       v-show="!isScSample"/>
        </div>
        <BaseBr/>
        <BaseButton :content="buttonContent" :button-click="buttonClick"/>
      </template>
      <template #right>
        <span class="title">Comparative analysis between samples or traits.</span>
        <el-divider></el-divider>
        <div class="content">
          <span class="font_red">Parameter explanation:</span>
          <p>
            <span class="region">
              1) <strong>Comparison of</strong>: Users can choose the type of data to compare. <br/>
              <span class="sub_region">
                <el-icon><CaretRight/></el-icon> <strong>scATAC-seq</strong>: Compare the similarities and differences between two single-cell samples in the same trait or disease.
              </span>
              <span class="sub_region">
                <el-icon><CaretRight/></el-icon> <strong>trait or disease</strong>: Compare the similarities and differences between two traits or diseases in the same single-cell sample.
              </span>
            </span>
            <br />
            <span class="font_red" v-if="isScSample">Comparison of scATAC-seq: </span>
            <span class="region" v-if="isScSample">
              2) <strong>Trait</strong>: Choose a trait of interest.
            </span>
            <span class="region" v-if="isScSample">
              3) <strong>Select sample1</strong>: Choose a comparative scATAC-seq sample.
            </span>
            <span class="region" v-if="isScSample">
              4) <strong>Select sample2</strong>: Choose another scATAC-seq sample for comparison.
            </span>
            <span class="font_red" v-if="!isScSample">Comparison of trait or disease: </span>
            <span class="region" v-if="!isScSample">
              2) <strong>Single cell sample</strong>: Choose a scATAC-seq sample of interest.
            </span>
            <span class="region" v-if="!isScSample">
              3) <strong>Select trait1</strong>: Choose a comparative trait.
            </span>
            <span class="region" v-if="!isScSample">
              4) <strong>Select trait2</strong>: Choose another trait for comparison.
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
import BaseSwitch from '@/components/switch/BaseSwitch.vue';
import {
  ANALYSIS_BUTTON_CONTENT
} from '@/assets/ts';
import Base from '@/service/util/base/base';
import BaseSelect from '@/components/input/BaseSelect.vue';
import '@/assets/less/views/analysis/SampleComparative.less';
import BaseBr from '@/components/divider/BaseBr.vue';
import BaseButton from '@/components/button/BaseButton.vue';
import Jump from '@/service/util/base/jump';
import { useRouter } from 'vue-router';
import { CaretRight } from '@element-plus/icons-vue';
import { InputSelect } from '@/service/model/components/input';
import ArrayUtil from '@/service/util/base/array';
import DataBrowseApi from '@/api/service/dataBrowseApi';
import AnalysisApi from '@/api/service/analysisApi';
import SelectInput from '@/components/input/SelectInput.vue';

export default defineComponent({
  name: 'SampleComparative',
  components: {
    SelectInput,
    CaretRight,
    BaseButton,
    BaseBr,
    BaseSelect,
    BaseSwitch,
    LeftRight
  },
  emits: ['startLoading', 'endLoading'],
  setup() {
    const router = useRouter();
    const compareSwitch = ref();
    const sample = ref();
    const sample1 = ref();
    const sample2 = ref();
    const trait1 = ref();
    const trait2 = ref();
    const trait = ref();
    const data = reactive({
      traitId: '',
      traitId1: '',
      traitId2: '',
      isScSample: true,
      sampleData: [] as Array<InputSelect>,
      traitData: [] as Array<InputSelect>
    });

    const listSample = async () => {
      // Clear
      ArrayUtil.clear(data.sampleData);
      return DataBrowseApi.getSampleBrowseData().then((res: any) => {
        (res.dataBrowseDataList as Array<any>).forEach((item: any) => {
          // Add SelectInput data
          data.sampleData.push({ label: item.label, value: item.sampleId, description: `${item.sampleId} (${item.tissueType})`, id: item.sampleId });
        });
        sample.value.select = 'sample_id_1';
      });
    };

    const listTrait = async () => {
      // Clear
      ArrayUtil.clear(data.traitData);
      return AnalysisApi.listTrait().then((res: any) => {
        (res as Array<any>).forEach((item: any) => {
          // Add SelectInput data
          data.traitData.push({ label: item.traitAbbr, value: item.traitAbbr, description: `${item.trait} (${item.traitId})`, id: item.traitId });
        });
      });
    };

    // Load the comparison settings
    const mountSet = () => {
      compareSwitch.value.value = true;
      data.isScSample = true;
    };

    onMounted(() => {
      mountSet();
      listSample();
      listTrait();
    });

    // Content is input or upload
    const compareChange = (value: boolean) => {
      data.isScSample = value;
    };
    const traitChange = (value: InputSelect) => {
      data.traitId = value.id as string;
    };
    const trait1Change = (value: InputSelect) => {
      data.traitId1 = value.id as string;
    };
    const trait2Change = (value: InputSelect) => {
      data.traitId2 = value.id as string;
    };

    const buttonClick = (id: string) => {
      // Click to start the search, reset, or example
      if (id === 'start') {
        // Input information
        if (data.isScSample) {
          if (Base.isNull(trait.value.input)) {
            data.traitId = 'trait_id_14527';
          }
          if (Base.isNull(sample1.value.select)) {
            sample1.value.select = 'sample_id_20';
          }
          if (Base.isNull(sample2.value.select)) {
            sample2.value.select = 'sample_id_38';
          }
        } else {
          if (Base.isNull(sample.value.select)) {
            sample.value.select = 'sample_id_1';
          }
          if (Base.isNull(trait1.value.input)) {
            data.traitId1 = 'trait_id_894';
          }
          if (Base.isNull(trait2.value.input)) {
            data.traitId2 = 'trait_id_1495';
          }
        }
        // Check if the output content is valid
        if (data.isScSample) {
          Jump.routerQuery(router, '/analysis_compare_sc', {
            traitId: data.traitId,
            sampleId1: sample1.value.select,
            sampleId2: sample2.value.select
          });
        } else {
          Jump.routerQuery(router, '/analysis_compare_trait', {
            sampleId: sample.value.select,
            traitId1: data.traitId1,
            traitId2: data.traitId2
          });
        }
      } else if (id === 'reset') {
        mountSet();
        sample.value.select = '';
        trait.value.select = '';
        sample1.value.select = '';
        sample2.value.select = '';
        trait1.value.input = '';
        trait2.value.input = '';
      } else if (id === 'example') {
        sample.value.select = 'sample_id_1';
        trait.value.input = 'trait_id_14527';
        sample1.value.select = 'sample_id_20';
        sample2.value.select = 'sample_id_38';
        trait1.value.input = 'trait_id_894';
        trait2.value.input = 'trait_id_1495';
        data.traitId = 'trait_id_14527';
        data.traitId1 = 'trait_id_894';
        data.traitId2 = 'trait_id_894';
      }
    };
    return {
      ...toRefs(data),
      compareSwitch,
      sample,
      sample1,
      sample2,
      trait,
      trait1,
      trait2,
      compareChange,
      traitChange,
      trait1Change,
      trait2Change,
      buttonClick,
      buttonContent: ANALYSIS_BUTTON_CONTENT
    };
  }
});
</script>
