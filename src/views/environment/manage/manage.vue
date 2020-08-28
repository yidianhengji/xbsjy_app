<template>
  <div class="box">
    <div class="left">
      <div class="left-title">工作空间分类</div>
      <div class="left-body">
        <left-tree
          :treedata="leftDataTree"
          label="dictionarydataName"
          :single="true"
          node-key="dictionarydataValue"
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
          primaryId="workspaceId"
          query-interface="ddc/workspace/page"
          query-one-interface="ddc/workspace/info"
          save-interface="ddc/workspace/save"
          update-interface="ddc/workspace/update"
          delete-interface="ddc/workspace/delete"
          @current-change="currentChange"
          :add-controller="addController"
          :columns="columns"
          :uid.sync="uid"
          :rules="rules"
          :btn-operation-type.sync="btnOperationType"
          noSearchForm
          :reset-form="resetForm"
        >
          <template slot="toolbar">
            <el-dropdown style="margin-left: 5px;">
              <el-button type="primary" size="small">
                更多操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="parameterDetailsBtn">工作空间变量</el-dropdown-item>
                <el-dropdown-item @click.native="parameterResourcesBtn">工作空间资源</el-dropdown-item>
                <!-- <el-dropdown-item @click.native="journalBtn">日志</el-dropdown-item> -->
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot="add" slot-scope="data">
            <el-form-item label="所属分类" prop="classifyValue">
              <el-input v-model="data.addForm.classifyValue" disabled></el-input>
            </el-form-item>
            <el-form-item label="所属分类" prop="type" v-show="btnOperationType=='add'">
              <el-radio v-model="type" label="1">模板方式添加</el-radio>
              <el-radio v-model="type" label="2">非模板方式添加</el-radio>
            </el-form-item>
            <el-form-item
              label="工作空间模板"
              prop="workspaceId"
              v-show="btnOperationType=='add' && type==1"
            >
              <el-select v-model="data.addForm.workspaceId" size="small">
                <el-option
                  v-for="(item,index) in WorkspacedirPage"
                  :value="item.workspaceId"
                  :label="item.workspaceCode"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="工作空间名称" prop="workspaceCode">
              <el-input v-model="data.addForm.workspaceCode"></el-input>
            </el-form-item>
            <el-form-item label="软件版本" prop="softwareversionCode">
              <el-select v-model="data.addForm.softwareversionCode" size="small">
                <el-option
                  v-for="(item, index) in softwareversionCodeArrData"
                  :label="item.dictionarydataName"
                  :value="item.dictionarydataValue"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="排序" prop="orderId">
              <el-input-number v-model="data.addForm.orderId" size="small" :min="0"></el-input-number>
            </el-form-item>
            <el-form-item label="描述" prop="workspaceName">
              <el-input v-model="data.addForm.workspaceName" :rows="5" type="textarea"></el-input>
            </el-form-item>
          </template>
        </form-base>
      </div>
    </div>
    <ParameterDetails
      v-if="parameterDetailsVisible"
      :visible.sync="parameterDetailsVisible"
      :uidObj="uidObj"
    ></ParameterDetails>
    <ParameterResources
      v-if="parameterResourcesBtnVisible"
      :visible.sync="parameterResourcesBtnVisible"
      :uidObj="uidObj"
    ></ParameterResources>
  </div>
</template>

<script type="text/jsx">
import FormBase from "../../../components/FormBase.vue";
import LeftTree from "../../../components/Tree/leftTree";
import { IS_OK } from "../../../api/path";
import { mixinMethodsDrag } from "../../../mixin/mixinMethodsDrag";
import { mixinParameterDetails } from "./mixinParameterDetails";
import {
  WORKSPACE_CLASSIFICATION,
  SOFTWARE_SUPPORT
} from "../../../util/constListCode";
import { resBaseDicNameByDicCode } from "../../../api";
import ParameterDetails from "./parameterDetails.vue";
import ParameterResources from "./parameterResources.vue";
import { resWorkspacedirPage } from "@/api/ddc";

export default {
  name: "manage",
  mixins: [mixinMethodsDrag, mixinParameterDetails],
  components: {
    FormBase,
    LeftTree,
    ParameterDetails,
    ParameterResources
  },
  data() {
    return {
      // 左边树
      btnOperationType: "add",
      leftDataTree: [],
      uid: "",
      uidObj: {},
      mapDialogVisible: false,
      dataArray: [],
      rules: {
        classifyValue: [
          { required: true, message: "请输入所属分类", trigger: "blur" }
        ],
        workspaceCode: [
          { required: true, message: "请输入工作空间名称", trigger: "blur" }
        ],
        softwareversionCode: [
          { required: true, message: "请选择软件版本", trigger: "change" }
        ]
      },
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
          prop: "classifyValue",
          label: "工作空间分类"
        },
        {
          prop: "createTime",
          label: "新增时间"
        },
        {
          prop: "createUserId",
          label: "新增人"
        }
      ],
      type: "1",
      isTrue: false,
      startX: 0,
      treeObj: {},
      softwareversionCodeArrData: [],
      WorkspacedirPage: []
    };
  },
  created() {
    // 获取环境变量类型
    this.getEnvironmentVariableType();
    // 软件版本
    this.getSoftwareVersion();
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.findex.formInline = {
        classifyId: "",
        noExclude: true,
        workspaceType: "1",
        showType: 3
      };
    });
  },
  methods: {
    // 获取环境变量类型
    async getEnvironmentVariableType() {
      const res = await resBaseDicNameByDicCode({
        dicCode: WORKSPACE_CLASSIFICATION
      });
      if (res.data.code === IS_OK) {
        this.leftDataTree = res.data.data;
      }
    },
    async getSoftwareVersion() {
      const res = await resBaseDicNameByDicCode({
        dicCode: SOFTWARE_SUPPORT
      });
      if (res.data.code === IS_OK) {
        this.softwareversionCodeArrData = res.data.data;
      }
    },
    queryBtn() {
      this.$refs.findex.clickQuery();
    },
    resetForm(self) {
      self.addForm = {
        classifyId: "",
        classifyValue: "",
        workspaceCode: "",
        softwareversionCode: "",
        orderId: 0,
        workspaceName: "",
        workspaceType: "1",
        noExclude: true,
        workspaceId: "",
        type: "1"
      };
      if (this.treeObj.dictionarydataValue) {
        self.addForm.classifyId = this.treeObj.dictionarydataValue;
        self.addForm.classifyValue = this.treeObj.dictionarydataName;
      }
      this.selectIndex = null;
    },
    handleProjectName(obj) {
      const self = this.$refs.findex;
      this.uid = "";
      self.formInline.classifyId = obj.dictionarydataValue;
      self.addForm.classifyId = obj.dictionarydataValue;
      self.addForm.classifyValue = obj.dictionarydataName;
      self.addForm.noExclude = true;
      self.addForm.workspaceType = "1";
      this.treeObj = obj;
      this.getresWorkspacedirPage(obj.dictionarydataValue);
      self.clickQuery();
    },
    async getresWorkspacedirPage(classifyId) {
      const res = await resWorkspacedirPage({
        classifyId: classifyId,
        workspaceType: 2,
        showType: 3
      });
      if (res.data.code === IS_OK) {
        this.WorkspacedirPage = res.data.data.list;
      }
    },
    addController(self) {
      if (!self.addForm.classifyId) {
        this.$message.error("请选择工作空间分类！");
        return false;
      }
      return true;
    },
    currentChange(val, obj) {
      this.uid = val;
      this.uidObj = obj;
    }
  },
  watch: {
    type(val) {
      if (val == "2") {
        this.$refs.findex.addForm.workspaceId = "";
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
