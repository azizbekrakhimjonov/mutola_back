# News jadvalini yaratish (no such table: news_news xatosini bartaraf etish)

`no such table: news_news` xatosi — News modeli uchun jadval hali yaratilmaganligini bildiradi.

## Yechim

Backend papkasida quyidagi buyruqni ishga tushiring:

```bash
cd backend
python manage.py migrate
```

Agar virtual environment (venv) ishlatayotgan bo'lsangiz:

```bash
cd backend
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

python manage.py migrate
```

Serverda (mutola.uz) deploy qilgan bo'lsangiz:

```bash
cd /root/mk/mutola_back/backend
python manage.py migrate
# yoki
/home/ubuntu/mutola_back/backend uchun
```

Migratsiya muvaffaqiyatli bajargach, "Applying news.0001_initial... OK" xabari chiqadi va yangiliklar qo'shish ishlaydi.
