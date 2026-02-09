# Build va Deploy — Mutola.uz

## 1. Frontend build

```bash
npm run build
```

Bu `dist/` papkasini yaratadi (index.html, JS, CSS va boshqa static fayllar).

## 2. Serverga yuklash

**dist/** va **backend/** papkalarini serverga yuklang. Qaysi yo‘ldan foydalanish server konfigiga bog‘liq:

- Agar **deploy/mutola.uz.nginx** ishlatilsa: `/root/mk/mutola_back/`
- Agar **DEPLOY-mutola.uz.md** bo‘yicha: `/var/www/mutola.uz/`

### Misol (scp yoki rsync):

```bash
# dist va backend ni serverga
scp -r dist backend user@mutola.uz:/root/mk/mutola_back/
# yoki
rsync -avz dist/ user@mutola.uz:/root/mk/mutola_back/dist/
rsync -avz backend/ user@mutola.uz:/root/mk/mutola_back/backend/
```

## 3. Backend — o‘zgarishlardan keyin

```bash
# Serverda
cd /root/mk/mutola_back/backend
source venv/bin/activate   # yoki .\venv\Scripts\activate (Windows)
python manage.py migrate   # yangi migrationlar bo‘lsa
python manage.py collectstatic --noinput   # agar Django static ishlatilsa
sudo systemctl restart mutola
```

## 4. Natija

| Yo‘l | Server orqali |
|------|----------------|
| `/` | Nginx → `dist/index.html` (React) |
| `/api/` | Nginx → Gunicorn (Django) |
| `/media/` | Nginx → Gunicorn (Django media) |

**Xulosa:** Frontendni `npm run build` qilgandan keyin `dist/` va `backend/` ni serverga yuklash va `migrate` + `restart mutola` qilish kifoya. Backendni oddiy tarzda yuklash mumkin.
