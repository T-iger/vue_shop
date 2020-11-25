<template>
  <div class="root">
    <div>
      <div class="login_box">
        <!--头像区域-->
        <div class="avatar_box">
          <img src="../assets/image/user.jpg" alt="">
        </div>
        <!--登录表单区-->
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
          <!--用户名-->
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
          </el-form-item>
          <!--密码-->
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" prefix-icon="el-icon-lock"></el-input>
          </el-form-item>
          <!--按钮-->
          <el-form-item class="btns">
            <el-button type="primary" @click="login" plain>登录</el-button>
            <el-button type="info" @click="dialogFormVisible = true" plain>注册</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!--弹出层-->
    <el-dialog title="注册" :visible.sync="dialogFormVisible">
      <el-form ref="registerForm" :model="registerForm" :rules="registerFormRules">
        <el-form-item prop="username" label="姓名" :label-width="formLabelWidth" style="margin-right: 120px">
          <el-input v-model="registerForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item @focusout.native="checkLogin" :error="errorMsg" prop="login_name" label="登录名" :label-width="formLabelWidth" style="margin-right: 120px">
          <el-input v-model="registerForm.login_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码" :label-width="formLabelWidth" style="margin-right: 120px">
          <el-input v-model="registerForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="re_password"  label="确认密码" :label-width="formLabelWidth"
                      style="margin-right: 120px">
          <el-input v-model="registerForm.re_password" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="register">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data () {
      // 校验两次输入的密码
      const check = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.registerForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        loginForm: {
          username: 'admin',
          password: '123456'
        },
        loginFormRules: {
          username: [
            {
              required: true,
              message: '请输入用户名',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 5,
              message: '长度在 3 到 5 个字符',
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
        registerForm: {
          username: '12345',
          login_name: '123456',
          password: '123456',
          re_password: '123456'
        },
        registerFormRules: {
          username: [
            {
              required: true,
              message: '请输入用户名',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 5,
              message: '长度在 3 到 5 个字符',
              trigger: 'blur'
            }
          ],
          login_name: [
            {
              required: true,
              message: '请输入登录名',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 5,
              message: '长度在 3 到 5 个字符',
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
              validator: check,
              trigger: 'blur'
            }
          ]
        },
        dialogTableVisible: false,
        dialogFormVisible: false,
        formLabelWidth: '100px',
        errorMsg: ''
      }
    },
    methods: {
      // 表单的验证
      login () {
        this.$refs.loginFormRef.validate(async valid => {
          if (!valid) return
          const User = {
            password: this.loginForm.password,
            loginName: this.loginForm.username
          }
          const { data: res } = await this.$http.post('login', User).catch(err => {
            // 出错时返回服务器状态
            return this.$message.error(err)
          })
          console.log(res)
          if (res.code !== 100) {
            return this.$message.error(res.msg)
          }
          // 登录弹出框
          this.$message.success(res.msg)
          // 保存token到sessionStorage中
          window.sessionStorage.setItem('token', res.data.token)
          await this.$router.push('/home')
        })
      },
      register () {
        this.$refs.registerForm.validate(async valid => {
          if (!valid) return
          const User = {
            userName: this.registerForm.username,
            loginName: this.registerForm.login_name,
            password: this.registerForm.password
          }
          const { data: res } = await this.$http.post('register', User).catch(err => {
            // 出错时返回服务器状态
            return this.$message.error(err)
          })
          console.log(res)
          if (res.code !== 100) {
            return this.$message.error(res.msg)
          }
          // 登录弹出框
          this.$message.success(res.msg)
          this.dialogFormVisible = false
          // await this.$router.push('/home')
        })
      },
      // 检查用户名唯一性(注册时)
      async checkLogin () {
        console.log(this.registerForm.login_name)
        const loginName = { loginName: this.registerForm.login_name }
        const { data: res } = await this.$http.post('checkUser', loginName).catch(err => {
          // 出错时返回服务器状态
          return this.$message.error(err)
        })
        console.log(res)
        if (res.code !== 100) {
          this.errorMsg = res.msg
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .root {
    background-color: #2b4b6b;
    /*background-image:url("../assets/login.jpg");*/
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avatar_box {
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      transform: translate(-50%, -50%);
      left: 50%;
      position: absolute;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }

  .btns {
    display: flex;
    left: 50%;
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
</style>
