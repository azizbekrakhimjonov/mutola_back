# Mutola — kitoblar va onlayn o‘qish

Veb-ilova: kitoblar katalogi, PDF orqali onlayn o‘qish, Dashboard orqali kitob qo‘shish/o‘chirish, yangiliklar bo‘limi. Kitoblar serverda (SQLite) saqlanadi, barcha tashrif buyuruvchilar bir xil ro‘yxatni ko‘radi.

---

## Loyiha strukturasi (Code structure)

```
mutola_back/
├── index.html              # SPA kirish fayli
├── package.json            # Skriptlar, dependencies
├── vite.config.ts          # Vite: port 8080, /api → localhost:3000 proxy
├── tsconfig.json           # TypeScript sozlari
├── tailwind.config.ts      # Tailwind CSS
├── public/                 # Static: favicon, robots.txt
├── server/                 # Backend (Node.js + Express)
│   ├── index.js            # API + (ixtiyoriy) dist static
│   ├── db.js               # SQLite (sql.js), kitoblar jadvali
│   └── mutola.sqlite       # DB fayl (serverda hosil bo‘ladi, .gitignore da)
├── src/
│   ├── main.tsx            # React kirish nuqtasi
│   ├── App.tsx             # Routlar: /, /login, /dashboard, 404
│   ├── index.css           # Global stillar
│   ├── components/         # UI komponentlar
│   │   ├── BookCard.tsx
│   │   ├── BookDetail.tsx
│   │   ├── BookGrid.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── Header.tsx      # Nav: Bosh sahifa, Yangiliklar, Kirish/Dashboard, Chiqish
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── NewsSection.tsx # Yangiliklar bo‘limi (#yangiliklar)
│   │   ├── PDFViewer.tsx   # Onlayn o‘qish: Blob URL, embed, “Yangi oynada ochish”
│   │   ├── ProtectedRoute.tsx
│   │   ├── SearchBar.tsx
│   │   └── ui/             # shadcn/ui (button, card, input, dialog, …)
│   ├── contexts/
│   │   └── AuthContext.tsx # login/logout, sessiya (localStorage, 7 kun)
│   ├── data/
│   │   ├── books.ts        # Book tipi, categories — static ma’lumot yo‘q
│   │   └── news.ts         # Yangiliklar ro‘yxati
│   ├── lib/
│   │   ├── auth.ts         # mk / mk123 tekshiruvi
│   │   ├── bookStorage.ts  # API (GET/POST/DELETE /api/books) + fallback IndexedDB
│   │   └── utils.ts
│   └── pages/
│       ├── Index.tsx       # Bosh sahifa: kitoblar, qidiruv, kategoriya, yangiliklar
│       ├── Login.tsx       # Kirish (username mk, password mk123)
│       ├── Dashboard.tsx  # Himoyalangan: kitob qo‘shish/o‘chirish
│       └── NotFound.tsx
└── dist/                   # npm run build dan chiqadi (production frontend)
```

### Asosiy fayllar vazifasi

| Fayl / papka | Vazifa |
|--------------|--------|
| `server/index.js` | Express: `/api/books` (GET/POST/DELETE), CORS; `SERVE_STATIC !== "0"` bo‘lsa `dist/` ni static beradi. |
| `server/db.js` | sql.js orqali `server/mutola.sqlite` — `books` jadvali, CRUD. |
| `src/lib/bookStorage.ts` | Avval `GET /api/books`; xato/offline bo‘lsa IndexedDB. Qo‘shish/o‘chirish ham avval API. |
| `src/lib/auth.ts` | `mk` / `mk123` tekshiruvi, sessiya localStorage da. |
| `src/contexts/AuthContext.tsx` | Auth holati, `login`/`logout`. |
| `src/components/ProtectedRoute.tsx` | `/dashboard` uchun: kirish bo‘lmasa `/login` ga yo‘naltiradi. |
| `src/components/PDFViewer.tsx` | Base64 PDF → Blob URL → `<embed>`, “Yangi oynada ochish”, yuklab olish. |
| `vite.config.ts` | Dev da `/api` so‘rovlari `http://localhost:3000` ga proxy. |

---

## Texnologiyalar

- **Frontend:** React 18, TypeScript, Vite, React Router, Tailwind CSS, shadcn/ui, react-pdf / pdf.js
- **Backend:** Node.js, Express, CORS
- **Ma’lumotlar bazasi:** sql.js (SQLite, fayl: `server/mutola.sqlite`)
- **Auth:** Sessiya localStorage da (7 kun), login: **mk** / **mk123**

---

## Loyihani ishga tushirish

### Dependencies o‘rnatish

```bash
npm install
```

### Lokal development (frontend + backend)

**1-terminal — backend (API + SQLite):**

```bash
npm run server
```

Server `http://localhost:3000` da ishlaydi, `/api/books` ishlatiladi.  
`server/mutola.sqlite` birinchi so‘rovda yoki kitob qo‘shilganda yaratiladi.

**2-terminal — frontend (Vite):**

```bash
npm run dev
```

Brauzerda `http://localhost:8080`. `/api` so‘rovlari Vite proxy orqali `localhost:3000` ga boradi.

### Production — bitta serverni ishlatish (dist + API)

```bash
npm run build
npm run server
```

Yoki bir qatorda:

```bash
npm run start
```

`dist/` loyiha ichida bo‘lsa, Express ham static fayllarni, ham `/api/books` ni beradi. Port: **3000** (yoki `PORT` o‘zgaruvchisi).

---

## Deploy — mutola.uz, serverda /var/www/mutola.uz

Sizda server bor va **dist** ni **/var/www/mutola.uz** ga joylashtiryapsiz. Ikkita qulay variant.

---

### Variant A: Static Nginx da (/var/www/mutola.uz), API — alohida Node

Static fayllar faqat Nginx orqali, API esa bitta Node jarayonida. Bu sizning “dist ni /var/www/mutola.uz ga joylash” uslubbingizga to‘g‘ri keladi.

**1. Loyihani build qilish (lokal yoki CI)**

```bash
npm install
npm run build
```

**2. `dist/` ichidagi barcha narsani serverdagi www papkaga yuborish**

Masalan, lokal mashinadan:

```bash
scp -r dist/* user@SERVER_IP:/var/www/mutola.uz/
```

yoki rsync:

```bash
rsync -avz dist/ user@SERVER_IP:/var/www/mutola.uz/
```

**3. Backendni serverda joylash va faqat API rejimida ishlatish**

Loyihaning to‘liq nusxasi (yoki faqat `server/` + `package.json` va kerakli modullar) serverda bo‘lsin, masalan `/var/www/mutola-back` yoki `/opt/mutola`.  
API **static bermasligi** uchun muhit o‘zgaruvchisi:

```bash
cd /var/www/mutola-back   # yoki loyiha joylashgan papka
npm install --production
export SERVE_STATIC=0
export PORT=3000
node server/index.js
```

Doimiy ishlashi uchun **systemd** xizmati (masalan `/etc/systemd/system/mutola-api.service`):

```ini
[Unit]
Description=Mutola API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/mutola-back
Environment="NODE_ENV=production"
Environment="SERVE_STATIC=0"
Environment="PORT=3000"
ExecStart=/usr/bin/node server/index.js
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

So‘ng:

```bash
sudo systemctl daemon-reload
sudo systemctl enable mutola-api
sudo systemctl start mutola-api
sudo systemctl status mutola-api
```

**4. Nginx: static papka va /api proxy**

Domen **mutola.uz** bo‘lsin, document root **/var/www/mutola.uz**.

`/etc/nginx/sites-available/mutola.uz` (yoki default ni o‘rniga):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name mutola.uz www.mutola.uz;

    root /var/www/mutola.uz;
    index index.html;
    try_files $uri $uri/ /index.html;

    location /api {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Aktivlashtirish va tekshirish:

```bash
sudo ln -sf /etc/nginx/sites-available/mutola.uz /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Natija:
- **https://mutola.uz** (yoki http) — `/var/www/mutola.uz` dagi `dist` fayllari.
- **https://mutola.uz/api/books** — Node (port 3000) ga proxy.

**5. SQLite fayli va huquqlar**

Kitoblar `server/mutola.sqlite` da saqlanadi. Papka yozilishi kerak:

```bash
sudo chown -R www-data:www-data /var/www/mutola-back
# Agar db boshqa joyda bo‘lsa, shu path uchun ham yozish huquqi bering
```

---

### Variant B: Hammasi Node da (Nginx faqat reverse proxy)

Loyiha serverda bir joyda (masalan `/var/www/mutola-back`), Nginx barcha so‘rovlarni Node ga yuboradi. **dist** Node ichida xizmat qiladi, `/var/www/mutola.uz` dan foydalanmasiz.

**1. Serverda loyiha**

```bash
git clone <REPO_URL> /var/www/mutola-back
cd /var/www/mutola-back
npm install
npm run build
```

**2. Node ni ishga tushirish (static + API)**

```bash
export PORT=3000
node server/index.js
```

yoki `npm run server`. `SERVE_STATIC` bermasangiz, default holda `dist/` ham beriladi.

**3. systemd**

```ini
[Unit]
Description=Mutola (frontend + API)
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/mutola-back
Environment="NODE_ENV=production"
Environment="PORT=3000"
ExecStart=/usr/bin/node server/index.js
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

**4. Nginx — barcha trafikni Node ga**

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name mutola.uz www.mutola.uz;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Bu variantda **dist** ni /var/www/mutola.uz ga alohida joylash shart emas; hammasi Node orqali.

---

## Muhim environment o‘zgaruvchilari

| O‘zgaruvchi | Qad. qiymat | Ma’nosi |
|-------------|-------------|---------|
| `PORT` | 3000 | Backend porti. |
| `SERVE_STATIC` | (yo‘q) | `"0"` bo‘lsa — faqat API, static Nginx dan beriladi (Variant A). |

---

## Login va himoya

- **Dashboard:** `/dashboard` — faqat kirish qilgan foydalanuvchi ko‘radi.
- **Login:** `/login` — **username** `mk`, **password** `mk123`.
- Sessiya 7 kun davomida localStorage da saqlanadi.

---

## Kitoblar qayerda saqlanadi

- **Backend ishlasa:** barcha kitoblar `server/mutola.sqlite` da, barcha foydalanuvchilar bir xil ro‘yxatni ko‘radi.
- **Backend ishlamasa (yoki /api mavjud emas):** frontend IndexedDB dan o‘qiydi — ma’lumotlar faqat shu brauzerda.

---

## Qisqa buyruqlar

```bash
npm install          # dependencies
npm run dev          # Vite dev server (8080), backend alohida
npm run server       # Faqat backend (3000), dist bo‘lsa static ham
npm run build       # dist/ yaratadi
npm run start       # build + server (dist + API bitta portda)
```

---

## Deploy xulosa (mutola.uz, /var/www/mutola.uz)

Siz “dist ni /var/www/mutola.uz ga joylashtirish” uslubida ishlasangiz:

1. **Build:** `npm run build` → `dist/`.
2. **Static:** `dist/*` → serverda **/var/www/mutola.uz**.
3. **Backend:** loyiha serverda (masalan `/var/www/mutola-back`), `SERVE_STATIC=0 PORT=3000 node server/index.js` (yoki systemd).
4. **Nginx:**  
   - `root /var/www/mutola.uz;`  
   - `try_files $uri $uri/ /index.html;`  
   - `location /api { proxy_pass http://127.0.0.1:3000; ... }`
5. **DB:** `server/mutola.sqlite` uchun www-data (yoki serverni ishlatadigan user) yozish huquqiga ega bo‘lsin.

Shu tartibda kod strukturasi va deploy sizning hozirgi kod va server sozlamalaringizga mos keladi.
