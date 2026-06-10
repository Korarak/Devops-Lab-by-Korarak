<template>
  <div
    class="product-card"
    :class="{ 'card-low': product.stock > 0 && product.stock < 10, 'card-out': product.stock <= 0 }"
  >
    <div class="card-top">
      <span class="cat-badge" :class="catClass(product.category)">{{ product.category }}</span>
      <div class="product-name">{{ product.name }}</div>
      <div class="product-desc" v-if="product.description">{{ product.description }}</div>
      <div class="product-price">
        ฿{{ parseFloat(product.price).toLocaleString('th-TH', { minimumFractionDigits: 2 }) }}
      </div>

      <div class="stock-info">
        <div class="stock-row">
          <span class="stock-label">สต็อก</span>
          <span class="stock-num" :class="stockClass(product.stock)">
            {{ product.stock.toLocaleString() }} ชิ้น
            <span v-if="product.stock <= 0"> — หมดแล้ว!</span>
            <span v-else-if="product.stock < 10"> — ใกล้หมด!</span>
          </span>
        </div>
        <div class="stock-track">
          <div
            class="stock-fill"
            :class="stockClass(product.stock)"
            :style="{ width: Math.min((product.stock / 80) * 100, 100) + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <div class="card-footer">
      <button class="btn-edit" @click="$emit('edit', product)">✏️ แก้ไข</button>
      <button class="btn-del"  @click="$emit('delete', product)">🗑️ ลบ</button>
    </div>
  </div>
</template>

<script setup>
defineProps({ product: { type: Object, required: true } })
defineEmits(['edit', 'delete'])

function stockClass(s) {
  if (s <= 0) return 'out'
  if (s < 10) return 'low'
  if (s < 30) return 'mid'
  return 'high'
}

function catClass(cat) {
  const m = {
    Electronics: 'c-elec', Clothing: 'c-cloth',
    Footwear:    'c-foot',  Food:     'c-food',
    Sports:      'c-sport', Books:    'c-book',
    Furniture:   'c-furn',  Bags:     'c-bag',
    Accessories: 'c-acc',   Tools:    'c-tool'
  }
  return m[cat] || 'c-other'
}
</script>

<style scoped>
.product-card {
  background: #fff; border: 1px solid #e2e8f0; border-radius: 14px;
  overflow: hidden; transition: transform .2s, box-shadow .2s;
}
.product-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,.1); }
.product-card.card-low { border-color: #fca5a5; }
.product-card.card-out { border-color: #d1d5db; opacity: .7; }

.card-top { padding: 1.1rem; }
.cat-badge {
  display: inline-block; padding: .2rem .65rem;
  border-radius: 20px; font-size: .72rem; font-weight: 700; margin-bottom: .6rem;
}
.c-elec  { background: #dbeafe; color: #1e40af; }
.c-cloth { background: #fce7f3; color: #9d174d; }
.c-foot  { background: #f3e8ff; color: #6b21a8; }
.c-food  { background: #fef3c7; color: #92400e; }
.c-sport { background: #d1fae5; color: #065f46; }
.c-book  { background: #e0f2fe; color: #0369a1; }
.c-furn  { background: #fdf4ff; color: #7e22ce; }
.c-bag   { background: #fff7ed; color: #9a3412; }
.c-acc   { background: #f0fdf4; color: #15803d; }
.c-tool  { background: #f1f5f9; color: #475569; }
.c-other { background: #ede9fe; color: #5b21b6; }

.product-name  { font-size: 1rem; font-weight: 700; color: #1e293b; margin-bottom: .3rem; line-height: 1.35; }
.product-desc  { font-size: .82rem; color: #64748b; line-height: 1.5; margin-bottom: .75rem; }
.product-price { font-size: 1.25rem; font-weight: 800; color: #059669; }

.stock-info { margin-top: .85rem; }
.stock-row  { display: flex; justify-content: space-between; font-size: .82rem; margin-bottom: .3rem; }
.stock-label { color: #64748b; }
.stock-num   { font-weight: 700; }
.stock-num.out  { color: #9ca3af; }
.stock-num.low  { color: #dc2626; }
.stock-num.mid  { color: #d97706; }
.stock-num.high { color: #059669; }
.stock-track { height: 6px; background: #f1f5f9; border-radius: 3px; overflow: hidden; }
.stock-fill  { height: 100%; border-radius: 3px; transition: width .4s ease; min-width: 4px; }
.stock-fill.out  { background: #d1d5db; width: 2% !important; }
.stock-fill.low  { background: #dc2626; }
.stock-fill.mid  { background: #f59e0b; }
.stock-fill.high { background: #10b981; }

.card-footer {
  display: flex; gap: .5rem;
  padding: .75rem 1.1rem;
  border-top: 1px solid #f1f5f9; background: #fafafa;
}
.btn-edit, .btn-del {
  flex: 1; padding: .45rem; border-radius: 7px;
  font-size: .82rem; font-weight: 600; cursor: pointer; border: none; transition: all .2s;
}
.btn-edit { background: #f1f5f9; color: #334155; }
.btn-edit:hover { background: #e2e8f0; }
.btn-del  { background: #fee2e2; color: #dc2626; }
.btn-del:hover  { background: #fecaca; }
</style>
