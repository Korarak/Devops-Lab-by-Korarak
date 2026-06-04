# StockPro — Week 6: CI Advanced: Quality Gate + Build Image

[![CI Advanced](https://github.com/YOUR_USERNAME/stockpro/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/stockpro/actions/workflows/ci.yml)
[![CD](https://github.com/YOUR_USERNAME/stockpro/actions/workflows/cd.yml/badge.svg)](https://github.com/YOUR_USERNAME/stockpro/actions/workflows/cd.yml)
[![Quality Gate Status](https://sonarqube.YOUR_DOMAIN/api/project_badges/measure?project=stockpro&metric=alert_status)](https://sonarqube.YOUR_DOMAIN/dashboard?id=stockpro)
[![Coverage](https://sonarqube.YOUR_DOMAIN/api/project_badges/measure?project=stockpro&metric=coverage)](https://sonarqube.YOUR_DOMAIN/dashboard?id=stockpro)

ระบบจัดการสินค้าคงคลัง พร้อม CI Pipeline ขั้นสูง: SonarQube Quality Gate + Docker Build & Push

## สิ่งที่เพิ่มมาใน Week 6

| สิ่งใหม่ | รายละเอียด |
|----------|-----------|
| SonarQube Scan Job | ใช้ `SonarSource/sonarqube-scan-action@v3` |
| Quality Gate Check | `SonarSource/sonarqube-quality-gate-action@v1` — fail CI ถ้าไม่ผ่าน |
| sonar-project.properties | Config file สำหรับ SonarQube scanner |
| Docker Build & Push | ใช้ `docker/build-push-action@v5` พร้อม BuildKit cache |
| Image Tagging | `sha-<short_sha>` + `latest` ทุก push ถึง main/develop |
| Conditional Step | build-push Job รันเฉพาะ branch main หรือ develop |
| 4-Job Pipeline | lint → test → sonar → build-push (sequential) |

## GitHub Secrets ที่ต้องตั้ง

| Secret | ค่าตัวอย่าง | ใช้ที่ Job |
|--------|------------|-----------|
| `SONAR_TOKEN` | `squ_xxxxxxxxxxxx` | sonar |
| `SONAR_HOST_URL` | `http://sonarqube.lab:9000` | sonar |
| `REGISTRY_URL` | `registry.lab:5000` | build-push, deploy |
| `REGISTRY_USER` | `admin` | build-push, deploy |
| `REGISTRY_PASS` | `password` | build-push, deploy |
| `SERVER_HOST` | `10.0.0.X` | deploy (CD) |
| `SERVER_USER` | `devops` | deploy (CD) |
| `SERVER_SSH_KEY` | `-----BEGIN...` | deploy (CD) |

## CI Pipeline

```
Push/PR → 🔍 Lint → 🧪 Test + Coverage → 🔬 SonarQube → 🐳 Build & Push
                                          Quality Gate ↓
                                          PASS → Push Image
                                          FAIL → Pipeline Blocked ❌
```

## รัน tests บนเครื่อง

```bash
cd backend
npm install
npm test              # รัน tests + coverage
npm run lint          # รัน ESLint
```

## โครงสร้างไฟล์

```
stockpro/
├── .github/workflows/
│   ├── ci.yml          ← 4 jobs: lint → test → sonar → build-push
│   └── cd.yml          ← Release build + SSH deploy
├── backend/
│   ├── index.js
│   ├── db.js
│   ├── jest.config.js
│   ├── .eslintrc.json
│   ├── sonar-project.properties  ← NEW: SonarQube config
│   ├── package.json
│   ├── tests/
│   │   ├── health.test.js
│   │   ├── products.test.js
│   │   └── stats.test.js
│   └── Dockerfile
├── frontend/               ← Vue 3 + Vite (ไม่เปลี่ยน)
├── docker-compose.yml
└── docker-compose.prod.yml
```

## รันด้วย Docker Compose

```bash
cp backend/.env.example backend/.env
docker compose up -d
```

เปิด http://localhost เพื่อดู StockPro
