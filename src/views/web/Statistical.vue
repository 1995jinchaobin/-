<template>
  <!-- 网站统计 -->
  <div class="statistical">
    <nav-top>
      <span slot="one">网站统计</span>
      <span slot="two">网站统计</span>
    </nav-top>
    <div class="main">
      <div class="tongji">
        <div class="table">
          <div class="title">会员总人数</div>
          <div class="content">{{tongji.num1}}</div>
        </div>
        <div class="table">
          <div class="title">矿机总台数(运行中)</div>
          <div class="content">{{tongji.num2}}</div>
        </div>
        <div class="table">
          <div class="title">矿机总算力(运行中)</div>
          <div class="content">{{tongji.num3}}</div>
        </div>
        <div class="table">
          <div class="title">虚拟币总量</div>
          <div class="content">{{tongji.num4}}</div>
        </div>
      </div>
      <web-content/>
    </div>
  </div>
</template>

<script>
import NavTop from '@/components/common/NavTop.vue'
import WebContent from '@/components/content/WebContent.vue'
export default {
  components: {
    WebContent,
    NavTop
  },
  data () {
    return {
      tongji: {
        num1: null,
        num2: null,
        num3: null,
        num4: null
      }
    }
  },
  created () {
    this.getInfoList()
  },
  methods: {
    async getInfoList () {
      const { data: res } = await this.$http.get('/index/selectSum')
      console.log(res)
      if (res.code !== 100) return this.$message.error('获取网站统计参数失败')
      this.tongji.num1 = res.data.member.vipCount
      this.tongji.num4 = res.data.member.htcSum
      this.tongji.num2 = res.data.machine.count
      this.tongji.num3 = res.data.machine.powersum
    }
  }
}
</script>

<style scoped lang='scss'>
.main{
  padding:20px;
  width:100%;
  .tongji{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .table{
    width: 32%;
    border-radius: 5px;
    border:1px solid #ccc;
    height: 90px;
    margin-bottom:20px;
    display: flex;
    flex-direction: column;
    .title{
      background-color: #F5F5F5;
      border-radius:5px 5px 0 0;
      flex:1;
      line-height: 45px;
      padding-left:20px;
      border-bottom:1px solid #ccc;
    }
    .content{
      flex:1;
      line-height: 45px;
      padding-left:20px;
    }
  }
}

</style>
