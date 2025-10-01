<template>
  <div id="on_line">
    <LeftRight :padding="0" :left-width="30" is-equal-height ref="leftRight">
      <template #left>
        <h2 class="on_line_title">
          On-line analysis
        </h2>
      </template>
      <template #right>
        <el-button class="table_style"><a :href="`on_line_information`" target="_blank"> View all tasks </a></el-button>
      </template>
    </LeftRight>
    <el-divider></el-divider>
    <div class="on_line_content">
      <el-row :gutter="24">
        <el-col :span="8" class="col_content">
          <BaseInput title="E-mail:" clearable :width="250" is-line placeholder="Please input your e-mail." ref="email"/>
        </el-col>
        <el-col :span="6" class="col_content">
          <BaseSelect title="Genome: " clearable is-line width="60%" :select-data="genomeData" ref="genome"/>
        </el-col>
        <el-col :span="10" class="col_content">
          <BaseInput title="Counts layer name:" clearable :width="250" is-line placeholder="Default is `counts`." ref="layer"/>
        </el-col>
      </el-row>
      <BaseBr/>
      <LeftRight ref="leftRight">
        <template #left>
          <div class="upload_title">Upload scATAC-seq data:</div>
          <FileUpload :action="uploadAction"
                      :tip-text="scFileTip"
                      :file-type="['rds']"
                      :upload-success="scUploadSuccess"
                      :file-remove="scFileRemove"
                      :max-file-size="1024"
                      ref="scFileUpload"/>
        </template>
        <template #right>
          <div class="upload_title">Upload trait data:</div>
          <FileUpload :action="uploadAction"
                      :tip-text="variantFileTip"
                      :file-type="['txt','bed']"
                      :upload-success="variantUploadSuccess"
                      :file-remove="variantFileRemove"
                      :max-file-size="100"
                      ref="variantFileUpload"/>
        </template>
      </LeftRight>
    </div>
    <el-divider></el-divider>
    <div class="div_analysis">
      <el-button class="analysis_button button-3d" @click="buttonClick"> Analysis</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import '@/assets/less/views/OnLine.less';
import LeftRight from '@/components/layout/LeftRight.vue';
import { ANALYSIS_GENOME_DATA, FILE_UPLOAD_URL, getExampleUrlHtml, STATIC_DOWNLOAD_PATH } from '@/assets/ts';
import Jump from '@/service/util/base/jump';
import Base from '@/service/util/base/base';
import { InputSelect } from '@/service/model/components/input';
import { ElNotification } from 'element-plus';
import FileUpload from '@/components/upload/FileUpload.vue';
import FileApi from '@/api/service/fileApi';
import BaseSelect from '@/components/input/BaseSelect.vue';
import BaseInput from '@/components/input/BaseInput.vue';
import BaseBr from '@/components/divider/BaseBr.vue';

export default defineComponent({
  name: 'OnLine',
  components: { BaseBr, BaseInput, BaseSelect, FileUpload, LeftRight },
  setup() {
    const router = useRouter();
    const genome = ref();
    const layer = ref();
    const scFileUpload = ref();
    const variantFileUpload = ref();
    const email = ref();
    const data = reactive({
      geneData: [] as Array<InputSelect>,
      scFileId: '',
      variantFileId: '',
      scFileTip: `rds files with a size less than 1G, ${getExampleUrlHtml(`${STATIC_DOWNLOAD_PATH}/example/GSE139369_ELM_sim_0.6_ATAC.rds`, 'Example of Upload File')}`,
      variantFileTip: `txt/bed files with a size less than 100MB, ${getExampleUrlHtml(`${STATIC_DOWNLOAD_PATH}/variant/hg19/BBJ_Mono_55.bed`, 'Example of Upload File')}`
    });

    // File upload success, get fileId
    const scUploadSuccess = (fileId: string) => {
      data.scFileId = fileId;
    };
    const variantUploadSuccess = (fileId: string) => {
      data.variantFileId = fileId;
    };
    // File remove(delete GridFS in MongoDB)
    const scFileRemove = () => {
      if (Base.noNull(data.scFileId)) {
        FileApi.deleteFile(data.scFileId);
        data.scFileId = '';
      }
    };
    const variantFileRemove = () => {
      if (Base.noNull(data.variantFileId)) {
        FileApi.deleteFile(data.variantFileId);
        data.variantFileId = '';
      }
    };

    const buttonClick = () => {
      if (Base.isNull(email.value.input)) {
        ElNotification({
          title: 'Please check',
          message: 'Please input e-mail!',
          type: 'error'
        });
        return;
      }

      if (Base.isNull(genome.value.select)) {
        ElNotification({
          title: 'Please check',
          message: 'Please select genome!',
          type: 'error'
        });
        return;
      }

      if (Base.isNull(layer.value.input)) {
        layer.value.input = 'counts';
      }

      if (Base.isNull(scFileUpload.value.fileList) || scFileUpload.value.fileList.length === 0) {
        ElNotification({
          title: 'Please check',
          message: 'Please upload scATAC-seq data!',
          type: 'error'
        });
        return;
      }

      if (Base.isNull(variantFileUpload.value.fileList) || variantFileUpload.value.fileList.length === 0) {
        ElNotification({
          title: 'Please check',
          message: 'Please upload trait file!',
          type: 'error'
        });
        return;
      }

      if (Base.isNull(data.scFileId) || Base.isNull(data.variantFileId)) {
        ElNotification({
          title: 'Please check',
          message: 'Please wait until the file upload is complete!',
          type: 'error'
        });
        return;
      }

      Jump.routerQuery(router, '/one_line_exec', {
        genome: genome.value.select,
        layer: layer.value.input,
        scFileId: data.scFileId,
        variantFileId: data.variantFileId,
        email: email.value.input
      });
    };
    return {
      ...toRefs(data),
      genome,
      layer,
      scFileUpload,
      variantFileUpload,
      email,
      scUploadSuccess,
      variantUploadSuccess,
      scFileRemove,
      variantFileRemove,
      buttonClick,
      uploadAction: FILE_UPLOAD_URL,
      genomeData: ANALYSIS_GENOME_DATA
    };
  }
});
</script>
