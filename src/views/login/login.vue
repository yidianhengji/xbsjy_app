<template>
  <div id="particlesDom">
    <div class="main">
      <div class="main-header">
        <h2>数字化设计协同管理平台</h2>
      </div>
      <div class="main-content">
        <el-form
          :model="ruleForm2"
          status-icon
          :rules="rules2"
          ref="ruleForm2"
          class="demo-ruleForm"
        >
          <el-form-item prop="username">
            <el-input
              type="text"
              placeholder="请输入用戶名"
              prefix-icon="fa fa-user-o"
              v-model="ruleForm2.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              placeholder="请输入密码"
              prefix-icon="fa fa-key"
              v-model="ruleForm2.password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              style="width: 100%;"
              type="primary"
              @click="submitForm('ruleForm2')"
              :disabled="disabledBtn"
              :loading="isLoading"
            >登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import particlesConfig from "./particles.json";
import { resAuthUserlogin } from "../../api";
import { IS_OK } from "../../api/path";
export default {
  name: "login",
  data() {
    let validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入用戶名"));
      }
      setTimeout(() => {
        callback();
      }, 100);
    };
    let validatePass = (rule, value, callback) => {
      if ("" === value) {
        callback(new Error("请输入密码"));
      }
      setTimeout(() => {
        callback();
      }, 100);
    };
    return {
      isLoading: false,
      disabledBtn: false,
      ruleForm2: {
        username: "",
        password: ""
      },
      rules2: {
        password: [{ validator: validatePass, trigger: "blur" }],
        username: [{ validator: validateName, trigger: "blur" }]
      }
    };
  },
  mounted() {
    localStorage.clear();
    this.init();
    document.addEventListener("keydown", this.handleEnter);
  },
  methods: {
    handleEnter(e) {
      if (e.key === "Enter" && e.target.getAttribute("type") === "password") {
        e.preventDefault();
        this.submitForm("ruleForm2");
      }
    },
    init() {
      window.particlesJS("particlesDom", particlesConfig);
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        let params = {
          userAccount: this.ruleForm2.username,
          password: this.ruleForm2.password
        };
        if (valid) {
          this.isLoading = true;
          this.disabledBtn = true;
          let loading = this.$loading({
            lock: true,
            text: "正在登陆系统中，请等候。",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          const res = await resAuthUserlogin(params);
          if (res.data.code == IS_OK) {
            localStorage.setItem("uid", res.data.data.uid);
            this.isLoading = false;
            this.disabledBtn = false;
            loading.close();
            this.$router.push({ path: "/home" });
          } else {
            this.isLoading = false;
            this.disabledBtn = false;
            loading.close();
          }
        }
      });
    }
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.handleEnter);
  }
};
</script>

<style lang="stylus" scoped>
#particlesDom {
  width: 100%;
  height: 100%;
  background-image: url('~@/assets/login/bg.jpg');
  background-size: 100%;
  background-repeat: no-repeat;
  overflow: hidden;
  position: relative;

  .main {
    width: 23vw;
    border-radius: 10px;
    min-width: 300px;
    margin: 0 auto;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    z-index: 2;
    position: absolute;
    left: 50%;
    top: 40%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    background: #fff;
    padding: 20px;

    .main-header {
      text-align: center;

      h2 {
        font-size: 26px;
        color: #3b3d3f;
        font-weight: bold;
      }
    }

    .main-content {
      margin-top: 30px;
      padding: 0 20px;
    }
  }
}
</style>
