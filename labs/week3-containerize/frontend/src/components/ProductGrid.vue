<template>

  <!-- กำลังโหลด -->
  <div class="state-box" v-if="loading">
    <div class="state-icon">⏳</div>
    <div>กำลังโหลดข้อมูลสินค้า...</div>
  </div>

  <!-- ไม่พบสินค้า -->
  <div class="state-box" v-else-if="products.length === 0">
    <div class="state-icon">📭</div>
    <div class="state-title">ไม่พบสินค้า</div>
    <div class="state-desc">
      {{ isFiltered ? 'ลองเปลี่ยน keyword หรือ filter' : 'กดปุ่ม "+ เพิ่มสินค้า" เพื่อเริ่มต้น' }}
    </div>
  </div>

  <!-- grid สินค้า -->
  <div class="product-grid" v-else>
    <ProductCard
      v-for="p in products"
      :key="p.id"
      :product="p"
      @edit="$emit('edit', p)"
      @delete="$emit('request-delete', p)"
    />
  </div>

</template>

<script setup>
import ProductCard from './ProductCard.vue'

defineProps({
  products:   { type: Array,   required: true },
  loading:    { type: Boolean, required: true },
  isFiltered: { type: Boolean, default: false },
})
defineEmits(['edit', 'request-delete'])
</script>

<style scoped>
.state-box { text-align: center; padding: 4rem 1rem; color: #64748b; }
.state-icon  { font-size: 3rem; margin-bottom: .75rem; }
.state-title { font-size: 1.1rem; font-weight: 700; color: #1e293b; margin-bottom: .3rem; }
.state-desc  { font-size: .9rem; }

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(275px, 1fr));
  gap: 1.2rem;
}
</style>
