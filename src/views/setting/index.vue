<template>
  <div>
    <el-card class="setting-container">
      <el-tabs v-model="activeName">

        <el-tab-pane
          label="角色管理"
          name="first"
        >

          <el-row style="height:60px">
            <el-button
              icon="el-icon-plus"
              size="small"
              type="primary"
              @click="addRole"
            >新增角色</el-button>
          </el-row>

          <el-table
            border=""
            :data="roleList"
          >
            <el-table-column
              align="center"
              type="index"
              label="序号"
              width="120"
            />
            <el-table-column
              align="center"
              prop="name"
              label="角色名称"
              width="240"
            />
            <el-table-column
              align="center"
              prop="description"
              label="描述"
            />
            <el-table-column
              align="center"
              label="操作"
            >
              <template slot-scope="{ row }">
                <el-button
                  size="small"
                  type="success"
                  @click="assignPerm(row.id)"
                >分配权限</el-button>
                <el-button
                  size="small"
                  type="primary"
                  @click="editRole(row.id)"
                >编辑</el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="deleteRole(row.id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-row
            type="flex"
            justify="center"
            align="middle"
            style="height:60px"
          >
            <el-pagination
              layout="prev, pager, next"
              :total="page.total"
              :current-page="page.page"
              :page-size="page.pageSize"
              @current-change="changePage"
            />
          </el-row>

        </el-tab-pane>

        <el-tab-pane
          label="公司信息"
          name="second"
        >
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            show-icon
            :closable="false"
          />

          <el-form
            label-width="120px"
            style="margin-top:50px"
          >
            <el-form-item label="公司名称">
              <el-input
                v-model="companyInfo.name"
                disabled
                style="width:400px"
              />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input
                v-model="companyInfo.companyAddress"
                disabled
                style="width:400px"
              />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input
                v-model="companyInfo.mailbox"
                disabled
                style="width:400px"
              />
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                v-model="companyInfo.remarks"
                disabled
                type="textarea"
                :rows="3"
                style="width:400px"
              />
            </el-form-item>
          </el-form>

        </el-tab-pane>

      </el-tabs>

    </el-card>

    <!-- 编辑角色对话框 -->
    <el-dialog
      :title="showText"
      :visible.sync="roleDialogVisible"
      :before-close="roleCancel"
    >
      <el-form
        ref="roleForm"
        :model="roleForm"
        :rules="roleFormRules"
        label-width="120px"
      >
        <el-form-item
          label="角色名称"
          prop="name"
        >
          <el-input
            v-model="roleForm.name"
            style="width:95%"
          />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input
            v-model="roleForm.description"
            style="width:95%"
          />
        </el-form-item>
      </el-form>
      <el-row
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="roleOK"
        >确 定</el-button>
        <el-button @click="roleCancel">取 消</el-button>
      </el-row>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="showPermDialog"
    >
      <!-- 权限数据是树形结构，这里选用Tree树形控件 -->
      <!-- check-strictly如果为true，表示父子勾选时，互不关联 -->
      <!-- 如果要使用default-checked-keys，必须规定数据中的某个不含重复数据的字段为node-key。这里node-key="id"。这个字段下的数据组成一个数组（把本角色已有权限的id组成数组selectCheck），传递给default-checked-keys，告诉树形结构。这些字段的数据（权限）是放在已勾选的复选框里。 -->
      <el-tree
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        :show-checkbox="true"
        :check-strictly="true"
        :default-expand-all="true"
        :default-checked-keys="selectCheck"
        node-key="id"
      />
      <!-- 确定 取消 按钮 -->
      <el-row
        slot="footer"
        type="flex"
        justify="center"
      >
        <el-col :span="6">
          <el-button
            type="primary"
            size="small"
            @click="btnPermOK"
          >确定</el-button>
          <el-button
            size="small"
            @click="btnPermCancel"
          >取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>

  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole, assignPerm } from '@/api/setting'
import { mapGetters } from 'vuex'
import { transListToTreeData } from '@/utils'
import { getPermissionList } from '@/api/permission'
export default {
  data() {
    return {
      activeName: 'first',
      roleList: [],
      page: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      companyInfo: {},
      roleDialogVisible: false,
      roleForm: {},
      roleFormRules: {
        name: [{ required: true, message: '角色不能为空', trigger: 'blur' }]
      },
      roleDialogMsg: '',
      showPermDialog: false,
      defaultProps: {
        label: 'name'
      },
      permData: [], // 接收权限数据 树形结构
      selectCheck: [], // 接收已选中的节点
      roleId: null // 被分配角色的id
    }
  },
  computed: {
    ...mapGetters(['companyId']),
    showText() {
      return this.roleForm.id ? '编辑角色' : '新增角色'
    }
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.roleList = rows
    },
    changePage(newPage) {
      this.page.page = newPage
      this.getRoleList()
    },
    async getCompanyInfo() {
      this.companyInfo = await getCompanyInfo(this.companyId)
    },
    async deleteRole(id) {
      try {
        await this.$confirm('确认删除该角色吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '放弃'
        })
        await deleteRole(id)
        this.getRoleList()
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    async editRole(id) {
      this.roleForm = await getRoleDetail(id)
      this.roleDialogVisible = true // 先获取数据，再出弹层，避免出现空对话框
      this.roleDialogMsg = '编辑角色成功'
    },
    addRole() {
      this.roleDialogVisible = true // 先获取数据，再出弹层，避免出现空对话框
      this.roleDialogMsg = '添加角色成功'
    },
    async roleOK() {
      try {
        await this.$refs.roleForm.validate()
        if (this.roleForm.id) {
          await updateRole(this.roleForm)
        } else {
          await addRole(this.roleForm)
        }
        this.getRoleList()
        this.$message.success(this.roleDialogMsg)
        this.roleCancel()
      } catch (error) {
        console.log(error)
      }
    },
    roleCancel() {
      this.roleDialogVisible = false
      // 把roleForm数据置空，去除roleForm.id在roleOK()中的影响
      this.roleForm = {
        name: '',
        description: ''
      }
      // 移除校验规则
      this.$refs.roleForm.resetFields()
    },
    async assignPerm(id) {
      this.permData = transListToTreeData(await getPermissionList(), '0')
      this.roleId = id
      // 根据id获取当前角色的所有权限
      const { permIds } = await getRoleDetail(id)
      this.selectCheck = permIds
      this.showPermDialog = true
    },
    async btnPermOK() {
      // Element UI2的Tree组件中，getCheckedKeys()表示，若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组
      await assignPerm({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.roleId })
      this.$message.success('分配权限成功')
      this.showPermDialog = false
    },
    btnPermCancel() {
      this.selectCheck = []
      this.showPermDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.setting-container {
  padding: 15px 50px;
}
</style>
