<!--<template>
  <div class="homeUp">
    <nav-top>
      <span slot="one">挖矿系统</span>
      <span slot="two">首页弹出公告</span>
    </nav-top>
    <div class="adTop">
      <search-input></search-input>
      <el-button type="primary" @click="addAnnouce">添加公告</el-button>
    </div>
    <el-table
    :data="annouceList"
    stripe
    border
    >
      <el-table-column label="序号" type="index" width="60px" align="center"></el-table-column>
      <el-table-column prop="title" label="公告标题" align="center"></el-table-column>
      <el-table-column prop="content" label="公告内容" align="center"></el-table-column>
      <el-table-column label="发布公告" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-share" @click="annouceBtn(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
    title="添加公告"
    :visible.sync="addAnnouceDialog"
    width="70%"
    @close="closeDialog"
    :close-on-click-modal='false'>
      <el-form
      ref="addAnnouceFormRef"
      :model="addAnnouceForm"
      :rules="addAnnouceRules">
        <el-form-item
        label="标题"
        prop="newTitle">
          <el-input v-model="addAnnouceForm.newTitle" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item
        label="内容"
        prop="newContent">
          <el-input
          type="textarea"
          :rows="10"
          placeholder="请输入内容"
          v-model="addAnnouceForm.newContent">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addAnnouceDialog = false">取 消</el-button>
        <el-button type="primary" @click="addAnnouceSureBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import NavTop from '@/components/common/NavTop.vue'
import SearchInput from '@/components/common/SearchInput.vue'
export default {
  components: {
    NavTop,
    SearchInput
  },
  data () {
    return {
      annouceList: [
        { title: '公告123', content: '公告312内容' },
        { title: '公告23123', content: '公告4123内容' },
        { title: '公告412123', content: '公告4123内容' },
        { title: '公412告123', content: '公412告内容' },
        { title: '公告412123', content: '公告54123内容' },
        { title: '公3告123', content: '公告1234内容' }
      ],
      // 添加公告的消息框
      addAnnouceDialog: false,
      addAnnouceForm: {},
      // 验证添加
      addAnnouceRules: {
        newTitle: [
          { required: true, message: '请输入公告标题', trigger: 'blur' },
          { min: 3, message: '长度在3个字符以上', trigger: 'blur' }
        ],
        newContent: [
          { required: true, message: '请输入公告内容', trigger: 'blur' },
          { min: 6, message: '长度在6个字符以上', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 添加公告按钮
    addAnnouce () {
      this.addAnnouceForm = {
        newTitle: '',
        newContent: ''
      }
      this.addAnnouceDialog = true
    },
    // 发布公告按钮
    annouceBtn (value) {
      console.log(value)
    },
    // 添加公告消息框确定按钮
    addAnnouceSureBtn () {
      this.$refs.addAnnouceFormRef.validate(value => {
        if (!value) return
        // post请求
        // if (res.meta.status !== 200)  return this.$message.error('添加公告失败')
        this.$message.success('添加公告成功')
        // 刷新
        console.log(this.addAnnouceForm)
        this.addAnnouceDialog = false
      })
    },
    // 添加公告消息框关闭
    closeDialog () {
      // 清空验证和表单数据
      // this.$refs.addAnnouceFormRef.resetFields()
      // 只清空验证
      this.$refs.addAnnouceFormRef.clearValidate()
      console.log('添加公告对话框关闭')
    }
  }
}
</script>

<style scoped lang='scss'>
.homeUp{
  .adTop{
    margin: 20px;
    display: flex;
    justify-content: space-between;
  }
}
</style>-->
