<template>
  <div
    class="task-card"
    :class="[priorityBorderClass(task.priority), { 'card-done': task.status === 'done' }]"
  >
    <div class="card-top">
      <!-- Status & Priority badges -->
      <div class="badge-row">
        <span class="badge" :class="statusClass(task.status)">{{ statusLabel(task.status) }}</span>
        <span class="badge" :class="priorityClass(task.priority)">{{ priorityLabel(task.priority) }}</span>
      </div>

      <!-- Title -->
      <div class="task-title">{{ task.title }}</div>

      <!-- Description -->
      <div class="task-desc" v-if="task.description">{{ task.description }}</div>

      <!-- Meta info -->
      <div class="task-meta">
        <span class="meta-item" v-if="task.assignee">👤 {{ task.assignee }}</span>
        <span
          class="meta-item"
          :class="{ 'overdue-text': isOverdue(task) }"
          v-if="task.due_date"
        >📅 {{ formatDate(task.due_date) }}</span>
      </div>
    </div>

    <div class="card-footer">
      <button class="btn-edit" @click="$emit('edit', task)">✏️ แก้ไข</button>
      <button class="btn-del"  @click="$emit('delete', task)">🗑️ ลบ</button>
    </div>
  </div>
</template>

<script setup>
defineProps({ task: { type: Object, required: true } })
defineEmits(['edit', 'delete'])

function statusClass(s)   { return { 'todo': 's-todo', 'in-progress': 's-prog', 'done': 's-done' }[s] || 's-todo' }
function statusLabel(s)   { return { 'todo': 'รอดำเนินการ', 'in-progress': 'กำลังทำ', 'done': 'เสร็จสิ้น' }[s] || s }
function priorityClass(p) { return { 'low': 'p-low', 'medium': 'p-med', 'high': 'p-high' }[p] || 'p-med' }
function priorityLabel(p) { return { 'low': 'ต่ำ', 'medium': 'ปานกลาง', 'high': 'สูง' }[p] || p }
function priorityBorderClass(p) { return { 'low': 'border-low', 'medium': 'border-med', 'high': 'border-high' }[p] || 'border-med' }
function isOverdue(t)     { return t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done' }
function formatDate(d)    {
  if (!d) return ''
  return new Date(d).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.task-card {
  background: #fff; border: 1px solid #e2e8f0; border-radius: 14px;
  border-left-width: 4px; overflow: hidden; transition: transform .2s, box-shadow .2s;
}
.task-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,.1); }
.task-card.card-done { opacity: .7; }

/* Priority left-border colors */
.border-low  { border-left-color: #9ca3af; }
.border-med  { border-left-color: #2563eb; }
.border-high { border-left-color: #dc2626; }

.card-top { padding: 1.1rem; }

.badge-row { display: flex; gap: .5rem; margin-bottom: .6rem; flex-wrap: wrap; }
.badge {
  display: inline-block; padding: .2rem .65rem;
  border-radius: 20px; font-size: .72rem; font-weight: 700;
}

/* Status badges */
.s-todo { background: #fef3c7; color: #92400e; }
.s-prog { background: #dbeafe; color: #1e40af; }
.s-done { background: #d1fae5; color: #065f46; }

/* Priority badges */
.p-low  { background: #f1f5f9; color: #475569; }
.p-med  { background: #ede9fe; color: #5b21b6; }
.p-high { background: #fee2e2; color: #991b1b; }

.task-title { font-size: 1rem; font-weight: 700; color: #1e293b; margin-bottom: .3rem; line-height: 1.35; }
.task-desc  { font-size: .82rem; color: #64748b; line-height: 1.5; margin-bottom: .6rem; }

.task-meta  { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: .5rem; }
.meta-item  { font-size: .82rem; color: #64748b; }
.overdue-text { color: #dc2626; font-weight: 600; }

.card-footer {
  display: flex; gap: .5rem;
  padding: .75rem 1.1rem;
  border-top: 1px solid #f1f5f9; background: #fafafa;
}
.btn-edit, .btn-del {
  flex: 1; padding: .45rem; border-radius: 7px;
  font-size: .82rem; font-weight: 600; cursor: pointer;
  border: none; font-family: inherit; transition: all .2s;
}
.btn-edit { background: #f1f5f9; color: #334155; }
.btn-edit:hover { background: #e2e8f0; }
.btn-del  { background: #fee2e2; color: #dc2626; }
.btn-del:hover  { background: #fecaca; }
</style>
