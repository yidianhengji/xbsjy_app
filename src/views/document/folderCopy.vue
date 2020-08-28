<template>
  <a-el-dialog :visible.sync="visible" title="目录复制" :beforeClose="beforeClose">
    <el-form
      ref="addForm"
      :model="addForm"
      label-width="160px"
      :rules="rules"
      size="small"
      class="demo-form-inline"
    >
      <el-form-item label="目标目录" prop="upFolderId">
        <a-eltree-select
          :treedata.sync="dataArray"
          label="name"
          node-key="id"
          :defaultExpandAll="false"
          :value.sync="addForm.upFolderId"
          :dataCallback="dataCallback"
          :renderContent="renderContent"
        ></a-eltree-select>
      </el-form-item>
      <el-form-item label="目录名称" prop="folderName">
        <el-input v-model="addForm.folderName"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="orderId">
        <el-input-number v-model="addForm.orderId" size="small" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="目录描述" prop="folderDesc">
        <el-input v-model="addForm.folderDesc" :rows="5" type="textarea"></el-input>
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
  name: "folderCopy",
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
        projectId: "",
        projectName: "",
        upFolderId: "",
        folderName: "",
        orderId: 0,
        folderDesc: ""
      },
      rules: {
        folderName: [
          { required: true, message: "请输入目录名称", trigger: "blur" }
        ],
        projectName: [
          { required: true, message: "请选择所属项目", trigger: "change" }
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
        this.addForm.projectId = obj.id;
      } else {
        this.addForm.projectId = obj.projectId;
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
        `${API_PATH}ddc/folder/info/${this.uid}`,
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
        API_PATH + "ddc/folder/cpFolders",
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
