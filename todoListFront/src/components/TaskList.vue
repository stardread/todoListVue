<template>
  <div>
    <h1 class="text-center">My todo list</h1>
    <Button icon="pi pi-file-plus" @click="showTaskForm" rounded data-testid="add-task-button"></Button>
    <Accordion :value="['0']" multiple>
      <AccordionPanel v-for="(task, index) in fetchedTasks" :key="task._id" :value="index">
        <TaskComponent :task="task" data-testid="task" />
      </AccordionPanel>
    </Accordion>
    <DynamicDialog />
    <ConfirmDialog />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import { DynamicDialog, useDialog } from 'primevue'
import { useGetAllTasks } from '@/utils/states'
import TaskComponent from './TaskItem.vue'
import TaskForm from './TaskForm.vue'

const { incrToRefresh, fetchedTasks } = useGetAllTasks()
provide('refreshTasks', incrToRefresh)

const dialog = useDialog()

const showTaskForm = () => {
  dialog.open(TaskForm, {
    props: {
      header: 'Create task',
    }, onClose: (opt) => {
      if (opt?.data?.isTasksToRefresh) {
        incrToRefresh.value++
      }
    }
  })
}
</script>
