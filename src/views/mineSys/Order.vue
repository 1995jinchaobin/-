<template>
  <div class="order">
    <nav-top>
      <span slot="one">挖矿系统</span>
      <span slot="two">商城管理</span>
    </nav-top>
    <div class="searchOrder">
      <el-input
      placeholder="请输入订单编号"
      v-model="orderInfo.orderId"
      clearable
      @clear="searchOrder">
        <el-button slot="append" icon="el-icon-search" @click="searchOrder"></el-button>
      </el-input>
      <el-select
      v-model="orderInfo.status"
      @change="searchOrder"
      placeholder='订单状态搜索'
      clearable>
        <el-option label="未付款" value="0"></el-option>
        <el-option label="已付款" value="1"></el-option>
        <el-option label="已发货" value="2"></el-option>
        <el-option label="已完成" value="3"></el-option>
      </el-select>
      <!-- <el-select
      v-model="tradeAreaInfo"
      @change="tradeAreaChange"
      placeholder='专区搜索'
      clearable>
        <el-option label="1区" value="1区"></el-option>
        <el-option label="2区" value="2区"></el-option>
      </el-select> -->
    </div>
    <el-table
    :data="orderList"
    stripe
    border
    >
      <el-table-column label="序号" type="index" width="60px" align="center"></el-table-column>
      <el-table-column prop="orderid" label="订单编号" align="center"></el-table-column>
      <!-- <el-table-column prop="size" label="订单号" align="center"></el-table-column> -->
      <el-table-column prop="goodsid" label="商品名称" align="center"></el-table-column>
      <el-table-column prop="payprice" label="支付金额" align="center"></el-table-column>
      <el-table-column prop="status" label="订单状态" align="center">
        <template slot-scope="scope">
            <span v-if='scope.row.status===0' class="status0">未付款</span>
            <span v-else-if='scope.row.status===1' class="status1">已付款</span>
            <span v-else-if='scope.row.status===2' class="status2">已发货</span>
            <span v-else class="status3">已完成</span>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" align="center" prop="creattime">
        <!-- <template slot-scope="scope">
          {{scope.row.bulidtime}}
        </template> -->
      </el-table-column>
      <el-table-column label="支付时间" align="center" prop="paytime">
        <!-- <template slot-scope="scope">
          {{scope.row.movetime}}
        </template> -->
      </el-table-column>
      <el-table-column label="操作" align="center" v-if="iswrite===1">
        <template slot-scope="scope">
          <el-link @click="moveOrderInfo(scope.row)">查看</el-link>
          <del-btn @delinfobtn='delinfobtn(scope.row)'></del-btn>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="orderInfo.currenPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="orderInfo.selectCount"
      layout="total, sizes, prev, pager, next, jumper"
      :total="allTotal">
    </el-pagination>
    <el-dialog
    title="订单详情"
    :visible.sync="orderDialogLook"
    width="60%"
    :close-on-click-modal='false'>
      <el-form
      :model="dialogInfo"
      label-width="150px">
        <el-form-item
        label="订单编号:">
          <span>{{dialogInfo.orderid}}</span>
        </el-form-item>
        <el-form-item
        label="用户ID:">
          <span>{{dialogInfo.userid}}</span>
        </el-form-item>
        <el-form-item
        label="用户名称">
          <span>{{dialogInfo.username}}</span>
        </el-form-item>
        <el-form-item
        label="购买商品">
          <span>{{dialogInfo.goodsid}}</span>
        </el-form-item>
        <el-form-item
        label="单价">
          <span>{{dialogInfo.unitprice}}</span>
        </el-form-item>
        <el-form-item
        label="购买数量">
          <span>{{dialogInfo.number}}</span>
        </el-form-item>
        <el-form-item
        label="总价">
          <span>{{dialogInfo.totalprice}}</span>
        </el-form-item>
        <el-form-item
        label="支付金额:">
          <span>{{dialogInfo.payprice}}
          </span>
        </el-form-item>
        <el-form-item
        label="订单备注:">
          <p>{{dialogInfo.remarks}}</p>
        </el-form-item>
        <el-form-item
        label="下单时间">
          <span>{{dialogInfo.creattime}}</span>
        </el-form-item>
        <el-form-item
        label="支付时间">
          <span>{{dialogInfo.paytime}}</span>
        </el-form-item>
        <el-form-item
        label="订单状态修改">
          <el-select
          v-model="status">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="orderDialogLook = false">取 消</el-button>
        <el-button type="primary" @click="orderDialogDef">确 定</el-button>
      </span>
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
      orderList: [],
      // 查询参数
      orderInfo: {
        orderId: '',
        selectCount: 10,
        currenPage: 1,
        status: ''
      },
      dialogInfo: {},
      orderDialogLook: false,
      allTotal: 0,
      // 选择框
      options: [
        { value: 0, label: '未付款' },
        { value: 1, label: '已付款' },
        { value: 2, label: '已发货' },
        { value: 3, label: '已完成' }
      ],
      status: 0
    }
  },
  created () {
    this.getOrderList()
    this.iswrite = JSON.parse(Base64.decode(window.sessionStorage.getItem('obj'))).iswrite
  },
  methods: {
    async getOrderList () {
      const { data: res } = await this.$http.get('consume/selectOrder', { params: this.orderInfo })
      console.log(res)
      if (res.code !== 100) return this.$message.error('获取订单信息失败')
      this.orderList = res.data.goodsPageData.pageData
      this.allTotal = res.data.goodsPageData.totalCount
    },
    // 查看订单
    moveOrderInfo (valve) {
      this.dialogInfo = valve
      this.status = valve.status
      console.log(valve)
      this.orderDialogLook = true
    },
    // 查看商品详情消息框确定按钮
    async orderDialogDef () {
      const a = {
        idc: this.dialogInfo.idc,
        status: this.status
      }
      console.log(a)
      const { data: res } = await this.$http.put('consume/updataOrder', a)
      console.log(res)
      if (res.code !== 100) return this.$message.error('修改订单状态失败')
      this.$message.success('修改订单状态成功')
      this.getOrderList()
      this.orderDialogLook = false
    },
    // 删除按钮确定
    async delinfobtn (value) {
      console.log(value)
      const { data: res } = await this.$http.delete(`consume/deleteOder?idc=${value.idc}`)
      console.log(res)
      if (res.code !== 100) return this.$message.error('删除用户失败')
      if (this.allTotal % this.orderInfo.selectCount === 1) {
        this.orderInfo.currenPage = this.orderInfo.currenPage - 1
      }
      console.log(res)
      this.$message.success('删除用户成功')
      this.getOrderList()
      // 刷新
    },
    // 订单搜索
    searchOrder () {
      this.orderInfo.currenPage = 1
      this.getOrderList()
    },
    // 每页条数变化
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.orderInfo.selectCount = val
      this.getOrderList()
    },
    // 页数变化
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.orderInfo.currenPage = val
      this.getOrderList()
    }
  }
}
</script>

<style scoped lang='scss'>
.order{
  .el-table{
    margin-top: 20px;
  }
  .el-switch{
    margin-right: 20px;
  }
  .searchOrder{
    display: flex;
    .el-input,.el-select{
      margin: 20px;
      width: 350px;
    }
  }
  .el-dialog .el-form-item{
    margin-bottom:1px ;
  }
  .status0{
    color:red
  }
  .status1{
    color: orange;
  }
  .status2{
    color:blue
  }
  .status3{
    color:green
  }
}
</style>
