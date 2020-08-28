<template>
  <a-el-dialog :visible.sync="visible" title="文档复制" :beforeClose="beforeClose">
    <el-form
      ref="addForm"
      :model="addForm"
      label-width="160px"
      :rules="rules"
      size="small"
      class="demo-form-inline"
    >
      <el-form-item label="所属目录" prop="folderId">
        <a-eltree-select
          :treedata.sync="dataArray"
          label="name"
          node-key="id"
          :defaultExpandAll="false"
          :value.sync="addForm.folderId"
          :dataCallback="dataCallback"
          :render-content="renderContent"
        ></a-eltree-select>
      </el-form-item>
      <el-form-item label="文档名称" prop="docName">
        <el-input v-model="addForm.docName"></el-input>
      </el-form-item>
      <el-form-item label="版本" prop="version">
        <el-input v-model="addForm.version"></el-input>
      </el-form-item>
      <el-form-item label="文档描述" prop="docDesc">
        <el-input v-model="addForm.docDesc" :rows="5" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="版本描述" prop="versionDesc">
        <el-input v-model="addForm.versionDesc" :rows="5" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button type="primary" size="small" @click="save">复制</el-button>
      <el-button type="default" size="small" @click="beforeClose">取消</el-button>
    </template>
  </a-el-dialog>
</template>

<script>
import AElDialog from "../../components/Dialog/AElDialog.vue";
import AEltreeSelect from "../../components/Dialog/AEltreeSelect.vue";
import { resDdcFolderQueryProFolTree } from "../../api/ddc";
import { IS_OK, API_PATH } from "../../api/path";
import request from "../../api/config";
export default {
  name: "documentCopy",
  components: {
    AElDialog,
    AEltreeSelect
  },
  props: {
    uid: {
      type: String,
      default: ""
    },
    visible: {
      type: Boolean,
      default: false
    },
    category: String,
    renderContent: Function
  },
  data() {
    return {
      dataArray: [],
      addForm: {
        folderId: "",
        docName: "",
        version: "",
        orderId: 0,
        docDesc: "",
        versionDesc: "",
        documentdetail: {
          fileHashcode: "",
          fileId: "",
          fileName: "",
          fileSize: ""
        }
      },
      rules: {
        docName: [
          { required: true, message: "请输入文档名称", trigger: "blur" }
        ],
        projectId: [
          { required: true, message: "请选择所属项目", trigger: "change" }
        ],
        folderId: [
          { required: true, message: "请选择所属目录", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.queryController();
    this.queryOne();
  },
  methods: {
    dataCallback(obj) {
      if (obj.type == "project") {
        this.addForm.folderId = "";
        this.$message({
          type: "warning",
          message: "选择错误，您当前选择的是项目，请选择项目下的目录！"
        });
      }
    },
    async queryController() {
      const res = await resDdcFolderQueryProFolTree({
        category: this.category
      });
      if (res.data.code === IS_OK) {
        this.dataArray = res.data.data;
      }
    },
    async queryOne() {
      const res = await request(
        `${API_PATH}ddc/document/info/${this.uid}`,
        null,
        "GET"
      );
      if (res.data.code === IS_OK) {
        this.addForm = res.data.data;
      }
    },
    save() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.param = {
            ...this.addForm
          };
          this.submit(this.param);
        }
      });
    },
    async submit(param) {
      const res = await request(
        API_PATH + "ddc/document/cpDocument",
        param,
        "POST"
      );
      if (res.data.code === IS_OK) {
        setTimeout(() => {
          this.$message({
            type: "success",
            message: "复制成功"
          });
          this.$emit("queryBtn");
          this.$emit("update:visible", false);
        }, 500);
      } else {
        this.$emit("queryBtn");
        this.$emit("update:visible", false);
      }
    },
    beforeClose() {
      this.$emit("update:visible", false);
    }
  }
};
</script>

<style lang="stylus" scoped></style>
