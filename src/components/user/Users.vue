<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="19">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList">
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户列表（表格）渲染 -->
      <el-table :data="userList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            >
            </el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            >
            </el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="bottom"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRoles(scope.row)"
              >
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 20, 50, 100]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
    <!-- 所有的对话框在此处设置 -->
    <!-- 此对话框用于添加用户 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 对话框内容的主体区域 -->

      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部的按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="addDialogVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 此对话框用于修改用户信息 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <!-- disabled表示禁止修改此项 -->
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <!-- disabled表示禁止修改此项 -->
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <!-- disabled表示禁止修改此项 -->
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 对话框内容的主体区域 -->
      <!-- 对话框底部的按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="editDialogVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRolesDialogVisible"
      width="50%"
      @close="setRolesDialogClosed"
    >
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <p>
          分配新角色：
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
              v-for="role in rolesList"
              :key="role.id"
              :label="role.roleName"
              :value="role.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="setRolesDialogVisible = false"
          >取消</el-button
        >
        <el-button type="primary" @click="saveRoleInfo">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱地址的自定义规则
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的邮箱地址！'))
    }
    // 验证手机号的自定义规则
    var checkMobile = (rule, value, callback) => {
      // 验证国内手机号的正则表达式
      const regMobile = /^(?:(?:\+|00)86)?1\d{10}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的手机号！'))
    }
    return {
      // 查询参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },

      userList: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户表单的数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 添加用户时的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' },
          { min: 4, max: 10, message: '请输入4-10位用户名', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '请输入6-18位用户名', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      //控制修改用户信息对话框的显示与隐藏
      editDialogVisible: false,
      // 修改用户信息时查询到的对象
      editForm: {},
      // 修改用户信息的验证规则对象
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      setRolesDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      rolesList: [],
      selectRoleId: '',
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败!')
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听pagesize改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值改变
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async userStateChanged(userinfo) {
      console.log(userinfo)
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        // 如果更新失败，则返回原来的数据
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败！')
      }
      this.$message.success('更新用户状态成功！')
    },
    // 监听用户关闭对话框事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点按钮增加新用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        // 可以发起添加用户的网络请求
        const { date: res } = await this.$http.post(`users`, this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败！')
        }
        this.$message.success('添加用户成功！')
        // 创建结束后隐藏会话窗口
        this.addDialogVisible = false
        // 添加用户后刷新用户列表数据
        this.getUserList()
      })
    },
    // 用于弹出修改信息的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('没有找到该用户！')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改用户信息关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        // 发起修改用户信息的数据请求
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改用户信息失败！')
        }
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('修改用户信息成功！')
      })
    },

    // 根据用户id值去删除用户信息
    async removeUserById(id) {
      // 先弹窗用户警告信息
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户信息！',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => {
        return err
      })
      // 如果用户点击确认则返回confirm，反之返回cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消修改申请！')
      }

      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败！')
      }
      this.$message.success('删除用户成功！')
      this.getUserList()
    },
    async setRoles(userInfo) {
      this.userInfo = userInfo
      // 在展示对话框之前，获取所有的角色列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
      this.setRolesDialogVisible = true
    },
    async saveRoleInfo() {
      if (!this.selectRoleId) {
        return this.$message.error('请选择要分配的角色！')
      }
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectRoleId,
        }
      )
      if (res.meta.status === 400) {
        return this.$message.error('不允许修改管理员角色！')
      }
      if (res.meta.status !== 200) {
        return this.$message.error('用户角色更新失败！')
      }
      this.$message.success('用户角色更新成功！')
      this.getUserList()
      this.setRolesDialogVisible = false
    },
    setRolesDialogClosed() {
      this.selectRoleId = ''
      this.userInfo = ''
    },
  },
}
</script>

<style lang="less" scoped></style>
