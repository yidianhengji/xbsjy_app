<template>
  <div class="AEltreeSelect" :id="id">
    <el-row class="AEltreeSelect__input">
      <el-col :span="22">
        <el-input :value="name" readonly></el-input>
      </el-col>
      <el-col :span="2" style="text-align: right;">
        <el-button type="primary" @click="pick">{{btnText}}</el-button>
      </el-col>
    </el-row>

    <a-el-dialog :visible.sync="show" :title="title" :width="width">
      <treeform-no-interface
        :treedata="treedata"
        :label="label"
        :single="single"
        :node-key="nodeKey"
        :default-expand-all="defaultEexpandAll"
        :value="value"
        ref="tree"
        @labelName="handleName"
      ></treeform-no-interface>
      <template slot="footer">
        <el-button type="primary" size="mini" @click="submit">确定</el-button>
        <el-button type="default" size="mini" @click="show = false">取消</el-button>
      </template>
    </a-el-dialog>
  </div>
</template>

<script type="text/jsx">
import AElDialog from "./AElDialog";
import TreeformNoInterface from "../Tree/treeformNoInterface";
import { Random } from "../../util/commonUtils";

/**
 * 树选择 弹窗组件
 */
export default {
  name: "AEltreeSelect",
  components: { TreeformNoInterface, AElDialog },
  data() {
    return {
      name: "",
      show: false,
      id: Random()
    };
  },
  props: {
    treedata: Array,
    label: String,
    single: {
      type: Boolean,
      default: true
    },
    defaultEexpandAll: {
      type: Boolean,
      default: true
    },
    nodeKey: String,
    btnText: {
      type: String,
      default: "选择"
    },
    title: {
      type: String,
      default: "选择上级目录"
    },
    width: {
      type: String,
      default: "30%"
    },
    value: {
      type: [String, Number, Array]
    }
  },
  methods: {
    pick() {
      this.show = !this.show;
    },
    submit() {
      this.$emit("update:value", this.$refs.tree.getValue());
      this.pick();
    },
    handleName(name) {
      this.name = name;
    }
  }
};
</script>

<style lang="stylus" scoped></style>
