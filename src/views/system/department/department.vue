<template>
  <div class="app-main-wrapper">
    <form-base
      ref="findex"
      primaryId="departmentId"
      rowKey="departmentId"
      query-interface="base/department/queryTree"
      query-one-interface="base/department/info"
      save-interface="base/department/save"
      update-interface="base/department/update"
      delete-interface="base/department/delete"
      :query-controller="queryController"
      :columns="columns"
      :rules="rules"
      :nodePage="false"
      :reset-form="resetForm"
    >
      <template slot="searchForm" slot-scope="data">
        <el-form-item label="部门名称" prop="keyword">
          <el-input v-model="data.formInline.keyword" size="small" placeholder="请输入部门名称" clearable></el-input>
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
            :value.sync="data.addForm.companyId"
          ></a-eltree-select>
        </el-form-item>
        <el-form-item label="上级部门" prop="upDepartmentId">
          <a-eltree-select
            :treedata="dataArray"
            label="departmentName"
            nodeKey="departmentId"
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
</template>

<script type="text/jsx">
import FormBase from "../../../components/FormBase";
import AEltreeSelect from "../../../components/Dialog/AEltreeSelect";
import {
  resBaseDepartmentQueryTree,
  resBaseCompanyQueryTree
} from "../../../api";
import { IS_OK } from "../../../api/path";
export default {
  name: "department",
  components: {
    FormBase,
    AEltreeSelect
  },
  data() {
    return {
      dataArray: [],
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
  mounted() {
    this.$nextTick(() => {
      this.$refs.findex.formInline = {
        keyword: ""
      };
    });
    this.getcompany();
  },
  methods: {
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
    },
    async queryController(self) {
      let params = self.formInline;
      const res = await resBaseDepartmentQueryTree(params);
      if (res.data.code === IS_OK) {
        self.dataArray = res.data.data;
        this.dataArray = res.data.data;
      }
    },
    async getcompany() {
      const res = await resBaseCompanyQueryTree({});
      if (res.data.code === IS_OK) {
        this.companyTreedata = res.data.data;
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.app-main-wrapper {
  height: 100%;
}
</style>