import { ref, computed, watch } from 'vue'

export function useProducts() {

  // ── State ────────────────────────────────────────────────────────
  const products      = ref([])        // รายการสินค้าจาก API
  const loading       = ref(true)      // กำลังโหลดอยู่หรือไม่
  const search        = ref('')        // ข้อความค้นหา
  const catFilter     = ref('')        // category ที่เลือก
  const showModal     = ref(false)     // แสดง/ซ่อน modal เพิ่ม/แก้ไข
  const editingId     = ref(null)      // null = Add, มีค่า = Edit
  const confirmDelete = ref(null)      // product ที่กำลังจะลบ

  const emptyForm = () => ({ name: '', category: '', price: '', stock: 0, description: '' })
  const form = ref(emptyForm())        // ข้อมูลที่ส่งให้ ProductModal

  // ── Computed ─────────────────────────────────────────────────────
  const filtered = computed(() => {
    const s = search.value.toLowerCase()
    return products.value.filter(p => {
      const matchS = !s || p.name.toLowerCase().includes(s) || (p.description || '').toLowerCase().includes(s)
      const matchC = !catFilter.value || p.category === catFilter.value
      return matchS && matchC
    })
  })

  const categories = computed(() =>
    [...new Set(products.value.map(p => p.category))].sort()
  )

  const stats = computed(() => ({
    total:      products.value.length,
    lowStock:   products.value.filter(p => p.stock < 10).length,
    totalItems: products.value.reduce((s, p) => s + p.stock, 0),
    totalValue: products.value.reduce((s, p) => s + parseFloat(p.price) * p.stock, 0)
  }))

  // ── API Methods ───────────────────────────────────────────────────
  async function fetchProducts() {
    loading.value = true
    const q = new URLSearchParams()
    if (search.value)    q.set('search',   search.value)
    if (catFilter.value) q.set('category', catFilter.value)
    try {
      const res = await fetch(`/api/products?${q}`)
      products.value = await res.json()
    } catch {
      products.value = []
    } finally {
      loading.value = false
    }
  }

  function openAdd() {
    editingId.value = null
    form.value = emptyForm()
    showModal.value = true
  }

  function openEdit(p) {
    editingId.value = p.id
    form.value = { name: p.name, category: p.category, price: p.price, stock: p.stock, description: p.description || '' }
    showModal.value = true
  }

  async function saveProduct(formData) {
    const body = {
      name:        formData.name,
      category:    formData.category,
      price:       parseFloat(formData.price),
      stock:       parseInt(formData.stock),
      description: formData.description
    }
    const url    = editingId.value ? `/api/products/${editingId.value}` : '/api/products'
    const method = editingId.value ? 'PUT' : 'POST'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    showModal.value = false
    fetchProducts()
  }

  async function deleteProduct(id) {
    await fetch(`/api/products/${id}`, { method: 'DELETE' })
    confirmDelete.value = null
    fetchProducts()
  }

  // ── Watchers ──────────────────────────────────────────────────────
  let debounceTimer = null
  watch(search, () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(fetchProducts, 280)
  })

  watch(catFilter, fetchProducts)

  return {
    products, loading, search, catFilter, showModal, editingId, confirmDelete, form,
    filtered, categories, stats,
    fetchProducts, openAdd, openEdit, saveProduct, deleteProduct
  }
}
