<template>
  <a-el-dialog :visible.sync="visible" title="工作空间参数" width="70%" :beforeClose="beforeClose1">
    <div class="box">
      <div class="left">
        <div class="left-title">环境变量类型</div>
        <div class="left-body">
          <left-tree
            :treedata="leftDataTree"
            label="variateTypeValue"
            :single="true"
            node-key="variateType"
            ref="tree"
            @nodeClick="handleProjectName"
          ></left-tree>
        </div>
      </div>
      <div class="y-hander"></div>
      <div class="right">
        <div class="form-base">
          <div class="form-inline-base">
            <div class="form-inline-bar"></div>
            <div class="tool-bar" style="margin-bottom: 18px;">
              <el-button icon="el-icon-plus" type="primary" size="small" @click="handelAddBtn">新增</el-button>
              <el-button icon="el-icon-edit" type="primary" size="small" @click="handelEditBtn">编辑</el-button>
              <el-button
                icon="el-icon-delete"
                type="danger"
                size="small"
                @click="handelAddDelete"
              >删除</el-button>
            </div>
          </div>
          <div class="form-table-list">
            <div style="height: 360px; position: relative;">
              <el-table
                row-key="userId"
                size="mini"
                ref="multipleTable"
                :data="treedata"
                tooltip-effect="dark"
                style="width: 100%; position:absolute;"
                height="320"
                :header-cell-style="{ background: '#F5F7FA' }"
                border
                highlight-current-row
                @row-click="handleSelectionChange"
                @current-change="handleSelectionChange"
              >
                <el-table-column type="index" width="50" align="center"></el-table-column>
                <el-table-column prop="variateCode" label="变量编码"></el-table-column>
                <el-table-column prop="variateName" label="变量名称"></el-table-column>
                <el-table-column prop="variateDesc" label="描述"></el-table-column>
              </el-table>
              <div class="block" ref="paginationWrapper">
                <el-pagination
                  :page-sizes="[20, 30, 40, 50]"
                  @current-change="getNum"
                  :current-change="formInline.pageNum"
                  :size-change="formInline.pageSize"
                  @size-change="getSize"
                  :current-page="formInline.pageNum"
                  layout="sizes, total, prev, pager, next, jumper"
                  :total="total"
                ></el-pagination>
              </div>
            </div>
            <div>
              <el-form
                :model="addFormBotom"
                ref="formInline1"
                size="small"
                label-width="90px"
                class="demo-form-inline"
              >
                <el-form-item label="参数值展示" style="margin-top: 15px;">
                  <el-input
                    v-model="addFormBotom.parameterValue"
                    size="small"
                    type="textarea"
                    rows="5"
                    readonly
                  ></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <a-el-dialog :visible.sync="visibleAddForm" title="配置工作空间环境变量" width="40%">
      <el-form
        :model="addForm"
        ref="formInline1"
        size="small"
        :rules="rules"
        label-width="160px"
        class="demo-form-inline"
      >
        <el-form-item label="软件版本" prop="softwareversionName" v-if="visibleAddFormType==='add'">
          <el-input
            v-model="uidObj.softwareversionName"
            size="small"
            placeholder="请输入软件版本"
            readonly
          ></el-input>
        </el-form-item>
        <el-form-item label="环境变量类型" prop="variateType" v-if="visibleAddFormType==='add'">
          <el-select
            v-model="addForm.variateType"
            size="small"
            style="width: 100%;"
            @change="hadelVariateType"
          >
            <el-option
              v-for="(item, index) in getVariateTypeBySoftArr"
              :label="item.variateTypeValue"
              :value="item.variateType"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="环境变量" prop="environmentVariableId" v-if="visibleAddFormType==='add'">
          <el-select v-model="addForm.environmentVariableId" size="small" style="width: 100%;">
            <el-option
              v-for="item in environmentVariableArrData"
              :key="item.variateType"
              :label="item.variateName"
              :value="item.variateId"
            ></el-option>
          </el-select>
          <!-- <p>{{reversedMessage}}</p> -->
        </el-form-item>
        <el-form-item label="环境变量" prop="variateCodeEdit" v-if="visibleAddFormType==='edit'">
          <el-input v-model="addForm.variateCodeEdit" size="small" placeholder readonly></el-input>
        </el-form-item>
        <el-form-item label="操作类型" prop="operateType">
          <el-select v-model="addForm.operateType" size="small" style="width: 100%;">
            <el-option
              v-for="(item, index) in operationTypeArr"
              :label="item.name"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="编辑模式" prop="editingMode">
          <el-select
            v-model="addForm.editingMode"
            size="small"
            style="width: 100%;"
            @change="editingModeChange"
          >
            <el-option
              v-for="(item, index) in editingModeData"
              :label="item.name"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参数值" prop="workspaceVariatevalue">
          <el-row>
            <el-col :span="20">
              <el-input
                v-model="addForm.workspaceVariatevalue"
                size="small"
                type="textarea"
                rows="5"
                @blur="workspaceVariatevalueInput"
              ></el-input>
            </el-col>
            <el-col :span="4" style="padding-left: 10px;">
              <el-button type="primary" size="small" @click="selectResourcesClick">选择资源</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <hr />
        <el-form-item label="参数值展示" prop="parameterValueDisplay" style="margin-top: 15px;">
          <el-input
            v-model="addForm.parameterValueDisplay"
            size="small"
            type="textarea"
            rows="5"
            readonly
            disabled
          ></el-input>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button type="primary" size="small" @click="addFormBtn">确定</el-button>
        <el-button type="default" size="small" @click="addFormBtnClose">取消</el-button>
      </template>
    </a-el-dialog>
    <parameterDetailsFolder
      :visible.sync="parameterDetailsFolderVisible"
      :uidObj="uidObj"
      @workspaceVariatevalue-change="workspaceVariatevalueChange"
    ></parameterDetailsFolder>
  </a-el-dialog>
</template>

<script>
import AElDialog from "../../../components/Dialog/AElDialog.vue";
import LeftTree from "../../../components/Tree/leftTree";
import {
  resDdcProjectPageByUpFolderId,
  resWorkspacevariatePage,
  resWorkspaceGetVariateTypeBySoft,
  resWorkspacevariatevalueSave,
  resWorkspacevariatevaluePage,
  resWorkspaceGetVariateTypeByWorkspaceId,
  resWorkspacevariatevalueDelete,
  resWorkspacevariatevalueInfo,
  resWorkspacevariatevalueUpdate
} from "../../../api/ddc";
import { IS_OK } from "../../../api/path";
import { SOFTWARE_SUPPORT } from "../../../util/constListCode";
import { resBaseDicNameByDicCode } from "../../../api";
import ParameterDetailsFolder from "./parameterDetailsFolder.vue";
export default {
  name: "parameterDetails",
  components: {
    AElDialog,
    LeftTree,
    ParameterDetailsFolder
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    uidObj: {
      type: Object
    }
  },
  data() {
    return {
      softwareversionCodeArrData: [],
      parameterDetailsFolderVisible: false,
      getVariateTypeBySoftArr: [],
      leftDataTree: [],
      dataArray: [],
      uid: "",
      treedata: [],
      tableRowObj: {},
      total: 0,
      formInline: {
        pageSize: 20,
        pageNum: 1,
        keyword: "",
        id: ""
      },
      formInline1: {
        variateType: "",
        pageSize: 20,
        pageNum: 1,
        keyword: "",
        id: ""
      },
      visibleAddForm: false,
      visibleAddFormType: "add",
      addForm: {
        softwareversionCodeArr: "",
        variateType: "",
        variateValue: "",
        environmentVariableId: "",
        variateId: "", // 参数id
        parameterValueDisplay: "", // 参数值展示
        variateName: "",
        operateType: "", // 操作类型
        workspaceVariatevalue: "",
        editingMode: "1",
        variatevalueId: "", // 参数配置ID
        variatevalueValue: "", // 工作空间变量值
        workdirId: "", // 工作空间资源目录ID（文件的直接上级目录）
        workspaceId: "", // 工作空间ID
        variateCodeEdit: "" // 环境变量展示
      },
      editObj: {},
      addFormBotom: {
        parameterValue: ""
      },
      operationTypeArr: [
        { name: ":  条件赋值", value: "1" },
        { name: "+  附加到值", value: "2" },
        { name: "<  前置到列表", value: "3" },
        { name: "=  赋值", value: "4" },
        { name: ">  附加到列表", value: "5" }
      ],
      editingModeData: [
        { name: "覆盖", value: "1" },
        { name: "附加", value: "2" },
        { name: "前加", value: "3" }
      ],
      environmentVariableArrData: [],
      rules: {
        // softwareversionName: [
        //   { required: true, message: "请输入所属分类", trigger: "blur" }
        // ],
      }
    };
  },
  created() {
    this.getEnvironmentVariableType();
    this.getSoftwareVersion();
    this.getVariateTypeBySoftApi();
    this.getResWorkspacevariatePage();
  },
  computed: {
    // reversedMessage: function() {
    //   let obj = "";
    //   if (this.environmentVariableArrData.length > 0) {
    //     this.environmentVariableArrData.map(item => {
    //       if (item.variateId == this.addForm.environmentVariableId) {
    //         obj = item.variateDesc;
    //       }
    //     });
    //   }
    //   return obj;
    // }
  },
  methods: {
    async getVariateTypeBySoftApi() {
      const res = await resWorkspaceGetVariateTypeBySoft({
        softwareversionCode: this.uidObj.softwareversionCode
      });
      if (res.data.code === IS_OK) {
        this.getVariateTypeBySoftArr = res.data.data;
      }
    },
    handelAddBtn() {
      this.visibleAddFormType = "add";
      this.visibleAddForm = true;
    },
    handelEditBtn() {
      if (this.tableRowObj.variateId) {
        this.getDetailsObj();
        this.visibleAddFormType = "edit";
        this.visibleAddForm = true;
      } else {
        this.$message({
          message: "您没有选中任何数据项,请选中后再操作！",
          type: "warning"
        });
      }
    },
    handelAddDelete() {
      if (this.tableRowObj.variateId) {
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
    async getDetailsObj() {
      const res = await resWorkspacevariatevalueInfo({
        variateId: this.tableRowObj.variateId,
        workspaceId: this.uidObj.workspaceId
      });
      if (res.data.code === IS_OK) {
        let items = res.data.data;
        this.addForm.parameterValueDisplay = items.workspaceVariatevalue;
        this.addForm.workspaceVariatevalue = items.workspaceVariatevalue;
        this.addForm.variateCodeEdit = items.variateCode;
        this.addForm.operateType = items.operateType + "";
        this.editObj = items;
      }
    },
    async getDeleteObj() {
      // let obj = {
      //   variateId: this.tableRowObj.variateId,
      //   workspaceId: this.uidObj.workspaceId
      // };
      let str = `?variateId=${this.tableRowObj.variateId}&workspaceId=${this.uidObj.workspaceId}`;
      const res = await resWorkspacevariatevalueDelete(str);
      if (res.data.code === IS_OK) {
        setTimeout(() => {
          this.$message({
            type: "success",
            message: "删除成功"
          });
          this.addFormBotom.parameterValue = "";
          this.tableRowObj = {};
          this.$refs.multipleTable.setCurrentRow();
          this.getResWorkspacevariatePage();
          this.getEnvironmentVariableType();
        }, 500);
      }
    },
    getNum(val) {
      this.formInline.pageNum = val;
      this.getUserListData();
    },
    getSize(val) {
      this.formInline.pageSize = val;
      this.getUserListData();
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.addFormBotom.parameterValue = val.workspaceVariatevalue;
      this.tableRowObj = val;
    },
    async getSoftwareVersion() {
      const res = await resBaseDicNameByDicCode({
        dicCode: SOFTWARE_SUPPORT
      });
      if (res.data.code === IS_OK) {
        this.softwareversionCodeArrData = res.data.data;
      }
    },
    // 获取环境变量类型
    async getEnvironmentVariableType() {
      const res = await resWorkspaceGetVariateTypeByWorkspaceId({
        workspaceId: this.uidObj.workspaceId
      });
      if (res.data.code === IS_OK) {
        this.leftDataTree = res.data.data;
      }
    },
    async queryController(self, params) {
      if (JSON.stringify(params) == "{}") {
        params = {
          projectId: "all"
        };
      }
      const res = await resDdcProjectPageByUpFolderId(params);
      if (res.data.code === IS_OK) {
        self.dataArray = res.data.data.list;
        this.dataArray = res.data.data.list;
      }
    },
    async getResWorkspacevariatePage() {
      this.formInline.workspaceId = this.uidObj.workspaceId;
      const res = await resWorkspacevariatevaluePage(this.formInline);
      if (res.data.code === IS_OK) {
        this.treedata = res.data.data.list;
        this.total = res.data.data.totalCount;
        this.$refs.multipleTable.setCurrentRow();
      }
    },
    handleProjectName(obj) {
      this.formInline.variateType = obj.variateType;
      this.addFormBotom.parameterValue = "";
      this.getResWorkspacevariatePage();
    },
    beforeClose1() {
      this.$emit("update:visible", false);
    },
    async getEnvironmentVariable() {
      const res = await resWorkspacevariatePage(this.formInline1);
      if (res.data.code === IS_OK) {
        this.environmentVariableArrData = res.data.data.list;
      }
    },
    hadelVariateType() {
      this.addForm.environmentVariableId = "";
      this.formInline1.variateType = this.addForm.variateType;
      this.getEnvironmentVariable();
    },
    selectResourcesClick() {
      this.parameterDetailsFolderVisible = true;
    },
    addFormBtn() {
      this.$refs.formInline1.validate(valid => {
        if (valid) {
          this.addSumit(this.visibleAddFormType);
        }
      });
    },
    addFormBtnClose() {
      this.$refs.formInline1.resetFields();
      this.visibleAddForm = false;
    },
    async addSumit(type) {
      if (type == "add") {
        let obj = {
          operateType: this.addForm.operateType,
          variateId: this.addForm.environmentVariableId,
          workspaceVariatevalue: this.addForm.parameterValueDisplay,
          workspaceId: this.uidObj.workspaceId
        };
        const res = await resWorkspacevariatevalueSave(obj);
        if (res.data.code === IS_OK) {
          setTimeout(() => {
            this.$message({
              type: "success",
              message: "新增成功"
            });
            this.visibleAddForm = false;
            this.$refs.formInline1.resetFields();
            this.addFormBotom.parameterValue = "";
            this.tableRowObj = {};
            this.getResWorkspacevariatePage();
            this.$refs.multipleTable.setCurrentRow();
            this.getEnvironmentVariableType();
          }, 500);
        }
      } else if (type == "edit") {
        let obj = {
          operateType: this.addForm.operateType,
          variateId: this.tableRowObj.variateId,
          workspaceVariatevalue: this.addForm.parameterValueDisplay,
          workspaceId: this.uidObj.workspaceId
        };
        const res = await resWorkspacevariatevalueUpdate(obj);
        if (res.data.code === IS_OK) {
          setTimeout(() => {
            this.$message({
              type: "success",
              message: "修改成功"
            });
            this.visibleAddForm = false;
            this.$refs.formInline1.resetFields();
            this.addFormBotom.parameterValue = "";
            this.tableRowObj = {};
            this.getResWorkspacevariatePage();
            this.$refs.multipleTable.setCurrentRow();
            this.getEnvironmentVariableType();
          }, 500);
        }
      }
    },
    editingModeChange() {
      this.addForm.workspaceVariatevalue = "";
      // 如果选择了覆盖 就把参数值展示的数据覆给参数值
      if (this.addForm.editingMode == 1) {
        this.addForm.workspaceVariatevalue = this.addForm.parameterValueDisplay;
      }
    },
    workspaceVariatevalueInput() {
      if (this.addForm.workspaceVariatevalue != "") {
        if (this.addForm.editingMode == 1) {
          this.addForm.parameterValueDisplay = this.addForm.workspaceVariatevalue;
        } else if (this.addForm.editingMode == 2) {
          this.addForm.parameterValueDisplay =
            this.addForm.parameterValueDisplay +
            ";" +
            this.addForm.workspaceVariatevalue;
        } else if (this.addForm.editingMode == 3) {
          this.addForm.parameterValueDisplay =
            this.addForm.workspaceVariatevalue +
            ";" +
            this.addForm.parameterValueDisplay;
        }
        this.addForm.workspaceVariatevalue = "";
      }
    },
    workspaceVariatevalueChange(obj) {
      if (this.addForm.editingMode == 1) {
        this.addForm.parameterValueDisplay = obj;
      } else if (this.addForm.editingMode == 2) {
        this.addForm.parameterValueDisplay =
          this.addForm.parameterValueDisplay + ";" + obj;
      } else if (this.addForm.editingMode == 3) {
        this.addForm.parameterValueDisplay =
          obj + ";" + this.addForm.parameterValueDisplay;
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.box {
  display: flex;
  height: 600px;
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

    .form-base {
      padding: 10px;
      box-sizing: border-box;
      height: 100%;
      width: 100%;

      .form-inline-base {
        border: 1px solid #eee;
        padding: 15px 10px 0px;
        box-sizing: border-box;
        border-left: 6px solid #409eff;
        box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.2);
        display: flex;
        width: 100%;

        .form-inline-bar {
          flex: 1;
        }
      }
    }
  }

  .form-table-list {
    margin-top: 10px;
    height: calc(100% - 78px);
    position: relative;

    .block {
      margin-top: 10px;
      overflow: hidden;
      position: absolute;
      bottom: 0px;
    }
  }
}
</style>
