# Cloud Admin

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Vue](https://img.shields.io/badge/Vue-3.5-4fc08d?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.0-646cff?logo=vite)

**现代化的企业级中后台管理平台模板**

基于 Vue 3 + Element Plus，苹果风格毛玻璃 UI，支持暗亮色切换与多语系

</div>

---

## ✨ 功能特性

| 特性 | 说明 |
|------|------|
| 🪟 **毛玻璃 UI** | 苹果风格 backdrop-filter 毛玻璃效果，全界面覆盖 |
| 🌗 **暗亮色切换** | 亮色 / 暗色 / 跟随系统，三种主题模式一键切换 |
| 🌍 **多语系** | 中英文双语支持，基于 vue-i18n，Element Plus 国际化联动 |
| 📐 **工程化目录** | 标准化的 src 目录结构，组件/工具/状态/路由分层清晰 |
| 📦 **状态管理** | Pinia 模块化状态管理（app / user） |
| 🛤️ **路由系统** | 模块化路由配置 + 路由守卫 + 面包屑自动生成 |
| 📡 **请求封装** | Axios 封装，统一拦截器、错误处理、Token 管理 |
| 🧩 **组件封装** | GlassCard、GlassContainer 等可复用毛玻璃组件 |
| 📊 **示例页面** | 仪表盘、CRUD 表格/表单、系统设置、登录页、404 |

---

## 🚀 快速开始

### 前置要求

- **Node.js** ≥ 20.19 或 ≥ 22.12
- **pnpm**（推荐）

### 安装与启动

```bash
# 克隆项目
git clone <your-repo-url>
cd cloud-admin

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

开发服务器默认运行在 `http://localhost:5173`

### 构建生产版本

```bash
pnpm build          # 构建 + 类型检查
pnpm build-only     # 仅构建
pnpm preview        # 预览构建结果
```

---

## 📁 目录结构

```
cloud-admin/
├── public/                        # 静态资源
├── src/
│   ├── assets/
│   │   └── styles/                # 全局样式系统
│   │       ├── variables.scss     # CSS 变量 / Design Tokens
│   │       ├── mixins.scss        # 毛玻璃、动画等 Mixins
│   │       ├── reset.scss         # 全局重置
│   │       ├── transition.scss    # 路由过渡动画
│   │       ├── element-theme.scss # Element Plus 主题覆盖
│   │       └── index.scss         # 样式入口
│   ├── components/
│   │   ├── common/                # 通用组件
│   │   │   ├── GlassCard.vue      # 毛玻璃卡片
│   │   │   ├── GlassContainer.vue # 毛玻璃容器
│   │   │   └── SvgIcon.vue        # SVG 图标
│   │   └── layout/                # 布局组件
│   │       ├── AppLayout.vue      # 主布局框架
│   │       ├── AppSidebar.vue     # 侧边栏菜单
│   │       ├── AppNavbar.vue      # 顶部导航栏
│   │       ├── AppBreadcrumb.vue  # 面包屑
│   │       ├── ThemeToggle.vue    # 主题切换按钮
│   │       ├── LocaleToggle.vue   # 语言切换按钮
│   │       └── AppFooter.vue      # 底部栏
│   ├── composables/
│   │   ├── useTheme.ts            # 主题切换逻辑
│   │   └── useLocale.ts           # 国际化逻辑
│   ├── locales/
│   │   ├── zh-CN.ts               # 中文语言包
│   │   ├── en-US.ts               # 英文语言包
│   │   └── index.ts               # i18n 实例
│   ├── router/
│   │   ├── routes.ts              # 路由配置（模块化）
│   │   ├── guards.ts              # 路由守卫
│   │   └── index.ts               # 路由实例
│   ├── stores/
│   │   ├── app.ts                 # 应用状态（主题/语言/布局）
│   │   ├── user.ts                # 用户状态（登录模拟）
│   │   └── index.ts               # Pinia 实例
│   ├── types/
│   │   └── global.d.ts            # 全局类型声明
│   ├── utils/
│   │   ├── request.ts             # Axios 封装
│   │   └── storage.ts             # 本地存储封装
│   ├── views/
│   │   ├── dashboard/             # 仪表盘
│   │   ├── crud/                  # 表格 & 表单示例
│   │   ├── system/                # 系统设置
│   │   ├── login/                 # 登录页
│   │   └── error/                 # 404 页
│   ├── App.vue                    # 根组件
│   └── main.ts                    # 应用入口
├── index.html                     # HTML 入口
├── package.json
├── vite.config.ts                 # Vite 配置
├── tsconfig.json                  # TypeScript 配置
├── .env / .env.development / .env.production
└── README.md
```

---

## 🧩 核心技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | Vue 3 | ^3.5 |
| 语言 | TypeScript | ~5.8 |
| 构建 | Vite | ^7.0 |
| UI 库 | Element Plus | ^2.11 |
| 状态管理 | Pinia | ^3.0 |
| 路由 | Vue Router | ^4.5 |
| 国际化 | Vue I18n | ^11.4 |
| HTTP | Axios | ^1.18 |
| 工具库 | VueUse | ^14.3 |
| 样式 | SCSS | ^1.101 |

---

## 🎨 主题系统

项目使用 CSS 自定义属性实现主题系统：

- **语义化变量**：`--bg-body`、`--text-primary`、`--border-color` 等
- **毛玻璃变量**：`--glass-bg`、`--glass-blur`、`--glass-border` 等
- **切换方式**：通过 `data-theme` 属性切换亮/暗主题，所有变量自动生效

```scss
// 使用毛玻璃效果
.card {
  @include glass-effect-adaptive;
}
```

---

## 📖 开发指南

### 添加新页面

1. 在 `src/views/` 下创建 `.vue` 文件
2. 在 `src/router/routes.ts` 中注册路由
3. 在 `src/locales/zh-CN.ts` 和 `en-US.ts` 中添加对应文案
4. （可选）在 `AppSidebar.vue` 的 `iconMap` 中配置图标

### 添加新语言

1. 在 `src/locales/` 下创建新的语言包文件
2. 在 `src/locales/index.ts` 中注册
3. 在 `src/composables/useLocale.ts` 中添加 Element Plus 语言映射

### API 请求

```typescript
import { get, post } from '@/utils/request'

// GET 请求
const res = await get<User[]>('/users', { page: 1 })

// POST 请求
await post('/users', { name: '张三' })
```

---

## 📄 License

MIT © Cloud Admin
