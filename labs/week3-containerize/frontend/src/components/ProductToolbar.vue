<template>
  <div class="toolbar">
    <input
      :value="search"
      @input="$emit('update:search', $event.target.value)"
      class="input-search"
      placeholder="🔍 ค้นหาชื่อสินค้า หรือคำอธิบาย..."
    />
    <select
      :value="catFilter"
      @change="$emit('update:catFilter', $event.target.value)"
      class="input-select"
    >
      <option value="">ทุกหมวดหมู่</option>
      <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
    </select>
    <span class="result-count" v-if="!loading">
      แสดง {{ filteredCount }} / {{ totalCount }} รายการ
    </span>
  </div>
</template>

<script setup>
defineProps({
  search:        { type: String,  required: true },
  catFilter:     { type: String,  required: true },
  categories:    { type: Array,   required: true },
  loading:       { type: Boolean, required: true },
  filteredCount: { type: Number,  required: true },
  totalCount:    { type: Number,  required: true },
})
defineEmits(['update:search', 'update:catFilter'])
</script>

<style scoped>
.toolbar { display: flex; gap: .75rem; margin-bottom: 1.5rem; flex-wrap: wrap; align-items: center; }
.input-search {
  flex: 1; min-width: 200px;
  padding: .6rem 1rem; border: 1.5px solid #e2e8f0; border-radius: 8px;
  font-size: .95rem; font-family: inherit; outline: none; transition: border-color .2s;
}
.input-search:focus { border-color: #10b981; }
.input-select {
  padding: .6rem .9rem; border: 1.5px solid #e2e8f0; border-radius: 8px;
  background: #fff; font-size: .9rem; font-family: inherit; outline: none; cursor: pointer;
}
.input-select:focus { border-color: #10b981; }
.result-count { font-size: .82rem; color: #64748b; white-space: nowrap; }
</style>
