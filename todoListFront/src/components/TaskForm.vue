<template>
  <div class="flex items-center gap-4 mb-4">
    <label for="username" class="font-semibold w-24">Title</label>
    <InputText id="username" class="flex-auto" autocomplete="off" v-model="title" />
  </div>
  <div class="flex items-center gap-4 mb-8">
    <label for="description" class="font-semibold w-24">Description</label>
    <InputText id="description" class="flex-auto" autocomplete="off" v-model="description" />
  </div>
  <div class="flex items-center gap-4 mb-8">
    <label for="status" class="font-semibold w-24">Status</label>
    <Select v-model="selectedStatus" :options="status" placeholder="Select a status" class="w-full md:w-56" />
  </div>
  <div class="flex justify-end gap-2">
    <Button type="button" label="Cancel" severity="secondary" @click="closeDialog(false)"></Button>
    <Button type="button" label="Save" @click=sendTask></Button>
  </div>
</template>
<script setup lang="ts">
import type { Status, Task } from '@/types/task.type';
import { usePostTask } from '@/utils/states';
import { computed, ref } from 'vue';
import { inject } from "vue";

const dialogRef = inject('dialogRef');


const title = ref('');
const description = ref('');
const selectedStatus = ref<Status>('todo');
const status: Status[] = ['todo', 'inProgress', 'done'];
const task = computed<Task>(() => ({
  description: description.value,
  title: title.value,
  status: selectedStatus.value
}));
const closeDialog = (isTasksToRefresh = false) => {
  dialogRef.value.close({ isTasksToRefresh });
}

const sendTask = async () => {
  const postedTask = await usePostTask(task.value)

  closeDialog(postedTask)
}
</script>
