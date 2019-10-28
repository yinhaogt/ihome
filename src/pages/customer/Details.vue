<template>
  <div class="customerDetails">
    <h2>顾客详情</h2>
    <el-button size="small" type="text" @click="backHandler">返回</el-button>
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="info">
         <div class="baseMessage">
           <el-row>
             <el-col :span="4">ID号：</el-col>
             <el-col :span="10">{{customers.id}}</el-col>
           </el-row>
           <el-row>
             <el-col :span="4">姓名：</el-col>
             <el-col :span="10">{{customers.realname}}</el-col>
           </el-row>
           <el-row>
             <el-col :span="4">电话：</el-col>
             <el-col :span="10">{{customers.telephone}}</el-col>
           </el-row>
           <el-row>
             <el-col :span="4">状态：</el-col>
             <el-col :span="10">{{customers.status}}</el-col>
           </el-row>
           <el-row>
             <el-col :span="4">照片：</el-col>
             <el-col :span="10">{{customers.photo}}</el-col>
           </el-row>
         </div>
      </el-tab-pane>
      <el-tab-pane label="订单信息" name="orders">
        <el-table :data="orderMessage">
          <el-table-column label="订单ID" prop=""></el-table-column>
          <el-table-column label="订单时间" prop="orderTime"></el-table-column>
          <el-table-column label="状态" prop="status"></el-table-column>
          <el-table-column label="员工号" prop="waiterId"></el-table-column>
          <el-table-column label="地址号" prop="addressId"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="服务地址" name="address">
        <el-table :data="address">
          <el-table-column label="省" prop="province"></el-table-column>
          <el-table-column label="市" prop="city"></el-table-column>
          <el-table-column label="区" prop="area"></el-table-column>
          <el-table-column label="街道" prop="address"></el-table-column>
          <el-table-column label="手机号" prop="telephone"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import {mapState,mapActions, mapMutations} from 'vuex'
export default {
  data(){
    return {
      activeName:"info",
      customers:this.$route.query.customer,
      orderMessage:{}
    }
  },
  created(){
    console.log(this.$route);
    console.log("cus:",this.customers)
   // console.log('ord',this.orders)
   // var customers = this.$route.query.customer;
    let id = this.$route.query.customer.id;
    // 通过id查询顾客，订单，地址
    this.findAddressByCustomerId(id);
    this.findAllOrders();
    this.findOrderBycustomer();
  },
  computed:{
    ...mapState("address",["address"]),
    ...mapState("order",["orders","loading"])
  },
  methods:{
    ...mapActions("address",["findAddressByCustomerId"]),
    ...mapActions("order",["findAllOrders"]),
    ...mapMutations("order",["beginLoading","endLoading"]),
    backHandler(){
      // this.$router.push("/customer")
      this.$router.go(-1)
    },
    findOrderBycustomer(){
      this.beginLoading();
      for(let v in this.orders){
        if(this.customers.id === this.orders[v].customerId){
          this.orderMessage = this.orders[v]
        }
      }
      this.endLoading();
    }
  }

}
</script>
<style scoped>
  .baseMessage{
    margin: 0 auto;
    padding: 20px;
    width: 400px;
    height: 400px;
    border: 1px solid #000;
  }
  .baseMessage>.el-row{
    height: 40px;
    color: #606266;
  }
</style>