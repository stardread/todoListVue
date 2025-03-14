<template>
  <span class="flex flex-col">
    <AccordionHeader>
      <span class="flex items-center gap-2 w-full">
        <Tag :severity="severity">{{ task.status }}</Tag>
        <span class="font-bold whitespace-nowrap">{{ task.title }}</span>
      </span>
    </AccordionHeader>
    <AccordionContent>
      <Button icon="pi pi-file-edit" aria-label="delete task" severity="success" rounded variant="text" size="small"
        @click="editTask"></Button>
      <Button icon="pi pi-trash" aria-label="delete task" severity="danger" rounded variant="text" size="small"
        @click="deleteTask"></Button>
      <p class="m-0">
        {{ task.description }}
      </p>
    </AccordionContent>
  </span>
</template>

<script setup lang="ts">
import type { Status } from '../types/task.type'
import { computed, inject, ref } from 'vue'
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { useDeleteTask } from '@/utils/states';
import { useDialog } from 'primevue';
import TaskForm from './TaskForm.vue'

const confirm = useConfirm();
const toast = useToast();

const { task } = defineProps(['task'])
const incrToRefresh = inject('refreshTasks', ref(0))

const getColorTag = (status: Status): string => {
  switch (status) {
    case 'inProgress':
      return 'warn'
    case 'todo':
      return 'danger'
    case 'done':
      return 'success'
    default:
      return ''
  }
}

const severity = computed(() => getColorTag(task.status))


const dialog = useDialog()

const editTask = () => {
  dialog.open(TaskForm, {
    props: {
      header: 'Edit task',
    },
    data: {
            taskToEdit: task
        }, 
    onClose: (opt) => {
      if (opt?.data?.isTasksToRefresh) {
        incrToRefresh.value++
      }
    }
  })
}

const deleteTask = () => {
  confirm.require({
    message: `Do you want to delete task "${task.title}" ?`,
    header: 'Delete task',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger'
    },
    accept: async () => {
      const isDeletedTask = await useDeleteTask(task.id)
      if (isDeletedTask) {
        toast.add({ severity: 'success', summary: 'Confirmed', detail: `Task "${task.title}" deleted`, life: 3000 });
        incrToRefresh.value++
      } else {
        toast.add({ severity: 'danger', summary: 'Issue', detail: 'Task not deleted', life: 3000 });

      }
    }
  });
};
</script>
