<template>
  <div class="overlay" @click.self="$emit('cancel')">
    <div class="modal confirm">
      <div class="confirm-icon">🗑️</div>
      <div class="confirm-title">ยืนยันการลบงาน</div>
      <div class="confirm-desc">
        คุณต้องการลบงาน <strong>{{ task.title }}</strong> ออกจากระบบหรือไม่?<br>
        <span style="color:#dc2626">การกระทำนี้ไม่สามารถย้อนกลับได้</span>
      </div>
      <div class="confirm-actions">
        <button class="btn-cancel" @click="$emit('cancel')">ยกเลิก</button>
        <button class="btn-danger" @click="$emit('confirm')">ลบเลย</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ task: { type: Object, required: true } })
defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.45);
  display: flex; align-items: center; justify-content: center;
  z-index: 500; padding: 1rem;
}
.modal.confirm {
  background: #fff; border-radius: 16px;
  width: 100%; max-width: 380px; padding: 2rem;
  text-align: center;
}
.confirm-icon    { font-size: 3rem; margin-bottom: 1rem; }
.confirm-title   { font-size: 1.1rem; font-weight: 700; margin-bottom: .5rem; }
.confirm-desc    { font-size: .9rem; color: #64748b; margin-bottom: 1.5rem; line-height: 1.6; }
.confirm-actions { display: flex; gap: .75rem; justify-content: center; }
.btn-cancel {
  background: #f1f5f9; color: #334155;
  border: none; border-radius: 8px; padding: .6rem 1.25rem;
  font-weight: 600; font-family: inherit; cursor: pointer;
}
.btn-cancel:hover { background: #e2e8f0; }
.btn-danger {
  background: #dc2626; color: #fff;
  border: none; border-radius: 8px; padding: .6rem 1.4rem;
  font-weight: 700; font-family: inherit; cursor: pointer;
}
.btn-danger:hover { background: #b91c1c; }
</style>
