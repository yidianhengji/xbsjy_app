<template>
  <div>
    <el-upload
      ref="uploadMany"
      :headers="headers"
      :action="'/api/filesystem/file/upload'"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="onSuccess"
      :on-change="handleChange"
      :file-list="fileList"
      multiple
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <a-el-dialog :visible.sync="dialogVisible" title="预览" width="40%">
      <img width="100%" :src="dialogImageUrl" alt />
    </a-el-dialog>
  </div>
</template>

<script>
import AElDialog from "../Dialog/AElDialog.vue";
import { IS_OK, UPLOAD_FILE_PATH } from "../../api/path";
export default {
  name: "FileMany",
  props: ["value"],
  components: {
    AElDialog
  },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      headers: {
        uid: localStorage.getItem("uid")
      },
      fileListData: [],
      fileList: []
    };
  },
  methods: {
    handleChange(file, fileList) {
      this.fileList = fileList;
    },
    handleRemove(file) {
      this.fileList.map((item, index) => {
        if (item.uid == file.uid) {
          this.fileListData.splice(index, 1);
          this.fileList.splice(index, 1);
          this.$emit("input", this.fileListData.toString());
        }
      });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    onSuccess(response) {
      if (response.code === IS_OK) {
        this.fileListData.push(response.data.fullPath);
        this.$emit("input", this.fileListData.toString());
      }
    },
    reset() {
      this.fileListData = [];
      this.fileList = [];
      this.$emit("input", "");
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        let arrObj = newVal.split(",");
        let newObj = [];
        arrObj.map(item => {
          newObj.push({ url: UPLOAD_FILE_PATH + item });
        });
        this.fileList = newObj;
        this.fileListData = arrObj;
      }
    }
  }
};
</script>
