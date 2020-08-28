<template>
  <a-el-dialog :visible.sync="visible" width="40%" :title="title" :beforeClose="beforeClose">
    <el-form
      ref="addForm"
      :model="addForm"
      label-width="160px"
      :rules="rules"
      size="small"
      class="demo-form-inline"
    >
      <el-form-item label="工作空间分类" prop="dictionarydataValue">
        <el-select
          v-model="addForm.dictionarydataValue"
          size="small"
          style="width: 100%;"
          @change="editingModeChange"
        >
          <el-option
            v-for="item in leftDataTree"
            :label="item.dictionarydataName"
            :value="item.dictionarydataValue"
            :key="item.dictionarydataName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工作空间" prop="workspaceId">
        <el-select v-model="addForm.workspaceId" size="small" style="width: 100%;">
          <el-option
            v-for="item in leftDataTreeChild"
            :label="item.workspaceCode"
            :value="item.workspaceId"
            :key="item.workspaceId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="orderId">
        <el-input-number v-model="addForm.orderId" :min="0"></el-input-number>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button type="primary" size="small" @click="addBtns">确定</el-button>
      <el-button type="default" size="small" @click="beforeClose">取消</el-button>
    </template>
  </a-el-dialog>
</template>

<script>
import AElDialog from "../../components/Dialog/AElDialog.vue";
import { resBaseDicNameByDicCode } from "../../api";
import { WORKSPACE_CLASSIFICATION } from "../../util/constListCode";
import { IS_OK } from "../../api/path";
import { resWorkspaceconfigSave, resWorkspacePage } from "../../api/ddc";
export default {
  name: "workEnvironmentAdd",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    workspaceObj1: {
      type: Object
    },
    workspaceObjCallback: {
      type: Function
    },
    workType: {
      type: Number
    }
  },
  components: {
    AElDialog
  },
  data() {
    return {
      uid: "",
      title: "新增",
      leftDataTree: [],
      leftDataTreeChild: [],
      addForm: {
        dictionarydataValue: "",
        workspaceId: "",
        orderId: 0
      },
      rules: {
        dictionarydataValue: [
          { required: true, message: "请选择工作空间分类", trigger: "change" }
        ],
        workspaceId: [
          { required: true, message: "请选择工作空间", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getEnvironmentVariableType();
    if (this.workType === 1) {
      this.title = "新增";
    } else if (this.workType === 2) {
      this.title = "修改";
    }
  },
  methods: {
    editingModeChange() {
      this.addForm.workspaceId = "";
      this.leftDataTreeChild = [];
      this.getResWorkspacePage();
    },
    async getResWorkspacePage() {
      const res = await resWorkspacePage({
        pageSize: 100,
        pageNum: 1,
        noExclude: false,
        classifyId: this.addForm.dictionarydataValue,
        ...this.workspaceObj1,
        showType: 2,
        workspaceType: 1
      });
      if (res.data.code === IS_OK) {
        this.leftDataTreeChild = res.data.data.list;
      }
    },
    async addBtns() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          let obj = JSON.parse(JSON.stringify(this.workspaceObj1));
          obj.workspaceId = this.addForm.workspaceId;
          const res = await resWorkspaceconfigSave(obj);
          if (res.data.code === IS_OK) {
            setTimeout(() => {
              this.$message({
                type: "success",
                message: "新增成功"
              });
              this.beforeClose();
              this.workspaceObjCallback();
            }, 500);
          }
        }
      });
    },
    // 获取环境变量类型
    async getEnvironmentVariableType() {
      const res = await resBaseDicNameByDicCode({
        dicCode: WORKSPACE_CLASSIFICATION
      });
      if (res.data.code === IS_OK) {
        this.leftDataTree = res.data.data;
      }
    },
    beforeClose() {
      this.$emit("update:visible", false);
    }
  }
};
</script>

<style lang="stylus" scoped>
.box {
  display: flex;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;

  .left {
    width: 260px;
    background: #fff;
    box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.2);
    border: 1px solid #eee;

    .left-title {
      border-bottom: 1px solid #eee;
      line-height: 36px;
      padding: 0 10px;
      box-sizing: border-box;
      font-size: 14px;
      color: #333;
    }

    .left-body {
      height: calc(100% - 36px);
      padding: 10px;
      box-sizing: border-box;
      overflow: auto;
    }
  }

  .y-hander {
    width: 10px;
    cursor: w-resize;
    background: #fff;
  }

  .right {
    flex: 1;
    background: #fff;
    border: 1px solid #eee;
    box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.2);
  }
}

.app-main-wrapper {
  height: 100%;
}
</style>
