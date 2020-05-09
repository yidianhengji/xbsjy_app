<template>
  <a-el-dialog :visible.sync="visible" title="操作日志" :beforeClose="beforeClose">
    <div style="height: 600px;">
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
      tableLoading: false
    };
  },
  created() {
    this.query();
  },
  methods: {
    async query() {
      this.tableLoading = true;
      let params = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        modelId: this.uid
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