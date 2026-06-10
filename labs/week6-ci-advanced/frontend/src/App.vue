<template>
  <div>
    <AppHeader @add="openAdd" />

    <main class="main">
      <StatsGrid :stats="stats" />
      <TaskToolbar
        v-model:search="search"
        v-model:statusFilter="statusFilter"
        v-model:priorityFilter="priorityFilter"
        :loading="loading"
        :filtered-count="filtered.length"
        :total-count="tasks.length"
      />
      <TaskGrid
        :tasks="filtered"
        :loading="loading"
        :is-filtered="!!(search || statusFilter || priorityFilter)"
        @edit="openEdit"
        @request-delete="t => (confirmDelete = t)"
      />
    </main>

    <TaskModal
      v-if="showModal"
      :editing-id="editingId"
      :initial-form="form"
      @save="saveTask"
      @close="showModal = false"
    />
    <DeleteConfirm
      v-if="confirmDelete"
      :task="confirmDelete"
      @confirm="deleteTask(confirmDelete.id)"
      @cancel="confirmDelete = null"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTasks }     from './composables/useTasks.js'
import AppHeader        from './components/AppHeader.vue'
import StatsGrid        from './components/StatsGrid.vue'
import TaskToolbar      from './components/TaskToolbar.vue'
import TaskGrid         from './components/TaskGrid.vue'
import TaskModal        from './components/TaskModal.vue'
import DeleteConfirm    from './components/DeleteConfirm.vue'

const {
  tasks, loading, search, statusFilter, priorityFilter,
  showModal, editingId, confirmDelete, form,
  filtered, stats,
  fetchTasks, openAdd, openEdit, saveTask, deleteTask,
} = useTasks()

onMounted(fetchTasks)
</script>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: 'Sarabun', sans-serif;
  background: #f5f3ff;
  color: #1e293b;
  line-height: 1.75;
  font-size: 16px;
}
</style>

<style scoped>
.main { max-width: 1280px; margin: 0 auto; padding: 1.75rem 1.5rem; }
</style>
