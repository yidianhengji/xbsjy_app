<template>
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
          primaryId="workdirId"
          query-interface="ddc/workspacedir/page"
          query-one-interface="ddc/workspacedir/info"
          save-interface="ddc/workspacedir/postFileRelativePath"
          update-interface="ddc/workspacedir/update"
          delete-interface="ddc/workspacedir/delete"
          @current-change="currentChange"
          :param-controller="paramController"
          :columns="columns"
          :uid.sync="uid"
          :rules="rules"
          :reset-form="resetForm"
          noEditBtn
          noAddBtn
          isDefaultQuery
          noSearchForm
        ></form-base>
      </div>
    </div>
  </div>
</template>

<script type="text/jsx">
import FormBase from "../../../components/FormBase.vue";
import LeftTree from "../../../components/Tree/leftTree";
import {
  resWorkspacedirQueryTree,
  resWorkspacedirVerifyDuplicateFile
} from "../../../api/ddc";
import { IS_OK } from "../../../api/path";
import { mixinMethodsDrag } from "../../../mixin/mixinMethodsDrag";

export default {
  name: "resources",
  mixins: [mixinMethodsDrag],
  components: {
    FormBase,
    LeftTree
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
          prop: "workdirName",
          label: "目录名称",
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
      treeObj: {}
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
        upWorkdirId: ""
      };
    });
  },
  methods: {
    fileSuccess(file, res, relativePaths, fileIds) {
      const self = this.$refs.findex;
      self.addForm.relativePaths = relativePaths;
      self.addForm.fileIds = fileIds;
    },
    paramController(self) {
      return new Promise(resolve => {
        let isFlag = this.getDuplicateFile(self.addForm);
        if (isFlag) {
          resolve();
        }
      });
    },
    async getDuplicateFile(param) {
      const res = await resWorkspacedirVerifyDuplicateFile(param);
      if (res.data.code === IS_OK) {
        return true;
      } else {
        return false;
      }
    },
    // 获取环境变量类型
    async getEnvironmentVariableType() {
      const res = await resWorkspacedirQueryTree();
      if (res.data.code === IS_OK) {
        this.leftDataTree = res.data.data;
      }
    },
    queryBtn() {
      this.$refs.findex.clickQuery();
    },
    resetForm(self) {
      self.addForm = {
        rootPath: "",
        rootPathValue: "",
        relativePaths: [],
        fileIds: []
      };
      if (this.treeObj.id) {
        self.addForm.rootPath = this.treeObj.relativePath;
        self.addForm.rootPathValue = this.treeObj.workdirName;
      }
      this.selectIndex = null;
    },

    handleProjectName(obj) {
      const self = this.$refs.findex;
      self.uid = "";
      self.formInline.upWorkdirId = obj.id;
      this.treeObj = obj;
      self.clickQuery();
    },
    currentChange(val) {
      this.uid = val;
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
