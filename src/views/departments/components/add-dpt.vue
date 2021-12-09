<template>
  <el-dialog
    title="提示"
    :visible.sync="showAddDialog"
    width="30%"
    :before-close="handleClose"
  >
    <!-- label-width设置label的长度 -->
    <el-form label-width="120px" :model="addDptForm" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="addDptForm.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="addDptForm.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="addDptForm.manager" style="width:80%" placeholder="请选择" />
      </el-form-item>
      <el-form-item label="部门介绍" prop="desc">
        <el-input v-model="addDptForm.desc" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="showAddDialog = false">取 消</el-button>
      <el-button type="primary" @click="showAddDialog = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    showAddDialog: {
      required: true,
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      const validateName = async(rule, value, callback) => {
        console.log(1)
      },
      addDptForm: {
        name: '',
        code: '',
        manager: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称 1 到 50 个字符', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码 1 到 50 个字符', trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍 1 到 300 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
