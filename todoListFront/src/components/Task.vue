<template>
  <span>
    <AccordionHeader>
      <span class="flex items-center gap-2 w-full">
        <Tag :severity="severity">{{ task.status }}</Tag>
        <span class="font-bold whitespace-nowrap">{{ task.title }}</span>
        <i class="pi pi-file-edit"></i>
        <i class="pi pi-trash"></i>
      </span>
    </AccordionHeader>
    <AccordionContent>
      <p class="m-0">
        {{ task.description }}
      </p>
    </AccordionContent>
  </span>
</template>
<script setup lang="ts">
import type { Status } from '../types/task.type'
import { computed } from 'vue'

const { task } = defineProps(['task'])

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
</script>
