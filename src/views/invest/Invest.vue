<template>
  <div class="Invest">
    <nav-top>
      <span slot="one">充值区</span>
      <span slot="two">充值</span>
    </nav-top>
    <el-form
      ref="rechargeFormRef"
      :model="rechargeForm"
      :rules="rechargeRules"
      class="rechargeForm"
      label-width="150px"
      v-if="iswrite===1">
      <el-form-item
        label="用户账号"
        prop="userName">
        <el-input v-model="rechargeForm.userName" placeholder="请输入用户账号"></el-input>
      </el-form-item>
      <el-form-item
        label="充值A金币"
        prop="amountOfGoldA">
        <el-input v-model="rechargeForm.amountOfGoldA" placeholder="请输入充值A金币数量"></el-input>
      </el-form-item>
      <el-form-item
        label="充值B金币"
        prop="amountOfGoldB">
        <el-input v-model="rechargeForm.amountOfGoldB" placeholder="请输入充值B金币数量"></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="rechargenBtn" class="rechargenBtn" v-if="iswrite===1">充值</el-button>
    <!-- 充值记录搜索 -->
    <div class="rechargeInfo">
      <div class="rechangeFont">
        <span class="rechange">充值记录</span>
        <el-input
        placeholder="请输入充值账号"
        v-model="search.username"
        clearable
        @clear="searchInvest">
          <el-button slot="append" icon="el-icon-search" @click="searchInvest"></el-button>
        </el-input>
      </div>
      <el-table
      :data="rechargeInfo"
      stripe
      border
      >
        <el-table-column label="序号" type="index" width="60px" align="center"></el-table-column>
        <el-table-column prop="username" label="用户账号" align="center"></el-table-column>
        <el-table-column prop="rechargeamounta" label="充值A金币数量" align="center"></el-table-column>
        <el-table-column prop="rechargeamountb" label="充值B金币数量" align="center"></el-table-column>
        <el-table-column prop="rechargetime" label="充值时间" align="center"></el-table-column>
      </el-table>
      <!-- 底部分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="search.currenPage"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="search.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="allTotal">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import NavTop from '@/components/common/NavTop.vue'
const Base64 = require('js-base64').Base64
export default {
  components: {
    NavTop
  },
  data () {
    var validatePass = async (rule, value, callback) => {
      if (value === '') return callback(new Error('请输入用户名'))
      await this.getUsername()
      if (this.status === 0) {
        callback(new Error('输入用户名不存在'))
      } else if (this.status === 1) {
        callback()
      }
    }
    return {
      iswrite: 0,
      rechargeForm: {
        userName: '',
        amountOfGoldA: '',
        amountOfGoldB: ''
      },
      rechargeRules: {
        userName: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ]
      },
      // 充值记录
      rechargeInfo: [],
      // 充值记录搜索
      search: {
        username: '',
        currenPage: 1,
        limit: 10
      },
      allTotal: 0,
      status: 0
    }
  },
  created () {
    this.searchAuthname()
    this.iswrite = JSON.parse(Base64.decode(window.sessionStorage.getItem('obj'))).iswrite
  },
  methods: {
    // 充值按钮
    rechargenBtn () {
      this.$refs.rechargeFormRef.validate(async value => {
        if (!value) return
        console.log(value)
        if (this.rechargeForm.amountOfGoldA !== '') {
          this.rechargeForm.amountOfGoldA = parseFloat(this.rechargeForm.amountOfGoldA)
        }
        // else if (this.rechargeForm.amountOfGoldA === '') {
        //   this.rechargeForm.amountOfGoldA = 0
        // }
        if (this.rechargeForm.amountOfGoldB !== '') {
          this.rechargeForm.amountOfGoldB = parseFloat(this.rechargeForm.amountOfGoldB)
        }
        // else if (this.rechargeForm.amountOfGoldB === '') {
        //   this.rechargeForm.amountOfGoldB = 0
        // }
        console.log(this.rechargeForm)
        // ?userName=long&amountOfGoldA=25000&amountOfGoldB=10000
        const { data: res } = await this.$http.post(`rechargeList/updateRecharge?userName=${this.rechargeForm.userName}&amountOfGoldA=${this.rechargeForm.amountOfGoldA}&amountOfGoldB=${this.rechargeForm.amountOfGoldB}`)
        console.log(res)
        if (res.code !== 100) return this.$message.error('用户充值失败')
        if (res.code === 100) {
          this.$refs.rechargeFormRef.resetFields()
          this.$message.success('用户充值成功')
          this.searchAuthname()
        }
      })
    },
    // 充值记录
    async searchAuthname () {
      console.log(1)
      const { data: res } = await this.$http.get('rechargeList/selectRecharge', { params: this.search })
      console.log(res)
      if (res.code !== 100) return this.$message.error('获取充值记录失败')
      this.rechargeInfo = res.data.rechargeRecordQuery.pageData
      this.allTotal = res.data.rechargeRecordQuery.totalCount
    },
    // 充值记录搜索
    searchInvest () {
      this.search.currenPage = 1
      this.searchAuthname()
    },
    // 每页条数变化
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.search.limit = val
      this.searchAuthname()
    },
    // 页数变化
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.search.currenPage = val
      this.searchAuthname()
    },
    async getUsername () {
      const { data: res } = await this.$http.get('rechargeList/selectUserNameIfExist', { params: { userName: this.rechargeForm.userName } })
      this.status = res.data.queryUserNameIfExistData
      console.log(this.status)
    }
  }
}
</script>

<style scoped lang='scss'>
.rechargeForm{
  // border:1px solid red;
  width: 600px;
  margin-top: 20px;
}
.rechargenBtn{
  margin-left: 150px;
}
.rechargeInfo{
  border-top:1px solid #ccc;
  margin-top: 20px;
  .rechangeFont{
    margin: 20px;
    display: flex;
    width: 500px;
    .rechange{
      width: 100px;
      line-height: 40px;
    }
  }
}
</style>
