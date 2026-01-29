# Django Deploy — mutola.uz

---

## 1. Django sozlamalari va log papkasi

**`backend/config/settings.py`** da (yoki `.env` da) production uchun:

```python
ALLOWED_HOSTS = ['mutola.uz', 'www.mutola.uz']

CSRF_TRUSTED_ORIGINS = ['https://mutola.uz', 'https://www.mutola.uz']

STATIC_ROOT = '/var/www/mutola.uz/static/'
```

**Log papkasini yaratish:**

```bash
sudo mkdir -p /var/log/mutola.uz
```

---

## 2. Gunicorn (systemd)

```bash
pip install gunicorn
sudo nano /etc/systemd/system/mutola.service
```

**Tarkibi:**

```ini
[Unit]
Description=Gunicorn service for Django project (mutola_back)
After=network.target

[Service]
User=root
WorkingDirectory=/var/www/mutola.uz/backend
ExecStart=/var/www/mutola.uz/backend/venv/bin/gunicorn --workers 3 --bind 0.0.0.0:8000 config.wsgi:application
Restart=always

[Install]
WantedBy=multi-user.target
```

**Xizmatni yoqish:**

```bash
sudo systemctl daemon-reload
sudo systemctl enable mutola
sudo systemctl start mutola
sudo systemctl status mutola
```

**Eslatma:** Loyiha yo‘li sizda boshqacha bo‘lsa (masalan `/root/mutola_back/backend`), `WorkingDirectory` va `ExecStart` dagi `/var/www/mutola.uz/backend` ni o‘sha yo‘lga o‘zgartiring. `config.wsgi` — bu loyihadagi asosiy Django papka nomi (`backend/config/`).

---

## 3. Nginx

```bash
sudo nano /etc/nginx/sites-available/mutola.uz
```

**Variant A — faqat Django (API + admin):**

```nginx
server {
    server_name mutola.uz www.mutola.uz;
    client_max_body_size 50M;

    access_log /var/log/mutola.uz/access.log;
    error_log /var/log/mutola.uz/error.log;

    location /media/ {
        root /var/www/mutola.uz/;
    }

    location /static/ {
        root /var/www/mutola.uz/;
    }

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Variant B — Frontend (Vite dist) + Django API:**

Bitta domen da sayt (React) va API ishlashi uchun:

```nginx
server {
    server_name mutola.uz www.mutola.uz;
    client_max_body_size 50M;

    access_log /var/log/mutola.uz/access.log;
    error_log /var/log/mutola.uz/error.log;

    root /var/www/mutola.uz/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /media/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
    }

    location /static/ {
        root /var/www/mutola.uz/;
    }
}
```

Loyiha ildizida `npm run build` qiling, `dist/` ni serverga `/var/www/mutola.uz/dist/` ga yuklang.

**Eslatma:** Gunicorn porti 8000 bo‘lsa `proxy_pass http://localhost:8000;`. Boshqa port (masalan 7517) bo‘lsa, systemd va Nginx da bir xil portdan foydalaning.

---

## 4. Nginx ulash, SSL, tekshirish

```bash
sudo ln -s /etc/nginx/sites-available/mutola.uz /etc/nginx/sites-enabled
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d mutola.uz -d www.mutola.uz

sudo nginx -t
sudo systemctl reload nginx
sudo systemctl restart mutola.service
```

---

## 5. Serverda bir marta

- Loyiha: `/var/www/mutola.uz/` (backend papkasi: `/var/www/mutola.uz/backend`).
- Backend: `venv`, `manage.py`, `config/`, `books/` shu yerda bo‘ladi.
- Frontend (Variant B bo‘lsa): loyiha ildizida `npm run build` qiling, `dist/` ni serverga `/var/www/mutola.uz/dist/` ga yuklang.
