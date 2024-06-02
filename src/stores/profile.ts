import { defineStore } from 'pinia'

const validCode = '1234'

const timer = (delay = 1000) => new Promise((resolve) => setTimeout(resolve, delay))

export const useProfileStore = defineStore('profile', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: {
      username: 'Joshua Yeh',
      quote: 'Hello, World!',
      photo: '/avatar.jpeg'
    }
  }),
  actions: {
    async verify(code: string) {
      await timer()
      if (code === validCode) {
        this.token = 'example_token'
        localStorage.setItem('token', this.token)
        return {
          valid: true,
          token: 'example_token'
        }
      } else {
        this.token = ''
        localStorage.setItem('token', this.token)
        return {
          valid: false
        }
      }
    },
    logout() {
      this.token = ''
      localStorage.setItem('token', this.token)
    }
  }
})
