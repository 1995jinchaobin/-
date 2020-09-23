<template>
  <div class="comment">
    <nav-top>
      <span slot="one">内容管理</span>
      <span slot="two">评论管理</span>
    </nav-top>
    <el-input
      placeholder="请输入发布者"
      v-model="commentInfo.nickName"
      clearable
      @clear="searchCommentList">
      <el-button slot="append" icon="el-icon-search" @click="searchCommentList"></el-button>
    </el-input>
    <el-table
    :data="userList"
    stripe
    border
    >
      <el-table-column label="序号" type="index" width="60px" align="center"></el-table-column>
      <el-table-column prop="userid" label="用户ID" align="center"></el-table-column>
      <el-table-column prop="nickname" label="发布者" align="center"></el-table-column>
      <el-table-column prop="comment" label="内容" align="center"></el-table-column>
      <el-table-column prop="creattime" label="上传时间" align="center">
        <!-- <template slot-scope="scope">
          {{scope.row.add_time | dateFormat}}
        </template> -->
      </el-table-column>
      <el-table-column label="操作" align="center" v-if="iswrite===1">
        <template slot-scope="scope">
          <el-link>置顶</el-link>
          <del-btn @delinfobtn='delinfobtn(scope.row)'></del-btn>
          <el-link>隐藏</el-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="commentInfo.currenPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="commentInfo.selectCount"
      layout="total, sizes, prev, pager, next, jumper"
      :total="allTotal">
    </el-pagination>
  </div>
</template>

<script>
import NavTop from '@/components/common/NavTop.vue'
import DelBtn from '@/components/common/DelBtn.vue'
const Base64 = require('js-base64').Base64
export default {
  components: {
    NavTop,
    DelBtn
  },
  data () {
    return {
      iswrite: 0,
      userList: [],
      commentInfo: {
        nickName: '',
        selectCount: 10,
        currenPage: 1
      },
      allTotal: 0
    }
  },
  created () {
    this.getCommentList()
    this.iswrite = JSON.parse(Base64.decode(window.sessionStorage.getItem('obj'))).iswrite
  },
  methods: {
    // 获取评论管理列表
    async getCommentList () {
      const { data: res } = await this.$http.get('/contents/selectComment', { params: this.commentInfo })
      console.log(res)
      if (res.code !== 100) return this.$message.error('获取记录管理失败')
      this.userList = res.data.commentPageData.pageData
      this.allTotal = res.data.commentPageData.totalCount
    },
    // 搜索和清空
    searchCommentList () {
      this.commentInfo.currenPage = 1
      this.getCommentList()
    },
    // 删除按钮确定
    async delinfobtn (value) {
      console.log(value)
      const { data: res } = await this.$http.delete(`/contents/deleteComment?idc=${value.idc}`)
      console.log(res)
      if (res.code !== 100) return this.$message.error('删除记录失败')
      if (this.allTotal % this.commentInfo.selectCount === 1) {
        this.commentInfo.currenPage = this.commentInfo.currenPage - 1
      }
      this.$message.success('删除记录成功')
      // 刷新
      this.getCommentList()
    },
    // 每页条数变化
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.commentInfo.selectCount = val
      this.getCommentList()
    },
    // 页数变化
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.commentInfo.currenPage = val
      this.getCommentList()
    }
  }
}
</script>

<style scoped lang='scss'>
.el-input{
  margin: 20px;
  width: 300px;
}
</style>
