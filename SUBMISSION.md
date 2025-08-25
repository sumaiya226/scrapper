# Submission — Openbiz Udyam Steps 1 & 2

## What I built
- **Scraper** to infer fields from Udyam Step 1 (Aadhaar + OTP) and Step 2 (PAN) into a **JSON schema**.
- **Mobile-first React** frontend with dynamic form rendering and real-time validation.
- **Express API** validating with the same schema and storing valid submissions in **Postgres** via **Prisma**.
- **Unit tests** verifying validation and API error handling.
- **Dockerized** for instant spin-up.

## How to run
See the main README for one-command Docker setup or local steps.

## Assumptions
- OTP is mocked for the purpose of the demo (use `BYPASS_OTP`).
- Only Step 1 & Step 2 are implemented as per assignment.
- PAN & Aadhaar validation uses regex; checksum can be added later.

## What’s included
- Code + tests + schema + Docker.
- Optional scraper to regenerate schema if needed.
