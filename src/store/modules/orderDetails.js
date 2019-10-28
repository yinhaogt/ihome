import request from '@/utils/request'
export default {
  namespaced:true,
  state:{
    orderDetails:[],
    comment:[]
  },
  mutations:{
    refreshorderDetails(state,orderDetails){
      state.orderDetails = orderDetails;
    },
    refreshorderComment(state,comment,id){
        state.comment=comment;
        // state.comment = comment.filter((item)=>{
        //     return item.orderId==id
        // });
    }
  },
  actions:{
    async findorderDetails(context,customerId){
      let response = await request.get("/order/query?customerId="+customerId);
      context.commit("refreshorderDetails",response.data)
    },
    async findorderComment(context,id){
      let response = await request.get("/comment/findAll");
      context.commit("refreshorderComment",response.data,id)
    }
  }
}