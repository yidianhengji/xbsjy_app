<template>
  <a-el-dialog :visible.sync="visible" :title="title" width="40%" :beforeClose="beforeClose">
    <div class="power-wrapper" :key="uuid">
      <div class="left">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>列表</span>
            <el-button class="add" size="mini" type="primary" @click="optionUserData">新增</el-button>
            <!-- v-show="type=='project'" -->
            <el-button class="delete" size="mini" type="danger" @click="rmAuthUsers">删除</el-button>
          </div>
          <div v-if="userList.length > 0">
            <div
              class="item"
              v-for="item in userList"
              @click="handleClickUserName(item.userId)"
              :key="item.userId"
              :class="item.userId === userListChecked ? 'active' : ''"
            >
              <i class="el-icon-s-custom"></i>
              {{ item.userName }}
            </div>
          </div>
          <div
            v-else
            style="display: flex;align-items: center;justify-content: center;height: 100%;"
          >
            <div>
              <img
                src="../../assets/empty.svg"
                style="margin: 0px auto;display: block;width: 80px;"
              />
              <p style="color: #ccc;font-size: 14px;margin-top: 15px;">暂无数据，请选择人员</p>
            </div>
          </div>
        </el-card>
      </div>
      <div class="right">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>权限列表</span>
          </div>
          <div v-if="userListChecked!=='' && userListChecked !== null">
            <div class="item">
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleChangeCheckAll"
              >完全控制</el-checkbox>
            </div>
            <el-checkbox-group v-model="checkList" @change="handleCheckedCitiesChange">
              <div class="item" v-for="item in checkDataList" :key="item.dictionarydataValue">
                <el-checkbox
                  :label="item.dictionarydataValue"
                  :key="item.dictionarydataValue"
                >{{ item.dictionarydataName }}</el-checkbox>
              </div>
            </el-checkbox-group>
            <div class="item">
              <el-checkbox v-model="checkNo" @change="handleChangeCheckNo">无访问权限</el-checkbox>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <template slot="footer">
      <el-button type="primary" size="mini" @click="powerSubmit">确定</el-button>
      <el-button type="default" size="mini" @click="powerClose">取消</el-button>
    </template>

    <a-el-dialog :visible.sync="visibleUserDialog" title="选择人员" width="60%">
      <a-e-i-option-users ref="optionUser"></a-e-i-option-users>
      <template slot="footer">
        <el-button type="primary" size="mini" @click="optionUserSubmit">确定</el-button>
        <el-button type="default" size="mini" @click="optionUserClose">取消</el-button>
      </template>
    </a-el-dialog>

    <el-dialog title="是否确认修改权限?" :visible.sync="centerDialogVisible" append-to-body width="30%">
      <div v-if="type=='project'">
        <el-radio v-model="radio" :label="false">仅应用于此项目</el-radio>
        <el-radio v-model="radio" :label="true">应用于此项目和子文件夹</el-radio>
      </div>
      <div v-if="type=='folder'">
        <el-radio v-model="radio" :label="false">仅应用于此目录</el-radio>
        <el-radio v-model="radio" :label="true">应用于此目录和子目录</el-radio>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="centerDialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="centerDialogVisibleClick">确 定</el-button>
      </span>
    </el-dialog>
  </a-el-dialog>
</template>

<script>
import AElDialog from "./AElDialog";
import AEIOptionUsers from "./AEIOptionUsers";
import { IS_OK, API_PATH } from "../../api/path";
import request from "../../api/config";
import { v4 as uuidv4 } from "uuid";

export default {
  name: "AEPower",
  components: {
    AElDialog,
    AEIOptionUsers
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
    uid: {
      type: String,
      default: ""
    },
    codeName: {
      type: String
    },
    primaryId: {
      type: String
    },
    queryOneInterface: String,
    saveInterface: String,
    userList: Array,
    //删除选中的赋权人权
    deleteAuthUsers: String,
    checkDataList: Array,
    type: String
  },
  data() {
    return {
      uuid: uuidv4(),
      powerDialogVisible: false,
      userListChecked: "",
      // checkDataList: [
      //   { dictionarydataValue: "1", dictionarydataName: "查看" },
      //   { dictionarydataValue: "2", dictionarydataName: "新增" },
      //   { dictionarydataValue: "3", dictionarydataName: "修改" },
      //   { dictionarydataValue: "4", dictionarydataName: "删除" },
      //   { dictionarydataValue: "5", dictionarydataName: "检入" },
      //   { dictionarydataValue: "6", dictionarydataName: "检出" },
      //   { dictionarydataValue: "7", dictionarydataName: "释放" },
      //   { dictionarydataValue: "8", dictionarydataName: "锁定" },
      //   { dictionarydataValue: "9", dictionarydataName: "解锁" },
      //   { dictionarydataValue: "10", dictionarydataName: "设置权限" }
      // ],
      checkList: [],
      checkListDisabled: false,
      checkAll: false,
      checkNo: true,
      isIndeterminate: false,
      visibleUserDialog: false,
      centerDialogVisible: false,
      radio: false,
      paramObj: {}
    };
  },
  methods: {
    //移除赋权的人员
    async rmAuthUsers() {
      let path = `${API_PATH}${this.deleteAuthUsers}?primaryId=${this.uid}&userId=${this.userListChecked}`;
      const res = await request(path, null, "DELETE");
      if (res.data.code === IS_OK) {
        this.$message({
          type: "success",
          message: "操作成功"
        });
        this.userList.map((item, index) => {
          if (item.userId === this.userListChecked) {
            this.userList.splice(index, 1);
          }
        });
        this.userListChecked = null;
      }
    },
    // 选择人员操作
    optionUserData() {
      this.visibleUserDialog = true;
    },
    optionUserSubmit() {
      let data = this.$refs.optionUser.multipleSelection;
      const map = new Map();
      data.forEach(i => map.set(i.userId, i));
      this.userList.forEach(i => map.set(i.userId, i));
      let arr = [];
      map.forEach(value => {
        arr.push(value);
      });
      this.userList = arr;
      this.visibleUserDialog = false;
    },
    optionUserClose() {
      this.userListChecked = "";
      this.visibleUserDialog = false;
    },
    beforeClose() {
      this.userListChecked = "";
      this.userList = [];
      this.$emit("update:visible", false);
      this.$refs.optionUser.resetOption();
    },
    postSubmit() {
      let param;
      if (this.checkList.length > 0) {
        param = {
          userId: this.userListChecked,
          [this.primaryId]: this.uid,
          authorityArr: this.checkList,
          isDeliver: false
        };
      } else {
        param = {
          userId: this.userListChecked,
          [this.primaryId]: this.uid,
          authorityArr: ["-1"]
        };
      }
      if (
        param.userId === null ||
        param.userId === "" ||
        param.userId === undefined
      ) {
        this.$message({
          type: "warning",
          message: "请选择用户"
        });
      }

      this.$confirm(
        this.deleteMessage ? this.deleteMessage : "是否确认修改权限?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(async () => {
          const res = await request(
            API_PATH + this.saveInterface,
            param,
            "POST"
          );
          if (res.data.code === IS_OK) {
            this.$message({
              type: "success",
              message: "操作成功"
            });
          }
        })
        .catch(() => {});
      // if (this.type == "project" || this.type == "folder") {
      //   this.centerDialogVisible = true;
      //   this.paramObj = param;
      // } else {
      //   this.paramObj = param;
      //   this.$confirm(
      //     this.deleteMessage ? this.deleteMessage : "是否确认修改权限?",
      //     "提示",
      //     {
      //       confirmButtonText: "确定",
      //       cancelButtonText: "取消",
      //       type: "warning"
      //     }
      //   )
      //     .then(async () => {
      //       const res = await request(
      //         API_PATH + this.saveInterface,
      //         param,
      //         "POST"
      //       );
      //       if (res.data.code === IS_OK) {
      //         this.$message({
      //           type: "success",
      //           message: "操作成功"
      //         });
      //       }
      //     })
      //     .catch(() => {});
      // }
    },
    async centerDialogVisibleClick() {
      this.paramObj.isDeliver = this.radio;
      const res = await request(
        API_PATH + this.saveInterface,
        this.paramObj,
        "POST"
      );
      if (res.data.code === IS_OK) {
        this.$message({ type: "success", message: "操作成功" });
        this.centerDialogVisible = false;
        this.radio = false;
      }
    },
    powerSubmit() {
      if (this.userListChecked === "" || this.userListChecked === null) {
        this.$message({
          message: "请指定授权的用户！",
          type: "warning"
        });
      } else {
        this.postSubmit();
      }
    },
    powerClose() {
      this.userListChecked = "";
      // this.visible = false;
      this.$emit("update:visible", false);
      this.$refs.optionUser.resetOption();
    },
    async powerQuery(userId) {
      let param = {
        userId: userId,
        [this.primaryId]: this.uid
      };
      const res = await request(
        API_PATH + this.queryOneInterface,
        param,
        "GET"
      );
      if (res.data.code === IS_OK) {
        this.checkList = res.data.data;
        let isTrue = true;
        this.checkList.map(item => {
          if (item === "-1") {
            isTrue = false;
          }
        });
        if (isTrue) {
          if (this.checkList.length === this.checkDataList.length) {
            this.checkAll = true;
          }
          if (
            this.checkList.length > 0 &&
            this.checkList.length < this.checkDataList.length
          ) {
            this.isIndeterminate = true;
          }
          if (this.checkList.length <= 0) {
            this.checkNo = true;
          } else {
            this.checkNo = false;
          }
        } else {
          this.checkList = [];
        }
      } else {
        this.$message({
          type: "warning",
          message: "查询失败"
        });
      }
    },
    handleClickUserName(userId) {
      this.userListChecked = userId;
      this.checkList = [];
      this.isIndeterminate = false;
      this.checkAll = false;
      this.powerQuery(userId);
    },
    handleChangeCheckAll(val) {
      if (val) {
        let arr = [];
        this.checkDataList.map(item => {
          arr.push(item.dictionarydataValue);
        });
        this.checkList = arr;
      } else {
        this.checkList = [];
      }
      this.isIndeterminate = false;
    },
    handleChangeCheckNo() {
      this.isIndeterminate = false;
      this.checkAll = false;
      this.checkList = [];
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.checkDataList.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.checkDataList.length;
    }
  },
  watch: {
    visible() {
      this.checkList = [];
      this.isIndeterminate = false;
      this.checkAll = false;
    },
    checkList(val) {
      if (val.length > 0) {
        this.checkNo = false;
      } else {
        this.checkNo = true;
      }
    }
  }
};
</script>

<style lang="stylus">
.power-wrapper {
  display: flex;
  height: 400px;

  .left, .right {
    height: 100%;
    flex: 50%;

    .el-card {
      height: 100%;

      .el-card__header {
        padding: 10px 20px;
        font-size: 14px;
      }

      .el-card__body {
        padding: 10px 20px;
        height: calc(100% - 62px);
        overflow-y: auto;
        overflow-x: hidden;
      }
    }
  }

  .left {
    margin-right: 10px;

    .item {
      color: #333;
      font-size: 14px;
      line-height: 30px;
      cursor: pointer;

      i {
        color: #666;
      }

      &:hover, &.active {
        background: #eee;
      }
    }
  }

  .right {
    margin-left: 10px;

    .item {
      margin-bottom: 10px;
    }
  }

  .clearfix {
    position: relative;

    .add {
      position: absolute;
      right: 64px;
      top: -4px;
    }

    .delete {
      position: absolute;
      right: 0px;
      top: -4px;
    }
  }
}
</style>
