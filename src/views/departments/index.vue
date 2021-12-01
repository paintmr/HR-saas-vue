<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容 - 头部 -->
      <el-card class="tree-card">
        <el-row type="flex" justify="space-between" align="middle" style="height: 40px">
          <el-col>
            <!-- 左侧内容 -->
            <span>朱雀科技股份有限公司</span>
          </el-col>
          <el-col :span="4">
            <el-row type="flex" justify="end">
              <el-col>负责人</el-col>
              <el-col>
                <el-dropdown>
                  <span>
                    下拉菜单<i class="el-icon-arrow-down el-icon--right" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>添加子部门</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </el-col>
        </el-row>

        <!-- 放置一个el-tree -->
        <el-tree :data="dptData" :props="defaultProps">
          <el-row slot-scope="{ data }" type="flex" justify="space-between" align="middle" style="height: 40px; width:100%">
            <el-col>
              <!-- 左侧内容 -->
              <span>{{ data.name }}</span>
            </el-col>
            <el-col :span="4">
              <el-row type="flex" justify="end">
                <el-col>{{ data.manager }}</el-col>
                <el-col>
                  <el-dropdown>
                    <span>
                      下拉菜单<i class="el-icon-arrow-down el-icon--right" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>添加子部门</el-dropdown-item>
                      <el-dropdown-item>编辑子部门</el-dropdown-item>
                      <el-dropdown-item>删除子部门</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dptData:
      [
        {
          name: '总裁办',
          manager: '曹操',
          children: [{
            name: '董事会',
            manager: '曹植'
          }]
        },
        {
          name: '行政部',
          manager: '刘备'
        },
        {
          name: '人事部',
          manager: '孙权'
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
