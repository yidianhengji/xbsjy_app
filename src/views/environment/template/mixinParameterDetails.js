export const mixinParameterDetails = {
  data () {
    return {
      parameterDetailsVisible: false,
      parameterResourcesBtnVisible: false
    }
  },
  methods: {
    parameterDetailsBtn () {
      if (this.uid) {
        this.parameterDetailsVisible = true
      } else {
        this.$message({
          message: "您没有选中任何数据项,请选中后再操作！",
          type: "warning"
        });
      }
    },
    parameterResourcesBtn () {
      if (this.uid) {
        this.parameterResourcesBtnVisible = true
      } else {
        this.$message({
          message: "您没有选中任何数据项,请选中后再操作！",
          type: "warning"
        });
      }
    }
  },
}