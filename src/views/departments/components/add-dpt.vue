<template>
  <!-- close是点右上角的X触发 -->
  <el-dialog
    :title="showTitle"
    :visible.sync="showAddDialog"
    width="30%"
    close="hideDptDialog"
  >
    <!-- label-width设置label的长度 -->
    <el-form ref="dptForm" label-width="120px" :model="dptForm" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="dptForm.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="dptForm.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <!-- 下面可以写@focus.native，也可以写@focus。因为element支持@focus事件 -->
        <el-select v-model="dptForm.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeList">
          <el-option v-for="employee in employeeList" :key="employee.id" :label="employee.username" :value="employee.username" />
        </el-select></el-form-item>
      <el-form-item label="部门介绍" prop="desc">
        <el-input v-model="dptForm.desc" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="hideDptDialog">取 消</el-button>
      <el-button type="primary" @click="dptOK">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartment, getDepartmentDetail, updateDepartment } from '@/api/departments'
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
      // 检查部门名称是否重复，分为编辑部门模式和新增部门模式
      let isNameRepeat = false
      if (this.dptForm.id) {
        // 有id是编辑部门模式
        // 校验规则：本部门（treeNode）的子部门中，除了用户正在编辑的这个部门叫“运营部”以外，其它部门都不能用这个名字
        isNameRepeat = depts.filter(item => item.pid === this.treeNode.id && item.id !== this.dptForm.id).some(item => item.name === value)
      } else {
        // 无id是新增部门模式
        //  dpts.filter(item => item.pid === this.treeNode.id)获取本部门（treeNode）的所有子部门，这返回一个数组。在此基础上，some(item => item.name === value)筛选是否有与用户输入的部门（value）相同的值。
        isNameRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      isNameRepeat ? callback(new Error(`同级部门下已有${value}`)) : callback()
    }
    const validateCode = async(rule, value, callback) => {
      const { depts } = await getDepartments() // 获取所有部门
      // 检查部门编码是否重复，分为编辑部门模式和新增部门模式
      let isCodeRepteat = false
      if (this.dptForm.id) {
        // 有id是编辑部门模式
        isCodeRepteat = depts.some(item => item.id !== this.dptForm.id && item.code === value && value)
      } else {
        // 无id是新增部门模式
        isCodeRepteat = depts.some(item => item.code === value && value) // 这里加一个 value不为空 因为我们的部门有可能没有code。这里的并列条件&& value还可以写成&& value !== ''
      }
      isCodeRepteat ? callback(new Error(`本公司已有部门编码${value}`)) : callback()
    }
    return {
      dptForm: {
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
  computed: {
    showTitle() {
      return this.dptForm.id ? '编辑部门' : '新增部门'
    }
  },
  methods: {
    async getEmployeeList() {
      this.employeeList = await getEmployeeList()
    },
    dptOK() {
      this.$refs.dptForm.validate(async isOK => {
        if (isOK) {
          if (this.dptForm.id) {
            // 如果有id，就是编辑部门模式（这是服务器传过来的id）
            await updateDepartment(this.dptForm)
          } else {
            // 没有id，是新增部门模式
            await addDepartment({ ...this.dptForm, pid: this.treeNode.id })
          }
          this.hideDptDialog()
          this.$emit('OKDpt') // 通知父组件拉取新的部门列表
          this.$message.success('添加部门成功')
        }
      })
    },
    hideDptDialog() {
      // 重置表单数据。以this.dptForm.id为依据判断弹出框标题为“编辑部门”还是“新增部门”。如果不重置表单，在点击了“编辑部门”后（此时this.dptForm.id由服务器返回的数据获得），点击“新增部门”，已久显示“编辑部门”
      this.dptForm = {
        name: '',
        code: '',
        manager: '',
        desc: ''
      }
      this.$refs.dptForm.resetFields() // 重置校验字段。这种方法无法重置id（因为id不是form里的字段，而是服务器返回的数据），所以不用resetFields()来重置dptForm的数据，但是需要它来重置验证的提示信息。比如“同级部门下已有市场部”，关闭表单的时候也要去掉。

      // 关闭弹层
      // this.$emit('hideAddDptDialog') // 用sync修饰符，这行代码可以写成
      this.$emit('update:showAddDialog', false) // 固定写法update:props名称
    },
    async getDepartmentDetail(id) {
      this.dptForm = await getDepartmentDetail(id) // 这里id不能写this.treeNode.id，因为这是props值，而props值是异步的
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
