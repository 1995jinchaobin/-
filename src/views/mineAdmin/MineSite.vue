<template>
  <div class="mineSite">
    <nav-top>
      <span slot="one">矿机管理</span>
      <span slot="two">矿机设置</span>
    </nav-top>
    <el-input
      placeholder="请输入矿机名"
      v-model="mimeSiteInfo.machineName"
      clearable
      @clear="searchMineAuthname">
      <el-button slot="append" icon="el-icon-search" @click="searchMineAuthname"></el-button>
    </el-input>
    <el-button type="primary" @click="addMine">添加矿机</el-button>
    <el-table
    :data="mineInfoList"
    stripe
    border
    >
      <el-table-column label="序号" type="index" width="60px" align="center"></el-table-column>
      <el-table-column prop="machinename" label="矿机名" align="center"></el-table-column>
      <el-table-column prop="machinetype" label="矿机分类" align="center"></el-table-column>
      <el-table-column prop="machineprefix" label="矿机前缀" align="center"></el-table-column>
      <!-- <el-table-column prop="price" label="矿机价格" align="center"></el-table-column> -->
      <el-table-column prop="runningdays" label="矿机有效时间(d)" align="center"></el-table-column>
      <el-table-column prop="dailycapacity" label="每日产量" align="center"></el-table-column>
      <el-table-column prop="purchaselimits" label="限购数量" align="center"></el-table-column>
      <el-table-column prop="power" label="个人算力" align="center"></el-table-column>
      <!-- <el-table-column prop="teampower" label="团队算力" align="center"></el-table-column> -->
      <!-- <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status">正常</span>
          <span v-else>冻结</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="注册时间" align="center">
        <template slot-scope="scope">
          {{scope.row.buildtime | dateFormat}}
        </template>
      </el-table-column> -->
      <el-table-column prop="goldb" label="B金币需要消耗数量" align="center"></el-table-column>
      <el-table-column label="图片" align="center">
        <template slot-scope="scope">
          <img :src="$imgUrl+scope.row.image" class="imageTable" @click="lookImage(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="总库存" align="center" width="80px"></el-table-column>
      <el-table-column prop="onshelftime" label="上架时间" align="center"></el-table-column>
      <el-table-column prop="offshelftime" label="下架时间" align="center"></el-table-column>
      <el-table-column  label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status===0" class="status0">已下架</span>
          <span v-else class="status1">已上架</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="zfb" label="支付宝" align="center"></el-table-column> -->
      <el-table-column label="操作" align="center" v-if="iswrite===1">
        <template slot-scope="scope">
          <el-link @click="changSite(scope.row)">修改</el-link>
          <el-link v-if="scope.row.status===0" @click="changeStatus(scope.row)">上架</el-link>
          <el-link v-else @click="changeStatus(scope.row)">下架</el-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="mimeSiteInfo.currenPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="mimeSiteInfo.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="allTotal">
    </el-pagination>
    <el-dialog
    :title="title"
    :visible.sync="changeSiteInfoDialog"
    width="60%"
    :close-on-click-modal='false'>
      <el-form
      :model="changeSiteInfo"
      label-width="150px">
        <el-form-item
        label="矿机名">
          <el-input v-model="changeSiteInfo.machinename"></el-input>
        </el-form-item>
        <el-form-item
        label="矿机分类">
          <el-input v-model="changeSiteInfo.machinetype"></el-input>
        </el-form-item>
        <el-form-item
        label="矿机前缀">
          <el-input v-model="changeSiteInfo.machineprefix"></el-input>
        </el-form-item>
        <el-form-item
        label="矿机价格">
          <el-input v-model="changeSiteInfo.price"></el-input>
        </el-form-item>
        <el-form-item
        label="矿机有效时间(d)">
          <el-input v-model="changeSiteInfo.runningdays"></el-input>
        </el-form-item>
        <el-form-item
        label="每日产量">
          <el-input v-model="changeSiteInfo.dailycapacity"></el-input>
        </el-form-item>
        <el-form-item
        label="限购数量">
          <el-input v-model="changeSiteInfo.purchaselimits"></el-input>
        </el-form-item>
        <el-form-item
        label="个人算力">
          <el-input v-model="changeSiteInfo.power"></el-input>
        </el-form-item>
        <!-- <el-form-item
        label="团队算力">
          <el-input v-model="changeSiteInfo.teamPower"></el-input>
        </el-form-item> -->
        <el-form-item
        label="B金币需要消耗数量">
          <el-input v-model="changeSiteInfo.goldb"></el-input>
        </el-form-item>
      <!-- 图片上传 -->
      <el-form-item label="上传图片">
        <!-- action 图片上传的数据库地址 on-remove 图片移除  list-type 图片显示效果  headers 设置上传的请求头部   on-success 文件上传成功的钩子函数-->
        <el-upload
        :limit=1
        :action="$imgUrl+'user/upload'"
        :before-upload="beforeAlbumUpload"
        :file-list="[]"
        :on-remove="handleRemove"
        list-type="picture"
        :headers='headerAuthorization' :on-success='headerSuccess'>
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
        <el-form-item
        label="总库存">
          <el-input v-model="changeSiteInfo.stock"></el-input>
        </el-form-item>
        <!-- <el-form-item
        label="上架时间">
          <el-input v-model="changeSiteInfo.onshelftime"></el-input>
        </el-form-item>
        <el-form-item
        label="下架时间">
          <el-input v-model="changeSiteInfo.offshelftime"></el-input>
        </el-form-item> -->
        <el-time-picker
          v-model="changeSiteInfo.onshelftime"
          value-format='HH:mm:ss'
          placeholder="选择开始时间">
        </el-time-picker>
        <el-time-picker
          v-model="changeSiteInfo.offshelftime"
          value-format='HH:mm:ss'
          placeholder="选择结束时间">
        </el-time-picker>
      </el-form>
      <span slot="footer">
        <el-button @click="changeSiteInfoDialog = false">取 消</el-button>
        <el-button type="primary" @click="changeSiteInfoDialogBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 图片预览 -->
    <el-dialog
    :visible.sync="imageDialog"
    width="40%">
      <img :src="$imgUrl+imageUrl" class="lookImage"/>
    </el-dialog>
  </div>
</template>

<script>
import NavTop from '@/components/common/NavTop.vue'
// import { delete } from 'vue/types/umd'
const Base64 = require('js-base64').Base64
export default {
  components: {
    NavTop
  },
  data () {
    return {
      iswrite: 0,
      mineInfoList: [],
      mimeSiteInfo: {
        machineName: '',
        currenPage: 1,
        limit: 10
      },
      allTotal: 0,
      changeSiteInfoDialog: false,
      changeSiteInfo: {
        goldb: null,
        idc: null,
        image: null,
        machinename: null,
        machinetype: null,
        offshelftime: null,
        onshelftime: null,
        power: null,
        price: null,
        purchaselimits: null,
        runningdays: null,
        status: null,
        stock: null,
        teampower: null,
        machineprefix: null,
        dailycapacity: null
      },
      status: 0,
      title: '',
      headerAuthorization: {
        // 给图片的上传路径添加保存在sessionStorage的token
        Authorization: window.sessionStorage.getItem('userToken')
      },
      // 图片预览消息框
      imageDialog: false,
      imageUrl: ''
    }
  },
  created () {
    this.getMineSiteList()
    this.iswrite = JSON.parse(Base64.decode(window.sessionStorage.getItem('obj'))).iswrite
  },
  methods: {
    async getMineSiteList () {
      console.log(this.mimeSiteInfo)
      const { data: res } = await this.$http.get('machineList/selectMachineManage', { params: this.mimeSiteInfo })
      console.log(res)
      if (res.code !== 100) return this.$message.error('获取矿机设置信息失败')
      this.mineInfoList = res.data.machineManageOfQuery.pageData
      this.allTotal = res.data.machineManageOfQuery.totalCount
    },
    // 修改矿机信息对话框确定按钮
    async changeSiteInfoDialogBtn () {
      console.log(this.changeSiteInfo)
      // const a = {
      //   goldb: this.changeSiteInfo.goldB,
      //   idc: this.changeSiteInfo.idc,
      //   image: this.changeSiteInfo.image,
      //   machinename: this.changeSiteInfo.machineName,
      //   machinetype: this.changeSiteInfo.machineType,
      //   offshelftime: this.changeSiteInfo.offShelfTime,
      //   onshelftime: this.changeSiteInfo.onShelfTime,
      //   power: this.changeSiteInfo.power,
      //   price: this.changeSiteInfo.machinePrice,
      //   purchaselimits: this.changeSiteInfo.purchaseLimits,
      //   runningdays: this.changeSiteInfo.runningDays,
      //   status: this.changeSiteInfo.status,
      //   stock: this.changeSiteInfo.stock,
      //   teampower: this.changeSiteInfo.teamPower
      // }
      // console.log(a)
      if (this.title === '矿机修改') {
        const { data: res } = await this.$http.post('machineList/updateMachineManage', this.changeSiteInfo)
        console.log(res)
        if (res.code !== 100) return this.$message.error('修改矿机设置失败')
        this.$message.success('修改矿机设置成功')
      } else {
        delete this.changeSiteInfo.idc
        const { data: res } = await this.$http.post('/machineList/insertMachineManage', this.changeSiteInfo)
        console.log(res)
        if (res.code !== 100) return this.$message.error('添加矿机失败')
        this.$message.success('添加矿机成功')
      }
      this.getMineSiteList()
      this.changeSiteInfoDialog = false
    },
    // 矿机修改操作打开
    changSite (value) {
      console.log(value)
      this.changeSiteInfo = JSON.parse(JSON.stringify(value))
      this.title = '矿机修改'
      this.changeSiteInfoDialog = true
    },
    // 矿机搜索
    searchMineAuthname () {
      this.mimeSiteInfo.currenPage = 1
      this.getMineSiteList()
    },
    // 每页条数变化
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.mimeSiteInfo.limit = val
      this.getMineSiteList()
    },
    // 页数变化
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.mimeSiteInfo.currenPage = val
      this.getMineSiteList()
    },
    // 修改上架下架
    async changeStatus (value) {
      console.log(value.status)
      if (value.status === 0) {
        this.status = 1
      } else {
        this.status = 0
      }
      // updateMachineStatus
      const { data: res } = await this.$http.post(`machineList/updateMachineStatus?idc=${value.idc}&status=${this.status}`)
      console.log(res)
      this.getMineSiteList()
    },
    // 添加矿机
    addMine () {
      this.title = '添加矿机'
      for (const key in this.changeSiteInfo) {
        this.changeSiteInfo[key] = null
      }
      // this.changeSiteInfo = {}
      this.changeSiteInfoDialog = true
    },
    // 图片预览
    lookImage (value) {
      console.log(value.image)
      this.imageUrl = value.image
      this.imageDialog = true
    },
    handleRemove (file) {
      this.changeSiteInfo.image = ''
    },
    // 文件上传成功的钩子函数
    headerSuccess (response) {
      console.log(response)
      this.changeSiteInfo.image = response.data.imgPath
    },
    // 文件上传限制
    beforeAlbumUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isLt2M
    }
  }
}
</script>

<style scoped lang='scss'>
.mineSite>.el-input{
  margin: 20px;
  width: 300px;
}
.status0{
  color:red
}
.status1{
  color:green
}
.imageTable{
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.lookImage{
  width: 100%;
  height: 100%;
}
</style>
