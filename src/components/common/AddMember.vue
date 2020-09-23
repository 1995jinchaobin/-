<template>
  <div class="addMember">
      <div class="form">
        <el-form
        ref="addMemberFormRef"
        :model="addMemberForm"
        label-width="150px"
        :rules="addMemberFormRules">
          <el-form-item label="用户账号" prop="useraccount">
            <el-input v-model="addMemberForm.useraccount" v-if="dialogTitie==='修改信息'" disabled></el-input>
            <el-input v-model="addMemberForm.useraccount" v-else></el-input>
          </el-form-item>
          <el-form-item label="真实姓名" prop="username">
            <el-input v-model="addMemberForm.username"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="sfz">
            <el-input v-model="addMemberForm.sfz"></el-input>
          </el-form-item>
          <el-form-item label="A金币数量" prop="agold">
            <el-input v-model="addMemberForm.agold"></el-input>
          </el-form-item>
          <el-form-item label="B金币数量" prop="htchtc">
            <el-input v-model="addMemberForm.htc"></el-input>
          </el-form-item>
          <el-form-item label="上级账号" prop="superioraccount">
            <el-input v-model="addMemberForm.superioraccount"></el-input>
          </el-form-item>
          <el-form-item label="会员等级" prop="level">
            <el-input v-model="addMemberForm.level"></el-input>
          </el-form-item>
          <el-form-item label="微信" prop="wx">
            <el-input v-model="addMemberForm.wx"></el-input>
          </el-form-item>
          <el-form-item label="支付宝" prop="alipay">
            <el-input v-model="addMemberForm.alipay"></el-input>
          </el-form-item>
          <el-form-item label="钱包地址" prop="address">
            <el-input v-model="addMemberForm.address"></el-input>
          </el-form-item>
          <el-form-item label="卡号" prop="card">
            <el-input v-model="addMemberForm.card"></el-input>
          </el-form-item>
          <el-form-item label="银行预留手机号" prop="ipone">
            <el-input v-model="addMemberForm.ipone"></el-input>
          </el-form-item>
          <el-form-item label="登录密码" prop="loginpassword">
            <el-input v-model="addMemberForm.loginpassword"></el-input>
          </el-form-item>
          <el-form-item label="交易密码" prop="transactionpassword">
            <el-input v-model="addMemberForm.transactionpassword"></el-input>
          </el-form-item>
        </el-form>
      </div>
  </div>
</template>

<script>
export default {
  props: ['addMemberForm', 'dialogTitie'],
  data () {
    const checkidcard = (rule, value, callback) => {
      const regEmail = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的身份证号'))
    }
    const checkusername = async (rule, value, callback) => {
      if (value === '') return callback(new Error('请输入用户账号'))
      await this.getUsername()
      if (this.usernameStatus === 200) {
        callback(new Error('输入用户账号已存在'))
      } else if (this.status === 1) {
        callback()
      }
    }
    return {
      addMemberFormRules: {
        useraccount: [
          { validator: checkusername, trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' }
        ],
        sfz: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { validator: checkidcard, trigger: 'blur' }
        ]
      },
      usernameStatus: null
    }
  },
  created () {

  },
  methods: {
    // 关闭表单
    closeForm () {
      // console.log(this.dialogTitie)
      this.$refs.addMemberFormRef.clearValidate()
    },
    // 修改
    // changeForm () {
    //   console.log(1234)
    // }
    async getUsername () {
      const { data: res } = await this.$http.get(`/newTable/checkUserAccount?userAccount=${this.addMemberForm.useraccount}`)
      // console.log(res)
      this.usernameStatus = res.code
      // console.log(this.usernameStatus)
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
