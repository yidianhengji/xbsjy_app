<template>
  <div ref="table" class="table-wrapper-base">
    <el-table
      size="mini"
      ref="multipleTable"
      :data="dataArray"
      border
      :row-key="rowKey"
      @sort-change="sortChange"
      :highlight-current-row="highlightCurrentRow"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @selection-change="handleSelectionChange"
      @current-change="handleCurrentChange"
      @row-click="handleCurrentChange"
      :default-expand-all="defaultExpandAll"
      :header-cell-style="{ background: '#F5F7FA' }"
      style="width: 100%; position:absolute;"
      :height="height == 0 ? 500 : height"
    >
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column
        v-if="isSelection"
        type="selection"
        :width="40"
        align="center"
      ></el-table-column>
      <el-table-column
        v-for="(column, index) in columns"
        :label="column.label"
        :prop="column.prop"
        :key="index"
        :width="column.width"
        :min-width="column.minWidth || 100"
        :align="column.align || 'center'"
        :sortable="column.sortable"
      >
        <template slot-scope="scope">
          <my-render
            v-if="column.render"
            :index="index"
            :row="scope.row"
            :render="column.render"
            :align="column.align"
            :sortable="column.sortable"
          ></my-render>
          <span v-else>{{ scope.row[column.prop] }}</span>
        </template>

        <template slot="header">
          <span>{{ column.label }}</span>
        </template>
      </el-table-column>

      <template slot="empty">
        <div>
          <img src="../assets/empty.svg" alt style="width: 100px;" />
          <div style="margin: 0; padding: 0;">暂无数据</div>
        </div>
      </template>
    </el-table>
    <div
      class="block"
      ref="paginationWrapper"
      style="margin-top: 10px; overflow: hidden;position: absolute;bottom: 0px;"
      v-if="nodePage"
    >
      <el-pagination
        :page-sizes="[20, 30, 40, 50]"
        @current-change="getNum"
        :current-change="pageNum"
        :size-change="pageSize"
        @size-change="getSize"
        :current-page="pageNum"
        layout="sizes, total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script type="text/jsx">
import MyRender from "./MyRender";

export default {
  props: [
    "dataArray",
    "columns",
    "isSelection",
    "isOrder",
    "pageSize",
    "pageNum",
    "total",
    "nodePage",
    "rowKey",
    "highlightCurrentRow",
    "noresize",
    "defaultExpandAll",
    "noFormInlineBase"
  ],
  data() {
    return {
      multipleSelection: [],
      selection: {},
      size: this.pageSize,
      num: this.pageNum,
      toggleSelectionData: [],
      height: 400
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (this.noresize) return;
      this.setTableWidth();
      window.addEventListener("resize", this.setTableWidth);
    });
  },
  methods: {
    setTableWidth() {
      if (this.$refs.table) {
        let tableHeight = this.$refs.table.clientHeight;
        let paginationHeight = 0;
        let tableHeadHeight = 0;
        if (this.nodePage) {
          paginationHeight = this.$refs.paginationWrapper.clientHeight;
          tableHeadHeight = 10;
        }
        this.height = tableHeight - paginationHeight - tableHeadHeight;
      }
    },

    sortChange(val) {
      this.$emit("sortChange", val);
    },
    toggleSelectionFn(toggleSelection) {
      setTimeout(() => {
        if (toggleSelection) {
          toggleSelection.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row, true);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      }, 20);
    },
    getSize(val) {
      this.size = val;
      this.$emit("update:pageSize", val);
      this.$emit("getArticle", this.num, this.size);
    },
    getNum(val) {
      this.num = val;
      this.$emit("update:pageNum", val);
      this.$emit("getArticle", this.num, this.size);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCurrentChange(val) {
      this.selection = val;
      this.$refs.multipleTable.setCurrentRow(val);
      this.$emit("current-change", val);
    }
  },
  components: {
    MyRender
  }
};
</script>

<style lang="stylus">
.table-wrapper-base {
  width: 100%
  height: 100%;
  position: relative;
}

.el-pagination {
  padding: 2px 0;
}

.el-pagination .el-select .el-input {
  margin: 0px;
}

.block {

}
</style>
