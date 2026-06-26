import type { RouteRecordRaw } from 'vue-router'

export type MenuIcon =
  | 'dashboard'
  | 'analysis'
  | 'monitor'
  | 'workspace'
  | 'users'
  | 'orders'
  | 'products'
  | 'marketing'
  | 'content'
  | 'articles'
  | 'comments'
  | 'system'
  | 'settings'
  | 'permissions'
  | 'logs'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: MenuIcon
    hidden?: boolean
    affix?: boolean
  }
}

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/LoginView.vue'),
    meta: { title: 'login.title', hidden: true },
  },
]

export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/DashboardView.vue'),
    meta: { title: 'nav.dashboard', icon: 'dashboard', affix: true },
  },
  {
    path: '/analytics',
    name: 'Analytics',
    redirect: '/analytics/overview',
    meta: { title: 'nav.analysis', icon: 'analysis' },
    children: [
      {
        path: 'overview',
        name: 'AnalyticsOverview',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        meta: { title: 'nav.analysis', icon: 'analysis' },
      },
      {
        path: 'monitor',
        name: 'LiveMonitor',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        meta: { title: 'nav.monitor', icon: 'monitor' },
      },
    ],
  },
  {
    path: '/workspace',
    name: 'Workspace',
    redirect: '/workspace/users',
    meta: { title: 'nav.workspace', icon: 'workspace' },
    children: [
      {
        path: 'users',
        name: 'CustomerRecords',
        component: () => import('@/views/crud/TableView.vue'),
        meta: { title: 'nav.users', icon: 'users' },
      },
      {
        path: 'orders',
        name: 'OrderFulfillment',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        meta: { title: 'nav.orders', icon: 'orders' },
      },
      {
        path: 'products',
        name: 'ProductOps',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        meta: { title: 'nav.products', icon: 'products' },
      },
      {
        path: 'marketing',
        name: 'Campaigns',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        meta: { title: 'nav.marketing', icon: 'marketing' },
      },
      {
        path: 'users/create',
        name: 'CreateCustomer',
        component: () => import('@/views/crud/FormView.vue'),
        meta: { title: 'form.title', hidden: true },
      },
    ],
  },
  {
    path: '/content',
    name: 'Content',
    redirect: '/content/articles',
    meta: { title: 'nav.content', icon: 'content' },
    children: [
      {
        path: 'articles',
        name: 'Articles',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        meta: { title: 'nav.articles', icon: 'articles' },
      },
      {
        path: 'comments',
        name: 'Comments',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        meta: { title: 'nav.comments', icon: 'comments' },
      },
    ],
  },
  {
    path: '/system',
    name: 'System',
    redirect: '/system/settings',
    meta: { title: 'nav.system', icon: 'system' },
    children: [
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/system/SettingsView.vue'),
        meta: { title: 'nav.settings', icon: 'settings' },
      },
      {
        path: 'permissions',
        name: 'Permissions',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        meta: { title: 'nav.permissions', icon: 'permissions' },
      },
      {
        path: 'logs',
        name: 'AuditLogs',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        meta: { title: 'nav.logs', icon: 'logs' },
      },
    ],
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/error/404View.vue'),
    meta: { title: 'error404.title', hidden: true },
  },
]

export const layoutRoute: RouteRecordRaw = {
  path: '/',
  component: () => import('@/components/layout/AppLayout.vue'),
  redirect: '/dashboard',
  children: asyncRoutes,
}
