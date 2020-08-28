<template>
  <el-form
    ref="documentCheck"
    :model="documentCheckAddForm"
    label-width="160px"
    :rules="documentCheckRules"
    size="small"
    class="demo-form-inline"
  >
    <el-form-item label="文件">
      <big-files ref="bigFiles2" @file-success="fileCheckInSuccess"></big-files>
    </el-form-item>

    <el-form-item label="文档描述" prop="docDesc">
      <el-input
        v-model="documentCheckAddForm.docDesc"
        :rows="5"
        type="textarea"
      ></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
import BigFiles from "../../components/BigFiles/BigFiles.vue";
export default {
  name: "documentCheckIn",
  components: {
    BigFiles
  },
  data() {
    return {
      documentCheckInDialog: false,
      documentCheckAddForm: {
        documentId: "",
        fileHashcode: "",
        fileId: "",
        fileName: "",
        fileSize: "",
        docDesc: ""
      },
      documentCheckRules: {
        docName: [
          { required: true, message: "请输入文档名称", trigger: "blur" }
        ],
        projectId: [
          { required: true, message: "请选择所属项目", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    fileCheckInSuccess(file, res) {
      this.documentCheckAddForm = {
        documentId: this.uid,
        fileHashcode: file.uniqueIdentifier,
        fileId: res.fileId,
        fileName: file.name,
        fileSize: file.size
      };
    }
  }
};
</script>
