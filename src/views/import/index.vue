<template>
  <!-- 导入公共组件 -->
  <upload-excel :on-success="onSuccess" />
  <!-- <div>hh</div> -->
</template>

<script>
import { importEmployees } from '@/api/employees'

export default {
  methods: {
    async onSuccess({ header, results }) {
      // debugger
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const arr = []
      results.forEach(item => {
        const userInfo = {}
        // 每个item是一条员工数据。item是个object。例如：{手机号：1234223233, 姓名: 'zz', 入职日期: '1990年3月20日', 转正日期: '1990年4月20日', 工号: 'a786876'}。这两个forEach的作用就是把这些Object中的键值对的键从中文换成英文。因为服务器数据库里面的键值对的键是英文的。
        Object.keys(item).forEach(key => {
          // key就是上面object例子中键值对的键（中文字）
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/')) // 后端接口规定时间必须是时间类型，而非string类型
          } else {
            userInfo[userRelations[key]] = item[key]
          }
        })
        arr.push(userInfo)
      })
      // console.log(arr)
      await importEmployees(arr) // 调用导入接口
      this.$message.success('批量导入员工成功')
      this.$router.back()
    },
    // 转换Excel的日期格式
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
