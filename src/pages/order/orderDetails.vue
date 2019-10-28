<template>
    <div class="orderDetails">
        <h2>订单详情</h2>
        <el-button size="small" type="text" @click="backHandler">返回</el-button>
        <el-tabs v-model="activeName">
            <el-tab-pane label="顾客信息" name="ordercustomer">
                <el-table :data="orderDetails">
                <el-table-column label="姓名" prop="customer.realname"></el-table-column>
               
                <el-table-column label="手机号" prop="customer.telephone"></el-table-column>
                <el-table-column label="照片" prop="customer.photo"></el-table-column>
                </el-table>

            </el-tab-pane>
            <el-tab-pane label="服务员信息" name="orderwaiter">
                <el-table :data="orderDetails">
                <el-table-column label="姓名" prop="waiter.realname"></el-table-column>
               
                <el-table-column label="手机号" prop="waiter.telephone"></el-table-column>
                <el-table-column label="照片" prop="waiter.photo"></el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="服务地址信息" name="orderaddress">
                <el-table :data="orderDetails">
                <el-table-column label="省" prop="address.province"></el-table-column>
                <el-table-column label="市" prop="address.city"></el-table-column>
                <el-table-column label="区" prop="address.area"></el-table-column>
                <el-table-column label="街道" prop="address.address"></el-table-column>
                <el-table-column label="手机号" prop="address.telephone"></el-table-column>
                </el-table>
            </el-tab-pane>
             <el-tab-pane label="评论信息" name="comment">
                <el-table :data="comment">
                <el-table-column label="内容" prop="content"></el-table-column>
                <el-table-column label="评论时间" prop="commentTime"></el-table-column>
                
                </el-table>
                
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import {mapState,mapActions} from 'vuex'
export default {
    data(){
        return{
            activeName:"ordercustomer"
        }
    },
    created(){
        let customerId= this.$route.query.customerId
        this.findorderDetails(customerId);
        let id= this.$route.query.id
        this.findorderComment(id)
    },
    computed:{
       ...mapState("orderDetails",["orderDetails","comment"])
    },
    methods:{
        ...mapActions("orderDetails",["findorderDetails","findorderComment"]),
        backHandler(){
            this.$router.go(-1)
        },
  
        
        
    }
}
</script>