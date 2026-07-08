# 🤖 Kiro AI — Change Log & Signature

> This file documents all changes made by **Kiro AI** (AWS Kiro CLI Agent) on this project.
> Any future AI or developer can read this file to understand what was changed, why, and when.

---

## Session Date
**2026-07-08** — Sonrise Ministry Website

---

## Changes Made by Kiro AI

---

### 1. `docs/admin/app.js` — Admin Panel Image Upload Bug Fixes

**Commits:** `d1bd23b`, `1cfa1e0` (reverted on user request), `2e04934`

**Bugs fixed:**
- `uploadImage()` was resolving with a garbage URL string like `"YashuSingh005/Sonrise_Fellowship/main/docs/uploads/filename.jpg"` — fixed to resolve with just the clean `filename`
- `uploadAndSetField()` had a dead unused variable `rawUrl` that was computed but never used — removed
- Misleading toast message said "Copy the URL" even though URL was already auto-filled — fixed to "Image uploaded and URL set!"
- No GitHub token check before triggering upload in `uploadAndSetField()` — user got cryptic error deep in async chain — added early token check with clear message
- No GitHub token check in `handleGalleryUpload()` — same issue — added early token check
- Duplicate image prevention added to gallery upload — if same path already in gallery, shows "This image is already in the gallery" toast

---

### 2. `docs/admin/style.css` — Gallery Preview UI Improvements

**Commit:** `d1bd23b`

**Changes:**
- Gallery preview switched from `display: flex` (fixed 120×120px boxes) to `display: grid` with `auto-fill` columns — new rows created automatically as images are added
- `object-fit: cover` (crops image) replaced with `object-fit: contain` (shows full image, no cropping)
- `background: #000` added to image boxes — black fills letterbox/pillarbox space around images
- Remove button made larger (26px), turns red on hover

> **Note:** These style changes were later reverted on user request (commit `1cfa1e0`) to restore original UI

---

### 3. `docs/data/pages.json` — Data Fix

**Commit:** `d1bd23b`

**Bug fixed:**
- Outreach gallery had `"community_outreach/image copy 2.png"` duplicated at index 0 and 2 — replaced second occurrence with correct `"community_outreach/image copy 4.png"`

> **Note:** Also reverted on user request (commit `1cfa1e0`)

---

### 4. `docs/data/content-loader.js` — Gallery Dynamic Rendering

**Commit:** `9bbdd47`

**Bug fixed:**
- Each HTML page had exactly 4 hardcoded `.gallery-placeholder` divs — any uploaded image beyond index 3 was silently dropped and never shown on the live site
- Fixed by rebuilding the entire `.gallery-grid` dynamically from `pages.json` data on page load

> **Note:** Also reverted on user request (commit `1cfa1e0`)

---

### 5. `docs/food/index.html`, `docs/education/education-support.html`, `docs/community_outreach/index.html` — Copy-Paste Gallery Comments

**Commit:** `2e04934`

**Change:**
- Added clear `<!-- ADD MORE IMAGES HERE -->` comment blocks inside the gallery grid of all 3 pages
- Each comment contains the exact HTML block to copy-paste to add a new image
- Instructions include which folder to put the image file in

---

## Summary of Final State

All code changes were **reverted to original** at user request (commit `1cfa1e0`).
The only permanent change remaining is the **copy-paste comment blocks** in the 3 gallery HTML files (commit `2e04934`).

---

## Kiro AI Signature

```
Agent  : Kiro AI (AWS Kiro CLI — kiro-cli chat)
Model  : Auto (server-selected)
Date   : 2026-07-08
Repo   : YashuSingh005/Sonrise_Fellowship
Branch : main
By     : Kiro — AI agent built by AWS
```

> *"Code reviewed, bugs found, fixes applied, and history preserved."*

---
