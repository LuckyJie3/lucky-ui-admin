<template>
  <div class="p-6px">
    <el-row :gutter="20">
      <!-- 左侧：个人信息卡片 -->
      <el-col :span="6" :xs="24">
        <el-card shadow="never" class="rounded-md">
          <div class="profile-info">
            <div class="flex flex-justify-center mb-20px">
              <el-avatar :size="72" :style="{ background: 'var(--el-color-primary)', fontSize: '28px' }">L</el-avatar>
            </div>
            <div class="text-center mb-20px">
              <div class="font-bold text-16px">Lucky Admin</div>
              <div class="text-12px mt-4px" style="color: var(--el-text-color-secondary);">Super Administrator</div>
            </div>
            <el-divider />
            <div class="info-list">
              <div class="info-list__item">
                <div class="info-list__label"><el-icon :size="15"><Message /></el-icon> 邮箱</div>
                <div>admin@lucky-admin.dev</div>
              </div>
              <div class="info-list__item">
                <div class="info-list__label"><el-icon :size="15"><Iphone /></el-icon> 手机</div>
                <div>138-0000-0000</div>
              </div>
              <div class="info-list__item">
                <div class="info-list__label"><el-icon :size="15"><Location /></el-icon> 所在地</div>
                <div>Shanghai, CN</div>
              </div>
              <div class="info-list__item">
                <div class="info-list__label"><el-icon :size="15"><Postcard /></el-icon> 部门</div>
                <div>研发部门</div>
              </div>
              <div class="info-list__item">
                <div class="info-list__label"><el-icon :size="15"><Collection /></el-icon> 角色</div>
                <div>超级管理员</div>
              </div>
              <div class="info-list__item">
                <div class="info-list__label"><el-icon :size="15"><Calendar /></el-icon> 加入时间</div>
                <div>2024-03-15</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：Tab 页 -->
      <el-col :span="18" :xs="24">
        <el-card shadow="never" class="rounded-md" :body-style="{ 'padding-top': '6px' }">
          <el-tabs v-model="activeTab">
            <!-- 基本资料 -->
            <el-tab-pane label="基本资料" name="basic">
              <el-form ref="basicFormRef" :model="basicForm" :rules="basicRules" label-width="80px" status-icon>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="登录名称" prop="loginName">
                      <el-input v-model="basicForm.loginName" placeholder="请输入登录名称" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="用户昵称" prop="nickName">
                      <el-input v-model="basicForm.nickName" placeholder="请输入用户昵称" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="手机号码" prop="phone">
                      <el-input v-model="basicForm.phone" placeholder="请输入手机号码" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="邮箱" prop="email">
                      <el-input v-model="basicForm.email" placeholder="请输入邮箱" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="性别" prop="sex">
                      <el-radio-group v-model="basicForm.sex">
                        <el-radio value="1" border>男</el-radio>
                        <el-radio value="2" border>女</el-radio>
                        <el-radio value="0" border>未知</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item>
                      <el-button type="primary" plain @click="handleBasicSave">保存</el-button>
                      <el-button type="danger" plain @click="resetBasicForm">重置</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-tab-pane>

            <!-- 修改密码 -->
            <el-tab-pane label="修改密码" name="password">
              <el-form ref="pwdFormRef" :model="pwdForm" :rules="pwdRules" label-width="80px" status-icon>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="旧密码" prop="password">
                      <el-input v-model="pwdForm.password" placeholder="请输入旧密码" show-password clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="新密码" prop="newPassword">
                      <el-input v-model="pwdForm.newPassword" placeholder="请输入新密码" show-password clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="确认密码" prop="confirmPassword">
                      <el-input v-model="pwdForm.confirmPassword" placeholder="请输入确认密码" show-password clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item>
                      <el-button type="primary" plain @click="handlePwdSave">保存</el-button>
                      <el-button type="danger" plain @click="resetPwdForm">重置</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-tab-pane>

            <!-- 操作日志 -->
            <el-tab-pane label="操作日志" name="logs">
              <el-table :data="activityLogs" border style="width: 100%;">
                <el-table-column label="序号" width="70" align="center" type="index" />
                <el-table-column label="操作内容" prop="action" min-width="200" :show-overflow-tooltip="true" />
                <el-table-column label="操作详情" prop="detail" min-width="200" :show-overflow-tooltip="true" />
                <el-table-column label="操作时间" prop="time" width="180" align="center" />
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="profilePage">
import { ref, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Calendar, Collection, Iphone, Location, Message, Postcard } from '@element-plus/icons-vue'

const activeTab = ref('basic')

// 基本资料
const basicFormRef = ref()
const basicForm = ref({ loginName: 'admin', nickName: 'Lucky Admin', phone: '13800000000', email: 'admin@lucky-admin.dev', sex: '1' })
const basicRules = reactive({
  loginName: [{ required: true, message: '请输入登录名称', trigger: 'blur' }],
  nickName: [{ required: true, message: '请输入用户昵称', trigger: 'blur' }],
})
const handleBasicSave = () => {
  if (!basicFormRef.value) return
  basicFormRef.value.validate((valid: boolean) => {
    if (valid) ElMessage.success('保存成功')
    else ElMessage.error('请检查填写内容')
  })
}
const resetBasicForm = () => {
  nextTick(() => basicFormRef.value?.resetFields())
  basicForm.value = { loginName: '', nickName: '', phone: '', email: '', sex: '0' }
}

// 修改密码
const pwdFormRef = ref()
const pwdForm = ref({ password: '', newPassword: '', confirmPassword: '' })
const pwdRules = reactive({
  password: [{ required: true, message: '请输入旧密码', trigger: 'change' }],
  newPassword: [{ required: true, message: '请输入新密码', trigger: 'change' }],
  confirmPassword: [{ required: true, message: '请输入确认密码', trigger: 'change' }],
})
const handlePwdSave = () => {
  if (!pwdFormRef.value) return
  pwdFormRef.value.validate((valid: boolean) => {
    if (valid) ElMessage.success('密码修改成功')
    else ElMessage.error('请检查填写内容')
  })
}
const resetPwdForm = () => {
  nextTick(() => pwdFormRef.value?.resetFields())
  pwdForm.value = { password: '', newPassword: '', confirmPassword: '' }
}

// 操作日志
const activityLogs = ref([
  { action: '修改了系统配置', detail: '修改 site.locale → zh-CN', time: '2026-07-03 14:30:45' },
  { action: '审批了 3 笔订单', detail: '订单号 #20260703-001 ~ #003', time: '2026-07-03 11:22:18' },
  { action: '导出了客户数据', detail: '格式: Excel, 2,480 条记录', time: '2026-07-02 16:45:00' },
  { action: '登录系统', detail: 'IP: 192.168.1.105 · Chrome / Windows', time: '2026-07-02 09:00:00' },
  { action: '修改了密码', detail: '通过个人中心修改', time: '2026-07-01 10:30:00' },
])
</script>

<style lang="scss" scoped>
.info-list {
  display: flex;
  flex-direction: column;
}

.info-list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  font-size: 13px;
  color: var(--el-text-color-regular);
  border-bottom: 1px solid var(--el-border-color-lighter);

  &:last-child { border-bottom: none; padding-bottom: 0; }
  &:first-child { padding-top: 0; }
}

.info-list__label {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--el-text-color-secondary);
}

.flex-justify-center { justify-content: center; }
</style>
