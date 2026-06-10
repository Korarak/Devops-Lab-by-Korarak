<template>
  <header class="app-header">
    <div class="logo">
      <span class="logo-icon">📋</span>
      <div>
        <div class="logo-name">TaskFlow</div>
        <div class="logo-sub">ระบบจัดการงาน</div>
      </div>
    </div>
    <button class="btn-add" @click="$emit('add')">+ เพิ่มงาน</button>
  </header>
</template>

<script setup>
defineEmits(['add'])
</script>

<style scoped>
.app-header {
  position: sticky; top: 0; z-index: 100;
  background: #fff; border-bottom: 1px solid #e2e8f0;
  height: 62px; padding: 0 1.5rem;
  display: flex; align-items: center; gap: .85rem;
  box-shadow: 0 1px 6px rgba(0,0,0,.07);
}
.logo { display: flex; align-items: center; gap: .6rem; }
.logo-icon { font-size: 1.6rem; }
.logo-name { font-weight: 800; font-size: 1.15rem; color: #5b21b6; line-height: 1; }
.logo-sub  { font-size: .72rem; color: #64748b; }
.btn-add {
  margin-left: auto;
  background: #7c3aed; color: #fff;
  border: none; border-radius: 8px;
  padding: .55rem 1.2rem; font-size: .9rem; font-weight: 700;
  font-family: inherit; cursor: pointer; transition: background .2s;
}
.btn-add:hover { background: #6d28d9; }
</style>
