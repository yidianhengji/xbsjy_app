<template>
  <a-el-dialog :visible.sync="visible" title="选择资源" width="70%" :beforeClose="beforeClose">
    <Resources style="height: 600px;" :uidObj="uidObj"></Resources>
  </a-el-dialog>
</template>

<script type="text/jsx">
import AElDialog from "../../../components/Dialog/AElDialog";
import Resources from "../resources/resources.vue";

export default {
  name: "parameterDetailsFolder",
  components: {
    AElDialog,
    Resources
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    uidObj: {
      type: Object
    }
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    beforeClose() {
      this.$emit("update:visible", false);
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
    background: #fff;
    box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.2);
    border: 1px solid #eee;
    width: 260px;

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

.app-main-wrapper {
  height: 600px;
}
</style>
