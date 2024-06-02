<template>
  <div class="border border-red-200">
    <h2>Verification Page</h2>
    <div class="verification-inputs">
      <input
        v-for="(pad, index) in pads"
        :key="index"
        :value="pad"
        maxlength="1"
        ref="inputRefs"
        @input="(event) => handleInput(event, index)"
        @keyup="(event) => handleKeyup(event, index)"
      />
      <button class="submit" @click="verifyCode" :disabled="loading">提交</button>
    </div>
    <p v-if="error">{{ error }}</p>
    <p v-if="loading">Loading...</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProfileStore } from '@/stores/profile'
const pads = ref(['', '', '', ''])
const inputRefs = ref([])
const error = ref('')
const loading = ref(false)
const router = useRouter()
const profileStore = useProfileStore()
onMounted(() => {
  // bug: no focus on first input
  const firstInput = inputRefs.value[0]
  firstInput.focus()
})
const handleInput = (event, index) => {
  const value = event.target.value
  const newValue = value.replace(/\D/g, '')

  // bug: input has no set to empty
  pads.value[index] = ''
  if (!newValue) return
  pads.value[index] = newValue
}
const handleKeyup = async (event, index) => {
  const key = event.key
  if (key >= '0' && key <= '9') {
    const nextIndex = index < 3 ? index + 1 : index
    inputRefs.value[nextIndex].focus()
    if (index === 3) {
      await verifyCode()
      inputRefs.value[0].focus()
    }
  } else if (key === 'Backspace' && index > 0) {
    const lastIndex = index - 1
    inputRefs.value[lastIndex].focus()
  }
}

const verifyCode = async () => {
  const code = pads.value.join('')
  if (code.length !== 4 || !/^\d+$/.test(code)) {
    error.value = 'Please enter a valid 4-digit code'
    return
  }
  error.value = ''
  loading.value = true
  const { valid } = await profileStore.verify(code)
  loading.value = false
  if (!valid) {
    error.value = 'code is not valid'
    pads.value = ['', '', '', '']
  } else {
    router.push('/profile')
  }
}
</script>

<style scoped>
.verification-inputs {
  display: flex;
  justify-content: center;
  align-items: center;
}
.verification-inputs input {
  width: 40px;
  height: 40px;
  margin: 0 5px;
  text-align: center;
}
button.submit {
  height: 40px;
  margin-left: 20px;
}
</style>
