<template>
  <div>
    <!-- 组织架构内容 - 头部 -->
    <el-card class="tree-card">
      <TreeTool :tree-node="companyInfo" :is-root="true" @addDpt="addDpt" />
      <!-- 也可以写成 <tree-tool />-->

      <!-- 放置一个el-tree -->
      <el-tree :data="dptData" :props="defaultProps">
        <tree-tool slot-scope="{ data }" :tree-node="data" @delDpt="getDepartments" @addDpt="addDpt" />
      </el-tree>
    </el-card>

    <!-- 新增部门的弹出层 -->
    <!-- <AddDpt :show-add-dialog="showAddDialog" :tree-node="node" @hideAddDptDialog="showAddDialog=false" @addDpt="getDepartments" /> -->
    <!-- 用sync修饰符，上面的代码中，删除@hideAddDptDialog="showAddDialog=false"。 :show-add-dialog="showAddDialog"写成:show-add-dialog.sync="showAddDialog" -->
    <AddDpt :show-add-dialog.sync="showAddDialog" :tree-node="node" @addDpt="getDepartments" />
  </div>
</template>

<script>
import TreeTool from './components/tree-tool.vue'
import { getDepartments } from '@/api/departments'
import { transListToTreeData } from '@/utils'
import AddDpt from './components/add-dpt.vue'

export default {
  components: {
    TreeTool,
    AddDpt
  },
  data() {
    return {
      companyInfo: { },
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
      },
      showAddDialog: false,
      node: null // 记录当前点击的node节点
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const { companyName, depts } = await getDepartments()
      this.companyInfo = { name: companyName, manager: '朱元璋', id: '' }
      // this.dptData = depts// 能这么写。这么写无法得到树形结构数据
      this.dptData = transListToTreeData(depts, '')
    },
    addDpt(node) {
      this.showAddDialog = true
      this.node = node
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
