# StockPro — Week 5: CI Pipeline

[![CI](https://github.com/YOUR_USERNAME/stockpro/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/stockpro/actions/workflows/ci.yml)
[![CD](https://github.com/YOUR_USERNAME/stockpro/actions/workflows/cd.yml/badge.svg)](https://github.com/YOUR_USERNAME/stockpro/actions/workflows/cd.yml)

ระบบจัดการสินค้าคงคลัง พร้อม CI Pipeline ที่สมบูรณ์

## สิ่งที่เพิ่มมาใน Week 5

| สิ่งใหม่ | รายละเอียด |
|----------|-----------|
| Unit Tests (Jest) | ≥8 test cases ใน 3 ไฟล์ (health, products, stats) |
| Code Coverage | ≥60% lines/functions, HTML report |
| ESLint Config | .eslintrc.json พร้อม rules ที่ตั้งไว้ |
| CI Workflow 3 Jobs | lint → test (coverage) → build (sequential) |
| Coverage Artifact | Upload ไปเก็บใน GitHub Actions 7 วัน |
| Branch Protection | PR ต้องผ่าน Lint + Test ก่อน merge |

## รัน tests บนเครื่อง

```bash
cd backend
npm install
npm test              # รัน tests + coverage
npm run lint          # รัน ESLint
npm run test:watch    # watch mode สำหรับ development
```

## โครงสร้างไฟล์

```
stockpro/
├── .github/
│   └── workflows/
│       ├── ci.yml          ← 3 jobs: lint → test → build
│       └── cd.yml          ← build + push + deploy (เหมือน Week 4)
├── backend/
│   ├── index.js            ← API + module.exports สำหรับ test
│   ├── db.js
│   ├── jest.config.js      ← Jest config + coverage threshold 60%
│   ├── .eslintrc.json      ← ESLint rules
│   ├── package.json        ← เพิ่ม jest, supertest
│   ├── tests/
│   │   ├── health.test.js  ← GET /health (3 tests)
│   │   ├── products.test.js← GET/POST /api/products (3 tests)
│   │   └── stats.test.js   ← validation + GET /api/stats (3 tests)
│   └── Dockerfile
├── frontend/               ← Vue 3 + Vite (ไม่เปลี่ยนจาก Week 4)
├── docker-compose.yml
└── docker-compose.prod.yml
```

## CI Pipeline

```
Push/PR → 🔍 Lint → 🧪 Test + Coverage → 🐳 Docker Build
```

- **Lint job**: ESLint ทุก .js ใน backend/
- **Test job**: Jest --coverage, ต้องผ่าน threshold ≥60%, upload coverage artifact
- **Build job**: docker build (smoke test, ไม่ push)

## รันด้วย Docker Compose

```bash
cp backend/.env.example backend/.env
docker compose up -d
```

เปิด http://localhost เพื่อดู StockPro
