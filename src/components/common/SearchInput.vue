<!--<template>
  <el-input
  placeholder="请输入公告标题"
  v-model="inputInfo"
  clearable
  @clear="getNoticeList">
    <el-button
    slot="append"
    icon="el-icon-search"
    @click="getNoticeList">
    </el-button>
  </el-input>
</template>

<script>
export default {
  data () {
    return {
      inputInfo: ''
    }
  },
  methods: {
    getNoticeList () {
      this.$emit('getNoticeList', this.inputInfo)
    }
  }
}
</script>

<style scoped lang='scss'>
.el-input{
  width: 300px;
}
</style>-->
