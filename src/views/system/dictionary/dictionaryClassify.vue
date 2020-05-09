<template>
  <div class="app-main-wrapper">
    <form-base
      ref="findex"
      primaryId="dictionaryId"
      rowKey="dictionaryId"
      query-interface="base/dictionary/queryTree"
      query-one-interface="base/dictionary/info"
      save-interface="base/dictionary/save"
      update-interface="base/dictionary/update"
      delete-interface="base/dictionary/delete"
      :query-controller="queryController"
      :columns="columns"
      :rules="rules"
      :nodePage="false"
      :reset-form="resetForm"
    >
      <template slot="searchForm"></template>
      <template slot="add" slot-scope="data">
        <el-form-item label="上级id" prop="upDictionaryId">
          <a-eltree-select
            :treedata.sync="dataArray"
            label="dictionaryName"
            node-key="dictionaryId"
            :defaultExpandAll="false"
            :value.sync="data.addForm.upDictionaryId"
          ></a-eltree-select>
        </el-form-item>
        <el-form-item label="字典名称" prop="dictionaryName">
          <el-input v-model="data.addForm.dictionaryName"></el-input>
        </el-form-item>
        <el-form-item label="字典编码" prop="dictionaryCode">
          <el-input v-model="data.addForm.dictionaryCode"></el-input>
        </el-form-item>
        <el-form-item label="完整路径" prop="fullPath">
          <el-input v-model="data.addForm.fullPath"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="orderId">
          <el-input-number v-model="data.addForm.orderId" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="是否启用" prop="isEnable">
          <el-switch v-model="data.addForm.isEnable"></el-switch>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input v-model="data.addForm.description" :rows="5" type="textarea"></el-input>
        </el-form-item>
      </template>
    </form-base>
  </div>
</template>

<script type="text/jsx">
import FormBase from "../../../components/FormBase";
import AEltreeSelect from "../../../components/Dialog/AEltreeSelect";
import {
  resBaseDictionaryQueryTree,
  resBaseCompanyQueryTree
} from "../../../api";
import { IS_OK } from "../../../api/path";
export default {
  name: "dictionaryClassify",
  components: {
    FormBase,
    AEltreeSelect
  },
  data() {
    return {
      dataArray: [],
      companyTreedata: [], // 单位列表
      rules: {
        dictionaryName: [
          { required: true, message: "请输入字典名称", trigger: "blur" }
        ],
        dictionaryCode: [
          { required: true, message: "请输入字典编码", trigger: "blur" }
        ]
      },
      columns: [
        {
          prop: "dictionaryName",
          label: "菜单名称",
          align: "left"
        },
        {
          prop: "dictionaryCode",
          label: "字典编码",
          align: "center"
        },
        {
          prop: "fullPath",
          label: "完整路径",
          align: "center"
        },
        {
          prop: "isEnable",
          label: "是否启动",
          align: "center"
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
    this.getcompany();
  },
  methods: {
    resetForm(self) {
      self.addForm = {
        upDictionaryId: "",
        dictionaryName: "",
        dictionaryCode: "",
        fullPath: "",
        orderId: 0,
        isEnable: true,
        description: ""
      };
      this.selectIndex = null;
    },
    async queryController(self) {
      const res = await resBaseDictionaryQueryTree({});
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
  height 600px
}
</style>
