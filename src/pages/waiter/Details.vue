<template>
    <div class="waiterDrtails">
        <h2>员工详情</h2>
        <el-button size="small" type="text" @click="backHanlder">返回</el-button>
    </div>
</template>
<script>
   export default{
       methods:{
         backHanlder(){
        this.$router.go(-1)
    }
       }
   }
</script>