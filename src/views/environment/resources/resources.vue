<template>
  <div class="box">
    <div class="left">
      <div class="left-title">工作空间资源根目录</div>
      <div class="left-body">
        <left-tree
          :treedata="leftDataTree"
          label="workdirName"
          :single="true"
          node-key="id"
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
          primaryId="workdirFileId"
          query-interface="ddc/workspacedirfile/page"
          query-one-interface="ddc/workspacedir/info"
          save-interface="ddc/workspace/uploadResources"
          update-interface="ddc/workspacedir/update"
          delete-interface="ddc/workspacedir/delete"
          @current-change="currentChange"
          :columns="columns"
          :reset-controller="resetController"
          :uid.sync="uid"
          :rules="rules"
          :reset-form="resetForm"
          addBtnText="上传资源"
          :addControllerCallback="addControllerCallback"
          noEditBtn
          noDeleteBtn
          noSearchForm
          noViewBtn
        >
          <!-- <template slot="toolbar">
            <el-button type="primary" size="small" @click="resourceDirectoryBtn">删除目录</el-button>
          </template>-->
          <template slot="add">
            <!-- <el-form-item label="所属目录" prop="rootPath">
              <a-eltree-select
                :treedata.sync="leftDataTree"
                label="workdirName"
                node-key="relativePath"
                :defaultExpandAll="false"
                :value.sync="data.addForm.rootPath"
              ></a-eltree-select>
            </el-form-item>-->
            <el-form-item>
              <big-files ref="bigFiles1" @file-success="fileSuccess"></big-files>
            </el-form-item>
          </template>
        </form-base>
      </div>
    </div>
  </div>
</template>

<script type="text/jsx">
import FormBase from "../../../components/FormBase.vue";
import LeftTree from "../../../components/Tree/leftTree";
// import AEltreeSelect from "../../../components/Dialog/AEltreeSelect.vue";
import {
  resWorkspacedirQueryTree,
  resWorkspacedirDelete
} from "../../../api/ddc";
import { IS_OK } from "../../../api/path";
import { mixinMethodsDrag } from "../../../mixin/mixinMethodsDrag";
import BigFiles from "../../../components/BigFiles/BigFiles1.vue";

export default {
  name: "resources",
  mixins: [mixinMethodsDrag],
  components: {
    FormBase,
    LeftTree,
    // AEltreeSelect,
    BigFiles
  },
  props: {
    uidObj: Object
  },
  data() {
    return {
      // 左边树
      leftDataTree: [],
      uid: "",
      mapDialogVisible: false,
      dataArray: [],
      rules: {
        rootPath: [
          { required: true, message: "请选择所属目录", trigger: "change" }
        ]
      },
      columns: [
        {
          prop: "workdirFileName",
          label: "文件名称",
          align: "left"
        },
        {
          prop: "createTime",
          label: "创建时间"
        },
        {
          prop: "createUserId",
          label: "创建人"
        }
      ],
      isTrue: false,
      startX: 0,
      treeObj: {}
    };
  },
  created() {
    // 获取环境变量类型
    this.getEnvironmentVariableType();
    // 软件版本
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.findex.formInline = {
        workdirId: ""
      };
    });
  },
  methods: {
    addControllerCallback() {
      this.getEnvironmentVariableType();
      this.$refs.bigFiles1.reset();
    },
    resetController(){
      this.$refs.bigFiles1.reset();
    },
    // 打开资源目录
    resourceDirectoryBtn() {
      if (this.treeObj.id) {
        this.$confirm(`是否删除这条数据?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            const res = await resWorkspacedirDelete({
              data: [this.treeObj.id]
            });
            if (res.data.code === IS_OK) {
              setTimeout(() => {
                this.$message({
                  type: "success",
                  message: "删除成功"
                });
                const self = this.$refs.findex;
                self.uid = "";
                self.formInline.workdirId = "";
                this.getEnvironmentVariableType();
                this.queryBtn();
              }, 500);
            }
          })
          .catch(() => {});
      } else {
        this.$message({
          message: "您没有选中工作空间资源根目录,请选中后再操作！",
          type: "warning"
        });
      }
    },
    fileSuccess(file, res, fileMd5, len) {
      const self = this.$refs.findex;
      self.addForm.workspaceId = this.uidObj.workspaceId;
      self.addForm.rootId = "0";
      self.addForm.rootPath = "/";
      self.addForm.map = res.data.map;
      console.log(len);
    },
    // 获取环境变量类型
    async getEnvironmentVariableType() {
      const res = await resWorkspacedirQueryTree({workspaceId: this.uidObj.workspaceId});
      if (res.data.code === IS_OK) {
        this.leftDataTree = res.data.data;
      }
    },
    queryBtn() {
      this.$refs.findex.clickQuery();
    },
    resetForm(self) {
      self.addForm = {
        fileId: "",
        fileMd5: "",
        fullPath: "",
        rootId: "0",
        workspaceId: "fdfb99a6f4291d816a3f87f2e5647603"
      };
      if (this.treeObj.id) {
        self.addForm.rootPath = this.treeObj.relativePath;
        self.addForm.rootPathValue = this.treeObj.workdirName;
      }
      this.selectIndex = null;
    },

    handleProjectName(obj) {
      const self = this.$refs.findex;
      self.uid = "";
      self.formInline.workdirId = obj.id;
      this.treeObj = obj;
      self.clickQuery();
    },
    currentChange(val) {
      this.uid = val;
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
    background: #fff;
    box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.2);
    border: 1px solid #eee;
    width: 260px;

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
