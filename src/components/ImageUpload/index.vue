<template>
  <div class="upload-pic">
    <!-- file-list是上传的文件列表，可以绑定到上传组件中，让上传组件来显示。 -->
    <el-upload
      action="#"
      :limit="1"
      list-type="picture-card"
      :on-preview="preview"
      :file-list="fileList"
      :on-remove="handleRemove"
      :class="{ disabled: fileComputed }"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <!--v-if="uploadedPicId"  -->
    <div
      v-if="uploadedPicId"
      class="progress-bar"
    >
      <el-progress
        :text-inside="true"
        :stroke-width="16"
        :percentage="uploadingProgress"
      />
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      title="图片"
    >
      <img
        width="100%"
        :src="dialogImageUrl"
        alt=""
      >
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      fileList: [
        {
          url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180815%2Fe24fce3f242e4236a44f391c7fb46c3f.jpeg&refer=http%3A%2F%2F5b0988e595225.cdn.sohucs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1645459367&t=e4f2ecc3014eea73c0aa7a4788997ab6'
        }
      ],
      dialogImageUrl: '',
      dialogVisible: false,
      uploadedPicId: '',
      uploadingProgress: 0
    }
  },
  computed: {
    // 设定一个计算属性 判断是否已经上传完了一张
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    preview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove(file, fileList) {
      this.fileList = this.fileList.filter((item) => item.uid !== file.uid)
      // this.fileList = fileList// 用这种方式也可以
    },
    changeFile(file, fileList) {
      // this.fileList = fileList.map((item) => item)
      this.fileList = fileList
    },
    beforeUpload(file) {
      // 判断文件类别
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('只能上传JPG，GIF，BMP，PNG格式的图片')
        return false
      }

      // 判断文件大小
      // 1M = 1024KB 1KB = 1024 bit(字节)
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片不能超过5M')
        return false
      }
      this.uploadedPicId = file.uid
      return true
    },
    async upload(params) {
      const formData = new FormData()
      formData.append('file', params.file)
      if (params.file) {
        // 执行上传操作
        try {
          const res = await axios.post('http://localhost:3344/dropzone', formData, {
            onUploadProgress: (e) => {
              this.uploadingProgress = Math.round((e.loaded / e.total) * 100)
            }
          })
          this.fileList = this.fileList.map(file => {
            if (file.uid === this.uploadedPicId) {
              return { url: `http://localhost:3344${res.data.uploadedFileAddress}`, uploaded: true }
            }
          })
          this.$message.success('Picture has been uploaded.')
          this.uploadedPicId = ''
          this.uploadingProgress = 0
        } catch (error) {
          console.log(error)
          this.$message.error(error.response.data.error)
          this.uploadedPicId = ''
          this.uploadingProgress = 0
        }
      }
    }
  }
}
</script>

<style lang="scss">
.upload-pic {
  position: relative;
}
.disabled .el-upload--picture-card {
  display: none;
}
.progress-bar {
  width: 146px;
  position: absolute;
  left: 1px;
  bottom: 12px;
  width: 146px;
}
</style>
