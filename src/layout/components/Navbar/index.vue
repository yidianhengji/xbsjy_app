<template>
  <div class="fixed-header" :style="{ left: headerLeft }">
    <div class="header-nav-flex">
      <div class="navbar">
        <div class="hamburger-container" @click="toggleSideBar">
          <span>
            <i class="el-icon-s-fold"></i>
          </span>
        </div>
        <breadcrumb />
      </div>
      <div class="right-nav-bar" style="cursor: pointer">
        <div style="display: inline-block; height: 100%;float: left;">
          <div style="height: 100%;display: flex;align-items: center;justify-content: center;">
            <el-input
              v-model="inputModel"
              @keyup.enter.native="onSubmit"
              placeholder="请输入检索条件"
              size="mini"
            >
              <i class="el-icon-search el-input__icon" slot="suffix" @click="handleIconClick"></i>
            </el-input>
          </div>
        </div>
        <el-dropdown class="username-container">
          <div class="username-text">
            <div v-if="userphotoUrl !== '' && userphotoUrl !== null">
              <img class="userImg" :src="userphotoUrl" />
            </div>
            <div v-else>
              <img class="userImg" src="../../../assets/userImg.png" />
            </div>
            <span style="cursor: pointer">{{ loginusername }}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="handleUserInfo(true, true)">
              <div class="center">个人中心</div>
            </el-dropdown-item>
            <el-dropdown-item @click.native="handlePassword(true, true)">
              <div class="center">修改密码</div>
            </el-dropdown-item>
            <el-dropdown-item @click.native="signOut">
              <div class="center">退出平台</div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <a-el-dialog :visible.sync="userInfoShow" title="修改个人信息" width="840px">
      <el-form
        ref="addForm"
        :model="addForm"
        label-width="160px"
        :rules="rules"
        size="small"
        class="demo-form-inline"
      >
        <el-row style="padding-right: 20px;">
          <el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="用户头像" prop="userphotoUrl">
                  <avatar ref="avatar" v-model="addForm.userphotoUrl" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="用户姓名" prop="userName">
                  <el-input v-model="addForm.userName" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="登录账号" prop="userAccount">
                  <el-input v-model="addForm.userAccount" :disabled="addFormDisabled" size="small"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="手机号码" prop="mobile">
                <el-input v-model="addForm.mobile" size="small" maxlength="11"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话" prop="tel">
                <el-input v-model="addForm.tel" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="所属角色" prop="roleIds">
                <el-input v-model="addForm.roleName" :disabled="addFormDisabled" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属部门" prop="departmentId">
                <el-input v-model="addForm.departmentName" size="small" :disabled="addFormDisabled"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="邮箱地址" prop="email">
                <el-input v-model="addForm.email" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="职务" prop="post">
                <el-input v-model="addForm.post" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="用户性别" prop="sex">
                <el-select v-model="addForm.sex" style="width: 100%;">
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
                <el-input v-model="addForm.cardId" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="addForm.remark" :rows="5" type="textarea"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>
      </el-form>
      <template slot="footer">
        <el-button type="primary" size="small" @click="handleUpdateUser">确定</el-button>
        <el-button size="small" @click="handleUserInfo(false, false)">取消</el-button>
      </template>
    </a-el-dialog>

    <a-el-dialog
      :visible.sync="passwordShow"
      title="修改密码"
      width="640px"
      :beforeClose="handlePasswordClose"
    >
      <el-form
        ref="addForm1"
        :model="addForm1"
        label-width="160px"
        :rules="rules1"
        size="small"
        class="demo-form-inline"
      >
        <el-form-item label="原始密码" prop="password">
          <el-input type="password" v-model="addForm1.password" size="small"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="addForm1.newPassword" size="small"></el-input>
        </el-form-item>
        <el-form-item label="再次输出新密码" prop="reNewPassWord">
          <el-input type="password" v-model="addForm1.reNewPassWord" size="small"></el-input>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button type="primary" size="small" @click="handleUpdatePassword">确定</el-button>
        <el-button size="small" @click="handlePasswordClose">取消</el-button>
      </template>
    </a-el-dialog>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";
import { UPLOAD_FILE_PATH } from "../../../api/path";
import { IS_OK } from "../../../api/path";
import { loginUserInfo, resBaseUserUpdatePassword } from "../../../api";
import AElDialog from "../../../components/Dialog/AElDialog";
import Avatar from "../../../components/File/Avatar";
import {
  personalCenter,
  updateUser,
  resBaseDicNameByDicCode
} from "../../../api/index";
import { CODETYPE_SEX } from "../../../util/constListCode";
export default {
  components: {
    Breadcrumb,
    AElDialog,
    Avatar
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.addForm1.reNewPassWord !== "") {
          this.$refs.addForm1.validateField("reNewPassWord");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.addForm1.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      loginusername: "",
      userphotoUrl: "",
      userInfoShow: false,
      passwordShow: false,
      sex: [],
      roles: [],
      addFormDisabled: true,
      addForm: {
        departmentName: "",
        tel: "",
        userAccount: "",
        roleList: [],
        mobile: "",
        email: "",
        remark: "",
        workStatus: "",
        post: "",
        sex: "",
        sexName: "",
        userphotoUrl: ""
      },
      rules: {
        userAccount: [
          { required: true, message: "用户姓名不能为空", trigger: "blur" }
        ],
        workStatus: [
          { required: true, message: "工作状态不能为空", trigger: "blur" }
        ],
        sex: [{ required: true, message: "性别不能为空", trigger: "blur" }],
        mobile: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        tel: [
          {
            pattern: /^0\d{2,3}-?\d{7,8}$/,
            message: "请输入正确的联系电话",
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
      inputModel: "",
      addForm1: {
        password: "",
        newPassword: "",
        reNewPassWord: ""
      },
      rules1: {
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],
        newPassword: [
          { validator: validatePass, required: true, trigger: "blur" }
        ],
        reNewPassWord: [
          { validator: validatePass2, required: true, trigger: "blur" }
        ]
      }
    };
  },
  props: {
    sidebar: {
      type: Object
    }
  },
  computed: {
    headerLeft() {
      return this.sidebar.opened ? "62px" : "220px";
    }
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    handlePassword() {
      this.passwordShow = true;
    },
    handlePasswordClose() {
      this.$refs.addForm1.resetFields();
      this.passwordShow = false;
    },
    handleUpdatePassword() {
      this.$refs.addForm1.validate(async valid => {
        if (valid) {
          const res = await resBaseUserUpdatePassword(this.addForm1);
          if (res.data.code === IS_OK) {
            this.$refs.addForm1.resetFields();
            this.passwordShow = false;
            this.$message({
              type: "success",
              message: "修改成功"
            });
          }
        }
      });
    },
    onSubmit() {
      this.getRetrieval();
    },
    handleIconClick() {
      this.getRetrieval();
    },
    getRetrieval() {
      this.$store.dispatch("app/toggleRetrieval", this.inputModel);
      this.$router.push("/retrieval");
    },
    async getpersonalCenter() {
      this.handleDicName();
      const res = await personalCenter();
      if (res.data.code === IS_OK) {
        this.addForm = res.data.data;
        this.addForm.roleName = "";
        this.addForm.roleList.forEach(item => {
          this.addForm.roleName += "  " + item.roleName;
        });
      }
    },
    handleUpdateUser() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          let data = {
            userId: this.addForm.userId,
            userphotoUrl: this.addForm.userphotoUrl,
            userName: this.addForm.userName,
            mobile: this.addForm.mobile,
            tel: this.addForm.tel,
            email: this.addForm.email,
            post: this.addForm.post,
            sex: this.addForm.sex,
            cardId: this.addForm.cardId,
            remark: this.addForm.remark,
            updateRoles: false
          };
          const res = await updateUser(data);
          if (res.data.code === IS_OK) {
            this.userInfoShow = false;
            this.$message({
              type: "success",
              message: "操作成功"
            });
          }
        }
      });
    },
    async handleDicName() {
      const res = await resBaseDicNameByDicCode({ dicCode: CODETYPE_SEX });
      if (res.data.code === IS_OK) {
        this.sex = res.data.data;
      }
    },
    handleUserInfo(isShow, isQuery) {
      if (isQuery) {
        this.getpersonalCenter();
      }
      this.userInfoShow = isShow;
      this.$refs.addForm.resetFields();
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async getUserInfo() {
      const res = await loginUserInfo();
      if (res.data.code === IS_OK) {
        this.loginusername = res.data.data.userName;
        if (res.userphotoUrl !== "" && res.data.data.userphotoUrl !== null) {
          this.userphotoUrl = UPLOAD_FILE_PATH + res.data.data.userphotoUrl;
        }
      }
    },
    signOut() {
      this.$confirm("是否退出该系统?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        document.dispatchEvent(new Event("logout"));
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  left: 220px;
  z-index: 9;
  -webkit-transition: left 0.28s;
  transition: left 0.28s;

  .header-nav-flex {
    position: relative;
    height: 50px;
    background: #344058;

    .navbar {
      height: 100%;
      overflow: hidden;
      position: relative;
      -webkit-box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

      .hamburger-container {
        line-height: 46px;
        height: 100%;
        float: left;
        cursor: pointer;
        -webkit-transition: background 0.3s;
        transition: background 0.3s;
        -webkit-tap-highlight-color: transparent;
        padding: 0px 15px;
        font-size: 16px;
        color: #ffffff;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }

        span {
          display: inline-block;
          background: #409eff;
          height: 30px;
          line-height: 30px;
          width: 30px;
          text-align: center;
        }
      }

      .breadcrumb-container {
        float: left;
        display: inline-block;
        font-size: 14px;
        line-height: 50px;
        margin-left: 8px;
      }
    }

    .right-nav-bar {
      position: absolute;
      right: 0px;
      top: 0px;
      height: 100%;

      .username-container {
        height: 100%;
        padding: 0 10px;

        .username-text {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          color: #fff;
          outline: none;

          .userImg {
            width: 26px;
            height: 26px;
            margin-right: 5px;
            border-radius: 50%;
          }
        }
      }
    }
  }
}
</style>
