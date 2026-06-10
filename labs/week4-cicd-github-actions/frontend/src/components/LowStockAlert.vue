<template>
  <div class="alert-low" v-if="count > 0">
    🚨 มีสินค้า <strong>{{ count }} รายการ</strong>
    ที่มีจำนวนสต็อกน้อยกว่า 10 ชิ้น — กรุณาตรวจสอบและเติมสต็อก
  </div>
</template>

<script setup>
defineProps({ count: { type: Number, required: true } })
</script>

<style scoped>
.alert-low {
  background: #fef2f2; border: 1px solid #fca5a5;
  border-radius: 10px; padding: .85rem 1.2rem;
  font-size: .92rem; margin-bottom: 1.5rem; color: #991b1b;
}
</style>
