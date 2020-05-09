<template>
  <div>
    <uploader
      ref="uploader"
      :key="key"
      :options="options"
      :autoStart="autoStart"
      @file-progress="onFileProgress"
      @file-added="onFileAdded"
      @file-success="onFileSuccess"
      @file-error="onFileError"
      :fileStatusText="statusText"
      class="uploader-app"
    >
      <div class="file-panel" v-if="fileList.length>0">
        <ul class="el-upload-list el-upload-list--text">
          <li class="el-upload-list__item is-success" v-for="file in fileList" :key="file.id">
            <a class="el-upload-list__item-name">
              <i class="el-icon-document"></i>
              {{file.name}}
            </a>
            <label class="el-upload-list__item-status-label">
              <i class="el-icon-upload-success el-icon-circle-check"></i>
            </label>
            <i class="el-icon-close" @click="handleClickFileClose(file.id)"></i>
          </li>
        </ul>
      </div>
      <uploader-btn
        :id="'global-uploader-btn'+key"
        class="global-uploader-btn"
        :attrs="attrs"
        ref="uploadBtn"
      >选择文件</uploader-btn>
    </uploader>
  </div>
</template>

<script>
import request from "../../api/config";
import SparkMD5 from "spark-md5";
import { IS_OK } from "../../api/path";
import { v4 as uuidv4 } from "uuid";
export default {
  name: "globalUploader",
  props: {
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fileList: [],
      key: uuidv4(),
      autoStart: false,
      options: {
        target: "http://172.18.1.72:10010/api/filesystem/file/chunkUpload/vue",
        chunkSize: "20480000", //分片大小
        fileParameterName: "file",
        maxChunkRetries: 3, //最大自动失败重试上传次数
        simultaneousUploads: 1, // 并发数量
        testChunks: true,
        checkChunkUploadedByResponse: function(chunk, message) {
          let objMessage = JSON.parse(message);
          if (objMessage.skipUpload) {
            return true;
          }
          return (objMessage.uploaded || []).indexOf(chunk.offset + 1) >= 0;
        },
        query: {
          vrId: uuidv4(),
          checkId: uuidv4()
        }
      },
      attrs: {
        accept: "*"
      },
      statusText: {
        success: "成功了",
        error: "出错了",
        uploading: "上传中",
        paused: "暂停中",
        waiting: "等待中"
      }
    };
  },
  methods: {
    openUploader() {
      if (this.$refs.uploadBtn) {
        if (!this.multiple) {
          this.$refs.uploadBtn.$el.children[0].multiple = false;
        }
        document.querySelector("#global-uploader-btn" + this.key).click();
      }
    },
    // 上传前md5校验
    async checkFileExist(fileNameCode) {
      const res = await request(
        `/api/filesystem/file/checkFileExist/${fileNameCode}`,
        {},
        "GET"
      );
      if (res.data.code !== IS_OK) {
        this.$message({
          message: res.data.msg,
          type: "error"
        });
      }
    },
    onFileAdded(file) {
      if (!this.multiple) {
        this.fileList = [];
        this.fileList.push(file);
      } else {
        this.fileList.push(file);
      }
      let fileNameCode = SparkMD5.ArrayBuffer.hash(file.name);
      this.checkFileExist(fileNameCode);
      this.$emit("file-change", file);
      this.computeMD5(file);
    },
    onFileProgress(rootFile, file, chunk) {
      this.$emit("file-progress", rootFile, file, chunk);
    },
    onFileSuccess(rootFile, file, response) {
      let res = JSON.parse(response);
      this.$emit("file-success", file, res);
      if (res.code !== IS_OK) {
        this.$message({ message: res.msg, type: "error" });
        return;
      }
    },
    onFileError(rootFile, file, response, chunk) {
      this.$emit("file-error", rootFile, file, response, chunk);
      this.$message({
        message: response,
        type: "error"
      });
    },
    /**
     * 计算md5，实现断点续传及秒传
     * @param file
     */
    computeMD5(file) {
      let fileReader = new FileReader();
      let md5 = "";
      file.pause();
      fileReader.readAsArrayBuffer(file.file);
      fileReader.onload = e => {
        if (file.size != e.target.result.byteLength) {
          this.error(
            "Browser reported success but could not read the file until the end."
          );
          return;
        }
        md5 = SparkMD5.ArrayBuffer.hash(e.target.result);
        // 添加额外的参数
        /*this.uploader.opts.query = {
              ...this.params
          }*/
        file.uniqueIdentifier = md5;
        file.resume();
      };
      fileReader.onerror = function() {
        this.error(
          "FileReader onerror was triggered, maybe the browser aborted due to high memory usage."
        );
      };
    },
    error(msg) {
      this.$notify({
        title: this.$t("c.false"),
        message: msg,
        type: "error",
        duration: 2000
      });
    },
    handleClickFileClose(id) {
      this.fileList.map((item, index) => {
        if (item.id === id) {
          this.fileList.splice(index, 1);
        }
      });
    },
    reset() {
      this.fileList = [];
    }
  }
};
</script>

<style scoped lang="stylus">
.file-panel {
  margin-top: 10px;

  .file-title {
    display: flex;
    height: 40px;
    line-height: 40px;
    padding: 0 15px;
    border-bottom: 1px solid #ddd;

    .operate {
      flex: 1;
      text-align: right;
    }
  }

  .file-list {
    list-style: none;
  }

  .file-list-item {
    list-style: none;
  }
}

/* 隐藏上传按钮 */
.global-uploader-btn {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}
</style>
