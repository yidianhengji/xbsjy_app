<template>
  <div class="app-main-wrapper">
    <form-base
      ref="findex"
      primaryId="projectId"
      rowKey="projectId"
      query-interface="ddc/project/page"
      query-one-interface="ddc/project/info"
      save-interface="ddc/project/save"
      update-interface="ddc/project/update"
      delete-interface="ddc/project/delete"
      :query-controller="queryController"
      @current-change="currentChange"
      :reset-controller="resetController"
      :columns="columns"
      :rules="rules"
      :uid.sync="uid"
      :reset-form="resetForm"
    >
      <template slot="searchForm" slot-scope="data">
        <el-form-item label="族库名称" prop="keyword">
          <el-input v-model="data.formInline.keyword" size="small" placeholder="请输入族库名称" clearable></el-input>
        </el-form-item>
      </template>
      <template slot="toolbar">
        <el-dropdown style="margin-left: 5px;">
          <el-button type="primary" size="small">
            更多操作
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="powerBtn">权限</el-dropdown-item>
            <el-dropdown-item @click.native="logBtn">操作日志</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <template slot="add" slot-scope="data">
        <!-- <el-form-item label="上级族库" prop="upprojectId">
          <a-eltree-select
            :treedata.sync="dataArray"
            label="projectName"
            node-key="projectId"
            :defaultExpandAll="false"
            :value.sync="data.addForm.upprojectId"
          ></a-eltree-select>
        </el-form-item> -->
        <el-form-item label="族库编号" prop="projectCode">
          <el-input v-model="data.addForm.projectCode"></el-input>
        </el-form-item>
        <el-form-item label="族库名称" prop="projectName">
          <el-input v-model="data.addForm.projectName"></el-input>
        </el-form-item>
        <el-form-item label="族库类型" prop="projectType">
          <el-select v-model="data.addForm.projectType">
            <el-option
              v-for="(item, index) in projectTypeList"
              :label="item.dictionarydataName"
              :value="item.dictionarydataValue"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="建设单位" prop="constructionUnit" v-if="!ifTrue">
          <el-input v-model="data.addForm.constructionUnit"></el-input>
        </el-form-item>
        <el-form-item label="设计单位" prop="designUnit" v-if="!ifTrue">
          <el-input v-model="data.addForm.designUnit"></el-input>
        </el-form-item>
        <el-form-item label="设计单位负责人" prop="designunitLeader">
          <el-input v-model="data.addForm.designunitLeader"></el-input>
        </el-form-item>
        <el-form-item label="设计单位技术负责人" prop="designTechnicaldirector">
          <el-input v-model="data.addForm.designTechnicaldirector"></el-input>
        </el-form-item>
        <el-form-item label="经度" prop="longitude" v-if="!ifTrue">
          <el-input v-model="data.addForm.longitude"></el-input>
        </el-form-item>
        <el-form-item label="纬度" prop="latitude" v-if="!ifTrue">
          <el-row>
            <el-col :span="22">
              <el-input v-model="data.addForm.latitude"></el-input>
            </el-col>
            <el-col :span="2" style="text-align: right;">
              <el-button type="primary" @click="latitudeDialog">选择</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="排序" prop="orderId">
          <el-input-number v-model="data.addForm.orderId" size="small" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="族库描述" prop="projectDesc">
          <el-input v-model="data.addForm.projectDesc" :rows="5" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="效果图" prop="renderingsFileid">
          <file-many ref="fileMany" v-model="data.addForm.renderingsFileid"></file-many>
        </el-form-item>
      </template>
    </form-base>

    <a-el-dialog :visible.sync="mapDialogVisible" title="族库定位" width="40%">
      <div class="amap-wrapper">
        <el-amap vid="amapDemo" :zoom="zoom" :center="center" :events="events" class="amap-demo">
          <el-amap-marker v-if="markers" :position="markers.position" :vid="indexId"></el-amap-marker>
        </el-amap>
      </div>
      <template slot="footer">
        <div
          v-if="markers"
          style="float: left;color: #333;"
        >经度：{{ markers.position[0] }} 纬度：{{ markers.position[1] }}</div>
        <el-button type="primary" size="mini" @click="mapSubmit">确定</el-button>
        <el-button type="info" size="mini" @click="mapClear">清除</el-button>
        <el-button type="default" size="mini" @click="mapClose">取消</el-button>
      </template>
    </a-el-dialog>

    <a-e-power
      :visible.sync="powerDialogVisible"
      title="族库权限"
      :uid="uid"
      primaryId="projectId"
      :user-list="authusers"
      :codeName="codeName"
      delete-auth-users="ddc/projectauthority/deleteAuthUsers"
      save-interface="ddc/projectauthority/save"
      query-one-interface="ddc/projectauthority/queryProAuthOfUser"
      :checkDataList="checkDataList"
      type="project"
    ></a-e-power>

    <log v-if="logDialogVisible" :visible.sync="logDialogVisible" :uid="uid"></log>
  </div>
</template>

<script type="text/jsx">
import FormBase from "../../components/FormBase.vue";
// import AEltreeSelect from "../../components/Dialog/AEltreeSelect.vue";
import AElDialog from "../../components/Dialog/AElDialog.vue";
import AEPower from "../../components/Dialog/AEPower.vue";
import FileMany from "../../components/File/FileMany.vue";
import Log from "../../components/Log/Log.vue";
import { resDdcProjectQueryTree, proListAuthUsers } from "../../api/ddc";
import { IS_OK } from "../../api/path";
import VueAMap from "vue-amap";
import { PROJECT_TYPE, PROJECT_POWER } from "../../util/constListCode";
import { KEY, PLUGIN, VERSION } from "../../util/mapConfig";
import { resBaseDicNameByDicCode } from "../../api";
import { v4 as uuidv4 } from "uuid";
import { mixinProject } from "./project";
VueAMap.initAMapApiLoader({
  key: KEY,
  plugin: PLUGIN,
  v: VERSION
});
export default {
  name: "familyLibrary",
  mixins: [mixinProject],
  components: {
    FormBase,
    AElDialog,
    // AEltreeSelect,
    AEPower,
    FileMany,
    Log
  },
  data() {
    return {
      ifTrue: true,
      indexId: uuidv4(),
      uid: "",
      vid: "amap-vue",
      zoom: 12,
      center: [113, 28.21],
      markers: null,
      events: {
        click: e => {
          let marker = {
            position: [e.lnglat.lng, e.lnglat.lat]
          };
          this.markers = marker;
        }
      },
      mapDialogVisible: false,
      powerDialogVisible: false,
      codeName: PROJECT_POWER,
      dataArray: [],
      projectTypeList: [],
      logDialogVisible: false,
      rules: {
        projectCode: [
          { required: true, message: "请输入族库编号", trigger: "blur" }
        ],
        projectName: [
          { required: true, message: "请输入族库名称", trigger: "blur" }
        ],
        projectType: [
          { required: true, message: "请选择族库类型", trigger: "change" }
        ]
      },
      columns: [
        {
          prop: "projectName",
          label: "族库名称",
          align: "left",
          width: 300
        },
        {
          prop: "proTypeName",
          label: "族库类型",
          align: "left"
        },
        {
          prop: "projectCode",
          label: "族库编号",
          align: "left"
        },
        // {
        //   prop: "constructionUnit",
        //   label: "建设单位",
        //   align: "left"
        // },
        // {
        //   prop: "designUnit",
        //   label: "设计单位",
        //   align: "left"
        // },
        {
          prop: "designunitLeader",
          label: "设计单位负责人",
          align: "left"
        },
        {
          prop: "designTechnicaldirector",
          label: "设计单位技术负责人",
          align: "left"
        }
      ],
      authusers: [],
      // checkDataList: [
      //   { dictionarydataValue: "1", dictionarydataName: "查看" },
      //   { dictionarydataValue: "2", dictionarydataName: "新增目录" },
      //   { dictionarydataValue: "3", dictionarydataName: "修改" },
      //   { dictionarydataValue: "4", dictionarydataName: "删除" },
      //   { dictionarydataValue: "10", dictionarydataName: "设置权限" }
      // ]
    };
  },
  created() {
    this.getProjectType();
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.findex.formInline = {
        keyword: ""
      };
    });
  },
  methods: {
    resetForm(self) {
      self.addForm = {
        upprojectId: "",
        projectCode: "",
        projectName: "",
        projectType: "",
        constructionUnit: "",
        designUnit: "",
        designunitLeader: "",
        designTechnicaldirector: "",
        longitude: "",
        latitude: "",
        orderId: 0,
        projectDesc: "",
        renderingsFileid: "",
        category: 2
      };
      this.selectIndex = null;
    },
    //查询授权人人员
    async listAuthUsers(projectId) {
      const res = await proListAuthUsers(projectId);
      if (res.data.code === IS_OK) {
        this.authusers = res.data.data;
      }
    },
    async queryController(self) {
      let params = {
        category: 2,
        ...self.formInline
      };
      const res = await resDdcProjectQueryTree(params);
      if (res.data.code === IS_OK) {
        self.dataArray = res.data.data;
        this.dataArray = res.data.data;
      }
    },
    async getProjectType() {
      const res = await resBaseDicNameByDicCode({ dicCode: PROJECT_TYPE });
      if (res.data.code === IS_OK) {
        this.projectTypeList = res.data.data;
      }
    },
    resetController() {
      this.$refs.fileMany.reset();
    },
    // 族库定位
    latitudeDialog() {
      if (
        this.$refs.findex.addForm.longitude &&
        this.$refs.findex.addForm.latitude
      ) {
        let marker = {
          position: [
            this.$refs.findex.addForm.longitude,
            this.$refs.findex.addForm.latitude
          ]
        };
        this.markers = marker;
      }
      this.mapDialogVisible = true;
    },
    mapSubmit() {
      if (this.markers) {
        this.$refs.findex.addForm.longitude = this.markers.position[0];
        this.$refs.findex.addForm.latitude = this.markers.position[1];
      } else {
        this.$refs.findex.addForm.longitude = "";
        this.$refs.findex.addForm.latitude = "";
      }
      this.mapDialogVisible = false;
    },
    mapClear() {
      this.markers = null;
    },
    mapClose() {
      this.mapDialogVisible = false;
    },
    currentChange(val) {
      this.uid = val;
    },
    powerBtn() {
      if (this.uid) {
        this.listAuthUsers(this.uid);
        this.powerDialogVisible = true;
      } else {
        this.$message({
          message: "您没有选中任何数据项,请选中后再操作！",
          type: "warning"
        });
      }
    },
    logBtn() {
      if (this.uid) {
        this.logDialogVisible = true;
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
.amap-wrapper {
  width: 100%;
  height: 400px;
}

.app-main-wrapper {
  height: 100%;
}
</style>
