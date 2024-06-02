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
        @keyup.backspace="handleKeyup(index)"
        @paste.prevent="(event) => handlePaste(event, index)"
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
  jumpNext(index)
}
const handleKeyup = async (index) => {
  if (index <= 0) return
  const lastIndex = index - 1
  pads.value[lastIndex] = ''
  inputRefs.value[lastIndex].focus()
}

const jumpNext = async (index) => {
  const nextIndex = index < 3 ? index + 1 : index
  inputRefs.value[nextIndex].focus()
  if (index === 3) {
    await verifyCode()
    inputRefs.value[0].focus()
  }
}

const handlePaste = async (event, index) => {
  let pasteData = event.clipboardData.getData('text')
  if (!pasteData.match(/^\d+$/)) return
  pasteData = pasteData.split('')
  for (
    let i = index, pasteIndex = 0;
    i < pads.value.length && pasteIndex < pasteData.length;
    i++, pasteIndex++
  ) {
    const curPaste = pasteData[pasteIndex]
    pads.value[i] = curPaste
    await jumpNext(i)
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
