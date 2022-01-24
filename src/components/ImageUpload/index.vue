<template>
  <div>
    <!-- file-list是上传的文件列表，可以绑定到上传组件中，让上传组件来显示。 -->
    <el-upload
      action="#"
      :limit="1"
      list-type="picture-card"
      :on-preview="preview"
      :file-list="fileList"
      :on-remove="handleRemove"
      :class="{disabled: fileComputed }"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'// 引入腾讯云COS包
// 实例化COS
const cos = new COS({
  SecretId: 'AKID0mqfEWqlUzIbeSkGRL6c7ML6c0B93To9', // 身份识别 ID
  SecretKey: 'JFwNZdeRF2iOp03FFsGNDm44vWFitmNF' // 身份密钥
})
export default {
  data() {
    return {
      fileList: [{ url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180815%2Fe24fce3f242e4236a44f391c7fb46c3f.jpeg&refer=http%3A%2F%2F5b0988e595225.cdn.sohucs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1645459367&t=e4f2ecc3014eea73c0aa7a4788997ab6' }],
      dialogImageUrl: '',
      dialogVisible: false
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
      // console.log(file, fileList)
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      // this.fileList = fileList// 用这种方式也可以
    },
    changeFile(file, fileList) {
      // console.log(fileList)
      this.fileList = fileList.map(item => item)
    },
    beforeUpload(file) {
      // console.log(file)
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传的图片只能是JPG，GIF，BMP，PNG格式')
        return false
      }
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片不能超过5M')
        return false
      }
      return true
    },
    upload(params) {
      console.log(params)
      if (params.file) {
        // 执行上传操作
        cos.putObject({
          Bucket: 'shuiruohanyu-106-1302806742', // 存储桶
          Region: 'ap-beijing', // 地域
          Key: params.file.name, // 文件名
          Body: params.file, // 要上传的文件对象
          StorageClass: 'STANDARD' // 上传的模式类型 直接默认 标准模式即可
          // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
        }, function(err, data) {
          // data返回数据之后 应该如何处理
          console.log(err || data)
        })
      }
    }
  }
}
</script>

<style lang="scss">
.disabled .el-upload--picture-card {
  display: none
}
</style>
