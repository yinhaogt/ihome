<template>
  <div class="category">
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
    </el-row>

    <!-- 表格 -->
    <div v-loading="loading">
      <el-table :data="categories.list" size="mini" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="编号" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="num" label="数量" />
        <el-table-column label="图标">
          <template #default="scope">
            <img :src="scope.row.icon" width="50px" style="background-size:cover">
          </template>
        </el-table-column>
        <el-table-column prop="parentId" label="父级ID" />
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
          :total="categories.total"
          :page-size="params.pageSize"
          :current-page.sync="params.page+1"
          @current-change="pageChangeHandler"
        />
      </div>
    </div>
    <!-- 模态框 -->
    <el-dialog :title="title" :visible.sync="visible" @close="dialogCloseHandler">
      <el-form ref="categoryForm" :model="category" :rules="rules">
        <el-form-item label="名称" label-width="100px" prop="name">
          <el-input v-model="category.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="数量" label-width="100px" prop="num">
          <el-input v-model="category.num" auto-complete="off" />
        </el-form-item>
        <el-form-item label="图标" label-width="100px" prop="icon">
          <el-input v-model="category.icon" auto-complete="off" />
        </el-form-item>
        <el-form-item label="父级ID" label-width="100px" prop="parentId">
          <el-select v-model="category.parentId">
            <el-option v-for="c of parentIds" :key="c" :value="c" />
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
      category: {},
      ids: [],

      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        num: [{ required: true, message: '请输入数量', trigger: 'blur' }],
        icon: [{ required: true, message: '请输入图标路径', trigger: 'blur' }],
        parentId: [{ required: true, message: '请输入父级ID', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState('category', [
      'categories',
      'visible',
      'title',
      'loading',
      'parentIds',
      'params'
    ]),
    ...mapGetters('category', ['orderCustomer', 'categorySize'])
  },
  created() {
    this.loadPages(this.params)
  },
  methods: {
    ...mapMutations('category', ['showModal', 'closeModal', 'setTitle']),
    ...mapActions('category', [

      'saveOrUpdateCategory',
      'deleteCategoryById',
      'batchDeleteCategory',
      'loadPages'
    ]),
    // 普通方法
    // toDetailsHandler(category) {
    //   //跳转到详情页面
    //   // this.$router.push("/categoryDetails")
    //   this.$router.push({
    //     path: "/category/details",
    //     query: { id: category.id }
    //   });
    // },
    searchByName() {
      this.params.page = 0
      this.loadPages(this.params)
    },
    handleSelectionChange(val) {
      this.ids = val.map(item => item.id)
    },
    toAddHandler() {
      // 1. 重置表单
      this.category = {}
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
      this.$refs.categoryForm.validate(valid => {
        // 如果校验通过
        if (valid) {
          const promise = this.saveOrUpdateCategory(this.category)
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
      // this.$refs.categoryForm.resetFields();
      this.$refs.categoryForm.clearValidate()
      this.category = {}
      this.closeModal()
    },
    editHandler(row) {
      const newRow = { ...row }
      this.category = newRow
      this.setTitle('修改分类信息')
      this.showModal()
    },
    deleteHandler(id) {
      this.deleteCategoryById(id).then(response => {
        this.$message({ type: 'success', message: response.statusText })
      })
    },
    batchDeleteHandler() {
      this.batchDeleteCategory(this.ids).then(response => {
        this.$message({ type: 'success', message: response.statusText })
      })
    }
  }
}
</script>
<style scoped>
</style>
