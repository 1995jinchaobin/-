<template>
  <div class="Member">
    <nav-top>
      <span slot="one">会员管理</span>
      <span slot="two">会员管理</span>
    </nav-top>
    <div class="commonMain">
      <el-button type="primary" @click="addMemberBtn" class="addMember" v-if="iswrite===1">添加会员</el-button>
      <el-input
      placeholder="请输入用户账号"
      v-model="memberInfo.zh"
      clearable
      @clear="searchUsername">
      <el-button slot="append" icon="el-icon-search" @click="searchUsername"></el-button>
    </el-input>
    </div>
    <el-table
    :data="memberList"
    stripe
    border
    >
      <el-table-column label="序号" type="index" width="60px" align="center"></el-table-column>
      <el-table-column prop="useraccount" label="用户账号" align="center"></el-table-column>
      <el-table-column prop="superioraccount" label="上级账号" align="center"></el-table-column>
      <el-table-column prop="superioraccountid" label="上级ID" align="center"></el-table-column>
      <el-table-column prop="agold" label="A金币数量" align="center"></el-table-column>
      <el-table-column prop="htc" label="B金币数量" align="center"></el-table-column>
      <el-table-column prop="miningmachinery" label="运行矿机数量" align="center"></el-table-column>
      <el-table-column prop="computationalpower" label="团队算力(包含自己算力)" align="center"></el-table-column>
      <el-table-column prop="team" label="团队人数" align="center"></el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.statetwo === 0" class="statetwo0">已激活</span>
          <span v-else-if="scope.row.statetwo===1" class="statetwo1">未激活</span>
          <span>/</span>
          <span v-if="scope.row.state === 0" class="state0">封号</span>
          <span v-else-if="scope.row.state===1" class="state1">未封号</span>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" align="center" prop="time">
      </el-table-column>
      <el-table-column prop="username" label="姓名" align="center"></el-table-column>
      <el-table-column prop="level" label="级别" align="center" width="80px"></el-table-column>
      <el-table-column prop="wx" label="微信" align="center"></el-table-column>
      <el-table-column prop="alipay" label="支付宝" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="220" v-if="iswrite===1">
        <template slot-scope="scope">
          <el-link @click="memberInfoBtn(scope.row)">查看</el-link>
          <el-link @click="jihuo(scope.row)" v-if="scope.row.statetwo === 1">激活</el-link>
          <el-link @click="jihuo(scope.row)" v-else-if="scope.row.statetwo===0">未激活</el-link>
          <el-link @click="fenghao(scope.row)" v-if="scope.row.state===1">封号</el-link>
          <el-link @click="fenghao(scope.row)" v-else-if="scope.row.state===0">解封</el-link>
          <el-link @click="loginMemberInfo(scope.row)">登入</el-link>
          <!-- <del-btn @delinfobtn='delinfobtn(scope.row)'></del-btn> -->
          <el-link @click="chengeMember(scope.row)">修改</el-link>
          <el-link @click="MemberFunds(scope.row)">资金明细</el-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="memberInfo.currenPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="memberInfo.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="allTotal">
    </el-pagination>
    <!-- 添加修改消息框 -->
    <el-dialog
    :title="dialogTitie"
    :visible.sync="dialogVisible"
    width="60%"
    @close="closeFormDialog"
    :close-on-click-modal='false'>
      <add-member :addMemberForm='memberObj' ref='child' :dialogTitie='dialogTitie'></add-member>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisibleSure">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查看详情 -->
    <el-dialog
    title="会员信息详情"
    :visible.sync="memberDialogLook"
    width="60%">
      <el-form
      :model="dialogInfo"
      label-width="150px">
        <el-form-item
        label="用户账号">
          <span>{{dialogInfo.useraccount}}</span>
        </el-form-item>
        <el-form-item
        label="姓名">
          <span>{{dialogInfo.username}}</span>
        </el-form-item>
        <el-form-item
        label="卡号">
          <span>{{dialogInfo.card}}</span>
        </el-form-item>
        <el-form-item
        label="银行预留手机号">
          <span>{{dialogInfo.ipone}}</span>
        </el-form-item>
        <el-form-item
        label="身份证">
          <span>{{dialogInfo.sfz}}</span>
        </el-form-item>
        <el-form-item
        label="钱包地址">
          <span>{{dialogInfo.address}}</span>
        </el-form-item>
        <el-form-item
        label="登录密码">
          <span>{{dialogInfo.loginpassword}}</span>
        </el-form-item>
        <el-form-item
        label="交易密码">
          <span>{{dialogInfo.transactionpassword}}
          </span>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="memberDialogLook = false">取 消</el-button>
        <el-button type="primary" @click="memberDialogLook = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 资金明细 -->
    <el-dialog
      :title="'用户名:'+title"
      :visible.sync="fundsFullVisit"
      width="60%"
      :close-on-click-modal='false'>
    <el-table
      :data="fundsFullList"
      stripe
      border>
      <!-- <el-table-column label="用户账号" prop="useraccount" align="center"></el-table-column> -->
      <!-- <span>用户账号</span><span>{{fundsFullList.useraccount}}</span> -->
      <el-table-column label="资金变动" prop="capitalChange" align="center"></el-table-column>
      <el-table-column label="变动时间" prop="changTime" align="center"></el-table-column>
      <el-table-column label="变动说明" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.changeInfo==='0'">签到</span>
          <span v-else-if="scope.row.changeInfo==='1'">充值</span>
          <span v-else>交易</span>
        </template>
      </el-table-column>
      <el-table-column label="资金类别" prop="aorb" align="center"></el-table-column>
    </el-table>
    <!-- 底部分页 -->
    <el-pagination
      @size-change="handleSizeChangeD"
      @current-change="handleCurrentChangeD"
      :current-page="fundsInfo.currenPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="fundsInfo.selectCount"
      layout="total, sizes, prev, pager, next, jumper"
      :total="allTotalD">
    </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
import NavTop from '@/components/common/NavTop.vue'
import AddMember from '@/components/common/AddMember.vue'
const Base64 = require('js-base64').Base64
// import DelBtn from '@/components/common/DelBtn.vue'
export default {
  components: {
    NavTop,
    AddMember
    // DelBtn
  },
  data () {
    return {
      iswrite: 0,
      memberList: [],
      // inputUsername: '',
      memberInfo: {
        zh: '',
        selectCount: 10,
        currenPage: 1
      },
      dialogVisible: false,
      memberObj: {
        useraccount: '',
        username: '',
        sfz: '',
        htc: '',
        superioraccount: '',
        level: '',
        wx: '',
        alipay: '',
        address: '',
        card: '',
        ipone: '',
        loginpassword: '',
        transactionpassword: ''
      },
      // 消息框标题
      dialogTitie: '',
      allTotal: 0,
      memberDialogLook: false,
      dialogInfo: {},
      // 资金明细
      fundsInfo: {
        userAccount: '',
        selectCount: 10,
        currenPage: 1
      },
      fundsFullVisit: false,
      fundsFullList: [],
      title: '',
      allTotalD: 0
    }
  },
  created () {
    this.getMemberList()
    this.iswrite = JSON.parse(Base64.decode(window.sessionStorage.getItem('obj'))).iswrite
  },
  methods: {
    async getMemberList () {
      const { data: res } = await this.$http.get('newTable/selectzh', { params: this.memberInfo })
      console.log(res)
      if (res.code !== 100) return this.$message.error('获取会员管理列表失败')
      this.memberList = res.data.memberPageData.pageData
      this.allTotal = res.data.memberPageData.totalCount
    },
    // 查看详情
    memberInfoBtn (value) {
      this.dialogInfo = value
      this.memberDialogLook = true
    },
    // 添加会员按钮
    addMemberBtn () {
      this.dialogTitie = '添加会员'
      // 清空数据
      for (const key in this.memberObj) {
        this.memberObj[key] = ''
      }
      this.dialogVisible = true
    },
    // 用户搜索按钮
    searchUsername () {
      this.memberInfo.currenPage = 1
      this.getMemberList()
    },
    // 每页条数变化
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.memberInfo.selectCount = val
      this.getMemberList()
    },
    // 页数变化
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.memberInfo.currenPage = val
      this.getMemberList()
    },
    // 激活按钮切换
    async jihuo (value) {
      console.log(value.statetwo)
      console.log(value.id)
      const { data: res } = await this.$http.post(`newTable/updatejh?id=${value.id}&statetwo=${value.statetwo}`)
      console.log(res)
      console.log(value.statetwo)
      if (res.code !== 100) return this.$message.error('操作失败')
      this.$message.success('操作成功')
      this.getMemberList()
    },
    // 封号
    async fenghao (value) {
      console.log(1)
      console.log(value.state)
      console.log(value.id)
      const { data: res } = await this.$http.post(`newTable/updatefh?id=${value.id}&statetwo=${value.state}`)
      console.log(res)
      console.log(value.state)
      if (res.code !== 100) return this.$message.error('操作失败')
      this.$message.success('操作成功')
      this.getMemberList()
    },
    // 修改
    chengeMember (value) {
      // console.log(value)
      this.dialogTitie = '修改信息'
      this.memberObj = JSON.parse(JSON.stringify(value))
      this.dialogVisible = true
      // if (this.dialogVisible) {
      //   this.$refs.child.changeForm()
      // }
    },
    // 对话框关闭
    closeFormDialog () {
      this.$refs.child.closeForm()
    },
    // 对话框的确定按钮
    dialogVisibleSure () {
      // 表单数据
      // this.memberObj.htc = parseFloat(this.memberObj.htc)
      this.memberObj.level = parseFloat(this.memberObj.level)
      this.memberObj.transactionpassword = parseFloat(this.memberObj.transactionpassword)
      console.log(this.memberObj)
      this.$refs.child.$refs.addMemberFormRef.validate(async a => {
        console.log(a)
        // 表单预验证
        if (!a) return
        if (this.dialogTitie === '添加会员') {
          console.log('pust请求')
          // newTable/ins
          const { data: res } = await this.$http.post('newTable/ins', this.memberObj)
          console.log(res)
          if (res.code !== 100) return this.$http.error('添加会员失败')
        } else {
          console.log('put请求')
          const { data: res } = await this.$http.post('newTable/update', this.memberObj)
          console.log(res)
          if (res.code !== 100) return this.$http.error('修改会员失败')
        }
        this.getMemberList()
        this.dialogVisible = false
      })
    },
    // 登录按钮
    loginMemberInfo () {
      console.log('登录')
    },
    // 资金明细
    async MemberFunds (value) {
      // value.useraccount
      console.log(value)
      if (value === undefined) {
        this.fundsInfo.userAccount = this.title
        console.log(this.fundsInfo.userAccount)
      } else {
        this.fundsInfo.userAccount = this.title = value.useraccount
      }
      console.log(this.fundsInfo)
      // newTable/selectCaptialInfo
      const { data: res } = await this.$http.get('newTable/selectCaptialInfo', { params: this.fundsInfo })
      console.log(res)
      if (res.code !== 100) return this.$message.error('获取会员资金明细信息失败')
      console.log(this.fundsFullList)
      this.fundsFullList = res.data.capitalInfo.pageData
      this.allTotalD = res.data.capitalInfo.totalCount
      this.fundsFullVisit = true
    },
    // 每页条数变化
    handleSizeChangeD (val) {
      console.log(`每页 ${val} 条`)
      this.fundsInfo.selectCount = val
      this.MemberFunds()
    },
    // 页数变化
    handleCurrentChangeD (val) {
      console.log(`当前页: ${val}`)
      this.fundsInfo.currenPage = val
      this.MemberFunds()
    }
  }
}
</script>

<style scoped lang='scss'>
.commonMain{
  padding: 20px;
  display: flex;
  width: 500px;
  .addMember{
    margin-right: 20PX;
  }
}
.statetwo0,.state1{
  color:green
}
.statetwo1,.state0{
  color:red
}
</style>
