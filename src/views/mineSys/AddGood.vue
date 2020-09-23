<template>
  <div class="addGood">
    <nav-top>
      <span slot="one">挖矿系统</span>
      <span slot="two">商城管理</span>
      <i class="el-icon-arrow-right"></i>
      <span>商品信息</span>
    </nav-top>
    <div class="returnBtn">
      <el-button
      type="primary"
      @click="returnMallBtn">返回商城</el-button>
    </div>
    <el-form ref="addFormRef" :model="addGoodForm" label-width="150px" :rules="addGoodFormRules">
      <el-form-item label="商品名字" prop="goodsName">
        <el-input v-model="addGoodForm.goodsName"></el-input>
      </el-form-item>
      <el-form-item label="金币需要消耗数量" prop="goodsPrice">
        <el-input v-model="addGoodForm.goodsPrice"></el-input>
      </el-form-item>
      <el-form-item label="库存" prop="stock">
        <el-input v-model="addGoodForm.stock"></el-input>
      </el-form-item>
      <el-form-item>
        <el-time-picker
          v-model="addGoodForm.selltimeStart"
          value-format='HH:mm:ss'
          placeholder="选择开始时间">
        </el-time-picker>
        <el-time-picker
          v-model="addGoodForm.selltimeEnd"
          value-format='HH:mm:ss'
          placeholder="选择结束时间">
        </el-time-picker>
        <el-radio v-model="addGoodForm.sellStatus" label='1'>开启</el-radio>
        <el-radio v-model="addGoodForm.sellStatus" label='0'>关闭</el-radio>
      </el-form-item>
      <el-form-item label="图片">
        <img :src="$imgUrl+addGoodForm.image" class="imageOld" @click="imageLook"/>
      </el-form-item>
      <el-form-item label="上传图片">
        <!-- <el-input v-model="addGoodForm.image"></el-input> -->
        <!-- 图片上传 -->
        <!-- action 图片上传的数据库地址   on-preview 图片预览   on-remove 图片移除  list-type 图片显示效果  headers 设置上传的请求头部   on-success 文件上传成功的钩子函数-->
        <el-upload
        :action="$imgUrl+'user/upload'"
        :before-upload="beforeAlbumUpload"
        :on-remove="handleRemove"
        list-type="picture"
        :headers='headerAuthorization' :on-success='headerSuccess'>
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="商品介绍">
        <!-- 富文本编辑器组件 -->
        <quill-editor v-model="addGoodForm.goodsInfo"></quill-editor>
      </el-form-item>
    </el-form>
    <el-button @click="formBtn" type="primary" class="addGoodBtn">保存</el-button>
    <!-- 图片预览对话框 -->
    <el-dialog :visible.sync="imgDialogVisible" width="80%">
      <img :src="$imgUrl+addGoodForm.image" class="lookImage"/>
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
      // 添加商品表单数据
      addGoodForm: {
        selltimeStart: '',
        selltimeEnd: '',
        sellStatus: '0',
        goodsName: '',
        goodsPrice: '',
        stock: '',
        image: '',
        goodsInfo: ''
      },
      addGoodFormRules: {
        goodsName: [
          { required: true, message: '请输入商品名字', trigger: 'blur' }
        ],
        goodsPrice: [
          { required: true, message: '请输入金币需要消耗数量', trigger: 'blur' }
        ],
        stock: [
          { required: true, message: '请输入库存', trigger: 'blur' }
        ]
      },
      // 图片预览
      imgDialogVisible: false,
      imgUrl: '',
      // 设置上传的请求头部
      headerAuthorization: {
        // 给图片的上传路径添加保存在sessionStorage的token
        Authorization: window.sessionStorage.getItem('userToken')
      }
    }
  },
  created () {
    console.log(this.$route.query.idc)
    console.log(this.$route.query)
    if (this.$route.query.idc !== undefined) {
      const a = {
        idc: parseInt(this.$route.query.idc),
        goodsName: this.$route.query.goodsname,
        goodsPrice: parseFloat(this.$route.query.goodsprice),
        stock: parseInt(this.$route.query.stock),
        image: this.$route.query.image,
        goodsInfo: this.$route.query.goodsinfo,
        selltimeStart: this.$route.query.selltimeStart,
        selltimeEnd: this.$route.query.selltimeEnd,
        sellStatus: this.$route.query.sellstatus
      }
      this.addGoodForm = a
    }
    // this.addGoodForm = this.$route.query
    // console.log(this.$route.query)
    console.log(this.addGoodForm)
  },
  methods: {
    // 返回商城按钮
    returnMallBtn () {
      this.$router.push({
        path: 'mallAdmin',
        query: { inputUsername: this.$route.query.inputUsername }
      })
    },
    // 图片移除点击函数
    handleRemove (file) {
      this.addGoodForm.image = ''
    },
    // 文件上传成功的钩子函数
    headerSuccess (response) {
      console.log(response)
      this.addGoodForm.image = response.data.imgPath
    },
    // 文件上传限制
    beforeAlbumUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    // 保存按钮
    formBtn () {
      console.log(this.addGoodForm)
      this.$refs.addFormRef.validate(async a => {
        if (!a) return
        console.log(this.$route)
        console.log(this.$route.query.idc)
        this.addGoodForm.goodsPrice = parseFloat(this.addGoodForm.goodsPrice).toFixed(2)
        this.addGoodForm.stock = parseInt(this.addGoodForm.stock)
        this.addGoodForm.sellStatus = parseInt(this.addGoodForm.sellStatus)
        if (this.$route.query.idc === undefined) {
          console.log(this.addGoodForm)
          const { data: res } = await this.$http.put('/consume/insertGoods', this.addGoodForm)
          console.log(res)
          if (res.code !== 100) return this.$message.error('添加商品失败')
          this.$message.success('添加商品成功')
        } else {
          console.log(this.addGoodForm)
          const { data: res } = await this.$http.put('/consume/updataGoods', this.addGoodForm)
          console.log(res)
          if (res.code !== 100) return this.$message.error('修改商品失败')
          this.$message.success('修改商品成功')
        }
        this.$router.push('mallAdmin')
      })
    },
    // 图片预览
    imageLook () {
      this.imgDialogVisible = true
    }
  }
}
</script>

<style scoped lang='scss'>
.addGood{
  .returnBtn{
    margin: 20px;
  }
  .el-form{
    margin: 20px;
    padding: 20px;
    border-top: 1px solid #ccc;
  }
  .el-upload-dragger{
    height: 40px !important;
  }
  .quill-editor,.ql-container {
    height: 250px !important;
  }
  .addGoodBtn{
    margin: 70px auto auto 200px;
  }
  .el-date-editor{
    margin-right: 20px;
  }
  .imageOld{
    width: 10%;
    height: 10%;
    cursor: pointer;
  }
  .lookImage{
    width: 100%;
    height: 100%;
  }
}
</style>
