<template>
  <el-dialog
    title="新增员工"
    :visible.sync="showEmployeeDialog"
    width="30%"
    :before-close="hideEmployeeDialog"
  >
    <el-form ref="employeeForm" :model="employeeForm" :rules="employeeFormRules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="employeeForm.username" style="width:80%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="employeeForm.mobile" style="width:80%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="employeeForm.timeOfEntry" style="width:80%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="employeeForm.formOfEmployment" style="width:80%" placeholder="请选择">
          <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="employeeForm.workNumber" style="width:80%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="employeeForm.departmentName" style="width:80%" placeholder="请选择部门" :class="{'defaultFontColor': isDefault}" @focus="getDepartments" />
        <el-tree v-if="showTree" v-loading="loading" :data="treeData" default-expand-all="" :props="{label: 'name'}" @node-click="selectNode" />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="employeeForm.correctionTime" style="width:80%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="employeeOK">确 定</el-button>
      <el-button @click="hideEmployeeDialog">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import EmployeeEnum from '@/api/constants/employees'
import { getDepartments } from '@/api/departments'
import { transListToTreeData } from '@/utils'
import { addEmployee } from '@/api/employees'

export default {
  props: {
    showEmployeeDialog: {
      required: true,
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      EmployeeEnum,
      treeData: [], // 定义数组接收树形数据
      showTree: false, // 控制树形的显示或隐藏
      loading: false, // 控制树的显示或者隐藏进度条
      employeeForm: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '待安排',
        timeOfEntry: '',
        correctionTime: ''
      },
      employeeFormRules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, { min: 1, max: 4, message: '用户姓名1-4个字符' }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'blur' }],
        timeOfEntry: [{ required: true, message: '入职时间不能为空', trigger: 'blur' }],
        correctionTime: [{ required: true, message: '转正时间不能为空', trigger: 'blur' }]
      },
      isDefault: true // 设置部门default字体颜色。部门的input在blur的时候会触发验证，而选择部门的时候，是肯定会离开这个input的，这就blur了，这就导致第一次选择部门之后，出现了“未选择部门”的提示。为了避免这种情况。给部门的input设置一个初始值“待安排”。让这个初始值的字体颜色和placeholder的字体颜色一样。
    }
  },
  methods: {
    async getDepartments() {
      this.showTree = true
      this.loading = true
      const { depts } = await getDepartments()
      this.treeData = transListToTreeData(depts, '')
      this.loading = false
    },
    selectNode(node) {
      this.employeeForm.departmentName = node.name
      this.showTree = false
      this.isDefault = false // 把部门input的默认灰色字体变为黑色
      this.$refs.employeeForm.validateField('departmentName')
    },
    async employeeOK() {
      try {
        await this.$refs.employeeForm.validate()
        await addEmployee(this.employeeForm)
        this.$parent.getEmployeeDetailList()
        // this.$parent.showEmployeeDialog = false
        this.hideEmployeeDialog()
        this.$message.success('新增员工成功')
      } catch (error) {
        console.log(error)
      }
    },
    hideEmployeeDialog() {
      this.employeeForm = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '待安排',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.showTree = false
      this.isDefault = true
      this.$refs.employeeForm.resetFields()
      this.$emit('update:showEmployeeDialog', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.defaultFontColor{
  ::v-deep .el-input__inner{
    color:#ccd;
  }
}
</style>
