<template>
  <div class="AEltreeSelect" :id="id">
    <el-row class="AEltreeSelect__input">
      <el-col :span="22">
        <el-input :value="value" readonly></el-input>
      </el-col>
      <el-col :span="2" style="text-align: right;">
        <el-button type="primary" @click="pick">{{ btnText }}</el-button>
      </el-col>
    </el-row>

    <a-el-dialog :visible.sync="show" :title="title" :width="width">
      <div class="icon-list">
        <div class="page" v-for="(item, index) in iconList" :key="index">
          <h2 class="page-header">{{ item.name }}</h2>
          <ul class="page-body">
            <li
              v-for="(i, k) in item.list"
              :key="k"
              @click="handleClick(i)"
              @dblclick="handleDbClick(i)"
              :class="isActive == i ? 'active' : ''"
            >
              <i :class="i"></i>
              {{ i.substr(6) }}
            </li>
          </ul>
        </div>
      </div>
      <template slot="footer">
        <el-button type="primary" size="mini" @click="submit">确定</el-button>
        <el-button type="info" size="mini" @click="clear">清除</el-button>
        <el-button type="default" size="mini" @click="show = false">取消</el-button>
      </template>
    </a-el-dialog>
  </div>
</template>

<script type="text/jsx">
import AElDialog from "./AElDialog";
import { Random } from "../../util/commonUtils";
import { IconJson } from "../../util/iconListJson";

/**
 * 树选择 弹窗组件
 */
export default {
  name: "AESelectIcon",
  components: { AElDialog },
  data() {
    return {
      name: "",
      show: false,
      id: Random(),
      iconList: IconJson,
      isActive: ""
    };
  },
  props: {
    btnText: {
      type: String,
      default: "选择"
    },
    title: {
      type: String,
      default: "选择图标"
    },
    width: {
      type: String,
      default: "50%"
    },
    value: {
      type: [String, Number, Array]
    }
  },
  methods: {
    pick() {
      this.show = !this.show;
    },
    clear() {
      this.isActive = "";
      this.$emit("update:value", "");
    },
    submit() {
      this.$emit("update:value", this.isActive);
      this.pick();
    },
    handleClick(className) {
      this.isActive = className;
    },
    handleDbClick(className) {
      this.isActive = className;
      this.submit();
    }
  }
};
</script>

<style lang="stylus" scoped>
.icon-list {
  .page {
    margin-bottom: 30px;

    .page-header {
      padding-bottom: 10px;
      margin: 10px 0;
      border-bottom: 1px solid #eee;
      color: #2c2c2c;
      font-size: 16px;
    }

    .page-body {
      overflow: hidden;
      display: flex;
      flex-wrap: wrap;

      li {
        flex: 0 0 25%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #000;
        line-height: 30px;
        transition: 0.1s;
        border-radius: 4px;
        padding: 0 10px;
        box-sizing: border-box;
        font-size: 14px;

        &:hover, &.active {
          background: #409EFF;
          color: #fff;
        }

        > i {
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
