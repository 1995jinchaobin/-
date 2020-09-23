<template>
  <div class="jbpeizhi">
    <nav-top>
      <span slot="one">网站配置</span>
      <span slot="two">基本配置</span>
    </nav-top>
    <div class="main">
      <el-button type="danger" @click="getJBpeizhiList">刷新</el-button>
      <el-table
        :data="JBpeizhiList"
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
            <el-link @click="changeJBpeizhi(scope.row)">确认配置</el-link>
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
      // 基本配置信息
      JBpeizhiList: []
    }
  },
  created () {
    this.getJBpeizhiList()
    this.iswrite = JSON.parse(Base64.decode(window.sessionStorage.getItem('obj'))).iswrite
  },
  methods: {
    // 获取基本配置数据
    async getJBpeizhiList () {
      const { data: res } = await this.$http.get('setting/selectBaseSetting')
      console.log(res)
      if (res.code !== 100) return this.$message.error('获取基本配置失败')
      this.JBpeizhiList = res.data.baseList
    },
    // 修改基本配置
    async changeJBpeizhi (value) {
      console.log(value)
      const a = {
        idc: value.idc,
        params: value.params
      }
      console.log(a)
      const { data: res } = await this.$http.post('setting/updateBaseSetting', a)
      console.log(res)
      if (res.code !== 100) return this.$message.error('修改基本配置失败')
      this.$message.success('修改基本配置成功')
      this.getJBpeizhiList()
    }
  }
}
</script>

<style scoped lang='scss'>
.el-button{
  margin:20px;
}
</style>
