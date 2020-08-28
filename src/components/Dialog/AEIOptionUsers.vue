<template>
  <div class="box" :key="uuid">
    <div class="left">
      <div class="left-title">公司部门</div>
      <div class="left-body" v-loading="userLoading">
        <left-tree
          :treedata="companyAnddepartmentData"
          label="name"
          :single="true"
          node-key="id"
          ref="tree"
          :render-content="renderContent"
          @nodeClick="handlePersonnelName"
        ></left-tree>
      </div>
    </div>
    <div class="y-hander"></div>
    <div class="right">
      <div class="form-base">
        <div class="form-inline-base">
          <div class="form-inline-bar">
            <el-form
              :inline="true"
              :model="formInline"
              ref="formInline"
              size="small"
              class="demo-form-inline"
            >
              <el-form-item label="登录账号或用户名" prop="keyword">
                <el-input
                  v-model="formInline.keyword"
                  size="small"
                  placeholder="请输入登录账号或用户名"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  icon="el-icon-search"
                  type="primary"
                  size="small"
                  @click="getUserListData"
                >查询</el-button>
                <el-button icon="el-icon-delete" type="default" size="small" @click="clear">清空</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="form-table-list">
          <el-table
            row-key="userId"
            size="mini"
            ref="multipleTable"
            :data="treedata"
            tooltip-effect="dark"
            style="width: 100%; position:absolute;"
            height="440"
            :header-cell-style="{ background: '#F5F7FA' }"
            border
            @selection-change="handleSelectionChange"
          >
            <el-table-column reserve-selection type="selection" width="55"></el-table-column>
            <el-table-column prop="userAccount" label="账号"></el-table-column>
            <el-table-column prop="userName" label="姓名"></el-table-column>
            <el-table-column prop="post" label="职务"></el-table-column>
            <el-table-column prop="sexName" label="性别"></el-table-column>
          </el-table>
          <div class="block" ref="paginationWrapper">
            <el-pagination
              :page-sizes="[20, 30, 40, 50]"
              @current-change="getNum"
              :current-change="formInline.pageNum"
              :size-change="formInline.pageSize"
              @size-change="getSize"
              :current-page="formInline.pageNum"
              layout="sizes, total, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/jsx">
import LeftTree from "../../components/Tree/leftTree";
import { resBaseDepartmentQueryComDepTree, resBaseUserPage } from "../../api";
import { IS_OK } from "../../api/path";
import { v4 as uuidv4 } from "uuid";
export default {
  name: "AEIOptionUsers",
  components: {
    LeftTree
  },
  data() {
    return {
      multipleSelection: [],
      userLoading: true,
      companyAnddepartmentData: [],
      treedata: [],
      total: 0,
      formInline: {
        pageSize: 20,
        pageNum: 1,
        keyword: "",
        id: ""
      },
      uuid: uuidv4()
    };
  },
  created() {
    this.getPersonneTreeData();
    this.getUserListData();
  },
  methods: {
    getNum(val) {
      this.formInline.pageNum = val;
      this.getUserListData();
    },
    getSize(val) {
      this.formInline.pageSize = val;
      this.getUserListData();
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    //人员多选
    handleSelectionChange(val) {
      let arrData = [];
      val.forEach(item => {
        let obj = {};
        obj.userId = item.userId;
        obj.userName = item.userName;
        arrData.push(obj);
      });
      this.multipleSelection = arrData;
    },
    async getPersonneTreeData() {
      const res = await resBaseDepartmentQueryComDepTree();
      if (IS_OK === res.data.code) {
        this.companyAnddepartmentData = res.data.data;
        this.userLoading = false;
      }
    },
    async getUserListData() {
      const res = await resBaseUserPage(this.formInline);
      if (IS_OK === res.data.code) {
        this.treedata = res.data.data.list;
        this.total = res.data.data.totalCount;
      }
    },
    renderContent(h, { node, data }) {
      return (
        <span class="custom-tree-node" style="font-size: 14px; color: #606266;">
          <span
            class={
              data.type == "company" ? "fa fa-folder" : "fa fa-file-text-o"
            }
            style="margin-right: 5px;"
          ></span>
          <span>{node.label}</span>
        </span>
      );
    },
    //点击左侧点位按钮
    handlePersonnelName(obj) {
      this.formInline.id = obj.id;
      this.getUserListData();
    },
    resetOption() {
      this.multipleSelection = [];
      this.$refs.multipleTable.clearSelection();
    },
    clear() {
      this.formInline = {
        keyword: "",
        id: ""
      };
    }
  }
};
</script>

<style lang="stylus" scoped>
.box {
  display: flex;
  height: 600px;
  padding: 10px;
  box-sizing: border-box;

  .left {
    width: 260px;
    background: #fff;
    box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.2);
    border: 1px solid #eee;

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

    .form-base {
      padding: 10px;
      box-sizing: border-box;
      height: 100%;
      width: 100%;

      .form-inline-base {
        border: 1px solid #eee;
        padding: 15px 10px 0px;
        box-sizing: border-box;
        border-left: 6px solid #409eff;
        box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.2);
        display: flex;
        width: 100%;

        .form-inline-bar {
          flex: 1;
        }
      }
    }
  }

  .form-table-list {
    margin-top: 10px;
    height: calc(100% - 78px);
    position: relative;

    .block {
      margin-top: 10px;
      overflow: hidden;
      position: absolute;
      bottom: 0px;
    }
  }
}
</style>
