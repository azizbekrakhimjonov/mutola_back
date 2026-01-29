import uuid
from django.db import models


class Book(models.Model):
    id = models.CharField(primary_key=True, max_length=36, editable=False)
    title = models.CharField(max_length=500)
    author = models.CharField(max_length=300)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=100, default="Badiiy")
    cover = models.ImageField(upload_to="covers/", blank=True, null=True)
    pdf_file = models.FileField(upload_to="pdfs/", blank=True, null=True)
    pages = models.PositiveIntegerField(default=0)
    published_year = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = str(uuid.uuid4())
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
