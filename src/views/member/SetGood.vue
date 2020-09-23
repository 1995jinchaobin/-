<template>
  <div class="setgood">
    <nav-top>
      <span slot="one">会员管理</span>
      <span slot="two">发放矿机</span>
    </nav-top>
    <el-form
      :model="setGoodForm"
      label-width="150px"
      :rules="setGoodFormRules"
      ref="setGoodFormRef">
      <el-form-item
        label="用户名"
        prop="userAccount">
        <el-input v-model="setGoodForm.userAccount"></el-input>
      </el-form-item>
      <el-form-item
        label="发放产品">
        <el-select
          v-model="setGoodForm.id"
          placeholder="请选择发放矿机类型">
          <el-option
            v-for="item in machineLists"
            :key="item.id"
            :label="item.machinename"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="发放数量">
        <el-select
          v-model="setGoodForm.num"
          placeholder="请选择发放数量">
          <el-option
            v-for="item in goodNumList"
            :key="item.id"
            :label="item.machinename"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-button
        type="primary"
        @click="setGoodBtn"
        class="setBtn">发放
      </el-button>
    </el-form>
    <!-- 查询记录表 -->
    <div class="table">
      <div class="rechangeFont">
        <span class="rechange">充值记录</span>
        <el-input
        placeholder="请输入充值账号"
        v-model="searchGoodInfoParams.userId"
        clearable
        @clear="getGoodInfoList">
          <el-button slot="append" icon="el-icon-search" @click="getGoodInfoList"></el-button>
        </el-input>
      </div>
      <el-table
        :data="searchGoodInfoList"
        stripe
        border
      >
        <el-table-column label="序号" type="index" width="60px" align="center"></el-table-column>
        <el-table-column prop="userId" label="用户名" align="center"></el-table-column>
        <el-table-column prop="machineName" label="发放矿机" align="center"></el-table-column>
        <el-table-column prop="num" label="发放矿机数量" align="center"></el-table-column>
        <el-table-column prop="provideTime" label="发放时间" align="center"></el-table-column>
      </el-table>
      <!-- 底部分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchGoodInfoParams.currenPage"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="searchGoodInfoParams.selectCount"
        layout="total, sizes, prev, pager, next, jumper"
        :total="allTotal">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import NavTop from '@/components/common/NavTop.vue'
export default {
  components: {
    NavTop
  },
  data () {
    var validatePass = async (rule, value, callback) => {
      if (value === '') return callback(new Error('请输入用户名'))
      await this.checkUserName()
      if (this.status === 0) {
        callback(new Error('输入用户名不存在'))
      } else if (this.status === 1) {
        callback()
      }
    }
    return {
      selectName: '',
      id: null,
      machineLists: [],
      setGoodForm: {
        userAccount: '',
        id: null,
        num: null
      },
      setGoodFormRules: {
        userAccount: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ]
      },
      goodNumList: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 }
      ],
      goodNum: null,
      searchGoodInfoList: [],
      allTotal: 0,
      searchGoodInfoParams: {
        selectCount: 10,
        currenPage: 1,
        userId: ''
      }
    }
  },
  created () {
    this.getGoodInfoList()
    this.getGoodlist()
  },
  methods: {
    // 矿机类型检测
    async getGoodlist () {
      const { data: res } = await this.$http.get('grantMachine/select')
      console.log(res)
      this.machineLists = res.data.machineLists
    },
    // 发放记录
    async getGoodInfoList () {
      console.log(this.searchGoodInfoParams)
      const { data: res } = await this.$http.get('/grantMachine/pageSelect', { params: this.searchGoodInfoParams })
      console.log(res)
      this.searchGoodInfoList = res.data.pagelist.pageData
      this.allTotal = res.data.pagelist.totalCount
    },
    // 发放按钮
    setGoodBtn () {
      this.$refs.setGoodFormRef.validate(async value => {
        if (!value) return
        console.log(this.setGoodForm)
        if (this.setGoodForm.id !== null && this.setGoodForm.num !== null) {
          console.log(this.setGoodForm)
          const { data: res } = await this.$http.post('grantMachine/insert', this.setGoodForm)
          console.log(res)
          if (res.code !== 100) { return this.$message.error('发放矿机失败') } else {
            this.setGoodForm = {
              userAccount: '',
              id: null,
              num: null
            }
            return this.$message.success('发放矿机成功')
          }
        } else {
          return this.$message.error('请填写完整的信息')
        }
      })
    },
    // 检测用户
    async checkUserName () {
      const { data: res } = await this.$http.get('rechargeList/selectUserNameIfExist', { params: { userName: this.setGoodForm.userAccount } })
      this.status = res.data.queryUserNameIfExistData
      console.log(res)
      console.log(this.status)
    },
    // 页面条数
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.searchGoodInfoParams.selectCount = val
      this.getGoodInfoList()
    },
    // 页数变化
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.searchGoodInfoParams.currenPage = val
      this.getGoodInfoList()
    }
  }
}
</script>

<style scoped lang='scss'>
.el-form{
  width: 50%;
  margin-top: 30px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
.el-select{
  height: 40px;
  width: 100%;
}
.setBtn{
  right: 0%;
  position: absolute;
}
.table{
  position: relative;
  top: 60px;
  border-top: 1px solid #ccc;
  .rechangeFont{
    display: flex;
    margin: 20px;
    .rechange{
      width: 100px;
      line-height: 40px;
    }
    .el-input{
      width: 300px;
    }
  }
}
</style>
