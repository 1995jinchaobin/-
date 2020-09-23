<template>
  <div class="notice">
    <nav-top>
      <span slot="one">挖矿系统</span>
      <span slot="two">公告管理</span>
    </nav-top>
    <div class="noticeTop">
      <el-input
      placeholder="请输入公告标题"
      v-model="noticeInfo.title"
      clearable
      @clear="searchNoticeList">
        <el-button
        slot="append"
        icon="el-icon-search"
        @click="searchNoticeList">
        </el-button>
      </el-input>
      <el-button type="primary" @click="addAnnouce" v-if="iswrite===1">添加公告</el-button>
    </div>
    <el-table
    :data="annouceList"
    stripe
    border
    >
      <el-table-column label="序号" type="index" width="60px" align="center"></el-table-column>
      <el-table-column prop="title" label="公告标题" align="center"></el-table-column>
      <el-table-column prop="content" label="公告内容" align="center"></el-table-column>
      <el-table-column prop="releasetime" label="发布时间" align="center"></el-table-column>
      <el-table-column label="操作" align="center" v-if="iswrite===1">
        <template slot-scope="scope">
          <el-link @click="annouceBtn(scope.row)">发布</el-link>
          <el-link @click="changeNotice(scope.row)">修改</el-link>
          <del-btn @delinfobtn='delinfobtn(scope.row)'></del-btn>
        </template>
      </el-table-column>
      <!-- <el-table-column label="发布公告" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-share" @click="annouceBtn(scope.row)"></el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <!-- 底部分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="noticeInfo.currenPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="noticeInfo.selectCount"
      layout="total, sizes, prev, pager, next, jumper"
      :total="allTotal">
    </el-pagination>
    <el-dialog
    :title="noticeTitle"
    :visible.sync="addAnnouceDialog"
    width="70%"
    :close-on-click-modal='false'>
      <el-form
      ref="addAnnouceFormRef"
      :model="addAnnouceForm"
      :rules="addAnnouceRules">
        <el-form-item
        label="标题"
        prop="title">
          <el-input v-model="addAnnouceForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item
        label="内容"
        prop="content">
          <el-input
          type="textarea"
          :rows="10"
          placeholder="请输入内容"
          v-model="addAnnouceForm.content">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addAnnouceDialog = false">取 消</el-button>
        <el-button type="primary" @click="addAnnouceSureBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import DelBtn from '@/components/common/DelBtn.vue'
import NavTop from '@/components/common/NavTop.vue'
const Base64 = require('js-base64').Base64
// import SearchInput from '@/components/common/SearchInput.vue'
export default {
  components: {
    DelBtn,
    NavTop
    // SearchInput
  },
  data () {
    return {
      iswrite: 0,
      annouceList: [],
      // 添加公告的消息框
      addAnnouceDialog: false,
      // 添加公告
      addAnnouceForm: {
        title: '',
        content: ''
      },
      // 修改公告idc
      changeidc: 0,
      // 验证添加
      addAnnouceRules: {
        title: [
          { required: true, message: '请输入公告标题', trigger: 'blur' },
          { min: 3, message: '长度在3个字符以上', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入公告内容', trigger: 'blur' },
          { min: 6, message: '长度在6个字符以上', trigger: 'blur' }
        ]
      },
      // 公告查询
      noticeInfo: {
        title: '',
        selectCount: 10,
        currenPage: 1
      },
      // 公告条数
      allTotal: 0,
      // 消息框标题
      noticeTitle: ''
    }
  },
  created () {
    this.getNoticeList()
    this.iswrite = JSON.parse(Base64.decode(window.sessionStorage.getItem('obj'))).iswrite
  },
  methods: {
    // 获取公告列表数据
    async getNoticeList () {
      console.log(this.noticeInfo)
      const { data: res } = await this.$http.get('/consume/selectNotice', { params: this.noticeInfo })
      console.log(res)
      if (res.code !== 100) return this.$message.error('获取公告列表失败')
      this.annouceList = res.data.noticePageData.pageData
      this.allTotal = res.data.noticePageData.totalCount
    },
    // 搜索和清空
    searchNoticeList () {
      this.noticeInfo.currenPage = 1
      this.getNoticeList()
    },
    // 添加公告按钮
    addAnnouce () {
      this.noticeTitle = '添加公告'
      this.addAnnouceForm.title = this.addAnnouceForm.content = ''
      this.addAnnouceDialog = true
    },
    // 发布公告按钮
    annouceBtn (value) {
      console.log(value)
    },
    // 添加公告及修改公告消息框确定按钮
    addAnnouceSureBtn () {
      console.log(this.addAnnouceForm)
      this.$refs.addAnnouceFormRef.validate(async value => {
        if (!value) return
        if (this.noticeTitle === '添加公告') {
          const { data: res } = await this.$http.put('/consume/insertNotice', this.addAnnouceForm)
          console.log(res)
          if (res.code !== 100) return this.$message.error('添加公告失败')
          this.$message.success('添加公告成功')
        } else if (this.noticeTitle === '修改公告') {
          const a = {
            idc: this.changeidc,
            title: this.addAnnouceForm.title,
            content: this.addAnnouceForm.content
          }
          const { data: res } = await this.$http.put('/consume/updataNotice', a)
          console.log(res)
          if (res.code !== 100) return this.$message.error('修改公告失败')
          this.$message.success('修改公告成功')
        }
        this.getNoticeList()
        this.addAnnouceDialog = false
      })
    },
    // 删除按钮
    async delinfobtn (value) {
      console.log(value)
      const { data: res } = await this.$http.delete(`/consume/deleteNotice?idc=${value.idc}`)
      console.log(res)
      if (res.code !== 100) return this.$message.error('删除公告失败')
      if (this.allTotal % this.noticeInfo.selectCount === 1) {
        this.noticeInfo.currenPage = this.noticeInfo.currenPage - 1
      }
      this.$message.success('删除用户成功')
      this.getNoticeList()
    },
    // 修改按钮
    changeNotice (value) {
      this.noticeTitle = '修改公告'
      console.log(value)
      this.changeidc = value.idc
      this.addAnnouceForm.title = value.title
      this.addAnnouceForm.content = value.content
      this.addAnnouceDialog = true
    },
    // 每页条数变化
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.noticeInfo.selectCount = val
      this.getNoticeList()
    },
    // 页数变化
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.noticeInfo.currenPage = val
      this.getNoticeList()
    }
  }
}
</script>

<style scoped lang='scss'>
.notice{
  .noticeTop{
    margin: 20px;
    display: flex;
    justify-content: space-between;
    .el-input{
      width: 300px;
    }
  }
}
</style>
