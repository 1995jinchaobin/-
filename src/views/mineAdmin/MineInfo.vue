<template>
  <div class="MineInfo">
    <nav-top>
      <span slot="one">矿机管理</span>
      <span slot="two">矿机详情</span>
    </nav-top>
    <el-input
    placeholder="请输入矿机编号"
    v-model="mineInfo.machineNum"
    clearable
    @clear="searchUsername">
        <el-button slot="append" icon="el-icon-search" @click="searchUsername"></el-button>
      </el-input>
    <el-table
    :data="mineInfoList"
    stripe
    border
    >
      <el-table-column label="序号" type="index" width="60px" align="center"></el-table-column>
      <el-table-column prop="machineNum" label="矿机编号" align="center"></el-table-column>
      <el-table-column prop="userName" label="会员用户名" align="center"></el-table-column>
      <el-table-column prop="machineName" label="矿机名" align="center"></el-table-column>
      <el-table-column prop="machineType" label="矿机类型" align="center"></el-table-column>
      <el-table-column prop="power" label="算力" align="center"></el-table-column>
      <el-table-column prop="runningDaysCycle" label="周期h(已运行/剩余)" align="center"></el-table-column>
      <el-table-column prop="dailyCapacity" label="每日产量" align="center"></el-table-column>
      <!-- <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status">正常</span>
          <span v-else>冻结</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="capacityNow" label="产量(当前/剩余)" align="center" width="120px">
        <!-- <template slot-scope="scope">
          {{scope.row.buildtime | dateFormat}}
        </template> -->
      </el-table-column>
      <el-table-column prop="buyTime" label="购买时间" align="center" width="160px"></el-table-column>
      <el-table-column label="状态" align="center" width="80px">
        <template slot-scope="scope">
          <span v-if="scope.row.machineStatus==='0'" class="statusR">运行完成</span>
          <span v-else-if="scope.row.machineStatus==='1'" class="statusG">运行中</span>
          <span v-else class="statusY">运行暂停</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" v-if="iswrite===1">
        <template slot-scope="scope">
          <el-link v-if="scope.row.machineStatus==='1'" @click="changeStatus(scope.row)">停止</el-link>
          <el-link v-else-if="scope.row.machineStatus==='2'" @click="changeStatus(scope.row)">开启</el-link>
          <del-btn @delinfobtn='delinfobtn(scope.row)'></del-btn>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="mineInfo.currenPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="mineInfo.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="allTotal">
    </el-pagination>
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
      mineInfoList: [
        // { username: '124123123', name: '123' }
      ],
      mineInfo: {
        machineNum: '',
        limit: 10,
        currenPage: 1
      },
      allTotal: 0
    }
  },
  created () {
    this.getMineList()
    this.iswrite = JSON.parse(Base64.decode(window.sessionStorage.getItem('obj'))).iswrite
  },
  methods: {
    // 获取矿机详情列表
    async getMineList () {
      const { data: res } = await this.$http.get('machineList/selectMachineInfo', { params: this.mineInfo })
      console.log(res)
      if (res.code !== 100) return this.$message.error('获取矿机详情数据失败')
      this.mineInfoList = res.data.machineInfoOfQuery.pageData
      this.allTotal = res.data.machineInfoOfQuery.totalCount
    },
    // 删除按钮确定
    async delinfobtn (value) {
      console.log(value.machineNum)
      const { data: res } = await this.$http.delete(`machineList/delMachineInfoById?machineNum=${value.machineNum}`)
      console.log(res)
      if (res.code !== 100) return this.$message.error('删除矿机编号失败')
      if (this.allTotal % this.mineInfo.limit === 1) {
        this.mineInfo.currenPage = this.mineInfo.currenPage - 1
      }
      this.$message.success('删除矿机编号成功')
      this.getMineList()
    },
    // 用户名搜索
    searchUsername () {
      this.mineInfo.currenPage = 1
      this.getMineList()
    },
    // 矿机状态改变
    async changeStatus (value) {
      console.log(value)
      const { data: res } = await this.$http.post(`machineList/updateMachineInfoStatus?id=${value.id}&status=${value.machineStatus}&buyTime=${value.buyTime}&stopTime=${value.stopTime}&runningTime=${value.runningTime}`)
      console.log(res)
      if (res.code !== 100) return this.$message.error('修改矿机状态失败')
      this.$message.success('修改矿机状态成功')
      this.getMineList()
    },
    // 每页条数变化
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.mineInfo.limit = val
      this.getMineList()
    },
    // 页数变化
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.mineInfo.currenPage = val
      this.getMineList()
    }
  }
}
</script>

<style scoped lang='scss'>
.MineInfo>.el-input{
  width: 300px;
  margin: 20px;
}
.statusG{
  color: green;
}
.statusR{
  color: red;
}
.statusY{
  color:orange;
}
</style>
