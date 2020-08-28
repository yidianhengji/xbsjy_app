<template>
  <div class="box">
    <div class="left">
      <div class="left-title">字典分类</div>
      <div class="left-body" v-loading="dictionaryLoading">
        <left-tree
          :treedata="dictionaryDataTree"
          label="dictionaryName"
          :single="true"
          node-key="dictionaryId"
          ref="tree"
          @nodeClick="handleCictionaryName"
          :renderContent="renderContent"
        ></left-tree>
      </div>
    </div>
    <div class="y-hander"></div>
    <div class="right">
      <form-base
        ref="findex"
        primaryId="dictionarydataId"
        query-interface="base/dictionarydata/page"
        query-one-interface="base/dictionarydata/info"
        save-interface="base/dictionarydata/save"
        update-interface="base/dictionarydata/update"
        delete-interface="base/dictionarydata/delete"
        :columns="columns"
        :uid.sync="uid"
        :rules="rules"
        :reset-form="resetForm"
        :add-controller="addController"
        :param-controller="paramController"
        :btn-operation-type.sync="btnOperationType"
        noViewBtn
      >
        <template slot="searchForm" slot-scope="data">
          <el-form-item label="字典名称" prop="dictionarydataName">
            <el-input
              v-model="data.formInline.dictionarydataName"
              size="small"
              clearable
              placeholder="字典名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="字典编码" prop="dictionarydataValue">
            <el-input
              v-model="data.formInline.dictionarydataValue"
              size="small"
              clearable
              placeholder="字典编码"
            ></el-input>
          </el-form-item>
        </template>
        <template slot="toolbar">
          <el-button type="success" icon="el-icon-plus" size="small" @click="addDictionarySave">字典分类</el-button>
        </template>
        <template slot="add" slot-scope="data">
          <el-form-item label="字典名称" prop="dictionarydataName">
            <el-input v-model="data.addForm.dictionarydataName" size="small" placeholder="字典名称"></el-input>
          </el-form-item>
          <el-form-item label="字典键值" prop="dictionarydataValue">
            <el-input
              v-model="data.addForm.dictionarydataValue"
              ref="code"
              size="small"
              placeholder="字典键值"
            ></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="orderId">
            <el-input-number v-model="data.addForm.orderId" :min="0"></el-input-number>
          </el-form-item>
          <!-- <el-form-item label="是否启用" prop="isEnable">
            <el-switch v-model="data.addForm.isEnable"></el-switch>
          </el-form-item> -->
          <el-form-item label="字典描述" prop="description">
            <el-input
              v-model="data.addForm.description"
              size="small"
              :rows="5"
              type="textarea"
              placeholder="字典描述"
            ></el-input>
          </el-form-item>
        </template>
      </form-base>
    </div>

    <a-el-dialog
      :visible.sync="addDictionarySaveShow"
      @close="addDictionaryColse"
      title="分类管理"
      width="60%"
    >
      <dictionary-classify></dictionary-classify>
    </a-el-dialog>
  </div>
</template>

<script>
import FormBase from "../../../components/FormBase.vue";
import LeftTree from "../../../components/Tree/leftTree";
import AElDialog from "../../../components/Dialog/AElDialog";
import DictionaryClassify from "./dictionaryClassify";
import { resBaseDictionaryQueryTree } from "../../../api";
import { IS_OK } from "../../../api/path";
import { mixinMethodsDrag } from "../../../mixin/mixinMethodsDrag";
export default {
  name: "dictionary",
  mixins: [mixinMethodsDrag],
  components: {
    FormBase,
    LeftTree,
    AElDialog,
    DictionaryClassify
  },
  data() {
    return {
      uid: "",
      btnOperationType: "add",
      dictionaryDataTree: [],
      dictionaryLoading: true,
      addDictionarySaveShow: false,
      columns: [
        {
          align: "left",
          label: "字典名称",
          prop: "dictionarydataName"
        },
        {
          label: "字典键值",
          prop: "dictionarydataValue"
        },
        // {
        //   label: "是否启用",
        //   prop: "isEnable",
        //   render: (h, param) => {
        //     return (
        //       <div>
        //         <el-switch v-model={param.row.isEnable} disabled></el-switch>
        //       </div>
        //     );
        //   }
        // },
        {
          label: "排序",
          prop: "orderId"
        },
        {
          align: "left",
          label: "描述",
          prop: "description"
        }
      ],
      rules: {
        dictionarydataName: [
          { required: true, message: "字典名称是必须的", trigger: "blur" }
        ],
        dictionarydataValue: [
          { required: true, message: "字典键值是必须的", trigger: "blur" }
        ],
        orderId: [
          { required: true, message: "字典排序是必须的", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getDictionary();
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.findex.formInline = {
        dictionarydataValue: "",
        dictionarydataName: "",
        dictionaryId: ""
      };
    });
  },
  methods: {
    renderContent(h, { node, data }) {
      return (
        <span class="custom-tree-node" style="font-size: 14px; color: #606266;">
          <span
            class={
              data.children.length > 0 ? "fa fa-folder" : "fa fa-file-text-o"
            }
            style="margin-right: 5px;"
          ></span>
          <span>{node.label}</span>
        </span>
      );
    },
    resetForm(self) {
      self.addForm = {
        dictionarydataName: "",
        dictionarydataValue: "",
        orderId: 0,
        isEnable: true,
        description: "",
        dictionaryId: ""
      };
    },
    addController(self) {
      if (!self.formInline.dictionaryId) {
        this.$message.error("请选择字典分类！");
        return false;
      }
      return true;
    },
    paramController(self) {
      return new Promise(resolve => {
        self.param = {
          ...self.param,
          dictionaryId: self.formInline.dictionaryId
        };
        resolve();
      });
    },
    addDictionarySave() {
      this.addDictionarySaveShow = true;
    },
    addDictionaryColse() {
      this.getDictionary();
    },
    async getDictionary() {
      const res = await resBaseDictionaryQueryTree();
      if (IS_OK === res.data.code) {
        this.dictionaryDataTree = res.data.data;
        this.dictionaryLoading = false;
      }
    },
    handleCictionaryName(obj) {
      const self = this.$refs.findex;
      self.formInline.dictionaryId = obj.dictionaryId;
      self.clickQuery();
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
  }
}
</style>
