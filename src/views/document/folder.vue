<template>
  <div class="box">
    <div class="left">
      <div class="left-title">项目分类</div>
      <div class="left-body" v-loading="projectLoading">
        <left-tree
          :treedata="projectDataTree"
          label="projectName"
          :single="true"
          node-key="projectId"
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
          primaryId="folderId"
          rowKey="folderId"
          query-interface="ddc/folder/page"
          query-one-interface="ddc/folder/info"
          save-interface="ddc/folder/save"
          update-interface="ddc/folder/update"
          delete-interface="ddc/folder/delete"
          :query-controller="queryController"
          @current-change="currentChange"
          :columns="columns"
          :rules="rules"
          :nodePage="false"
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
                更多操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="powerBtn">权限</el-dropdown-item>
                <el-dropdown-item @click.native="logBtn">操作日志</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot="add" slot-scope="data">
            <el-form-item label="所属项目" prop="projectId">
              <a-eltree-select
                :treedata.sync="projectDataTree"
                label="projectName"
                node-key="projectId"
                :defaultExpandAll="false"
                :value.sync="data.addForm.projectId"
              ></a-eltree-select>
            </el-form-item>
            <el-form-item label="上级目录" prop="upFolderId">
              <a-eltree-select
                :treedata.sync="dataArray"
                label="folderName"
                node-key="folderId"
                :defaultExpandAll="false"
                :value.sync="data.addForm.upFolderId"
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
          :codeName="codeName"
          save-interface="ddc/folderauthority/saveOrUpdate"
          query-one-interface="ddc/folderauthority/queryFolAuthOfUser"
        ></a-e-power>
      </div>
    </div>
    <log v-if="logDialogVisible" :visible.sync="logDialogVisible" :uid="uid"></log>
  </div>
</template>

<script type="text/jsx">
import FormBase from "../../components/FormBase.vue";
import AEltreeSelect from "../../components/Dialog/AEltreeSelect";
import AEPower from "../../components/Dialog/AEPower";
import LeftTree from "../../components/Tree/leftTree";
import Log from "../../components/Log/Log.vue";
import { resDdcFolderQueryTree, resDdcProjectQueryTree } from "../../api/ddc";
import { IS_OK } from "../../api/path";
import { FOLDER_POWER } from "../../util/constListCode";
import { mixinMethodsDrag } from "../../mixin/mixinMethodsDrag";

export default {
  name: "folder",
  mixins: [mixinMethodsDrag],
  components: {
    FormBase,
    LeftTree,
    AEltreeSelect,
    AEPower,
    Log
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
        projectId: [
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
          prop: "folderDesc",
          label: "目录描述",
          align: "left"
        }
      ],
      isTrue: false,
      startX: 0
    };
  },
  created() {
    this.getProjectDataList();
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.findex.formInline = {
        keyword: "",
        projectId: "all"
      };
    });
  },
  methods: {
    resetForm(self) {
      self.addForm = {
        projectId: "",
        upFolderId: "",
        folderName: "",
        orderId: 0,
        folderDesc: ""
      };
      this.selectIndex = null;
    },
    async queryController(self, params) {
      if (JSON.stringify(params) == "{}") {
        params = {
          projectId: "all"
        };
      }
      const res = await resDdcFolderQueryTree(params);
      if (res.data.code === IS_OK) {
        self.dataArray = res.data.data;
        this.dataArray = res.data.data;
      }
    },
    async getProjectDataList() {
      const res = await resDdcProjectQueryTree({});
      if (res.data.code === IS_OK) {
        this.projectDataTree = res.data.data;
        this.projectLoading = false;
      }
    },
    handleProjectName(obj) {
      const self = this.$refs.findex;
      self.formInline.projectId = obj.projectId;
      self.clickQuery();
    },
    currentChange(val) {
      this.uid = val;
    },
    powerBtn() {
      if (this.uid) {
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
