<template>
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-icon si-green">📦</div>
      <div class="stat-body">
        <div class="stat-val" style="color:#059669">{{ stats.total }}</div>
        <div class="stat-label">สินค้าทั้งหมด</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon si-red">⚠️</div>
      <div class="stat-body">
        <div class="stat-val" style="color:#dc2626">{{ stats.lowStock }}</div>
        <div class="stat-label">สต็อกใกล้หมด (&lt;10)</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon si-amber">📊</div>
      <div class="stat-body">
        <div class="stat-val" style="color:#d97706">{{ stats.totalItems.toLocaleString() }}</div>
        <div class="stat-label">จำนวนสต็อกรวม</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon si-blue">💰</div>
      <div class="stat-body">
        <div class="stat-val" style="color:#2563eb;font-size:1.3rem">
          ฿{{ Math.round(stats.totalValue).toLocaleString() }}
        </div>
        <div class="stat-label">มูลค่าสต็อกรวม</div>
      </div>
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
  gap: 1rem; margin-bottom: 1.5rem;
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
.si-green { background: #d1fae5; }
.si-red   { background: #fee2e2; }
.si-amber { background: #fef3c7; }
.si-blue  { background: #dbeafe; }
.stat-val   { font-size: 1.65rem; font-weight: 800; line-height: 1; }
.stat-label { font-size: .8rem; color: #64748b; margin-top: .2rem; }
</style>
