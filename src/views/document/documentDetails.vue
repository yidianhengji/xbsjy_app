<template>
  <el-form
    v-if="documentDetails"
    ref="documentDetails"
    :model="documentDetails"
    label-width="160px"
    :rules="documentDetailsRules"
    :disabled="'disabled'"
    size="small"
    class="demo-form-inline"
  >
    <el-row>
      <el-col :span="12">
        <el-form-item label="文档名称">
          <el-input v-model="documentDetails.docName"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="文件名称">
          <el-input v-model="documentDetails.fileName"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="版本">
          <el-input v-model="documentDetails.version"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="文档状态">
          <el-input v-model="documentDetails.lockStatus"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="创建者">
          <el-input v-model="documentDetails.createUserId"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="创建时间">
          <el-input v-model="documentDetails.createTime"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="更新者">
          <el-input v-model="documentDetails.modifyUserId"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="更新时间">
          <el-input v-model="documentDetails.modifyTime"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="检出者">
          <el-input v-model="documentDetails.checkoutUserName"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="检出时间">
          <el-input v-model="documentDetails.checkoutTime"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="锁定者">
          <el-input v-model="documentDetails.lockUserId"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="锁定时间">
          <el-input v-model="documentDetails.lockTime"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="文档描述">
      <el-input
        v-model="documentDetails.docDesc"
        :rows="5"
        type="textarea"
      ></el-input>
    </el-form-item>
    <el-form-item label="版本描述">
      <el-input
        v-model="documentDetails.versionDesc"
        :rows="5"
        type="textarea"
      ></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    documentDetails: {
      type: Object
    }
  },
  data() {
    return {
      documentDetailsRules: {}
    };
  }
};
</script>
