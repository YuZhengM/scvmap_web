<template>
  <div id="gene_explore">
    <LeftRight>
      <template #left>
        <span class="title_strategy">Genes:</span>
        <BaseSwitch active-text="Upload a file:" inactive-text="Paste your data:" :is-inline="false" :change-event="fileChange" ref="fileSwitch"/>
        <BaseInput type="textarea" :rows="10" v-show="!isUpload" placeholder="Please input the genes." ref="fileContent"/>
        <FileUpload :action="uploadAction" :tip-text="fileTip" :file-type="['txt']" :upload-success="uploadSuccess" :file-remove="fileRemove" :max-file-size="20" v-show="isUpload" ref="fileUpload"/>
        <BaseBr/>
        <span class="title_strategy">scATAC-seq:</span>
        <div class="trait_info">
          <BaseSelect title="P value:" clearable :is-line="true" width="62%" :select-data="pValueSelectData" ref="pValue"/>
          <BaseSelect title="Adjusted p value:" clearable :is-line="true" width="62%" :select-data="AdjustedPValueSelectData" ref="adjustedPValue"/>
          <BaseSelect title="Log<sub>2</sub>(Fold change):" clearable :is-line="true" width="62%" :select-data="Log2FoldChangeSelectData" ref="log2FoldChange"/>
        </div>
        <BaseBr/>
        <span class="title_strategy">scATAC-seq and Trait or disease (Cicero):</span>
        <div class="trait_info">
          <BaseSelect title="Co-score:"
                      clearable
                      :is-line="true"
                      width="62%"
                      :select-data="coScoreSelectData"
                      ref="coScore"/>
        </div>
        <span class="title_strategy">Trait or disease (MAGMA):</span>
        <div class="trait_info">
          <BaseInput title="Number of SNPs:" type="number" :min="0" :width="200" description="The minimum number of SNPs annotated onto a gene" is-line ref="min"/>
          <BaseSelect title="P value:" clearable :is-line="true" width="62%" :select-data="pValueTraitSelectData" ref="pValueTrait"/>
        </div>
        <BaseBr/>
        <BaseBr/>
        <BaseButton :content="buttonContent" :button-click="buttonClick"/>
      </template>
      <template #right>
        <span class="title">Analyzing and exploring potential causal variant regulatory mechanisms at single-cell resolution using genes as hubs.</span>
        <el-divider></el-divider>
        <div class="content">
          <span class="font_red">Parameter explanation:</span>
          <p>
            <span class="region">
              1) <strong>Genes</strong>: Users can input genes of interest in two ways. <br/>
              <span class="sub_region">
                <el-icon><CaretRight/></el-icon> <strong>Paste your data</strong>: Enter the gene(s) with "\n" as the line break character.
              </span>
              <span class="sub_region">
                <el-icon><CaretRight/></el-icon> <strong>Upload a file</strong>: Submit a "txt" file containing a gene list separated by "\n".
              </span>
            </span>
            <br/>
            <span class="font_red"> scATAC-seq: </span> Screening single-cell samples based on input genes.
            <span class="region">
              2) <strong>P value</strong>: Select the threshold for P value in cell type differential genes in single-cell samples.
            </span>
            <span class="region">
              3) <strong>Adjusted p value</strong>: Select the threshold for Adjusted p value in cell type differential genes in single-cell samples.
            </span>
            <span class="region">
              4) <strong>Log<sub>2</sub>(Fold change)</strong>: Select the threshold for Log<sub>2</sub>(Fold change) in cell type differential genes in single-cell samples.
            </span>
            <br/>
            <span class="font_red"> Trait or disease: </span> Screening traits or diseases based on input genes. <br/>
            <span class="region">
              5) <strong>Number of SNPs</strong>: Select the threshold for the number of SNPs in MAGMA enriched genes.
            </span>
            <span class="region">
              6) <strong>P value</strong>: Select the threshold for P value in MAGMA enriched genes.
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
  DIFFERENCE_GENE_ADJUSTED_P_VALUE_DATA,
  DIFFERENCE_GENE_P_VALUE_DATA,
  MAGMA_GENE_P_VALUE_DATA,
  getExampleUrlHtml, CICERO_CO_SCORE_DATA
} from '@/assets/ts';
import BaseInput from '@/components/input/BaseInput.vue';
import FileApi from '@/api/service/fileApi';
import Base from '@/service/util/base/base';
import BaseSelect from '@/components/input/BaseSelect.vue';
import '@/assets/less/views/analysis/GeneExplore.less';
import BaseBr from '@/components/divider/BaseBr.vue';
import BaseButton from '@/components/button/BaseButton.vue';
import LocalhostApi from '@/api/localhost/localhost';
import Jump from '@/service/util/base/jump';
import { useRouter } from 'vue-router';
import Time from '@/service/util/base/time';
import { ElNotification } from 'element-plus';
import { CaretRight } from '@element-plus/icons-vue';

export default defineComponent({
  name: 'GeneExplore',
  components: {
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
    const log2FoldChange = ref();
    const adjustedPValue = ref();
    const pValue = ref();
    const pValueTrait = ref();
    const coScore = ref();
    const min = ref();
    const data = reactive({
      isUpload: false,
      fileId: '',
      fileTip: `txt files with a size less than 20MB, ${getExampleUrlHtml('data/genes.txt', 'Example of Upload File')}`
    });
    // 得到例子内容
    const getExampleData = () => {
      content.emit('startLoading');
      LocalhostApi.readFile('data/genes.txt').then((res: any) => {
        content.emit('endLoading');
        fileContent.value.input = res;
      });
    };
    // 加载设置信息
    const mountSet = () => {
      fileSwitch.value.value = false;
      data.isUpload = false;
      min.value.input = 1;
    };
    onMounted(() => {
      mountSet();
    });
    // 内容是输入还是上传
    const fileChange = (value: boolean) => {
      data.isUpload = value;
    };
    // 文件上传成功后得到 fileId
    const uploadSuccess = (fileId: string) => {
      data.fileId = fileId;
    };
    // 文件移除(删除远程 MongoDB 中 GridFS)
    const fileRemove = () => {
      if (Base.noNull(data.fileId)) {
        FileApi.deleteFile(data.fileId);
        data.fileId = '';
      }
    };
    // 得到参数
    const getParams = (isFile: number) => ({
      content: fileContent.value.input,
      fileId: data.fileId,
      log2FoldChange: log2FoldChange.value.select,
      adjustedPValue: adjustedPValue.value.select,
      pvalue: pValue.value.select,
      /**
       * This value cannot be passed with the `min` parameter because it conflicts with the `CanvasXpress` package for drawing heat maps in the result page,
       * resulting in an error of `Uncaught (in promise) TypeError: this.min is not a function`. Therefore, it is named `minAngry` here.
       */
      minAngry: min.value.input,
      pvalueTrait: pValueTrait.value.select,
      coScore: coScore.value.select,
      isFile
    });
    const buttonClick = (id: string) => {
      // 点击开始搜索, 重设, 例子
      if (id === 'start') {
        // 输入信息
        if (!fileSwitch.value.value && Base.isNull(fileContent.value.input)) {
          ElNotification({
            title: 'Please check',
            message: 'Please input the genes!',
            type: 'error'
          });
          return;
        }
        // 文件信息
        if (fileSwitch.value.value && Base.isNull(fileUpload.value.fileList)) {
          ElNotification({
            title: 'Please check',
            message: 'Please input file!',
            type: 'error'
          });
          return;
        }
        if (Base.isNull(log2FoldChange.value.select)) {
          log2FoldChange.value.select = 1;
        }
        if (Base.isNull(adjustedPValue.value.select)) {
          adjustedPValue.value.select = DIFFERENCE_GENE_ADJUSTED_P_VALUE_DATA[2].value;
        }
        if (Base.isNull(pValue.value.select)) {
          pValue.value.select = DIFFERENCE_GENE_P_VALUE_DATA[2].value;
        }
        if (Base.isNull(pValueTrait.value.select)) {
          pValueTrait.value.select = MAGMA_GENE_P_VALUE_DATA[1].value;
        }
        if (Base.isNull(min.value.input)) {
          min.value.input = 1;
        }
        if (Base.isNull(coScore.value.select)) {
          coScore.value.select = CICERO_CO_SCORE_DATA[1].value;
        }
        // 判断是否为输出内容
        if (data.isUpload) {
          content.emit('startLoading');
          Time.awaitPromise(data.fileId, 1000, 5 * 60 * 1000).then(() => {
            content.emit('endLoading');
            // 跳转
            Jump.routerQuery(router, '/analysis_gene', getParams(1));
          });
        } else {
          Jump.routerQuery(router, '/analysis_gene', getParams(0));
        }
      } else if (id === 'reset') {
        mountSet();
        fileUpload.value.fileList = [];
        fileUpload.value.handlerRemove();
        fileContent.value.input = '';
        min.value.input = 1;
        log2FoldChange.value.select = '';
        adjustedPValue.value.select = '';
        pValue.value.select = '';
        pValueTrait.value.select = '';
      } else if (id === 'example') {
        log2FoldChange.value.select = 1;
        adjustedPValue.value.select = DIFFERENCE_GENE_ADJUSTED_P_VALUE_DATA[2].value;
        pValue.value.select = DIFFERENCE_GENE_P_VALUE_DATA[2].value;
        pValueTrait.value.select = MAGMA_GENE_P_VALUE_DATA[1].value;
        coScore.value.select = CICERO_CO_SCORE_DATA[1].value;
        min.value.input = 1;
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
      log2FoldChange,
      adjustedPValue,
      pValue,
      pValueTrait,
      coScore,
      min,
      uploadSuccess,
      fileChange,
      fileRemove,
      buttonClick,
      uploadAction: FILE_UPLOAD_URL,
      Log2FoldChangeSelectData: ANALYSIS_LOG2_FOLD_CHANGE_SELECT_DATA,
      AdjustedPValueSelectData: DIFFERENCE_GENE_ADJUSTED_P_VALUE_DATA,
      pValueSelectData: DIFFERENCE_GENE_P_VALUE_DATA,
      pValueTraitSelectData: MAGMA_GENE_P_VALUE_DATA,
      coScoreSelectData: CICERO_CO_SCORE_DATA,
      buttonContent: ANALYSIS_BUTTON_CONTENT
    };
  }
});
</script>
