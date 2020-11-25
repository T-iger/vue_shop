<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色设置</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input v-model="queryInfo.query" placeholder="请输入内容" clearable @clear="getRoleList">
            <el-button slot="append" icon="el-icon-search" @click="getRoleList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="roleDialog = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!--表格区域-->
      <el-table border stripe :data="roleList">
        <el-table-column type="index">
        </el-table-column>
        <!--<el-table-column type="selection" label="#">
        </el-table-column>-->
        <el-table-column label="角色名" prop="roleName">
        </el-table-column>
        <el-table-column label="创建者" prop="createUser.userName">
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime">
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!--删除按钮-->
            <el-button type="danger" @click="deleteRole(scope.row.roleId)" icon="el-icon-delete"
                       size="mini"></el-button>
            <!--权限按钮-->
            <el-tooltip effect="dark" content="权限配置" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!--新增角色-->
    <el-dialog @close="clearAddForm" title="新增角色" :visible.sync="roleDialog">
      <el-form status-icon ref="addRoleForm" :model="addRoleForm" :rules="addRoleFormRules">
        <el-form-item prop="roleName" label="角色名称" :label-width="formLabelWidth" style="margin-right: 120px">
          <el-input v-model="addRoleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog @close="clearAddForm" title="角色权限设置" :visible.sync="roleDialog">
      <el-form status-icon ref="addRoleForm" :model="addRoleForm" :rules="addRoleFormRules">
        <el-form-item prop="roleName" label="角色名称" :label-width="formLabelWidth" style="margin-right: 120px">
          <el-input v-model="addRoleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Role',
    data () {
      return {
        roleList: [],
        queryInfo: {
          query: '',
          pageNum: 1,
          pageSize: 5
        },
        addRoleForm: {
          roleName: ''
        },
        addRoleFormRules: {
          roleName: [
            {
              required: true,
              message: '请输入角色名称',
              trigger: 'blur'
            },
            {
              min: 2,
              max: 5,
              message: '长度在 2 到 5 个字符',
              trigger: 'blur'
            }
          ]
        },
        total: 10,
        roleDialog: false,
        formLabelWidth: '120px'
      }
    },
    methods: {
      // 监听显示数改变
      handleSizeChange (newSize) {
        this.queryInfo.pageSize = newSize
        this.getRoleList()
      },
      // 监听页面值改变
      handleCurrentChange (newPage) {
        this.queryInfo.pageNum = newPage
        this.getRoleList()
      },
      // 获取角色list
      getRoleList () {
        this.$http.get('getRoleList', { params: this.queryInfo }).then(res => {
          this.roleList = res.data.data.roleList
          this.total = res.data.data.total
        })
      },
      // 删除角色
      deleteRole (roleId) {
        this.$confirm('此操作会删除角色, 是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.get('deleteRole', { params: { roleId: roleId } }).catch(err => {
            return this.$message.error(err)
          }).then(res => {
            if (res.data.code !== 100) {
              return this.$message.error(res.data.msg)
            }
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getRoleList()
            // 为当前页面最后一个时，即删除的为当前页面的最后一个
            if (this.roleList.length === 1) {
              this.queryInfo.pageNum = this.queryInfo.pageNum - 1
              this.getRoleList()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 增加角色
      addRole () {
        this.$refs.addRoleForm.validate(valid => {
          if (!valid) return
          this.$http.get('addRole', { params: { roleName: this.addRoleForm.roleName } }).then(res => {
            if (res.data.code !== 100) {
              return this.$message.error(res.data.msg)
            }
            this.getRoleList()
            this.$message.success(res.data.msg)
            this.roleDialog = false
          })
        })
      },
      clearAddForm () {
        this.$refs.addRoleForm.resetFields()
      }
    },
    created () {
      this.getRoleList()
    }
  }
</script>

<style scoped>

</style>
