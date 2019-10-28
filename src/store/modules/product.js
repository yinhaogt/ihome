import request from '@/utils/request'
import { post, post_array } from '@/utils/request'

export default {
  namespaced: true,
  state: {
    products: {
      list: []
    },
    params: {
      page: 0,
      pageSize: 6,
      name: '',
      status: ''
    },
    visible: false,
    title: '添加分类信息',
    categoryIds: []
  },
  getters: {
    productSize(state) {
      return state.products.length
    },
    orderProduct: (state) => {
      return function(flag) {
        state.products.sort((a, b) => {
          if (a[flag] > b[flag]) {
            return -1
          } else {
            return 1
          }
        })
        return state.products
      }
    }
  },
  mutations: {
    showModal(state) {
      state.visible = true
    },
    jiangxu: (state) => {
      state.products.list.sort((a, b) => {
        if (a.price > b.price) {
          return -1
        } else {
          return 1
        }
      })
      // return state.products;
    },
    shengxu: (state) => {
      state.products.list.sort((a, b) => {
        if (a.price > b.price) {
          return 1
        } else {
          return -1
        }
      })
      // return state.products;
    },
    closeModal(state) {
      state.visible = false
    },
    refreshCategories(state, products) {
      state.products = products
      state.categoryIds = []
      products.list.map((item) => {
        if (item.categoryId && state.categoryIds.indexOf(item.categoryId) == -1) {
          state.categoryIds.push(item.categoryId)
        }
      })
    },
    loadCategoryId(state, products) {
      state.products.list = products
    },
    setTitle(state, title) {
      state.title = title
    }
  },
  actions: {
    async batchDeleteProduct({ dispatch, rootState }, ids) {
      // 1. 批量删除
      const response = await post_array('/product/batchDelete', { ids })
      // 2. 分发
      dispatch('loadPages', rootState.product.params)
      // 3. 返回结果
      return response
    },
    async deleteProductById({ dispatch, rootState }, id) {
      const response = await request.get('/product/deleteById?id=' + id)
      dispatch('loadPages', rootState.product.params)
      return response
    },

    async saveOrUpdateProduct({ commit, dispatch, rootState }, payload) {
      // 1. 保存或更新
      const response = await post('/product/saveOrUpdate', payload)
      // 2. 刷新页面
      // console.log(rootState)
      dispatch('loadPages', rootState.product.params)
      // 3. 关闭模态框
      commit('closeModal')
      // 4. 提示
      return response
    },
    async loadPages(context, payload) {
      const response = await post('/product/query', payload)
      context.commit('refreshCategories', response.data)
    },
    async searchByCategoryId(context, payload) {
      const response = await request.get('/product/findByCategoryId?id=' + payload)
      context.commit('loadCategoryId', response.data)
    }
  }
}
