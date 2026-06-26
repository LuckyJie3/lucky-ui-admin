<template>
  <div class="admin-layout" :class="{ 'is-collapsed': appStore.sidebarCollapsed }">
    <aside class="layout-sidebar">
      <button class="brand" type="button" @click="router.push('/dashboard')">
        <span class="brand__mark">L</span>
        <span class="brand__copy">
          <strong>Lucky Admin</strong>
          <small>Glass console</small>
        </span>
      </button>

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
          <el-tooltip :content="appStore.sidebarCollapsed ? t('navbar.expand') : t('navbar.collapse')">
            <button class="icon-button" type="button" @click="appStore.toggleSidebar()">
              <el-icon><Expand v-if="appStore.sidebarCollapsed" /><Fold v-else /></el-icon>
            </button>
          </el-tooltip>
          <AppBreadcrumb v-if="appStore.showBreadcrumb" class="breadcrumb" />
        </div>

        <div class="header-search">
          <el-icon><Search /></el-icon>
          <span>{{ t('common.search') }}</span>
          <kbd>⌘K</kbd>
        </div>

        <div class="header-actions">
          <el-tooltip :content="t('navbar.localeSwitch')">
            <button class="text-button" type="button" @click="toggleLocale()">
              {{ appStore.locale === 'zh-CN' ? 'EN' : '中' }}
            </button>
          </el-tooltip>

          <el-tooltip :content="themeLabel">
            <button class="icon-button" type="button" @click="toggleTheme()">
              <el-icon><Moon v-if="resolved === 'dark'" /><Sunny v-else /></el-icon>
            </button>
          </el-tooltip>

          <el-dropdown trigger="click" @command="handleUserCommand">
            <button class="user-chip" type="button">
              <el-avatar :size="30" :icon="UserFilled" />
              <span>{{ userStore.username }}</span>
              <el-icon><ArrowDown /></el-icon>
            </button>
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

      <AppFooter v-if="appStore.showFooter" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessageBox } from 'element-plus'
import {
  Aim,
  ArrowDown,
  ChatLineRound,
  Close,
  Collection,
  DataAnalysis,
  DataBoard,
  Document,
  Expand,
  Files,
  Fold,
  Goods,
  Grid,
  Key,
  List,
  MagicStick,
  Monitor,
  Moon,
  Search,
  Setting,
  SwitchButton,
  Sunny,
  Tickets,
  User,
  UserFilled,
} from '@element-plus/icons-vue'
import AppBreadcrumb from './AppBreadcrumb.vue'
import AppFooter from './AppFooter.vue'
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
const { resolved, toggleTheme, themeMode } = useTheme()
const { toggleLocale } = useLocale()

const iconMap: Record<MenuIcon, unknown> = {
  analysis: DataAnalysis,
  articles: Document,
  comments: ChatLineRound,
  content: Collection,
  dashboard: DataBoard,
  logs: Tickets,
  marketing: MagicStick,
  monitor: Monitor,
  orders: Files,
  permissions: Key,
  products: Goods,
  settings: Setting,
  system: Grid,
  users: User,
  workspace: Aim,
}

const menuRoutes = computed(() => asyncRoutes.filter((item) => !item.meta?.hidden))
const cachedViews = computed(() => tabsStore.tabs.map((tab) => tab.name).filter(Boolean))
const activeMenu = computed(() => route.meta.hidden ? route.matched.at(-2)?.path || route.path : route.path)
const themeLabel = computed(() => {
  const labels = {
    auto: appStore.locale === 'zh-CN' ? '跟随系统' : 'System',
    dark: appStore.locale === 'zh-CN' ? '暗色' : 'Dark',
    light: appStore.locale === 'zh-CN' ? '亮色' : 'Light',
  }

  return labels[themeMode.value]
})

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
  display: grid;
  grid-template-columns: var(--sidebar-width) minmax(0, 1fr);
  height: 100vh;
  padding: 14px;
  gap: 14px;
  overflow: hidden;
  transition: grid-template-columns var(--transition-base);

  &.is-collapsed {
    grid-template-columns: var(--sidebar-collapsed-width) minmax(0, 1fr);
  }
}

.layout-sidebar,
.layout-header,
.layout-tabs {
  @include glass-surface;
  @include glass-edge;
}

.layout-sidebar {
  display: flex;
  min-width: 0;
  flex-direction: column;
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.brand {
  display: flex;
  align-items: center;
  width: 100%;
  height: 74px;
  gap: 12px;
  padding: 0 18px;
  border: 0;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
  background: transparent;
  cursor: pointer;
}

.brand__mark {
  display: grid;
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
  place-items: center;
  border-radius: 12px;
  color: #fff;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.25), transparent 45%),
    linear-gradient(135deg, var(--color-primary), #114e4d);
  font-size: 18px;
  font-weight: 820;
  box-shadow: 0 14px 24px rgba(var(--color-primary-rgb), 0.28);
}

.brand__copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: flex-start;

  strong,
  small {
    @include text-ellipsis;
    max-width: 170px;
  }

  strong {
    font-size: 15px;
    letter-spacing: 0;
  }

  small {
    color: var(--text-muted);
    font-size: 11px;
  }
}

.is-collapsed .brand {
  justify-content: center;
  padding: 0;
}

.is-collapsed .brand__copy {
  display: none;
}

.menu-scroll {
  flex: 1;
  padding: 12px 8px;
}

.sidebar-menu {
  width: 100%;

  &:not(.el-menu--collapse) {
    :deep(.el-menu-item),
    :deep(.el-sub-menu__title) {
      padding-right: 12px;
    }
  }

  &.el-menu--collapse {
    width: 100%;

    :deep(.el-menu-item),
    :deep(.el-sub-menu__title) {
      justify-content: center;
      width: 44px;
      margin: 4px auto;
      padding: 0 !important;
    }
  }

  :deep(.el-menu-item),
  :deep(.el-sub-menu__title) {
    height: 44px;
    margin: 4px 6px;
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    line-height: 44px;
  }

  :deep(.el-icon) {
    width: 20px;
    font-size: 18px;
  }

  :deep(.el-menu-item:hover),
  :deep(.el-sub-menu__title:hover) {
    color: var(--text-primary);
    background: rgba(var(--color-primary-rgb), 0.08);
  }

  :deep(.el-menu-item.is-active) {
    color: var(--color-primary);
    background: rgba(var(--color-primary-rgb), 0.13);
    font-weight: 720;
  }
}

.layout-stage {
  display: grid;
  min-width: 0;
  min-height: 0;
  grid-template-rows: var(--navbar-height) auto minmax(0, 1fr) auto;
  gap: 12px;
}

.layout-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(220px, 420px) minmax(0, 1fr);
  align-items: center;
  gap: 14px;
  padding: 0 14px;
  border-radius: var(--radius-xl);
}

.header-left,
.header-actions,
.user-chip {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-actions {
  justify-content: flex-end;
}

.breadcrumb {
  min-width: 0;
}

.header-search {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 8px;
  height: 40px;
  padding: 0 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.24);

  span {
    flex: 1;
    font-size: 13px;
  }

  kbd {
    padding: 2px 6px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    color: var(--text-muted);
    background: rgba(255, 255, 255, 0.25);
    font-size: 11px;
  }
}

.icon-button,
.text-button,
.user-chip {
  height: 38px;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  background: transparent;
  cursor: pointer;
  transition: var(--transition-fast);
}

.icon-button {
  display: grid;
  width: 38px;
  place-items: center;
}

.text-button {
  min-width: 38px;
  padding: 0 10px;
  font-weight: 760;
}

.user-chip {
  padding: 0 8px 0 4px;

  span {
    max-width: 96px;
    @include text-ellipsis;
  }
}

.icon-button:hover,
.text-button:hover,
.user-chip:hover {
  border-color: var(--border-color);
  color: var(--text-primary);
  background: rgba(var(--color-primary-rgb), 0.08);
}

.layout-tabs {
  display: flex;
  align-items: center;
  min-height: var(--tabs-height);
  gap: 6px;
  padding: 5px;
  border-radius: var(--radius-lg);
  overflow-x: auto;
}

.tab-item {
  display: inline-flex;
  align-items: center;
  height: calc(var(--tabs-height) - 10px);
  gap: 6px;
  padding: 0 11px;
  border: 0;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  background: transparent;
  white-space: nowrap;
  cursor: pointer;

  &.active {
    color: var(--color-primary);
    background: rgba(var(--color-primary-rgb), 0.12);
    font-weight: 720;
  }
}

.tab-close {
  width: 14px;
  height: 14px;
  opacity: 0.55;
}

.layout-main {
  min-width: 0;
  min-height: 0;
  overflow: auto;
  padding: 2px;
}

@media (max-width: 980px) {
  .admin-layout {
    grid-template-columns: var(--sidebar-collapsed-width) minmax(0, 1fr);
  }

  .brand__copy,
  .breadcrumb,
  .header-search {
    display: none;
  }

  .layout-header {
    grid-template-columns: auto 1fr;
  }

  .header-actions {
    grid-column: 2;
  }
}
</style>
