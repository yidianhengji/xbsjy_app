<template>
  <div class="app-main-wrapper">
    <form-base
      ref="findex"
      primaryId="userId"
      query-interface="base/user/page"
      query-one-interface="base/user/info"
      save-interface="base/user/save"
      update-interface="base/user/update"
      delete-interface="base/user/delete"
      :columns="columns"
      :rules="rules"
      :reset-form="resetForm"
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
                  :disabled="btnOperationType!='add'"
                  size="small"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>
        <el-row v-if="btnOperationType=='add'">
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
              <el-input v-model="data.addForm.mobile" size="small"></el-input>
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
                  v-for="(item, index) in roles"
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
</template>

<script>
import FormBase from "../../../components/FormBase";
import AEltreeSelect from "../../../components/Dialog/AEltreeSelect";
import Avatar from "../../../components/File/Avatar";
import {
  resBaseDicNameByDicCode,
  resBaseRolePage,
  resBaseDepartmentQueryTree
} from "../../../api";
import { IS_OK } from "../../../api/path";
import { CODETYPE_SEX } from "../../../util/constListCode";
export default {
  name: "personnel",
  components: {
    FormBase,
    AEltreeSelect,
    Avatar
  },
  data() {
    return {
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
          align: "center"
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
        ]
      },
      sex: [],
      roles: [],
      treedata: [],
      departmentTreedata: []
    };
  },
  created() {
    this.getSex();
    this.getRole();
    this.getDepartment();
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
    async getSex() {
      const res = await resBaseDicNameByDicCode({ dicCode: CODETYPE_SEX });
      if (res.data.code === IS_OK) {
        this.sex = res.data.data;
      }
    },
    async getRole() {
      const res = await resBaseRolePage();
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
          if (v.isChecked) {
            arr.push(v.roleId);
          }
        });
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
    }
  }
};
</script>

<style lang="stylus" scoped>
.app-main-wrapper {
  height: 100%;
}
</style>