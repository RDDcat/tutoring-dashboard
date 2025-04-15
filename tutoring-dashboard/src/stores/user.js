import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const id = ref(null)
  const name = ref('')
  const role = ref('')

  const setUser = (userData) => {
    id.value = userData.id
    name.value = userData.name
    role.value = userData.role
  }

  return { id, name, role, setUser }
})
