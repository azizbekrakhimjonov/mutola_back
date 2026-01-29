# Mutola — Django backend

Kitoblar API (GET/POST/DELETE). Dashboard dan qo‘shilgan kitoblar barcha foydalanuvchilar uchun ko‘rinadi.

## Mahalliy ishga tushirish

1. Virtual muhit va o‘rnatish (Windows):

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

2. Migratsiya va superuser (ixtiyoriy — admin uchun):

```bash
python manage.py migrate
python manage.py createsuperuser
```

3. Serverni ishga tushiring:

```bash
python manage.py runserver
```

API: `http://localhost:8000/api/books/`  
Admin: `http://localhost:8000/admin/`

## Frontend bilan birga

1. Bir terminalda Django: `cd backend && python manage.py runserver`
2. Ikkinchi terminalda Vite: `npm run dev`
3. Brauzerda: `http://localhost:8080` — Vite `/api` va `/media` ni `http://localhost:8000` ga proxy qiladi.

## Serverga deploy (misol: Linux + Gunicorn + Nginx)

### 1. Loyihani serverga yuklash

Git orqali yoki fayllarni nusxalang.

### 2. Python muhiti

```bash
cd /var/www/mutola/backend   # yoki loyiha yo‘lingiz
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn
```

### 3. Migratsiya va statik/media

```bash
export DJANGO_DEBUG=0
export DJANGO_SECRET_KEY="uzun-va-xavfsiz-maxfiy-kalit"
python manage.py migrate
python manage.py collectstatic --noinput
```

### 4. Gunicorn (systemd)

`/etc/systemd/system/mutola.service`:

```ini
[Unit]
Description=Mutola Django
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/mutola/backend
Environment="PATH=/var/www/mutola/backend/venv/bin"
Environment="DJANGO_SETTINGS_MODULE=config.settings"
Environment="DJANGO_DEBUG=0"
Environment="DJANGO_SECRET_KEY=your-secret-key"
Environment="ALLOWED_HOSTS=yourdomain.com"
Environment="CORS_ORIGINS=https://yourdomain.com"
ExecStart=/var/www/mutola/backend/venv/bin/gunicorn --bind 127.0.0.1:8000 config.wsgi:application
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable mutola
sudo systemctl start mutola
```

### 5. Nginx

- Frontend: build qilingan `dist/` ni Nginx static qiladi.
- API va media: proxy qilingan Django (Gunicorn).

Misol `/etc/nginx/sites-available/mutola`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/mutola/dist;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 100M;
    }
    location /media/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
    }
}
```

`client_max_body_size 100M` — katta PDF/muqova yuklash uchun.

### 6. Muhit o‘zgaruvchilari (production)

- `DJANGO_DEBUG=0`
- `DJANGO_SECRET_KEY` — kuchli kalit
- `ALLOWED_HOSTS=yourdomain.com`
- `CORS_ORIGINS=https://yourdomain.com` (frontend manzili)

## API

| Method | URL | Tavsif |
|--------|-----|--------|
| GET | `/api/books/` | Barcha kitoblar (barchada ko‘rinadi) |
| POST | `/api/books/` | Yangi kitob (multipart: title, author, description, category, pages, publishedYear, cover, pdf) |
| DELETE | `/api/books/<id>/` | Kitobni o‘chirish |
