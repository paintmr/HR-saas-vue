<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width:100%"
  >
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row
        type="flex"
        justify="end"
      >
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <el-dropdown @command="operateDpt">
            <span>
              操作<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                command="add"
                :disabled="!checkPermission('add-dept')"
              >添加子部门</el-dropdown-item>
              <el-dropdown-item
                v-if="!isRoot"
                command="edit"
              >编辑子部门</el-dropdown-item>
              <el-dropdown-item
                v-if="!isRoot"
                command="delete"
              >删除子部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartment } from '@/api/departments'
export default {
  props: {
    treeNode: {
      required: true,
      type: Object
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    operateDpt(type) {
      if (type === 'add') {
        this.$emit('addDpt', this.treeNode)
      } else if (type === 'edit') {
        this.$emit('editDpt', this.treeNode)
      } else {
        this.$confirm('您确定要删除该组织部门吗？').then(() => {
          return delDepartment(this.treeNode.id)
          // 因为在axios响应拦截器处理了失败异常，所以这里不用写catch，只要写then即可。
        }).then(() => {
          // 把服务器的数据删除成功后，要通知前端删除代码，重新渲染页面。这里通过通知父组件的形式来处理前端的工作。
          this.$emit('delDpt')
          this.$message.success('删除部门成功')
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
