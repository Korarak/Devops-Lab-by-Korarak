<template>
  <div>
    <div class="stats-grid">
      <!-- งานทั้งหมด -->
      <div class="stat-card">
        <div class="stat-icon si-purple">📋</div>
        <div class="stat-body">
          <div class="stat-val" style="color:#7c3aed">{{ stats.total }}</div>
          <div class="stat-label">งานทั้งหมด</div>
        </div>
      </div>

      <!-- รอดำเนินการ -->
      <div class="stat-card">
        <div class="stat-icon si-amber">📌</div>
        <div class="stat-body">
          <div class="stat-val" style="color:#d97706">{{ stats.todo }}</div>
          <div class="stat-label">รอดำเนินการ</div>
        </div>
      </div>

      <!-- กำลังทำ -->
      <div class="stat-card">
        <div class="stat-icon si-blue">⚡</div>
        <div class="stat-body">
          <div class="stat-val" style="color:#2563eb">{{ stats.in_progress }}</div>
          <div class="stat-label">กำลังทำ</div>
        </div>
      </div>

      <!-- เสร็จสิ้น -->
      <div class="stat-card">
        <div class="stat-icon si-green">✅</div>
        <div class="stat-body">
          <div class="stat-val" style="color:#059669">{{ stats.done }}</div>
          <div class="stat-label">เสร็จสิ้น</div>
        </div>
      </div>
    </div>

    <!-- Overdue warning -->
    <div class="overdue-warning" v-if="stats.overdue > 0">
      ⚠️ เกินกำหนด <strong>{{ stats.overdue }} งาน</strong>
    </div>
  </div>
</template>

<script setup>
defineProps({ stats: { type: Object, required: true } })
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem; margin-bottom: .75rem;
}
.stat-card {
  background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;
  padding: 1.1rem; display: flex; align-items: center; gap: .9rem;
}
.stat-icon {
  width: 46px; height: 46px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.3rem; flex-shrink: 0;
}
.si-purple { background: #ede9fe; }
.si-amber  { background: #fef3c7; }
.si-blue   { background: #dbeafe; }
.si-green  { background: #d1fae5; }
.stat-val   { font-size: 1.65rem; font-weight: 800; line-height: 1; }
.stat-label { font-size: .8rem; color: #64748b; margin-top: .2rem; }
.overdue-warning {
  display: inline-block;
  background: #fef2f2; border: 1px solid #fca5a5;
  border-radius: 8px; padding: .4rem .9rem;
  font-size: .85rem; color: #991b1b;
  margin-bottom: 1.25rem;
}
</style>
