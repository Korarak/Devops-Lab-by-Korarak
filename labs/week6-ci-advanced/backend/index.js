const express = require('express');
const cors    = require('cors');
const pool    = require('./db');
require('dotenv').config();

const app      = express();
const PORT     = process.env.PORT || 3001;
const START_AT = Date.now();

app.use(cors());
app.use(express.json());

// ── Health Check (ไม่ query DB เพื่อให้ test ได้ง่าย) ─────────────
app.get('/health', (req, res) => {
  res.json({
    status:    'ok',
    service:   'TaskFlow API',
    version:   process.env.APP_VERSION || '1.0.0',
    uptime:    Math.floor((Date.now() - START_AT) / 1000),
    timestamp: new Date(),
  });
});

// ── GET /api/stats (สรุปข้อมูล Dashboard) ─────────────────────────
app.get('/api/stats', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        COUNT(*)                                                       AS total,
        COUNT(*) FILTER (WHERE status = 'todo')                        AS todo,
        COUNT(*) FILTER (WHERE status = 'in-progress')                 AS in_progress,
        COUNT(*) FILTER (WHERE status = 'done')                        AS done,
        COUNT(*) FILTER (WHERE due_date < NOW() AND status != 'done')  AS overdue,
        COUNT(*) FILTER (WHERE priority = 'high' AND status != 'done') AS high_priority
      FROM tasks
    `);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/tasks?search=&status=&priority= ───────────────────────
app.get('/api/tasks', async (req, res) => {
  try {
    const { search = '', status = '', priority = '' } = req.query;
    const params = [];
    let where = 'WHERE 1=1';

    if (search) {
      params.push(`%${search}%`);
      where += ` AND (title ILIKE $${params.length} OR description ILIKE $${params.length})`;
    }
    if (status) {
      params.push(status);
      where += ` AND status = $${params.length}`;
    }
    if (priority) {
      params.push(priority);
      where += ` AND priority = $${params.length}`;
    }

    const { rows } = await pool.query(
      `SELECT * FROM tasks ${where} ORDER BY created_at DESC`,
      params
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/tasks/:id ─────────────────────────────────────────────
app.get('/api/tasks/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM tasks WHERE id = $1', [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'ไม่พบงาน' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/tasks ────────────────────────────────────────────────
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, status = 'todo', priority = 'medium', assignee = '', due_date = null, description = '' } = req.body;

    if (!title || !title.toString().trim()) {
      return res.status(400).json({ error: 'กรุณาระบุ title' });
    }

    const validStatuses  = ['todo', 'in-progress', 'done'];
    const validPriorities = ['low', 'medium', 'high'];

    if (req.body.status !== undefined && !validStatuses.includes(status)) {
      return res.status(400).json({ error: `status ต้องเป็น ${validStatuses.join(', ')}` });
    }
    if (req.body.priority !== undefined && !validPriorities.includes(priority)) {
      return res.status(400).json({ error: `priority ต้องเป็น ${validPriorities.join(', ')}` });
    }

    const { rows } = await pool.query(
      `INSERT INTO tasks (title, status, priority, assignee, due_date, description)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title.toString().trim(), status, priority, assignee, due_date || null, description]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PUT /api/tasks/:id ─────────────────────────────────────────────
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { title, status, priority, assignee = '', due_date = null, description = '' } = req.body;
    const { rows } = await pool.query(
      `UPDATE tasks
       SET title=$1, status=$2, priority=$3, assignee=$4, due_date=$5, description=$6, updated_at=NOW()
       WHERE id=$7 RETURNING *`,
      [title, status, priority, assignee, due_date || null, description, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'ไม่พบงาน' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /api/tasks/:id ──────────────────────────────────────────
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'DELETE FROM tasks WHERE id=$1 RETURNING *', [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'ไม่พบงาน' });
    res.json({ message: 'ลบงานสำเร็จ', deleted: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Auto-create table + seed ──────────────────────────────────────
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id          SERIAL PRIMARY KEY,
      title       VARCHAR(200) NOT NULL,
      status      VARCHAR(20)  NOT NULL DEFAULT 'todo',
      priority    VARCHAR(10)  NOT NULL DEFAULT 'medium',
      assignee    VARCHAR(100) DEFAULT '',
      due_date    DATE,
      description TEXT         DEFAULT '',
      created_at  TIMESTAMPTZ  DEFAULT NOW(),
      updated_at  TIMESTAMPTZ  DEFAULT NOW()
    )
  `);
  console.log('✅ Table tasks ready');

  const { rows } = await pool.query('SELECT COUNT(*) FROM tasks');
  if (parseInt(rows[0].count) === 0) {
    await pool.query(`
      INSERT INTO tasks (title, status, priority, assignee, due_date, description) VALUES
      ('ออกแบบ UI สำหรับ Dashboard',   'in-progress', 'high',   'ปิยะ',   '2026-06-30', 'ออกแบบ layout หน้า Dashboard หลัก ให้แสดงสถิติงานได้ชัดเจน'),
      ('เขียน API endpoint /tasks',     'done',        'high',   'สมชาย', '2026-06-10', 'RESTful API สำหรับจัดการ tasks ครบ CRUD'),
      ('เขียน Unit Test (Jest)',         'todo',        'high',   'ปิยะ',   '2026-07-05', 'เขียน Jest test ให้ได้ coverage ≥ 60%'),
      ('ติดตั้ง Docker Compose',        'done',        'medium', 'มานะ',   '2026-06-08', 'ตั้งค่า docker-compose.yml และ .env'),
      ('สร้าง CI Pipeline',             'in-progress', 'high',   'สมชาย', '2026-07-03', 'สร้าง GitHub Actions workflow: lint → test → build'),
      ('เขียน README.md',               'todo',        'low',    'มานะ',   '2026-07-10', 'เอกสารวิธีติดตั้งและใช้งานระบบ'),
      ('Review PR: feature/auth-module','todo',        'medium', 'สมชาย', '2026-07-01', 'ตรวจสอบ code และ comment ใน PR'),
      ('แก้ Bug: Token หมดอายุเร็ว',   'in-progress', 'high',   'ปิยะ',   '2026-06-28', 'Session timeout 5 นาทีทั้งที่ตั้งค่า 1 ชั่วโมง'),
      ('อัปเดต Packages (npm audit)',   'todo',        'low',    'มานะ',   '2026-07-15', 'npm audit fix + upgrade major versions'),
      ('Deploy ขึ้น Production Server', 'todo',        'medium', 'สมชาย', '2026-07-08', 'Deploy บน VPS ด้วย docker-compose.prod.yml')
    `);
    console.log('🌱 Seed data inserted (10 tasks)');
  }
}

// รัน server เฉพาะเมื่อ execute โดยตรง (ไม่ใช่ require จาก test)
if (require.main === module) {
  initDb()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 TaskFlow API v${process.env.APP_VERSION || '1.0.0'} running at http://localhost:${PORT}`);
      });
    })
    .catch(err => {
      console.error('❌ DB init failed:', err.message);
      process.exit(1);
    });
}

module.exports = app;
