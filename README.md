# Udyam (Scraper)

[![Docker Ready](https://img.shields.io/badge/Docker-Ready-blue)](#) [![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](#) [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](#) [![Prisma](https://img.shields.io/badge/Prisma-ORM-orange)](#)

This is a complete end-to-end implementation of **Udyam Registration Steps 1 & 2**, featuring:

* **Web Scraper** (Puppeteer) to extract Step 1 (Aadhaar + OTP) & Step 2 (PAN) form fields from Udyam's website.
* **React (Vite + TypeScript + Tailwind)** frontend rendering forms dynamically from JSON schema.
* **Express + TypeScript + Zod** backend with full validation.
* **PostgreSQL (Prisma)** for persistence.
* **Unit tests** (Jest + Supertest) for backend routes.
* **Docker Compose** for one-command spin-up of API, web, and DB.

OTP is mocked for demo purposes (`BYPASS_OTP` in `.env`). Aadhaar, OTP, and PAN use regex validation (checksum can be added later).

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start with Docker](#quick-start-with-docker)
3. [Run Locally (Without Docker)](#run-locally-without-docker)
4. [Scraper](#scraper)
5. [Validation Rules](#validation-rules)
6. [Project Structure](#project-structure)
7. [Next Steps](#next-steps)

---

## Prerequisites

* Node.js **18+**
* Docker Desktop (recommended) or a local PostgreSQL instance
* pnpm (preferred) / npm / yarn

---

## Quick Start with Docker

```bash
# 1. Clone repo
git clone <your-repo-url>
cd openbiz-udyam-assignment

# 2. Copy env files
cp apps/api/.env.example apps/api/.env
cp prisma/.env.example prisma/.env

# 3. Build & start stack
docker compose up --build
```

**Access:**

* Web app → [http://localhost:5173](http://localhost:5173)
* API → [http://localhost:4000](http://localhost:4000)
* Postgres → `localhost:5432` (user: `postgres`, password: `postgres`, db: `openbiz`)

Prisma migrations run automatically when the API starts.

---

## Run Locally (Without Docker)

**1. Start Postgres**

```bash
docker run --name openbiz-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=openbiz -p 5432:5432 -d postgres:16
```

Or use your own Postgres instance and update `prisma/.env`.

**2. Start API**

```bash
cd apps/api
cp .env.example .env
pnpm install
pnpm prisma:generate
pnpm prisma:migrate
dpnm dev
```

**3. Start Web**

```bash
cd apps/web
pnpm install
pnpm dev
```

**Access:**

* Web → [http://localhost:5173](http://localhost:5173)
* API → [http://localhost:4000](http://localhost:4000)

---

## Scraper

The scraper (`scraper/scrape_udyam.ts`) uses Puppeteer to pull live Udyam form fields for Step 1 & Step 2. It outputs `schema/udyam_steps.json`, which the frontend and backend consume.

Run:

```bash
pnpm -w install
pnpm -w scrape
```

If the site changes or blocks scraping, a fallback schema is already included.

---

## Validation Rules

| Field   | Regex                        |
| ------- | ---------------------------- |
| Aadhaar | `^\d{12}$`                   |
| OTP     | `^\d{6}$`                    |
| PAN     | `^[A-Z]{5}[0-9]{4}[A-Z]{1}$` |

OTP is mocked via `BYPASS_OTP` in `apps/api/.env` (default: `123456`).

---

## Project Structure

```
openbiz-udyam-assignment/
├─ apps/
│  ├─ api/        # Express + TS + Prisma + Zod
│  └─ web/        # React (Vite) + TS + Tailwind
├─ prisma/        # Prisma schema & migrations
├─ schema/        # JSON schema shared between web & api
├─ scraper/       # Puppeteer scraper script
├─ tests/         # Backend tests
├─ docker-compose.yml
├─ SUBMISSION.md
└─ README.md
```

---

