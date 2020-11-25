<template>
  <el-container class="home-container">
    <!--侧边栏-->
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <!--span>Hello</span>-->
      <el-menu background-color="#324157"
               text-color="#fff"
               active-text-color="#409EFF"
               unique-opened
               :collapse="isCollapse"
               :collapse-transition="false"
               router
      >
        <!--一级菜单-->
        <template v-for="item in menuList">
          <el-menu-item index="/welcome" v-if="item.children==null" :key="item.id">
            <i class="el-icon-s-home"></i>
            <span>首页</span>
          </el-menu-item>
        </template>
        <template v-for="item in menuList">
          <el-submenu v-if="item.children!=null" :key="item.id" :index="item.menuName">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{item.menuName}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item :index="child.path" v-for="child in item.children" :key="child.id">
              <template slot="title">
                <i :class="child.icon"></i>
                <span>{{child.menuName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </template>
      </el-menu>
    </el-aside>
    <!--页面主体区域-->
    <el-container>
      <!--头部区域-->
      <el-header>
        <el-button @click="collapseMenu" icon="el-icon-s-fold" plain style="background-color: #242f42"></el-button>
        <div>
          <div class="block"><el-avatar :size="50" src="./src/assets/image/logo.png" style="float: right"></el-avatar></div>
        <el-dropdown>
        <span class="el-dropdown-link">
          小明同学<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item @click.native="outLogin" divided>退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown></div>
      </el-header>
      <!--右侧区域-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    created () {
      this.getMenuList()
    },
    data () {
      return {
        menuList: [],
        isCollapse: false
      }
    },
    name: 'Home',
    methods: {
      // 获取菜单list
      async getMenuList () {
        const { data: res } = await this.$http.get('menuList')
        this.menuList = res.data
        console.log(res.data)
      },
      outLogin () {
        window.sessionStorage.clear()
        this.$router.push('/')
      },
      collapseMenu () {
        this.isCollapse = !this.isCollapse
      }
    }
  }
</script>

<style scoped lang="less">
  .home-container {
    height: 100%;
  }

  .el-header {
    background-color: #242f42;
    color: #333;
    text-align: center;
    line-height: 60px;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;

    > div {
      display: flex;
      align-items: center;

      span {
        color: #dddddd;
        margin-left: 15px;
      }
    }
  }

  .el-aside {
    background-color: #324157;

    .el-menu {
      border-right: none;
    }
  }

  .toggle-button {
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #dddddd;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
