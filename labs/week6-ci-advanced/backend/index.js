const express = require('express');
const cors    = require('cors');
const pool    = require('./db');
require('dotenv').config();

const app      = express();
const PORT     = process.env.PORT || 3001;
const START_AT = Date.now();

app.use(cors());
app.use(express.json());

// ── Health Check ──────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status:  'ok',
    service: 'StockPro API',
    version: process.env.APP_VERSION || '1.0.0',
    uptime:  Math.floor((Date.now() - START_AT) / 1000),
    timestamp: new Date(),
  });
});

// ── GET /api/stats ─────────────────────────────────────────────
app.get('/api/stats', async (req, res) => {
  try {
    const [overview, byCategory] = await Promise.all([
      pool.query(`
        SELECT
          COUNT(*)                                          AS total_products,
          SUM(stock)                                        AS total_stock,
          ROUND(SUM(price * stock), 2)                      AS total_value,
          COUNT(*) FILTER (WHERE stock = 0)                 AS out_of_stock,
          COUNT(*) FILTER (WHERE stock > 0 AND stock < 10)  AS low_stock
        FROM products
      `),
      pool.query(`
        SELECT
          category,
          COUNT(*)             AS products,
          SUM(stock)           AS total_stock,
          ROUND(SUM(price * stock), 2) AS total_value
        FROM products
        GROUP BY category
        ORDER BY total_value DESC
      `),
    ]);
    res.json({
      overview:    overview.rows[0],
      by_category: byCategory.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/products?search=&category= ───────────────────────
app.get('/api/products', async (req, res) => {
  try {
    const { search = '', category = '' } = req.query;
    const params = [];
    let where = 'WHERE 1=1';

    if (search) {
      params.push(`%${search}%`);
      where += ` AND (name ILIKE $${params.length} OR description ILIKE $${params.length})`;
    }
    if (category) {
      params.push(category);
      where += ` AND category = $${params.length}`;
    }

    const { rows } = await pool.query(
      `SELECT * FROM products ${where} ORDER BY created_at DESC`,
      params
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/categories ────────────────────────────────────────
app.get('/api/categories', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT DISTINCT category FROM products ORDER BY category'
    );
    res.json(rows.map(r => r.category));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/products/:id ──────────────────────────────────────
app.get('/api/products/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM products WHERE id = $1', [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'ไม่พบสินค้า' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/products ─────────────────────────────────────────
app.post('/api/products', async (req, res) => {
  try {
    const { name, category, price, stock, description = '' } = req.body;
    if (!name || !category || price == null || stock == null) {
      return res.status(400).json({ error: 'กรุณาระบุ name, category, price, stock' });
    }
    if (isNaN(price) || isNaN(stock)) {
      return res.status(400).json({ error: 'price และ stock ต้องเป็นตัวเลข' });
    }
    const { rows } = await pool.query(
      `INSERT INTO products (name, category, price, stock, description)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name.trim(), category.trim(), parseFloat(price), parseInt(stock), description.trim()]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PUT /api/products/:id ──────────────────────────────────────
app.put('/api/products/:id', async (req, res) => {
  try {
    const { name, category, price, stock, description = '' } = req.body;
    const { rows } = await pool.query(
      `UPDATE products
       SET name=$1, category=$2, price=$3, stock=$4, description=$5, updated_at=NOW()
       WHERE id=$6 RETURNING *`,
      [name, category, parseFloat(price), parseInt(stock), description, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'ไม่พบสินค้า' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /api/products/:id ───────────────────────────────────
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'DELETE FROM products WHERE id=$1 RETURNING *', [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'ไม่พบสินค้า' });
    res.json({ message: 'ลบสินค้าสำเร็จ', deleted: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Auto-create table + seed ──────────────────────────────────
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(150) NOT NULL,
      category    VARCHAR(80)  NOT NULL,
      price       NUMERIC(12,2) NOT NULL DEFAULT 0,
      stock       INTEGER      NOT NULL DEFAULT 0,
      description TEXT         DEFAULT '',
      created_at  TIMESTAMPTZ  DEFAULT NOW(),
      updated_at  TIMESTAMPTZ  DEFAULT NOW()
    )
  `);
  console.log('✅ Table products ready');

  const { rows } = await pool.query('SELECT COUNT(*) FROM products');
  if (parseInt(rows[0].count) === 0) {
    await pool.query(`
      INSERT INTO products (name, category, price, stock, description) VALUES
      ('MacBook Air M3',        'Electronics', 44900, 15, 'Apple MacBook Air chip M3 RAM 8GB'),
      ('iPhone 16 Pro',         'Electronics', 42900,  8, 'Apple iPhone 16 Pro 256GB'),
      ('Nike Air Max 270',      'Footwear',     4590, 32, 'รองเท้าวิ่ง Nike ไซส์ 38-45'),
      ('เสื้อยืด Uniqlo Dry-Ex','Clothing',      390, 87, 'เสื้อยืดระบายอากาศ สีขาว'),
      ('กล้อง Sony ZV-E10 II',  'Electronics', 24990,  4, 'กล้อง Mirrorless สำหรับ Vlogger'),
      ('หูฟัง AirPods Pro 2',    'Electronics', 9490, 20, 'หูฟัง True Wireless ANC'),
      ('โต๊ะทำงาน Flexispot E7','Furniture',   18900,  3, 'โต๊ะปรับระดับไฟฟ้า 140x70 cm'),
      ('กระเป๋า Anello',        'Bags',         1290, 45, 'กระเป๋าเป้ผ้า Canvas ทรงสี่เหลี่ยม'),
      ('หนังสือ Clean Code',    'Books',         650, 12, 'โดย Robert C. Martin — ฉบับภาษาอังกฤษ'),
      ('สายชาร์จ USB-C 100W',   'Accessories',  390,  6, 'สายชาร์จ 2 เมตร รองรับ PD 100W')
    `);
    console.log('🌱 Seed data inserted (10 products)');
  }
}

if (require.main === module) {
  initDb()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 StockPro API v${process.env.APP_VERSION || '1.0.0'} running at http://localhost:${PORT}`);
      });
    })
    .catch(err => {
      console.error('❌ DB init failed:', err.message);
      process.exit(1);
    });
}

module.exports = app;
