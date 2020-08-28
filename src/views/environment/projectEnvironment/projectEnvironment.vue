<template>
  <div class="box">
    <div class="left">
      <div class="left-title">环境变量类型</div>
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
          primaryId="variateId"
          query-interface="ddc/workspacevariate/page"
          query-one-interface="ddc/workspacevariate/info"
          save-interface="ddc/workspacevariate/save"
          update-interface="ddc/workspacevariate/update"
          delete-interface="ddc/workspacevariate/delete"
          @current-change="currentChange"
          :add-controller="addController"
          :columns="columns"
          :uid.sync="uid"
          :rules="rules"
          noSearchForm
          :btn-operation-type.sync="btnOperationType"
          :reset-form="resetForm"
        >
          <template slot="add" slot-scope="data">
            <el-form-item label="变量类型" prop="variateTypeName">
              <el-input v-model="data.addForm.variateTypeName" disabled></el-input>
            </el-form-item>
            <el-form-item label="软件版本" prop="softwareversionCodeArr">
              <el-select
                v-model="data.addForm.softwareversionCodeArr"
                size="small"
                multiple
                filterable
                clearable
              >
                <el-option
                  v-for="(item, index) in softwareversionCodeArrData"
                  :label="item.dictionarydataName"
                  :value="item.dictionarydataValue"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="变量编码" prop="variateCode">
              <el-input v-model="data.addForm.variateCode"></el-input>
            </el-form-item>
            <el-form-item label="变量名称" prop="variateName">
              <el-input v-model="data.addForm.variateName"></el-input>
            </el-form-item>
            <el-form-item label="变量值" prop="variateValue">
              <el-input v-model="data.addForm.variateValue" :rows="5" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="variateDesc">
              <el-input v-model="data.addForm.variateDesc" :rows="5" type="textarea"></el-input>
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
import { IS_OK } from "../../../api/path";
import { mixinMethodsDrag } from "../../../mixin/mixinMethodsDrag";
import {
  ENVIRONMENT_VARIABLE_TYPE,
  SOFTWARE_SUPPORT
} from "../../../util/constListCode";
import { resBaseDicNameByDicCode } from "../../../api";

export default {
  name: "projectEnvironment",
  mixins: [mixinMethodsDrag],
  components: {
    FormBase,
    LeftTree
  },
  data() {
    return {
      // 左边树
      btnOperationType: "add",
      leftDataTree: [],
      uid: "",
      mapDialogVisible: false,
      dataArray: [],
      rules: {
        variateTypeName: [
          { required: true, message: "请选择变量类型", trigger: "blur" }
        ],
        softwareversionCodeArr: [
          { required: true, message: "请选择软件版本", trigger: "change" }
        ],
        variateCode: [
          { required: true, message: "请输入变量编码", trigger: "blur" }
        ],
        variateName: [
          { required: true, message: "请输入变量名称", trigger: "blur" }
        ]
      },
      columns: [
        {
          prop: "variateCode",
          label: "变量编码",
          align: "left"
        },
        {
          prop: "variateName",
          label: "变量名称",
          align: "left"
        },
        {
          prop: "createTime",
          label: "新增时间",
          align: "left"
        },
        {
          prop: "createUserId",
          label: "新增人",
          align: "left"
        }
      ],
      isTrue: false,
      startX: 0,
      treeObj: {},
      softwareversionCodeArrData: []
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
        variateType: ""
      };
    });
  },
  methods: {
    // 获取环境变量类型
    async getEnvironmentVariableType() {
      const res = await resBaseDicNameByDicCode({
        dicCode: ENVIRONMENT_VARIABLE_TYPE
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
        let obj = [];
        this.softwareversionCodeArrData.map(function(item) {
          obj.push({
            prop: item.dictionarydataName,
            label: item.dictionarydataName,
            align: "left",
            width: 100
          });
        });
        this.columns = this.columns.concat(obj);
      }
    },
    queryBtn() {
      this.$refs.findex.clickQuery();
    },
    resetForm(self) {
      self.addForm = {
        variateType: "",
        variateCode: "",
        variateValue: "",
        variateTypeName: "",
        variateName: "",
        softwareversionCodeArr: [],
        variateDesc: ""
      };
      if (this.treeObj.dictionarydataValue) {
        self.addForm.variateTypeName = this.treeObj.dictionarydataName;
        self.addForm.variateType = this.treeObj.dictionarydataValue;
      }
      this.selectIndex = null;
    },
    handleProjectName(obj) {
      const self = this.$refs.findex;
      self.uid = "";
      self.formInline.variateType = obj.dictionarydataValue;
      self.addForm.variateTypeName = obj.dictionarydataName;
      self.addForm.variateType = obj.dictionarydataValue;
      this.treeObj = obj;
      self.clickQuery();
    },
    addController(self) {
      if (!self.addForm.variateTypeName) {
        this.$message.error("请选择环境变量类型！");
        return false;
      }
      return true;
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
