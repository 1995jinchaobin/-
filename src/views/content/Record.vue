<template>
  <div class="record">
    <nav-top>
      <span slot="one">内容管理</span>
      <span slot="two">记录管理</span>
    </nav-top>
    <el-input
      placeholder="请输入发布者"
      v-model="recordInfo.nickName"
      clearable
      @clear="searchRecordList">
      <el-button slot="append" icon="el-icon-search" @click="searchRecordList"></el-button>
    </el-input>
    <el-table
    :data="userList"
    stripe
    border
    >
      <el-table-column label="序号" type="index" width="60px" align="center"></el-table-column>
      <el-table-column prop="userid" label="用户ID" align="center"></el-table-column>
      <el-table-column prop="nickname" label="发布者" align="center"></el-table-column>
      <el-table-column prop="coverpath" label="封面位置" align="center"></el-table-column>
      <el-table-column prop="filepath" label="文件位置" align="center"></el-table-column>
      <el-table-column prop="introduce" label="介绍" align="center"></el-table-column>
      <el-table-column prop="creattime" label="上传时间" align="center">
        <!-- <template slot-scope="scope">
          {{scope.row.add_time | dateFormat}}
        </template> -->
      </el-table-column>
      <el-table-column prop="reviewtime" label="审核时间" align="center">
        <!-- <template slot-scope="scope">
          {{scope.row.check_time | dateFormat}}
        </template> -->
      </el-table-column>
      <el-table-column label="操作" align="center" v-if="iswrite===1">
        <template slot-scope="scope">
          <el-link>审核</el-link>
          <del-btn @delinfobtn='delinfobtn(scope.row)'></del-btn>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="recordInfo.currenPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="recordInfo.selectCount"
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
      recordInfo: {
        nickName: '',
        selectCount: 10,
        currenPage: 1
      },
      allTotal: 0
    }
  },
  created () {
    this.getRecordList()
    this.iswrite = JSON.parse(Base64.decode(window.sessionStorage.getItem('obj'))).iswrite
  },
  methods: {
    // 获取记录管理列表
    async getRecordList () {
      const { data: res } = await this.$http.get('/contents/selectOptLog', { params: this.recordInfo })
      console.log(res)
      if (res.code !== 100) return this.$message.error('获取记录管理失败')
      this.userList = res.data.oplPageData.pageData
      this.allTotal = res.data.oplPageData.totalCount
    },
    // 搜索和清空
    searchRecordList () {
      this.recordInfo.currenPage = 1
      this.getRecordList()
    },
    // 删除按钮确定
    async delinfobtn (value) {
      console.log(value)
      // del请求
      const { data: res } = await this.$http.delete(`/contents/deleteOptLog?idc=${value.idc}`)
      console.log(res)
      if (res.code !== 100) return this.$message.error('删除记录失败')
      if (this.allTotal % this.recordInfo.selectCount === 1) {
        this.recordInfo.currenPage = this.recordInfo.currenPage - 1
      }
      this.$message.success('删除记录成功')
      this.getRecordList()
    },
    // 每页条数变化
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.recordInfo.selectCount = val
      this.getRecordList()
    },
    // 页数变化
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.recordInfo.currenPage = val
      this.getRecordList()
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
