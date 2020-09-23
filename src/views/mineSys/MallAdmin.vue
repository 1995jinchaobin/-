<template>
  <div class="mallAdmin">
    <nav-top>
      <span slot="one">挖矿系统</span>
      <span slot="two">商城管理</span>
    </nav-top>
    <div class="addBtn">
      <el-button
      type="primary"
      @click="addGoodBtn" v-if="iswrite===1">添加商品</el-button>
      <el-input
      placeholder="请商品名字"
      v-model="mallInfo.goodsName"
      clearable
      @clear="searchUsername">
        <el-button slot="append" icon="el-icon-search" @click="searchUsername"></el-button>
      </el-input>
    </div>
    <el-table
    :data="annouceList"
    stripe
    border
    >
      <el-table-column label="序号" type="index" width="60px" align="center"></el-table-column>
      <el-table-column prop="goodsname" label="商品名字" align="center"></el-table-column>
      <el-table-column prop="goodsprice" label="金币需要消耗数量" align="center"></el-table-column>
      <!-- <el-table-column label="图片" align="center" prop="image"></el-table-column> -->
      <el-table-column label="图片" align="center">
        <template slot-scope="scope">
          <img :src="$imgUrl+scope.row.image" class="imageMall" @click="lookImage(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="总库存" align="center"></el-table-column>
      <el-table-column label="商品介绍" align="center">
        <template slot-scope="scope">
          <p v-html="scope.row.goodsinfo"></p>
        </template>
      </el-table-column>
      <el-table-column prop="selltimeStart" label="上架时间开始" align="center"></el-table-column>
      <el-table-column prop="selltimeEnd" label="上架时间结束" align="center"></el-table-column>
      <el-table-column prop="sellstatus" label="上架状态" align="center">
        <template slot-scope="scope">
          <!-- {{scope.row.sellstatus}} -->
          <span v-if="scope.row.sellstatus===1" class="sellstatus1">已上架</span>
          <span v-else class="sellstatus0">未上架</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" v-if="iswrite===1">
        <template slot-scope="scope">
          <el-link @click="moveGoodInfo(scope.row)">修改</el-link>
          <del-btn @delinfobtn='delinfobtn(scope.row)'></del-btn>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="mallInfo.currenPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="mallInfo.selectCount"
      layout="total, sizes, prev, pager, next, jumper"
      :total="allTotal">
    </el-pagination>
    <el-dialog
    :visible.sync="imageDialog"
    width="80%">
      <img :src="$imgUrl+imageUrl" class="lookImage"/>
    </el-dialog>
  </div>
</template>

<script>
import DelBtn from '@/components/common/DelBtn.vue'
import NavTop from '@/components/common/NavTop.vue'
const Base64 = require('js-base64').Base64
export default {
  components: {
    DelBtn,
    NavTop
  },
  data () {
    return {
      iswrite: 0,
      annouceList: [],
      mallInfo: {
        goodsName: '',
        selectCount: 10,
        currenPage: 1
      },
      allTotal: 0,
      imageUrl: '',
      imageDialog: false
    }
  },
  created () {
    this.getMallList()
    this.iswrite = JSON.parse(Base64.decode(window.sessionStorage.getItem('obj'))).iswrite
    // if (this.$route.query.inputUsername === undefined) {
    //   this.inputUsername = ''
    // } else {
    //   this.inputUsername = this.$route.query.inputUsername
    // }
    // console.log(this.$route.query.inputUsername)
    // this.searchUsername()
  },
  methods: {
    async getMallList () {
      const { data: res } = await this.$http.get('/consume/selectGoods', { params: this.mallInfo })
      console.log(res)
      if (res.code !== 100) return this.$message.error('获取商品信息失败')
      this.annouceList = res.data.goodsPageData.pageData
      this.allTotal = res.data.goodsPageData.totalCount
    },
    // 添加商品按钮
    addGoodBtn () {
      this.$router.push('/addGood')
      // console.log(this.$router)
    },
    // 修改商品信息
    moveGoodInfo (value) {
      // const inputUsername = 'inputUsername'
      // value[inputUsername] = this.inputUsername
      console.log(value)
      this.$router.push({
        path: 'addGood',
        query: value
      })
    },
    // 删除按钮确定
    async delinfobtn (value) {
      console.log(value)
      const { data: res } = await this.$http.delete(`/consume//deleteGoods?idc=${value.idc}`)
      if (res.code !== 100) return this.$message.error('删除商品失败')
      if (this.allTotal % this.mallInfo.selectCount === 1) {
        this.mallInfo.currenPage = this.mallInfo.currenPage - 1
      }
      this.$message.success('删除商品成功')
      console.log(res)
      this.getMallList()
    },
    // 每页条数变化
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.mallInfo.selectCount = val
      this.getMallList()
    },
    // 页数变化
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.mallInfo.currenPage = val
      this.getMallList()
    },
    searchUsername () {
      this.mallInfo.currenPage = 1
      this.getMallList()
    },
    // 图片预览
    lookImage (value) {
      console.log(value.image)
      this.imageUrl = value.image
      this.imageDialog = true
    }
  }
}
</script>

<style scoped lang='scss'>
.mallAdmin{
  .addBtn{
    margin: 20px;
    display: flex;
    width: 400px;
    .el-input{
      margin-left: 30px;
    }
  }
  .sellstatus0{
    color: red;
  }
  .sellstatus1{
    color:green
  }
}
.imageMall{
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.lookImage{
  width: 100%;
  height: 100%;
}
</style>
