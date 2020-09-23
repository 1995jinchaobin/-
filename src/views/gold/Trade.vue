<template>
  <div class="trade">
    <nav-top>
      <span slot="one">金币区</span>
      <span slot="two">金币交易</span>
    </nav-top>
    <el-input
      placeholder="请输入订单编号"
      v-model="tradeInfo.orderId"
      clearable
      @clear="searchTrade">
      <el-button slot="append" icon="el-icon-search" @click="searchTrade"></el-button>
    </el-input>
    <el-select
    v-model="tradeInfo.status"
    @change="searchTrade"
    placeholder='订单状态搜索'
    clearable>
      <el-option label="交易成功" value="1"></el-option>
      <el-option label="交易取消" value="0"></el-option>
    </el-select>
    <el-select
    v-model="tradeInfo.area"
    @change="searchTrade"
    placeholder='专区搜索'
    clearable>
      <el-option label="1区" value="1"></el-option>
      <el-option label="2区" value="2"></el-option>
    </el-select>
    <el-table
    :data="tradeList"
    stripe
    border
    >
      <el-table-column label="序号" type="index" width="60px" align="center"></el-table-column>
      <el-table-column prop="orderId" label="订单编号" align="center"></el-table-column>
      <el-table-column prop="buyerId" label="买家ID" align="center"></el-table-column>
      <el-table-column prop="number" label="数量" min-width="40px" align="center"></el-table-column>
      <el-table-column prop="unitPrice" label="单价" min-width="40px" align="center"></el-table-column>
      <el-table-column prop="totalPrice" label="总价" min-width="40px" align="center"></el-table-column>
      <el-table-column label="专区" min-width="40px" align="center">
        <template slot-scope="scope">
          {{scope.row.area}}<span>区</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" min-width="60px">
        <template slot-scope="scope">
          <span v-if="scope.row.status===1" class="status1">交易成功</span>
          <span v-else class="status0">交易取消</span>
        </template>
      </el-table-column>
      <el-table-column label="交易时间" align="center">
        <template slot-scope="scope">
          {{scope.row.tradeTime}}
          <!-- {{scope.row.buildtime | dateFormat}} -->
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="60px">
        <template slot-scope="scope">
          <el-link @click="lookTradeDetail(scope.row)">查看详情</el-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="tradeInfo.currenPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="tradeInfo.selectCount"
      layout="total, sizes, prev, pager, next, jumper"
      :total="allTotal">
    </el-pagination>
    <el-dialog
    title="查看详情"
    :visible.sync="lookTradeDialog"
    width="95%">
      <el-table
      :data="lookTradeInfo"
      stripe
      border
      >
        <el-table-column label="序号" type="index" width="60px" align="center"></el-table-column>
        <el-table-column prop="orderId" label="订单编号" align="center"></el-table-column>
        <el-table-column prop="buyerId" label="买家信息" align="center"></el-table-column>
        <el-table-column prop="sellerId" label="卖家信息" align="center"></el-table-column>
        <el-table-column prop="number" label="数量" align="center" min-width="40px"></el-table-column>
        <el-table-column prop="unitPrice" label="单价" align="center" min-width="40px"></el-table-column>
        <el-table-column prop="totalPrice" label="总价" align="center" min-width="40px"></el-table-column>
        <el-table-column prop="area" label="专区" align="center" min-width="40px"></el-table-column>
        <el-table-column label="状态" align="center" min-width="60px">
          <template slot-scope="scope">
            {{scope.row.status}}
            <!-- <span v-if="scope.row.status">交易成功</span>
            <span v-else>交易取消</span> -->
          </template>
        </el-table-column>
        <el-table-column label="交易时间" prop="tradeTime" align="center">
          <!-- <template slot-scope="scope"> -->
            <!-- {{scope.row.buildtime | dateFormat}} -->
          <!-- </template> -->
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import NavTop from '@/components/common/NavTop.vue'
export default {
  components: {
    NavTop
  },
  data () {
    return {
      tradeList: [],
      lookTradeDialog: false,
      lookTradeInfo: [],
      // 搜索信息
      tradeInfo: {
        orderId: '',
        buyerId: '',
        status: '',
        area: '',
        tradeTime: '',
        selectCount: 10,
        currenPage: 1
      },
      allTotal: 0
    }
  },
  created () {
    this.getTradeList()
  },
  methods: {
    async getTradeList () {
      const { data: res } = await this.$http.get('goldArea/seleteGoldOrder', { params: this.tradeInfo })
      console.log(res)
      if (res.code !== 100) return this.$message.error('获取金币交易信息失败')
      this.tradeList = res.data.oplPageData.pageData
      this.allTotal = res.data.oplPageData.totalCount
    },
    // 搜索
    searchTradeInfo () {
      console.log(this.searchTrade)
    },
    // 订单详情查看
    lookTradeDetail (value) {
      this.lookTradeInfo = [value]
      console.log(this.lookTradeInfo)
      this.lookTradeDialog = true
    },
    // 查询
    searchTrade () {
      this.tradeInfo.currenPage = 1
      this.getTradeList()
    },
    // 每页条数变化
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.tradeInfo.selectCount = val
      this.getTradeList()
    },
    // 页数变化
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.tradeInfo.currenPage = val
      this.getTradeList()
    }
  }
}
</script>

<style scoped lang='scss'>
.el-input{
  width: 280px;
  margin: 20px;
}
.el-select{
  margin: auto 20px;
  width: 150px;
}
.status0{
  color:red
}
.status1{
  color:green
}
</style>
