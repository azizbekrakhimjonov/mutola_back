# Django Deploy — mutola.uz

---

## Muammo: "Page not found (404)" yoki Django sahifa ko‘rinadi

Agar **https://mutola.uz/** ochilganda Django 404 yoki debug sahifa chiqsa — trafik **Nginx** o‘rniga to‘g‘ridan-to‘g‘ri **Gunicorn** ga borayapti. Quyidagilarni tekshiring:

1. **mutola.uz** server IP ga yo‘naltirilgan bo‘lishi kerak (A record).
2. **Nginx** 80/443 portlarda ishlashi va **birinchi** trafikni qabul qilishi kerak.
3. Nginx konfigida **root** = frontend **dist** papkasi, **location /** = `try_files` (dist), **location /api/** va **/media/** = proxy Gunicorn ga.

**Hozir qilish kerak (qisqa):**

1. Serverda Nginx konfigini **Variant B** ga o‘zgartiring (bosh sahifa = `root .../dist`, `location /` = `try_files`, `/api/` va `/media/` = proxy Gunicorn ga).
2. `dist` papkasi mavjudligini tekshiring: `ls /var/www/mutola.uz/dist/index.html`
3. `sudo nginx -t` → `sudo systemctl reload nginx`
4. Brauzerda **https://mutola.uz** ni yangilang (Ctrl+F5).

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

**Kitob qo‘shishda 500 (Internal Server Error):** Ko‘pincha **media** papkasi yo‘q yoki Gunicorn ishlatadigan foydalanuvchi (masalan `root`) uchun yozish huquqi yo‘q. Serverda bajarish:

```bash
cd /var/www/mutola.uz/backend
mkdir -p media/covers media/pdfs
chmod -R 755 media
# Agar Gunicorn boshqa user (www-data) da ishlasa:
# sudo chown -R www-data:www-data media
```

Keyin `sudo systemctl restart mutola`. Xato davom etsa: `sudo journalctl -u mutola -n 50 --no-pager` — logda aniq sabab ko‘rinadi.

---

## 3. Nginx (muhim — bosh sahifa dist dan, API Django dan)

**mutola.uz** da bosh sahifa (React) va API birga ishlashi uchun faqat quyidagi konfigdan foydalaning:

```bash
sudo nano /etc/nginx/sites-available/mutola.uz
```

**To‘liq tarkib (shu konfigdan foydalaning):**

```nginx
server {
    listen 80;
    server_name mutola.uz www.mutola.uz;
    client_max_body_size 50M;

    access_log /var/log/mutola.uz/access.log;
    error_log /var/log/mutola.uz/error.log;

    # Bosh sahifa — frontend (Vite dist)
    root /var/www/mutola.uz/dist;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API va media — Django (Gunicorn)
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    location /media/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
    }
    location /static/ {
        alias /var/www/mutola.uz/static/;
    }
}
```

**Saqlang** (Ctrl+O, Enter, Ctrl+X), keyin:

```bash
sudo ln -sf /etc/nginx/sites-available/mutola.uz /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**Dist joyi:** Agar sizda `dist` boshqa joyda bo‘lsa (masalan `/var/www/mutola.uz/` ildizida emas, boshqa papkada), `root` ni o‘shanga o‘zgartiring, masalan: `root /var/www/mutola.uz/dist;` — bu papka ichida `index.html` bo‘lishi kerak.

Loyiha ildizida `npm run build` qiling, chiqqan `dist/` ni serverga `/var/www/mutola.uz/dist/` ga yuklang.

**Eslatma:** Gunicorn boshqa portda (masalan 7517) bo‘lsa, Nginx da ham `proxy_pass http://127.0.0.1:7517;` qiling.

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
