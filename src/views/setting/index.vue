<template>
  <div>
    <el-card class="setting-container">
      <el-tabs v-model="activeName" @tab-click="handleClick">

        <el-tab-pane label="角色管理" name="first">

          <el-row style="height:60px">
            <el-button icon="el-icon-plus" size="small" type="primary">新增角色</el-button>
          </el-row>

          <el-table border="">
            <el-table-column label="序号" width="120" />
            <el-table-column label="角色名称" width="240" />
            <el-table-column label="描述" />
            <el-table-column label="操作">
              <el-button size="small" type="success">分配权限</el-button>
              <el-button size="small" type="primary">编辑</el-button>
              <el-button size="small" type="danger">删除</el-button>
            </el-table-column>
          </el-table>

          <el-row type="flex" justify="center" align="middle" style="height:60px">
            <el-pagination
              layout="prev, pager, next"
              :total="1000"
            />
          </el-row>

        </el-tab-pane>

        <el-tab-pane label="公司信息" name="second">
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            show-icon
            :closable="false"
          />

          <el-form label-width="120px" style="margin-top:50px">
            <el-form-item label="公司名称">
              <el-input disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input disabled type="textarea" :rows="3" style="width:400px" />
            </el-form-item>
          </el-form>

        </el-tab-pane>

      </el-tabs>

    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style lang="scss" scoped>
.setting-container{
  padding: 15px 50px;
}
</style>
