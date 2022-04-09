<template>
  <el-dialog
    title="分配角色"
    :visible="showRoleDialog"
    @close="btnCancel"
  >
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色 需要绑定当前用户拥有的角色 -->
    <el-checkbox-group v-model="roleIds">
      <!-- 选项 -->
      <el-checkbox
        v-for="item in list"
        :key="item.id"
        :label="item.id"
      >
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>

    <el-row
      slot="footer"
      type="flex"
      justify="center"
    >
      <el-col :span="6">
        <el-button
          type="primary"
          size="small"
          @click="btnOK"
        >确定</el-button>
        <el-button
          size="small"
          @click="btnCancel"
        >取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'

export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      list: [], // 所有角色列表
      roleIds: [] // 当前用户的角色
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { rows } = await getRoleList({ page: 1, pageSize: 20 }) // 这个接口默认只读取10条数据，我们可以让接口调取20条。
      this.list = rows
    },
    async getUserDetailById(id) {
      // props传值 是异步的,不能直接把this.userId 放入getUserDetailById(id),要去父组件employee/index.vue中调用本函数
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds // 赋值本用户的角色
    },
    async btnOK() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      this.$emit('update:showRoleDialog', false)
    },
    btnCancel() {
      this.roleIds = []
      // this.$emit('update:showRoleDialog', false)
      // 除了上面的代码外，还可以这样
      this.$parent.showRoleDialog = false
    }
  }
}
</script>
