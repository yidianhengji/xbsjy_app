<template>
  <div class="app-main-wrapper">
    <form-base
      ref="findex"
      primaryId="menuId"
      rowKey="menuId"
      query-interface="base/menu/queryTree"
      query-one-interface="base/menu/info"
      save-interface="base/menu/save"
      update-interface="base/menu/update"
      delete-interface="base/menu/delete"
      :query-controller="queryController"
      :columns="columns"
      :rules="rules"
      :nodePage="false"
      :reset-form="resetForm"
    >
      <template slot="searchForm" slot-scope="data">
        <el-form-item label="菜单名称" prop="keyword">
          <el-input v-model="data.formInline.keyword" size="small" placeholder="请输入菜单名称" clearable></el-input>
        </el-form-item>
      </template>
      <template slot="add" slot-scope="data">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="data.addForm.menuName"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="data.addForm.menuType">
            <el-radio label="WEB">电脑菜单</el-radio>
            <el-radio label="APP">手机菜单</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="页面链接地址" prop="url">
          <el-input v-model="data.addForm.pageUrl"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" prop="upMenuId">
          <a-eltree-select
            :treedata.sync="dataArray"
            label="menuName"
            node-key="menuId"
            :defaultExpandAll="false"
            :value.sync="data.addForm.upMenuId"
          ></a-eltree-select>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <a-eSelect-icon :value.sync="data.addForm.pictureUrl"></a-eSelect-icon>
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
import AESelectIcon from "../../../components/Dialog/AESelectIcon";
import { resBaseMenuQueryTree } from "../../../api";
import { IS_OK } from "../../../api/path";
export default {
  name: "menus",
  components: {
    FormBase,
    AEltreeSelect,
    AESelectIcon
  },
  data() {
    return {
      dataArray: [],
      rules: {
        menuName: [
          { required: true, message: "菜单名称是必须的", trigger: "blur" }
        ],
        menuType: [
          { required: true, message: "请选择一个类型", trigger: "blur" }
        ]
      },
      columns: [
        {
          prop: "menuName",
          label: "菜单名称",
          align: "left"
        },
        {
          prop: "pageUrl",
          label: "url",
          align: "center"
        },
        {
          prop: "orderId",
          label: "排序",
          align: "center"
        },
        {
          prop: "pictureUrl",
          label: "图标",
          align: "center",
          render: (h, param) => {
            return (
              <div>
                <i class={param.row.pictureUrl}></i>
              </div>
            );
          }
        },
        {
          prop: "menuType",
          label: "类型",
          align: "center",
          render: (h, param) => {
            let className = "";
            switch (param.row.menuType) {
              case "WEB":
                className = "电脑菜单";
                break;
              case "APP":
                className = "手机菜单";
                break;
            }
            return <div>{className}</div>;
          }
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
        menuName: "",
        menuType: "WEB",
        orderId: 0,
        isEnable: true,
        upMenuId: null,
        perms: "",
        url: "",
        icon: ""
      };

      this.selectIndex = null;
    },
    async queryController(self) {
      let params = self.formInline;
      const res = await resBaseMenuQueryTree(params);
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
