<template>
  <div class="ad">
    <nav-top>
      <span slot="one">内容管理</span>
      <span slot="two">广告列表</span>
    </nav-top>
    <div class="adTop">
      <el-input
      placeholder="请输入名称"
      v-model="adInfo.advName"
      clearable
      @clear="searchAdList">
        <el-button slot="append" icon="el-icon-search" @click="searchAdList"></el-button>
      </el-input>
      <el-button type="primary" @click="addAdDialog" v-if="iswrite===1">添加广告</el-button>
    </div>
    <el-table
    :data="userList"
    stripe
    border
    >
      <el-table-column label="序号" type="index" width="60px" align="center"></el-table-column>
      <el-table-column prop="idc" label="ID" align="center"></el-table-column>
      <el-table-column prop="advname" label="名称" align="center"></el-table-column>
      <el-table-column prop="link" label="广告链接" align="center"></el-table-column>
      <el-table-column prop="advimage" label="图片" align="center"></el-table-column>
      <el-table-column label="操作" align="center" v-if="iswrite===1">
        <template slot-scope="scope">
          <del-btn @delinfobtn='delinfobtn(scope.row)'></del-btn>
          <el-link @click="changeAdInfoDialog(scope.row)">修改</el-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="adInfo.currenPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="adInfo.selectCount"
      layout="total, sizes, prev, pager, next, jumper"
      :total="allTotal">
    </el-pagination>
    <!-- 添加广告和修改广告消息框 -->
    <el-dialog
    :title="adDialogTitie"
    :visible.sync="adDialog"
    width="60%"
    :close-on-click-modal='false'>
      <add-ad :adDialogInfo='adDialogInfo'></add-ad>
      <span slot="footer">
        <el-button @click="adDialog = false">取 消</el-button>
        <el-button type="primary" @click="adDialogBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import DelBtn from '@/components/common/DelBtn.vue'
import NavTop from '@/components/common/NavTop.vue'
import AddAd from '@/components/common/AddAd.vue'
const Base64 = require('js-base64').Base64
export default {
  components: {
    DelBtn,
    NavTop,
    AddAd
  },
  data () {
    return {
      userList: [],
      adInfo: {
        advName: '',
        selectCount: 10,
        currenPage: 1
      },
      allTotal: 0,
      adDialog: false,
      // 消息框标题
      adDialogTitie: '',
      // 消息框内容
      adDialogInfo: {
        idc: '',
        link: '',
        advName: '',
        advImage: ''
      },
      iswrite: 0
    }
  },
  created () {
    this.getAdList()
    this.iswrite = JSON.parse(Base64.decode(window.sessionStorage.getItem('obj'))).iswrite
  },
  methods: {
    // 获取广告数据列表
    async getAdList () {
      const { data: res } = await this.$http.get('/contents/selectAdv', { params: this.adInfo })
      console.log(res)
      if (res.code !== 100) return this.$message.error('获取广告列表失败')
      this.userList = res.data.advPageData.pageData
      this.allTotal = res.data.advPageData.totalCount
    },
    // 搜索和清空
    searchAdList () {
      this.adInfo.currenPage = 1
      this.getAdList()
    },
    // 每页条数变化
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.adInfo.selectCount = val
      this.getAdList()
    },
    // 页数变化
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.adInfo.currenPage = val
      this.getAdList()
    },
    // 删除按钮确定
    async delinfobtn (value) {
      console.log(value)
      const { data: res } = await this.$http.delete(`/contents//deleteAdv?idc=${value.idc}`)
      console.log(res)
      if (res.code !== 100) return this.$message.error('删除广告失败')
      if (this.allTotal % this.adInfo.selectCount === 1) {
        this.adInfo.currenPage = this.adInfo.currenPage - 1
      }
      this.$message.success('删除广告成功')
      this.getAdList()
    },
    // 添加广告消息框打开
    addAdDialog () {
      this.adDialogTitie = '添加广告'
      // 清空表单
      for (const key in this.adDialogInfo) {
        this.adDialogInfo[key] = ''
      }
      this.adDialog = true
    },
    // 修改广告对话框打开
    changeAdInfoDialog (value) {
      this.adDialogTitie = '修改广告'
      const res = JSON.parse(JSON.stringify(value))
      console.log(res)
      this.adDialogInfo.idc = res.idc
      this.adDialogInfo.link = res.link
      this.adDialogInfo.advName = res.advname
      this.adDialogInfo.advImage = res.advimage
      this.adDialog = true
    },
    // 广告对话框确定按钮
    async adDialogBtn () {
      if (this.adDialogTitie === '添加广告') {
        const obj = {}
        obj.link = this.adDialogInfo.link
        obj.advName = this.adDialogInfo.advName
        obj.advImage = this.adDialogInfo.advImage
        console.log('pust')
        const { data: res } = await this.$http.put('/contents/insertAdv', obj)
        console.log(res)
        // put请求
        if (res.code !== 100) return this.$message.error('添加广告失败')
        this.$message.success('添加广告成功')
      } else {
        console.log('put')
        console.log(this.adDialogInfo)
        const { data: res } = await this.$http.put('/contents/updataAdv', this.adDialogInfo)
        console.log(res)
        if (res.code !== 100) return this.$message.error('修改广告失败')
        this.$message.success('修改广告成功')
      }
      this.getAdList()
      this.adDialog = false
    }
  }
}
</script>

<style scoped lang='scss'>
.adTop{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;

}
.el-input{
  width: 300px;
}
</style>
