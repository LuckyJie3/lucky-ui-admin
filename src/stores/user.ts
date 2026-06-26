import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getStorage, removeStorage, setStorage } from '@/utils/storage'

export interface UserInfo {
  avatar: string
  email: string
  id: number
  nickname: string
  roles: string[]
  username: string
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(getStorage('token'))
  const userInfo = ref<UserInfo | null>(getStorage<UserInfo>('user-info'))

  const isLoggedIn = computed(() => Boolean(token.value))
  const roles = computed(() => userInfo.value?.roles || [])
  const username = computed(() => userInfo.value?.nickname || userInfo.value?.username || 'Guest')

  async function login(username: string, _password: string): Promise<{ message: string; success: boolean }> {
    await new Promise((resolve) => window.setTimeout(resolve, 500))

    const mockToken = 'mock-token-' + Date.now()
    const mockUser: UserInfo = {
      avatar: '',
      email: username + '@lucky-admin.dev',
      id: 1,
      nickname: username,
      roles: ['admin'],
      username,
    }

    token.value = mockToken
    userInfo.value = mockUser
    setStorage('token', mockToken)
    setStorage('user-info', mockUser)

    return { message: 'Login successful', success: true }
  }

  function logout() {
    token.value = null
    userInfo.value = null
    removeStorage('token')
    removeStorage('user-info')
  }

  return {
    isLoggedIn,
    login,
    logout,
    roles,
    token,
    userInfo,
    username,
  }
})
