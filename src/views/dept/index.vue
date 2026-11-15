<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { dept, addDept, queryById, updateDept, deleteDept } from '@/api/dept'
import { ElMessage, ElMessageBox } from 'element-plus'

const tableData = ref([])

// 1. 页面加载时查询数据
const queryAll = async () => {
  const result = await dept()
  if (result.code) {
    tableData.value = result.data
  }
}
onMounted(() => queryAll())

// 2. 弹窗相关状态
const dialogFormVisible = ref(false)
const form = ref({ id: null, name: '' })
const formLabelWidth = '120px'
const formTitle = ref()
const deptFormRef = ref(null)

// 3. 表单校验规则
const rules = {
  name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
  ]
}

// 4. 点击添加按钮
const add = () => {
  dialogFormVisible.value = true
  formTitle.value = '添加部门'
  form.value.id = null
  form.value.name = ''
  nextTick(() => {
    if (deptFormRef.value) {
      deptFormRef.value.resetFields()
    }
  })
}

// 5. 点击编辑按钮
const updateByid = async (id) => {
  dialogFormVisible.value = true
  formTitle.value = '编辑部门'
  form.value.name = ''
  const temp = await queryById(id)
  if (temp.code) {
    form.value.id = temp.data.id
    form.value.name = temp.data.name
  }
}

// 6. 点击确定，校验并保存
const save = () => {
  deptFormRef.value.validate(async (valid) => {
    if (!valid) return
    if (form.value.id) {
      // 编辑
      const result = await updateDept(form.value)
      if (result.code) {
        ElMessage.success('修改成功')
        dialogFormVisible.value = false
        queryAll()
      } else {
        ElMessage.error(result.msg || '修改失败')
      }
    } else {
      // 添加
      const result = await addDept(form.value)
      if (result.code) {
        ElMessage.success('保存成功')
        dialogFormVisible.value = false
        queryAll()
      } else {
        ElMessage.error(result.msg || '保存失败')
      }
    }
  })
}

// 7. 删除部门
const deleteByid = (id) => {
  ElMessageBox.confirm('确定要删除该部门吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const result = await deleteDept(id)
    if (result.code) {
      ElMessage.success('删除成功')
      queryAll()
    } else {
      ElMessage.error(result.msg || '删除失败')
    }
  }).catch(() => {})
}
</script>

<template>
  <h1 class="container">部门管理</h1>
  
  <!-- 添加按钮 -->
  <el-button type="primary" plain @click="add()">+ 添加部门</el-button>

  <!-- 表格 -->
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column type="index" label="序号" width="100" align="center"  />
    <el-table-column prop="name" label="部门名称" width="180" align="center" />
    <el-table-column prop="updateTime" label="最后操作时间" width="180" align="center" />
    <el-table-column label="操作" align="center">
      <template #default="scope">
        <!-- 提示：这里的 size="mini" 在最新版可以改成 size="small" -->
        <el-button type="primary" @click="updateByid(scope.row.id)" size="small">编辑</el-button>
        <el-button type="danger" size="small" @click="deleteByid(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 弹窗表单 -->
  <!-- 注意：title 改成了 :title 绑定 formTitle -->
  <el-dialog v-model="dialogFormVisible" :title="formTitle" width="500">
    <!-- 注意：加了 ref 和 rules -->
    <el-form :model="form" :rules="rules" ref="deptFormRef">
      <el-form-item label="部门名称" :label-width="formLabelWidth" prop="name">
        <el-input v-model="form.name" placeholder="请输入部门名称" />
      </el-form-item>
    </el-form>
    
    <!-- 弹窗底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.container {
  margin: 20px 0px;
}
</style>