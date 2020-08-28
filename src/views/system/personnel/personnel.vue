<template>
  <div class="box">
    <div class="left">
      <div class="left-title">公司部门</div>
      <div class="left-body" v-loading="userLoading">
        <left-tree
          :treedata="companyAnddepartmentData"
          label="name"
          :single="true"
          node-key="id"
          ref="tree"
          :render-content="renderContent"
          @nodeClick="handlePersonnelName"
        ></left-tree>
      </div>
    </div>
    <div class="y-hander"></div>
    <div class="right">
      <form-base
        ref="findex"
        primaryId="userId"
        query-interface="base/user/page"
        query-one-interface="base/user/info"
        save-interface="base/user/save"
        update-interface="base/user/update"
        delete-interface="base/user/delete"
        :queryOneController="queryOneController"
        :columns="columns"
        :rules="rules"
        :uid.sync="uid"
        :reset-form="resetForm"
        :no-reset-password="false"
        :btn-operation-type.sync="btnOperationType"
      >
        <template slot="searchForm" slot-scope="data">
          <el-form-item label="用户名" prop="keyword">
            <el-input
              v-model="data.formInline.keyword"
              size="small"
              placeholder="请输入登录账号或用户名"
              clearable
            ></el-input>
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
              更多操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="retPassword">重置密码</el-dropdown-item>
              <el-dropdown-item @click.native="setRole">设置角色</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot="add" slot-scope="data">
          <el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="用户头像" prop="userphotoUrl">
                  <avatar ref="avatar" v-model="data.addForm.userphotoUrl" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否启用" prop="isEnable">
                  <el-switch v-model="data.addForm.isEnable"></el-switch>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="用户姓名" prop="userName">
                  <el-input v-model="data.addForm.userName" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="登录账号" prop="userAccount">
                  <el-input
                    v-model="data.addForm.userAccount"
                    :disabled="btnOperationType != 'add'"
                    size="small"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-row>
          <el-row v-if="btnOperationType === 'add'">
            <el-col :span="12">
              <el-form-item label="密码" prop="password">
                <el-input v-model="data.addForm.password" type="password" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="确认密码" prop="repassword">
                <el-input v-model="data.addForm.repassword" type="password" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="手机号码" prop="mobile">
                <el-input v-model="data.addForm.mobile" size="small" maxlength="11"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话" prop="tel">
                <el-input v-model="data.addForm.tel" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="所属角色" prop="roleIds">
                <el-select
                  v-model="data.addForm.roleIds"
                  size="small"
                  multiple
                  filterable
                  clearable
                >
                  <el-option
                    v-for="(item, index) in rolesLists"
                    :label="item.roleName"
                    :value="item.roleId"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="所属部门" prop="departmentId">
                <a-eltree-select
                  :treedata.sync="departmentTreedata"
                  label="departmentName"
                  node-key="departmentId"
                  :value.sync="data.addForm.departmentId"
                ></a-eltree-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="邮箱地址" prop="email">
                <el-input v-model="data.addForm.email" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="职务" prop="post">
                <el-input v-model="data.addForm.post" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="用户性别" prop="sex">
                <el-select v-model="data.addForm.sex">
                  <el-option
                    v-for="(item, index) in sex"
                    :label="item.dictionarydataName"
                    :value="item.dictionarydataValue"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="身份证" prop="cardId">
                <el-input v-model="data.addForm.cardId" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="data.addForm.remark" :rows="5" type="textarea"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </form-base>
    </div>
    <!--人员设置角色-->
    <a-el-dialog :visible.sync="setRoleVisible" width="640px" title="权限设置">
      <div class="item">
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
        >全选</el-checkbox>
      </div>
      <el-checkbox-group v-model="checkedRoles" @change="handleCheckedRolesChange">
        <div class="item" v-for="item in roles" :key="item.roleId">
          <el-checkbox :label="item.roleId" :key="item.roleId">{{ item.roleName }}</el-checkbox>
        </div>
      </el-checkbox-group>
      <template slot="footer">
        <el-button type="primary" size="small" @click="handleUserAddRoles" :loading="loading">确定</el-button>
        <el-button type="default" size="small" @click="setRoleVisible = false">取消</el-button>
      </template>
    </a-el-dialog>
  </div>
</template>

<script type="text/jsx">
import FormBase from "../../../components/FormBase.vue";
import LeftTree from "../../../components/Tree/leftTree";
import AEltreeSelect from "../../../components/Dialog/AEltreeSelect";
import Avatar from "../../../components/File/Avatar";
import AElDialog from "../../../components/Dialog/AElDialog";
import {
  resBaseDicNameByDicCode,
  resBaseRolePage,
  resBaseDepartmentQueryTree,
  resBaseDepartmentQueryComDepTree,
  reSetPassword,
  resUserAddRoles,
  resQueryRoleOfUser
} from "../../../api";
import { IS_OK } from "../../../api/path";
import { CODETYPE_SEX } from "../../../util/constListCode";
import { mixinMethodsDrag } from "../../../mixin/mixinMethodsDrag";

export default {
  name: "personnel",
  mixins: [mixinMethodsDrag],
  components: {
    FormBase,
    LeftTree,
    AEltreeSelect,
    Avatar,
    AElDialog
  },
  data() {
    return {
      uid: "",
      userLoading: true,
      companyAnddepartmentData: [],
      btnOperationType: "add",
      columns: [
        {
          prop: "userAccount",
          align: "center",
          label: "用户账号"
        },
        {
          prop: "userName",
          align: "center",
          label: "用户姓名"
        },
        {
          prop: "departmentName",
          label: "部门"
        },
        {
          prop: "sexName",
          align: "center",
          label: "性别"
        },
        {
          prop: "mobile",
          label: "手机号码",
          align: "center"
        },
        {
          prop: "post",
          label: "职务",
          align: "center"
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
      ],
      rules: {
        password: [
          { required: true, message: "请输入新密码", trigger: "blur" }
        ],
        repassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              const self = this.$refs.findex;
              if ("" === value) {
                callback(new Error("请再次输入密码"));
              } else if (value !== self.addForm.password) {
                callback(new Error("两次输入密码不一致"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        userName: [
          { required: true, message: "登录账号不能为空", trigger: "blur" }
        ],
        userAccount: [
          { required: true, message: "用户姓名不能为空", trigger: "blur" }
        ],
        workStatus: [
          { required: true, message: "工作状态不能为空", trigger: "blur" }
        ],
        sex: [{ required: true, message: "性别不能为空", trigger: "blur" }],
        departmentId: [
          { required: true, message: "部门不能为空", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        email: [
          // { required: false, message: "邮箱地址不能为空", trigger: "blur" },
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        cardId: [
          {
            pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
            message: "'请输入正确的身份证号码",
            trigger: ["blur", "change"]
          }
        ]
      },
      sex: [],
      roles: [],
      rolesLists: [],
      treedata: [],
      departmentTreedata: [],
      setRoleVisible: false,
      loading: false,
      isIndeterminate: true,
      checkAll: false,
      checkedRoles: []
    };
  },
  created() {
    this.getSex();
    this.getDepartment();
    this.getPersonneTreeData();
    this.getRoles();
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
    handleCheckAllChange(val) {
      if (val) {
        this.roles.map(item => {
          this.checkedRoles.push(item.roleId);
        });
      } else {
        this.checkedRoles = [];
      }
      this.isIndeterminate = false;
    },
    handleCheckedRolesChange(value) {
      if (value.length == this.roles.length) {
        this.checkAll = true;
        this.isIndeterminate = false;
      } else if (value.length > 0 && value.length != this.roles.length) {
        this.checkAll = true;
        this.isIndeterminate = true;
      } else if (value.length == 0) {
        this.checkAll = false;
        this.isIndeterminate = false;
      }
    },
    async getRoles() {
      const res = await resBaseRolePage({ pageSize: 100, pageNum: 1 });
      if (res.data.code === IS_OK) {
        this.rolesLists = res.data.data.list;
      }
    },
    async setRole() {
      const uid = this.$refs.findex.uid;
      let isFlag = [];
      if (uid) {
        this.setRoleVisible = true;
        this.checkedRoles = [];
        this.roles = [];
        const res = await resQueryRoleOfUser(uid);
        if (res.data.code === IS_OK) {
          this.roles = res.data.data;
          this.roles.map(item => {
            if (item.isChecked) {
              this.checkedRoles.push(item.roleId);
              isFlag.push(item);
            }
          });
          if (isFlag.length == this.roles.length) {
            this.checkAll = true;
            this.isIndeterminate = false;
          } else if (isFlag.length > 0 && isFlag.length != this.roles.length) {
            this.checkAll = true;
            this.isIndeterminate = true;
          } else if (isFlag.length == 0) {
            this.checkAll = false;
            this.isIndeterminate = false;
          }
        }
      } else {
        this.$message({
          message: "您没有选中任何数据项,请选中后再操作！",
          type: "warning"
        });
      }
    },
    //人员设置角色
    async handleUserAddRoles() {
      this.loading = true;
      let data = {};
      data.userId = this.$refs.findex.uid;
      data.roleIds = this.checkedRoles;
      const res = await resUserAddRoles(data);
      if (res.data.code === IS_OK) {
        this.$message({
          type: "success",
          message: "操作成功"
        });
        this.loading = false;
        this.setRoleVisible = false;
      } else {
        this.loading = false;
      }
    },

    //重置密码
    retPassword() {
      const uid = this.$refs.findex.uid;
      if (uid) {
        this.$confirm("你确定要重置密码吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            const res = await reSetPassword(uid);
            if (res.data.code === IS_OK) {
              this.$message({
                type: "success",
                message: "重置成功"
              });
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
      } else {
        this.$message({
          message: "您没有选中任何数据项,请选中后再操作！",
          type: "warning"
        });
      }
    },
    async getPersonneTreeData() {
      const res = await resBaseDepartmentQueryComDepTree();
      if (IS_OK === res.data.code) {
        this.companyAnddepartmentData = res.data.data;
        this.userLoading = false;
      }
    },
    async getSex() {
      const res = await resBaseDicNameByDicCode({ dicCode: CODETYPE_SEX });
      if (res.data.code === IS_OK) {
        this.sex = res.data.data;
      }
    },
    //编辑页面选择角色
    async getRole(uid) {
      const res = await resQueryRoleOfUser(uid);
      if (res.data.code === IS_OK) {
        this.roles = res.data.data.list;
      }
    },
    async getDepartment() {
      const res = await resBaseDepartmentQueryTree();
      if (res.data.code === IS_OK) {
        this.departmentTreedata = res.data.data;
      }
    },
    renderContent(h, { node, data }) {
      return (
        <span class="custom-tree-node" style="font-size: 14px; color: #606266;">
          <span
            class={
              data.children.length > 0 ? "fa fa-sitemap" : "fa fa-user"
            }
            style="margin-right: 5px;"
          ></span>
          <span>{node.label}</span>
        </span>
      );
    },
    paramController() {
      return new Promise(resolve => {
        this.$refs.findex.param = {
          ...this.$refs.findex.param
        };
        resolve();
      });
    },
    queryOneController(self) {
      const arr = [];
      if (self.addForm.userId) {
        self.addForm.roleList.forEach(v => {
          arr.push(v.roleId);
        });
        console.log(arr);
        this.$set(self.addForm, "roleIds", arr);
      }
    },
    resetForm() {
      this.$nextTick(() => {
        this.$refs.findex.addForm = {
          isEnable: true,
          departmentId: "",
          password: "",
          repassword: "",
          tel: "",
          userAccount: "",
          roleIds: [],
          roleList: [],
          mobile: "",
          email: "",
          remark: "",
          workStatus: "",
          post: "",
          sex: ""
        };
        if (this.$refs.avatar) {
          this.$refs.avatar.clear();
        }
      });
    },
    handlePersonnelName(obj) {
      const self = this.$refs.findex;
      self.formInline.id = obj.id;
      self.clickQuery();
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
</style>
