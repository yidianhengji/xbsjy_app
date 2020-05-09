<template>
  <div class="dictionaryTree">
    <el-tree
      :data="treedataSync"
      :props="{label}"
      :show-checkbox="!single"
      :node-key="nodeKey"
      :highlight-current="single"
      :check-on-click-node="true"
      :expandOnClickNode="false"
      :render-content="renderContent"
      ref="tree"
      :default-expand-all="defaultExpandAll"
      @node-click="nclick"
    ></el-tree>
  </div>
</template>

<script>
export default {
  name: "treeformNoInterface",
  props: {
    label: String,
    nodeKey: {
      default: "id",
      type: [String, Number]
    },
    value: [String, Array, Number],
    single: {
      type: Boolean,
      default: false
    },
    treedata: {
      type: Array,
      default: () => []
    },
    defaultExpandAll: {
      type: Boolean,
      default: true
    },
    renderContent: Function
  },
  data() {
    return {
      current: {},
      treedataSync: this.treedata
    };
  },
  methods: {
    getValue() {
      if (this.single) {
        return this.$refs.tree.getCurrentKey();
      }
      return this.$refs.tree.getCheckedKeys(true);
    },
    nclick(data) {
      this.current = data;
      this.$emit("nodeClick", data);
    },
    findLabelName(arr, val) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][this.nodeKey] === val) {
          this.$emit("labelName", arr[i][this.label]);
          break;
        }

        if (arr[i].children && arr[i].children.length > 0) {
          this.findLabelName(arr[i].children, val);
        }
      }
    },
    findLabelNames(arr, val) {
      let name = "";
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][this.nodeKey] === val) {
          name = arr[i][this.label];
          break;
        }

        if (arr[i].children && arr[i].children.length > 0) {
          name = this.findLabelNames(arr[i].children, val);
          if (name) break;
        }
      }
      return name;
    },
    findLabelByNames(arr, val) {
      let name = [];
      if (val && val.length > 0) {
        val.forEach(v => {
          const i = this.findLabelNames(arr, v);
          if (i) {
            name.push(i);
          }
        });
        this.$emit("labelName", name.join("、"));
      }
    }
  },
  watch: {
    value(val) {
      if (this.$refs.tree) {
        if (!this.single) {
          this.$refs.tree.setCheckedKeys(val ? val : []);
          this.findLabelByNames(this.treedata, val);
        } else {
          if (val) {
            this.$refs.tree.setCurrentKey(val);
            this.findLabelName(this.treedata, val);
          } else {
            this.treedataSync = JSON.parse(JSON.stringify(this.treedataSync));
            this.$refs.tree.setCurrentKey(null);
            this.$emit("labelName", "");
          }
        }
      }
    },
    treedataSync(val) {
      this.$emit("update:treedata", val);
    },
    treedata(val) {
      this.treedataSync = val;
    }
  }
};
</script>

<style scoped lang="stylus"></style>
