<template>
  <a-el-dialog :visible.sync="visible" width="60%" :title="title" :beforeClose="beforeClose">
    <div class="box" style="height: 600px;">
      <div class="left">
        <div class="left-title">工作空间分类</div>
        <div class="left-body">
          <left-tree
            :treedata="leftDataTree"
            label="classifyName"
            :single="true"
            node-key="classifyId"
            ref="tree"
            @nodeClick="handleProjectName"
          ></left-tree>
        </div>
      </div>
      <div class="y-hander"></div>
      <div class="right">
        <div class="app-main-wrapper">
          <form-base
            ref="findex"
            primaryId="workspaceconfigId"
            query-interface="ddc/workspace/page"
            query-one-interface="ddc/workspace/info"
            save-interface="ddc/workspace/save"
            update-interface="ddc/workspace/update"
            delete-interface="ddc/workspace/delete"
            @current-change="currentChange"
            :columns="columns"
            :uid.sync="uid"
            :rules="rules"
            isDefaultQuery
            noSearchForm
            noAddBtn
            noEditBtn
            noDeleteBtn
            noViewBtn
          >
            <template slot="toolbar">
              <el-button icon="el-icon-plus" type="primary" size="small" @click="addBtn">新增</el-button>
              <!-- <el-button icon="el-icon-edit" type="primary" size="small" @click="editBtn">修改</el-button> -->
              <el-button icon="el-icon-delete" type="danger" size="small" @click="deleteBtns">删除</el-button>
            </template>
          </form-base>
        </div>
      </div>
    </div>
    <template slot="footer">
      <el-button type="default" size="small" @click="beforeClose">取消</el-button>
    </template>
    <workEnvironmentAdd
      v-if="addBtnVisible"
      :visible.sync="addBtnVisible"
      :workspaceObj1="workspaceObj"
      :workspaceObjCallback="workspaceObjCallback"
      :workType="workType"
    ></workEnvironmentAdd>
  </a-el-dialog>
</template>

<script>
import AElDialog from "../../components/Dialog/AElDialog.vue";
import LeftTree from "../../components/Tree/leftTree";
import FormBase from "../../components/FormBase.vue";
import { IS_OK } from "../../api/path";
import workEnvironmentAdd from "./workEnvironmentAdd.vue";
import {
  resWorkspaceGetClassifyid,
  resWorkspaceconfigDelete
} from "../../api/ddc";
import { mixinMethodsDrag } from "../../mixin/mixinMethodsDrag";
export default {
  name: "workEnvironment",
  mixins: [mixinMethodsDrag],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    workspaceObj: {
      type: Object
    },
    title: {
      type: String
    }
  },
  components: {
    AElDialog,
    LeftTree,
    FormBase,
    workEnvironmentAdd
  },
  data() {
    return {
      addBtnVisible: false,
      uid: "",
      leftDataTree: [],
      treeObj: {},
      uidObj: {},
      rules: {},
      columns: [
        {
          prop: "workspaceCode",
          label: "工作空间名称",
          align: "left"
        },
        {
          prop: "softwareversionName",
          label: "软件版本"
        },
        {
          prop: "variateName",
          label: "描述",
          align: "left"
        }
      ],
      workType: 1
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.findex.formInline = {
        classifyId: "",
        projectId: "0",
        folderId: "0",
        documentId: "0",
        showType: 1,
        workspaceType: 1,
      };
    });
  },
  created() {
    this.getEnvironmentVariableType();
  },
  methods: {
    deleteBtns() {
      if (this.uid) {
        this.$confirm(
          this.deleteMessage ? this.deleteMessage : "是否删除这条数据?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.getDeleteObj();
          })
          .catch(() => {});
      } else {
        this.$message({
          message: "您没有选中任何数据项,请选中后再操作！",
          type: "warning"
        });
      }
    },
    async getDeleteObj() {
      const res = await resWorkspaceconfigDelete(this.uid);
      if (res.data.code === IS_OK) {
        setTimeout(() => {
          this.$message({
            type: "success",
            message: "删除成功"
          });
          this.workspaceObjCallback();
        }, 500);
      }
    },
    workspaceObjCallback() {
      this.queryBtn();
      this.getEnvironmentVariableType();
    },
    addBtn() {
      this.addBtnVisible = true;
      this.workType = 1;
    },
    editBtn() {
      if (this.uid) {
        this.addBtnVisible = true;
        this.workType = 2;
      } else {
        this.$message({
          message: "您没有选中任何数据项,请选中后再操作！",
          type: "warning"
        });
      }
    },
    currentChange(val, obj) {
      this.uid = val;
      this.uidObj = obj;
    },
    queryBtn() {
      this.$refs.findex.clickQuery();
    },
    handleProjectName(obj) {
      const self = this.$refs.findex;
      this.uid = "";
      self.formInline = {
        classifyId: obj.classifyId,
        noExclude: true,
        ...this.workspaceObj,
        showType: 1,
        workspaceType: 1
      };
      this.treeObj = obj;
      self.clickQuery();
    },
    // 获取环境变量类型
    async getEnvironmentVariableType() {
      const res = await resWorkspaceGetClassifyid(this.workspaceObj);
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
