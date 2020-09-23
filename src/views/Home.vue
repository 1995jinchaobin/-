<template>
  <!-- <div class="home"> -->
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <div class="titleTop">
          后台管理
        </div>
        <div class="rightIcon">
          <div class="imgTop">
            <img src="@/assets/img/user.jpg" alt="头像" title="头像">
          </div>
          <div class="userTop">
            <div>欢迎光临</div>
            <span>{{userName}}</span>
          </div>
          <i class="el-icon-caret-bottom"></i>
          <div class="sitebtn">
            <i class="el-icon-caret-top"></i>
            <div class="modepassword" @click="modepassword">
              <i class="el-icon-s-tools"></i>
              <span>修改密码</span>
            </div>
            <div class="returnbtn" @click="returnlogin">
              <i class="el-icon-switch-button"></i>
              <span>退出</span>
            </div>
          </div>
        </div>
      </el-header>
      <!-- 页面主题区域 -->
      <el-container class="main">
        <!-- 侧边栏 -->
        <el-aside :width="togCollapse? '30px':'200px'">
          <div @click="tog" class="changeIcon">
            <i class="el-icon-d-arrow-left" v-if="!togCollapse"></i>
            <i class="el-icon-d-arrow-right" v-else></i>
          </div>
          <!-- 菜单栏 -->
          <el-menu
          background-color="#F2F2F2"
          text-color="#6C6C6C"
          active-text-color="#409bff"
          unique-opened
          :collapse='togCollapse'
          :collapse-transition="false"
          :router="true"
          :default-active="activePath">
            <!-- 一级菜单 -->
            <el-submenu index='0'>
              <template slot="title">
                <i class="iconfont icon-cangku"></i>
                <span>网站统计</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item index="statistical" @click="saveNavState('statistical')" >网站统计</el-menu-item>
            </el-submenu>
            <el-submenu index='9' v-if="l.basicView===1||l.machineParamsView===1">
              <template slot="title">
                <i class="iconfont icon-fencengpeizhi"></i>
                <span>网站配置</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item index="jbpeizhi" @click="saveNavState('jbpeizhi')" v-if="l.basicView===1">基本配置</el-menu-item>
              <el-menu-item index="cspeizhi" @click="saveNavState('cspeizhi')" v-if="l.machineParamsView===1">参数配置</el-menu-item>
            </el-submenu>
            <el-submenu index='1' v-if="l.userView===1">
              <template slot="title">
                <i class="iconfont icon-UserSettings"></i>
                <span>通用管理</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item index="user" @click="saveNavState('user')" >用户管理</el-menu-item>
            </el-submenu>
            <el-submenu index='2' v-if="l.operationLogView===1||l.commentView===1||l.advertisementView==1">
              <template slot="title">
                <i class="iconfont icon-rejected-order-fill"></i>
                <span>内容管理</span>
              </template>
              <el-menu-item index="record" @click="saveNavState('record')" v-if="l.operationLogView===1">记录管理</el-menu-item>
              <el-menu-item index="comment" @click="saveNavState('comment')" v-if="l.commentView===1">评论管理</el-menu-item>
              <el-menu-item index="ad" @click="saveNavState('ad')" v-if="l.advertisementView==1">广告列表</el-menu-item>
            </el-submenu>
            <el-submenu index='3' v-if="l.videoView===1">
              <template slot="title">
                <i class="iconfont icon-set"></i>
                <span>系统设置</span>
              </template>
              <el-menu-item index="generalInfo" @click="saveNavState('generalInfo')">视频权限</el-menu-item>
            </el-submenu>
            <el-submenu index='4' v-if="l.noticeView===1||l.goodsView===1||l.orderView===1">
              <template slot="title">
                <i class="iconfont icon-all-fill"></i>
                <span>挖矿系统</span>
              </template>
              <el-menu-item index="notice" @click="saveNavState('notice')" v-if="l.noticeView===1">公告管理</el-menu-item>
              <el-menu-item index="mallAdmin" @click="saveNavState('mallAdmin')" v-if="l.goodsView===1">商城管理</el-menu-item>
              <el-menu-item index="order" @click="saveNavState('order')" v-if="l.orderView===1">订单管理</el-menu-item>
            </el-submenu>
            <el-submenu index='5' v-if="l.goldView===1">
              <template slot="title">
                <i class="iconfont icon-consumption-fill"></i>
                <span>金币区</span>
              </template>
              <el-menu-item index="trade" @click="saveNavState('trade')">金币交易</el-menu-item>
            </el-submenu>
            <el-submenu index='6' v-if="l.rechargeView===1">
              <template slot="title">
                <i class="iconfont icon-cart-Empty-fill"></i>
                <span>充值区</span>
              </template>
              <el-menu-item index="invest" @click="saveNavState('invest')">充值</el-menu-item>
            </el-submenu>
            <el-submenu index='7' v-if="l.vipView===1">
              <template slot="title">
                <i class="iconfont icon-vip-fill"></i>
                <span>会员管理</span>
              </template>
              <el-menu-item index="member" @click="saveNavState('member')">会员管理</el-menu-item>
              <el-menu-item index="setgood" @click="saveNavState('setgood')">发放矿机</el-menu-item>
            </el-submenu>
            <el-submenu index='8' v-if="l.machineView===1||l.machineinfoView===1">
              <template slot="title">
                <i class="iconfont icon-credit-level-fill"></i>
                <span>矿机管理</span>
              </template>
              <el-menu-item index="mineSite" @click="saveNavState('mineSite')" v-if="l.machineView===1">矿机设置</el-menu-item>
              <el-menu-item index="mineInfo" @click="saveNavState('mineInfo')" v-if="l.machineinfoView===1">矿机详情</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右侧内容主体 -->
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
      <el-dialog
      title="密码修改"
      :visible.sync="movepasswordDialog"
      width="60%"
      @close="closeDialog"
      :close-on-click-modal='false'>
        <el-form
        ref="addAnnouceFormRef"
        :model="addAnnouceForm"
        :rules="addAnnouceRules"
        label-width="100px">
          <el-form-item
          label="旧密码"
          prop="oldPassword">
            <el-input v-model="addAnnouceForm.oldPassword" placeholder="请输入旧密码"></el-input>
          </el-form-item>
          <el-form-item
          label="新密码"
          prop="password">
            <el-input
            placeholder="请输入新密码"
            v-model="addAnnouceForm.password">
            </el-input>
          </el-form-item>
          <el-form-item
          label="重复新密码"
          prop="newpassword">
            <el-input
            placeholder="请再次输入新密码"
            v-model="addAnnouceForm.newpassword">
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="movepasswordDialog = false">取 消</el-button>
          <el-button type="primary" @click="addAnnouceSureBtn">确 定</el-button>
        </span>
      </el-dialog>
    </el-container>
  <!-- </div> -->
</template>

<script>
const Base64 = require('js-base64').Base64
export default {
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入旧密码'))
      } else if (value !== this.oldPassword) {
        callback(new Error('输入旧密码错误!'))
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.addAnnouceForm.password) {
        callback(new Error('两次输入密码不一致'))
      } else if (value === this.oldPassword) {
        callback(new Error('新密码不能和旧密码相同'))
      } else {
        callback()
      }
    }

    return {
      // const Base64 = require('js-base64').Base64,
      // 网页宽度
      screenWidth: document.body.clientWidth,
      // menuList: [
      //   {
      //     id: 1,
      //     authname: '通用功能',
      //     class: 'icon-UserSettings',
      //     children: [
      //       { name: '用户管理', id: 11, url: 'user' }
      //     ]
      //   },
      //   {
      //     id: 2,
      //     authname: '内容管理',
      //     class: 'icon-rejected-order-fill',
      //     children: [
      //       { name: '记录管理', id: 21, url: 'record' },
      //       { name: '评论管理', id: 22, url: 'comment' },
      //       { name: '广告列表', id: 23, url: 'ad' }
      //     ]
      //   },
      //   {
      //     id: 3,
      //     class: 'icon-set',
      //     authname: '系统设置',
      //     children: [
      //       { name: '通用管理', id: 31, url: 'generalInfo' }
      //     ]
      //   },
      //   {
      //     id: 4,
      //     authname: '挖矿系统',
      //     class: 'icon-all-fill',
      //     children: [
      //       { name: '公告管理', id: 41, url: 'notice' },
      //       // { name: '公告列表', id: 42, url: 'list' },
      //       // { name: '首页弹出公告', id: 43, url: 'homeUp' },
      //       { name: '商城管理', id: 44, url: 'mallAdmin' },
      //       { name: '订单管理', id: 45, url: 'order' }
      //     ]
      //   },
      //   {
      //     id: 5,
      //     class: 'icon-consumption-fill',
      //     authname: '金币区',
      //     children: [
      //       { name: '金币交易', id: 51, url: 'trade' }
      //     ]
      //   },
      //   {
      //     id: 6,
      //     class: 'icon-cart-Empty-fill',
      //     authname: '充值区',
      //     children: [
      //       { name: '充值', id: 61, url: 'invest' }
      //     ]
      //   },
      //   {
      //     id: 7,
      //     authname: '会员管理',
      //     class: 'icon-vip-fill',
      //     children: [
      //       { name: '会员管理', id: 71, url: 'member' }
      //     ]
      //   },
      //   {
      //     id: 8,
      //     authname: '矿机管理',
      //     class: 'icon-credit-level-fill',
      //     children: [
      //       { name: '矿机设置', id: 82, url: 'mineSite' },
      //       { name: '矿机详情', id: 81, url: 'mineInfo' }
      //     ]
      //   }
      // ],
      togCollapse: false,
      activePath: '',
      movepasswordDialog: false,
      addAnnouceForm: {
        oldPassword: '',
        password: '',
        newpassword: ''
      },
      // 验证添加
      addAnnouceRules: {
        oldPassword: [
          // { required: true, message: '请输入旧密码', trigger: 'blur' }
          // { min: 3, message: '长度在3个字符以上', trigger: 'blur' }
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, message: '长度在3个字符以上', trigger: 'blur' }
        ],
        newpassword: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      },
      l: {},
      userName: '',
      oldPassword: '',
      idc: 0
    }
  },
  created () {
    this.activePath = window.sessionStorage.getItem('activePath')
    this.userName = window.sessionStorage.getItem('userName')
    const mm = window.sessionStorage.getItem('passWord')
    this.oldPassword = Base64.decode(mm)
    this.idc = window.sessionStorage.getItem('idc')
    // const a = this.$route.params
    // console.log(a)
    const obj = window.sessionStorage.getItem('obj')
    this.l = JSON.parse(Base64.decode(obj))
    // this.l = JSON.parse(window.sessionStorage.getItem('obj'))
    console.log(this.l)
    // console.log(this.userName)
    this.$router.push(this.activePath)
  },
  methods: {
    // 菜单栏折叠
    tog () {
      this.togCollapse = !this.togCollapse
    },
    // 保存菜单栏切换高亮
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
      // console.log(activePath)
    },
    // 修改密码
    modepassword () {
      this.movepasswordDialog = true
    },
    // 修改密码对话框关闭
    closeDialog () {
      this.$refs.addAnnouceFormRef.resetFields()
    },
    // 修改密码确定按钮
    addAnnouceSureBtn () {
      this.$refs.addAnnouceFormRef.validate(async value => {
        if (!value) return
        const a = {
          idc: parseInt(this.idc),
          password: this.addAnnouceForm.newpassword
        }
        // console.log(a)
        const { data: res } = await this.$http.put('user/updataPassword', a)
        // console.log(res)
        if (res.code !== 100) return this.$message.error('修改密码失败')
        this.$message.success('修改密码成功')
        this.movepasswordDialog = false
        this.$router.push('/login')
      })
    },
    // 账号退出按钮
    returnlogin () {
      window.sessionStorage.clear()
      this.$router.push('login')
    }
    // 旧密码失去焦点
    // changeCount () {
    //   console.log(123)
    //   if (this.addAnnouceForm.newTitle.length < 13) {
    //     this.$message.error('密码错误')
    //     callback(new Error('请再次输入密码'))
    //   }
    // }
  },
  mounted () {
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        that.screenWidth = window.screenWidth
      })()
    }
  },
  watch: {
    screenWidth (val) {
      // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
      if (!this.timer) {
        // 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
        this.screenWidth = val
        this.timer = true
        const that = this
        setTimeout(function () {
          // 打印screenWidth变化的值
          // console.log(that.screenWidth)
          if (val <= 1000) {
            that.togCollapse = true
          } else {
            that.togCollapse = false
          }
          that.timer = false
        }, 400)
      }
    }
  }
}
</script>

<style lang='scss'>
.el-container{
  min-width:850px !important;
  .el-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #4C4C4C;
    height: 50px !important;
    color: #fff;
    .titleTop{
      font-size: 1.5rem;
    }
    .rightIcon{
      display: flex;
      align-items: center;
      cursor: pointer;
      .imgTop{
        width: 50px;
        background-color: #fff;
        height: 50px;
        border-radius: 50%;
        img{
          width: 44px;
          height: 44px;
          border-radius: 50%;
          margin: 3px;
          border: 1px solid #ccc;
        }
      }
    }
  }
  .el-container{
    .el-aside{
      .changeIcon{
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #F3F3F3;
        cursor: pointer;
        border-bottom: 1px solid #ccc;
      }
    }
  }
}
.el-submenu__title{
  padding-left: 10px !important;
  border-bottom: 1px solid #ccc;
}
.el-submenu__title:hover{
  background-color: #fff !important;
  color: #409bff !important;
}
.el-main{
  padding: 0 !important;
  border-left: 1px solid #ccc;
}
.el-menu{
  border: none !important;
}
.el-menu-item{
  background-color: #fff !important;
  border-bottom: 1px solid #ccc;
}
.el-container{
  height: 100%;
}
.el-aside{
  background-color: #F2F2F2;
  height: 100%;
}
.el-table{
  margin:auto 20px;
  width: calc(100% - 40px) !important;
}
.el-link{
  margin: auto 5px;
}
.main{
  height: calc(100% - 50px);
}
.sitebtn{
  position: absolute;
  right: 10px;
  top: 50px;
  width: 150px;
  background-color:#fff;
  border:1px solid #ccc;
  color: #000;
  display: none;
  cursor: pointer;
  :hover{
      background-color: rgb(230, 230, 120);
    }
  .el-icon-caret-top{
    position: absolute;
    color:#fff;
    font-size: 20px;
    right: 10px;
    top: -13px;
  }
  .modepassword{
    padding: 10px;
    i{
      margin: auto 5px;
    }
  }
  .returnbtn{
    padding: 10px;
    i{
      margin: auto 5px;
    }
  }
}
.rightIcon:hover .sitebtn{
  display: block;
  z-index: 1000;
}
</style>
