<template>

  <!-- กำลังโหลด -->
  <div class="state-box" v-if="loading">
    <div class="state-icon">⏳</div>
    <div>กำลังโหลดข้อมูลงาน...</div>
  </div>

  <!-- ไม่พบงาน -->
  <div class="state-box" v-else-if="tasks.length === 0">
    <div class="state-icon">📋</div>
    <div class="state-title">ไม่พบงาน</div>
    <div class="state-desc">
      {{ isFiltered ? 'ลองเปลี่ยน keyword หรือ filter' : 'กดปุ่ม "+ เพิ่มงาน" เพื่อเริ่มต้น' }}
    </div>
  </div>

  <!-- grid งาน -->
  <div class="task-grid" v-else>
    <TaskCard
      v-for="t in tasks"
      :key="t.id"
      :task="t"
      @edit="$emit('edit', t)"
      @delete="$emit('request-delete', t)"
    />
  </div>

</template>

<script setup>
import TaskCard from './TaskCard.vue'

defineProps({
  tasks:      { type: Array,   required: true },
  loading:    { type: Boolean, required: true },
  isFiltered: { type: Boolean, default: false },
})
defineEmits(['edit', 'request-delete'])
</script>

<style scoped>
.state-box  { text-align: center; padding: 4rem 1rem; color: #64748b; }
.state-icon  { font-size: 3rem; margin-bottom: .75rem; }
.state-title { font-size: 1.1rem; font-weight: 700; color: #1e293b; margin-bottom: .3rem; }
.state-desc  { font-size: .9rem; }

.task-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(285px, 1fr));
  gap: 1.2rem;
}
</style>
