<template>
  <div class="p-16px">
    <el-card shadow="never" class="rounded-md">
      <!-- 搜索条件 -->
      <el-form v-show="showSearch" :inline="true">
        <el-form-item label="操作名称">
          <el-input v-model="searchParams.operName" placeholder="请输入操作名称" clearable style="width: 200px" @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="操作人员">
          <el-input v-model="searchParams.operMan" placeholder="请输入操作人员" clearable style="width: 200px" @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="IP地址">
          <el-input v-model="searchParams.operIp" placeholder="请输入IP地址" clearable style="width: 200px" @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="操作时间">
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            value-format="YYYY-MM-DD HH:mm:ss"
            start-placeholder="开始日期"
            range-separator="至"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" plain @click="handleSearch">搜索</el-button>
          <el-button type="danger" icon="Refresh" plain @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 工具栏 -->
      <el-row :gutter="10">
        <el-col :span="1.5">
          <el-button type="danger" icon="Delete" plain :disabled="!ids.length" @click="handleBatchDelete">批量删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" icon="Download" plain>导出</el-button>
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
        <el-table-column label="操作名称" prop="operName" width="160" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="日志级别" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="levelTagMap[row.level]" effect="plain" size="small">{{ row.level.toUpperCase() }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作人员" prop="operMan" width="130" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="操作IP" prop="operIp" width="140" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="操作地点" prop="operLocation" width="160" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="请求方式" prop="requestMethod" width="100" align="center" />
        <el-table-column label="消耗时间" prop="costTime" width="100" align="center" />
        <el-table-column label="操作状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.operStatus === '0' ? 'success' : 'danger'" effect="plain" size="small">
              {{ row.operStatus === '0' ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作时间" prop="operTime" width="180" align="center" />
        <el-table-column label="操作" align="center" width="120" fixed="right">
          <template #default="{ row }">
            <el-tooltip content="详情" placement="top">
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
        :page-sizes="[10, 20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleListPage"
        @current-change="handleListPage"
      />
    </el-card>

    <!-- 详情弹窗 -->
    <el-dialog v-model="dialogVisible" title="操作详情" width="700px" top="6vh">
      <template v-if="currentRow">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="操作名称">{{ currentRow.operName }}</el-descriptions-item>
          <el-descriptions-item label="操作人员">{{ currentRow.operMan }}</el-descriptions-item>
          <el-descriptions-item label="请求方式">{{ currentRow.requestMethod }}</el-descriptions-item>
          <el-descriptions-item label="操作IP">{{ currentRow.operIp }}</el-descriptions-item>
          <el-descriptions-item label="操作地点">{{ currentRow.operLocation }}</el-descriptions-item>
          <el-descriptions-item label="消耗时间">{{ currentRow.costTime }}</el-descriptions-item>
          <el-descriptions-item label="操作状态">
            <el-tag :type="currentRow.operStatus === '0' ? 'success' : 'danger'">
              {{ currentRow.operStatus === '0' ? '操作成功' : '操作失败' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="操作时间">{{ currentRow.operTime }}</el-descriptions-item>
          <el-descriptions-item label="请求参数" :span="2">
            <div class="text-12px" style="word-break: break-all; color: var(--el-text-color-regular);">{{ currentRow.operParam }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="返回数据" :span="2">
            <div class="text-12px" style="word-break: break-all; color: var(--el-text-color-regular);">{{ currentRow.jsonResult }}</div>
          </el-descriptions-item>
        </el-descriptions>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="auditLogsPage">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const showSearch = ref(true)
const dialogVisible = ref(false)
const currentRow = ref<any>(null)
const dateRange = ref()

const levelTagMap: Record<string, string> = { info: 'primary', warning: 'warning', error: 'danger' }

const searchParams = reactive({ pageNo: 1, pageSize: 10, operName: '', operMan: '', operIp: '' })
const total = ref(8)
const ids = ref<string[]>([])

const tableList = ref([
  { operId: '1', operName: '用户登录', level: 'info', operMan: 'admin', operIp: '192.168.1.105', operLocation: '上海市', requestMethod: 'POST', costTime: '12ms', operStatus: '0', operTime: '2026-07-03 14:32:10', operParam: '{"username":"admin"}', jsonResult: '{"code":200,"msg":"登录成功"}' },
  { operId: '2', operName: '修改系统配置', level: 'info', operMan: 'admin', operIp: '192.168.1.105', operLocation: '上海市', requestMethod: 'PUT', costTime: '45ms', operStatus: '0', operTime: '2026-07-03 14:30:45', operParam: '{"key":"site.locale","value":"zh-CN"}', jsonResult: '{"code":200}' },
  { operId: '3', operName: 'API频率预警', level: 'warning', operMan: 'system', operIp: '-', operLocation: '-', requestMethod: '-', costTime: '-', operStatus: '0', operTime: '2026-07-03 14:28:12', operParam: '-', jsonResult: '{"current":58,"limit":60}' },
  { operId: '4', operName: '导出客户数据', level: 'info', operMan: 'admin', operIp: '192.168.1.105', operLocation: '上海市', requestMethod: 'GET', costTime: '1.2s', operStatus: '0', operTime: '2026-07-03 13:15:33', operParam: '{"format":"excel","count":2480}', jsonResult: '{"code":200}' },
  { operId: '5', operName: '数据库连接超时', level: 'error', operMan: 'system', operIp: '-', operLocation: '-', requestMethod: '-', costTime: '30s', operStatus: '1', operTime: '2026-07-03 12:05:01', operParam: '-', jsonResult: '{"error":"timeout"}' },
  { operId: '6', operName: '批量审批订单', level: 'info', operMan: 'admin', operIp: '192.168.1.105', operLocation: '上海市', requestMethod: 'POST', costTime: '320ms', operStatus: '0', operTime: '2026-07-03 11:22:18', operParam: '{"ids":[1,2,3]}', jsonResult: '{"code":200}' },
  { operId: '7', operName: '异地登录拦截', level: 'warning', operMan: 'security', operIp: '58.246.0.12', operLocation: '上海市', requestMethod: '-', costTime: '-', operStatus: '0', operTime: '2026-07-03 09:12:44', operParam: '-', jsonResult: '{"action":"blocked"}' },
  { operId: '8', operName: '系统备份完成', level: 'info', operMan: 'system', operIp: '-', operLocation: '-', requestMethod: '-', costTime: '5m', operStatus: '0', operTime: '2026-07-02 03:00:00', operParam: '-', jsonResult: '{"size":"4.2GB"}' },
])

const handleSearch = () => { searchParams.pageNo = 1; handleListPage() }
const resetSearch = () => {
  dateRange.value = []
  Object.assign(searchParams, { pageNo: 1, operName: '', operMan: '', operIp: '' })
  handleListPage()
}
const handleListPage = () => { total.value = tableList.value.length }

const handleSelectionChange = (selection: any[]) => { ids.value = selection.map((r: any) => r.operId) }

const handleView = (row: any) => { currentRow.value = row; dialogVisible.value = true }

const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确认删除该操作日志？`, '提示', { type: 'warning' }).then(() => {
    tableList.value = tableList.value.filter(r => r.operId !== row.operId)
    total.value = tableList.value.length
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleBatchDelete = () => {
  ElMessageBox.confirm('确认批量删除选中的日志？', '提示', { type: 'warning' }).then(() => {
    tableList.value = tableList.value.filter(r => !ids.value.includes(r.operId))
    ids.value = []
    total.value = tableList.value.length
    ElMessage.success('批量删除成功')
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
.ml-auto { margin-left: auto; }
</style>
