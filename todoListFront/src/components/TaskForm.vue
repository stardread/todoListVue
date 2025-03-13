<template>
  <div class="flex items-center gap-4 mb-4">
    <label for="username" class="font-semibold w-24">Title</label>
    <InputText id="username" class="flex-auto" autocomplete="off" v-model="task.title" />
  </div>
  <div class="flex items-center gap-4 mb-8">
    <label for="description" class="font-semibold w-24">Description</label>
    <Textarea id="description" class="flex-auto" v-model="task.description" />
  </div>
  <div class="flex items-center gap-4 mb-8">
    <label for="status" class="font-semibold w-24">Status</label>
    <Select v-model="task.status" :options="status" placeholder="Select a status" class="w-full md:w-56" />
  </div>
  <div class="flex justify-end gap-2">
    <Button type="button" label="Cancel" severity="secondary" @click="closeDialog(false)"></Button>
    <Button type="button" label="Save" @click=sendTask></Button>
  </div>
</template>

<script setup lang="ts">
import type { Status, Task } from '@/types/task.type';
import { usePatchTask, usePostTask } from '@/utils/states';
import { useToast } from 'primevue';
import { onMounted, ref } from 'vue';
import { inject } from "vue";

const dialogRef = inject('dialogRef');
const task = ref<Task>({
  description: '',
  title: '',
  status: 'todo'
})
const isOnCreationMode = ref(true);
onMounted(() => {
  if (dialogRef.value?.data?.taskToEdit) {
    task.value = { ...dialogRef.value.data.taskToEdit };
    isOnCreationMode.value = false;
  }
})
const toast = useToast();

const status: Status[] = ['todo', 'inProgress', 'done'];

const closeDialog = (isTasksToRefresh = false) => {
  dialogRef.value.close({ isTasksToRefresh });
}

const sendTask = async () => {
  const isCreatedOrEditedTask = isOnCreationMode.value ? await usePostTask(task.value) : await usePatchTask(task.value);

  if (isCreatedOrEditedTask) {
    toast.add({ severity: 'success', summary: 'Confirmed', detail: `Task successfully ${isOnCreationMode.value ? 'created' : 'edited'}`, life: 3000 });
  } else {
    toast.add({ severity: 'danger', summary: 'Issue', detail: `Task not ${isOnCreationMode.value ? 'created' : 'edited'}`, life: 3000 });
  }

  closeDialog(isCreatedOrEditedTask)
}
</script>
