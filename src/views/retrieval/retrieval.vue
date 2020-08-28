<template>
  <div class="app-main-wrapper">
    <form-base
      ref="findex"
      primaryId="id"
      query-interface="ddc/esDocSearch/page"
      query-one-interface="base/role/info"
      save-interface="base/role/save"
      update-interface="base/role/update"
      delete-interface="base/role/delete"
      @current-change="currentChange"
      :columns="columns"
      :uid.sync="uid"
      noAddBtn
      noEditBtn
      noDeleteBtn
      noViewBtn
    >
      <template slot="searchForm" slot-scope="data">
        <el-form-item prop="keyword">
          <el-input v-model="data.formInline.keyword" size="small" placeholder="请输入关键字查询" clearable></el-input>
        </el-form-item>
      </template>
      <template slot="toolbar">
        <el-button icon="el-icon-view" type="primary" size="small" @click="retrievalPreviewBtn">详情</el-button>
        <el-button
          icon="el-icon-download"
          type="danger"
          size="small"
          @click="retrievalDownloadBtn"
        >下载</el-button>
      </template>
    </form-base>
    <a-el-dialog :visible.sync="projectDialog" title="项目文档详情">
      <el-form
        ref="addForm"
        :model="projectAddForm"
        label-width="160px"
        size="small"
        class="demo-form-inline"
        :disabled="disabled"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属项目">
              <el-input v-model="projectAddForm.projectName" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属目录">
              <el-input v-model="projectAddForm.folderName" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="文档名称">
              <el-input v-model="projectAddForm.docName" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文件名称">
              <el-input v-model="projectAddForm.fileName" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="锁定状态">
              <el-input v-model="projectAddForm.lockStatus" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检入状态">
              <el-input v-model="projectAddForm.checkoutStatus" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="创建者">
              <el-input v-model="projectAddForm.createUserId" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-input v-model="projectAddForm.createTime" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="更新者">
              <el-input v-model="projectAddForm.modifyUserId" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="更新时间">
              <el-input v-model="projectAddForm.modifyTime" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="锁定者">
              <el-input v-model="projectAddForm.lockUserId" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="锁定时间">
              <el-input v-model="projectAddForm.lockTime" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="版本">
              <el-input v-model="projectAddForm.version" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="文档描述">
              <el-input v-model="projectAddForm.docDesc" :rows="5" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="版本描述">
              <el-input v-model="projectAddForm.versionDesc" :rows="5" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template slot="footer">
        <el-button type="default" size="small" @click="projectDialog=false">取消</el-button>
      </template>
    </a-el-dialog>
    <a-el-dialog :visible.sync="knowledgeDialog" title="知识文档详情">
      <el-form
        ref="addForm"
        :model="knowledgeAddForm"
        label-width="160px"
        size="small"
        class="demo-form-inline"
        :disabled="disabled"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="标题">
              <el-input v-model="projectAddForm.userName" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属分类">
              <el-input v-model="projectAddForm.userName" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否下载">
              <el-input v-model="projectAddForm.userName" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作者">
              <el-input v-model="projectAddForm.userName" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="文件ID">
              <el-input v-model="projectAddForm.userName" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文件名称">
              <el-input v-model="projectAddForm.userName" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="文件大小">
              <el-input v-model="projectAddForm.userName" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="扩展名">
              <el-input v-model="projectAddForm.userName" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="创建者">
              <el-input v-model="projectAddForm.userName" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-input v-model="projectAddForm.userName" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="更新者">
              <el-input v-model="projectAddForm.userName" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="更新时间">
              <el-input v-model="projectAddForm.userName" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="浏览次数">
              <el-input v-model="projectAddForm.userName" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下载次数">
              <el-input v-model="projectAddForm.userName" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="文档描述">
              <el-input v-model="projectAddForm.userName" :rows="5" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template slot="footer">
        <el-button type="default" size="small" @click="knowledgeDialog=false">取消</el-button>
      </template>
    </a-el-dialog>
  </div>
</template>

<script type="text/jsx">
import FormBase from "../../components/FormBase.vue";
import AElDialog from "../../components/Dialog/AElDialog";
import { resEsDocSearchPage, resDdcDocumentInfo } from "../../api/ddc";
import { IS_OK, UPLOAD_FILE_DOWNLOAD } from "../../api/path";
import { mapGetters } from "vuex";
export default {
  name: "retrieval",
  components: {
    FormBase,
    AElDialog
  },
  data() {
    return {
      uid: "",
      projectDialog: false, // 项目文档详情
      projectAddForm: {
        userName: ""
      },
      knowledgeDialog: false, // 知识文档详情
      knowledgeAddForm: {},
      columns: [
        {
          prop: "docName",
          align: "center",
          label: "名称"
        },
        {
          prop: "fileName",
          align: "center",
          label: "文件名称"
        },
        {
          prop: "docDesc",
          align: "center",
          label: "描述"
        },
        {
          prop: "uploader",
          label: "上传人",
          align: "center"
        },
        {
          prop: "uploadTime",
          label: "上传时间",
          align: "center"
        }
      ],
      dataObj: {},
      disabled: true
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.findex.formInline = {
        keyword: ""
      };
    });
  },
  computed: {
    ...mapGetters(["retrieval"])
  },
  watch: {
    retrieval() {
      this.$refs.findex.formInline.keyword = this.retrieval;
      this.$refs.findex.clickQuery();
    }
  },
  methods: {
    async queryController(self, params) {
      const res = await resEsDocSearchPage(params);
      if (res.data.code === IS_OK) {
        self.dataArray = res.data.data.list;
        this.dataArray = res.data.data.list;
      }
    },
    currentChange(uid, val) {
      this.uid = uid;
      this.dataObj = val;
    },
    retrievalPreviewBtn() {
      if (this.uid) {
        if (this.dataObj.type == 1) {
          this.getType1(this.dataObj.documentId);
        } else if (this.dataObj.type == 2) {
          this.knowledgeDialog = true;
        }
      } else {
        this.$message({
          message: "您没有选中任何数据项,请选中后再操作！",
          type: "warning"
        });
      }
    },
    retrievalDownloadBtn() {
      if (this.uid) {
        if (this.dataObj.type == 1) {
          this.downType1(this.dataObj.fileId);
        }
      } else {
        this.$message({
          message: "您没有选中任何数据项,请选中后再操作！",
          type: "warning"
        });
      }
    },
    async getType1(id) {
      const res = await resDdcDocumentInfo(id);
      if (res.data.code === IS_OK) {
        this.projectDialog = true;
        if (res.data.data.lockStatus) {
          res.data.data.lockStatus = "已锁";
        } else {
          res.data.data.lockStatus = "未锁";
        }
        if (res.data.data.checkoutStatus) {
          res.data.data.checkoutStatus = "已检入";
        } else {
          res.data.data.checkoutStatus = "未检入";
        }
        this.projectAddForm = res.data.data;
      }
    },
    downType1(fileId) {
      if (fileId) {
        window.location.href = UPLOAD_FILE_DOWNLOAD + fileId;
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
