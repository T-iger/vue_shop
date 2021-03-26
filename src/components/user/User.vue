<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户设置</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input v-model="queryInfo.query" placeholder="请输入内容" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- <el-select v-model="value" clearable placeholder="请选择">
             <el-option
               v-for="item in options"
               :key="item.value"
               :label="item.label"
               :value="item.value">
             </el-option>
           </el-select>-->
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="registerDialog = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--表格区域-->
      <el-table border stripe :data="userList">
        <el-table-column type="index" >
        </el-table-column>
       <!-- <el-table-column type="selection" label="#">
        </el-table-column>-->
        <el-table-column label="登录名" prop="loginName">
        </el-table-column>
        <el-table-column label="用户名" prop="userName">
        </el-table-column>
        <el-table-column label="角色" prop="role.roleName">
        </el-table-column>
        <el-table-column label="创建日期" prop="createTime">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              :active-value="1"
              :inactive-value="2"
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="正常"
              inactive-text="禁用"
              @change="changeStatus(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!--修改按钮-->
            <el-button type="primary" @click="findUser(scope.row.userId)" icon="el-icon-edit" size="mini"></el-button>
            <!--权限按钮-->
            <el-tooltip effect="dark" content="权限配置" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
            <!--删除按钮-->
            <el-button type="danger" @click="deleteUser(scope.row.userId)" icon="el-icon-delete"
                       size="mini"></el-button>
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
    <!--新增用户-->
    <el-dialog @close="resetAddForm" title="注册" :visible.sync="registerDialog">
      <el-form status-icon ref="registerForm" :model="registerForm" :rules="registerFormRules">
        <el-form-item prop="username" label="姓名" :label-width="formLabelWidth" style="margin-right: 120px">
          <el-input v-model="registerForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="login_name" label="登录名" :label-width="formLabelWidth"
                      style="margin-right: 120px">
          <el-input v-model="registerForm.login_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码" :label-width="formLabelWidth" style="margin-right: 120px">
          <el-input v-model="registerForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="re_password" label="确认密码" :label-width="formLabelWidth"
                      style="margin-right: 120px">
          <el-input v-model="registerForm.re_password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth"
                      style="margin-right: 120px">
          <el-select v-model="registerForm.role.roleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId">
            </el-option>
          </el-select>
          <!--          <el-input v-model="editUserForm.role.roleName" disabled autocomplete="off"></el-input>-->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="registerDialog = false">取 消</el-button>
        <el-button type="primary" @click="register">确 定</el-button>
      </div>
    </el-dialog>
    <!--修改用户信息-->
    <el-dialog @close="clearEditUser" title="修改" :visible.sync="editUserDialog">
      <el-form status-icon ref="editUserForm" :model="editUserForm" :rules="editUserRule">
        <el-form-item prop="userName" label="姓名" :label-width="formLabelWidth" style="margin-right: 120px">
          <el-input v-model="editUserForm.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录名" :label-width="formLabelWidth"
                      style="margin-right: 120px">
          <el-input v-model="editUserForm.loginName" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth"
                      style="margin-right: 120px">
          <el-select v-model="editUserForm.role.roleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId">
            </el-option>
          </el-select>
          <!--          <el-input v-model="editUserForm.role.roleName" disabled autocomplete="off"></el-input>-->
        </el-form-item>
        <el-form-item prop="password" label="密码" :label-width="formLabelWidth" style="margin-right: 120px">
          <el-input v-model="editUserForm.password" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'User',
    data () {
      // 检查2次密码是否一致
      const checkRePassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.registerForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      // 校验登录名
      const checkLoginName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入登录名'))
        } else {
          const loginName = { loginName: this.registerForm.login_name }
          this.$http.get('checkUser', { params: loginName }).catch(err => {
            // 出错时返回服务器状态
            return this.$message.error(err)
          }).then(res => {
            if (res.data.code === 100) {
              return callback()
            } else {
              callback(new Error('登录名已存在'))
            }
          })
        }
      }
      return {
        queryInfo: {
          query: '',
          pageNum: 1,
          pageSize: 5
        },
        userList: [],
        total: 10,
        // 注册表单和规则
        registerForm: {
          username: '',
          login_name: '',
          password: '',
          re_password: '',
          role: {
            roleId: '0',
            roleName: ''
          }
        },
        registerFormRules: {
          username: [
            {
              required: true,
              message: '请输入用户名',
              trigger: 'blur'
            },
            {
              min: 2,
              max: 5,
              message: '长度在 2 到 5 个字符',
              trigger: 'blur'
            }
          ],
          login_name: [
            {
              min: 2,
              max: 6,
              message: '长度在 2 到 6 个字符',
              trigger: 'blur'
            },
            {
              required: true,
              validator: checkLoginName,
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              min: 6,
              max: 8,
              message: '长度在 6 到 8 个字符',
              trigger: 'blur'
            }
          ],
          re_password: [
            {
              required: true,
              validator: checkRePassword,
              trigger: 'blur'
            }
          ]
        },
        // 修改表单和规则
        editUserForm: {
          userId: '',
          userName: 'q',
          loginName: '',
          password: '',
          role: {
            roleId: '',
            roleName: ''
          }
        },
        editUserRule: {
          userName: [
            {
              required: true,
              message: '请输入用户名',
              trigger: 'blur'
            },
            {
              min: 2,
              max: 5,
              message: '长度在 2 到 5 个字符',
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              min: 6,
              max: 8,
              message: '长度在 6 到 8 个字符',
              trigger: 'blur'
            }
          ]
        },
        // 角色list
        roleList: [],
        registerDialog: false,
        editUserDialog: false,
        formLabelWidth: '100px'
      }
    },
    methods: {
      // 注册表单验证
      register () {
        this.$refs.registerForm.validate(async valid => {
          if (!valid) return
          const User = {
            userName: this.registerForm.username,
            loginName: this.registerForm.login_name,
            password: this.registerForm.password,
            role: this.registerForm.role
          }
          const { data: res } = await this.$http.post('register', User).catch(err => {
            // 出错时返回服务器状态
            return this.$message.error(err)
          })
          if (res.code !== 100) {
            return this.$message.error(res.msg)
          }
          // 登录弹出框
          this.$message.success(res.msg)
          await this.getUserList()
          this.registerDialog = false
        })
      },
      // 获取用户list
      async getUserList () {
        const { data: res } = await this.$http.get('getUserList', { params: this.queryInfo })
        this.userList = res.data.userList
        this.total = res.data.total
      },
      // 监听显示数改变
      handleSizeChange (newSize) {
        this.queryInfo.pageSize = newSize
        this.getUserList()
      },
      // 监听页面值改变
      handleCurrentChange (newPage) {
        this.queryInfo.pageNum = newPage
        this.getUserList()
      },
      // 改变用户状态
      async changeStatus (userInfo) {
        const { data: res } = await this.$http.post('changeUserStatus', userInfo)
        if (res.code === 100) {
          return this.$message.success(res.msg)
        } else {
          if (userInfo.status === 1) {
            userInfo.status = 2
          } else {
            userInfo.status = 1
          }
          this.$message.error(res.msg)
        }
      },
      // 重置新增用户表单
      resetAddForm () {
        this.registerForm.role.roleId = '0'
        this.$refs.registerForm.resetFields()
      },
      // 重置用户修改表单
      clearEditUser () {
        this.$refs.editUserForm.resetFields()
      },
      // 删除用户
      deleteUser (id) {
        this.$confirm('此操作会删除用户, 是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.get('deleteUser', { params: { id: id } }).catch(err => {
            return this.$message.error(err)
          }).then(res => {
            if (res.data.code !== 100) {
              return this.$message.error(res.data.msg)
            }
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getUserList()
            // 为当前页面最后一个时，即删除的为当前页面的最后一个
            if (this.userList.length === 1) {
              this.queryInfo.pageNum = this.queryInfo.pageNum - 1
              this.getUserList()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 获取角色list
      getRoleList () {
        this.$http.get('findRole').then(res => {
          this.roleList = res.data.data
        })
      },
      // 根据用户id查询信息
      findUser (id) {
        this.editUserDialog = true
        this.$http.get('findUser', { params: { id: id } }).then(res => {
          this.editUserForm = res.data.data
        })
      },
      // 修改用户
      editUser () {
        this.$refs.editUserForm.validate(async valid => {
          if (!valid) return
          this.$http.post('editUser', this.editUserForm).then(res => {
            const data = res.data
            if (data.code !== 100) {
              return this.$message.error(data.msg)
            }
            this.editUserDialog = false
            this.getUserList()
            this.$message.success(data.msg)
          })
        })
      }
    },
    created () {
      this.getUserList()
      this.getRoleList()
    }
  }
</script>

<style scoped lang="less">

</style>
