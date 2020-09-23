<template>
  <div class="user">
    <nav-top>
      <span slot="one">通用管理</span>
      <span slot="two">用户管理</span>
    </nav-top>
    <div class="topSearch">
      <el-input
      placeholder="请输入账号"
      v-model="userInfo.userId"
      clearable
      @clear="searchUserList">
        <el-button slot="append" icon="el-icon-search" @click="searchUserList"></el-button>
      </el-input>
      <el-button type="primary" @click="addUser">添加用户</el-button>
    </div>
    <el-table
    :data="userList"
    stripe
    border
    >
      <el-table-column label="序号" type="index" width="60px" align="center"></el-table-column>
      <el-table-column prop="userName" label="账号" align="center"></el-table-column>
      <el-table-column prop="nickname" label="昵称" align="center"></el-table-column>
      <!-- <el-table-column prop="icon" label="头像" align="center"></el-table-column> -->
      <el-table-column label="操作" align="center" v-if="iswrite===1">
        <template slot-scope="scope">
          <del-btn @delinfobtn='delinfobtn(scope.row)'></del-btn>
          <el-link @click="changeUserInfoBtn(scope.row)">修改</el-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="userInfo.currenPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="userInfo.selectCount"
      layout="total, sizes, prev, pager, next, jumper"
      :total="allTotal">
    </el-pagination>
    <el-dialog
      :title="title"
      :visible.sync="changeUserInfoDialog"
      width="60%"
      :close-on-click-modal='false'
      @close='closeChangeUserInfoDialog'>
      <el-form
        :model="changeUserInfo"
        label-width="150px">
        <el-form-item
          label="用户账号">
          <el-input v-model="changePower.userid" type="text" disabled v-if="title==='用户信息修改'"></el-input>
          <el-input v-model="changePower.userid" type="text" v-else @blur="addUserInput"></el-input>
          <div class="tishi">{{tishi}}</div>
        </el-form-item>
         <el-form-item
          label="用户密码" v-if="title==='添加用户'">
          <el-input v-model="loginPassword"></el-input>
        </el-form-item>
        <el-form-item
          label="用户昵称">
          <el-input v-model="changePower.nickName"></el-input>
        </el-form-item>
        <el-form-item
          label="用户权限">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <!-- <div style="margin: 15px 0;"></div> -->
          <el-checkbox-group v-model="checkedPowerList" @change="handleCheckedPowerList" >
            <el-checkbox v-for="power in powerList" :label="power.id" :key="power.id">{{power.name}}</el-checkbox>
          </el-checkbox-group>
          <!-- <el-input v-model="changeUserInfo.nickname"></el-input> -->
        </el-form-item>
        <!-- <el-form-item
        label="用户头像">
          <el-input v-model="changeUserInfo.icon"></el-input>
        </el-form-item> -->
      </el-form>
      <span slot="footer">
        <el-button @click="changeUserInfoDialog = false">取 消</el-button>
        <el-button type="primary" @click="changeUserInfoDialogSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import NavTop from '@/components/common/NavTop.vue'
import DelBtn from '@/components/common/DelBtn.vue'
// import { delete } from 'vue/types/umd'
const Base64 = require('js-base64').Base64
export default {
  components: {
    NavTop,
    DelBtn
  },
  data () {
    return {
      loginPassword: '',
      title: '',
      iswrite: 0,
      userList: [],
      // 用户信息对话框
      changeUserInfoDialog: false,
      // 修改
      changeUserInfo: {},
      // get用户管理参数
      userInfo: {
        // 页码
        currenPage: 1,
        selectCount: 10,
        userId: ''
      },
      // 总条数
      allTotal: 0,
      allCheck: [],
      powerList: [
        { name: '基本设置', id: 'basicView' },
        { name: '参数设置', id: 'machineParamsView' },
        { name: '用户管理', id: 'userView' },
        { name: '记录管理', id: 'operationLogView' },
        { name: '评论管理', id: 'commentView' },
        { name: '广告列表', id: 'advertisementView' },
        { name: '视频权限', id: 'videoView' },
        { name: '公告管理', id: 'noticeView' },
        { name: '商城管理', id: 'goodsView' },
        { name: '订单管理', id: 'orderView' },
        { name: '金币交易', id: 'goldView' },
        { name: '充值', id: 'rechargeView' },
        { name: '会员管理', id: 'vipView' },
        { name: '矿机设置', id: 'machineView' },
        { name: '矿机详情', id: 'machineinfoView' },
        { name: '读写权限', id: 'iswrite' }
      ],
      // 全选样式
      isIndeterminate: true,
      checkAll: false,
      checkedPowerList: [],
      changePower: {
        idc: 0,
        nickName: '',
        userid: '',
        userAuthority: {
          userView: 0,
          operationLogView: 0,
          commentView: 0,
          advertisementView: 0,
          videoView: 0,
          noticeView: 0,
          goodsView: 0,
          orderView: 0,
          goldView: 0,
          rechargeView: 0,
          vipView: 0,
          machineView: 0,
          machineinfoView: 0,
          iswrite: 0,
          basicView: 0,
          machineParamsView: 0
        }
      },
      tishi: ''
    }
  },
  created () {
    this.getUserList()
    // 选取数组
    for (const a in this.powerList) {
      // console.log(this.powerList[a].id)
      this.allCheck.push(this.powerList[a].id)
      // console.log(this.allCheck)
    }
    this.iswrite = JSON.parse(Base64.decode(window.sessionStorage.getItem('obj'))).iswrite
  },
  methods: {
    // 获取用户信息
    async getUserList () {
      // console.log(this.userInfo)
      const { data: res } = await this.$http.get('user/selectUser', { params: this.userInfo })
      console.log(res)
      if (res.code !== 100) return this.$message.error('获取用户信息失败')
      this.userList = res.data.userPageData.pageData
      this.allTotal = res.data.userPageData.totalCount
    },
    // 搜索和清空
    searchUserList () {
      this.userInfo.currenPage = 1
      this.getUserList()
    },
    // 删除按钮确定
    async delinfobtn (value) {
      const { data: res } = await this.$http.delete(`user/deleteUser?idc=${value.idc}`)
      if (res.code !== 100) return this.$message.error('删除用户失败')
      console.log(res)
      if (this.allTotal % this.userInfo.selectCount === 1) {
        this.userInfo.currenPage = this.userInfo.currenPage - 1
      }
      this.getUserList()
      this.$message.success('删除用户成功')
    },
    // 用户信息修改
    changeUserInfoBtn (value) {
      console.log(value)
      this.tishi = ''
      this.title = '用户信息修改'
      this.checkedPowerList = []
      this.changeUserInfo = value
      // this.changeUserInfo = JSON.parse(JSON.stringify(value))
      // console.log(this.changeUserInfo)
      this.changePower.idc = value.idc
      this.changePower.nickName = value.nickname
      this.changePower.userid = value.userName
      console.log(this.changePower.userid)
      for (const a in this.changeUserInfo) {
        if (this.changeUserInfo[a] === 1) {
          // console.log(a.replace(/_v/i, 'V'))
          this.checkedPowerList.push(a.replace(/_v/i, 'V'))
        }
      }
      const r = this.checkedPowerList.indexOf('operation_logView')
      if (r !== -1) {
        this.checkedPowerList.splice(r, 1, 'operationLogView')
      }
      const r1 = this.checkedPowerList.indexOf('machine_paramsView')
      if (r1 !== -1) {
        this.checkedPowerList.splice(r1, 1, 'machineParamsView')
      }
      if (this.checkedPowerList.indexOf('idc') !== -1) {
        this.checkedPowerList.splice(this.checkedPowerList.indexOf('idc'), 1)
      }
      console.log(this.checkedPowerList)
      console.log(this.changePower)
      this.changeUserInfoDialog = true
    },
    // 对话框关闭
    closeChangeUserInfoDialog () {
      console.log('对话框关闭')
    },
    // 用户信息修改确定按钮
    async changeUserInfoDialogSure () {
      for (const key in this.changePower.userAuthority) {
        console.log(key)
        console.log(this.checkedPowerList.indexOf(key))
        if (this.checkedPowerList.indexOf(key) !== -1) {
          this.changePower.userAuthority[key] = 1
        } else {
          this.changePower.userAuthority[key] = 0
        }
      }
      console.log(this.changePower)
      if (this.title === '用户信息修改') {
        const { data: res } = await this.$http.put('user/update', this.changePower)
        console.log(res)
        if (res.code !== 100) return this.$message.error('修改用户失败')
        this.$message.success('修改用户成功')
      } else {
        delete this.changePower.idc
        this.changePower.loginPassword = this.loginPassword
        console.log(this.changePower)
        if (this.changePower.loginPassword.trim().length === 0 || this.changePower.userid.trim().length === 0) return this.$message.error('请填写账号或密码')
        const { data: res } = await this.$http.post('user/inserUser', this.changePower)
        console.log(res)
        if (res.code !== 100) return this.$message.error('添加用户失败')
        this.$message.success('添加用户成功')
      }
      this.getUserList()
      this.changeUserInfoDialog = false
    },
    addUser () {
      this.title = '添加用户'
      this.tishi = ''
      this.changePower.nickName = this.changePower.userid = this.loginPassword = ''
      for (const key in this.changePower.userAuthority) {
        this.changePower.userAuthority[key] = 0
      }
      this.checkedPowerList = []
      this.changeUserInfoDialog = true
    },
    // 每页条数变化
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.userInfo.selectCount = val
      this.getUserList()
    },
    // 页数变化
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.userInfo.currenPage = val
      this.getUserList()
    },
    // 全选
    handleCheckAllChange (val) {
      console.log(val)
      this.checkedPowerList = val ? this.allCheck : []
      this.isIndeterminate = false
    },
    handleCheckedPowerList (value) {
      console.log(value)
      this.checkedPowerList = value
    },
    // 添加用户名输入框失去焦点
    async addUserInput () {
      console.log(123)
      const { data: res } = await this.$http.get(`user/checkUser?userid=${this.changePower.userid}`)
      console.log(res)
      this.tishi = res
    }
  }
}
</script>

<style scoped lang='scss'>
.topSearch>.el-input{
  width: 300px;
  margin: 20px;
}
.tishi{
  margin-top: 3px;
  height: 15px;
  font-size: 10px;
  line-height: 15px;
}
</style>
