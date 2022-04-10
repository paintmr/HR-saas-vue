<template>
  <div>
    <!-- 靠右的按钮 -->
    <page-tools>
      <template v-slot:after>
        <el-button
          type="primary"
          size="small"
        >添加权限</el-button>
      </template>
    </page-tools>

    <!-- 表格 -->
    <el-table
      border
      style="width: 100%"
      :data="list"
      row-key="id"
    >
      <el-table-column
        label="名称"
        align="center"
        prop="name"
      />
      <el-table-column
        label="标识"
        align="center"
        prop="code"
      />
      <el-table-column
        label="描述"
        align="center"
        prop="description"
      />
      <el-table-column
        label="操作"
        align="center"
      >
        <template v-slot="{ row }">
          <el-button
            v-if="row.type === 1"
            type="text"
          >添加</el-button>
          <el-button type="text">编辑</el-button>
          <el-button type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增编辑弹层 -->
    <el-dialog
      :visible.sync="showDialog"
      :title="showText"
    >
      <el-form label-width="120px">
        <el-form-item label="权限名称">
          <el-input
            v-model="formData.name"
            style="width:90%"
          />
        </el-form-item>
        <el-form-item label="权限标识">
          <el-input
            v-model="formData.code"
            style="width:90%"
          />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input
            v-model="formData.description"
            style="width:90%"
          />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <!-- 弹层底部的确定和取消按钮 -->
      <el-row
        slot="footer"
        type="flex"
        justify="center"
      >
        <el-col :span="6">
          <el-button
            type="primary"
            size="small"
          >确定</el-button>
          <el-button size="small">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList } from '@/api/permission'
import { transListToTreeData } from '@/utils'
export default {
  data() {
    return {
      list: [],
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
      showDialog: true
    }
  },
  computed: {
    showText() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      this.list = transListToTreeData(await getPermissionList(), '0')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
