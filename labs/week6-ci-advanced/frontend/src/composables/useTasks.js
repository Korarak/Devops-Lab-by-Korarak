import { ref, computed, watch } from 'vue'

export function useTasks() {

  // ── State ────────────────────────────────────────────────────────
  const tasks         = ref([])         // รายการงานจาก API
  const loading       = ref(true)       // กำลังโหลดอยู่หรือไม่
  const search        = ref('')         // ข้อความค้นหา
  const statusFilter  = ref('')         // status ที่เลือก
  const priorityFilter = ref('')        // priority ที่เลือก
  const showModal     = ref(false)      // แสดง/ซ่อน modal เพิ่ม/แก้ไข
  const editingId     = ref(null)       // null = Add, มีค่า = Edit
  const confirmDelete = ref(null)       // task ที่กำลังจะลบ

  // ค่าเริ่มต้นของฟอร์ม
  const emptyForm = () => ({
    title:       '',
    status:      'todo',
    priority:    'medium',
    assignee:    '',
    due_date:    '',
    description: '',
  })

  const form = ref(emptyForm())         // ข้อมูลที่ส่งให้ TaskModal

  // ── Helpers ───────────────────────────────────────────────────────
  const isOverdue = (t) =>
    t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done'

  // ── Computed ─────────────────────────────────────────────────────
  const filtered = computed(() => {
    const s = search.value.toLowerCase()
    return tasks.value.filter(t => {
      const matchS = !s || t.title.toLowerCase().includes(s) || (t.description || '').toLowerCase().includes(s)
      const matchStatus   = !statusFilter.value   || t.status   === statusFilter.value
      const matchPriority = !priorityFilter.value || t.priority === priorityFilter.value
      return matchS && matchStatus && matchPriority
    })
  })

  const stats = computed(() => ({
    total:       tasks.value.length,
    todo:        tasks.value.filter(t => t.status === 'todo').length,
    in_progress: tasks.value.filter(t => t.status === 'in-progress').length,
    done:        tasks.value.filter(t => t.status === 'done').length,
    overdue:     tasks.value.filter(t => isOverdue(t)).length,
  }))

  // ── API Methods ───────────────────────────────────────────────────
  async function fetchTasks() {
    loading.value = true
    const q = new URLSearchParams()
    if (search.value)         q.set('search',   search.value)
    if (statusFilter.value)   q.set('status',   statusFilter.value)
    if (priorityFilter.value) q.set('priority', priorityFilter.value)
    try {
      const res = await fetch(`/api/tasks?${q}`)
      tasks.value = await res.json()
    } catch {
      tasks.value = []
    } finally {
      loading.value = false
    }
  }

  function openAdd() {
    editingId.value = null
    form.value = emptyForm()
    showModal.value = true
  }

  function openEdit(t) {
    editingId.value = t.id
    form.value = {
      title:       t.title,
      status:      t.status,
      priority:    t.priority,
      assignee:    t.assignee    || '',
      due_date:    t.due_date    ? t.due_date.slice(0, 10) : '',
      description: t.description || '',
    }
    showModal.value = true
  }

  async function saveTask(formData) {
    const body = {
      title:       formData.title,
      status:      formData.status,
      priority:    formData.priority,
      assignee:    formData.assignee,
      due_date:    formData.due_date || null,
      description: formData.description,
    }
    const url    = editingId.value ? `/api/tasks/${editingId.value}` : '/api/tasks'
    const method = editingId.value ? 'PUT' : 'POST'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    showModal.value = false
    fetchTasks()
  }

  async function deleteTask(id) {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    confirmDelete.value = null
    fetchTasks()
  }

  // ── Watchers ──────────────────────────────────────────────────────
  // search: รอ 280ms หลังพิมพ์หยุดแล้วค่อย fetch (debounce)
  let debounceTimer = null
  watch(search, () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(fetchTasks, 280)
  })

  // statusFilter / priorityFilter: fetch ทันทีเมื่อเปลี่ยน
  watch(statusFilter,   fetchTasks)
  watch(priorityFilter, fetchTasks)

  return {
    tasks, loading, search, statusFilter, priorityFilter,
    showModal, editingId, confirmDelete, form,
    filtered, stats,
    fetchTasks, openAdd, openEdit, saveTask, deleteTask,
  }
}
