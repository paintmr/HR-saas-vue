<template>
  <div>
    <PageTools :show-before="true">
      <span slot="before">共166条记录</span>
      <template slot="after">
        <el-button size="small" type="warning" @click="$router.push('/import')">Excel导入员工</el-button>
        <el-button size="small" type="danger" @click="exportData">Excel导出员工</el-button>
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
            <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
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
import { formatDate } from '@/filters'

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
    },
    exportData() {
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 因为导出Excel的相关包裹很大，且导出功能不常用，所以用懒加载的方式导出员工数据存为Excel文件。
      import('@/vendor/Export2Excel').then(async excel => {
        // 用1页获取所有员工数据
        const { rows } = await getEmployeeDetailList({ page: 1, size: this.page.total }) // 这里的rows数据结构是[{username: 'Amy', mobile: 12345678},{username: 'Tom', mobile: 66721346}]。下面excel.export_json_to_excel()所需的参数data的数据结构是[['Amy', 12345678],['Tom', 66721346]]
        const data = this.formatJson(headers, rows)
        // 复杂表头设置
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']] // 这个数组中，每一个元素数组是一行。每个元素数组的每个元素，是一列。
        const merges = ['A1:A2', 'B1:F1', 'G1:G2'] // 这里写的是multiHeader中需要合并的单元格。本数组中每个元素，冒号前后的内容，就是待合并的单元格
        // excel是引入的@/vendor/Export2Excel文件对象
        excel.export_json_to_excel({
          // header: ['姓名', '工资'],
          header: Object.keys(headers),
          data,
          filename: '员工信息表',
          // bookType: 'txt' //bookType默认是.xlsx文档，默认可以不写bookType键值对
          multiHeader,
          merges
        })
      })
    },
    formatJson(headers, rows) {
      return rows.map(item => { // item是这样的{username: 'Amy', mobile: 12345678}
        return Object.keys(headers).map(key => {
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            // 格式化日期
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(hiretp => hiretp.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]] // headers[key]得到'username', 'mobile'。item[headers[key]]会得到['Amy', 12345678]
        })
      })
      // 上面3行代码
      // return rows.map(item => {
      //   return Object.keys(headers).map(key => {
      //     return item[headers[key]]
      //   })
      // })
      // 可以改为
      // return rows.map(item => Object.keys(headers).map(key => item[headers[key]])) // 因为需要处理时间格式问题，所以代码还按上面的写
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
