<template>
  <div class="admin-layout" :class="{ 'is-collapsed': appStore.sidebarCollapsed }">
    <aside class="layout-sidebar">
      <div class="brand" @click="router.push('/dashboard')">
        <span class="brand__icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span class="brand__text" v-show="!appStore.sidebarCollapsed">
          <strong>Lucky</strong>
        </span>
      </div>

      <el-scrollbar class="menu-scroll">
        <el-menu
          :collapse="appStore.sidebarCollapsed"
          :collapse-transition="false"
          :default-active="activeMenu"
          :router="true"
          :unique-opened="true"
          class="sidebar-menu"
        >
          <template v-for="item in menuRoutes" :key="item.path">
            <el-menu-item v-if="!hasVisibleChildren(item)" :index="resolveRoutePath(item)">
              <el-icon><component :is="getIcon(item.meta?.icon)" /></el-icon>
              <template #title>{{ t(item.meta?.title || '') }}</template>
            </el-menu-item>

            <el-sub-menu v-else :index="item.path">
              <template #title>
                <el-icon><component :is="getIcon(item.meta?.icon)" /></el-icon>
                <span>{{ t(item.meta?.title || '') }}</span>
              </template>

              <el-menu-item
                v-for="child in visibleChildren(item)"
                :key="child.path"
                :index="resolveRoutePath(child, item.path)"
              >
                <el-icon><component :is="getIcon(child.meta?.icon)" /></el-icon>
                <template #title>{{ t(child.meta?.title || '') }}</template>
              </el-menu-item>
            </el-sub-menu>
          </template>
        </el-menu>
      </el-scrollbar>
    </aside>

    <section class="layout-stage">
      <header class="layout-header">
        <div class="header-left">
          <button class="header-btn" type="button" @click="appStore.toggleSidebar()">
            <el-icon :size="18"><Expand v-if="appStore.sidebarCollapsed" /><Fold v-else /></el-icon>
          </button>
          <AppBreadcrumb v-if="appStore.showBreadcrumb" />
        </div>

        <div class="header-right">
          <button class="header-btn" type="button" @click="toggleTheme()">
            <el-icon :size="18"><Moon v-if="resolved === 'dark'" /><Sunny v-else /></el-icon>
          </button>

          <button class="header-btn" type="button" @click="toggleLocale()">
            <span style="font-size: 13px; font-weight: 500;">{{ appStore.locale === 'zh-CN' ? 'EN' : '中' }}</span>
          </button>

          <el-dropdown trigger="click" @command="handleUserCommand">
            <div class="user-info">
              <el-avatar :size="26" :icon="UserFilled" style="background: var(--color-primary);" />
              <span class="user-name">{{ userStore.username }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon>
                  {{ t('navbar.settings') }}
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  {{ t('navbar.logout') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <nav v-if="tabsStore.tabs.length" class="layout-tabs">
        <div class="tabs-scroll">
          <button
            v-for="tab in tabsStore.tabs"
            :key="tab.path"
            class="tab-item"
            :class="{ active: tabsStore.activeTab === tab.path }"
            type="button"
            @click="router.push(tab.fullPath)"
          >
            <span>{{ t(tab.title) }}</span>
            <el-icon v-if="!tab.affix" class="tab-close" @click.stop="closeTab(tab)"><Close /></el-icon>
          </button>
        </div>
      </nav>

      <main class="layout-main">
        <router-view v-slot="{ Component, route: currentRoute }">
          <transition name="fade-slide" mode="out-in">
            <keep-alive :include="cachedViews">
              <component :is="Component" :key="currentRoute.fullPath" />
            </keep-alive>
          </transition>
        </router-view>
      </main>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessageBox } from 'element-plus'
import {
  Bell,
  ChatLineRound,
  Close,
  Collection,
  DataAnalysis,
  DataBoard,
  Document,
  Expand,
  Files,
  Folder,
  Fold,
  Goods,
  Grid,
  Key,
  List,
  MagicStick,
  Monitor,
  Moon,
  QuestionFilled,
  Setting,
  SwitchButton,
  Stamp,
  Sunny,
  Tickets,
  User,
  UserFilled,
} from '@element-plus/icons-vue'
import AppBreadcrumb from './AppBreadcrumb.vue'
import { asyncRoutes, type MenuIcon } from '@/router/routes'
import { useAppStore } from '@/stores/app'
import { useTabsStore, type TabItem } from '@/stores/tabs'
import { useTheme } from '@/composables/useTheme'
import { useLocale } from '@/composables/useLocale'
import { useUserStore } from '@/stores/user'
import type { RouteRecordRaw } from 'vue-router'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const tabsStore = useTabsStore()
const userStore = useUserStore()
const { resolved, toggleTheme } = useTheme()
const { toggleLocale } = useLocale()

const iconMap: Record<MenuIcon, unknown> = {
  analysis: DataAnalysis,
  articles: Document,
  comments: ChatLineRound,
  content: Collection,
  dashboard: DataBoard,
  folder: Folder,
  help: QuestionFilled,
  logs: Tickets,
  marketing: MagicStick,
  messages: ChatLineRound,
  monitor: Monitor,
  notifications: Bell,
  orders: Files,
  permissions: Key,
  products: Goods,
  profile: UserFilled,
  settings: Setting,
  system: Grid,
  users: User,
  workspace: Stamp,
}

const menuRoutes = computed(() => asyncRoutes.filter((item) => !item.meta?.hidden))
const cachedViews = computed(() => tabsStore.tabs.map((tab) => tab.name).filter(Boolean))
const activeMenu = computed(() => route.meta.hidden ? route.matched.at(-2)?.path || route.path : route.path)

function getIcon(icon?: MenuIcon) {
  return icon ? iconMap[icon] || List : List
}

function visibleChildren(item: RouteRecordRaw) {
  return item.children?.filter((child) => !child.meta?.hidden) || []
}

function hasVisibleChildren(item: RouteRecordRaw) {
  return visibleChildren(item).length > 0
}

function normalizePath(path: string) {
  return `/${path}`.replace(/\/+/g, '/')
}

function resolveRoutePath(item: RouteRecordRaw, parentPath = '') {
  if (item.path.startsWith('/')) return item.path
  return normalizePath(`${parentPath}/${item.path}`)
}

function closeTab(tab: TabItem) {
  const currentIndex = tabsStore.tabs.findIndex((item) => item.path === tab.path)
  tabsStore.removeTab(tab.path)
  if (tab.path === route.path) {
    const nextTab = tabsStore.tabs[Math.max(0, currentIndex - 1)]
    router.push(nextTab?.fullPath || '/dashboard')
  }
}

function handleUserCommand(command: string) {
  if (command === 'settings') {
    router.push('/system/settings')
    return
  }
  if (command === 'logout') {
    ElMessageBox.confirm(t('navbar.logoutConfirm'), t('common.tips'), {
      cancelButtonText: t('common.cancel'),
      confirmButtonText: t('common.confirm'),
      type: 'warning',
    }).then(() => {
      userStore.logout()
      router.push('/login')
    })
  }
}

watch(
  () => route.fullPath,
  () => tabsStore.addTab(route),
  { immediate: true },
)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/mixins' as *;

.admin-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* ── Sidebar ── */
.layout-sidebar {
  display: flex;
  flex-direction: column;
  width: var(--sidebar-width);
  background: var(--bg-primary);
  border-right: 1px solid var(--border-color);
  transition: width var(--transition-base);
  flex-shrink: 0;
}

.is-collapsed .layout-sidebar {
  width: var(--sidebar-collapsed-width);
}

.brand {
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 16px;
  gap: 10px;
  cursor: pointer;
  border-bottom: 1px solid var(--border-light);
  flex-shrink: 0;
}

.brand__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  color: var(--color-primary);
  background: var(--color-primary-light);
  flex-shrink: 0;
}

.brand__text {
  strong {
    font-size: 16px;
    font-weight: 700;
    color: var(--text-primary);
  }
}

.is-collapsed .brand {
  justify-content: center;
  padding: 0;
  gap: 0;
}

.is-collapsed .menu-scroll {
  padding: 8px 6px;
}

.menu-scroll {
  flex: 1;
  padding: 8px;
}

.sidebar-menu {
  width: 100%;

  &:not(.el-menu--collapse) {
    :deep(.el-menu-item),
    :deep(.el-sub-menu__title) {
      padding-right: 10px;
    }
  }

  &.el-menu--collapse {
    width: 48px;
    margin: 0 auto;

    :deep(.el-menu-item),
    :deep(.el-sub-menu > .el-sub-menu__title) {
      justify-content: center;
      width: 48px;
      margin: 2px 0;
      padding: 0 !important;
      overflow: hidden;
    }

    :deep(.el-icon) {
      margin-right: 0;
    }
  }

  :deep(.el-menu-item),
  :deep(.el-sub-menu__title) {
    height: 38px;
    margin: 2px 0;
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    line-height: 38px;
    font-size: 13px;
    transition: all var(--transition-fast);
  }

  :deep(.el-icon) {
    width: 18px;
    font-size: 16px;
    margin-right: 8px;
  }

  :deep(.el-menu-item:hover),
  :deep(.el-sub-menu__title:hover) {
    color: var(--text-primary);
    background: var(--bg-hover);
  }

  :deep(.el-menu-item.is-active) {
    color: var(--color-primary);
    background: var(--color-primary-light);
    font-weight: 500;
  }
}

/* ── Stage (right side) ── */
.layout-stage {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  min-height: 0;
  background: #FAFBFC;
}

[data-theme='dark'] .layout-stage {
  background: #000000;
}

/* ── Header ── */
.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--navbar-height);
  padding: 0 16px;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.header-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  background: transparent;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    color: var(--text-primary);
    background: var(--bg-hover);
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    background: var(--bg-hover);
  }
}

.user-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  max-width: 80px;
  @include text-ellipsis;
}

/* ── Tabs ── */
.layout-tabs {
  display: flex;
  align-items: center;
  height: var(--tabs-height);
  padding: 0 12px;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
  overflow: hidden;
}

.tabs-scroll {
  display: flex;
  align-items: center;
  gap: 4px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.tab-item {
  display: inline-flex;
  align-items: center;
  height: 28px;
  gap: 4px;
  padding: 0 10px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  background: var(--bg-primary);
  white-space: nowrap;
  font-size: 12px;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    color: var(--color-primary);
    border-color: var(--color-primary);
  }

  &.active {
    color: var(--color-primary);
    border-color: var(--color-primary);
    background: var(--color-primary-light);
    font-weight: 500;
  }
}

.tab-close {
  width: 12px;
  height: 12px;
  opacity: 0;
  transition: opacity var(--transition-fast);

  .tab-item:hover & {
    opacity: 0.6;
  }

  &:hover {
    opacity: 1;
  }
}

/* ── Main ── */
.layout-main {
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  padding: 0;
}

@media (max-width: 980px) {
  .layout-sidebar {
    width: var(--sidebar-collapsed-width);
  }

  .brand__text,
  .header-left :deep(.app-breadcrumb) {
    display: none;
  }
}
</style>
