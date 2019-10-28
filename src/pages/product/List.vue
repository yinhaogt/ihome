<template>
  <div class="product">
    <!-- 按钮 -->
    <el-row>
      <el-col :span="2">
        <el-button size="small" type="danger" @click="batchDeleteHandler">批量删除</el-button>
      </el-col>
      <el-col :span="2">
        <el-button size="small" type="primary" @click="toAddHandler">添加</el-button>
      </el-col>
      <el-col :span="4">
        <el-input v-model="params.name" placeholder="根据名称查询" :clearable="true" />
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="searchByName">查询</el-button>
      </el-col>
      <el-col :span="2">
        <el-select v-model="paixu" size="mini" @change="paixuHandler">
          <el-option value label="排序" />
          <el-option value="升序" />
          <el-option value="降序" />
        </el-select>
      </el-col>
      <el-col :span="2" :push="1">
        <el-select v-model="params.status" size="mini" @change="statusHandler">
          <el-option value label="所有" />
          <el-option value="有货" />
          <el-option value="无货" />
        </el-select>
      </el-col>
      <el-col :span="2" :push="4">
        <el-select v-model="product.categoryId" size="mini" @change="categorySearch">
          <el-option value="" label="所有" />
          <el-option v-for="c of categoryIds" :key="c" :value="c" />
        </el-select>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <div v-loading="loading">
      <el-table :data="products.list" size="mini" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="编号" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="price" label="价格" />
        <el-table-column prop="status" label="状态" />
        <el-table-column label="照片">
          <template #default="scope">
            <img :src="scope.row.photo" width="50px" style="background-size:cover">
          </template>
        </el-table-column>
        <el-table-column prop="categoryId" label="分类ID" />
        <el-table-column label="操作">
          <template #default="record">
            <i
              class="el-icon-delete"
              href
              style="cursor:pointer"
              @click.prevent="deleteHandler(record.row.id)"
            /> &nbsp;
            <i
              class="el-icon-edit-outline"
              href
              style="cursor:pointer"
              @click.prevent="editHandler(record.row)"
            /> &nbsp;
            <!-- <a href @click.prevent="toDetailsHandler(record.row)">详情</a> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          layout="prev, pager, next"
          :total="products.total"
          :page-size="params.pageSize"
          :current-page.sync="params.page+1"
          @current-change="pageChangeHandler"
        />
      </div>
    </div>
    <!-- 模态框 -->
    <el-dialog :title="title" :visible.sync="visible" @close="dialogCloseHandler">
      <el-form ref="productForm" :model="product" :rules="rules">
        <el-form-item label="名称" label-width="100px" prop="name">
          <el-input v-model="product.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="描述" label-width="100px" prop="description">
          <el-input v-model="product.description" auto-complete="off" />
        </el-form-item>
        <el-form-item label="价格" label-width="100px" prop="price">
          <el-input v-model="product.price" auto-complete="off" />
        </el-form-item>
        <el-form-item label="状态" label-width="100px" prop="status">
          <el-select v-model="product.status">
            <el-option value="有货" />
            <el-option value="无货" />
          </el-select>
        </el-form-item>
        <el-form-item label="照片" label-width="100px" prop="photo">
          <el-input v-model="product.photo" auto-complete="off" />
        </el-form-item>
        <el-form-item label="分类ID" label-width="100px" prop="categoryId">
          <el-select v-model="product.categoryId">
            <el-option v-for="c of categoryIds" :key="c" :value="c" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeModal">取 消</el-button>
        <el-button size="small" type="primary" @click="submitHandler">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /模态框 -->
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  data() {
    return {
      product: {},
      ids: [],
      paixu: '',
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ],
        status: [{ required: true, message: '请输入状态', trigger: 'blur' }],
        price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
        photo: [{ required: true, message: '请输入照片路径', trigger: 'blur' }],
        categoryId: [
          { required: true, message: '请输入分类ID', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState('product', [
      'products',
      'visible',
      'title',
      'loading',
      'categoryIds',
      'params'
    ]),
    ...mapGetters('product', ['orderCustomer', 'productSize'])
  },
  created() {
    this.loadPages(this.params)
  },
  methods: {
    ...mapMutations('product', [
      'showModal',
      'closeModal',
      'setTitle',
      'shengxu',
      'jiangxu'
    ]),
    ...mapActions('product', [
      'saveOrUpdateProduct',
      'deleteProductById',
      'batchDeleteProduct',
      'loadPages',
      'searchByCategoryId'
    ]),
    // 普通方法
    paixuHandler() {
      if (this.paixu === '') {
        this.loadPages(this.params)
      } else if (this.paixu === '升序') {
        this.shengxu()
      } else if (this.paixu === '降序') {
        this.jiangxu()
      }
    },
    categorySearch(v) {
      if (v === '') {
        this.loadPages(this.params)
      } else {
        this.searchByCategoryId(v)
      }
    },
    statusHandler() {
      this.loadPages(this.params)
    },
    searchByName() {
      this.params.page = 0
      this.loadPages(this.params)
    },
    handleSelectionChange(val) {
      this.ids = val.map(item => item.id)
    },
    toAddHandler() {
      // 1. 重置表单
      this.product = {}
      this.setTitle('添加分类信息')
      // 2. 显示模态框
      this.showModal()
    },
    pageChangeHandler(page) {
      this.params.page = page - 1
      this.loadPages(this.params)
    },
    submitHandler() {
      // 校验
      this.$refs.productForm.validate(valid => {
        // 如果校验通过
        if (valid) {
          const promise = this.saveOrUpdateProduct(this.product)
          promise.then(response => {
            // promise为action函数的返回值，异步函数的返回值就是promise的then回调函数的参数
            this.$message({ type: 'success', message: response.statusText })
          })
        } else {
          return false
        }
      })
    },
    dialogCloseHandler() {
      // this.$refs.productForm.resetFields();
      this.$refs.productForm.clearValidate()
      this.product = {}
      this.closeModal()
    },
    editHandler(row) {
      const newRow = { ...row }
      this.product = newRow
      this.setTitle('修改分类信息')
      this.showModal()
    },
    deleteHandler(id) {
      this.deleteProductById(id).then(response => {
        this.$message({ type: 'success', message: response.statusText })
      })
    },
    batchDeleteHandler() {
      this.batchDeleteProduct(this.ids).then(response => {
        this.$message({ type: 'success', message: response.statusText })
      })
    }
  }
}
</script>
<style scoped>
</style>
