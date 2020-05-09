<template>
  <div class="app-main-wrapper">
    <form-base
      ref="findex"
      primaryId="roleId"
      query-interface="base/log/page"
      :clear-controller="clearController"
      :columns="columns"
      noAddBtn
      noEditBtn
      noDeleteBtn
    >
      <template slot="searchForm">
        <el-form-item label="选择时间" prop="keyword">
          <el-date-picker
            v-model="valueData"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handelchange"
            :value-format="valueFormat"
          ></el-date-picker>
        </el-form-item>
      </template>
    </form-base>
  </div>
</template>

<script>
import FormBase from "../../../components/FormBase.vue";
export default {
  name: "logs",
  components: {
    FormBase
  },
  data() {
    return {
      columns: [
        {
          prop: "logType",
          align: "center",
          label: "日志类型"
        },
        {
          prop: "operationUserId",
          align: "center",
          label: "操作人"
        },
        {
          prop: "functionName",
          align: "center",
          label: "系统功能"
        },
        {
          prop: "operationIp",
          align: "center",
          label: "IP地址"
        },
        {
          prop: "operationTime",
          align: "center",
          label: "操作时间"
        },
        {
          prop: "description",
          align: "center",
          label: "操作描述"
        }
      ],
      valueFormat: "yyyy-MM-dd HH:mm:ss",
      valueData: ""
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.findex.formInline = {
        keyword: "",
        endTime: "",
        startTime: ""
      };
    });
  },
  methods: {
    handelchange(val) {
      this.$refs.findex.formInline = {
        startTime: val[0],
        endTime: val[1]
      };
    },
    clearController(that) {
      this.valueData = "";
      that.formInline = {
        startTime: '',
        endTime: ''
      };
      that.query();
    }
  }
};
</script>

<style lang="stylus" scoped>
.app-main-wrapper {
  height: 100%;
}
</style>
