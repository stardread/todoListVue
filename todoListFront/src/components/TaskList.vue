<template>
  <div>
    <h1>My todo list</h1>
    <Button @click="showTaskForm()">Add task</Button>
    <Accordion value="0">
      <AccordionPanel v-for="(task, index) in fetchedTasks" :key="task._id" :value="index" ref="itemsRefs">
        <TaskComponent :task="task" />
      </AccordionPanel>
    </Accordion>
    <DynamicDialog />
  </div>
</template>
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { DynamicDialog, useDialog } from 'primevue'
import { useGetAllTasks } from '@/utils/states'
import TaskComponent from './Task.vue'
import TaskForm from './TaskForm.vue'

const itemRefs = useTemplateRef('items')
const { incrToRefresh, fetchedTasks } = useGetAllTasks()

const dialog = useDialog()

const showTaskForm = (isCreation: boolean = true) => {
  dialog.open(TaskForm, {
    props: {
      header: isCreation ? 'Create task' : 'Edit Task',
    }, onClose: (opt) => {
      if (opt?.data.isTasksToRefresh) {
        incrToRefresh.value++
      }
    }
  })
}
</script>
