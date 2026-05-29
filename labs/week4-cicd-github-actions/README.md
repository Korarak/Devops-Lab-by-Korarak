# StockPro — ระบบจัดการสินค้าคงคลัง

![CI](https://github.com/YOUR-USERNAME/stockpro/actions/workflows/ci.yml/badge.svg)
![CD](https://github.com/YOUR-USERNAME/stockpro/actions/workflows/cd.yml/badge.svg)

ระบบจัดการสินค้าคงคลัง (Inventory Management System) พัฒนาด้วย Vue 3 + Express + PostgreSQL  
ออกแบบให้ deploy ด้วย Docker และ CI/CD ผ่าน GitHub Actions

## Tech Stack

| Layer    | Technology              |
|----------|-------------------------|
| Frontend | Vue 3 + Vite + Nginx    |
| Backend  | Node.js + Express       |
| Database | PostgreSQL 16           |
| CI/CD    | GitHub Actions          |
| Registry | Docker Private Registry |

## Quick Start (Local)

```bash
docker compose up -d
```

เปิด http://localhost

## API Endpoints

| Method | Path              | Description              |
|--------|-------------------|--------------------------|
| GET    | /health           | Health check + version   |
| GET    | /api/stats        | Dashboard summary        |
| GET    | /api/products     | List products (filterable)|
| POST   | /api/products     | Add product              |
| PUT    | /api/products/:id | Update product           |
| DELETE | /api/products/:id | Delete product           |

## CI/CD Pipeline

```
feature/* ──push──► CI (lint + build + docker build)
                        │
                       PR
                        │
develop ────────────────►
                        │
                       PR
                        │
main ───────────────────► CD (build + push registry + deploy via SSH)
```

## GitHub Secrets Required

| Secret         | Description                    |
|----------------|--------------------------------|
| REGISTRY_URL   | URL ของ Private Docker Registry |
| REGISTRY_USER  | Username สำหรับ login registry  |
| REGISTRY_PASS  | Password สำหรับ login registry  |
| SERVER_HOST    | IP ของ server ที่ deploy        |
| SERVER_USER    | SSH username                   |
| SERVER_SSH_KEY | SSH private key (PEM format)   |
