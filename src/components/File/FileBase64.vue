<template>
  <el-upload
    class="avatat-uploader"
    accept="image/png, image/jpg, image/jpeg, image/gif"
    :headers="headers"
    :show-file-list="false"
    :action="''"
    :on-success="upload"
    :on-error="error"
    :before-upload="beforeAvatarUpload"
    name="file"
    abort
    :http-request="httpRequest"
    ref="file"
  >
    <img v-if="value" :src="imgUrl" class="avatar" />
    <i class="el-icon-plus avatar-uploader-icon" v-else></i>
  </el-upload>
</template>

<script>
import { UPLOAD_FILE_PATH } from "../../api/path";
export default {
  name: "FileBase64",
  props: {
    value: String
  },
  data() {
    return {
      imgUrl: "",
      path: UPLOAD_FILE_PATH,
      headers: {
        uid: localStorage.getItem("uid")
      }
    };
  },
  methods: {
    beforeAvatarUpload(file) {
      this.httpRequest1(file);
    },
    httpRequest() {},
    error() {
      this.$alert("上传失败!请联系管理员", "温馨提示", { type: "warning" });
    },
    upload(data) {
      if (1 === data.code) {
        this.imgUrl = UPLOAD_FILE_PATH + data.data.fullPath;
        this.$emit("input", data.data.fullPath);
      } else {
        this.imgUrl = UPLOAD_FILE_PATH + data.data.fullPath;
        this.$emit("input", "/" + data.data.fullPath);
      }
    },
    clear() {
      this.$refs.file.clearFiles();
    },
    httpRequest1(options) {
      var that = this;
      // 获取文件对象
      let file = options;
      //判断图片类型
      if (
        file.type == "image/jpeg" ||
        file.type == "image/png" ||
        file.type == "image/JPG"
      ) {
        var isJPG = true;
      } else {
        isJPG = false;
      }
      // 判断图片大小
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传产品图片只能是 JPG/PNG/JPEG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传产品图片大小不能超过 2MB!");
      }
      // 创建一个HTML5的FileReader对象
      var reader = new FileReader();
      //创建一个img对象
      var img = new Image();
      if (file) {
        reader.readAsDataURL(file);
      }
      if (isJPG && isLt2M) {
        reader.onload = e => {
          img.src = e.target.result;
          // base64地址图片加载完毕后执行
          img.onload = function() {
            // 缩放图片需要的canvas（也可以在DOM中直接定义canvas标签，这样就能把压缩完的图片不转base64也能直接显示出来）
            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");
            // 图片原始尺寸
            var originWidth = this.width;
            var originHeight = this.height;
            // 最大尺寸限制，可通过设置宽高来实现图片压缩程度
            var maxWidth = 300,
              maxHeight = 300;
            // 目标尺寸
            var targetWidth = originWidth,
              targetHeight = originHeight;
            // 图片尺寸超过最大尺寸的限制
            if (originWidth > maxWidth || originHeight > maxHeight) {
              if (originWidth / originHeight > maxWidth / maxHeight) {
                // 更改宽度，按照宽度限定尺寸
                targetWidth = maxWidth;
                targetHeight = Math.round(
                  maxWidth * (originHeight / originWidth)
                );
              } else {
                targetHeight = maxHeight;
                targetWidth = Math.round(
                  maxHeight * (originWidth / originHeight)
                );
              }
            }
            //对图片进行缩放
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            // 清除画布
            context.clearRect(0, 0, targetWidth, targetHeight);
            // 图片压缩
            context.drawImage(img, 0, 0, targetWidth, targetHeight);
            /*第一个参数是创建的img对象；第二三个参数是左上角坐标，后面两个是画布区域宽高*/
            //压缩后的base64文件
            var newUrl = canvas.toDataURL("image/jpeg", 0.92);
            that.imgUrl = newUrl;
          };
        };
      }
    }
  },
  watch: {
    value(val) {
      this.imgUrl = val;
    },
    imgUrl(val) {
      this.$emit("input", val);
      this.$emit("file-change", val);
    }
  }
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader-icon {
  border: 1px solid #eee;
}
</style>
