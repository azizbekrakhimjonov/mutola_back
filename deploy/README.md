# Serverga nusxalash

**Sozlama:** port **7511**, loyiha yo‘li **/root/mk/mutola_back/**  
Sayt: **http://mutola.uz:7511**

## 1. Systemd service (Gunicorn)

```bash
# static va media papkalari (Gunicorn yozishi uchun)
mkdir -p /root/mk/mutola_back/static /root/mk/mutola_back/media

sudo cp deploy/mutola.service /etc/systemd/system/mutola.service
sudo systemctl daemon-reload
sudo systemctl enable mutola
sudo systemctl start mutola
sudo systemctl status mutola
```

Backend: `/root/mk/mutola_back/backend`, Gunicorn: `127.0.0.1:8000`.

**Agar "Worker failed to boot" xatosi chiqsa**, to‘liq traceback ni ko‘ring:
```bash
sudo journalctl -u mutola -n 80 --no-pager
```
yoki
```bash
sudo journalctl -u mutola -f
```
Keyin `sudo systemctl restart mutola` qiling — xato odatda yuqorida (ImportError, ModuleNotFoundError, PermissionError) ko‘rinadi.

---

## 2. Nginx

```bash
sudo cp deploy/mutola.uz.nginx /etc/nginx/sites-available/mutola.uz
sudo ln -sf /etc/nginx/sites-available/mutola.uz /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Nginx **7511** da tinglaydi. Frontend: `/root/mk/mutola_back/dist`, static: `/root/mk/mutola_back/static/`.

---

## 3. SSL (Let's Encrypt)

```bash
sudo certbot --nginx -d mutola.uz -d www.mutola.uz
sudo systemctl reload nginx
```
