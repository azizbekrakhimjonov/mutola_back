# Generated manually for News app

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="News",
            fields=[
                ("id", models.CharField(editable=False, max_length=36, primary_key=True, serialize=False)),
                ("title", models.CharField(max_length=500)),
                ("summary", models.TextField()),
                ("date", models.DateField()),
                ("image", models.ImageField(blank=True, null=True, upload_to="news/")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "verbose_name": "Yangilik",
                "verbose_name_plural": "Yangiliklar",
                "ordering": ["-date", "-created_at"],
            },
        ),
    ]
