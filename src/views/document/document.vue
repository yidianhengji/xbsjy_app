<template>
  <div class="box">
    <div class="left">
      <div class="left-title">目录分类</div>
      <div class="left-body" v-loading="folderLoading">
        <left-tree
          :treedata="projectAndfolderData"
          label="name"
          :single="true"
          node-key="id"
          ref="tree"
          :render-content="renderContent"
          @nodeClick="handleFolderName"
        ></left-tree>
      </div>
    </div>
    <div class="y-hander"></div>
    <div class="right">
      <div class="app-main-wrapper">
        <form-base
          ref="findex"
          primaryId="documentId"
          query-interface="ddc/document/page"
          query-one-interface="ddc/document/info/edit"
          save-interface="ddc/document/saveDocAndDetail"
          update-interface="ddc/document/update"
          delete-interface="ddc/document/delete"
          @current-change="currentChange"
          :columns="columns"
          isDefaultQuery
          :rules="rules"
          :reset-form="resetForm"
          :btn-operation-type.sync="btnOperationType"
          :reset-controller="resetController"
          add-btn-text="上传"
        >
          <template slot="searchForm" slot-scope="data">
            <el-form-item label="文档名称" prop="keyword">
              <el-input
                v-model="data.formInline.keyword"
                size="small"
                placeholder="请输入文档名称"
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
                <el-dropdown-item @click.native="documentDetailsBtn">详情</el-dropdown-item>
                <el-dropdown-item @click.native="documentDownloadBtn">下载</el-dropdown-item>
                <el-dropdown-item @click.native="documentCheckOutBtn">检出</el-dropdown-item>
                <el-dropdown-item @click.native="documentCheckInBtn">检入</el-dropdown-item>
                <el-dropdown-item @click.native="documentUnlockBtn">释放</el-dropdown-item>
                <el-dropdown-item @click.native="documentAddVersionBtn">新增版本</el-dropdown-item>
                <el-dropdown-item @click.native="documentLockDocBtn">锁定</el-dropdown-item>
                <el-dropdown-item @click.native="documentUnLockDocBtn">解锁</el-dropdown-item>
                <el-dropdown-item @click.native="documentdetail">文件记录</el-dropdown-item>
                <el-dropdown-item @click.native="powerBtn">权限</el-dropdown-item>
                <el-dropdown-item @click.native="logBtn">操作日志</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot="add" slot-scope="data">
            <el-form-item label="所属目录" prop="folderId">
              <a-eltree-select
                :treedata.sync="folderDataTree"
                label="folderName"
                node-key="folderId"
                :defaultExpandAll="false"
                :value.sync="data.addForm.folderId"
              ></a-eltree-select>
            </el-form-item>
            <el-form-item label="文档名称" prop="docName">
              <el-input v-model="data.addForm.docName"></el-input>
            </el-form-item>
            <el-form-item label="版本" prop="version">
              <el-input v-model="data.addForm.version"></el-input>
            </el-form-item>
            <el-form-item label="文件" v-if="btnOperationType=='add'">
              <big-files ref="bigFiles1" @file-success="fileSuccess"></big-files>
            </el-form-item>
            <el-form-item label="文档描述" prop="docDesc">
              <el-input v-model="data.addForm.docDesc" :rows="5" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="版本描述" prop="versionDesc">
              <el-input v-model="data.addForm.versionDesc" :rows="5" type="textarea"></el-input>
            </el-form-item>
          </template>
        </form-base>

        <a-e-power
          :visible.sync="powerDialogVisible"
          title="目录权限"
          :uid="uid"
          primaryId="documentId"
          :codeName="codeName"
          save-interface="ddc/docauthority/saveOrUpdate"
          query-one-interface="ddc/docauthority/queryDocAuthOfUser"
        ></a-e-power>

        <a-el-dialog
          :visible.sync="documentCheckInDialog"
          title="文档检入"
          width="40%"
          :beforeClose="documentCheckInDialogBeforeClose"
        >
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
            <el-form-item label="版本描述" prop="docDesc">
              <el-input v-model="documentCheckAddForm.docDesc" :rows="5" type="textarea"></el-input>
            </el-form-item>
          </el-form>
          <template slot="footer">
            <el-button type="primary" size="small" @click="documentCheckInSubmit">确定</el-button>
            <el-button type="default" size="small" @click="documentCheckInClose">取消</el-button>
          </template>
        </a-el-dialog>

        <a-el-dialog :visible.sync="documentDetailsDialog" title="文档详细" width="40%">
          <document-details :document-details="documentDetailsAddForm"></document-details>
          <template slot="footer">
            <el-button type="default" size="small" @click="documentDetailsClose">取消</el-button>
          </template>
        </a-el-dialog>

        <a-el-dialog :visible.sync="documentAddVersionDialog" title="新增版本" width="40%">
          <el-form
            ref="documentAddVersion"
            :model="documentAddVersionAddForm"
            label-width="160px"
            :rules="documentAddVersionRules"
            size="small"
            class="demo-form-inline"
          >
            <el-form-item label="当前版本">
              <el-input v-model="documentAddVersionAddForm.versionNum" disabled></el-input>
            </el-form-item>
            <el-form-item label="版本名称" prop="version">
              <el-input v-model="documentAddVersionAddForm.version"></el-input>
            </el-form-item>
            <el-form-item label="版本描述">
              <el-input v-model="documentAddVersionAddForm.versionDesc" :rows="5" type="textarea"></el-input>
            </el-form-item>
          </el-form>
          <template slot="footer">
            <el-button type="primary" size="small" @click="documentAddVersionSubmit">确定</el-button>
            <el-button type="default" size="small" @click="documentAddVersionClose">取消</el-button>
          </template>
        </a-el-dialog>
      </div>
    </div>
    <log v-if="logDialogVisible" :visible.sync="logDialogVisible" :uid="uid"></log>
    <documentdetail :visible.sync="documentdetailVisible" :uid="uid"></documentdetail>
  </div>
</template>

<script type="text/jsx">
import FormBase from "../../components/FormBase.vue";
import AElDialog from "../../components/Dialog/AElDialog.vue";
import AEltreeSelect from "../../components/Dialog/AEltreeSelect.vue";
import AEPower from "../../components/Dialog/AEPower.vue";
import LeftTree from "../../components/Tree/leftTree.vue";
import BigFiles from "../../components/BigFiles/BigFiles.vue";
import Log from "../../components/Log/Log.vue";
import {
  resDdcFolderQueryProFolTree,
  resDdcFolderQueryTree,
  resDdcDocumentInfo,
  resDdcDocumentCheckOut,
  resDdcDocumentUnlock,
  resDdcDocumentAddVersion,
  resDdcDocumentLockDoc,
  resDdcDocumentUnLockDoc,
  resDdcDocumentCheckIn
} from "../../api/ddc";
import { IS_OK, UPLOAD_FILE_DOWNLOAD } from "../../api/path";
import { FOLDER_DOCUMENT } from "../../util/constListCode";
import DocumentDetails from "./documentDetails.vue";
import Documentdetail from "./documentdetail.vue";
import { mixinMethodsDrag } from "../../mixin/mixinMethodsDrag";

export default {
  name: "document",
  mixins: [mixinMethodsDrag],
  components: {
    FormBase,
    AElDialog,
    LeftTree,
    AEltreeSelect,
    AEPower,
    BigFiles,
    DocumentDetails,
    Log,
    Documentdetail
  },
  data() {
    return {
      btnOperationType: "add",
      // 左边树
      folderLoading: true,
      projectAndfolderData: [],
      folderDataTree: [],
      uid: "",
      currentObj: {},
      mapDialogVisible: false,
      powerDialogVisible: false,
      codeName: FOLDER_DOCUMENT,
      dataArray: [],
      rules: {
        docName: [
          { required: true, message: "请输入文档名称", trigger: "blur" }
        ],
        projectId: [
          { required: true, message: "请选择所属项目", trigger: "change" }
        ]
      },
      columns: [
        {
          prop: "docName",
          label: "名称",
          align: "left",
          render: (h, param) => {
            return (
              <div
                on-click={this.documentDetailsClick.bind(
                  this,
                  param.row.documentId
                )}
                style="color: #409EFF; cursor: pointer;"
              >
                {param.row.docName}
              </div>
            );
          }
        },
        {
          prop: "lockStatus",
          label: "状态",
          align: "left",
          render: (h, param) => {
            let value = param.row.lockStatus ? "已锁" : "没锁";
            let color = param.row.lockStatus ? "red" : "green";
            return <div style={{ color: color }}>{value}</div>;
          }
        },
        {
          prop: "checkoutStatus",
          label: "检出状态",
          align: "left",
          render: (h, param) => {
            let value = param.row.checkoutStatus ? "已检出" : "未检出";
            let color = param.row.checkoutStatus ? "red" : "green";
            return <div style={{ color: color }}>{value}</div>;
          }
        },
        {
          prop: "version",
          label: "版本",
          align: "left"
        },
        {
          prop: "versionSeq",
          label: "版本序号",
          align: "left"
        },
        {
          prop: "versionDesc",
          label: "版本描述",
          align: "left"
        }
      ],
      // 文档检入
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
      },
      //文档明细
      documentDetailsDialog: false,
      documentDetailsAddForm: {},
      // 新增版本
      documentAddVersionDialog: false,
      documentAddVersionAddForm: {
        versionNum: 0,
        version: "",
        versionDesc: "",
        documentId: ""
      },
      documentAddVersionRules: {
        version: [
          { required: true, message: "请输入版本名称", trigger: "blur" }
        ]
      },
      // 操作日志
      logDialogVisible: false,
      // 文件记录
      documentdetailVisible: false
    };
  },
  created() {
    this.getFolderQueryProFol();
    this.getFolderQueryTree();
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.findex.formInline = {
        keyword: ""
      };
    });
  },
  methods: {
    resetForm(self) {
      self.addForm = {
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
      };
      this.selectIndex = null;
    },
    async getFolderQueryProFol() {
      const res = await resDdcFolderQueryProFolTree({});
      if (res.data.code === IS_OK) {
        this.projectAndfolderData = res.data.data;
        this.folderLoading = false;
      }
    },
    async getFolderQueryTree() {
      const res = await resDdcFolderQueryTree({});
      if (res.data.code === IS_OK) {
        this.folderDataTree = res.data.data;
      }
    },
    renderContent(h, { node, data }) {
      return (
        <span class="custom-tree-node" style="font-size: 14px; color: #606266;">
          <span
            class={data.type == "project" ? "fa fa-cube" : "fa fa-file-text-o"}
            style="margin-right: 5px;"
          ></span>
          <span>{node.label}</span>
        </span>
      );
    },
    resetController() {
      if (this.btnOperationType == "add") {
        this.$refs.bigFiles1.reset();
      }
    },
    fileSuccess(file, res) {
      const self = this.$refs.findex;
      self.addForm.documentdetail = {
        fileId: res.data.fileId,
        fileName: file.name,
        fileHashcode: file.uniqueIdentifier,
        fileSize: file.size
      };
    },
    handleFolderName(obj) {
      const self = this.$refs.findex;
      self.formInline.folderId = obj.id;
      self.clickQuery();
    },
    currentChange(val, currentObj) {
      this.uid = val;
      this.currentObj = currentObj;
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
    // 文件下载
    documentDownloadBtn() {
      if (this.uid) {
        if (this.currentObj.fileId) {
          window.location.href = UPLOAD_FILE_DOWNLOAD + this.currentObj.fileId;
        } else {
          this.$message({
            message: "该条数据没有文件",
            type: "warning"
          });
        }
      } else {
        this.$message({
          message: "您没有选中任何数据项,请选中后再操作！",
          type: "warning"
        });
      }
    },
    // 文档检出事件
    documentCheckOutBtn() {
      if (this.uid) {
        this.$confirm(
          this.deleteMessage ? this.deleteMessage : "是否检出这条数据?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(async () => {
            window.location.href =
              UPLOAD_FILE_DOWNLOAD + this.currentObj.fileId;
            const res = await resDdcDocumentCheckOut(this.uid);
            if (res.data.code === IS_OK) {
              setTimeout(() => {
                this.$message({
                  type: "success",
                  message: "操作成功"
                });
              }, 500);
              this.$refs.findex.clickQuery();
            }
          })
          .catch(() => {});
      } else {
        this.$message({
          message: "您没有选中任何数据项,请选中后再操作！",
          type: "warning"
        });
      }
    },
    // 文档释放
    documentUnlockBtn() {
      if (this.uid) {
        this.$confirm(
          this.deleteMessage ? this.deleteMessage : "是否释放这条数据?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(async () => {
            const res = await resDdcDocumentUnlock(this.uid);
            if (res.data.code === IS_OK) {
              setTimeout(() => {
                this.$message({
                  type: "success",
                  message: "释放成功"
                });
              }, 500);
              this.$refs.findex.clickQuery();
            }
          })
          .catch(() => {});
      } else {
        this.$message({
          message: "您没有选中任何数据项,请选中后再操作！",
          type: "warning"
        });
      }
    },
    // 锁定文档
    documentLockDocBtn() {
      if (this.uid) {
        this.$confirm(
          this.deleteMessage ? this.deleteMessage : "是否锁定这条数据?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(async () => {
            const res = await resDdcDocumentLockDoc(this.uid);
            if (res.data.code === IS_OK) {
              setTimeout(() => {
                this.$message({
                  type: "success",
                  message: "锁定成功"
                });
              }, 500);
              this.$refs.findex.clickQuery();
            }
          })
          .catch(() => {});
      } else {
        this.$message({
          message: "您没有选中任何数据项,请选中后再操作！",
          type: "warning"
        });
      }
    },
    // 解锁文档
    documentUnLockDocBtn() {
      if (this.uid) {
        this.$confirm(
          this.deleteMessage ? this.deleteMessage : "是否解锁这条数据?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(async () => {
            const res = await resDdcDocumentUnLockDoc(this.uid);
            if (res.data.code === IS_OK) {
              setTimeout(() => {
                this.$message({
                  type: "success",
                  message: "解锁成功"
                });
              }, 500);
              this.$refs.findex.clickQuery();
            }
          })
          .catch(() => {});
      } else {
        this.$message({
          message: "您没有选中任何数据项,请选中后再操作！",
          type: "warning"
        });
      }
    },
    // 文档检入事件
    fileCheckInSuccess(file, res) {
      this.documentCheckAddForm = {
        documentId: this.uid,
        fileHashcode: file.uniqueIdentifier,
        fileId: res.data.fileId,
        fileName: file.name,
        fileSize: file.size
      };
    },
    documentCheckInBtn() {
      if (this.uid) {
        this.documentCheckInDialog = true;
      } else {
        this.$message({
          message: "您没有选中任何数据项,请选中后再操作！",
          type: "warning"
        });
      }
    },
    async documentCheckSubmitData(param) {
      const res = await resDdcDocumentCheckIn(param);
      if (res.data.code === IS_OK) {
        setTimeout(() => {
          this.$message({
            type: "success",
            message: "检入成功"
          });
          this.$refs.documentCheck.resetFields();
          this.documentCheckInDialog = false;
          this.$refs.findex.clickQuery();
          this.$refs.bigFiles2.reset();
        }, 500);
      }
    },
    documentCheckInSubmit() {
      this.$refs.documentCheck.validate(valid => {
        if (valid) {
          let param = {
            ...this.documentCheckAddForm
          };
          this.documentCheckSubmitData(param);
        }
      });
    },
    documentCheckInClose() {
      this.documentCheckInDialog = false;
      this.$refs.bigFiles2.reset();
    },
    documentCheckInDialogBeforeClose() {
      this.documentCheckInDialog = false;
      this.$refs.bigFiles2.reset();
    },
    // 文档详情
    async documentDetailsClick(documentId) {
      this.documentDetailsDialog = true;
      const res = await resDdcDocumentInfo(documentId);
      if (res.data.code === IS_OK) {
        res.data.data.lockStatus
          ? (res.data.data.lockStatus = "已锁")
          : (res.data.data.lockStatus = "没锁");
        this.documentDetailsAddForm = res.data.data;
      }
    },
    async documentDetailsBtn() {
      if (this.uid) {
        this.documentDetailsDialog = true;
        const res = await resDdcDocumentInfo(this.uid);
        if (res.data.code === IS_OK) {
          res.data.data.lockStatus
            ? (res.data.data.lockStatus = "已锁")
            : (res.data.data.lockStatus = "没锁");
          this.documentDetailsAddForm = res.data.data;
        }
      } else {
        this.$message({
          message: "您没有选中任何数据项,请选中后再操作！",
          type: "warning"
        });
      }
    },
    documentDetailsClose() {
      this.documentDetailsDialog = false;
    },
    // 新增版本
    documentAddVersionBtn() {
      if (this.uid) {
        this.documentAddVersionDialog = true;
        this.documentAddVersionAddForm = {
          documentId: this.uid,
          versionNum: this.currentObj.version
        };
      } else {
        this.$message({
          message: "您没有选中任何数据项,请选中后再操作！",
          type: "warning"
        });
      }
    },
    documentAddVersionSubmit() {
      this.$refs.documentAddVersion.validate(valid => {
        if (valid) {
          let param = {
            ...this.documentAddVersionAddForm
          };
          this.documentAddVersionSubmitData(param);
        }
      });
    },
    async documentAddVersionSubmitData(param) {
      const res = await resDdcDocumentAddVersion(param);
      if (res.data.code === IS_OK) {
        setTimeout(() => {
          this.$message({
            type: "success",
            message: "新增版本成功"
          });
          this.$refs.documentAddVersion.resetFields();
          this.documentAddVersionDialog = false;
        }, 500);
      }
    },
    documentAddVersionClose() {
      this.documentAddVersionDialog = false;
      this.$refs.documentAddVersion.resetFields();
      this.documentAddVersionAddForm = {
        versionNum: 0,
        version: "",
        versionDesc: "",
        documentId: ""
      };
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
    },
    // 文件记录
    documentdetail() {
      if (this.uid) {
        this.documentdetailVisible = true;
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
