<template>
  <div>
    <el-card class="setting-container">
      <el-tabs v-model="activeName">

        <el-tab-pane label="角色管理" name="first">

          <el-row style="height:60px">
            <el-button icon="el-icon-plus" size="small" type="primary" @click="addRole">新增角色</el-button>
          </el-row>

          <el-table border="" :data="roleList">
            <el-table-column align="center" type="index" label="序号" width="120" />
            <el-table-column align="center" prop="name" label="角色名称" width="240" />
            <el-table-column align="center" prop="description" label="描述" />
            <el-table-column align="center" label="操作">
              <template slot-scope="{ row }">
                <el-button size="small" type="success">分配权限</el-button>
                <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-row type="flex" justify="center" align="middle" style="height:60px">
            <el-pagination
              layout="prev, pager, next"
              :total="page.total"
              :current-page="page.page"
              :page-size="page.pageSize"
              @current-change="changePage"
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
              <el-input v-model="companyInfo.name" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input v-model="companyInfo.companyAddress" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="companyInfo.mailbox" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="companyInfo.remarks" disabled type="textarea" :rows="3" style="width:400px" />
            </el-form-item>
          </el-form>

        </el-tab-pane>

      </el-tabs>

    </el-card>

    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="roleDialogVisible"
      :before-close="roleCancel"
    >
      <el-form ref="roleForm" :model="roleForm" :rules="roleFormRules" label-width="120px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" style="width:95%" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" style="width:95%" />
        </el-form-item>
      </el-form>
      <el-row slot="footer" class="dialog-footer">
        <el-button @click="roleCancel">取 消</el-button>
        <el-button type="primary" @click="roleOK">确 定</el-button>
      </el-row>
    </el-dialog>

  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole } from '@/api/setting'
import { mapGetters } from 'vuex'
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
      roleDialogMsg: ''
    }
  },
  computed: {
    ...mapGetters(['companyId'])
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
        await this.$confirm('确认删除该角色吗？')
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
    }
  }
}
</script>

<style lang="scss" scoped>
.setting-container{
  padding: 15px 50px;
}
</style>
