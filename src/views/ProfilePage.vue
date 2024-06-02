<template>
  <div class="about">
    <h1>profile page</h1>
    <div class="user-info">
      <span> name:{{ username }} </span>
      <span> quote:{{ quote }} </span>
      <img :src="photo" width="200" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProfileStore } from '@/stores/profile'

const { user } = useProfileStore()
const { username, quote, photo } = user
</script>

<style lang="scss" scoped>
.about {
  .user-info {
    display: flex;
    flex-direction: column;
  }
}
</style>
