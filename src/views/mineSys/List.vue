<!--<template>
  <div class="list">
    <nav-top>
      <span slot="one">挖矿系统</span>
      <span slot="two">公告列表</span>
    </nav-top>
    <search-input class="searchInput"></search-input>
    <el-table
    :data="annouceList"
    stripe
    border
    >
      <el-table-column label="序号" type="index" width="60px" align="center"></el-table-column>
      <el-table-column prop="title" label="公告标题" align="center"></el-table-column>
      <el-table-column prop="content" label="公告内容" align="center"></el-table-column>
      <el-table-column prop="addTime" label="发布时间" align="center">
        <template slot-scope="scope">
          {{scope.row.addTime}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-link @click="changList(scope.row)">修改</el-link>
          <del-btn @delinfobtn='delinfobtn(scope.row)'></del-btn>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
    title="公告信息修改"
    :visible.sync="changeListInfoDialog"
    width="60%"
    :close-on-click-modal='false'>
      <el-form
      :model="changeListInfo"
      label-width="150px">
        <el-form-item
        label="公告标题">
          <el-input v-model="changeListInfo.title" type="text"></el-input>
        </el-form-item>
        <el-form-item
        label="公告内容">
          <el-input v-model="changeListInfo.content" type="text"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="changeListInfoDialog = false">取 消</el-button>
        <el-button type="primary" @click="changeListInfoDialogSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import DelBtn from '@/components/common/DelBtn.vue'
import NavTop from '@/components/common/NavTop.vue'
import SearchInput from '@/components/common/SearchInput.vue'
export default {
  components: {
    DelBtn,
    NavTop,
    SearchInput
  },
  data () {
    return {
      annouceList: [
        { title: '公告123', content: '公告312内容', addTime: 1235323413245 },
        { title: '公告23123', content: '公告4123内容', addTime: 1235223413245 },
        { title: '公告412123', content: '公告4123内容', addTime: 1235123413245 },
        { title: '公412告123', content: '公412告内容', addTime: 1235323413245 },
        { title: '公告412123', content: '公告54123内容', addTime: 1235234134245 },
        { title: '公3告123', content: '公告1234内容', addTime: 1235234113245 }
      ],
      changeListInfoDialog: false,
      changeListInfo: {}
    }
  },
  methods: {
    // 删除按钮确定
    delinfobtn (value) {
      console.log(value)
      // del请求
      // if (res.meta.status !==200) return this.$message.error('删除用户失败')
      this.$message.success('删除用户成功')
      // 刷新
      // this.searchUsername()
    },
    // 修改按钮
    changList (value) {
      this.changeListInfo = JSON.parse(JSON.stringify(value))
      this.changeListInfoDialog = true
    },
    // 修改公告的确定按钮
    changeListInfoDialogSure () {
      console.log(this.changeListInfo)
      if (this.changeListInfo.title.trim().length === 0) {
        return this.$message.error('公告标题不能为空')
      }
      // put请求
      // if (res.meta.status !== 200)  return this.$message.error('修改公告失败')
      this.$message.success('修改公告成功')
      // 刷新
      this.changeListInfoDialog = false
    }
  }
}
</script>

<style scoped lang='scss'>
.list{
  .el-table{
    margin-top: 20px;
  }
  .searchInput{
    margin: 20px auto auto 20px;
  }
}
</style>-->
