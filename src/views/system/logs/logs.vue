<template>
  <div class="app-main-wrapper">
    <form-base
      ref="findex"
      primaryId="roleId"
      query-interface="base/log/page"
      :clear-controller="clearController"
      :columns="columns"
      :uid.sync="uid"
      noAddBtn
      noEditBtn
      noDeleteBtn
      noViewBtn
    >
      <template slot="searchForm" slot-scope="data">
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
        <el-form-item label="日志类型" prop="logType">
          <el-select v-model="data.formInline.logType" size="small" clearable>
            <el-option label="登录日志" value="登录日志"></el-option>
            <el-option label="操作日志" value="操作日志"></el-option>
            <el-option label="错误日志" value="错误日志"></el-option>
          </el-select>
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
      uid: "",
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
      valueData: "",
      logType: ""
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.findex.formInline = {
        keyword: "",
        endTime: "",
        startTime: "",
        logType: ""
      };
    });
  },
  methods: {
    handelchange(val) {
      this.$refs.findex.formInline = {
        startTime: val[0],
        endTime: val[1],
        logType: this.logType
      };
    },
    clearController(that) {
      this.valueData = "";
      this.logType = "";
      that.formInline = {
        startTime: "",
        endTime: "",
        logType: ""
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
