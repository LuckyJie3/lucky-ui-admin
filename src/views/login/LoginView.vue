<template>
  <main class="login-page">
    <section class="login-card">
      <div class="login-left">
        <div class="login-left__content">
          <div class="login-logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h1 class="login-left__title">Lucky Admin</h1>
          <p class="login-left__desc">{{ t('login.subtitle') }}</p>
        </div>
      </div>

      <div class="login-right">
        <div class="login-form-box">
          <h2 class="login-form-title">{{ t('login.login') }}</h2>
          <p class="login-form-desc">{{ t('login.tip') }}</p>

          <el-form ref="formRef" :model="form" :rules="rules" class="login-form" @submit.prevent="handleLogin">
            <el-form-item prop="username">
              <el-input v-model="form.username" size="large" :placeholder="t('login.usernamePlaceholder')" :prefix-icon="UserFilled" />
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="form.password" type="password" show-password size="large" :placeholder="t('login.passwordPlaceholder')" :prefix-icon="Lock" @keyup.enter="handleLogin" />
            </el-form-item>

            <div class="form-options">
              <el-checkbox v-model="form.rememberMe">{{ t('login.rememberMe') }}</el-checkbox>
              <a class="form-link" href="#">{{ t('login.forgotPassword') }}</a>
            </div>

            <el-button class="login-btn" type="primary" size="large" :loading="loading" @click="handleLogin">
              {{ loading ? t('login.loggingIn') : t('login.login') }}
            </el-button>
          </el-form>

          <div class="locale-bar">
            <button type="button" :class="{ active: locale === 'zh-CN' }" @click="setLocale('zh-CN')">中文</button>
            <span class="locale-sep">/</span>
            <button type="button" :class="{ active: locale === 'en-US' }" @click="setLocale('en-US')">English</button>
          </div>
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
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--bg-body);
  padding: 20px;
}

.login-card {
  display: flex;
  width: min(900px, 100%);
  min-height: 480px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  box-shadow: var(--shadow-lg);
}

.login-left {
  display: flex;
  align-items: flex-end;
  width: 45%;
  padding: 40px 32px;
  background: var(--color-primary);
  color: white;
}

.login-left__content {
  width: 100%;
}

.login-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.2);
  margin-bottom: 20px;
}

.login-left__title {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
}

.login-left__desc {
  margin-top: 8px;
  font-size: 14px;
  opacity: 0.85;
  line-height: 1.5;
}

.login-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 32px;
}

.login-form-box {
  width: 100%;
  max-width: 320px;
}

.login-form-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary);
}

.login-form-desc {
  margin-top: 4px;
  margin-bottom: 24px;
  font-size: 13px;
  color: var(--text-muted);
}

.login-form {
  :deep(.el-form-item) {
    margin-bottom: 18px;
  }
}

.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.form-link {
  font-size: 13px;
  color: var(--color-primary);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.login-btn {
  width: 100%;
}

.locale-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 24px;

  button {
    border: none;
    background: none;
    color: var(--text-muted);
    font-size: 13px;
    cursor: pointer;
    padding: 2px 4px;

    &.active {
      color: var(--color-primary);
      font-weight: 500;
    }

    &:hover {
      color: var(--text-primary);
    }
  }

  .locale-sep {
    color: var(--border-color);
    font-size: 12px;
  }
}

@media (max-width: 768px) {
  .login-card {
    flex-direction: column;
  }

  .login-left {
    width: 100%;
    min-height: 160px;
    align-items: center;
    padding: 28px 24px;
  }

  .login-right {
    padding: 28px 24px;
  }
}
</style>
