<template>
  <div class="form-base" id="formBase" ref="formBase" v-loading="formLoading">
    <div class="form-inline-base" ref="formInlineBase" v-if="!noFormInlineBase">
      <div class="form-inline-bar">
        <el-form
          :inline="true"
          :model="formInline"
          ref="formInline"
          size="small"
          class="demo-form-inline"
          v-if="!noSearchForm"
        >
          <slot name="searchForm" :formInline="formInline"></slot>
          <el-form-item v-if="JSON.stringify(formInline) !== '{}'">
            <el-button icon="el-icon-search" type="primary" size="small" @click="clickQuery">查询</el-button>
            <el-button icon="el-icon-delete" type="default" size="small" @click="clear">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="tool-bar">
        <el-button
          icon="el-icon-plus"
          type="primary"
          size="small"
          v-if="!noAddBtn"
          @click="add"
        >{{ addBtnText }}</el-button>
        <el-button
          icon="el-icon-edit"
          type="primary"
          size="small"
          v-if="!noEditBtn"
          @click="edit"
        >{{ editBtnText }}</el-button>
        <el-button
          icon="el-icon-delete"
          type="danger"
          size="small"
          v-if="!noDeleteBtn"
          @click="del"
        >{{ deleteBtnText }}</el-button>
        <el-button
          icon="el-icon-view"
          type="primary"
          size="small"
          v-if="!noViewBtn"
          @click="view"
        >{{ viewBtnText }}</el-button>
        <slot name="toolbar"></slot>
      </div>
    </div>

    <div
      class="form-table-list"
      :style="{height: !noFormInlineBase ? 'calc(100% - 78px)': 'calc(100% - 0px)'}"
    >
      <vtable
        style="width: 100%"
        ref="vTable"
        :dataArray="dataArray"
        :pageSize.sync="pageSize"
        :pageNum.sync="pageNum"
        :columns="columns"
        :total="total"
        :isOrder="true"
        :nodePage="nodePage"
        v-loading="tableLoading"
        @getArticle="query"
        @current-change="currentChange"
        :highlightCurrentRow="highlightCurrentRow"
        :default-expand-all="defaultExpandAll"
        :rowKey="rowKey"
        :height="height"
        :noFormInlineBase="noFormInlineBase"
      ></vtable>
    </div>

    <a-el-dialog :visible.sync="dialogshow" :title="title">
      <el-form
        ref="addForm"
        :model="addForm"
        label-width="160px"
        :rules="rules"
        size="small"
        class="demo-form-inline"
        :disabled="disabled"
      >
        <slot name="add" :addForm="addForm"></slot>
      </el-form>
      <template slot="footer" v-if="!disabled">
        <slot name="footer-left"></slot>
        <slot name="submit">
          <el-button type="primary" size="small" :loading="saveloadding" @click="save">确定</el-button>
        </slot>
        <slot name="footer-center"></slot>
        <el-button type="default" size="small" @click="cancel">取消</el-button>
        <slot name="footer-right"></slot>
      </template>
    </a-el-dialog>
  </div>
</template>

<script>
import Table from "./table.vue";
import AElDialog from "./Dialog/AElDialog.vue";
import request from "@/api/config";
import { API_PATH, IS_OK } from "../api/path";

export default {
  name: "FormBase",
  components: {
    AElDialog,
    vtable: Table
  },
  props: {
    btnOperationtype: {
      type: String,
      default: "add"
    }, // 操作按钮的类型
    queryInterface: String, // 查询接口名称
    updateInterface: String, // 修改接口名称
    saveInterface: String, // 新增接口名称
    deleteInterface: String, // 删除接口名称
    queryOneInterface: String, // 查询详情接口名称
    paramController: Function, // 参数控制方法
    queryController: Function, // 查询接口控制
    resetController: Function, // 重置表单控制
    queryOneController: Function, // 查询单个控制
    clearController: Function, // clear清除控制
    addController: Function, // 点击按钮前判断
    beforeUpdateBtn: Function, // 点击修改按钮前
    beforeDeleteBtn: Function, // 点击删除按钮前
    beforeViewBtn: Function, // 点击查看按钮前
    resetForm: Function,
    addControllerCallback: Function, // 新增或修改成功后的回调
    deleteControllerCallback: Function, // 删除成功后的回调
    columns: Array, // 表格头部信息
    primaryId: String, // 主键id名称
    deleteInfo: String,
    nodePage: {
      // 是否分页
      type: Boolean,
      default: true
    },
    rowKey: String, // 如果是树数据 传入row-key
    highlightCurrentRow: {
      // 是否可以选择单个
      type: Boolean,
      default: true
    },
    rules: Object,
    defaultExpandAll: {
      type: Boolean,
      default: true
    },
    setHeight: {
      type: Number,
      default: 0
    },
    addBtnText: {
      type: String,
      default: "新增"
    },
    editBtnText: {
      type: String,
      default: "修改"
    },
    viewBtnText: {
      type: String,
      default: "详情"
    },
    deleteBtnText: {
      type: String,
      default: "删除"
    },
    noAddBtn: {
      type: Boolean,
      default: false
    },
    noEditBtn: {
      type: Boolean,
      default: false
    },
    noViewBtn: {
      type: Boolean,
      default: false
    },
    noResetPassword: {
      type: Boolean,
      default: true
    },
    noDeleteBtn: {
      type: Boolean,
      default: false
    },
    isDefaultQuery: {
      type: Boolean,
      default: false
    },
    uid: {
      type: String
    },
    noSearchForm: {
      type: Boolean,
      default: false
    },
    noFormInlineBase: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formLoading: false,
      tableLoading: false,
      pageSize: 20, // 页数
      pageNum: 1, // 页码
      total: 0, // 总页数
      dataArray: [], // 查询的数据集合
      formInline: {}, // 搜索框查询条件
      height: 0,
      // uid: "", // 表格单选的数据对象
      dialogshow: false,
      saveloadding: false,
      disabled: false,
      title: "新增",
      addForm: {},
      btnType: "add"
    };
  },
  created() {
    if (!this.isDefaultQuery) {
      this.query();
    }
    if (this.resetForm) {
      this.resetForm(this);
    } else {
      this.$set(this, "addForm", {});
    }
  },
  methods: {
    // 查询按钮事件
    clickQuery() {
      this.query();
    },
    // 清除查询条件
    clear() {
      this.formInline.random = Math.random();
      this.$refs.formInline.resetFields();
      if (this.clearController) {
        this.clearController(this);
      }
    },
    // 列表查询事件
    async query() {
      let _this = this;
      this.tableLoading = true;
      if (this.queryController) {
        let params = {
          ...this.formInline
        };
        this.queryController(this, params);
      } else {
        let params = {
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          ...this.formInline
        };
        const res = await request(
          API_PATH + this.queryInterface,
          params,
          "GET"
        );
        if (res.data.code === IS_OK) {
          if (res.data.data && res.data.data.list) {
            this.dataArray = res.data.data.list;
            this.total = res.data.data.totalCount;
          } else {
            this.dataArray = [];
            this.total = 0;
          }
          if (this.uid) {
            this.dataArray.map(item => {
              if (item[this.primaryId] === this.uid) {
                _this.$refs.vTable.handleCurrentChange(item);
              }
            });
          }
        }
      }
      setTimeout(() => {
        this.tableLoading = false;
      }, 200);
    },
    // 新增
    add() {
      this.btnType = "add";
      this.$emit("update:btn-operation-type", "add");
      if (this.addController) {
        let next = this.addController(this);
        if (next) {
          this.reset();
          this.dialogshow = true;
          this.title = "新增";
        }
      } else {
        this.dialogshow = true;
        this.title = "新增";
      }
    },
    // 编辑
    async edit() {
      this.btnType = "edit";
      this.title = "修改";
      this.$emit("update:btn-operation-type", "edit");
      if (this.uid) {
        if (this.beforeUpdateBtn) {
          this.beforeUpdateBtn(this.uid).then(async obj => {
            if (obj) {
              this.dialogshow = true;
              const res = await request(
                `${API_PATH}${this.queryOneInterface}/${this.uid}`,
                null,
                "GET"
              );
              if (res.data.code === IS_OK) {
                this.addForm = res.data.data;
                if (this.queryOneController) {
                  this.queryOneController(this);
                }
              }
            }
          });
        } else {
          this.dialogshow = true;
          const res = await request(
            `${API_PATH}${this.queryOneInterface}/${this.uid}`,
            null,
            "GET"
          );
          if (res.data.code === IS_OK) {
            this.addForm = res.data.data;
            if (this.queryOneController) {
              this.queryOneController(this);
            }
          }
        }
      } else {
        this.$message({
          message: "您没有选中任何数据项,请选中后再操作！",
          type: "warning"
        });
      }
    },
    async view() {
      if (this.uid) {
        if (this.beforeViewBtn) {
          this.beforeViewBtn(this.uid).then(async obj => {
            if (obj) {
              this.dialogshow = true;
              this.disabled = true;
              this.title = "查看详情";
              const res = await request(
                `${API_PATH}${this.queryOneInterface}/${this.uid}`,
                null,
                "GET"
              );
              if (res.data.code === IS_OK) {
                this.addForm = res.data.data;
                this.disabled = true;
              }
            }
          });
        } else {
          this.dialogshow = true;
          this.disabled = true;
          this.title = "查看详情";
          const res = await request(
            `${API_PATH}${this.queryOneInterface}/${this.uid}`,
            null,
            "GET"
          );
          if (res.data.code === IS_OK) {
            this.addForm = res.data.data;
            this.disabled = true;
          }
        }
      } else {
        this.$message({
          message: "您没有选中任何数据项,请选中后再操作！",
          type: "warning"
        });
      }
    },
    async doDelete() {
      const res = await request(
        API_PATH + this.deleteInterface,
        { data: [this.uid] },
        "DELETE"
      );
      if (res.data.code === IS_OK) {
        setTimeout(() => {
          this.$message({
            type: "success",
            message: "删除成功"
          });
          this.dialogshow = false;
          this.reset();
          this.query();
          this.$emit("update:uid", "");
          if (this.deleteControllerCallback) {
            this.deleteControllerCallback();
          }
        }, 500);
      }
    },
    // 删除
    del() {
      if (this.uid) {
        if (this.beforeDeleteBtn) {
          this.beforeDeleteBtn(this.uid).then(obj => {
            if (obj) {
              let info = "";
              if (this.deleteInfo) {
                info = this.deleteInfo;
              } else {
                info = "是否删除这条数据?";
              }
              this.$confirm(
                this.deleteMessage ? this.deleteMessage : info,
                "提示",
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                }
              )
                .then(() => {
                  this.doDelete();
                })
                .catch(() => {});
            }
          });
        } else {
          let info = "";
          if (this.deleteInfo) {
            info = this.deleteInfo;
          } else {
            info = "是否删除这条数据?";
          }
          this.$confirm(
            this.deleteMessage ? this.deleteMessage : info,
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(() => {
              this.doDelete();
            })
            .catch(() => {});
        }
      } else {
        this.$message({
          message: "您没有选中任何数据项,请选中后再操作！",
          type: "warning"
        });
      }
    },
    // 弹窗确定
    save() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.param = {
            ...this.addForm
          };
          if (this.paramController) {
            this.paramController(this).then(() => {
              this.submit(this.param);
            });
          } else {
            this.submit(this.param);
          }
        }
      });
    },
    async submit(param) {
      this.saveloadding = true;
      if (this.btnType == "edit") {
        // 修改
        const res = await request(
          API_PATH + this.updateInterface,
          param,
          "PUT"
        );
        if (res.data.code === IS_OK) {
          setTimeout(() => {
            this.$message({
              type: "success",
              message: "修改成功"
            });
            this.dialogshow = false;
            this.reset();
            this.query();
            if (this.addControllerCallback) {
              this.addControllerCallback();
            }
          }, 500);
        } else {
          this.saveloadding = false;
        }
      }
      if (this.btnType == "add") {
        this.$emit("update:uid", "");
        // 新增
        const res = await request(API_PATH + this.saveInterface, param, "POST");
        if (res.data.code === IS_OK) {
          setTimeout(() => {
            this.$message({
              type: "success",
              message: "新增成功"
            });
            this.dialogshow = false;
            this.reset();
            this.query();
            if (this.addControllerCallback) {
              this.addControllerCallback();
            }
          }, 500);
        } else {
          this.saveloadding = false;
        }
      }
    },
    // 弹窗取消
    cancel() {
      this.dialogshow = false;
      this.reset();
    },
    reset() {
      if (this.resetForm) {
        this.resetForm(this);
      } else {
        this.$set(this, "addForm", {});
      }
      this.disabled = false;
      this.saveloadding = false;
      this.$refs.addForm.resetFields();
      if (this.resetController) {
        this.resetController(this);
      }
    },
    currentChange(val) {
      if (val) {
        this.$emit("update:uid", val[this.primaryId]);
        this.$emit("current-change", val[this.primaryId], val);
      }
    }
  },
  watch: {
    dialogshow() {
      this.reset();
    }
  }
};
</script>

<style lang="stylus" scoped>
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
    margin-bottom: 10px;

    .form-inline-bar {
      flex: 1;
    }
  }

  .form-table-list {
    height: calc(100% - 78px);
  }

  .tool-bar {
    height: 51px;
  }
}
</style>
