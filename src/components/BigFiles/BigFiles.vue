<template>
  <div :key="key">
    <el-button size="small" type="primary" @click="upload">上传文件</el-button>
    <global-uploader
      ref="fileUploader"
      @file-change="fileChange"
      @file-success="fileSuccess"
      :multiple="multiple"
    ></global-uploader>
  </div>
</template>

<script>
import globalUploader from "./globalUploader.vue";
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
    fileSuccess(file, res) {
      this.$emit("file-success", file, res);
    },
    upload() {
      this.$refs.fileUploader.openUploader();
    },
    reset() {
      this.$refs.fileUploader.reset();
    }
  }
};
</script>
