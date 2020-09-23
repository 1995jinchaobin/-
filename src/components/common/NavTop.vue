<template>
  <div class="navTop">
    <i class="el-icon-s-home" style="font-size:25px"></i>
    <span class='firstId'><slot name="one" ></slot></span>
    <i class="el-icon-arrow-right"></i>
    <slot name="two"><span></span></slot>
    <slot></slot>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped lang='scss'>
.navTop{
  width: 100%;
  height: 50px;
  background-color:#F5F5F5;
  display: flex;
  align-items: center;
  .firstId{
    color: #409bff;
    cursor: pointer;
  }
  i{
    margin: 10px;
  }
}
</style>
