<template>
  <div class="p-16px">
    <el-card shadow="never" class="rounded-md">
      <!-- 搜索条件 -->
      <el-form v-show="showSearch" :inline="true">
        <el-form-item label="通知标题">
          <el-input v-model="searchParams.title" placeholder="请输入通知标题" clearable style="width: 200px" @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="通知类型">
          <el-select v-model="searchParams.type" placeholder="请选择类型" clearable style="width: 200px">
            <el-option label="系统通知" value="system" />
            <el-option label="业务提醒" value="business" />
            <el-option label="安全告警" value="security" />
          </el-select>
        </el-form-item>
        <el-form-item label="阅读状态">
          <el-select v-model="searchParams.read" placeholder="请选择状态" clearable style="width: 200px">
            <el-option label="已读" value="1" />
            <el-option label="未读" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" plain @click="handleSearch">搜索</el-button>
          <el-button type="danger" icon="Refresh" plain @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 工具栏 -->
      <el-row :gutter="10">
        <el-col :span="1.5">
          <el-button type="primary" icon="Check" plain @click="handleMarkAllRead">全部已读</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" icon="Delete" plain :disabled="!ids.length" @click="handleBatchDelete">批量删除</el-button>
        </el-col>
        <div class="ml-auto flex gap-2">
          <el-tooltip content="刷新" placement="top">
            <el-button icon="Refresh" circle @click="handleListPage" />
          </el-tooltip>
          <el-tooltip :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top">
            <el-button icon="Search" circle @click="showSearch = !showSearch" />
          </el-tooltip>
        </div>
      </el-row>

      <div class="h-20px" />

      <!-- 数据表格 -->
      <el-table v-loading="loading" border :data="tableList" empty-text="暂时没有数据" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="序号" width="70" align="center" type="index" />
        <el-table-column label="通知标题" prop="title" min-width="240" :show-overflow-tooltip="true" />
        <el-table-column label="通知类型" prop="type" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="typeTagMap[row.type]" effect="plain">{{ typeLabelMap[row.type] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="阅读状态" width="100" align="center">
          <template #default="{ row }">
            <el-switch v-model="row.read" active-text="已读" inactive-text="未读" :inline-prompt="true" @change="handleReadChange(row)" />
          </template>
        </el-table-column>
        <el-table-column label="通知内容" prop="content" min-width="300" :show-overflow-tooltip="true" />
        <el-table-column label="通知时间" prop="time" width="180" align="center" />
        <el-table-column label="操作" align="center" width="120" fixed="right">
          <template #default="{ row }">
            <el-tooltip content="查看" placement="top">
              <el-button type="primary" icon="View" circle plain @click="handleView(row)" />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button type="danger" icon="Delete" circle plain @click="handleDelete(row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <div class="h-20px" />

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="searchParams.pageNo"
        v-model:page-size="searchParams.pageSize"
        background
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleListPage"
        @current-change="handleListPage"
      />
    </el-card>

    <!-- 查看详情抽屉 -->
    <el-drawer v-model="drawerVisible" title="通知详情" size="480px">
      <template v-if="currentRow">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="通知标题">{{ currentRow.title }}</el-descriptions-item>
          <el-descriptions-item label="通知类型">
            <el-tag :type="typeTagMap[currentRow.type]" effect="plain">{{ typeLabelMap[currentRow.type] }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="通知时间">{{ currentRow.time }}</el-descriptions-item>
          <el-descriptions-item label="通知内容">{{ currentRow.content }}</el-descriptions-item>
        </el-descriptions>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts" name="notificationsPage">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const showSearch = ref(true)
const drawerVisible = ref(false)
const currentRow = ref<any>(null)

const typeTagMap: Record<string, string> = { system: 'primary', business: 'success', security: 'danger' }
const typeLabelMap: Record<string, string> = { system: '系统通知', business: '业务提醒', security: '安全告警' }

const searchParams = reactive({ pageNo: 1, pageSize: 10, title: '', type: '', read: '' })
const total = ref(7)
const ids = ref<number[]>([])

const tableList = ref([
  { id: 1, title: '部署成功：主站 v2.4.1', type: 'system', content: '已成功部署到生产环境，所有健康检查通过。', time: '2026-07-03 14:32:10', read: false },
  { id: 2, title: '磁盘空间预警：node-03', type: 'security', content: '存储服务器 node-03 磁盘使用率达到 85%，建议清理或扩容。', time: '2026-07-03 14:15:00', read: false },
  { id: 3, title: '新功能上线：批量导出', type: 'business', content: '批量导出功能已上线，支持 CSV 和 Excel 两种格式。', time: '2026-07-03 13:00:00', read: false },
  { id: 4, title: '订单批量处理完成', type: 'business', content: '今日 1,280 笔订单已全部处理完毕，履约率 99.2%。', time: '2026-07-03 12:00:00', read: true },
  { id: 5, title: '系统维护通知', type: 'system', content: '本周六凌晨 2:00-4:00 将进行数据库维护。', time: '2026-07-03 09:00:00', read: true },
  { id: 6, title: '权限变更通知', type: 'system', content: '管理员已将「内容编辑」权限授予你的账号。', time: '2026-07-02 18:30:00', read: true },
  { id: 7, title: '异地登录拦截', type: 'security', content: '检测到你的账号在异地（上海）尝试登录，已自动拦截。', time: '2026-07-02 09:12:00', read: true },
])

const handleSearch = () => { searchParams.pageNo = 1; handleListPage() }
const resetSearch = () => { Object.assign(searchParams, { pageNo: 1, title: '', type: '', read: '' }); handleListPage() }
const handleListPage = () => { total.value = tableList.value.length }

const handleSelectionChange = (selection: any[]) => { ids.value = selection.map((r: any) => r.id) }

const handleView = (row: any) => { currentRow.value = row; drawerVisible.value = true; row.read = true }
const handleReadChange = (row: any) => { ElMessage.success(row.read ? '已标记为已读' : '已标记为未读') }
const handleMarkAllRead = () => { tableList.value.forEach(r => r.read = true); ElMessage.success('已全部标记为已读') }

const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确认删除通知「${row.title}」？`, '提示', { type: 'warning' }).then(() => {
    tableList.value = tableList.value.filter(r => r.id !== row.id)
    total.value = tableList.value.length
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleBatchDelete = () => {
  ElMessageBox.confirm('确认批量删除选中的通知？', '提示', { type: 'warning' }).then(() => {
    tableList.value = tableList.value.filter(r => !ids.value.includes(r.id))
    ids.value = []
    total.value = tableList.value.length
    ElMessage.success('批量删除成功')
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
.ml-auto { margin-left: auto; }
</style>
