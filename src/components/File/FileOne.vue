<template>
  <el-upload
    class="upload-demo"
    ref="upload"
    :headers="headers"
    :action="'/api/filesystem/file/upload'"
    :on-change="handleChange"
    :file-list="fileList"
    :multiple="multiple"
    :auto-upload="false"
    :on-success="onSuccess"
  >
    <el-button size="small" type="primary">点击上传</el-button>
  </el-upload>
</template>

<script>
import md5 from "md5";
import request from "../../api/config";
import { IS_OK } from "../../api/path";
export default {
  name: "FileOne",
  props: {
    changeFile: Function
  },
  data() {
    return {
      multiple: false,
      headers: {
        uid: localStorage.getItem("uid")
      },
      fileList: []
    };
  },
  methods: {
    async getCheckFileExist(name) {
      const res = await request(
        `/api/filesystem/file/checkFileExist/${name}`,
        {},
        "GET"
      );
      if (res.data.code === IS_OK) {
        this.$refs.upload.submit();
      }
    },
    handleChange(file, fileList) {
      file.md5Name = md5(file.name);
      this.getCheckFileExist(file.md5Name);
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]];
      }
    },
    onSuccess(response, file) {
      if (this.changeFile) {
        this.changeFile(file);
      }
    }
  }
};
</script>