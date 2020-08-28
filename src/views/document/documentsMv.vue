<template>
  <a-el-dialog :visible.sync="visible" title="文档移动" width="40%" :beforeClose="beforeClose">
    <el-form
      ref="documentAddVersion"
      :model="documentsMvForm"
      label-width="100px"
      :rules="documentsMvRules"
      size="small"
      class="demo-form-inline"
      style="padding: 40px 20px;"
    >
      <el-form-item label="所属目录" prop="documentIds">
        <el-row class="AEltreeSelect__input">
          <el-col :span="21">
            <el-input :value="documentsMvForm.documentIds" readonly></el-input>
          </el-col>
          <el-col :span="3" style="text-align: right;">
            <el-button type="primary">选择</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="上级目录" prop="folderId">
        <el-row class="AEltreeSelect__input">
          <el-col :span="21">
            <el-input :value="documentsMvForm.folderId" readonly></el-input>
          </el-col>
          <el-col :span="3" style="text-align: right;">
            <el-button type="primary">选择</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button type="primary" size="small">确定</el-button>
      <el-button type="default" size="small" @click="beforeClose">取消</el-button>
    </template>
  </a-el-dialog>
</template>

<script>
import AElDialog from "../../components/Dialog/AElDialog.vue";

export default {
  name: "documentsMv",
  components: {
    AElDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      documentsMvForm: {
        documentIds: "",
        folderId: ""
      },
      documentsMvRules: {}
    };
  },
  methods: {
    beforeClose() {
      this.$emit("update:visible", false);
    }
  }
};
</script>

<style lang="stylus" scoped></style>