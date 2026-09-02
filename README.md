<div align="center">

<!-- KeyScope Banner -->
<p align="center">
  <img src="https://img.shields.io/badge/KeyScope-API%20Model%20Detector-%2322C55E?style=for-the-badge&labelColor=%230F172A" alt="KeyScope">
</p>

# 🔑 KeyScope

**Lihat semua model AI yang tersembunyi di balik sebuah API key — dalam hitungan detik.**

Tempel API key, pilih provider, klik **Deteksi**. KeyScope memanggil endpoint `/models` dan mengelompokkan model yang bisa kamu akses secara otomatis: LLM utama, embedding, dan lainnya.

<br>

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge&logo=opensourceinitiative&logoColor=white)](LICENSE)
[![Static](https://img.shields.io/badge/Stack-ClientSide%20%2B%20Serverless-%230F172A?style=for-the-badge&logo=javascript&logoColor=%23F8FAFC)](#)
[![Made with ❤️](https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F-%23EF4444?style=for-the-badge&logo=heart&logoColor=white)](#)

</div>

<br>

## ✨ Fitur Utama

| Fitur | Dampak |
|-------|--------|
| ⚡ **Deteksi instan** | Panggil `/models` sekali dan dapatkan seluruh daftar model yang terhubung |
| 🗂 **Kelompok otomatis** | LLM utama · Embedding · Lainnya — dipisah agar mudah dipindai |
| 🔐 **Privat & aman** | Key hanya lewat dari browser → serverless function → provider, tidak pernah tersimpan |
| 🖱 **Klik untuk salin** | Satu klik menyalin nama model lengkap |
| 🌐 **12+ provider siap pakai** | OpenAI hingga LiteLLM proxy + URL kustom bebas |
| 🧯 **Error yang jelas** | Key invalid, tanpa izin, rate limit, endpoint hilang — semua diterjemahkan |

<br>

## 🌍 Provider yang Didukung

KeyScope mendukung semua API **OpenAI-compatible**:

| Provider | Default Base URL |
|----------|------------------|
| **OpenAI** | `https://api.openai.com/v1` |
| **DeepSeek** | `https://api.deepseek.com/v1` |
| **Groq** | `https://api.groq.com/openai/v1` |
| **OpenRouter** | `https://openrouter.ai/api/v1` |
| **Together AI** | `https://api.together.xyz/v1` |
| **Mistral** | `https://api.mistral.ai/v1` |
| **Fireworks AI** | `https://api.fireworks.ai/inference/v1` |
| **Perplexity** | `https://api.perplexity.ai` |
| **xAI (Grok)** | `https://api.x.ai/v1` |
| **NVIDIA NIM** | `https://integrate.api.nvidia.com/v1` |
| **Anthropic** | `https://api.anthropic.com/v1` |
| **LiteLLM / Kustom** | URL bebas |

> Butuh provider lain? Gunakan mode **Kustom** dan masukkan Base URL apa pun yang mendukung `GET /models`.

<br>

## 🧠 Cara Kerja

```
┌──────────┐   POST /api/models   ┌────────────────────┐   Bearer key   ┌────────────────┐
│ Browser  │ ────────────────── ► │ Serverless Function │ ───────────── ► │   /models API  │
│   (UI)   │ ◄────────────────── │     (proxy CORS)    │ ◄─────────────  │   (provider)   │
└──────────┘    models[]         └────────────────────┘   200 + model   └────────────────┘
```

1. Browser mengirim `POST https://situs-mu.vercel.app/api/models` dengan `{ apiKey, baseUrl }`.
2. Serverless function menambah header `Authorization: Bearer <key>` lalu memanggil `<baseUrl>/models`.
3. Respons **dibersihkan** → array dari model IDs → dikirim balik ke UI.
4. UI mengelompokkan & merender model dalam kartu yang bisa disalin.

> Serverless function bertindak sebagai **proxy anti-CORS** — bukan server persistent, gratis di Vercel.

<br>

## 📦 Struktur Repo

```
keyscope/
├── 📄 index.html        # UI client-side (HTML/CSS/JS murni, tanpa framework)
├── ⚙️ api/models.js     # Vercel serverless function (proxy ke /models)
├── 📋 vercel.json       # Konfigurasi build: static + node function
├── 📖 README.md         # Kamu di sini
└── 🔒 .gitignore
```

<br>

## 🚀 Deploy dalam 60 Detik

### Opsi A — Import dari GitHub (disarankan)

1. Push repo ini ke GitHub.
2. Buka **[vercel.com/new](https://vercel.com/new)** → pilih **Import** repo `keyscope`.
3. Framework preset: **Other** (tidak perlu build command).
4. Klik **Deploy**. Selesai. 🎉

### Opsi B — Via CLI

```bash
npm i -g vercel
vercel            # ikuti prompt, pilih default
vercel --prod
```

<br>

## 🔌 API Reference

### `POST /api/models`

Proxy yang memanggil endpoint `/models` milik provider.

**Body:**
```json
{
  "apiKey": "sk-...",
  "baseUrl": "https://api.openai.com/v1"
}
```

**Respons sukses (200):**
```json
{
  "models": ["gpt-3.5-turbo", "gpt-4o", "gpt-4o-mini", "text-embedding-3-small"],
  "count": 4
}
```

**Respons error (200 + field `error`):** key invalid, tanpa izin, rate limit, atau endpoint tidak ditemukan — semuanya memakai pesan yang ramah.

> Error dikembalikan dengan status `200` agar UI bisa menampilkan pesannya dengan rapi.

<br>

## 🧯 Pemecahan Masalah

### 🔠 Nama model tampil hitam / susah dibaca

Chip model adalah elemen `<button>`, dan browser memakai warna teks **hitam default** jika tidak diberi warna eksplisit di atas kartu gelap. Perbaikan: pastikan `color` di-set terang pada `.model-chip`, `.model-chip .name`, dan `.model-chip .copy`.

```css
.model-chip{ background:var(--color-muted); color:var(--color-foreground); }
.model-chip .name{ color:var(--color-foreground); }
.model-chip .copy{ color:var(--color-muted-foreground); }
```

> Pertahankan kontras ≥ 4.5:1 (`--color-foreground:#F8FAFC` di atas `--color-muted:#272F42`) agar mudah dibaca di dark mode.

### 🌐 Provider panel (New API / one-api) tidak muncul model

Gateway seperti **kktoken.cc** (panel New API) punya API di path **`/v1`**, sedangkan KeyScope otomatis menambah `/models` di belakang Base URL. Karena itu:

| Salah (tidak muncul) | Benar (muncul) |
|---|---|
| `https://kktoken.cc` → jadi `/models` (isinya HTML dashboard) | `https://kktoken.cc/v1` → jadi `/v1/models` ✅ |
| `https://kktoken.cc/models` → 404 / HTML | |

**Fix:** di dropdown pilih **Kustom**, lalu isi Base URL lengkap dengan `/v1`:
```
https://kktoken.cc/v1
```
Cara cepat verifikasi key benar: `curl -H "Authorization: Bearer <key>" https://<host>/v1/models` → harus mengembalikan JSON berisi `data` model.

### 🔧 Base URL di KeyScope

- Provider preset (OpenAI, DeepSeek, Groq, dst.) sudah otomatis menyertakan `/v1`.
- Panel gateway yang diisi manual (Kustom) **wajib menyertakan `/v1`** kecuali base URL-nya sudah berakhiran `/models`.

### 🚫 `/api/models` mengembalikan halaman 404

Artinya serverless function tidak terdaftar. Gunakan konfigurasi Vercel **zero-config** (tanpa blok `builds` legacy) supaya folder `api/` otomatis terdeteksi sebagai function:

```json
{
  "functions": { "api/models.js": { "maxDuration": 30 } }
}
```

<br>

## 🛠 Tech Stack

- **Frontend:** HTML5 + CSS3 murni (desain Dark Mode OLED, font *JetBrains Mono*)
- **Backend:** Vercel Serverless Function (Node.js runtime, zero-dependency)
- **Hosting:** Vercel (static + serverless)

<br>

## 📝 Lisensi

Proyek ini dilisensikan di bawah **MIT License**. Silakan pakai, modifikasi, dan kembangkan.

---

<div align="center">

**KeyScope** — *"Satu klik untuk lihat semua model yang terhubung dengan API key-mu."*

[Report Bug](https://github.com/ywildan/keyscope/issues) · [Request Feature](https://github.com/ywildan/keyscope/issues)

</div>