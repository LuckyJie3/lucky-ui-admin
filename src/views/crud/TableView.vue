<template>
  <div class="page-shell">
    <section class="page-hero">
      <div>
        <p class="page-hero__eyebrow">Workspace</p>
        <h1 class="page-hero__title">{{ t('table.title') }}</h1>
        <p class="page-hero__subtitle">{{ t('table.subtitle') }}</p>
      </div>
      <el-button type="primary" :icon="Plus" @click="router.push('/workspace/users/create')">
        {{ t('common.add') }}
      </el-button>
    </section>

    <GlassCard>
      <el-form :model="filters" class="filter-bar" label-position="top">
        <el-form-item :label="t('table.customer')">
          <el-input v-model="filters.keyword" clearable :placeholder="t('common.search')" />
        </el-form-item>
        <el-form-item :label="t('table.status')">
          <el-select v-model="filters.status" clearable>
            <el-option :label="t('table.active')" value="active" />
            <el-option :label="t('table.pending')" value="pending" />
            <el-option :label="t('table.paused')" value="paused" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="filter-actions">
            <el-button type="primary" :icon="Search" @click="applyFilters">{{ t('common.search') }}</el-button>
            <el-button :icon="Refresh" @click="resetFilters">{{ t('common.reset') }}</el-button>
          </div>
        </el-form-item>
      </el-form>
    </GlassCard>

    <GlassCard>
      <template #header>
        <div class="table-header">
          <div>
            <h3 class="section-title">{{ t('table.title') }}</h3>
            <p class="muted-text" style="margin-top: 2px;">{{ selectedRows.length }} selected</p>
          </div>
          <div class="table-actions">
            <el-button size="small" :icon="Download" :disabled="!selectedRows.length">{{ t('common.export') }}</el-button>
            <el-button size="small" :icon="Refresh" @click="loadData">{{ t('common.refresh') }}</el-button>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" :data="pagedRows" row-key="id" @selection-change="selectedRows = $event">
        <el-table-column type="selection" width="42" />
        <el-table-column :label="t('table.customer')" min-width="180">
          <template #default="{ row }">
            <div class="customer-cell">
              <el-avatar :size="28" style="background: var(--color-primary); font-size: 12px;">{{ row.name.slice(0, 1) }}</el-avatar>
              <div>
                <strong>{{ row.name }}</strong>
                <span>{{ row.email }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="company" :label="t('table.company')" min-width="150" />
        <el-table-column prop="role" :label="t('table.role')" width="110" />
        <el-table-column prop="owner" :label="t('table.owner')" width="110" />
        <el-table-column :label="t('table.status')" width="100">
          <template #default="{ row }">
            <el-tag :type="statusMap[row.status].type" size="small" effect="light">
              {{ t(statusMap[row.status].label) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastActive" :label="t('table.lastActive')" width="130" />
        <el-table-column :label="t('common.more')" width="90" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="router.push({ path: '/workspace/users/create', query: { id: row.id } })">
              {{ t('common.edit') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-row">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50]"
          :total="filteredRows.length"
          background
          layout="total, sizes, prev, pager, next"
          small
        />
      </div>
    </GlassCard>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Download, Plus, Refresh, Search } from '@element-plus/icons-vue'
import GlassCard from '@/components/common/GlassCard.vue'

type Status = 'active' | 'paused' | 'pending'

interface CustomerRow {
  id: number; company: string; email: string; lastActive: string; name: string; owner: string; role: string; status: Status
}

const { t } = useI18n()
const router = useRouter()
const loading = ref(false)
const selectedRows = ref<CustomerRow[]>([])
const filters = reactive({ keyword: '', status: '' })
const pagination = reactive({ page: 1, pageSize: 10 })

const statusMap: Record<Status, { label: string; type: 'success' | 'warning' | 'info' }> = {
  active: { label: 'table.active', type: 'success' },
  paused: { label: 'table.paused', type: 'info' },
  pending: { label: 'table.pending', type: 'warning' },
}

const rows = ref<CustomerRow[]>(
  Array.from({ length: 38 }, (_, index) => {
    const id = index + 1
    const status = (['active', 'pending', 'paused'] as Status[])[index % 3]
    return {
      id, company: ['Northstar Labs', 'Cedar Cloud', 'Moonrise Retail', 'Atlas Works'][index % 4],
      email: `customer${id}@lucky-admin.dev`,
      lastActive: `2026-06-${String((index % 24) + 1).padStart(2, '0')}`,
      name: ['林清岚', 'Alex Morgan', '沈星河', 'Mia Chen'][index % 4],
      owner: ['Nora', 'Kai', 'Iris'][index % 3],
      role: ['Admin', 'Operator', 'Viewer'][index % 3], status,
    }
  }),
)

const filteredRows = computed(() => rows.value.filter((row) => {
  const keyword = filters.keyword.trim().toLowerCase()
  const matchesKeyword = !keyword || row.name.toLowerCase().includes(keyword) || row.email.toLowerCase().includes(keyword) || row.company.toLowerCase().includes(keyword)
  return matchesKeyword && (!filters.status || row.status === filters.status)
}))

const pagedRows = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize
  return filteredRows.value.slice(start, start + pagination.pageSize)
})

function applyFilters() { pagination.page = 1 }
function resetFilters() { filters.keyword = ''; filters.status = ''; applyFilters() }
function loadData() { loading.value = true; window.setTimeout(() => { loading.value = false }, 360) }
</script>

<style lang="scss" scoped>
.filter-bar {
  display: grid;
  grid-template-columns: minmax(200px, 1fr) minmax(160px, 220px) auto;
  gap: 12px;
  align-items: end;

  :deep(.el-form-item) { margin-bottom: 0; }
}

.filter-actions, .table-actions, .table-header {
  display: flex; align-items: center; gap: 8px;
}

.table-header {
  width: 100%; justify-content: space-between;
}

.customer-cell {
  display: flex; align-items: center; gap: 8px;

  div { display: grid; }
  strong { font-size: 13px; font-weight: 500; }
  span { color: var(--text-muted); font-size: 12px; }
}

.pagination-row {
  display: flex; justify-content: flex-end; padding-top: 16px;
}

@media (max-width: 900px) {
  .filter-bar { grid-template-columns: 1fr; }
}
</style>
