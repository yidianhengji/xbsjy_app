<template>
  <div :key="key">
    <!-- <el-button size="small" type="primary" @click="uploadZIP">上传ZPI文件</el-button> -->
    <global-uploader
      ref="fileUploader"
      @file-change="fileChange"
      @file-success="fileSuccess"
      :multiple="multiple"
    ></global-uploader>
  </div>
</template>

<script>
import globalUploader from "./globalUploader1.vue";
import { v4 as uuidv4 } from "uuid";
export default {
  name: "BigFiles",
  props: {
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      key: uuidv4()
    };
  },
  components: {
    globalUploader
  },
  methods: {
    fileChange(file) {
      this.$emit("file-change", file);
    },
    fileSuccess(file, res, fileMd5, len) {
      this.$emit("file-success", file, res, fileMd5, len);
    },
    // 上传zip文件
    uploadZIP() {
      this.$refs.fileUploader.openUploaderZip();
    },
    reset() {
      this.$refs.fileUploader.reset();
    }
  }
};
</script>
