<template>
  <div class="toolbar">
    <input
      :value="search"
      @input="$emit('update:search', $event.target.value)"
      class="input-search"
      placeholder="🔍 ค้นหาชื่องาน หรือคำอธิบาย..."
    />

    <select
      :value="statusFilter"
      @change="$emit('update:statusFilter', $event.target.value)"
      class="input-select"
    >
      <option value="">ทุก Status</option>
      <option value="todo">รอดำเนินการ</option>
      <option value="in-progress">กำลังทำ</option>
      <option value="done">เสร็จสิ้น</option>
    </select>

    <select
      :value="priorityFilter"
      @change="$emit('update:priorityFilter', $event.target.value)"
      class="input-select"
    >
      <option value="">ทุก Priority</option>
      <option value="low">ต่ำ</option>
      <option value="medium">ปานกลาง</option>
      <option value="high">สูง</option>
    </select>

    <span class="result-count" v-if="!loading">
      แสดง {{ filteredCount }} / {{ totalCount }} รายการ
    </span>
  </div>
</template>

<script setup>
defineProps({
  search:         { type: String,  required: true },
  statusFilter:   { type: String,  required: true },
  priorityFilter: { type: String,  required: true },
  loading:        { type: Boolean, required: true },
  filteredCount:  { type: Number,  required: true },
  totalCount:     { type: Number,  required: true },
})
defineEmits(['update:search', 'update:statusFilter', 'update:priorityFilter'])
</script>

<style scoped>
.toolbar { display: flex; gap: .75rem; margin-bottom: 1.5rem; flex-wrap: wrap; align-items: center; }
.input-search {
  flex: 1; min-width: 200px;
  padding: .6rem 1rem; border: 1.5px solid #e2e8f0; border-radius: 8px;
  font-size: .95rem; font-family: inherit; outline: none; transition: border-color .2s;
}
.input-search:focus { border-color: #7c3aed; }
.input-select {
  padding: .6rem .9rem; border: 1.5px solid #e2e8f0; border-radius: 8px;
  background: #fff; font-size: .9rem; font-family: inherit; outline: none; cursor: pointer;
  transition: border-color .2s;
}
.input-select:focus { border-color: #7c3aed; }
.result-count { font-size: .82rem; color: #64748b; white-space: nowrap; }
</style>
