<template>
  <div class="about">
    <h1>profile page</h1>
    <div class="user-info">
      <span> name:{{ username }} </span>
      <span> quote:{{ quote }} </span>
      <img :src="photo" width="200" />
    </div>
    <button class="logout" @click="logout">登出</button>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import { useProfileStore } from '@/stores/profile'

const profileStore = useProfileStore()
const { username, quote, photo } = profileStore.user

const logout = () => {
  profileStore.logout()
  router.push('/')
}
</script>

<style lang="scss" scoped>
.about {
  .user-info {
    display: flex;
    flex-direction: column;
  }
  button.logout {
    margin-top: 50px;
  }
}
</style>
