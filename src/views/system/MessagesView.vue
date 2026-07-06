<template>
  <div class="p-16px">
    <el-card shadow="never" class="rounded-md">
      <!-- 搜索条件 -->
      <el-form v-show="showSearch" :inline="true">
        <el-form-item label="发送人">
          <el-input v-model="searchParams.sender" placeholder="请输入发送人" clearable style="width: 200px" @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="消息主题">
          <el-input v-model="searchParams.subject" placeholder="请输入消息主题" clearable style="width: 200px" @keyup.enter="handleSearch" />
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
          <el-button type="primary" icon="Edit" plain>写消息</el-button>
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
        <el-table-column label="发送人" width="140" align="center">
          <template #default="{ row }">
            <div class="flex items-center justify-center gap-8px">
              <el-avatar :size="28" :style="{ background: row.color, fontSize: '12px' }">{{ row.sender.slice(0, 1) }}</el-avatar>
              <span>{{ row.sender }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="消息主题" prop="subject" min-width="260" :show-overflow-tooltip="true" />
        <el-table-column label="阅读状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.read ? 'info' : 'danger'" effect="plain" size="small">{{ row.read ? '已读' : '未读' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="接收时间" prop="time" width="180" align="center" />
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template #default="{ row }">
            <el-tooltip content="查看" placement="top">
              <el-button type="primary" icon="View" circle plain @click="handleView(row)" />
            </el-tooltip>
            <el-tooltip content="标为星标" placement="top">
              <el-button :type="row.starred ? 'warning' : 'info'" icon="Star" circle plain @click="row.starred = !row.starred" />
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

    <!-- 消息详情抽屉 -->
    <el-drawer v-model="drawerVisible" title="消息详情" size="520px">
      <template v-if="currentRow">
        <div class="flex items-center gap-12px mb-16px">
          <el-avatar :size="40" :style="{ background: currentRow.color, fontSize: '16px' }">{{ currentRow.sender.slice(0, 1) }}</el-avatar>
          <div>
            <div class="font-bold text-14px">{{ currentRow.sender }}</div>
            <div class="text-12px" style="color: var(--el-text-color-secondary)">{{ currentRow.time }}</div>
          </div>
        </div>
        <el-divider />
        <h3 class="text-16px font-bold mb-12px">{{ currentRow.subject }}</h3>
        <div class="text-13px leading-7" style="color: var(--el-text-color-regular); white-space: pre-wrap;">{{ currentRow.body }}</div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts" name="messagesPage">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const showSearch = ref(true)
const drawerVisible = ref(false)
const currentRow = ref<any>(null)

const searchParams = reactive({ pageNo: 1, pageSize: 10, sender: '', subject: '', read: '' })
const total = ref(5)
const ids = ref<number[]>([])

const tableList = ref([
  { id: 1, sender: '林清岚', subject: '关于 Q3 营销方案的反馈', time: '2026-07-03 10:42', read: false, starred: false, color: 'var(--el-color-primary)', body: '你好，我已经审阅了 Q3 的营销方案，整体方向很好。有几个建议：\n\n1. 社交媒体投放比例可以适当提高\n2. KOL 合作部分需要补充 ROI 预估\n3. 预算分配表中「其他」项过于笼统，建议拆分\n\n请在周三前更新一版，我们周四开会讨论。' },
  { id: 2, sender: '系统通知', subject: '你的密码将在 7 天后过期', time: '2026-07-03 09:15', read: false, starred: false, color: 'var(--el-color-danger)', body: '你的账户密码将于 2026 年 7 月 10 日过期。为了保证账户安全，请尽快在「设置 > 安全」中修改密码。如需帮助，请联系管理员。' },
  { id: 3, sender: 'Alex Morgan', subject: 'Product launch timeline updated', time: '2026-07-02 16:30', read: false, starred: true, color: 'var(--el-color-success)', body: 'Hi team,\n\nI\'ve updated the product launch timeline in the shared drive. Key changes:\n\n- Beta release moved to July 15\n- Marketing kickoff pushed to July 20\n- GA date remains Aug 1\n\nPlease review and flag any conflicts by EOD tomorrow.' },
  { id: 4, sender: '沈星河', subject: '数据库迁移方案评审', time: '2026-07-02 14:00', read: true, starred: false, color: 'var(--el-color-warning)', body: '数据库从 MySQL 5.7 迁移到 8.0 的方案已经准备好了。主要变更包括：字符集改为 utf8mb4、JSON 字段优化、窗口函数支持。附件是详细的迁移计划和回滚方案，请各位评审。' },
  { id: 5, sender: 'Mia Chen', subject: 'Weekly design review notes', time: '2026-07-01 17:00', read: true, starred: false, color: '#9270ca', body: 'Sharing the notes from today\'s design review:\n\n1) Dashboard cards need more visual hierarchy\n2) Mobile nav to be reconsidered\n3) Color contrast issues on dark mode flagged by a11y audit\n\nNext review scheduled for Thursday.' },
])

const handleSearch = () => { searchParams.pageNo = 1; handleListPage() }
const resetSearch = () => { Object.assign(searchParams, { pageNo: 1, sender: '', subject: '', read: '' }); handleListPage() }
const handleListPage = () => { total.value = tableList.value.length }

const handleSelectionChange = (selection: any[]) => { ids.value = selection.map((r: any) => r.id) }

const handleView = (row: any) => { currentRow.value = row; drawerVisible.value = true; row.read = true }

const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确认删除消息「${row.subject}」？`, '提示', { type: 'warning' }).then(() => {
    tableList.value = tableList.value.filter(r => r.id !== row.id)
    total.value = tableList.value.length
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleBatchDelete = () => {
  ElMessageBox.confirm('确认批量删除选中的消息？', '提示', { type: 'warning' }).then(() => {
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
