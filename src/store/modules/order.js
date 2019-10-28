import {post,post_array,geta} from '@/utils/request'
import request from '@/utils/request'
import { stat } from 'fs'
import { param } from '@/utils'
import axios from 'axios'
import qs from 'qs'

export default {
    namespaced:true,
    state:{
        orders:[],
        orderPay:[],
        orderSend:[],
        orderReceive:[],
        orderService:[],
        orderSure:[],
        orderComplate:[],
        visible:false,
        // title:"派单",
        loading:false,

    },
    getters:{

    },
    mutations:{
        refreshOrders(state,orders){
            state.orders=orders
           
        },
        refreshorderPay(state,orders){
            state.orderPay=orders.filter((item)=>{
                return item.status==='待支付'
             })
        },
        refreshOrderSend(state,orders){
            state.orderSend=orders.filter((item)=>{
               return item.status==='待派单'
            })
        },
        refreshorderReceive(state,orders){
            state.orderReceive=orders.filter((item)=>{
                return item.status==='待接单'
             })
        },
        refreshorderService(state,orders){
            state.orderService=orders.filter((item)=>{
                return item.status==='未服务'
             })
        },
        refreshorderSure(state,orders){
            state.orderSure=orders.filter((item)=>{
                return item.status==='待确认'
             })
        },
        refreshorderComplate(state,orders){
            state.orderComplate=orders.filter((item)=>{
                return item.status==='已完成'
             })
        },
        // setTitle(state,title){
        //     state.title = title;
        // },
        beginLoading(state){
            state.loading= true;
        },
        endLoading(state){
            state.loading = false;
        },
        showModal(state){
            state.visible = true;
        },
        closeModal(state){
            state.visible = false;
        },
        dateParse(state){
            state.orders.forEach((item)=>{
                if(item.orderTime){
                    let date = new Date(item.orderTime);
                    let Y = date.getFullYear() + '-';
                    let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                    let D = (date.getDate()< 10 ? '0'+date.getDate() : date.getDate())+' ';
                    let h = (date.getHours()< 10 ? '0'+date.getHours() : date.getHours())+ ':';
                    let m = (date.getMinutes()< 10 ? '0'+date.getMinutes() : date.getMinutes())+ ':';
                    let s = (date.getSeconds()< 10 ? '0'+date.getSeconds() : date.getSeconds());
                    item.orderTime = Y+M+D+h+m+s;
                  }else{
                    return '';
                  }
            })

            
        },


        
    },
    actions:{
        async findAllOrders(context){
            context.commit("beginLoading")
           let response = await request.get("/order/findAll") ;
           
           context.commit("refreshOrders",response.data);
           context.commit("refreshOrderSend",response.data);
           context.commit("refreshorderPay",response.data);
           context.commit("refreshorderReceive",response.data);
           context.commit("refreshorderService",response.data);
           context.commit("refreshorderSure",response.data);
           context.commit("refreshorderComplate",response.data);
          

        //    let WaitReceive = response.data.filter((item)=>{
        //         return item.status === '待接单'
        //    });
        //    context.commit("refreshOrders",WaitReceive)

           context.commit("dateParse")

            setTimeout(()=>{
                context.commit("endLoading")
            },1000)
        },
        async Send(context,a){
            let response = await geta("/order/sendOrder",a)
            context.dispatch("findAllOrders")
            context.commit("closeModal");
            return response;
        },
        async closeOrder(context,payload){
            
            let response = await request.get("/order/cancelSendOrder?orderId="+payload)
            context.dispatch("findAllOrders")
            return response;
        }
       
    },


}