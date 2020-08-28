<template>
  <a-el-dialog
    :visible.sync="visible"
    :title="title"
    width="480px"
    :beforeClose="beforeClose"
  >
    <div class="power-wrapper" :key="uuid">
      <div class="left">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>列表</span>
            <el-button
              class="add"
              size="mini"
              type="primary"
              @click="optionUserData"
              >新增</el-button
            >
            <el-button
              class="delete"
              size="mini"
              type="danger"
              @click="rmAuthUsers"
              >删除</el-button
            >
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
                src="../../../assets/empty.svg"
                style="margin: 0px auto;display: block;width: 80px;"
              />
              <p style="color: #ccc;font-size: 14px;margin-top: 15px;">
                暂无数据，请选择人员
              </p>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <template slot="footer">
      <el-button type="primary" size="mini" @click="powerSubmit"
        >确定</el-button
      >
      <el-button type="default" size="mini" @click="powerClose">取消</el-button>
    </template>

    <a-el-dialog :visible.sync="visibleUserDialog" title="选择人员" width="60%">
      <a-e-i-option-users ref="optionUser"></a-e-i-option-users>
      <template slot="footer">
        <el-button type="primary" size="mini" @click="optionUserSubmit"
          >确定</el-button
        >
        <el-button type="default" size="mini" @click="optionUserClose"
          >取消</el-button
        >
      </template>
    </a-el-dialog>
  </a-el-dialog>
</template>

<script>
import AElDialog from "../../../components/Dialog/AElDialog";
import AEIOptionUsers from "../../../components/Dialog/AEIOptionUsers.vue";
import { IS_OK } from "../../../api/path";
import { resBaseRoleAddUsers } from "../../../api";
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
    primaryId: {
      type: String
    },
    queryOneInterface: String,
    saveInterface: String,
    userList: Array,
    //删除选中的赋权人权
    deleteAuthUsers: String
  },
  data() {
    return {
      uuid: uuidv4(),
      powerDialogVisible: false,
      userListChecked: "",
      visibleUserDialog: false
    };
  },
  methods: {
    //移除赋权的人员
    async rmAuthUsers() {
      if (this.userListChecked) {
        this.userList.map((item, index) => {
          if (item.userId === this.userListChecked) {
            this.userList.splice(index, 1);
          }
        });
        this.postSubmit();
      } else {
        this.$message({
          message: "您没有操作列表的数据,请选择后在操作！",
          type: "warning"
        });
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
      this.visibleUserDialog = false;
    },
    beforeClose() {
      this.userListChecked = "";
      this.userList = [];
      this.$emit("update:visible", false);
      this.$refs.optionUser.resetOption();
    },
    async postSubmit() {
      let userIdsArr = [];
      this.userList.map(item => userIdsArr.push(item.userId));
      const res = await resBaseRoleAddUsers(this.uid, userIdsArr);
      if (res.data.code === IS_OK) {
        this.$message({
          type: "success",
          message: "操作成功"
        });
      } else {
        this.$message({
          type: "warning",
          message: "操作失败"
        });
      }
    },
    powerSubmit() {
      this.postSubmit();
    },
    powerClose() {
      this.userListChecked = "";
      this.$emit("update:visible", false);
      this.$refs.optionUser.resetOption();
    },
    handleClickUserName(userId) {
      this.userListChecked = userId;
    }
  },
  watch: {
    visible() {}
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
