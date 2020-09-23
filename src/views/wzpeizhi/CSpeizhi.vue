<template>
  <div class="cspeizhi">
    <nav-top>
      <span slot="one">网站配置</span>
      <span slot="two">参数配置</span>
    </nav-top>
    <div class="main">
      <el-button type="danger" @click="getCSpeizhiList">刷新</el-button>
      <el-table
        :data="CSpeizhiList"
        stripe
        border>
        <el-table-column
          type="index"
          label="序号"
          width="50px"
          align="center">
        </el-table-column>
        <el-table-column
          prop="paramsDescription"
          label="参数说明"
          align="center">
        </el-table-column>
        <el-table-column
          prop="key"
          label="key值"
          align="center">
        </el-table-column>
        <el-table-column
          label="参数值"
          align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.params"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          v-if="iswrite===1">
          <template slot-scope="scope">
            <el-link @click="changeCSpeizhi(scope.row)">确认配置</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
      // 参数配置列表信息
      CSpeizhiList: []
    }
  },
  created () {
    this.getCSpeizhiList()
    this.iswrite = JSON.parse(Base64.decode(window.sessionStorage.getItem('obj'))).iswrite
  },
  methods: {
    // 获取参数配置列表信息
    async getCSpeizhiList () {
      const { data: res } = await this.$http.get('setting/selectMachineParamsSetting')
      console.log(res)
      if (res.code !== 100) return this.$message.error('获取参数配置失败')
      this.CSpeizhiList = res.data.machineList
    },
    // 修改参数配置
    async changeCSpeizhi (value) {
      console.log(value)
      console.log(value)
      const a = {
        idc: value.idc,
        params: value.params
      }
      console.log(a)
      const { data: res } = await this.$http.post('setting/updateMachineParamsSetting', a)
      console.log(res)
      if (res.code !== 100) return this.$message.error('修改参数配置失败')
      this.$message.success('修改参数配置成功')
      this.getCSpeizhiList()
    }
  }
}
</script>

<style scoped lang='scss'>
.el-button{
  margin:20px;
}
</style>
