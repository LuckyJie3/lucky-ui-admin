<template>
  <div class="p-16px">
    <el-card shadow="never" class="rounded-md">
      <!-- 面包屑 + 视图切换 -->
      <div class="flex items-center justify-between mb-16px">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :class="{ 'is-link': currentPath !== '/' }" @click="navigateToRoot">根目录</el-breadcrumb-item>
          <el-breadcrumb-item
            v-for="(seg, i) in pathSegments"
            :key="i"
            :class="{ 'is-link': i < pathSegments.length - 1 }"
            @click="navigateTo(i)"
          >
            {{ seg }}
          </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="flex gap-8px">
          <el-button-group size="small">
            <el-button :type="viewMode === 'grid' ? 'primary' : ''" icon="Grid" @click="viewMode = 'grid'" />
            <el-button :type="viewMode === 'list' ? 'primary' : ''" icon="List" @click="viewMode = 'list'" />
          </el-button-group>
          <el-button type="primary" icon="Upload" size="small">上传</el-button>
          <el-button icon="FolderAdd" size="small">新建文件夹</el-button>
        </div>
      </div>

      <!-- 网格视图 -->
      <el-row v-if="viewMode === 'grid'" :gutter="16">
        <el-col v-for="item in currentFiles" :key="item.name" :xs="12" :sm="8" :md="6" :lg="4">
          <div class="file-card" :class="{ 'is-folder': item.type === 'folder' }" @dblclick="item.type === 'folder' && enterFolder(item.name)">
            <div class="file-card__icon" :style="{ background: item.iconBg }">
              <el-icon :size="24" :style="{ color: item.iconColor }"><component :is="item.icon" /></el-icon>
            </div>
            <div class="file-card__name">{{ item.name }}</div>
            <div class="file-card__meta">{{ item.size || '文件夹' }}</div>
          </div>
        </el-col>
      </el-row>

      <!-- 列表视图 -->
      <template v-if="viewMode === 'list'">
        <el-table :data="currentFiles" border style="width: 100%;">
          <el-table-column label="文件名" min-width="260">
            <template #default="{ row }">
              <div class="flex items-center gap-8px">
                <el-icon :size="16" :style="{ color: row.iconColor }"><component :is="row.icon" /></el-icon>
                <span>{{ row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="大小" prop="size" width="120" align="center">
            <template #default="{ row }">{{ row.size || '-' }}</template>
          </el-table-column>
          <el-table-column label="修改时间" prop="modified" width="180" align="center" />
          <el-table-column label="操作" width="120" align="center" fixed="right">
            <template #default="{ row }">
              <el-tooltip content="下载" placement="top">
                <el-button type="primary" icon="Download" circle plain size="small" :disabled="row.type === 'folder'" />
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button type="danger" icon="Delete" circle plain size="small" />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <el-empty v-if="!currentFiles.length" description="此文件夹为空" />
    </el-card>
  </div>
</template>

<script setup lang="ts" name="fileManagerPage">
import { computed, ref, markRaw } from 'vue'
import { Document, Folder, Picture, Tickets, VideoPlay } from '@element-plus/icons-vue'

const viewMode = ref<'grid' | 'list'>('grid')
const currentPath = ref('/')
const pathSegments = computed(() => currentPath.value.split('/').filter(Boolean))

function enterFolder(name: string) { currentPath.value = currentPath.value === '/' ? `/${name}` : `${currentPath.value}/${name}` }
function navigateTo(index: number) { currentPath.value = '/' + currentPath.value.split('/').filter(Boolean).slice(0, index + 1).join('/') }
function navigateToRoot() { currentPath.value = '/' }

interface FileItem {
  name: string; type: 'folder' | 'file'; size?: string; modified: string
  icon: unknown; iconColor: string; iconBg: string
}

const files: Record<string, FileItem[]> = {
  '/': [
    { name: 'Documents', type: 'folder', modified: '2026-07-01', icon: markRaw(Folder), iconColor: '#f6bd16', iconBg: 'rgba(246, 189, 22, 0.14)' },
    { name: 'Images', type: 'folder', modified: '2026-06-28', icon: markRaw(Folder), iconColor: '#f6bd16', iconBg: 'rgba(246, 189, 22, 0.14)' },
    { name: 'Videos', type: 'folder', modified: '2026-06-25', icon: markRaw(Folder), iconColor: '#f6bd16', iconBg: 'rgba(246, 189, 22, 0.14)' },
    { name: 'Reports', type: 'folder', modified: '2026-07-02', icon: markRaw(Folder), iconColor: '#f6bd16', iconBg: 'rgba(246, 189, 22, 0.14)' },
    { name: 'quarterly-review.pdf', type: 'file', size: '2.4 MB', modified: '2026-07-02', icon: markRaw(Document), iconColor: '#5b8ff9', iconBg: 'rgba(91, 143, 249, 0.12)' },
    { name: 'dashboard-mockup.png', type: 'file', size: '890 KB', modified: '2026-06-30', icon: markRaw(Picture), iconColor: '#5ad8a6', iconBg: 'rgba(90, 216, 166, 0.14)' },
    { name: 'meeting-notes.md', type: 'file', size: '12 KB', modified: '2026-07-03', icon: markRaw(Tickets), iconColor: '#5b8ff9', iconBg: 'rgba(91, 143, 249, 0.12)' },
    { name: 'product-demo.mp4', type: 'file', size: '48 MB', modified: '2026-06-20', icon: markRaw(VideoPlay), iconColor: '#9270ca', iconBg: 'rgba(146, 112, 202, 0.12)' },
  ],
  '/Documents': [
    { name: 'contract-2026.pdf', type: 'file', size: '1.1 MB', modified: '2026-06-15', icon: markRaw(Document), iconColor: '#5b8ff9', iconBg: 'rgba(91, 143, 249, 0.12)' },
    { name: 'api-spec.yaml', type: 'file', size: '34 KB', modified: '2026-07-01', icon: markRaw(Tickets), iconColor: '#5b8ff9', iconBg: 'rgba(91, 143, 249, 0.12)' },
    { name: 'readme.md', type: 'file', size: '8 KB', modified: '2026-06-28', icon: markRaw(Tickets), iconColor: '#5b8ff9', iconBg: 'rgba(91, 143, 249, 0.12)' },
  ],
  '/Images': [
    { name: 'banner-v2.png', type: 'file', size: '3.2 MB', modified: '2026-06-28', icon: markRaw(Picture), iconColor: '#5ad8a6', iconBg: 'rgba(90, 216, 166, 0.14)' },
    { name: 'avatar-default.svg', type: 'file', size: '4 KB', modified: '2026-06-10', icon: markRaw(Picture), iconColor: '#5ad8a6', iconBg: 'rgba(90, 216, 166, 0.14)' },
  ],
  '/Videos': [
    { name: 'onboarding.mp4', type: 'file', size: '120 MB', modified: '2026-06-25', icon: markRaw(VideoPlay), iconColor: '#9270ca', iconBg: 'rgba(146, 112, 202, 0.12)' },
  ],
  '/Reports': [
    { name: 'june-summary.xlsx', type: 'file', size: '580 KB', modified: '2026-07-02', icon: markRaw(Document), iconColor: '#5ad8a6', iconBg: 'rgba(90, 216, 166, 0.14)' },
    { name: 'revenue-chart.png', type: 'file', size: '1.5 MB', modified: '2026-07-01', icon: markRaw(Picture), iconColor: '#5ad8a6', iconBg: 'rgba(90, 216, 166, 0.14)' },
  ],
}

const currentFiles = computed(() => files[currentPath.value] || [])
</script>

<style lang="scss" scoped>
.is-link {
  cursor: pointer;
  &:hover { color: var(--el-color-primary); }
}

.file-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 12px 16px;
  margin-bottom: 16px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--el-color-primary);
    background: var(--el-color-primary-light-9);
  }

  &.is-folder { cursor: pointer; }
}

.file-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
}

.file-card__name {
  font-size: 12px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  text-align: center;
  word-break: break-all;
}

.file-card__meta {
  font-size: 11px;
  color: var(--el-text-color-secondary);
}
</style>
