<template>
  <div>
      <el-form
      :model="adDialogInfo"
      label-width="150px"
      >
        <el-form-item
        label="ID">
          <el-input v-model="adDialogInfo.idc" disabled></el-input>
        </el-form-item>
        <el-form-item
        label="名称">
          <el-input v-model="adDialogInfo.advName"></el-input>
        </el-form-item>
        <el-form-item
        label="广告链接">
          <el-input v-model="adDialogInfo.link"></el-input>
        </el-form-item>
        <el-form-item
        label="图片">
          <el-input v-model="adDialogInfo.advImage"></el-input>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
export default {
  props: ['adDialogInfo']
}
</script>

<style>

</style>
