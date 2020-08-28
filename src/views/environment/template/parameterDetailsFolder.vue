<template>
  <a-el-dialog :visible.sync="visible" title="选择资源" :beforeClose="beforeClose">
    <div class="box">
      <div class="left">
        <div class="left-title">资源目录</div>
        <div class="left-body">
          <left-tree
            :treedata="leftDataTree"
            label="workdirName"
            :single="true"
            node-key="id"
            ref="tree"
            @nodeClick="handleProjectName"
          ></left-tree>
        </div>
      </div>
      <div class="y-hander"></div>
      <div class="right">
        <div class="app-main-wrapper">
          <form-base
            ref="findex"
            primaryId="workdirFileId"
            query-interface="ddc/workspacedirfile/page"
            query-one-interface="ddc/workspacedir/info"
            save-interface="ddc/workspacedir/postFileRelativePath"
            update-interface="ddc/workspacedir/update"
            delete-interface="ddc/workspacedir/delete"
            @current-change="currentChange"
            :columns="columns"
            :uid.sync="uid"
            :rules="rules"
            noEditBtn
            noAddBtn
            noDeleteBtn
            noFormInlineBase
          ></form-base>
        </div>
      </div>
    </div>
    <template slot="footer">
      <el-button type="primary" size="small" @click="saveparameter">确定</el-button>
      <el-button type="default" size="small" @click="beforeClose">取消</el-button>
    </template>
  </a-el-dialog>
</template>

<script type="text/jsx">
import AElDialog from "../../../components/Dialog/AElDialog";
import FormBase from "../../../components/FormBase.vue";
import LeftTree from "../../../components/Tree/leftTree";
import { resWorkspacedirQueryTree } from "../../../api/ddc";
import { IS_OK } from "../../../api/path";
import { mixinMethodsDrag } from "../../../mixin/mixinMethodsDrag";

export default {
  name: "parameterDetailsFolder",
  mixins: [mixinMethodsDrag],
  components: {
    FormBase,
    LeftTree,
    AElDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    value: {
      type: String
    },
    uidObj: {
      type: Object
    }
  },
  data() {
    return {
      // 左边树
      leftDataTree: [],
      uid: "",
      mapDialogVisible: false,
      dataArray: [],
      rules: {
        rootPath: [
          { required: true, message: "请选择所属目录", trigger: "change" }
        ]
      },
      columns: [
        {
          prop: "workdirFileName",
          label: "文件名称",
          align: "left"
        },
        {
          prop: "createTime",
          label: "创建时间"
        },
        {
          prop: "createUserId",
          label: "创建人"
        }
      ],
      isTrue: false,
      startX: 0,
      treeObj: {},
      objRow: {}
    };
  },
  created() {
    // 获取环境变量类型
    this.getEnvironmentVariableType();
    // 软件版本
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.findex.formInline = {
        workdirId: ""
      };
    });
  },
  methods: {
    // 获取环境变量类型
    async getEnvironmentVariableType() {
      const res = await resWorkspacedirQueryTree({workspaceId: this.uidObj.workspaceId});
      if (res.data.code === IS_OK) {
        this.leftDataTree = res.data.data;
      }
    },
    queryBtn() {
      this.$refs.findex.clickQuery();
    },
    handleProjectName(obj) {
      const self = this.$refs.findex;
      self.uid = "";
      self.formInline.workdirId = obj.id;
      this.treeObj = obj;
      this.objRow = {};
      self.clickQuery();
    },
    currentChange(val, obj) {
      this.uid = val;
      this.objRow = obj;
    },
    beforeClose() {
      this.$emit("update:visible", false);
    },
    saveparameter() {
      if (JSON.stringify(this.objRow) !== "{}") {
        this.$emit("update:value", this.objRow.workdirFileRelativepath);
        this.$emit(
          "workspaceVariatevalue-change",
          this.objRow.workdirFileRelativepath
        );
      } else {
        if (JSON.stringify(this.treeObj) !== "{}") {
          this.$emit("update:value", this.treeObj.relativePath);
          this.$emit("workspaceVariatevalue-change", this.treeObj.relativePath);
        }
      }
      this.$emit("update:visible", false);
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
    background: #fff;
    box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.2);
    border: 1px solid #eee;
    width: 260px;

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

.app-main-wrapper {
  height: 600px;
}
</style>
