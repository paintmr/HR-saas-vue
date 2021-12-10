<template>
  <!-- close是点右上角的X触发 -->
  <el-dialog
    title="提示"
    :visible.sync="showAddDialog"
    width="30%"
    close="hideAddDptDialog"
  >
    <!-- label-width设置label的长度 -->
    <el-form ref="dptForm" label-width="120px" :model="addDptForm" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="addDptForm.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="addDptForm.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <!-- 下面可以写@focus.native，也可以写@focus。因为element支持@focus事件 -->
        <el-select v-model="addDptForm.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeList">
          <el-option v-for="employee in employeeList" :key="employee.id" :label="employee.username" :value="employee.username" />
        </el-select></el-form-item>
      <el-form-item label="部门介绍" prop="desc">
        <el-input v-model="addDptForm.desc" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="hideAddDptDialog">取 消</el-button>
      <el-button type="primary" @click="addDpt">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartment } from '@/api/departments'
import { getEmployeeList } from '@/api/employees'

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
    const validateName = async(rule, value, callback) => {
      const { depts } = await getDepartments() // 获取所有部门
      //  dpts.filter(item => item.pid === this.treeNode.id)获取本部门（treeNode）的所有子部门，这返回一个数组。在此基础上，some(item => item.name === value)筛选是否有与用户输入的部门（value）相同的值。
      const isNameRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      isNameRepeat ? callback(new Error(`同级部门下已有${value}`)) : callback()
    }
    const validateCode = async(rule, value, callback) => {
      const { depts } = await getDepartments() // 获取所有部门
      const isCodeRepteat = depts.some(item => item.code === value && value) // 这里加一个 value不为空 因为我们的部门有可能没有code。这里的并列条件&& value还可以写成&& value !== ''
      isCodeRepteat ? callback(new Error(`本公司已有部门编码${value}`)) : callback()
    }
    return {
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
          { min: 1, max: 50, message: '部门编码 1 到 50 个字符', trigger: 'blur' },
          { validator: validateCode, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍 1 到 300 个字符', trigger: 'blur' }
        ]
      },
      employeeList: []
    }
  },
  methods: {
    async getEmployeeList() {
      this.employeeList = await getEmployeeList()
    },
    addDpt() {
      this.$refs.dptForm.validate(async isOK => {
        if (isOK) {
          await addDepartment({ ...this.addDptForm, pid: this.treeNode.id })
          this.hideAddDptDialog()
          this.$emit('addDpt')
          this.$message.success('添加部门成功')
        }
      })
    },
    hideAddDptDialog() {
      // this.$emit('hideAddDptDialog') // 用sync修饰符，这代码可以写成
      this.$emit('update:showAddDialog', false) // 固定写法update:props名称
      this.$refs.dptForm.resetFields() // 重置校验字段
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
