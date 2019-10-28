<template>
  <div class="waiter">
    <!-- 按钮 -->
    <!-- <el-row>
      <el-button type="primary" plain>主要按钮</el-button>
      <el-button type="danger" plain>危险按钮</el-button>
    </el-row> -->
     
    <!-- 表格 -->
    <div v-loading="loading">
      <el-table :data="waiters" size="mini">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="realname" label="姓名"></el-table-column>
        <el-table-column prop="telephone" label="手机号"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column prop="password" label="密码"></el-table-column>
        <el-table-column label="操作">
          <template #default="record">
              <a href="" @click.prevent="toDetailsHandler(record.row)">详情</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <el-pagination
    layout="prev, pager, next"
    :total="10">
    </el-pagination>
  </div>
</template>
<script>
  import {mapState,mapGetters,mapMutations,mapActions} from "vuex"
  export default {
    data(){
      return {

      }
    },
    computed:{
      ...mapState("waiter",["waiters","loading","total"]),
    },
    created(){
      this.findAllWaiters();
    },
    methods:{
      ...mapActions("waiter",["findAllWaiters"]),
      // 普通方法
      toDetailsHandler(waiter){
      //跳转到详情页面
      // this.$router.push("/waiterDetails")
      this.$router.push({
        path:"/waiter/details",
        query:{waiter:waiter}
      })
    },
    }
  }
</script>