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
import type { UploadFile, UploadInstance, UploadProps, UploadRawFile } from 'element-plus';
import { genFileId } from 'element-plus';
import '@/assets/less/components/upload/FileUpload.less';
import Message from '@/service/util/base/message';

export default defineComponent({
  name: 'FileUpload',
  components: { UploadFilled },
  props: {
    // 上传文件的连接
    action: {
      type: String,
      required: true,
      default: () => ''
    },
    // 支持的文件类型
    fileType: {
      type: Array,
      default: () => undefined
    },
    // 是否自动上传
    autoUpload: {
      type: Boolean,
      default: () => true
    },
    // 上传成功后的操作
    uploadSuccess: {
      type: Function,
      default: () => ({})
    },
    // 文件移除的操作
    fileRemove: {
      type: Function,
      default: () => ({})
    },
    // 文件提示信息
    tipText: {
      type: String,
      default: () => undefined
    },
    // 文件上传的最大大小(单位 MB)
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
    // 文件上传检查
    const fileCheck = (file: UploadRawFile): boolean => {
      // 文件大小
      if (props.maxFileSize && file.size > props.maxFileSize * 1024 * 1024) {
        Message.error(`The maximum value of file upload is ${props.maxFileSize}MB, please upload again!`);
        return false;
      }
      // 文件类型
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
          Message.error(`The file only supports ${props.fileType} file type, please upload again!`);
        }
        return !isFalseType;
      }
      return true;
    };
    // 上传之前的操作
    const beforeUpload: UploadProps['beforeUpload'] = (rawFile: UploadRawFile): boolean | undefined => {
      if (upload.value) {
        // 检查文件不对不用清空文件列表, Promise 且被 reject 会帮忙清空
        return fileCheck(rawFile);
      }
    };
    const handleExceed: UploadProps['onExceed'] = (files) => {
      if (upload.value) {
        upload.value.clearFiles();
        const file = files[0] as UploadRawFile;
        file.uid = genFileId();
        upload.value.handleStart(file);
        // 这个移除保证删除之前替换的文件
        upload.value.handleRemove(file);
        upload.value.handleStart(file);
        // 直接提交, 提交前自动检查执行 beforeUpload 函数
        upload.value.submit();
      }
    };
    // 上传文件成功后的操作
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
