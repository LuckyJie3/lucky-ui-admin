<template>
  <div class="p-16px">
    <!-- 搜索区域 -->
    <el-card shadow="never" class="rounded-md mb-20px">
      <div class="flex items-center gap-16px">
        <el-input v-model="search" placeholder="搜索问题或关键词..." clearable size="large" style="max-width: 480px;">
          <template #prefix><el-icon><Search /></el-icon></template>
        </el-input>
      </div>
    </el-card>

    <el-row :gutter="20">
      <!-- 左侧：FAQ -->
      <el-col :span="14" :xs="24">
        <el-card shadow="never" class="rounded-md" :body-style="{ padding: '20px' }">
          <template #header>
            <span class="font-bold">常见问题</span>
          </template>
          <el-collapse v-model="activeName" accordion>
            <el-collapse-item v-for="item in filteredFaqs" :key="item.name" :name="item.name">
              <template #title>
                <div class="flex items-center gap-8px">
                  <el-icon :size="16" style="color: var(--el-color-primary);"><component :is="item.icon" /></el-icon>
                  <span class="font-medium">{{ item.question }}</span>
                </div>
              </template>
              <div class="text-13px leading-7 pl-24px" style="color: var(--el-text-color-regular);">{{ item.answer }}</div>
            </el-collapse-item>
          </el-collapse>
          <el-empty v-if="!filteredFaqs.length" description="没有找到相关问题" />
        </el-card>
      </el-col>

      <!-- 右侧：指南 + 联系 -->
      <el-col :span="10" :xs="24">
        <el-card shadow="never" class="rounded-md mb-20px" :body-style="{ padding: '20px' }">
          <template #header>
            <span class="font-bold">使用指南</span>
          </template>
          <div v-for="guide in guides" :key="guide.title" class="guide-item">
            <div class="guide-item__icon" :style="{ background: guide.iconBg }">
              <el-icon :size="18" :style="{ color: guide.iconColor }"><component :is="guide.icon" /></el-icon>
            </div>
            <div class="guide-item__body">
              <div class="font-medium text-13px">{{ guide.title }}</div>
              <div class="text-12px mt-4px" style="color: var(--el-text-color-secondary);">{{ guide.desc }}</div>
            </div>
            <el-button text type="primary" size="small">查看详情</el-button>
          </div>
        </el-card>

        <el-card shadow="never" class="rounded-md" :body-style="{ padding: '20px' }">
          <div class="text-center">
            <el-icon :size="36" style="color: var(--el-color-primary);"><ChatLineRound /></el-icon>
            <div class="font-bold text-15px mt-12px">还没找到答案？</div>
            <div class="text-12px mt-8px" style="color: var(--el-text-color-secondary);">我们的技术支持团队随时准备为你服务。</div>
            <el-button type="primary" class="mt-16px" icon="ChatLineRound">联系支持</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="helpPage">
import { computed, ref, markRaw } from 'vue'
import { ChatLineRound, Connection, Document, Key, Monitor, Search, Setting, SetUp } from '@element-plus/icons-vue'

const search = ref('')
const activeName = ref('1')

const faqs = [
  { name: '1', icon: markRaw(Key), question: '如何重置密码？', answer: '进入「系统管理 > 偏好设置」页面，在安全区域点击「修改密码」。你需要输入当前密码和新密码，新密码需包含大小写字母和数字，长度至少 8 位。修改后所有已登录的设备将自动退出。' },
  { name: '2', icon: markRaw(Key), question: '如何管理团队成员的权限？', answer: '管理员可以在「系统管理 > 权限矩阵」中为每个角色分配功能权限。权限分为「查看」「编辑」「删除」「管理」四个级别，支持自定义角色组合。修改权限后即时生效，无需重新登录。' },
  { name: '3', icon: markRaw(Monitor), question: '实时监控面板的数据刷新频率是多少？', answer: '实时监控面板默认每 5 秒自动刷新一次。你可以在面板右上角的设置中调整刷新间隔（1s / 5s / 30s / 60s），也可以点击暂停按钮停止自动刷新。' },
  { name: '4', icon: markRaw(Document), question: '如何批量导出数据？', answer: '在列表页面勾选需要导出的数据行，点击工具栏的「导出」按钮。支持 CSV 和 Excel 两种格式，单次最多导出 10,000 条记录。超出限制时系统会自动分批处理。' },
  { name: '5', icon: markRaw(Connection), question: 'API 接口的调用频率限制是多少？', answer: '普通接口限制为每分钟 60 次，查询类接口为每分钟 120 次。超出限制后返回 429 状态码，建议使用指数退避策略重试。企业版用户可申请更高的调用配额。' },
  { name: '6', icon: markRaw(Setting), question: '如何自定义工作台的布局？', answer: '在「偏好设置」页面中，你可以切换亮色/暗色主题、调整紧凑模式、选择是否显示面包屑和页脚。工作台的卡片支持拖拽排序。' },
]

const filteredFaqs = computed(() => {
  if (!search.value.trim()) return faqs
  const q = search.value.toLowerCase()
  return faqs.filter(f => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q))
})

const guides = [
  { icon: markRaw(SetUp), title: '快速入门', desc: '从零开始配置管理后台，5 分钟上手核心功能。', iconColor: '#5b8ff9', iconBg: 'rgba(91, 143, 249, 0.12)' },
  { icon: markRaw(Key), title: '安全最佳实践', desc: '了解双因素认证、IP 白名单和操作审计的配置。', iconColor: '#f6bd16', iconBg: 'rgba(246, 189, 22, 0.14)' },
  { icon: markRaw(Connection), title: 'API 集成指南', desc: '通过 RESTful API 与你的系统对接，含完整示例代码。', iconColor: '#5ad8a6', iconBg: 'rgba(90, 216, 166, 0.14)' },
]
</script>

<style lang="scss" scoped>
.guide-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);

  &:last-child { border-bottom: none; padding-bottom: 0; }
  &:first-child { padding-top: 0; }
}

.guide-item__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  flex-shrink: 0;
}

.guide-item__body {
  flex: 1;
  min-width: 0;
}
</style>
