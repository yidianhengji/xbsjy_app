<template>
  <div class="app-main-wrapper">
    <form-base
      ref="findex"
      primaryId="roleId"
      query-interface="base/role/page"
      query-one-interface="base/role/info"
      save-interface="base/role/save"
      update-interface="base/role/update"
      delete-interface="base/role/delete"
      @current-change="currentChange"
      :columns="columns"
      :rules="rules"
      :reset-form="resetForm"
    >
      <template slot="searchForm" slot-scope="data">
        <el-form-item label="角色名称" prop="keyword">
          <el-input v-model="data.formInline.keyword" size="small" placeholder="请输入角色名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="isEnable">
          <el-select v-model="data.formInline.isEnable" size="small" clearable>
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
      </template>
      <template slot="toolbar">
        <el-dropdown style="margin-left: 5px;">
          <el-button type="primary" size="small">
            更多操作<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="setPowers">功能授权</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <template slot="add" slot-scope="data">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="data.addForm.roleName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="角色编号" prop="roleCode">
          <el-input v-model="data.addForm.roleCode" size="small"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="isEnable">
          <el-switch v-model="data.addForm.isEnable"></el-switch>
        </el-form-item>
        <el-form-item label="排序" prop="orderId">
          <el-input-number v-model="data.addForm.orderId" :min="0" size="small"></el-input-number>
        </el-form-item>
      </template>
    </form-base>

    <a-el-dialog :visible.sync="powersetshow" title="权限设置">
      <el-tree
        ref="tree"
        :data="treedata"
        :single="true"
        show-checkbox
        node-key="menuId"
        default-expand-all
        :props="defaultProps"
      ></el-tree>
      <template slot="footer">
        <el-button type="primary" size="small" @click="submit" :loading="loading">确定</el-button>
        <el-button type="default" size="small" @click="powersetshow = false">取消</el-button>
      </template>
    </a-el-dialog>
  </div>
</template>

<script type="text/jsx">
import FormBase from "../../../components/FormBase";
import AElDialog from "../../../components/Dialog/AElDialog";
import {
  resBaseMenuQueryTree,
  resBaseMenuRoleAddMenus,
  resBaseMenuQueryMenuIdByRoleId
} from "../../../api";
import { IS_OK } from "../../../api/path";
export default {
  name: "role",
  components: {
    FormBase,
    AElDialog
  },
  data() {
    return {
      uid: "",
      powersetshow: false,
      loading: false,
      treedata: [],
      defaultProps: {
        children: "children",
        label: "menuName"
      },
      rules: {
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" }
        ]
      },
      columns: [
        {
          prop: "roleName",
          align: "center",
          label: "角色名称"
        },
        {
          prop: "roleCode",
          align: "center",
          label: "角色编号"
        },
        {
          prop: "orderId",
          align: "center",
          label: "排序"
        },
        {
          prop: "isEnable",
          label: "是否启用",
          align: "center",
          render: (h, param) => {
            return (
              <div>
                <el-switch v-model={param.row.isEnable} disabled></el-switch>
              </div>
            );
          }
        }
      ]
    };
  },
  created() {
    this.getMenuList();
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.findex.formInline = {
        keyword: "",
        isEnable: ""
      };
    });
  },
  methods: {
    async getMenuList() {
      const res = await resBaseMenuQueryTree();
      if (res.data.code === IS_OK) {
        this.treedata = res.data.data;
      }
    },
    resetForm(self) {
      self.addForm = {
        roleName: "",
        isEnable: true,
        orderId: 0,
        roleCode: ""
      };
    },
    async setMenuIdByRoleId() {
      const res = await resBaseMenuQueryMenuIdByRoleId(this.uid);
      if (res.data.code === IS_OK) {
        this.$refs.tree.setCheckedKeys(res.data.data);
      }
    },
    setPowers() {
      if (this.uid) {
        this.loading = false;
        this.powersetshow = true;
        this.setMenuIdByRoleId();
      } else {
        this.$message({
          message: "您没有选中任何数据项,请选中后再操作！",
          type: "warning"
        });
      }
    },
    currentChange(val) {
      this.uid = val;
    },
    async submit() {
      this.loading = true;
      let params = this.$refs.tree.getCheckedKeys();
      if (params.length > 0) {
        const res = await resBaseMenuRoleAddMenus(this.uid, params);
        if (res.data.code === IS_OK) {
          setTimeout(() => {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            this.loading = false;
            this.powersetshow = false;
          }, 500);
        } else {
          this.loading = true;
        }
      } else {
        this.$message({
          message: "您没有选中任何数据项,请选中后再操作！",
          type: "warning"
        });
        this.loading = true;
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