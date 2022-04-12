<template>
  <div class="roleWrapper">
    <!-- 靠右的按钮 -->
    <page-tools>
      <template v-slot:after>
        <el-button
          type="primary"
          size="small"
          @click="addPermission('0', 1)"
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
        align="left"
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
            @click="addPermission(row.id, 2)"
          >添加</el-button>
          <el-button
            type="text"
            @click="editPermission(row.id)"
          >编辑</el-button>
          <el-button
            type="text"
            @click="delPermission(row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增编辑弹层 -->
    <el-dialog
      :visible.sync="showDialog"
      :title="showText"
      @close="btnCancel"
    >
      <el-form
        ref="permForm"
        label-width="120px"
        :model="formData"
        :rules="rules"
      >
        <el-form-item
          label="权限名称"
          prop="name"
        >
          <el-input
            v-model="formData.name"
            style="width:90%"
          />
        </el-form-item>
        <el-form-item
          label="权限标识"
          prop="code"
        >
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
            @click="btnOK"
          >确定</el-button>
          <el-button
            size="small"
            @click="btnCancel"
          >取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { updatePermission, addPermission, getPermissionDetail, delPermission, getPermissionList } from '@/api/permission'
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
      showDialog: false
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
    },
    // 删除角色
    async delPermission(id) {
      try {
        await this.$confirm('确定要删除该角色吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '放弃'
        })
        await delPermission(id)
        this.getPermissionList()
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 添加角色
    addPermission(pid, type) {
      // pid表示当前数据父节点的标识
      // 访问权type=1, 按钮操作权type=2
      this.formData.pid = pid
      this.formData.type = type
      this.showDialog = true
    },
    btnOK() {
      // 两种写法都对
      // this.$refs.permForm.validate(isOK => {})
      this.$refs.permForm.validate().then(() => {
        // 校验成功
        if (this.formData.id) {
          return updatePermission(this.formData)
        }
        return addPermission(this.formData)
      }).then(() => {
        // 添加成功
        this.$message.success('操作成功')
        this.getPermissionList()
        this.showDialog = false
        // 清空form表单不能用this.formData = {}。如果这样清空，formData会完全空白，没有任何字段。通过新建按钮打开弹层时，只有pid和type属性，因为打开的时候就被赋值。而其它的所有属性字段都没有。比如enVisible，如果用户不点击Switch按钮，这个字段就没有，而默认的formData中，这个字段有，且默认值为0.
        // 清空form表单也不能用this.$refs.permForm.resetFields()。如果用这个，假设是提交前是编辑模式，用resetFields()，id会一直在,而description和enVisible字段会和刚刚提交的数据一样。如果id一直在，等会通过添加按钮打开弹层，会发现此时还是进入的编辑弹层。
        // 正确的清空表单的方法
        this.formData = {
          name: '', // 名称
          code: '', // 标识
          description: '', // 描述
          type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
          pid: '', // 因为做的是树 需要知道添加到哪个节点下了
          enVisible: '0' // 开启
        }
        // 这里不需要像btnCancel()一样清空校验结果。因为如果校验不通过，是没法走到这一步的。但是如果有校验通过的校验结果通知，这里还是要清空校验结果的。
      })
    },
    btnCancel() {
      this.showDialog = false
      // 清空form表单
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      // 清空权限名称和权限标识栏目的校验结果警告
      this.$refs.permForm.clearValidate()
    },
    async editPermission(id) {
      this.formData = await getPermissionDetail(id)
      // 先获取数据，再显示弹层，防止出现空白弹层然后突然出现数据
      this.showDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
.roleWrapper {
  padding: 0 30px;
}
</style>
