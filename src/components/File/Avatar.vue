<template>
  <el-upload
    class="avatat-uploader"
    accept="image/png, image/jpg, image/jpeg, image/gif"
    :action="'/api/filesystem/file/upload'"
    :headers="headers"
    :show-file-list="false"
    :on-success="upload"
    :on-error="error"
    name="file"
    ref="file"
  >
    <img v-if="value" :src="imgUrl" class="avatar" />
    <i class="el-icon-plus avatar-uploader-icon" v-else></i>
  </el-upload>
</template>

<script>
import { UPLOAD_FILE_PATH } from "../../api/path";
export default {
  name: "avatar",
  props: {
    value: String
  },
  data() {
    return {
      imgUrl: "",
      path: UPLOAD_FILE_PATH,
      headers: {
        uid: localStorage.getItem("uid")
      }
    };
  },
  methods: {
    error() {
      this.$alert("上传失败!请联系管理员", "温馨提示", { type: "warning" });
    },
    upload(data) {
      if (1 === data.code) {
        this.imgUrl = UPLOAD_FILE_PATH + data.data.fullPath;
        this.$emit("input", data.data.fullPath);
      } else {
        this.imgUrl = UPLOAD_FILE_PATH + data.data.fullPath;
        this.$emit("input", "/" + data.data.fullPath);
      }
    },
    clear() {
      this.$refs.file.clearFiles();
    }
  },
  watch: {
    value(val) {
      this.imgUrl = UPLOAD_FILE_PATH + val;
    }
  }
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader-icon {
  border: 1px solid #eee;
  border-radius: 50%;
}

.avatat-uploader img {
  border-radius: 50%;
}
</style>
