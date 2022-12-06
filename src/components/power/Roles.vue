<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col :span="7">
          <el-button type="primary"> 添加角色 </el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesTree" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['vcenter', 'bottomBorder', i1 === 0 ? 'topBorder' : '']"
              v-for="(itemL1, i1) in scope.row.children"
              :key="itemL1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  type="danger"
                  closable
                  @close="removeRightById(scope.row, itemL1.id)"
                >
                  {{ itemL1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限和三级权限 -->
              <el-col :span="19">
                <!-- 通过for嵌套渲染页面 -->
                <el-row
                  :class="['vcenter', i2 === 0 ? '' : 'topBorder']"
                  v-for="(itemL2, i2) in itemL1.children"
                  :key="itemL2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, itemL2.id)"
                      >{{ itemL2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="(itemL3, i3) in itemL2.children"
                      :key="itemL3.id"
                      type="info"
                      closable
                      @close="removeRightById(scope.row, itemL3.id)"
                    >
                      {{ itemL3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">
              编辑
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">
              删除
            </el-button>

            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightsDialog(scope.row)"
            >
              分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightsDialogVisible"
      width="40%"
      @close="setRightsDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightsTree"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allowRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesTree: [],
      // 控制设置权限对话框是否展示
      setRightsDialogVisible: false,
      //所有权限的数据
      rightsTree: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      // 默认勾选的节点id值
      defKeys: [],
      roleId: '',
    }
  },
  created() {
    this.getRolesTree()
  },
  methods: {
    async getRolesTree() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户角色失败！')
      }
      this.rolesTree = res.data
    },
    async removeRightById(role, rightId) {
      //弹窗提示用户是否删除
      const confirmResult = await this.$confirm(
        '此操作不可撤回，是否需要删除该权限？',
        '警告',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除权限！')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户权限失败！')
      }
      // 不需要从头渲染页面
      // this.getRolesTree()
      this.$message.success('删除用户权限成功！')
      role.children = res.data
    },
    //展示分配权限的对话款
    async showSetRightsDialog(role) {
      console.log(role.id)
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      //   获取得到的数据保存到data中
      this.rightsTree = res.data
      this.getLeafKeys(role, this.defKeys)
      this.setRightsDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys数组中
    getLeafKeys(node, arr) {
      // 如果当前节点不包含children属性，这为最后一级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightsDialogClosed() {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allowRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      const idStr = keys.join(',')

      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      console.log(res)
      console.log(res.meta.status)

      if (res.meta.status !== 200) {
        return this.$message.error('更新权限失败！')
      }
      this.$message.success('更新权限成功！')
      this.getRolesTree()
      this.setRightsDialogVisible = false
    },
  },
}
</script>
<style lang="less" scope>
.topBorder {
  border-top: 1px solid #eee;
}
.bottomBorder {
  border-bottom: 1px solid #eee;
}
.el-tag {
  margin: 7px;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
