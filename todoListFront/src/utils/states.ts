import axios from 'axios'
import { ref, watch, watchEffect } from 'vue'
import { BASE_TASK_URL } from './constants'
import type { Task } from '@/types/task.type'

export function useGetAllTasks() {
  const fetchedTasks = ref([] as Task[])
  const incrToRefresh = ref(0)

  watch(
    incrToRefresh,
    async () => {
      try {
        const { data } = await axios.get<Task[]>(BASE_TASK_URL)
        fetchedTasks.value = data
      } catch (error) {
        console.log(error)
      }
    },
    { immediate: true },
  )

  return { incrToRefresh, fetchedTasks }
}

export async function usePostTask(task: Task): Promise<boolean> {
  const postedTask = ref()

  try {
    const { data } = await axios.post<Task[]>(BASE_TASK_URL, task)
    postedTask.value = data
  } catch (error) {
    console.log(error)
    return false
  }
  return true
}
