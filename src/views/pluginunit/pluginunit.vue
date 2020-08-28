<template>
  <div class="app-main-wrapper">
    <form-base
      ref="findex"
      primaryId="pluginId"
      rowKey="pluginId"
      query-interface="ddc/plugin/page"
      query-one-interface="ddc/plugin/info"
      save-interface="ddc/plugin/save"
      update-interface="ddc/plugin/update"
      delete-interface="ddc/plugin/delete"
      :columns="columns"
      :rules="rules"
      :uid.sync="uid"
      @current-change="currentChange"
      :reset-controller="resetController"
      :reset-form="resetForm"
      noViewBtn
    >
      <template slot="searchForm" slot-scope="data">
        <el-form-item prop="keyword">
          <el-input v-model="data.formInline.keyword" size="small" placeholder="请输入关键字" clearable></el-input>
        </el-form-item>
      </template>
      <template slot="toolbar">
        <el-button
          icon="el-icon-download"
          type="primary"
          size="small"
          @click="retrievalDownloadBtn"
        >下载</el-button>
      </template>
      <template slot="add" slot-scope="data">
        <el-form-item label="上传文件">
          <big-files ref="bigFiles4" @file-success="fileSuccess"></big-files>
        </el-form-item>
        <el-form-item label="插件名称" prop="pluginName">
          <el-input v-model="data.addForm.pluginName"></el-input>
        </el-form-item>
        <el-form-item label="插件类型" prop="pluginType">
          <el-select v-model="data.addForm.pluginType" style="width: 100%;">
            <el-option
              v-for="(item, index) in selectData"
              :label="item.dictionarydataName"
              :value="item.dictionarydataValue"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="插件版本" prop="pluginVersion">
          <el-input v-model="data.addForm.pluginVersion"></el-input>
        </el-form-item>
        <el-form-item label="是否最新" prop="isLast">
          <el-switch v-model="data.addForm.isLast"></el-switch>
        </el-form-item>
        <el-form-item label="插件版本描述" prop="pluginVersionDesc">
          <el-input v-model="data.addForm.pluginVersionDesc" :rows="5" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="插件描述" prop="pluginDesc">
          <el-input v-model="data.addForm.pluginDesc" :rows="5" type="textarea"></el-input>
        </el-form-item>
      </template>
    </form-base>
  </div>
</template>

<script type="text/jsx">
import FormBase from "../../components/FormBase";
import BigFiles from "../../components/BigFiles/BigFiles.vue";
import { PLUGINTYPE } from "../../util/constListCode";
import { resBaseDicNameByDicCode } from "@/api";
import { IS_OK, UPLOAD_FILE_DOWNLOAD } from "@/api/path";
export default {
  name: "pluginunit",
  components: {
    FormBase,
    BigFiles
  },
  data() {
    return {
      dataArray: [],
      selectData: [],
      rules: {
        pluginName: [
          { required: true, message: "插件名称不能为空", trigger: "blur" }
        ],
        pluginType: [
          { required: true, message: "插件类型不能为空", trigger: "change" }
        ]
      },
      uid: "",
      dataObj: {},
      columns: [
        {
          prop: "pluginName",
          label: "插件名称",
          align: "left"
        },
        {
          prop: "pluginType",
          label: "插件类型",
          align: "center",
          render: (h, param) => {
            let html = "";
            this.selectData.map(item => {
              if (item.dictionarydataValue == param.row.pluginType) {
                html = item.dictionarydataName;
              }
            });
            return <div>{html}</div>;
          }
        },
        {
          prop: "pluginVersion",
          label: "插件版本",
          align: "center"
        },
        {
          prop: "fileSize",
          label: "文件大小",
          align: "center"
        }
      ]
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.findex.formInline = {
        keyword: ""
      };
    });
  },
  created() {
    this.getPlugintype();
  },
  methods: {
    resetController() {
      this.$refs.bigFiles4.reset();
    },
    resetForm(self) {
      self.addForm = {
        pluginName: "",
        pluginType: "",
        pluginVersion: "",
        isLast: false,
        pluginVersionDesc: "",
        pluginDesc: "",
        fileId: "",
        fileSize: "",
        fileHashcode: ""
      };
      this.selectIndex = null;
    },
    currentChange(uid, val) {
      this.uid = uid;
      this.dataObj = val;
    },
    fileSuccess(file, res) {
      const self = this.$refs.findex;
      self.addForm.fileId = res.data.fileId;
      self.addForm.fileSize = file.size + "";
      self.addForm.fileHashcode = file.uniqueIdentifier;
    },
    async getPlugintype() {
      const res = await resBaseDicNameByDicCode({ dicCode: PLUGINTYPE });
      if (res.data.code === IS_OK) {
        this.selectData = res.data.data;
      }
    },
    retrievalDownloadBtn() {
      if (this.uid) {
        if (this.dataObj.fileId) {
          window.location.href = UPLOAD_FILE_DOWNLOAD + this.dataObj.fileId;
        }
      } else {
        this.$message({
          message: "您没有选中任何数据项,请选中后再操作！",
          type: "warning"
        });
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.app-main-wrapper {
  height: 100%;
}
</style>
