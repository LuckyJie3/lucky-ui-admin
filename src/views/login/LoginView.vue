<template>
  <main class="login-page">
    <section class="login-panel">
      <div class="login-brand">
        <span class="brand-mark">L</span>
        <p class="page-hero__eyebrow">Lucky Admin</p>
        <h1>{{ t('login.title') }}</h1>
        <p>{{ t('login.subtitle') }}</p>
      </div>

      <div class="login-form-wrap">
        <div class="form-head">
          <h2>{{ t('login.login') }}</h2>
          <p>{{ t('login.tip') }}</p>
        </div>

        <el-form ref="formRef" :model="form" :rules="rules" class="login-form" size="large" @submit.prevent="handleLogin">
          <el-form-item prop="username">
            <el-input v-model="form.username" :placeholder="t('login.usernamePlaceholder')" :prefix-icon="UserFilled" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="form.password" type="password" show-password :placeholder="t('login.passwordPlaceholder')" :prefix-icon="Lock" @keyup.enter="handleLogin" />
          </el-form-item>
          <div class="form-extra">
            <el-checkbox v-model="form.rememberMe">{{ t('login.rememberMe') }}</el-checkbox>
            <button type="button">{{ t('login.forgotPassword') }}</button>
          </div>
          <el-button class="login-button" type="primary" :loading="loading" @click="handleLogin">
            {{ loading ? t('login.loggingIn') : t('login.login') }}
          </el-button>
        </el-form>

        <div class="locale-switch">
          <button type="button" :class="{ active: locale === 'zh-CN' }" @click="setLocale('zh-CN')">中文</button>
          <button type="button" :class="{ active: locale === 'en-US' }" @click="setLocale('en-US')">English</button>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Lock, UserFilled } from '@element-plus/icons-vue'
import { useLocale } from '@/composables/useLocale'
import { useTheme } from '@/composables/useTheme'
import { useUserStore } from '@/stores/user'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { locale, setLocale } = useLocale()
useTheme()

const formRef = ref<FormInstance>()
const loading = ref(false)
const form = reactive({ password: 'admin123', rememberMe: true, username: 'admin' })
const rules: FormRules = {
  password: [{ required: true, message: () => t('login.passwordRequired'), trigger: 'blur' }],
  username: [{ required: true, message: () => t('login.usernameRequired'), trigger: 'blur' }],
}

async function handleLogin() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  loading.value = true
  const result = await userStore.login(form.username, form.password)
  loading.value = false
  if (!result.success) {
    ElMessage.error(result.message)
    return
  }
  ElMessage.success(t('login.loginSuccess'))
  router.replace((route.query.redirect as string) || '/dashboard')
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/mixins' as *;

.login-page {
  display: grid;
  min-height: 100vh;
  padding: 28px;
  place-items: center;
  background: var(--bg-shell);
}

.login-panel {
  display: grid;
  width: min(980px, 100%);
  min-height: 560px;
  grid-template-columns: minmax(0, 1.05fr) minmax(360px, 0.95fr);
  border-radius: 24px;
  overflow: hidden;
  @include glass-surface;
  @include glass-edge;
}

.login-brand {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 44px;
  color: var(--text-primary);
  background: linear-gradient(145deg, rgba(var(--color-primary-rgb), 0.2), transparent 45%), radial-gradient(circle at 72% 18%, rgba(255, 255, 255, 0.36), transparent 28%);

  h1 {
    margin-top: 12px;
    font-size: clamp(42px, 7vw, 72px);
    line-height: 0.94;
    letter-spacing: 0;
  }

  p:last-child {
    max-width: 420px;
    margin-top: 18px;
    color: var(--text-secondary);
    font-size: 15px;
  }
}

.brand-mark {
  display: grid;
  width: 58px;
  height: 58px;
  place-items: center;
  border-radius: 16px;
  color: #fff;
  background: linear-gradient(135deg, var(--color-primary), #114e4d);
  font-size: 26px;
  font-weight: 820;
  box-shadow: 0 20px 34px rgba(var(--color-primary-rgb), 0.28);
}

.login-form-wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 44px;
  border-left: 1px solid var(--border-color);
  background: rgba(255, 255, 255, 0.18);
}

.form-head {
  margin-bottom: 28px;

  h2 {
    font-size: 26px;
  }

  p {
    margin-top: 8px;
    color: var(--text-muted);
    font-size: 13px;
  }
}

.form-extra,
.locale-switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.form-extra {
  margin-bottom: 22px;

  button {
    border: 0;
    color: var(--color-primary);
    background: transparent;
    cursor: pointer;
  }
}

.login-button {
  width: 100%;
  height: 46px;
}

.locale-switch {
  justify-content: center;
  margin-top: 24px;

  button {
    height: 32px;
    padding: 0 12px;
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
    color: var(--text-muted);
    background: transparent;
    cursor: pointer;

    &.active {
      border-color: var(--border-color);
      color: var(--color-primary);
      background: rgba(var(--color-primary-rgb), 0.08);
      font-weight: 760;
    }
  }
}

@media (max-width: 820px) {
  .login-panel {
    grid-template-columns: 1fr;
  }

  .login-brand {
    min-height: 260px;
  }

  .login-form-wrap {
    border-left: 0;
    border-top: 1px solid var(--border-color);
  }
}
</style>
