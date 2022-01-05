<template>
  <div>
    <PageTools :show-before="true">
      <span slot="before">共166条记录</span>
      <template slot="after">
        <el-button size="small" type="warning" @click="$router.push('/import')">导入</el-button>
        <el-button size="small" type="danger">导出</el-button>
        <el-button class="el-icon-plus" size="small" type="primary" @click="showEmployeeDialog = true">新增员工</el-button>
      </template>
    </PageTools>

    <el-card v-loading="loading">
      <el-table border :data="employeeDetailList">
        <el-table-column label="序号" sortable="" type="index" />
        <el-table-column label="姓名" sortable="" prop="username" />
        <el-table-column label="工号" sortable="" prop="workNumber" />
        <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" :formatter="employmentType" />
        <el-table-column label="部门" sortable="" prop="departmentName" />
        <el-table-column label="入职时间" sortable="">
          <template slot-scope="{ row }">{{ row.timeOfEntry | formatDate }}</template>
        </el-table-column>
        <el-table-column label="账户状态" sortable="" prop="enableState">
          <template slot-scope="{ row }">
            <el-switch :value="row.enableState === 1" />
          </template>
        </el-table-column>
        <el-table-column label="操作" sortable="" fixed="right" width="280">
          <template slot-scope="{ row }">
            <el-button type="text" size="small">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination
          layout="prev, pager, next"
          :total="page.total"
          :current-page="page.page"
          :page-size="page.pageSize"
          @current-change="changePage"
        />
      </el-row>
    </el-card>

    <!-- 新增员工弹层 -->
    <AddEmployee :show-employee-dialog.sync="showEmployeeDialog" />
  </div>
</template>

<script>
import { getEmployeeDetailList, deleteEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constants/employees'
import AddEmployee from './components/add-employee.vue'
export default {
  components: {
    AddEmployee
  },
  data() {
    return {
      loading: false,
      employeeDetailList: [],
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      showEmployeeDialog: false
    }
  },
  created() {
    this.getEmployeeDetailList()
  },
  methods: {
    changePage(newPage) {
      this.page.page = newPage
      this.getEmployeeDetailList()
    },
    async getEmployeeDetailList() {
      this.loading = true
      const { total, rows } = await getEmployeeDetailList(this.page)
      this.page.total = total
      this.employeeDetailList = rows
      this.loading = false
    },
    employmentType(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    async deleteEmployee(id) {
      try {
        await this.$confirm('您确定删除该员工吗？')
        await deleteEmployee(id)
        this.getEmployeeDetailList()
        this.$message.success('删除员工成功')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
