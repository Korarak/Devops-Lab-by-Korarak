<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-title">
        {{ editingId ? '✏️ แก้ไขงาน' : '📋 เพิ่มงานใหม่' }}
      </div>
      <form @submit.prevent="onSubmit">

        <!-- Title -->
        <div class="form-group">
          <label class="form-label">ชื่องาน *</label>
          <input
            class="form-input"
            v-model="localForm.title"
            placeholder="เช่น ออกแบบ UI สำหรับ Dashboard"
            required
          />
        </div>

        <!-- Status & Priority -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Status</label>
            <select class="form-input" v-model="localForm.status">
              <option value="todo">รอดำเนินการ</option>
              <option value="in-progress">กำลังทำ</option>
              <option value="done">เสร็จสิ้น</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Priority</label>
            <select class="form-input" v-model="localForm.priority">
              <option value="low">ต่ำ</option>
              <option value="medium">ปานกลาง</option>
              <option value="high">สูง</option>
            </select>
          </div>
        </div>

        <!-- Assignee & Due Date -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">ผู้รับผิดชอบ</label>
            <input
              class="form-input"
              v-model="localForm.assignee"
              placeholder="เช่น สมชาย"
            />
          </div>
          <div class="form-group">
            <label class="form-label">วันกำหนดส่ง</label>
            <input
              class="form-input"
              type="date"
              v-model="localForm.due_date"
            />
          </div>
        </div>

        <!-- Description -->
        <div class="form-group">
          <label class="form-label">คำอธิบาย</label>
          <textarea
            class="form-input"
            v-model="localForm.description"
            rows="3"
            placeholder="รายละเอียดเพิ่มเติม (ถ้ามี)"
            style="resize:vertical"
          ></textarea>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-cancel" @click="$emit('close')">ยกเลิก</button>
          <button type="submit" class="btn-save">
            {{ editingId ? 'บันทึกการเปลี่ยนแปลง' : 'เพิ่มงาน' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const props = defineProps({
  editingId:   { default: null },
  initialForm: { type: Object, required: true },
})
const emit = defineEmits(['save', 'close'])

// สร้าง copy ของ form ไว้ใช้ใน modal นี้
const localForm = reactive({ ...props.initialForm })

function onSubmit() {
  emit('save', { ...localForm })
}
</script>

<style scoped>
.overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.45);
  display: flex; align-items: center; justify-content: center;
  z-index: 500; padding: 1rem;
}
.modal {
  background: #fff; border-radius: 16px;
  width: 100%; max-width: 520px;
  max-height: 90vh; overflow-y: auto; padding: 2rem;
}
.modal-title { font-size: 1.2rem; font-weight: 700; margin-bottom: 1.5rem; color: #1e293b; }

.form-group { margin-bottom: 1rem; }
.form-label { display: block; font-size: .87rem; font-weight: 600; margin-bottom: .35rem; }
.form-input {
  width: 100%; padding: .6rem .85rem;
  border: 1.5px solid #e2e8f0; border-radius: 8px;
  font-size: .95rem; font-family: inherit; outline: none; transition: border-color .2s;
}
.form-input:focus { border-color: #7c3aed; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }

.modal-footer {
  display: flex; gap: .75rem; justify-content: flex-end;
  padding-top: 1rem; border-top: 1px solid #f1f5f9; margin-top: 1rem;
}
.btn-cancel {
  background: #f1f5f9; color: #334155;
  border: none; border-radius: 8px; padding: .6rem 1.25rem;
  font-weight: 600; font-family: inherit; cursor: pointer;
}
.btn-cancel:hover { background: #e2e8f0; }
.btn-save {
  background: #7c3aed; color: #fff;
  border: none; border-radius: 8px; padding: .6rem 1.25rem;
  font-weight: 700; font-family: inherit; cursor: pointer;
}
.btn-save:hover { background: #6d28d9; }

@media (max-width: 640px) { .form-row { grid-template-columns: 1fr; } }
</style>
