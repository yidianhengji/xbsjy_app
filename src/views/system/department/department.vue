<template>
  <div class="box">
    <div class="left">
      <div class="left-title">单位-部门</div>
      <div class="left-body">
        <left-tree
          :treedata="comDepDataTree"
          label="name"
          :single="true"
          node-key="id"
          ref="tree"
          @nodeClick="handleProjectName"
          :render-content="renderContent"
        ></left-tree>
      </div>
    </div>
    <div class="y-hander"></div>
    <div class="right">
      <div class="app-main-wrapper">
        <form-base
          ref="findex"
          primaryId="departmentId"
          rowKey="departmentId"
          query-interface="base/department/page"
          query-one-interface="base/department/info"
          save-interface="base/department/save"
          update-interface="base/department/update"
          delete-interface="base/department/delete"
          :uid.sync="uid"
          :btn-operation-type.sync="btnOperationType"
          :columns="columns"
          :add-controller="addController"
          :addControllerCallback="addControllerCallback"
          :deleteControllerCallback="addControllerCallback"
          :rules="rules"
          :nodePage="false"
          :reset-form="resetForm"
          noViewBtn
        >
          <template slot="searchForm" slot-scope="data">
            <el-form-item label="部门名称" prop="keyword">
              <el-input
                v-model="data.formInline.keyword"
                size="small"
                placeholder="请输入部门名称"
                clearable
              ></el-input>
            </el-form-item>
          </template>
          <template slot="add" slot-scope="data">
            <el-form-item label="部门名称" prop="departmentName">
              <el-input v-model="data.addForm.departmentName" placeholder="请输入部门名称"></el-input>
            </el-form-item>
            <el-form-item label="单位" prop="companyId">
              <a-eltree-select
                :treedata="companyTreedata"
                label="companyName"
                nodeKey="companyId"
                noBtn
                :value.sync="data.addForm.companyId"
              ></a-eltree-select>
            </el-form-item>
            <el-form-item label="上级部门" prop="upDepartmentId">
              <a-eltree-select
                :treedata="dataArray"
                label="name"
                nodeKey="id"
                noBtn
                :value.sync="data.addForm.upDepartmentId"
              ></a-eltree-select>
            </el-form-item>
            <el-form-item label="是否启用" prop="isEnable">
              <el-switch v-model="data.addForm.isEnable"></el-switch>
            </el-form-item>
            <el-form-item label="排序" prop="orderId">
              <el-input-number v-model="data.addForm.orderId" :min="0"></el-input-number>
            </el-form-item>
          </template>
        </form-base>
      </div>
    </div>
  </div>
</template>

<script type="text/jsx">
import FormBase from "../../../components/FormBase";
import AEltreeSelect from "../../../components/Dialog/AEltreeSelect.vue";
import LeftTree from "../../../components/Tree/leftTree";
import {
  resBaseCompanyQueryTree,
  resBaseDepartmentQueryComDepTree
} from "../../../api";
import { IS_OK } from "../../../api/path";
import { mixinMethodsDrag } from "../../../mixin/mixinMethodsDrag";
export default {
  name: "department",
  mixins: [mixinMethodsDrag],
  components: {
    LeftTree,
    FormBase,
    AEltreeSelect
  },
  data() {
    return {
      uid: "",
      objTable: {},
      btnOperationType: "add",
      dataArray: [],
      comDepDataTree: [],
      companyTreedata: [], // 单位列表
      rules: {
        departmentName: [
          { required: true, message: "部门名称不能为空", trigger: "blur" }
        ],
        companyId: [
          { required: true, message: "单位不能为空", trigger: "blur" }
        ]
      },
      columns: [
        {
          prop: "departmentName",
          label: "部门名称",
          align: "left"
        },
        {
          prop: "companyName",
          label: "所属单位"
        },
        {
          prop: "orderId",
          label: "排序",
          align: "center"
        }
      ]
    };
  },
  created() {
    this.getComDepDataTree();
    this.queryController1();
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.findex.formInline = {
        keyword: "",
        id: ""
      };
    });
    this.getcompany();
  },
  methods: {
    renderContent(h, { node, data }) {
      console.log(node);
      console.log(data);
      return (
        <span class="custom-tree-node" style="font-size: 14px; color: #606266;">
          <span
            class={data.children.length > 0 ? "fa fa-sitemap" : "fa fa-user"}
            style="margin-right: 5px;"
          ></span>
          <span>{data.name}</span>
        </span>
      );
    },
    resetForm(self) {
      self.addForm = {
        departmentName: "",
        companyId: "",
        upDepartmentId: "",
        fullPath: "",
        isEnable: true,
        orderId: 0
      };
      this.selectIndex = null;
      if (this.objTable.companyId) {
        self.addForm.companyId = this.objTable.companyId;
        if (this.objTable.type == "department") {
          if (this.objTable.upDepartmentId == "") {
            self.addForm.upDepartmentId = this.objTable.id;
          } else {
            alert(this.objTable.upDepartmentId);
            self.addForm.upDepartmentId = this.objTable.id;
          }
        }
        if (this.objTable.type == "company") {
          self.addForm.upDepartmentId = "";
        }
      }
    },
    addController(self) {
      if (!self.addForm.companyId) {
        this.$message({
          message: "请选择部门！",
          type: "warning"
        });
        return false;
      }
      return true;
    },
    addControllerCallback() {
      this.getComDepDataTree();
      this.$refs.findex.clickQuery();
      this.objTable = {};
      this.uid = "";
    },
    async queryController1() {
      const res = await resBaseDepartmentQueryComDepTree();
      if (IS_OK === res.data.code) {
        this.dataArray = res.data.data;
      }
    },
    handleProjectName(obj) {
      const self = this.$refs.findex;
      self.formInline.id = obj.id;
      self.clickQuery();
      this.objTable = obj;
      self.addForm.companyId = obj.companyId;
      if (obj.type == "department") {
        if (obj.upDepartmentId == "") {
          self.addForm.upDepartmentId = obj.id;
        } else {
          self.addForm.upDepartmentId = obj.id;
        }
      }
      if (obj.type == "company") {
        self.addForm.upDepartmentId = "";
      }
    },
    async getcompany() {
      const res = await resBaseCompanyQueryTree({});
      if (res.data.code === IS_OK) {
        this.companyTreedata = res.data.data;
      }
    },
    async getComDepDataTree() {
      const res = await resBaseDepartmentQueryComDepTree();
      if (IS_OK === res.data.code) {
        this.comDepDataTree = res.data.data;
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
