<template>
  <div class="app-main-wrapper">
    <form-base
      ref="findex"
      primaryId="companyId"
      rowKey="companyId"
      query-interface="base/company/queryTree"
      query-one-interface="base/company/info"
      save-interface="base/company/save"
      update-interface="base/company/update"
      delete-interface="base/company/delete"
      :query-controller="queryController"
      :columns="columns"
      :rules="rules"
      :uid.sync="uid"
      :nodePage="false"
      :reset-form="resetForm"
    >
      <template slot="searchForm" slot-scope="data">
        <el-form-item label="单位名称" prop="keyword">
          <el-input
            v-model="data.formInline.keyword"
            size="small"
            placeholder="请输入单位名称"
            clearable
          ></el-input>
        </el-form-item>
      </template>
      <template slot="add" slot-scope="data">
        <el-form-item label="上级单位" prop="upCompanyId">
          <a-eltree-select
            :treedata.sync="dataArray"
            label="companyName"
            node-key="companyId"
            :defaultExpandAll="false"
            :value.sync="data.addForm.upCompanyId"
          ></a-eltree-select>
        </el-form-item>
        <el-form-item label="单位名称" prop="companyName">
          <el-input v-model="data.addForm.companyName"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="manager">
          <el-input v-model="data.addForm.manager"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="data.addForm.tel"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="data.addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="传真" prop="fax">
          <el-input v-model="data.addForm.fax"></el-input>
        </el-form-item>
        <el-form-item label="公司地点" prop="address">
          <el-input v-model="data.addForm.address"></el-input>
        </el-form-item>
        <el-form-item label="邮编" prop="postalcode">
          <el-input v-model="data.addForm.postalcode"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="orderId">
          <el-input-number
            v-model="data.addForm.orderId"
            :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="是否启用" prop="isEnable">
          <el-switch v-model="data.addForm.isEnable"></el-switch>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="data.addForm.remark"
            :rows="5"
            type="textarea"
          ></el-input>
        </el-form-item>
      </template>
    </form-base>
  </div>
</template>

<script type="text/jsx">
import FormBase from "../../../components/FormBase";
import AEltreeSelect from "../../../components/Dialog/AEltreeSelect";
import { resBaseCompanyQueryTree } from "../../../api";
import { IS_OK } from "../../../api/path";
export default {
  name: "company",
  components: {
    FormBase,
    AEltreeSelect
  },
  data() {
    return {
      dataArray: [],
      rules: {
        companyName: [
          { required: true, message: "单位名称不能为空", trigger: "blur" }
        ]
      },
      uid: "",
      columns: [
        {
          prop: "companyName",
          label: "单位名称",
          align: "left"
        },
        {
          prop: "manager",
          label: "负责人",
          align: "center"
        },
        {
          prop: "tel",
          label: "电话",
          align: "center"
        },
        {
          prop: "postalcode",
          label: "邮编",
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
      const res = await resBaseCompanyQueryTree(params);
      if (res.data.code === IS_OK) {
        self.dataArray = res.data.data;
        this.dataArray = res.data.data;
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
