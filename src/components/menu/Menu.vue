<template>
  <div>

    <el-upload
      ref="upload"
      :auto-upload="false"
      :file-list="fileList"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      action="http://localhost:9999/upload/uploadFile"
      class="upload-demo">
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button size="small" style="margin-left: 10px;" type="success" @click="submitUpload">上传到服务器</el-button>
      <div slot="tip" class="el-upload__tip" style="margin-bottom: 20px">提示</div>
    </el-upload>

<!--    <el-upload
      action="http://localhost:9999/upload/uploadFile"
      class="upload-demo"
      drag
      multiple>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>-->

    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
      <el-breadcrumb-item>菜单设置</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input v-model="queryInfo.query" clearable placeholder="请输入内容" @clear="getMenuList">
            <el-button slot="append" icon="el-icon-search" @click="getMenuList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="roleDialog = true">添加菜单</el-button>
        </el-col>
      </el-row>
      <!--表格区域-->
      <el-table :data="menuList" border stripe>
        <el-table-column type="index">
        </el-table-column>
        <!--<el-table-column type="selection" label="#">
        </el-table-column>-->
        <el-table-column label="菜单名称" prop="menuName">
        </el-table-column>
        <el-table-column label="菜单icon" prop="icon">
        </el-table-column>
        <el-table-column label="菜单等级" prop="menuType">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="0"
              :inactive-value="1"
              active-color="#13ce66"
              active-text="展示"
              inactive-color="#ff4949"
              inactive-text="隐藏"
              @change="changeStatus(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!--修改按钮-->
            <el-button icon="el-icon-edit" size="mini" type="primary" @click="findMenu(scope.row.menuId)"></el-button>
            <!--权限按钮-->
            <el-tooltip :enterable="false" content="权限配置" effect="dark" placement="top">
              <el-button icon="el-icon-setting" size="mini"
                         type="warning" @click="authorityDialog = true,getRoleMenuList(scope.row.roleId)"></el-button>
            </el-tooltip>
            <!--删除按钮-->
            <el-button icon="el-icon-delete" size="mini" type="danger"
                       @click="deleteRole(scope.row.roleId)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="queryInfo.pageNum"
        :page-size="queryInfo.pageSize"
        :page-sizes="[1, 2, 5, 10]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>
    </el-card>
    <!--新增角色-->
    <el-dialog :visible.sync="roleDialog" title="新增角色" @close="clearAddForm">
      <el-form ref="addRoleForm" :model="addRoleForm" :rules="addRoleFormRules" status-icon>
        <el-form-item :label-width="formLabelWidth" label="角色名称" prop="roleName" style="margin-right: 120px">
          <el-input v-model="addRoleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>
    <!--角色权限配置-->
    <el-dialog :visible.sync="authorityDialog" title="角色权限设置">
      <template>
        <el-tree
          ref="tree"
          :data="menus"
          :load="loadNode"
          lazy
          node-key="id"
          show-checkbox
        >
        </el-tree>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="authorityDialog = false">取 消</el-button>
        <el-button type="primary" @click="configAuthority">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Menu',
  data () {
    return {
      fileList: [],
      menuList: [],
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
      formLabelWidth: '120px',
      isIndeterminate: true
    }
  },
  methods: {
    submitUpload () {
      this.$refs.upload.submit()
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    // 监听显示数改变
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getMenuList()
    },
    // 监听页面值改变
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getMenuList()
    },
    // 获取角色list
    getMenuList () {
      this.$http.get('/menu/menuList', { params: this.queryInfo }).then(res => {
        console.log(res)
        this.menuList = res.data.data
        this.total = res.data.data.length
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
        // 数据校验失败返回
        if (!valid) return
        // 发送请求
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
    this.getMenuList()
  }
}
</script>

<style scoped>

</style>
