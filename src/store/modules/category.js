import request from '@/utils/request'
import { post, post_array } from '@/utils/request'

export default {
  namespaced: true,
  state: {
    categories: {
      list: []
    },
    params: {
      page: 0,
      pageSize: 6,
      name: ''
    },
    visible: false,
    title: '添加分类信息',
    parentIds: []
  },
  getters: {
    categorySize(state) {
      return state.categories.length
    },
    orderCategory: (state) => {
      return function(flag) {
        state.categories.sort((a, b) => {
          if (a[flag] > b[flag]) {
            return -1
          } else {
            return 1
          }
        })
        return state.categories
      }
    }
  },
  mutations: {
    showModal(state) {
      state.visible = true
    },
    closeModal(state) {
      state.visible = false
    },
    refreshCategories(state, categories) {
      state.categories = categories
      state.parentIds = []
      categories.list.map((item) => {
        if (item.parentId && state.parentIds.indexOf(item.parentId) == -1) {
          state.parentIds.push(item.parentId)
        }
      })
    },
    setTitle(state, title) {
      state.title = title
    }
  },
  actions: {
    async batchDeleteCategory({ dispatch, rootState }, ids) {
      // 1. 批量删除
      const response = await post_array('/category/batchDelete', { ids })
      // 2. 分发
      dispatch('loadPages', rootState.category.params)
      // 3. 返回结果
      return response
    },
    async deleteCategoryById({ dispatch, rootState }, id) {
      const response = await request.get('/category/deleteById?id=' + id)
      dispatch('loadPages', rootState.category.params)
      return response
    },
    // async findAllCategories(context){
    //   // 1. ajax查询
    //   let response = await request.get("/category/findAll");
    //   // 2. 将查询结果更新到state中
    //   context.commit("refreshCategories",response.data);
    // },
    // payload 顾客信息
    async saveOrUpdateCategory({ commit, dispatch, rootState }, payload) {
      // 1. 保存或更新
      const response = await post('/category/saveOrUpdate', payload)
      // 2. 刷新页面
      // console.log(rootState)
      dispatch('loadPages', rootState.category.params)
      // 3. 关闭模态框
      commit('closeModal')
      // 4. 提示
      return response
    },
    async loadPages(context, payload) {
      const response = await post('/category/query', payload)
      context.commit('refreshCategories', response.data)
    }
  }
}
