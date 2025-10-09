<template>
  <div id="tf_explore">
    <LeftRight>
      <template #left>
        <span class="title_strategy">TFs:</span>
        <BaseSwitch active-text="Upload a file:" inactive-text="Paste your data:" :is-inline="false" :change-event="fileChange" ref="fileSwitch"/>
        <BaseInput type="textarea" :rows="10" v-show="!isUpload" placeholder="Please input the TFs." ref="fileContent"/>
        <FileUpload :action="uploadAction" :tip-text="fileTip" :file-type="['txt']" :upload-success="uploadSuccess" :file-remove="fileRemove" :max-file-size="20" v-show="isUpload" ref="fileUpload"/>
        <BaseBr/>
        <span class="title_strategy">scATAC-seq:</span>
        <BaseTabs active="snapatac2" :change="graphTfStrategyChange" :tabs-data="TfStrategyData">
          <template #snapatac2>
            <div class="trait_info">
              <BaseSelect title="P value:" clearable :is-line="true" width="62%" :select-data="pValueSelectData" ref="pValue"/>
              <BaseSelect title="Adjusted p value:" clearable :is-line="true" width="62%" :select-data="AdjustedPValueSelectData" ref="adjustedPValue"/>
              <BaseSelect title="Log<sub>2</sub>(Fold change):" clearable :is-line="true" width="62%" :select-data="Log2FoldChangeSelectData" ref="log2FoldChange"/>
            </div>
          </template>
          <template #chromvar>
            <div class="trait_info">
              <BaseSelect title="P value:" clearable :is-line="true" width="62%" :select-data="pValueSelectData" ref="pValueChromvar"/>
              <BaseSelect title="Adjusted p value:" clearable :is-line="true" width="62%" :select-data="AdjustedPValueSelectData" ref="adjustedPValueChromvar"/>
              <BaseSelect title="Mean:" clearable :is-line="true" width="62%" :select-data="MeanSelectData" ref="mean"/>
            </div>
          </template>
        </BaseTabs>
        <BaseBr/>
        <span class="title_strategy">Trait or disease:</span>
        <BaseTabs active="gimme" :change="graphTraitTfStrategyChange" :tabs-data="TraitTfStrategyData">
          <template #gimme>
            <div class="trait_info">
              <BaseSelect title="Co-score:" clearable :is-line="true" width="62%" :select-data="coScoreSelectData" ref="coScore"/>
              <BaseSelect title="Mean score:" clearable :is-line="true" width="62%" :select-data="meanScoreSelectData" ref="meanScore"/>
            </div>
          </template>
          <template #homer>
            <div class="trait_info">
              <BaseSelect title="P value:" clearable :is-line="true" width="62%" :select-data="pValueTraitSelectData" ref="pValueTrait"/>
              <BaseSelect title="Q value:" clearable :is-line="true" width="62%" :select-data="qValueTraitSelectData" ref="qValueTrait"/>
            </div>
          </template>
        </BaseTabs>
        <BaseBr/>
        <BaseButton :content="buttonContent" :button-click="buttonClick"/>
      </template>
      <template #right>
        <span class="title">Analyzing and exploring potential causal variant regulatory mechanisms at single-cell resolution using transcription factors (TFs) as hubs.</span>
        <el-divider></el-divider>
        <div class="content">
          <span class="font_red">Parameter explanation:</span>
          <p>
            <span class="region">
              1) <strong>TFs</strong>: Users can input TFs of interest in two ways. <br/>
              <span class="sub_region">
                <el-icon><CaretRight/></el-icon> <strong>Paste your data</strong>: Enter the TF(s) with "\n" as the line break character.
              </span>
              <span class="sub_region">
                <el-icon><CaretRight/></el-icon> <strong>Upload a file</strong>: Submit a "txt" file containing a TF list separated by "\n".
              </span>
            </span>
            <br />
            <span class="font_red"> scATAC-seq: </span> Screening single-cell samples based on input TFs.
            <span class="region">
              2) <strong>P value</strong>: Select the threshold for P value in cell type differential TFs in single-cell samples.
            </span>
            <span class="region">
              3) <strong>Adjusted p value</strong>: Select the threshold for Adjusted p value in cell type differential TFs in single-cell samples.
            </span>
            <span class="region">
              4) <strong>Log<sub>2</sub>(Fold change)</strong>: Select the threshold for Log<sub>2</sub>(Fold change) in cell type differential TFs in single-cell samples.
            </span>
            <br />
            <span class="font_red"> Trait or disease: </span> Screening traits or diseases based on input TFs. <br/>
            <span class="region">
              5) <strong>P value</strong>: Select the threshold for p value in HOMER enriched TFs.
            </span>
            <span class="region">
              6) <strong>Q value</strong>: Select the threshold for q value in HOMER enriched TFs.
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
import FileUpload from '@/components/upload/FileUpload.vue';
import {
  ANALYSIS_BUTTON_CONTENT,
  FILE_UPLOAD_URL,
  ANALYSIS_LOG2_FOLD_CHANGE_SELECT_DATA,
  DIFFERENCE_TF_ADJUSTED_P_VALUE_DATA,
  HOMER_TF_P_VALUE_DATA,
  HOMER_TF_Q_VALUE_DATA,
  getExampleUrlHtml,
  DIFFERENCE_TF_P_VALUE_DATA,
  DIFFERENCE_GENE_P_VALUE_DATA,
  ANALYSIS_TRAIT_TF_STRATEGY_TABS,
  ANALYSIS_TF_STRATEGY_TABS,
  ANALYSIS_MEAN_SELECT_DATA,
  ANALYSIS_CICERO_CO_SCORE_DATA,
  ANALYSIS_MEAN_SCORE_DATA
} from '@/assets/ts';
import BaseInput from '@/components/input/BaseInput.vue';
import FileApi from '@/api/service/fileApi';
import Base from '@/service/util/base/base';
import BaseSelect from '@/components/input/BaseSelect.vue';
import '@/assets/less/views/analysis/TfExplore.less';
import BaseBr from '@/components/divider/BaseBr.vue';
import BaseButton from '@/components/button/BaseButton.vue';
import LocalhostApi from '@/api/localhost/localhost';
import Jump from '@/service/util/base/jump';
import { useRouter } from 'vue-router';
import Time from '@/service/util/base/time';
import { ElNotification } from 'element-plus';
import { CaretRight } from '@element-plus/icons-vue';
import BaseTabs from '@/components/tabs/BaseTabs.vue';

export default defineComponent({
  name: 'TfExplore',
  components: {
    BaseTabs,
    CaretRight,
    BaseButton,
    BaseBr,
    BaseSelect,
    BaseInput,
    FileUpload,
    BaseSwitch,
    LeftRight
  },
  emits: ['startLoading', 'endLoading'],
  setup(props, content) {
    const router = useRouter();
    const fileSwitch = ref();
    const fileContent = ref();
    const fileUpload = ref();
    const pValue = ref();
    const adjustedPValue = ref();
    const log2FoldChange = ref();
    const pValueChromvar = ref();
    const adjustedPValueChromvar = ref();
    const mean = ref();
    const coScore = ref();
    const meanScore = ref();
    const pValueTrait = ref();
    const qValueTrait = ref();
    const data = reactive({
      isUpload: false,
      fileId: '',
      scTfStrategyValue: 'snapatac2',
      traitTfStrategyValue: 'gimme',
      fileTip: `txt files with a size less than 20MB, ${getExampleUrlHtml('data/tfs.txt', 'Example of Upload File')}`
    });
    // Get the example content
    const getExampleData = () => {
      content.emit('startLoading');
      LocalhostApi.readFile('data/tfs.txt').then((res: any) => {
        content.emit('endLoading');
        fileContent.value.input = res;
      });
    };
    // Load the comparison settings
    const mountSet = () => {
      fileSwitch.value.value = false;
      data.isUpload = false;
    };
    onMounted(() => {
      mountSet();
    });
    // Content is input or upload
    const fileChange = (value: boolean) => {
      data.isUpload = value;
    };
    // Get the fileId after upload
    const uploadSuccess = (fileId: string) => {
      data.fileId = fileId;
    };

    const graphTfStrategyChange = (tag: any) => {
      data.scTfStrategyValue = tag.paneName;
    };

    const graphTraitTfStrategyChange = (tag: any) => {
      data.traitTfStrategyValue = tag.paneName;
    };

    // Remove the uploaded file (delete the file in GridFS)
    const fileRemove = () => {
      if (Base.noNull(data.fileId)) {
        FileApi.deleteFile(data.fileId);
        data.fileId = '';
      }
    };
    // 得到参数
    const getParams = (isFile: number) => ({
      log2FoldChange: log2FoldChange.value.select,
      adjustedPValue: data.scTfStrategyValue === 'snapatac2' ? adjustedPValue.value.select : adjustedPValueChromvar.value.select,
      pvalue: data.scTfStrategyValue === 'snapatac2' ? pValue.value.select : pValueChromvar.value.select,
      qvalueTrait: qValueTrait.value.select,
      pvalueTrait: pValueTrait.value.select,
      chromvarMean: mean.value.select,
      coScore: coScore.value.select,
      meanScore: meanScore.value.select,
      scStrategy: data.scTfStrategyValue,
      traitStrategy: data.traitTfStrategyValue,
      content: fileContent.value.input,
      fileId: data.fileId,
      fileTip: `txt files with a size less than 20MB, ${getExampleUrlHtml('data/tfs.txt', 'Example of Upload File')}`,
      isFile
    });
    const buttonClick = (id: string) => {
      // Click to start the search, reset, or example
      if (id === 'start') {
        // Input information
        if (!fileSwitch.value.value && Base.isNull(fileContent.value.input)) {
          ElNotification({
            title: 'Please check',
            message: 'Please input the TFs!',
            type: 'error'
          });
          return;
        }
        // File information
        if (fileSwitch.value.value && Base.isNull(fileUpload.value.fileList)) {
          ElNotification({
            title: 'Please check',
            message: 'Please input file!',
            type: 'error'
          });
          return;
        }
        if (Base.isNull(pValue.value.select)) {
          pValue.value.select = DIFFERENCE_GENE_P_VALUE_DATA[2].value;
        }
        if (Base.isNull(adjustedPValue.value.select)) {
          adjustedPValue.value.select = DIFFERENCE_TF_ADJUSTED_P_VALUE_DATA[2].value;
        }
        if (Base.isNull(log2FoldChange.value.select)) {
          log2FoldChange.value.select = ANALYSIS_LOG2_FOLD_CHANGE_SELECT_DATA[3].value;
        }
        if (Base.isNull(pValueChromvar.value.select)) {
          pValueChromvar.value.select = DIFFERENCE_GENE_P_VALUE_DATA[2].value;
        }
        if (Base.isNull(adjustedPValueChromvar.value.select)) {
          adjustedPValueChromvar.value.select = DIFFERENCE_TF_ADJUSTED_P_VALUE_DATA[2].value;
        }
        if (Base.isNull(mean.value.select)) {
          mean.value.select = ANALYSIS_MEAN_SELECT_DATA[0].value;
        }
        if (Base.isNull(coScore.value.select)) {
          coScore.value.select = ANALYSIS_CICERO_CO_SCORE_DATA[4].value;
        }
        if (Base.isNull(meanScore.value.select)) {
          meanScore.value.select = ANALYSIS_MEAN_SCORE_DATA[6].value;
        }
        if (Base.isNull(pValueTrait.value.select)) {
          pValueTrait.value.select = HOMER_TF_P_VALUE_DATA[2].value;
        }
        if (Base.isNull(qValueTrait.value.select)) {
          qValueTrait.value.select = HOMER_TF_Q_VALUE_DATA[2].value;
        }
        // Whether to output the content
        if (data.isUpload) {
          content.emit('startLoading');
          Time.awaitPromise(data.fileId, 1000, 5 * 60 * 1000).then(() => {
            content.emit('endLoading');
            // Jump to the result page
            Jump.routerQuery(router, '/analysis_tf', getParams(1));
          });
        } else {
          Jump.routerQuery(router, '/analysis_tf', getParams(0));
        }
      } else if (id === 'reset') {
        mountSet();
        fileUpload.value.fileList = [];
        fileUpload.value.handlerRemove();
        pValue.value.select = '';
        adjustedPValue.value.select = '';
        log2FoldChange.value.select = '';
        pValueChromvar.value.select = '';
        adjustedPValueChromvar.value.select = '';
        mean.value.select = '';
        coScore.value.select = '';
        meanScore.value.select = '';
        pValueTrait.value.select = '';
        qValueTrait.value.select = '';
      } else if (id === 'example') {
        log2FoldChange.value.select = ANALYSIS_LOG2_FOLD_CHANGE_SELECT_DATA[3].value;
        adjustedPValue.value.select = DIFFERENCE_TF_ADJUSTED_P_VALUE_DATA[1].value;
        adjustedPValueChromvar.value.select = DIFFERENCE_TF_ADJUSTED_P_VALUE_DATA[1].value;
        pValue.value.select = DIFFERENCE_TF_P_VALUE_DATA[1].value;
        pValueChromvar.value.select = DIFFERENCE_TF_P_VALUE_DATA[1].value;
        qValueTrait.value.select = HOMER_TF_P_VALUE_DATA[0].value;
        pValueTrait.value.select = HOMER_TF_Q_VALUE_DATA[0].value;
        coScore.value.select = ANALYSIS_CICERO_CO_SCORE_DATA[4].value;
        meanScore.value.select = ANALYSIS_MEAN_SCORE_DATA[6].value;
        mean.value.select = ANALYSIS_MEAN_SELECT_DATA[0].value;
        if (!data.isUpload) {
          getExampleData();
        }
      }
    };
    return {
      ...toRefs(data),
      fileSwitch,
      fileContent,
      fileUpload,
      pValue,
      adjustedPValue,
      log2FoldChange,
      pValueChromvar,
      adjustedPValueChromvar,
      mean,
      coScore,
      meanScore,
      pValueTrait,
      qValueTrait,
      uploadSuccess,
      fileChange,
      fileRemove,
      graphTfStrategyChange,
      graphTraitTfStrategyChange,
      buttonClick,
      uploadAction: FILE_UPLOAD_URL,
      Log2FoldChangeSelectData: ANALYSIS_LOG2_FOLD_CHANGE_SELECT_DATA,
      TfStrategyData: ANALYSIS_TF_STRATEGY_TABS,
      TraitTfStrategyData: ANALYSIS_TRAIT_TF_STRATEGY_TABS,
      AdjustedPValueSelectData: DIFFERENCE_TF_ADJUSTED_P_VALUE_DATA,
      pValueSelectData: DIFFERENCE_TF_P_VALUE_DATA,
      pValueTraitSelectData: HOMER_TF_P_VALUE_DATA,
      qValueTraitSelectData: HOMER_TF_Q_VALUE_DATA,
      coScoreSelectData: ANALYSIS_CICERO_CO_SCORE_DATA,
      meanScoreSelectData: ANALYSIS_MEAN_SCORE_DATA,
      MeanSelectData: ANALYSIS_MEAN_SELECT_DATA,
      buttonContent: ANALYSIS_BUTTON_CONTENT
    };
  }
});
</script>
