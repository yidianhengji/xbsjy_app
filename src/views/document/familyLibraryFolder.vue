<template>
  <div class="box">
    <div class="left">
      <div class="left-title">族目录</div>
      <div class="left-body" v-loading="projectLoading">
        <left-tree
          :treedata="projectDataTree"
          label="name"
          :single="true"
          node-key="id"
          ref="tree"
          :render-content="renderContent"
          @nodeClick="handleProjectName"
        ></left-tree>
      </div>
    </div>
    <div class="y-hander"></div>
    <div class="right">
      <div class="app-main-wrapper">
        <form-base
          ref="findex"
          primaryId="folderId"
          query-interface="ddc/folder/pageByUpFolderId"
          query-one-interface="ddc/folder/info"
          save-interface="ddc/folder/save"
          update-interface="ddc/folder/update"
          delete-interface="ddc/folder/delete"
          @current-change="currentChange"
          :add-controller="addController"
          :addControllerCallback="addControllerCallback"
          :deleteControllerCallback="addControllerCallback"
          :columns="columns"
          :uid.sync="uid"
          noViewBtn
          deleteInfo="该目录下可能存在子目录或文档，是否确定删除？"
          :rules="rules"
          :reset-form="resetForm"
        >
          <template slot="searchForm" slot-scope="data">
            <el-form-item label="目录名称" prop="keyword">
              <el-input
                v-model="data.formInline.keyword"
                size="small"
                placeholder="请输入目录名称"
                clearable
              ></el-input>
            </el-form-item>
          </template>
          <template slot="toolbar">
            <el-dropdown style="margin-left: 5px;">
              <el-button type="primary" size="small">
                更多操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="copyBtn">复制</el-dropdown-item>
                <el-dropdown-item @click.native="powerBtn">权限</el-dropdown-item>
                <el-dropdown-item @click.native="logBtn">操作日志</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot="add" slot-scope="data">
            <el-form-item label="所属项目" prop="projectName">
              <el-input v-model="data.addForm.projectName" readonly=""></el-input>
            </el-form-item>
            <el-form-item label="上级目录" prop="upFolderId">
              <a-eltree-select
                :treedata.sync="projectDataTree"
                label="name"
                node-key="id"
                noBtn
                :defaultExpandAll="false"
                :value.sync="data.addForm.upFolderId"
                :render-content="renderContent"
              ></a-eltree-select>
            </el-form-item>
            <el-form-item label="目录名称" prop="folderName">
              <el-input v-model="data.addForm.folderName"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="orderId">
              <el-input-number v-model="data.addForm.orderId" size="small" :min="0"></el-input-number>
            </el-form-item>
            <el-form-item label="目录描述" prop="folderDesc">
              <el-input v-model="data.addForm.folderDesc" :rows="5" type="textarea"></el-input>
            </el-form-item>
          </template>
        </form-base>

        <a-e-power
          :visible.sync="powerDialogVisible"
          title="目录权限"
          :uid="uid"
          primaryId="folderId"
          deleteAuthUsers="ddc/folderauthority/deleteAuthUsers"
          :codeName="codeName"
          :user-list="authusers"
          save-interface="ddc/folderauthority/saveOrUpdate"
          :checkDataList="checkDataList"
          query-one-interface="ddc/folderauthrity/queryFolAuthOfUser"
          type="folder"
        ></a-e-power>
      </div>
    </div>
    <log v-if="logDialogVisible" :visible.sync="logDialogVisible" :uid="uid"></log>
    <folder-copy
      v-if="copyVisible"
      :visible.sync="copyVisible"
      category="2"
      :uid="uid"
      @queryBtn="queryBtn"
      :render-content="renderContent"
    ></folder-copy>
  </div>
</template>

<script type="text/jsx">
import FormBase from "../../components/FormBase.vue";
import AEltreeSelect from "../../components/Dialog/AEltreeSelect.vue";
import AEPower from "../../components/Dialog/AEPower";
import LeftTree from "../../components/Tree/leftTree";
import Log from "../../components/Log/Log.vue";
import {
  resDdcProjectPageByUpFolderId,
  resDdcFolderQueryProFolTree,
  folderListAuthUsers
} from "../../api/ddc";
import { IS_OK } from "../../api/path";
import { FOLDER_POWER } from "../../util/constListCode";
import { mixinMethodsDrag } from "../../mixin/mixinMethodsDrag";
import FolderCopy from "./folderCopy.vue";
import { mixinFolder } from "./folder";

export default {
  name: "folder",
  mixins: [mixinMethodsDrag, mixinFolder],
  components: {
    FormBase,
    LeftTree,
    AEltreeSelect,
    AEPower,
    Log,
    FolderCopy
  },
  data() {
    return {
      // 左边树
      projectLoading: true,
      projectDataTree: [],
      uid: "",
      mapDialogVisible: false,
      powerDialogVisible: false,
      logDialogVisible: false,
      codeName: FOLDER_POWER,
      dataArray: [],
      rules: {
        folderName: [
          { required: true, message: "请输入目录名称", trigger: "blur" }
        ],
        projectName: [
          { required: true, message: "请选择所属项目", trigger: "change" }
        ]
      },
      columns: [
        {
          prop: "folderName",
          label: "目录名称",
          align: "left"
        },
        {
          prop: "orderId",
          label: "排序",
          align: "left"
        },
        {
          prop: "projectName",
          label: "所属项目",
          align: "left"
        },
        {
          prop: "folderDesc",
          label: "目录描述",
          align: "left"
        }
      ],
      isTrue: false,
      startX: 0,
      authusers: [],
      treeObj: {},
      copyVisible: false,
      // checkDataList: [
      //   { dictionarydataValue: "1", dictionarydataName: "查看" },
      //   { dictionarydataValue: "2", dictionarydataName: "新增文档" },
      //   { dictionarydataValue: "3", dictionarydataName: "修改" },
      //   { dictionarydataValue: "4", dictionarydataName: "删除" },
      //   { dictionarydataValue: "10", dictionarydataName: "设置权限" }
      // ]
    };
  },
  created() {
    this.getProjectDataList();
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.findex.formInline = {
        keyword: "",
        projectId: "all",
        category: 2,
        isRevit: true
      };
    });
  },
  methods: {
    addControllerCallback() {
      this.getProjectDataList();
      this.$refs.findex.clickQuery();
      this.uid = "";
      this.valObj = {};
    },
    renderContent(h, { node, data }) {
      return (
        <span class="custom-tree-node" style="font-size: 14px; color: #606266;">
          <span
            class={data.type == "project" ? "fa fa-archive" : "fa fa-folder"}
            style="margin-right: 5px;"
          ></span>
          <span>{node.label}</span>
        </span>
      );
    },
    queryBtn() {
      this.addControllerCallback();
    },
    // 复制
    copyBtn() {
      if (this.uid) {
        this.copyVisible = true;
      } else {
        this.$message({
          message: "您没有选中任何数据项,请选中后再操作！",
          type: "warning"
        });
      }
    },
    resetForm(self) {
      self.addForm = {
        projectId: "",
        projectName: "",
        upFolderId: "",
        folderName: "",
        orderId: 0,
        folderDesc: "",
        category: 2
      };
      if (this.treeObj.projectId) {
        self.addForm.projectId = this.treeObj.projectId;
        self.addForm.projectName = this.treeObj.projectName;
        if (this.treeObj.type != "project") {
          self.addForm.upFolderId = this.treeObj.id;
        }
      }
      this.selectIndex = null;
    },
    async queryController(self, params) {
      if (JSON.stringify(params) == "{}") {
        params = {
          projectId: "all",
          category: 2
        };
      }
      const res = await resDdcProjectPageByUpFolderId(params);
      if (res.data.code === IS_OK) {
        self.dataArray = res.data.data.list;
        this.dataArray = res.data.data.list;
      }
    },
    async getProjectDataList() {
      const res = await resDdcFolderQueryProFolTree({ category: 2 });
      if (res.data.code === IS_OK) {
        this.projectDataTree = res.data.data;
        this.projectLoading = false;
        if (this.treeObj.id) {
          this.$refs.tree.setCurrentKey(this.treeObj.id);
        }
      }
    },
    async listAuthUsers(folderId) {
      const res = await folderListAuthUsers(folderId);
      if (res.data.code === IS_OK) {
        this.authusers = res.data.data;
      }
    },
    handleProjectName(obj) {
      const self = this.$refs.findex;
      this.uid = "";
      self.formInline.folderId = obj.id;
      self.addForm.projectId = obj.projectId;
      self.addForm.projectName = obj.projectName;
      self.formInline.isRevit = true;
      this.treeObj = obj;
      self.clickQuery();
    },
    addController(self) {
      if (!self.addForm.projectId) {
        this.$message.error("请选择项目分类！");
        return false;
      }
      return true;
    },
    currentChange(val) {
      this.uid = val;
    },
    powerBtn() {
      if (this.uid) {
        this.listAuthUsers(this.uid);
        this.powerDialogVisible = true;
      } else {
        this.$message({
          message: "您没有选中任何数据项,请选中后再操作！",
          type: "warning"
        });
      }
    },
    logBtn() {
      if (this.uid) {
        this.logDialogVisible = true;
      } else {
        this.$message({
          message: "您没有选中任何数据项,请选中后再操作！",
          type: "warning"
        });
      }
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
