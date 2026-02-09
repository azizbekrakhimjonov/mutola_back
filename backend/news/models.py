import uuid
from django.db import models


class News(models.Model):
    id = models.CharField(primary_key=True, max_length=36, editable=False)
    title = models.CharField(max_length=500)
    summary = models.TextField()
    date = models.DateField()
    image = models.ImageField(upload_to="news/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date", "-created_at"]
        verbose_name = "Yangilik"
        verbose_name_plural = "Yangiliklar"

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = str(uuid.uuid4())
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
