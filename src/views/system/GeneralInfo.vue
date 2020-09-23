<template>
  <div class="GeneralInfo">
    <nav-top>
      <span slot="one">系统设置</span>
      <span slot="two">视频权限</span>
    </nav-top>
    <el-input
      placeholder="请输入账号"
      v-model="userInfo.userId"
      clearable
      @clear="searchGenerallList">
      <el-button slot="append" icon="el-icon-search" @click="searchGenerallList"></el-button>
    </el-input>
    <el-table
    :data="userList"
    stripe
    border
    >
      <el-table-column label="序号" type="index" width="60px" align="center"></el-table-column>
      <!-- <el-table-column prop="id" label="ID" align="center"></el-table-column> -->
      <el-table-column prop="userId" label="管理账号" align="center"></el-table-column>
      <el-table-column prop="userPassword" label="密码" align="center"></el-table-column>
      <el-table-column label="修改密码" align="center" v-if="iswrite===1">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="modPasswordBtn(scope.row)"></el-button>
        </template>
      </el-table-column>
      <el-table-column label="网站名称" align="center">
        <template slot-scope="scope">
          <a target="_blank" :href="scope.row.webName">{{scope.row.webName}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="videoPower" label="视频审核" align="center" v-if="iswrite===1">
        <template slot-scope="scope">
          <el-switch
          v-model="scope.row.videoPower"
          :active-value="1"
          :inactive-value="0"
          @change="userStateChange(scope.row)"></el-switch>
        </template>
        <!-- <template slot-scope="scope" >
          <span class="span0" v-if="scope.row.videoPower===1">未审核</span>
          <span class="span1" v-else>已审核</span>
        </template> -->
      </el-table-column>
    </el-table>
    <!-- 底部分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userInfo.currenPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="userInfo.selectCount"
      layout="total, sizes, prev, pager, next, jumper"
      :total="allTotal">
    </el-pagination>
    <el-dialog
    title="修改密码"
    :visible.sync="dialogVisible"
    width=380px
    @close='formClear'
    :close-on-click-modal='false'>
      <el-form label-width="55px">
        <el-form-item label="账号">
          <el-input v-model="userId" disabled></el-input>
        </el-form-item>
        <el-form-item label="旧密码">
          <el-input v-model="oldPassword" disabled></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="newPassword"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="certainBtn">确 定</el-button>
      </span>
    </el-dialog>
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
    return {
      iswrite: 0,
      userList: [],
      userInfo: {
        selectCount: 10,
        currenPage: 1,
        userId: ''
      },
      // 总条数
      allTotal: 0,
      dialogVisible: false,
      oldPassword: '',
      newPassword: '',
      idc: 0,
      video: 0,
      userId: ''
    }
  },
  created () {
    this.getGenerallList()
    this.iswrite = JSON.parse(Base64.decode(window.sessionStorage.getItem('obj'))).iswrite
  },
  methods: {
    // 获取管理账号列表
    async getGenerallList () {
      console.log(this.userInfo)
      const { data: res } = await this.$http.get('/systemSet/selectUserInfo', { params: this.userInfo })
      console.log(res)
      if (res.code !== 100) return this.$message.error('获取用户信息失败')
      this.userList = res.data.userPageData.pageData
      this.allTotal = res.data.userPageData.totalCount
    },
    // 搜索和清空
    searchGenerallList () {
      this.userInfo.currenPage = 1
      this.getGenerallList()
      // this.$options.methods.getGenerallList()
    },
    // 修改密码按钮
    modPasswordBtn (value) {
      this.oldPassword = value.userPassword
      this.idc = value.idc
      this.video = value.videoPower
      this.userId = value.userId
      this.dialogVisible = true
      console.log(value)
    },
    // 修改密码确定按钮
    async certainBtn () {
      if (this.newPassword.trim().length === 0) {
        return this.$message.error('密码不能为空')
      }
      // put请求
      const a = {
        idc: this.idc,
        video: this.value,
        password: this.newPassword
      }
      const { data: res } = await this.$http.put('/systemSet/updataUserInfo', a)
      console.log(res)
      // if (res.meta.status !== 200)  return this.$message.error('修改密码失败')
      this.$message.success('修改密码成功')
      this.getGenerallList()
      this.dialogVisible = false
    },
    // 关闭修改密码消息框
    formClear () {
      console.log('关闭消息框')
      this.newPassword = this.oldPassword = ''
    },
    // 状态开关按钮
    async userStateChange (value) {
      console.log(value)
      const a = {
        idc: value.idc,
        video: value.videoPower,
        password: value.userPaaword
      }
      const { data: res } = await this.$http.put('/systemSet/updataUserInfo', a)
      console.log(res)
      // put请求
      if (res.code !== 100) return this.$message.error('更新视频审核状态失败')

      this.$message.success('更新视频审核状态成功')
    },
    // 每页条数变化
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.userInfo.selectCount = val
      this.getGenerallList()
    },
    // 页数变化
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.userInfo.currenPage = val
      this.getGenerallList()
    }
  }
}
</script>

<style scoped lang='scss'>
.GeneralInfo>.el-input{
  margin: 20px;
  width: 300px;
}
.el-form-item{
  display: flex;
}
</style>
