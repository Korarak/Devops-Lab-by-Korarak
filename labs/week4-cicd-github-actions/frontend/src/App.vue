<template>
  <div>
    <AppHeader @add="openAdd" />

    <main class="main">
      <StatsGrid     :stats="stats" />
      <LowStockAlert :count="stats.lowStock" />
      <ProductToolbar
        v-model:search="search"
        v-model:catFilter="catFilter"
        :categories="categories"
        :loading="loading"
        :filtered-count="filtered.length"
        :total-count="products.length"
      />
      <ProductGrid
        :products="filtered"
        :loading="loading"
        :is-filtered="!!(search || catFilter)"
        @edit="openEdit"
        @request-delete="p => (confirmDelete = p)"
      />
    </main>

    <ProductModal
      v-if="showModal"
      :editing-id="editingId"
      :initial-form="form"
      :categories="categories"
      @save="saveProduct"
      @close="showModal = false"
    />
    <DeleteConfirm
      v-if="confirmDelete"
      :product="confirmDelete"
      @confirm="deleteProduct(confirmDelete.id)"
      @cancel="confirmDelete = null"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProducts }   from './composables/useProducts.js'
import AppHeader         from './components/AppHeader.vue'
import StatsGrid         from './components/StatsGrid.vue'
import LowStockAlert     from './components/LowStockAlert.vue'
import ProductToolbar    from './components/ProductToolbar.vue'
import ProductGrid       from './components/ProductGrid.vue'
import ProductModal      from './components/ProductModal.vue'
import DeleteConfirm     from './components/DeleteConfirm.vue'

const {
  products, loading, search, catFilter, showModal, editingId, confirmDelete, form,
  filtered, categories, stats,
  fetchProducts, openAdd, openEdit, saveProduct, deleteProduct
} = useProducts()

onMounted(fetchProducts)
</script>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: 'Sarabun', sans-serif;
  background: #f0fdf4;
  color: #1e293b;
  line-height: 1.75;
  font-size: 16px;
}
</style>

<style scoped>
.main { max-width: 1280px; margin: 0 auto; padding: 1.75rem 1.5rem; }
</style>
