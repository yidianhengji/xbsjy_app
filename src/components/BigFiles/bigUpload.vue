<template>
  <div >
    <uploader
      ref="uploader"
      :options="options"
      :file-status-text="statusText"
      :autoStart="false"
      @file-added="onFileAdded"
      @file-success="onFileSuccess"
      @file-progress="onFileProgress"
      @file-error="onFileError"
      @complete="complete"
      class="uploader-example">
    </uploader>
  </div>
</template>

<script>
  import axios from 'axios'
  import qs from 'qs'
  // import SparkMD5 from 'spark-md5'

  export default {
    data() {
      return {
        options: {
          target: 'http://172.18.1.85:8081/boot/uploader/chunk',
          fileParameterName: 'file',
          testChunks: true,
          simultaneousUploads: 1,
          chunkSize: 20 * 1024 * 1024,
          checkChunkUploadedByResponse: function (chunk, message) {
            let objMessage = JSON.parse(message)
            console.log([].indexOf() + 1)
            if (objMessage.skipUpload) {
              return true
            }

            return (objMessage.uploaded || []).indexOf(chunk.offset + 1) >= 0

          },
          query: {
            vrId: 'vrId:121212sadas2ds1a2s1d2'
          },
        },
        attrs: {
          accept: 'image/*'
        },
        statusText: {
          success: '成功了',
          error: '出错了',
          uploading: '上传中',
          paused: '暂停中',
          waiting: '等待中'
        }
      }
    },
    methods: {
      onFileAdded(file) {
        this.$emit('fileAdded')
        file.pause()
        // this.computeMD5(file)
      },
      onFileProgress(rootFile, file, chunk) {
        console.log(`上传中 ${file.name}，chunk：${chunk.startByte / 1024 / 1024} ~ ${chunk.endByte / 1024 / 1024}`)
      },
      onFileSuccess(rootFile, file, response, chunk) {
        this.$emit('FileSuccess')
        let res = JSON.parse(response)
        // 服务器自定义的错误，这种错误是Uploader无法拦截的
        if (!res.msg) {
          this.$message({message: res.msg, type: 'error'})
          return
        }
        console.log(res.needMerge)
        // 如果服务端返回需要合并
        if (res.needMerge) {
          console.log(file)
          axios.post('http://172.18.1.85:8081/boot/uploader/mergechunks', qs.stringify(
            {
              filename: file.name,
              identifier: file.uniqueIdentifier,
              totalSize: file.size,
              type: file.fileType
            }
          )).then(res => {
            // 文件合并成功
            this.$emit('fileSuccess')
          }).catch(e => {

          })

          // 不需要合并
        }
        /* else {
                  this.$emit('fileSuccess')
                  console.log('上传成功')
                }*/
      },
      onFileError(rootFile, file, response, chunk) {
        this.$message({
          message: response,
          type: 'error'
        })
      },
      // 上传完成
      complete(file, response) {

        console.log('complete', arguments)

      },
      // 一个根文件（文件夹）成功上传完成。
      fileComplete() {
        alert('一个根文件（文件夹）成功上传完成')
        console.log('file complete', arguments)
        const file = arguments[0].file
        axios.post('http://172.18.1.85:8081/boot/uploader/mergechunks', qs.stringify({
          filename: file.name,
          identifier: arguments[0].uniqueIdentifier,
          totalSize: file.size,
          type: file.type
        })).then(function (response) {
          console.log(response)
        }).catch(function (error) {
          console.log(error)
        })
      },
      /**
       * 计算md5，实现断点续传及秒传
       * @param file
       */
      computeMD5(file) {
        let fileReader = new FileReader()
        let time = new Date().getTime()
        let md5 = ''

        file.pause()

        fileReader.readAsArrayBuffer(file.file)

        fileReader.onload = e => {
          if (file.size !== e.target.result.byteLength) {
            this.error('Browser reported success but could not read the file until the end.')
            return
          }

          md5 = SparkMD5.ArrayBuffer.hash(e.target.result)

          this.filemd5 = md5
          console.log('filemd5:' + this.filemd5)

          file.uniqueIdentifier = md5

          // 添加额外的参数
          /*        this.uploader.opts.query = {
                    ...this.params
                  } */

          console.log(`MD5计算完毕：${file.id} ${file.name} MD5：${md5} 用时：${new Date().getTime() - time} ms`)

        }
        fileReader.onerror = function () {
          console.log('FileReader onerror was triggered, maybe the browser aborted due to high memory usage.')
        }
      },

      mounted() {
        this.$nextTick(() => {
          window.uploader = this.$refs.uploader.uploader
        })
      }
    }
  }

</script>

<style>
  .uploader-example {
    width: 1000px;
    padding: 15px;
    margin: 40px auto 0;
    font-size: 12px;
    box-shadow: 0 0 10px rgba(62, 146, 203, 0.4);
  }

  .uploader-example .uploader-btn {
    margin-right: 4px;
  }

  .uploader-example .uploader-list {
    max-height: 440px;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
