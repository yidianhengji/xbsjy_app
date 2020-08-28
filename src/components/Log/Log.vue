<template>
  <a-el-dialog :visible.sync="visible" title="操作日志" :beforeClose="beforeClose">
    <el-form
      :inline="true"
      :model="formInline"
      ref="formInline"
      size="small"
      class="demo-form-inline"
    >
      <el-form-item label="选择时间">
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
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" size="small" @click="clickQuery">查询</el-button>
      </el-form-item>
    </el-form>
    <div style="height: 500px;">
      <vtable
        style="width: 100%"
        ref="vTable"
        :dataArray="dataArray"
        :pageSize.sync="pageSize"
        :pageNum.sync="pageNum"
        :columns="columns"
        :total="total"
        :isOrder="true"
        :nodePage="true"
        v-loading="tableLoading"
        @getArticle="query"
      ></vtable>
    </div>
    <template slot="footer">
      <el-button type="default" size="small" @click="beforeClose">取消</el-button>
    </template>
  </a-el-dialog>
</template>

<script>
import Table from "../table.vue";
import AElDialog from "../Dialog/AElDialog.vue";
import { resBaseLogPage } from "../../api";
import { IS_OK } from "../../api/path";
export default {
  name: "Log",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    uid: {
      type: String,
      default: ""
    }
  },
  components: {
    AElDialog,
    vtable: Table
  },
  data() {
    return {
      pageSize: 20, // 页数
      pageNum: 1, // 页码
      total: 0, // 总页数
      dataArray: [],
      columns: [
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
        }
      ],
      formInline: {
        startTime: "",
        endTime: ""
      },
      valueData: "",
      valueFormat: "yyyy-MM-dd HH:mm:ss",
      tableLoading: false
    };
  },
  created() {
    this.query();
  },
  methods: {
    handelchange(val) {
      if (val) {
        this.formInline = {
          startTime: val[0],
          endTime: val[1]
        };
      } else {
        this.formInline = {
          startTime: "",
          endTime: ""
        };
      }
    },
    clickQuery() {
      this.query();
    },
    async query() {
      this.tableLoading = true;
      let params = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        modelId: this.uid,
        ...this.formInline
      };
      const res = await resBaseLogPage(params);
      if (res.data.code === IS_OK) {
        this.dataArray = res.data.data.list;
        this.total = res.data.data.totalCount;
        this.tableLoading = false;
      }
    },
    beforeClose() {
      this.$emit("update:visible", false);
    }
  }
};
</script>
