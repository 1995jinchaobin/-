<template>
  <div class="login">
    <div class="loginContent">
      <div class="loginTop">后台管理系统</div>
      <div class="loginForm">
        <!-- <div class="loginForm"> -->
        <el-form
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef">
          <el-form-item prop="userName">
            <el-input v-model="loginForm.userName" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item prop="loginPassword">
            <el-input v-model="loginForm.loginPassword" placeholder="登录密码" type="password"></el-input>
          </el-form-item>
          <!-- <el-form-item prop="code"> -->
            <!-- <el-form-item>
              <PuzzleVerification
              style="display:block"
              v-model="VerificationShow"
              :puzzleImgList="puzzleImgList"
              deviation="20"
              blockType="puzzle"
              :onSuccess="handleSuccess"
              :onError="hangleErrror"
              /> -->
            <!-- </el-form-item> -->
        </el-form>
        <button class="loginBtn" @click="loginFormBtn">登录</button>
        <button class="resetBtn" @click="resetLoginForm">重置</button>
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>

<script>
// import PuzzleVerification from 'vue-puzzle-verification'
const Base64 = require('js-base64').Base64
export default {
  name: 'login',
  components: {
    // PuzzleVerification
  },
  data () {
    return {
      components: {
        // PuzzleVerification
      },
      // VerificationShow: true,
      // isVerificationShow: false,
      // puzzleImgList: [
      //   require('@/assets/img/login.jpg')
      // ],
      loginForm: {
        userName: '',
        loginPassword: ''
        // code: ''
      },
      loginFormRules: {
        userName: [
          { required: true, message: '请输入登陆账号', trigger: 'blur' }
          // { min: 3, max: 10, message: '长度在3-10个字符', trigger: 'blur' }
        ],
        loginPassword: [
          { required: true, message: '请输入登陆密码', trigger: 'blur' }
          // { min: 6, max: 15, message: '长度在6-15个字符', trigger: 'blur' }
        ]
        // code: [
        //   { required: true, message: '请输入验证码', trigger: 'blur' }
        // ]
      },
      url: ''
    }
  },
  // created () {
  // this.url = 'http://192.168.5.6:8080/demo/kaptcha/code'
  // },
  methods: {
    // handleSuccess () {
    //   this.isVerificationShow = true
    // },
    // hangleErrror () {
    //   this.isVerificationShow = false
    // },
    // async getUrl(){
    //   const a = a
    // },
    // 表单重置按钮
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    // 表单登录按钮
    loginFormBtn () {
      // console.log(this.isVerificationShow)
      // if (!this.isVerificationShow) return this.$message.error('请滑动滑块到正确位置')
      // console.log(this.loginForm)
      this.$refs.loginFormRef.validate(async value => {
        if (!value) return
        const { data: b } = await this.$http.post('user/login', this.loginForm)
        console.log(b)
        if (b.code !== 100) return this.$message.error('登录失败')
        this.$message.success('登陆成功')
        window.sessionStorage.setItem('userToken', b.data.userToken)
        const obj = Base64.encode(JSON.stringify(b.data.userAuthority))
        window.sessionStorage.setItem('obj', obj)
        // console.log(b.data.userAuthority)
        window.sessionStorage.setItem('idc', b.data.idc)
        window.sessionStorage.setItem('userName', b.data.userName)
        const mm = Base64.encode(b.data.loginPassword)
        window.sessionStorage.setItem('passWord', mm)
        this.$router.push('/statistical')
        // this.$router.push({
        //   // path: '/home',
        //   name: 'home',
        //   params: b.data.userAuthority
        // })
      })
    }
    // 验证码切换
    // async changeyanz () {
    // console.log(a)
    // console.log(1)
    // const a = await this.$http.get('http://192.168.0.107:8080/demo/kaptcha/code?d=' + new Date().getTime())
    // const a = await this.$http({
    //   methods: 'get',
    //   xhrFields: { withCredentials: true },
    //   crossDomain: true,
    //   url: 'http://192.168.5.6:8080/demo/kaptcha/code'
    // })
    // this.url = 'http://192.168.0.107:8080/demo/kaptcha/code?d=' + new Date().getTime()
    // console.log(this.url)
    // console.log(a)
    // console.log(a.config.url)
    // }
  }
}
</script>

<style lang='scss' scpoed>
.login{
  background-color: #4D4D4D;
  width: 100%;
  height: 100%;
  min-width: 600px;
  min-height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
  .loginContent{
    width: 300px;
    height: 350px;
    position: relative;
    // background-color: #ccc;
    .loginTop{
      position: absolute;
      left: 50%;
      transform: translate(-50%);
      color: #fff;
      font-size: 20px;
    }
  }
  .loginForm{
    position: absolute;
    top: 40px;
    // background-color: aqua;
    width: 100%;
    input{
      border: none;
      outline:none !important;
      background-color:rgba(0,0,0,0)  ;
      width: 100%;
      // margin: 5px auto;
      height: 40px;
      border-bottom: 1px solid #fff;
      font-size: 18px;
      color: #fff;
    }
    .el-form-item__content{
      display: flex;
      .code{
      flex:3;
      }
      .imgCode{
      flex: 2;
      background-color:#fff;
      height: 40px;
      margin-left: 5px;
      cursor: pointer;
      }
    }
  }
  .loginBtn{
    width: 100%;
    margin-top: 40px;
    height: 40px;
    outline: none;
    border-radius: 7px;
    cursor: pointer;
    background-color: #fff;
    // font-size: 18px;
  }
  .resetBtn{
    width: 100%;
    background-color:rgba(0,0,0,0);
    border-radius: 7px;
    outline: none;
    border: 1px solid #fff;
    height: 40px;
    margin-top: 20px;
    color: #fff;
    cursor: pointer;
  }
}
</style>
