<template>
  <a-el-dialog :visible.sync="visible" :title="title" width="40%" :beforeClose="beforeClose">
    <div class="power-wrapper">
      <div class="left">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>人员列表</span>
          </div>
          <div
            class="item"
            v-for="item in userList"
            @click="handleClickUserName(item.userId)"
            :key="item.userId"
            :class="item.userId === userListChecked ? 'active' : ''"
          >
            <i class="el-icon-s-custom"></i>
            {{item.userName}}
          </div>
        </el-card>
      </div>
      <div class="right">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>权限列表</span>
          </div>
          <div class="item">
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleChangeCheckAll"
            >全选</el-checkbox>
          </div>
          <el-checkbox-group v-model="checkList" @change="handleCheckedCitiesChange">
            <div class="item" v-for="item in checkDataList" :key="item.dictionarydataValue">
              <el-checkbox
                :label="item.dictionarydataValue"
                :key="item.dictionarydataValue"
              >{{item.dictionarydataName}}</el-checkbox>
            </div>
          </el-checkbox-group>
        </el-card>
      </div>
    </div>
    <template slot="footer">
      <el-button type="primary" size="mini" @click="powerSubmit">确定</el-button>
      <el-button type="default" size="mini" @click="powerClose">取消</el-button>
    </template>
  </a-el-dialog>
</template>

<script>
import AElDialog from "./AElDialog";
import { resBaseDicNameByDicCode, resBaseUserPage } from "../../api";
import { IS_OK, API_PATH } from "../../api/path";
import request from "../../api/config";
export default {
  name: "AEPower",
  components: {
    AElDialog
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
    saveInterface: String
  },
  data() {
    return {
      powerDialogVisible: false,
      userList: [],
      userListChecked: "",
      checkDataList: [],
      checkList: [],
      checkListDisabled: false,
      checkAll: false,
      isIndeterminate: false
    };
  },
  created() {
    this.getUserList();
    this.getCheckDataList();
  },
  methods: {
    beforeClose() {
      this.userListChecked = ""
      this.$emit("update:visible", false);
    },
    async getUserList() {
      const res = await resBaseUserPage({ pageSize: 100, pageNum: 1 });
      if (res.data.code === IS_OK) {
        this.userList = res.data.data.list;
      }
    },
    async getCheckDataList() {
      const res = await resBaseDicNameByDicCode({ dicCode: this.codeName });
      if (res.data.code === IS_OK) {
        this.checkDataList = res.data.data;
      }
    },
    async postSubmit() {
      let param = {
        userId: this.userListChecked,
        [this.primaryId]: this.uid,
        authorityArr: this.checkList
      };
      const res = await request(API_PATH + this.saveInterface, param, "POST");
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
      if (this.checkList.length > 0) {
        this.postSubmit();
      } else {
        this.$message({
          message: "您没有操作权限列表的数据,请操作后在提交！",
          type: "warning"
        });
      }
    },
    powerClose() {
      this.userListChecked = ''
      this.$emit("update:visible", false);
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
        if(this.checkList.length == this.checkDataList.length) {
          this.checkAll = true
        }
        if(this.checkList.length > 0 && this.checkList.length<this.checkDataList.length) {
          this.isIndeterminate = true
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
        this.checkDataList.map(item => {
          this.checkList.push(item.dictionarydataValue);
        });
      } else {
        this.checkList = [];
      }
      this.isIndeterminate = false;
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
}
</style>
