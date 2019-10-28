import request from '@/utils/request'
import {post,post_array} from '@/utils/request'
export default {
    namespaced:true,
    state:{
        waiters:[],
        loading:false,
        total:""
    },
    mutations:{
        refreshWaiters(state,waiters,total){
            state.waiters = waiters;
            state.total = total;
        },
        beginLoading(state){
            state.loading = true;
        },
        endLoading(state){
            state.loading = false;
        }
    },
    actions:{
        async findAllWaiters({dispatch,commit}){
            // 1.ajax查询
            commit("beginLoading");
            let response = await post("/waiter/query" ,{page:0,pageSize:5});
            // 2.将查询结果更新到state中
            console.log(response.data.total);
            commit("refreshWaiters",response.data.list,response.data.total);
            setTimeout(()=>{
                commit("endLoading")
            },1000)
        }
    }
        
}