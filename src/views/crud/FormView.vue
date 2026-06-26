<template>
  <div class="page-shell">
    <section class="page-hero">
      <div>
        <p class="page-hero__eyebrow">Workspace</p>
        <h1 class="page-hero__title">{{ t('form.title') }}</h1>
        <p class="page-hero__subtitle">{{ t('form.subtitle') }}</p>
      </div>
      <el-button :icon="ArrowLeft" @click="router.back()">{{ t('common.back') }}</el-button>
    </section>

    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" class="form-grid">
      <GlassCard :title="t('form.basic')">
        <div class="field-grid">
          <el-form-item :label="t('form.name')" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item :label="t('form.email')" prop="email">
            <el-input v-model="form.email" />
          </el-form-item>
          <el-form-item :label="t('form.company')" prop="company">
            <el-input v-model="form.company" />
          </el-form-item>
          <el-form-item :label="t('form.role')" prop="role">
            <el-select v-model="form.role">
              <el-option label="Admin" value="admin" />
              <el-option label="Operator" value="operator" />
              <el-option label="Viewer" value="viewer" />
            </el-select>
          </el-form-item>
        </div>
      </GlassCard>

      <GlassCard :title="t('form.access')">
        <div class="field-grid">
          <el-form-item :label="t('form.plan')" prop="plan">
            <el-segmented v-model="form.plan" :options="plans" />
          </el-form-item>
          <el-form-item label="Quota">
            <el-slider v-model="form.quota" :min="10" :max="100" show-input />
          </el-form-item>
          <el-form-item :label="t('form.note')" class="span-2">
            <el-input v-model="form.note" type="textarea" :rows="5" />
          </el-form-item>
        </div>
      </GlassCard>

      <div class="submit-bar glass-panel">
        <el-button @click="router.back()">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="submitting" @click="submitForm">{{ t('common.save') }}</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import GlassCard from '@/components/common/GlassCard.vue'

const { t } = useI18n()
const router = useRouter()
const formRef = ref<FormInstance>()
const submitting = ref(false)
const plans = ['Starter', 'Growth', 'Enterprise']

const form = reactive({
  company: '',
  email: '',
  name: '',
  note: '',
  plan: 'Growth',
  quota: 60,
  role: 'operator',
})

const rules: FormRules = {
  company: [{ required: true, message: 'Required', trigger: 'blur' }],
  email: [
    { required: true, message: 'Required', trigger: 'blur' },
    { type: 'email', message: 'Invalid email', trigger: 'blur' },
  ],
  name: [{ required: true, message: 'Required', trigger: 'blur' }],
  role: [{ required: true, message: 'Required', trigger: 'change' }],
}

async function submitForm() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  window.setTimeout(() => {
    submitting.value = false
    ElMessage.success(t('common.success'))
    router.push('/workspace/users')
  }, 500)
}
</script>

<style lang="scss" scoped>
.form-grid {
  display: grid;
  gap: 14px;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 4px 16px;
}

.span-2 {
  grid-column: span 2;
}

.submit-bar {
  position: sticky;
  bottom: 2px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 12px;
}

@media (max-width: 760px) {
  .field-grid {
    grid-template-columns: 1fr;
  }

  .span-2 {
    grid-column: auto;
  }
}
</style>
