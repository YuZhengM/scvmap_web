<template>
  <div class="file_upload_template">
    <el-upload
        class="upload-demo"
        drag
        :action="action"
        multiple
        :limit="1"
        :on-exceed="handleExceed"
        :auto-upload="autoUpload"
        :before-upload="beforeUpload"
        :on-success="handlerSuccess"
        :on-error="uploadError"
        :on-remove="handlerRemove"
        :file-list="fileList"
        ref="upload"
    >
      <el-icon class="el-icon--upload">
        <UploadFilled/>
      </el-icon>
      <div class="el-upload__text">
        Drop file here or <em>click to upload</em>
      </div>
      <template #tip>
        <div class="el-upload__tip" v-html="tipText" v-if="tipText"></div>
      </template>
    </el-upload>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue';
import { UploadFilled } from '@element-plus/icons-vue';
import { ElNotification, UploadFile, UploadInstance, UploadProps, UploadRawFile, genFileId } from 'element-plus';
import '@/assets/less/components/upload/FileUpload.less';

export default defineComponent({
  name: 'FileUpload',
  components: { UploadFilled },
  props: {
    // File upload URL
    action: {
      type: String,
      required: true,
      default: () => ''
    },
    // Supported file types
    fileType: {
      type: Array,
      default: () => undefined
    },
    // Whether to upload automatically
    autoUpload: {
      type: Boolean,
      default: () => true
    },
    // Operations after successful upload
    uploadSuccess: {
      type: Function,
      default: () => ({})
    },
    // Operations when a file is removed
    fileRemove: {
      type: Function,
      default: () => ({})
    },
    // File prompt information
    tipText: {
      type: String,
      default: () => undefined
    },
    // Maximum file size for upload (in MB)
    maxFileSize: {
      type: Number,
      default: () => undefined
    }
  },
  setup(props) {
    const upload = ref<UploadInstance>();
    const data = reactive({
      fileList: []
    });
    // File upload check
    const fileCheck = (file: UploadRawFile): boolean => {
      // File size
      if (props.maxFileSize && file.size > props.maxFileSize * 1024 * 1024) {
        ElNotification({
          title: 'Please check',
          message: `The maximum value of file upload is ${props.maxFileSize}MB, please upload again!`,
          type: 'error'
        });
        return false;
      }
      // File type
      if (props.fileType) {
        let isFalseType = true;
        const { length } = props.fileType;
        for (let i = 0; i < length; i++) {
          if (file.name.endsWith(`.${String(props.fileType[i])}`)) {
            isFalseType = false;
            break;
          }
        }
        if (isFalseType) {
          ElNotification({
            title: 'Please check',
            message: `The file only supports ${props.fileType} file type, please upload again!`,
            type: 'error'
          });
        }
        return !isFalseType;
      }
      return true;
    };
    // Operations before upload
    const beforeUpload: UploadProps['beforeUpload'] = (rawFile: UploadRawFile): boolean | undefined => {
      if (upload.value) {
        // If the file check fails, there's no need to clear the file list. A rejected Promise will handle it.
        return fileCheck(rawFile);
      }
    };
    const handleExceed: UploadProps['onExceed'] = (files) => {
      if (upload.value) {
        upload.value.clearFiles();
        const file = files[0] as UploadRawFile;
        file.uid = genFileId();
        upload.value.handleStart(file);
        // This removal ensures the previously replaced file is deleted.
        upload.value.handleRemove(file);
        upload.value.handleStart(file);
        // Submit directly. The beforeUpload function will be automatically executed for pre-submission checks.
        upload.value.submit();
      }
    };
    // Operations after successful file upload
    const handlerSuccess: UploadProps['onSuccess'] = (response: any, uploadFile: UploadFile) => {
      props.uploadSuccess(response.data, uploadFile);
    };
    const uploadError: UploadProps['onError'] = (error: Error) => {
      // eslint-disable-next-line no-console
      console.log(`upload file error: ${error}`);
    };
    const handlerRemove: UploadProps['onRemove'] = (uploadFile: UploadFile) => {
      props.fileRemove(uploadFile);
    };
    return {
      ...toRefs(data),
      upload,
      handleExceed,
      beforeUpload,
      handlerSuccess,
      uploadError,
      handlerRemove
    };
  }
});
</script>
